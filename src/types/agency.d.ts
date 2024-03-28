declare namespace Agency {
  export interface Details {
    _id: string
    id: string
    status: string
    name: string
    memberships: string[]
    createdAt: string
    updatedAt: string
  }

  export interface GetListParams {
    key: string
    page: number
    limit: number
  }

  export interface UpdateParams {
    id: string
    status: string
    name: string
  }

  export interface CreateParams {
    id: string
    status: string
    name: string
    memberships: string[]
  }
}
