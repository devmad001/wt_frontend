import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { useStripe, useElements, PaymentElement, Elements, CardElement } from '@stripe/react-stripe-js'
import { Button } from 'ui-atoms'
import { WtAddSquare } from 'ui-atoms/Icons'
import { ToastControl } from 'utils/toast'
import { usePayment } from 'hooks'

function CheckOutForm(props: any, ref: any) {
  const payment = usePayment()
  const stripe = useStripe()
  const elements = useElements()
  const [message, setMessage] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const paymentElementOptions: any = {
    layout: 'tabs',
    type: 'card'
  }

  useEffect(() => {
    if (!stripe) {
      return
    }

    const clientSecret = new URLSearchParams(window.location.search).get('payment_intent_client_secret')

    if (!clientSecret) {
      return
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }: any) => {
      switch (paymentIntent.status) {
        case 'succeeded':
          setMessage('Payment succeeded!')
          break
        case 'processing':
          setMessage('Your payment is processing.')
          break
        case 'requires_payment_method':
          setMessage('Your payment was not successful, please try again.')
          break
        default:
          setMessage('Something went wrong.')
          break
      }
    })
  }, [stripe])

  const getIsDefault = () => {
    return props?.isDefault || false
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    const cardElement = elements.getElement(CardElement)

    if (!cardElement) {
      ToastControl.showErrorMessage('Card element not found')
      return
    }

    setIsSubmitting(true)
    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement
    })

    if (error) {
      console.error(error)
      ToastControl.showErrorMessage(error.message || 'An error occurred')
      setIsSubmitting(false)
    } else {
      console.log('PaymentMethod:', paymentMethod)

      const params: Payment.registerPaymentMethod = {
        paymentMethodId: paymentMethod?.id,
        isDefault: getIsDefault()
      }
      payment.registerPaymentMethod({
        params,
        callback: {
          onSuccess: () => {
            props?.addedPayment && props?.addedPayment()
            ToastControl.showSuccessMessage('You have successfully added new payment method')
            setIsSubmitting(false)
          },
          onFailure: (err) => {
            ToastControl.showErrorMessage(err)
            setIsSubmitting(false)
          }
        }
      })
    }
  }

  return (
    <>
      <form id='payment-form' className='w-full' onSubmit={handleSubmit}>
        <div className='p-4 border-t border-gray-200'>
          <CardElement />
        </div>
        <div className='p-4 border-t border-gray-200'>
          <Button
            className='w-full flex items-center justify-center btn bg-wt-primary-40 hover:bg-wt-primary-45 py-3 rounded-lg font-bold text-white ml-auto'
            type='submit'
            disabled={!stripe}
            isLoading={isSubmitting}
          >
            <WtAddSquare className='h-5 w-5 mr-2' />
            Add payment method
          </Button>
        </div>
        {message && <div id='payment-message'>{message}</div>}
      </form>
    </>
  )
}

export default CheckOutForm
