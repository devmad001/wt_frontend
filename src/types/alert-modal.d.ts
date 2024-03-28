declare namespace AlertModal {
  export interface Options {
    title?: string
    content?: string
    isShowTwoButton?: boolean
    confirmButton: {
      label?: string
      className?: string
      action?: (...args: any) => void
    }
    cancelButton: {
      label?: string
      className?: string
      action?: (...args: any) => void
    }
  }
}
