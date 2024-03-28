import { Options } from 'react-to-pdf'
import html2canvas from 'html2canvas'
import { ConversionOptions } from 'types'
import { DEFAULT_OPTIONS } from 'constant'
import Converter from './converter'

const getTargetElement = (targetRefOrFunction: any): HTMLElement | null | undefined => {
  if (typeof targetRefOrFunction === 'function') {
    return targetRefOrFunction()
  }
  return targetRefOrFunction?.current
}

const buildConvertOptions = (options?: Options): ConversionOptions => {
  if (!options) {
    return DEFAULT_OPTIONS
  }
  return {
    ...DEFAULT_OPTIONS,
    ...options,
    canvas: { ...DEFAULT_OPTIONS.canvas, ...options.canvas },
    page: { ...DEFAULT_OPTIONS.page, ...options.page }
  }
}

export const generatePDF = async (targetRefOrFunction: any, customOptions?: Options, agencyName = '') => {
  const options = buildConvertOptions(customOptions)
  const targetElement = getTargetElement(targetRefOrFunction)
  if (!targetElement) {
    console.error('Unable to get the target element.')
    return
  }
  const canvas = await html2canvas(targetElement, {
    useCORS: options?.canvas.useCORS,
    logging: options?.canvas.logging,
    scale: options?.resolution,
    ...options?.overrides?.canvas
  })
  const converter = new Converter(canvas, options)
  const pdf = converter.convert()
  switch (options?.method) {
    case 'build':
      return pdf
    case 'open': {
      window.open(pdf.output('bloburl'), '_blank')
      return pdf
    }
    case 'save':
    default: {
      const pdfFilename = options.filename ?? `${new Date().getTime()}.pdf`
      await pdf.save(pdfFilename, { returnPromise: true })
      return pdf
    }
  }
}
