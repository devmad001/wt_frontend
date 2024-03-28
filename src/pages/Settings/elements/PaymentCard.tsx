import { usePayment } from 'hooks'
import { useEffect, useState } from 'react'
import { Spinner } from 'ui-atoms'
import {
  WtAmexCard,
  WtChooseToolChecked,
  WtChooseToolUncheck,
  WtDiscoverCard,
  WtMasterCard,
  WtVisaCard
} from 'ui-atoms/Icons'
import { ToastControl } from 'utils/toast'

export interface PaymentCardProps {
  data: Payment.PaymentMethod
  isChecked: boolean
  onClick: (...args: any) => void
}

const cardIcons: any = {
  mastercard: <WtMasterCard className='mr-4' />,
  visa: <WtVisaCard className='mr-4' />,
  amex: <WtAmexCard className='mr-4' />,
  discover: <WtDiscoverCard className='mr-4' />
}

function PaymentCard(props: any) {
  const payment = usePayment()
  const [paymentMethod, setPaymentMethod] = useState<Payment.PaymentMethod | null>(null)
  const [isSettingDefault, setIsSettingDefault] = useState(false)

  useEffect(() => {
    setPaymentMethod(props?.data)
  }, [])

  const cardStyles = () => {
    return [
      'flex items-center p-4 border rounded-lg cursor-pointer',
      props?.isChecked ? 'bg-white border-blue-500' : 'bg-wt-primary-110 border-wt-primary-110 opacity-50'
    ]
      .filter(Boolean)
      .join(' ')
  }

  const defaultBadgeStyles = () => {
    return [
      'rounded-full px-4 py-2 text-sm font-bold  mr-3',
      props?.isChecked ? 'bg-gray-200 text-wt-primary-40' : 'bg-white text-wt-primary-40'
    ]
      .filter(Boolean)
      .join(' ')
  }

  const getBrandNameCard = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  const onChangedDefault = (value: boolean) => {
    props?.onClick && props?.onClick()
    requestSetDefaultPaymentMethod()
  }

  const requestSetDefaultPaymentMethod = () => {
    setIsSettingDefault(true)
    const params: Payment.setDefaultPaymentMethodParams = {
      paymentMethodId: paymentMethod?.id,
      isDefault: true
    }

    payment.setDefaultPaymentMethod({
      params,
      callback: {
        onSuccess: () => {
          props?.setDefault && props?.setDefault()
          ToastControl.showSuccessMessage('You have successfully set default payment method')
          setIsSettingDefault(false)
        },
        onFailure: (err) => {
          ToastControl.showErrorMessage(err)
          setIsSettingDefault(false)
        }
      }
    })
  }

  return (
    <>
      <div
        className={cardStyles()}
        onClick={() => {
          props?.onClick && props?.onClick()
        }}
      >
        <div className='flex-1'>
          <div className='flex items-center'>
            {cardIcons[props?.data?.card?.brand]}
            <div className='flex flex-col'>
              <label className='font-semibold text-lg'>
                {getBrandNameCard(props?.data?.card?.brand)} ···{props?.data?.card?.last4}
              </label>
              <span className='font-base text-sm text-wt-primary-40'>{props?.data?.billing_details?.name}</span>
              <span className='font-base text-sm text-wt-primary-40'>
                Exp. {props?.data?.card?.exp_month}/{props?.data?.card?.exp_year}{' '}
              </span>
            </div>
          </div>
        </div>
        <div className='flex items-center'>
          {props?.isDefault && <span className={defaultBadgeStyles()}>Default</span>}
          {isSettingDefault ? (
            <Spinner className='w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-400' />
          ) : (
            <>
              {props?.isDefault ? (
                <WtChooseToolChecked
                  className='w-6 h-6'
                  onClick={(event: any) => {
                    event.stopPropagation()
                    onChangedDefault(false)
                  }}
                />
              ) : (
                <WtChooseToolUncheck
                  className='w-6 h-6'
                  onClick={(event: any) => {
                    event.stopPropagation()
                    onChangedDefault(true)
                  }}
                />
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default PaymentCard
