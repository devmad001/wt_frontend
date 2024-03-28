import { Modal } from 'flowbite-react'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { Button, IconSvg } from 'ui-atoms'
import { ToastControl } from 'utils/toast'
import { useUserManagement } from 'hooks'
import AuthHelper from 'constant/AuthHelper'

const RejectModal = forwardRef((props: any, ref: any) => {
  const userManagementHook = useUserManagement()
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [userDetail, setUserDetail] = useState<any>(null)

  useImperativeHandle(ref, () => ({
    showModal,
    setUserDetail
  }))

  const showModal = () => {
    setOpenModal(true)
  }

  const hideModal = () => {
    setOpenModal(false)
  }

  const rejectUser = async (): Promise<void> => {
    setIsSubmitting(true)
    userManagementHook.rejectUserById({
      id: userDetail?._id,
      callback: {
        onSuccess: (res) => {
          if (props?.reloadPage) {
            props?.reloadPage()
          }
          setIsSubmitting(false)
          hideModal()
        },
        onFailure: (err) => {
          ToastControl.showErrorMessage(err)
          setIsSubmitting(false)
        },
        onFinish: () => {
          //
        }
      }
    })
  }

  return (
    <>
      <Modal show={openModal} size={'xl'} id='addLibraryModal' onClose={() => (!isSubmitting ? hideModal() : null)}>
        <div className='flex items-center rounded-t dark:border-gray-600 border-b p-4'>
          <IconSvg icon='rejectModal' />
          <h3 className='text-lg font-bold text-wt-primary-40 dark:text-white ml-2 mb-0'>{`Reject ${
            userDetail?.role == AuthHelper.RoleType.SUPER_ADMIN
              ? 'Super Admin'
              : userDetail?.role == AuthHelper.RoleType.ADMIN
              ? 'Admin'
              : userDetail?.role == AuthHelper.RoleType.USER
              ? 'User'
              : ''
          } request`}</h3>
          <button
            aria-label='Close'
            className='ml-auto inline-flex items-center p-1'
            type='button'
            onClick={() => hideModal()}
          >
            <IconSvg icon='closeModalCircle' />
          </button>
        </div>
        <Modal.Body className='px-4 py-6'>
          <p className='text-sm font-semibold text-wt-primary-120 mb-4'>
            Are you sure you want to reject this request?
          </p>
          {/* <div className='bg-wt-primary-110 p-4'>
            <p className='text-wt-primary-40 text-lg font-bold'>{userDetail?.agency?.name}</p>
            <p className='text-sm font-semibold text-wt-primary-120'>
              <span className='text-wt-primary-40'>by </span> {userDetail?.fullName}
            </p>
          </div> */}
        </Modal.Body>
        <Modal.Footer className='py-3'>
          <div className='flex items-center justify-end w-full'>
            <div>
              <Button
                className='text-white text-sm font-semibold h-10 px-5 bg-wt-primary-75 hover:bg-wt-primary-75/80 rounded-md'
                type='button'
                disabled={isSubmitting}
                onClick={hideModal}
              >
                Cancel
              </Button>
            </div>
            <div>
              <Button
                className='text-white text-sm font-bold h-10 px-5 bg-wt-red-1 hover:bg-wt-red-1/80 rounded-md flex items-center ml-2'
                type='button'
                isLoading={isSubmitting}
                onClick={rejectUser}
              >
                <IconSvg icon='rejectButton' />
                <span className='ml-2'>Reject</span>
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  )
})

export default RejectModal
