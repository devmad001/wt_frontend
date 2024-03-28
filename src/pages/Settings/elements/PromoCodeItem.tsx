import moment from 'moment'
import { useEffect, useRef, useState } from 'react'
import { IconSvg, Spinner } from 'ui-atoms'
import { WtDocumentEdit, WtTrash } from 'ui-atoms/Icons'
import { ToastControl } from 'utils/toast'
import { AlertModal } from 'ui-molecules'
import { usePromoCode } from 'hooks'
import { EditPromoCode } from '.'

function PromoCodeItem(props: any) {
  const alertModalRef: any = useRef(null)
  const promoCode = usePromoCode()
  const [promoCodeDetails, setPromoCodeDetails] = useState<PromoCode.Details>()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isShowEditForm, setIsShowEditForm] = useState(false)

  useEffect(() => {
    setPromoCodeDetails({
      ...props?.data,
      expiresAt: moment(props?.data?.expiresAt).format('DD MMM, YYYY')
    })
  }, [])

  const copyToClipboard = (value: string | undefined) => {
    if (!value) return
    navigator.clipboard.writeText(value)
    ToastControl.showSuccessMessage('Copied promo code code to clipboard')
  }

  const confirmDeletePromoCode = (id: string | undefined) => {
    if (isDeleting) return

    alertModalRef?.current.open({
      title: 'Warning',
      content: 'Are you sure you want to delete the promo code?',
      isShowTwoButton: true,
      confirmButton: {
        label: 'Yes, do it',
        action: () => {
          requestDeletePromoCode(id || '')
        }
      }
    })
  }

  const requestDeletePromoCode = (id: string) => {
    setIsDeleting(true)
    promoCode.deletePromoCode({
      id,
      callback: {
        onSuccess: () => {
          props?.deleted && props.deleted()
          ToastControl.showSuccessMessage('You have successfully deleted the promo code')
          setIsDeleting(false)
        },
        onFailure: (err) => {
          ToastControl.showErrorMessage(err)
          setIsDeleting(false)
        }
      }
    })
  }

  return (
    <>
      {isShowEditForm ? (
        <EditPromoCode
          data={promoCodeDetails}
          index={props?.index}
          cancelled={() => {
            setIsShowEditForm(false)
          }}
          edited={(promoCode: PromoCode.Details) => {
            setPromoCodeDetails({
              ...promoCode,
              expiresAt: moment(promoCode?.expiresAt).format('DD MMM, YYYY')
            })
            setIsShowEditForm(false)
          }}
        />
      ) : (
        <div className='border border-blue-100 rounded-lg bg-wt-primary-130'>
          <div className='flex items-center p-4 py-3 border-b border-blue-100 rounded-t-lg bg-wt-primary-130'>
            <span className='text-wt-primary-40 font-semibold'>Promocode {props.index}</span>
            <div className='flex items-center ml-auto'>
              <span className='block w-3 h-3 rounded-full bg-blue-500 mr-2'></span>{' '}
              <span className='font-semibold text-blue-500'>Active</span>
            </div>
          </div>
          <div className='p-4 bg-wt-primary-130'>
            <div className='flex flex-col lg:flex-row items-center gap-4'>
              <div
                className='md:min-w-[300px] flex items-center flex-nowrap p-4 bg-white hover:bg-wt-primary-20 border-2 border-dashed border-wt-primary-90 rounded-lg w-fit cursor-pointer'
                onClick={() => {
                  copyToClipboard(promoCodeDetails?.code)
                }}
              >
                <span className='w-fit font-bold text-2xl text-blue-500 mr-6'>{promoCodeDetails?.code}</span>
                <div className='ml-auto'>
                  <IconSvg icon='documentCopy' />
                </div>
              </div>
              <div className='flex flex-col lg:flex-row items-center gap-4 lg:ml-auto'>
                <div className='flex flex-col'>
                  <span className='font-bold text-sm text-wt-primary-40'>Number of members who can use it:</span>
                  <span className='font-bold text-2xl text-wt-primary-40'>
                    {promoCodeDetails?.limit} Members for agency
                  </span>
                </div>
                <div className='border-space h-12 hidden lg:block'></div>
                <div className='flex flex-col'>
                  <span className='font-bold text-sm text-wt-primary-40'>Code is valid until:</span>
                  <span className='font-bold text-2xl text-wt-primary-40'>{promoCodeDetails?.expiresAt}</span>
                </div>
              </div>
              <div className='flex flex-col lg:flex-row items-center gap-4 lg:ml-4'>
                <a
                  className='flex items-center font-bold text-wt-primary-40 cursor-pointer hover:text-blue-500'
                  onClick={() => {
                    setIsShowEditForm(true)
                  }}
                >
                  <WtDocumentEdit className='mr-2' />
                  <span>Edit</span>
                </a>
                <div className='border-space h-4'></div>
                <a
                  className='flex items-center font-bold text-wt-primary-40 cursor-pointer hover:text-red-500'
                  onClick={() => {
                    confirmDeletePromoCode(promoCodeDetails?._id)
                  }}
                >
                  {isDeleting ? (
                    <Spinner className='w-6 h-6 text-gray-100 animate-spin fill-blue-500' />
                  ) : (
                    <>
                      <WtTrash className='mr-2' />
                      <span>Delete</span>
                    </>
                  )}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
      <AlertModal ref={alertModalRef} />
    </>
  )
}

export default PromoCodeItem
