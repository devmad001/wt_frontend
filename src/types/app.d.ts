declare namespace App {
  export interface Callback {
    onSuccess?: (...args: any) => void
    onFailure?: (...args: any) => void
    onFinish?: (...args: any) => void
  }

  export type RequestCallback = (token: string) => Promise<void>

  export interface ReactSelectOptions {
    value: any
    label: any
    [key: string]: any
  }

  export interface PageInfor {
    page: number
    limit?: number
    totalPage?: number
    totalItems?: number
  }
}

declare module 'payment'
