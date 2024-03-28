import jsPDF from 'jspdf'
import { MM_TO_PX } from 'constant'
import { ConversionOptions } from 'types'
import FinAwareLogo from 'assets/media/image/finaware-logo.png'

export default class Converter {
  pdf: InstanceType<typeof jsPDF>
  canvas: HTMLCanvasElement
  options: any
  constructor(canvas: HTMLCanvasElement, options: ConversionOptions) {
    this.canvas = canvas
    this.options = options
    this.pdf = new jsPDF({
      format: this.options.page.format,
      orientation: this.options.page.orientation,
      ...this.options.overrides?.pdf,
      unit: 'mm'
    })
  }
  getMarginTopMM() {
    const margin =
      typeof this.options.page.margin === 'object' ? this.options.page.margin.top : this.options.page.margin
    return Number(margin)
  }
  getMarginLeftMM() {
    const margin =
      typeof this.options.page.margin === 'object' ? this.options.page.margin.left : this.options.page.margin
    return Number(margin)
  }
  getMarginRightMM() {
    const margin =
      typeof this.options.page.margin === 'object' ? this.options.page.margin.right : this.options.page.margin
    return Number(margin)
  }
  getMarginBottomMM() {
    const margin =
      typeof this.options.page.margin === 'object' ? this.options.page.margin.bottom : this.options.page.margin
    return Number(margin)
  }
  getMarginTop() {
    return this.getMarginTopMM() * MM_TO_PX
  }
  getMarginBottom() {
    return this.getMarginBottomMM() * MM_TO_PX
  }
  getMarginLeft() {
    return this.getMarginLeftMM() * MM_TO_PX
  }
  getMarginRight() {
    return this.getMarginRightMM() * MM_TO_PX
  }
  getScale() {
    return this.options.resolution
  }
  getPageHeight() {
    return this.getPageHeightMM() * MM_TO_PX
  }
  getPageHeightMM() {
    return this.pdf.internal.pageSize.height
  }
  getPageWidthMM() {
    return this.pdf.internal.pageSize.width
  }
  getPageWidth() {
    return this.getPageWidthMM() * MM_TO_PX
  }
  getOriginalCanvasWidth() {
    return this.canvas.width / this.getScale()
  }
  getOriginalCanvasHeight() {
    return this.canvas.height / this.getScale()
  }
  getCanvasPageAvailableHeight() {
    return this.getPageAvailableHeight() * this.getScale() * this.getHorizontalFitFactor()
  }
  getPageAvailableWidth() {
    return this.getPageWidth() - (this.getMarginLeft() + this.getMarginRight())
  }
  getPageAvailableHeight() {
    return this.getPageHeight() - (this.getMarginTop() + this.getMarginBottom())
  }
  getPageAvailableWidthMM() {
    return this.getPageAvailableWidth() / MM_TO_PX
  }
  getPageAvailableHeightMM() {
    return this.getPageAvailableHeight() / MM_TO_PX
  }
  getNumberPages() {
    return Math.ceil(this.canvas.height / this.getCanvasPageAvailableHeight())
  }
  getHorizontalFitFactor() {
    if (this.getPageAvailableWidth() < this.getOriginalCanvasWidth()) {
      return this.getOriginalCanvasWidth() / this.getPageAvailableWidth()
    }
    return 1
  }
  getCanvasOffsetY(pageNumber: number) {
    return this.getCanvasPageAvailableHeight() * (pageNumber - 1)
  }
  getCanvasHeightLeft(pageNumber: number) {
    return this.canvas.height - this.getCanvasOffsetY(pageNumber)
  }
  getCanvasPageHeight(pageNumber: number) {
    if (this.canvas.height < this.getCanvasPageAvailableHeight()) {
      return this.canvas.height
    }
    const canvasHeightPending = this.getCanvasHeightLeft(pageNumber)
    return canvasHeightPending < this.getCanvasPageAvailableHeight()
      ? canvasHeightPending
      : this.getCanvasPageAvailableHeight()
  }
  getCanvasPageWidth() {
    return this.canvas.width
  }
  createCanvasPage(pageNumber: number): HTMLCanvasElement {
    const canvasPageWidth = this.getCanvasPageWidth()
    const canvasPageHeight = this.getCanvasPageHeight(pageNumber)
    const canvasPage = document.createElement('canvas')
    canvasPage.setAttribute('width', String(canvasPageWidth))
    canvasPage.setAttribute('height', String(canvasPageHeight))
    const ctx: any = canvasPage.getContext('2d')
    ctx.drawImage(
      this.canvas,
      0,
      this.getCanvasOffsetY(pageNumber),
      this.canvas.width,
      canvasPageHeight,
      0,
      0,
      this.canvas.width,
      canvasPageHeight
    )
    return canvasPage
  }
  convert(agencyName = ''): InstanceType<typeof jsPDF> {
    let pageNumber = 1
    const numberPages = this.getNumberPages()
    while (pageNumber <= numberPages) {
      if (pageNumber > 1) {
        this.pdf.addPage(this.options.page.format, this.options.page.orientation)
      }
      const canvasPage = this.createCanvasPage(pageNumber)
      const pageImageDataURL = canvasPage.toDataURL(this.options.canvas.mimeType, this.options.canvas.qualityRatio)
      this.pdf.setPage(pageNumber)

      this.pdf.addImage({
        imageData: pageImageDataURL,
        width: canvasPage.width / (this.getScale() * MM_TO_PX * this.getHorizontalFitFactor()),
        height: canvasPage.height / (this.getScale() * MM_TO_PX * this.getHorizontalFitFactor()),
        x: this.getMarginLeftMM(),
        y: this.getMarginTopMM()
      })

      this.pdf.addImage({
        imageData: FinAwareLogo,
        width: 53,
        height: 25,
        x: this.getPageWidthMM() - 58,
        y: this.getPageHeightMM() - 33
      })
      if (!!agencyName?.length) {
        this.pdf.setFontSize(9)
        this.pdf.text(`${agencyName}`, this.getPageWidthMM() - 46, this.getPageHeightMM() - 10)
      }

      const date = new Intl.DateTimeFormat('en-US', {
        dateStyle: 'short',
        timeStyle: 'short'
      }).format(new Date())
      this.pdf.setFontSize(8)
      this.pdf.text(`${date}`, this.getPageWidthMM() - 43, this.getPageHeightMM() - (!!agencyName?.length ? 5 : 10))
      pageNumber += 1
    }
    return this.pdf
  }
}
