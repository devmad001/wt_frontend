declare namespace Subpoena {
  export interface Details {
    _id: string
    caseFileNumber: string
    createdAt: string
    description: string
    md5: string
    mimetype: string
    name: string
    originalName: string
    publicCorruptionTag: string
    size: number
    status: string
    threatTagging: string
    totalMonths: number
    totalPages: number
    updatedAt: string
    user: string
    _v: number
    statements?: Statement[]
    trackingNumber: string
    usaoOrderDate: string
    usaoNumber: string
    bankName: string
    agent: string
    returnDate: string
    limitPay: string
    requestorName: string
    requestorPhoneNumber: string
    requestedDate: string
    url?: string
    caseId?: string
  }

  export interface Statement {
    _id: string
    file: string
    accountNumber: string
    accountName: string
    pages: string
    dateFrom: string
    dateTo: string
    createdAt: string
    updatedAt: string
  }

  export interface CreateParams {
    requestId: string
    originalName?: string
    size?: number
    caseFileNumber?: string
    threatTagging: string
    publicCorruptionTag: string
    description: string
    uploadedObjects?: { id: string; originalName: string }[]
  }

  export interface UpdateParams {
    caseFileNumber?: string
    threatTagging: string
    publicCorruptionTag: string
    description: string
    trackingNumber: string
    usaoOrderDate: string
    usaoNumber: string
    bankName: string
    agent: string
    returnDate: string
    limitPay: string
    requestorName: string
    requestorPhoneNumber: string
    requestedDate: string
  }

  export interface ListParams {
    key: string
    page: string | number
    limit: string | number
    status: string
    archived?: boolean
  }

  export interface StatementParams {
    key: string
    page: string | number
    limit: string | number
  }
}
