import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from 'hooks'
import { valiator } from 'utils'
import { Button, IconSvg, OtpInput, Spinner } from 'ui-atoms'
import { HiCollection } from 'react-icons/hi'
import { WtSignInBtn } from 'ui-atoms/Icons'
import { ToastControl } from 'utils/toast'

function SignInSmsVerification() {
  const auth = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResendingOtp, setIsResendingOtp] = useState(false)
  const [form, setForm] = useState({
    otp: ''
  })
  const [formErrors, setFormErrors] = useState({
    otp: ''
  })
  const [phone, setPhone] = useState('')

  useEffect(() => {
    setPhone(localStorage.getItem('phone') || '')
  }, [])

  useEffect(() => {
    if (form.otp?.length == 6) {
      submitForm(null)
    }
  }, [form])

  const onChangeOtp = (value: any) => {
    setForm((form: any) => {
      return { ...form, otp: value }
    })
  }

  const validateOtp = (): string => {
    const err = valiator.validate(form.otp, {
      required: true,
      pattern: /^\d{6}$/,
      errorsMessage: { required: 'This field is required.', pattern: 'The verification code consists of 6 digits.' }
    })
    setFormErrors((errors: any) => {
      return { ...errors, otp: err || '' }
    })

    return err
  }

  const validateForm = (): boolean => {
    const arrRes = []
    arrRes.push(validateOtp())

    return arrRes.findIndex((x) => x && x.length > 0) < 0
  }

  const submitForm = (event: any) => {
    event?.preventDefault()

    if (!validateForm()) return

    requestLogin()
  }

  const requestLogin = () => {
    setIsSubmitting(true)
    const params: Auth.SmsVerificationParams = {
      idToken: searchParams.get('t') || '',
      otp: form.otp
    }
    auth.signInSmsVerification({
      params: params,
      callback: {
        onSuccess: () => {
          localStorage.removeItem('phone')
        },
        onFailure: (err) => {
          ToastControl.showErrorMessage(err)
        },
        onFinish: () => {
          setIsSubmitting(false)
        }
      }
    })
  }

  const resendOtp = () => {
    setIsResendingOtp(true)

    const params: Auth.RequestOTPParams = {
      idToken: searchParams.get('t') || '',
      email: searchParams.get('u') || ''
    }
    auth.requestOtp({
      params: params,
      callback: {
        onSuccess: () => {
          ToastControl.showSuccessMessage('Resend OTP successfully')
          setIsResendingOtp(false)
        },
        onFailure: (err) => {
          ToastControl.showErrorMessage(err)
          setIsResendingOtp(false)
        },
        onFinish: () => {
          setIsResendingOtp(false)
        }
      }
    })
  }

  return (
    <>
      <main className='bg-white dark:bg-gray-900 bg-[url("assets/media/image/sign-in-background.png")] bg-cover bg-no-repeat bg-center'>
        <div className='flex flex-col items-center justify-center mx-auto min-h-screen dark:bg-gray-900'>
          <div className='w-full px-6 my-2 max-w-xl bg-transparent rounded-3xl shadow dark:bg-gray-800'>
            <div className='w-full rounded-t-3xl xl:py-10 lg:py-6 py-5 bg-gradient-to-b from-blue-500 to-blue-600 flex items-center justify-center'>
              <IconSvg icon='signInLogo' className='xl:h-32 lg:h-20' />
            </div>
            <div className='xl:py-6 lg:py-4 py-3 bg-white rounded-b-3xl'>
              <div className='px-6'>
                <h2 className='text-xl lg:text-2xl xl:text-3xl font-medium text-black-500 dark:text-white text-center'>
                  SMS verification
                </h2>
                <p className='text-center mt-3'>
                  A text message with a six-digit verification code has been sent to your phone number ending in
                  {phone}
                </p>
              </div>
              <form
                className='xl:mt-6 lg:mt-4 mt-3 xl:space-y-6 lg:space-y-4 space-y-3'
                onSubmit={(e: any) => submitForm(e)}
              >
                <div className='mt-5 flex flex-col py-4 border-y border-gray-200'>
                  <p className='text-center font-bold text-wt-primary-40 mb-2'>Enter code here</p>
                  <OtpInput onChange={onChangeOtp} />
                  <p className='text-red-600 text-center mt-1'>{formErrors.otp}</p>
                  <div className='flex flex-wrap items-center justify-center mt-3'>
                    <span className='text-xs lg:text-sm xl:text-base font-normal text-black-500 dark:text-gray-400 text-center mr-2'>
                      Didn't receive the code?
                    </span>
                    {isResendingOtp ? (
                      <Spinner className='w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-400' />
                    ) : (
                      <a
                        className='text-xs lg:text-sm xl:text-base font-bold border-b border-blue-500 bg-gradient-to-b from-blue-500 to-blue-600 dark:text-blue-500 text-transparent bg-clip-text hover:from-blue-700 hover:to-blue-800 cursor-pointer'
                        onClick={resendOtp}
                      >
                        Resend
                      </a>
                    )}
                  </div>
                </div>
                <div className='px-6'>
                  <div className='xl:pt-6 lg:pt-4 pt-4'>
                    <Button
                      type='submit'
                      isLoading={isSubmitting}
                      className='flex items-center justify-center w-full font-semibold text-xs lg:text-sm xl:text-base text-white bg-blue-500 rounded-md py-3'
                    >
                      <WtSignInBtn className='mr-3' />
                      Log in
                    </Button>
                  </div>
                  <div className='flex flex-wrap items-center justify-center pb-4 mt-3'>
                    <Link
                      to={''}
                      className='text-xs lg:text-sm xl:text-base font-bold border-b border-blue-500  bg-gradient-to-b from-blue-500 to-blue-600 dark:text-blue-500 text-transparent bg-clip-text hover:from-blue-700 hover:to-blue-800'
                    >
                      Lost device for authentication?
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default SignInSmsVerification
