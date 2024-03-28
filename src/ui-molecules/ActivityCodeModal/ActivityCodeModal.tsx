import { Modal } from 'flowbite-react'
import { forwardRef, useImperativeHandle, useState, useEffect } from 'react'
import { Button, IconSvg } from 'ui-atoms'
import addIcon from 'assets/media/image/activity-code.png'
import { ToastControl } from 'utils/toast'
import { getUserInfo } from 'utils'

const ActivityCodeModal = forwardRef((props: any, ref: any) => {
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [userInfo, setUserInfo] = useState<User.Details>()
  const [showCode, setShowCode] = useState(true)

  useEffect(() => {
    setUserInfo(getUserInfo())
  }, [])

  useImperativeHandle(ref, () => ({
    showModal
  }))

  const showModal = () => {
    setOpenModal(true)
  }

  const hideModal = () => {
    setOpenModal(false)
  }

  const copyActivationCodeToClipBoard = (value: string) => {
    navigator.clipboard.writeText(value)
    ToastControl.showSuccessMessage('Copied activation code to clipboard')
  }

  return (
    <>
      <Modal show={openModal} size={'xl'} id='addLibraryModal' onClose={() => hideModal()}>
        <div className='flex items-center rounded-t dark:border-gray-600 border-b p-4'>
          <img src={addIcon} />
          <h3 className='text-lg font-bold text-wt-primary-40 dark:text-white ml-2 mb-0'>Your Activity Code</h3>
          <button
            aria-label='Close'
            className='ml-auto inline-flex items-center p-1'
            type='button'
            onClick={() => hideModal()}
          >
            <IconSvg icon='closeModalCircle' />
          </button>
        </div>
        <Modal.Body className='p-4'>
          <div
            className='w-full flex items-center p-2 px-4 mt-3 bg-white border border-dashed border-wt-primary-90 text-gray-900 rounded-lg'
            role='none'
          >
            <div className='flex-1'>
              <label className='w-full text-wt-primary-40 text-sm font-bold'>
                {showCode ? userInfo?.agency?._id : '************************'}
              </label>
            </div>
            <span className='cursor-pointer' onClick={() => copyActivationCodeToClipBoard(userInfo?.agency?._id || '')}>
              <IconSvg icon='documentCopy' />
            </span>
            <span className='cursor-pointer block ml-2.5' onClick={() => setShowCode(!showCode)}>
              <IconSvg icon={showCode ? 'showPassIcon' : 'hidePassIcon'} />
            </span>
          </div>
          <p className='text-wt-primary-40 text-xs mt-2.5 font-normal'>
            Copy this code for inviting new Users or Admins
          </p>
        </Modal.Body>
        <Modal.Footer className='py-3'>
          <div className='flex items-center justify-end w-full'>
            <div>
              <Button
                className='text-white text-sm font-semibold h-10 px-5 bg-wt-primary-75 hover:bg-wt-primary-75/80 rounded-md'
                type='button'
                onClick={() => hideModal()}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  )
})

export default ActivityCodeModal
