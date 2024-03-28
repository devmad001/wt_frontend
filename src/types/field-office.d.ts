declare namespace FieldOffice {
  export interface GetListParams {
    key: string
    page: number
    limit: number
    agency?: string
  }

  export interface UpdateParams {
    id: string
    name: string
    alphaCode: string
    status: string
  }

  export interface CreateParams {
    id: string
    name: string
    alphaCode: string
    status: string
    agency: string
  }
}
