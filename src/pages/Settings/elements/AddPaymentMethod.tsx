import { useEffect, useState } from 'react'
import {
  WtAddPaymentMethod,
  WtAddSquare,
  WtAmexCard,
  WtCardMethod,
  WtChooseToolChecked,
  WtChooseToolUncheck,
  WtDiscoverCard,
  WtMasterCard,
  WtVisaCard,
  WtWireTransferMethod
} from 'ui-atoms/Icons'
import { CheckOutForm, PaymentMethodOption } from '.'
import { method } from 'lodash'
import { formatCreditCardNumber } from 'utils'
import { Button } from 'ui-atoms'
import { STRIPE_KEY } from 'constant'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(STRIPE_KEY)

const methodOptions = [
  {
    label: 'Card',
    value: 0,
    icon: <WtCardMethod />,
    disabled: false
  },
  {
    label: 'Wire Transfer',
    value: 1,
    icon: <WtWireTransferMethod />,
    disabled: true
  }
]

function AddPaymentMethod(props: any) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isExtended, setIsExtended] = useState(false)
  const [form, setForm] = useState({
    method: 0,
    cardNumber: '',
    expirationDate: '',
    cvc: '',
    country: '',
    postalCode: ''
  })
  const [errors, setErrors] = useState({
    method: '',
    cardNumber: '',
    expirationDate: '',
    cvc: '',
    country: '',
    postalCode: ''
  })
  const [isDefault, setIsDefault] = useState(false)

  const headerStyle = () => {
    return [
      'flex items-center p-4 rounded-t-xl cursor-pointer',
      isExtended ? 'bg-white' : 'bg-wt-primary-110 rounded-b-xl'
    ]
      .filter(Boolean)
      .join(' ')
  }

  const onChangeMethod = (value: any) => {
    setForm((current) => {
      return {
        ...current,
        method: value
      }
    })
  }

  const onChangedCardNumber = ({ target }: any) => {
    target.value = formatCreditCardNumber(target.value)
    setForm((current) => {
      return {
        ...current,
        cardNumber: target.value
      }
    })
  }

  const onChangedExpirationDate = ({ target }: any) => {
    setForm((current) => {
      return {
        ...current,
        cardNumber: target.value
      }
    })
  }

  const onChangedCVC = ({ target }: any) => {
    setForm((current) => {
      return {
        ...current,
        cvc: target.value
      }
    })
  }

  const onChangedPostalCode = ({ target }: any) => {
    setForm((current) => {
      return {
        ...current,
        postalCode: target.value
      }
    })
  }

  const submit = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
    }, 2000)
  }

  const onChangedDefault = (value: boolean) => {
    setIsDefault(value)
  }

  const addedPaymentHandler = () => {
    setIsExtended(false)
    props?.addedPayment && props?.addedPayment()
  }

  return (
    <>
      <div className='bg-white border border-gray-300 rounded-xl'>
        <div
          className={headerStyle()}
          onClick={() => {
            setIsExtended(!isExtended)
          }}
        >
          <div className='flex-1 flex items-center font-semibold text-wt-primary-40'>
            <WtAddPaymentMethod className='mr-4' />
            <span>Add payment method</span>
          </div>
          <div className='ml-auto flex items-center'>
            {isDefault ? (
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
          </div>
        </div>
        {isExtended && (
          <>
            <Elements stripe={stripePromise}>
              <div className='p-4 border-t border-gray-200'>
                <div className='mb-4'>
                  <label className='block mb-2 text-sm font-bold text-wt-primary-40'>
                    Choose method <span className='text-red-500'>*</span>
                  </label>
                  <div className='grid grid-cols-12 gap-4'>
                    {methodOptions.map((option: any) => {
                      return (
                        <div key={option.value} className='col-span-6'>
                          <PaymentMethodOption
                            data={option}
                            isChecked={form.method === option.value}
                            disabled={option.disabled}
                            onClick={() => {
                              onChangeMethod(option.value)
                            }}
                          />
                        </div>
                      )
                    })}
                  </div>
                </div>
                {/* <div className='mb-4'>
                <label className='block mb-2 text-sm font-bold text-wt-primary-40'>
                  Card number <span className='text-red-500'>*</span>
                </label>
                <div className='flex items-center relative mt-1 w-full'>
                  <input
                    className='form-control h-full w-full pr-36'
                    type='text'
                    placeholder='xxxx xxxx xxxx xxxx'
                    pattern='[\d| ]{16,22}'
                    onChange={onChangedCardNumber}
                  />
                  <div className='absolute inset-y-0 right-0 flex items-center'>
                    <WtVisaCard className='mr-2' />
                    <WtMasterCard className='mr-2' />
                    <WtAmexCard className='mr-2' />
                    <WtDiscoverCard className='mr-4' />
                  </div>
                </div>
                </div>
                <div className='grid grid-cols-12 gap-4'>
                  <div className='col-span-6 mb-4'>
                    <label className='block mb-2 text-sm font-bold text-wt-primary-40'>
                      Expiration date <span className='text-red-500'>*</span>
                    </label>
                    <input
                      className='form-control'
                      type='text'
                      placeholder='Expiration date'
                      onChange={onChangedExpirationDate}
                    />
                  </div>
                  <div className='col-span-6 mb-4'>
                    <label className='block mb-2 text-sm font-bold text-wt-primary-40'>
                      CVC <span className='text-red-500'>*</span>
                    </label>
                    <input className='form-control' type='text' placeholder='CVC' onChange={onChangedCVC} />
                  </div>
                </div>
                <div className='grid grid-cols-12 gap-4'>
                  <div className='col-span-6 mb-4'>
                    <label className='block mb-2 text-sm font-bold text-wt-primary-40'>
                      Country <span className='text-red-500'>*</span>
                    </label>
                    <input className='form-control' type='text' placeholder='Select...' />
                  </div>
                  <div className='col-span-6 mb-4'>
                    <label className='block mb-2 text-sm font-bold text-wt-primary-40'>
                      Postal code <span className='text-red-500'>*</span>
                    </label>
                    <input
                      className='form-control'
                      type='text'
                      placeholder='Postal code'
                      onChange={onChangedPostalCode}
                    />
                  </div>
                </div> */}
              </div>
              {/* <div className='p-4 border-t border-gray-200'>
                <Button
                  className='w-full flex items-center justify-center btn bg-wt-primary-40 hover:bg-wt-primary-45 py-3 rounded-lg font-bold text-white ml-auto'
                  type='button'
                  isLoading={isSubmitting}
                  onClick={() => submit()}
                >
                  <WtAddSquare className='h-5 w-5 mr-2' />
                  Add payment method
                </Button>
              </div> */}
              <CheckOutForm isDefault={isDefault} addedPayment={addedPaymentHandler} />
            </Elements>
          </>
        )}
      </div>
    </>
  )
}

export default AddPaymentMethod
