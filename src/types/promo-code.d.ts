declare namespace PromoCode {
  export interface Details {
    _id: string
    code: string
    limit: number
    expiresAt: string
    createdAt: string
    updatedAt: string
  }

  export interface CreateNewParams {
    code: string
    limit: number
    expiresAt: string
  }

  export interface EditParams {
    code: string
    limit: number
    expiresAt: string
  }

  export interface ListParams {
    key: string
    page: number
    limit: number
  }
}
