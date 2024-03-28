import { MimeTypeByExtension } from 'constant/FileFormat'

export class Media {
  public static getExtensionFile(fileName: string): string {
    const lowerCaseFileName = fileName.toLocaleLowerCase()
    const arrSplit = lowerCaseFileName.split('.')
    const lastSplit = arrSplit.length > 1 ? arrSplit[arrSplit.length - 1] : ''

    return lastSplit
  }

  public static validateFileFormat(blob: any, fileName: string, fileType: string, allowMimeType: string[]): boolean {
    if (!blob || !fileName || !fileType || !allowMimeType) return false

    const extensionFile = this.getExtensionFile(fileName)
    if (!extensionFile) return false

    const mimeTypeWithExtenstion: any = MimeTypeByExtension[extensionFile] || null

    if (mimeTypeWithExtenstion) {
      const isExtensionOfMimeType = mimeTypeWithExtenstion?.includes(fileType)
      const isAllowMimeType = allowMimeType.includes(fileType)
      return isExtensionOfMimeType && isAllowMimeType
    } else {
      return allowMimeType?.includes(fileType)
    }
  }
}
