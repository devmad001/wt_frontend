import Message from 'constant/Message'
import { UpdateOptions, toast } from 'react-toastify'

export class ToastControl {
  public static toastLoading(msg: any = 'Please wait...'): string | number {
    return toast.loading(msg, {
      position: 'top-center'
    })
  }

  public static toastUpdate(id: any, options: UpdateOptions): void {
    toast.update(id, {
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      ...options
    })
  }

  public static toastUpdateSuccess(id: any, msg: any): void {
    toast.update(id, {
      render: msg,
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      type: 'success',
      isLoading: false
    })
  }

  public static toastUpdateError(id: any, err: any): void {
    toast.update(id, {
      render: err?.message?.toString() || Message.DEFAULT_ERR_MSG,
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      type: 'error',
      isLoading: false
    })
  }

  public static showErrorMessage(err: any): void {
    console.log(err)
    toast.error(err?.message?.toString() || err?.toString() || Message.DEFAULT_ERR_MSG, {
      position: 'top-center',
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined
    })
  }

  public static showSuccessMessage(msg: string): void {
    toast.success(msg, {
      position: 'top-center',
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined
    })
  }
}
