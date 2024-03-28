import { useEffect, useRef, useState } from 'react'
import { useAuth, usePayment } from 'hooks'
import { Button, Spinner, } from 'ui-atoms'
import { AddPaymentMethod, PaymentCard } from '.'
import { formatDate, uuidv4 } from 'utils'
import { WtNextPaymentDate } from 'ui-atoms/Icons'
import moment from 'moment'
import { AlertModal } from 'ui-molecules'
import { ToastControl } from 'utils/toast'

function Payment(props: any) {
  const alertModalRef: any = useRef(null)
  const payment = usePayment()
  const [cardSeleced, setCardSelected] = useState<Payment.PaymentMethod | null>()
  const [isSubmitting, setSubmitting] = useState(false)
  const [paymentInfo, setPaymentInfo] = useState<Payment.PaymentInfor>()
  const [isLoadingPaymentInfo, setIsLoadingPaymentInfo] = useState(false)
  const [isCancellingSub, setIsCancellingSub] = useState(false)

  useEffect(() => {
    requestGetPaymentInfo()
  }, [])

  const requestGetPaymentInfo = () => {
    setIsLoadingPaymentInfo(true)
    payment.getPaymentInfo({
      callback: {
        onSuccess: (res: any) => {
          const payment: Payment.PaymentInfor = res?.paymentInfo
          const defaultId = payment?.customer?.invoiceSettings?.default_payment_method

          payment.paymentMethods = payment.paymentMethods.map((x: Payment.PaymentMethod) => {
            return {
              ...x,
              isDefault: defaultId == x.id
            }
          })
          setPaymentInfo(payment)
          setCardSelected(res?.paymentInfo?.paymentMethods?.find((x: Payment.PaymentMethod) => defaultId == x.id))
        },
        onFinish: () => {
          setIsLoadingPaymentInfo(false)
        }
      }
    })
  }

  const setDefaultPayment = (id: string) => {
    const payment: Payment.PaymentInfor | any = paymentInfo
    payment.paymentMethods = payment?.paymentMethods.map((x: Payment.PaymentMethod) => {
      return {
        ...x,
        isDefault: id == x.id ? true : false
      }
    })

    setPaymentInfo((current: any) => {
      return {
        ...current,
        paymentMethods: payment.paymentMethods.map((x: any) => x)
      }
    })
  }

  const nextBillingDate = () => {
    if (paymentInfo?.subscription?.nextBillingDate) {
      return moment(new Date(paymentInfo?.subscription?.nextBillingDate)).format('MMM DD, YYYY')
    } else {
      return ''
    }
  }

  const cancelSubcribe = () => {
    alertModalRef?.current.open({
      title: 'Cancel Subscribe',
      content: 'Are you sure you want to cancel your subscription?',
      isShowTwoButton: true,
      confirmButton: {
        label: 'Cancel Subscribe',
        action: () => {
          requestCancelSubcription()
        }
      },
      cancelButton: {
        label: 'Continue use',
        className: 'btn bg-blue-500 hover:bg-blue-600 py-3 rounded-lg font-bold text-white',
        action: () => {
          //
        }
      }
    })
  }

  const requestCancelSubcription = () => {
    setIsCancellingSub(true)
    const params: any = {
      id: paymentInfo?.subscription?.id
    }

    payment.cancelSubscribe({
      params,
      callback: {
        onSuccess: () => {
          props?.setDefault && props?.setDefault()
          ToastControl.showSuccessMessage('You have successfully cancelled your subcription')
          setIsCancellingSub(false)
        },
        onFailure: (err) => {
          ToastControl.showErrorMessage(err)
          setIsCancellingSub(false)
        }
      }
    })
  }

  return (
    <>
      <div className='tabs-content-item'>
        <div className='p-4'>
          <div className='grid grid-cols-12 gap-4'>
            <div className='col-span-8'>
              <div className='grid grid-cols-12 gap-4'>
                {isLoadingPaymentInfo ? (
                  <div className='col-span-12'>
                    <div className='flex items-center justify-center w-full'>
                      <Spinner />
                    </div>
                  </div>
                ) : (
                  ''
                )}
                <div className='col-span-12'></div>
                {paymentInfo?.paymentMethods.map((card: Payment.PaymentMethod) => {
                  return (
                    <div key={card.id} className='col-span-6'>
                      <PaymentCard
                        data={card}
                        isChecked={card.id === cardSeleced?.id}
                        isDefault={card.isDefault}
                        onClick={() => {
                          setCardSelected(card)
                        }}
                        setDefault={() => {
                          setDefaultPayment(card.id)
                        }}
                      />
                    </div>
                  )
                })}
              </div>
              <div className='grid grid-cols-12 gap-4 mt-4'>
                <div className='col-span-12'>
                  <AddPaymentMethod addedPayment={requestGetPaymentInfo} />
                </div>
              </div>
            </div>
            <div className='col-span-4'>
              <div className='bg-wt-primary-70 rounded-xl'>
                <div className='w-full p-6 pb-0 rounded-t-xl'>
                  <div className='flex flex-col'>
                    <label className='font-bold text-wt-primary-40 mb-2'>Your subscription</label>
                    <h2 className='text-2xl font-bold text-wt-primary-75'>{paymentInfo?.subscription?.desc}</h2>
                  </div>
                  <div className='w-full border-t border-wt-primary-40 mt-4'></div>
                </div>
                <div className='w-full px-6 py-4'>
                  <div className='flex flex-row'>
                    <span className='font-bold text-wt-primary-40'>
                      {paymentInfo?.subscription?.items[0] && (paymentInfo?.subscription?.items[0].desc || '')}
                    </span>
                    {/* <span className='font-bold text-wt-primary-75 ml-auto'>3 users x $1250</span> */}
                  </div>
                </div>
                <div className='w-full p-6 bg-wt-primary-70 rounded-b-xl'>
                  <div className='flex flex-row items-center'>
                    <span className='font-bold text-wt-primary-75'>Total</span>
                    <span className='font-bold text-wt-primary-75 ml-auto'>
                      <span className='text-2xl font-bold'>${paymentInfo?.subscription?.totalAmount}</span> per month
                    </span>
                  </div>
                </div>
              </div>
              <div className='flex items-center bg-wt-primary-110 rounded-lg p-4 mt-4'>
                <WtNextPaymentDate className='mr-2' /> Next payment date
                <span className='ml-auto'>{nextBillingDate()}</span>
              </div>
            </div>
          </div>
        </div>
        <div className='p-4 border-t border-gray-200'>
          <div className='flex'>
            <Button
              className='flex items-center btn bg-wt-primary-40 hover:bg-wt-primary-45 py-3 rounded-lg font-bold text-white ml-auto'
              type='button'
              isLoading={isCancellingSub}
              onClick={() => cancelSubcribe()}
            >
              Cancel Subscribe
            </Button>
          </div>
        </div>
      </div>
      <AlertModal ref={alertModalRef} />
    </>
  )
}

export default Payment
