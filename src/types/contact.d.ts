declare namespace Contact {
  export interface Details {
    _id: string
    fullName: string
    email: string
    status: string
    requestId: string
    selected?: boolean
    privateGroup?: string
    isTyping?: boolean | undefined
  }

  export interface FindParams {
    key?: string
    page?: number
    limit?: number
  }

  export interface PendingParams {
    key?: string
    page?: number
    limit?: number
  }

  export interface MyContactsParams {
    key?: string
    page?: number
    limit?: number
  }

  export interface RequestContactParams {
    friendId: string
  }

  export interface RejectContactParams {
    friendId: string
  }

  export interface ApproveContactParams {
    friendId: string
  }
}
