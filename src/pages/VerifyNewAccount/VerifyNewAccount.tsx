import { useEffect, useState } from 'react'

import logo from 'assets/react.svg'
import { Button } from 'ui-atoms'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from 'hooks'
import { valiator } from 'utils'
import { GuestLayout } from 'ui-organisms'

function VerifyNewAccount() {
  const search = useLocation().search
  const searchParams = new URLSearchParams(search)
  const auth = useAuth()
  const [firstRender, setFirstRender] = useState(false)
  const [form, setForm] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState<any>({
    email: '',
    password: ''
  })
  const [loginFailed, setLoginFailed] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // did mount or update mount
    if (firstRender == false) {
      renderClass()
    }

    return () => {
      // unmount
    }
  })

  useEffect(() => {
    setLoginFailed('')
  }, [form])

  const renderClass = () => {
    setFirstRender(true)
  }

  const onChangeEmail = (e: any) => {
    setForm((form: any) => {
      return { ...form, email: e.target.value }
    })
  }

  const onChangePassword = (e: any) => {
    setForm((form: any) => {
      return { ...form, password: e.target.value }
    })
  }

  const validateEmail = (): string => {
    const err = valiator.validate(form.email, {
      required: true,
      errorsMessage: { required: 'This field is required.' }
    })
    setErrors((errors: any) => {
      return { ...errors, email: err || '' }
    })

    return err
  }

  const validatePassword = (): string => {
    const err = valiator.validate(form.password, {
      required: true,
      errorsMessage: { required: 'This field is required.' }
    })
    setErrors((errors: any) => {
      return { ...errors, password: err || '' }
    })

    return err
  }

  const validateForm = (): boolean => {
    const arrRes = []
    arrRes.push(validateEmail())
    arrRes.push(validatePassword())

    return arrRes.findIndex((x) => x && x.length > 0) < 0
  }

  const submitForm = (event: any) => {
    event.preventDefault()

    if (!validateForm()) return

    requestLogin()
  }

  const requestLogin = () => {
    setIsSubmitting(true)
    const params: Auth.SignInParams = {
      email: form.email,
      password: form.password
    }
    auth.signIn({
      params: params,
      callback: {
        onSuccess: (res: any) => {},
        onFailure: () => {
          setLoginFailed('Email or Password is incorrect. Please try again.')
        },
        onFinish: () => {
          setIsSubmitting(false)
        }
      }
    })
  }

  return (
    <>
      <main className='bg-gray-50 dark:bg-gray-900'>
        <div className='relative flex min-h-screen flex-col items-center justify-center overflow-hidden py-6 sm:py-12 bg-white'>
          <div className='max-w-xl px-5 text-center'>
            {searchParams.get('status') === 'succeeded' ? (
              <h2 className='mb-2 text-[42px] font-bold text-zinc-800'>Your account has been successfully verified.</h2>
            ) : searchParams.get('status') === 'expired' ? (
              <h2 className='mb-2 text-[42px] font-bold text-zinc-800'>The link has expired.</h2>
            ) : searchParams.get('status') === 'failed' ? (
              <h2 className='mb-2 text-[42px] font-bold text-zinc-800'>
                Account verification failed. Please try again.
              </h2>
            ) : (
              <h2 className='mb-2 text-[42px] font-bold text-zinc-800'>
                Account verification failed. Please try again.
              </h2>
            )}

            <p className='mb-2 text-lg text-zinc-500'>
              <span className='font-medium text-wt-primary-4'>{searchParams.get('email')}</span>.
            </p>
            <a
              href='/sign-in'
              className='mt-3 inline-block w-96 rounded bg-wt-primary-4 px-5 py-3 font-medium text-white shadow-md shadow-indigo-500/20 hover:bg-wt-primary-3'
            >
              Login to your account →
            </a>
          </div>
        </div>
      </main>
    </>
  )
}

export default VerifyNewAccount
