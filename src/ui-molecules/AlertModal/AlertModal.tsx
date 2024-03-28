import { Modal } from 'flowbite-react'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { toast } from 'react-toastify'
import { Button, IconSvg } from 'ui-atoms'

const AlertModal = forwardRef((props: any, ref: any) => {
  const configDefault: AlertModal.Options = {
    title: 'Notification',
    content: '',
    isShowTwoButton: false,
    confirmButton: {
      label: 'OK',
      className: '',
      action: () => {
        //
      }
    },
    cancelButton: {
      label: 'Cancel',
      className: '',
      action: () => {
        //
      }
    }
  }
  const [openModal, setOpenModal] = useState<string | undefined>()
  const modalProps = { openModal, setOpenModal }
  const [configs, SetConfigs] = useState<AlertModal.Options>(configDefault)

  useImperativeHandle(ref, () => ({
    open(configs: AlertModal.Options | null = null) {
      showPopup(configs)
    },
    close() {
      hidePopup()
    }
  }))

  const showPopup = (configs: AlertModal.Options | null = null) => {
    SetConfigs({
      ...configDefault,
      ...configs
    })
    modalProps.setOpenModal('show')
  }

  const hidePopup = () => {
    modalProps.setOpenModal(undefined)
  }

  return (
    <>
      <Modal
        size={'lg'}
        show={modalProps.openModal === 'show'}
        popup
        onClose={() => modalProps.setOpenModal(undefined)}
      >
        <div className='flex items-center justify-between rounded-t dark:border-gray-600 border-b p-5'>
          <h3 id=':rl:' className='text-xl font-bold text-wt-primary-40'>
            {configs?.title || 'Notification'}
          </h3>
          <button
            aria-label='Close'
            className='ml-auto inline-flex items-center justify-center rounded-full bg-wt-primary-75 p-1 text-sm text-white hover:bg-wt-primary-40 hover:text-white'
            type='button'
            onClick={() => hidePopup()}
          >
            <IconSvg className='h-3 w-3' icon='closeModal' />
          </button>
        </div>
        <Modal.Body className='p-6 flex-1 overflow-auto'>
          <div className='text-left'>
            <p className='text-base font-semibold text-gray-900 dark:text-gray-400'>{configs.content || ''}</p>
          </div>
        </Modal.Body>
        <Modal.Footer className='border-t py-4 px-4'>
          <Button
            className={
              configs.confirmButton.className
                ? configs.confirmButton.className
                : 'flex items-center btn bg-red-500 hover:bg-red-600 py-3 rounded-lg font-bold text-white ml-auto'
            }
            type='button'
            onClick={() => {
              configs.confirmButton?.action && configs.confirmButton?.action()
              modalProps.setOpenModal(undefined)
            }}
          >
            {configs.confirmButton.label || 'OK'}
          </Button>
          {configs.isShowTwoButton ? (
            <Button
              className={
                configs.cancelButton.className
                  ? configs.cancelButton.className
                  : 'btn btn-secondary py-3 bg-wt-primary-75 hover:bg-gray-400 font-bold text-white rounded-lg px-5'
              }
              type='button'
              onClick={() => {
                configs.cancelButton?.action && configs.cancelButton?.action()
                modalProps.setOpenModal(undefined)
              }}
            >
              {configs.cancelButton.label || 'Cancel'}
            </Button>
          ) : (
            ''
          )}
        </Modal.Footer>
      </Modal>
    </>
  )
})

export default AlertModal
