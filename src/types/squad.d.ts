declare namespace Squad {
  export interface GetListParams {
    key: string
    page: number
    limit: number
    agency?: string
    fieldOffice?: string
  }

  export interface UpdateParams {
    status: string
    id: string
    name: string
  }

  export interface CreateParams {
    status: string
    id: string
    name: string
    fieldOffice: string
    agency?: string
  }
}
