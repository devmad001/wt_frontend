import { useEffect, useState } from 'react'
import logoHoriBlue from 'assets/media/svg/wt-hori-blue-text-logo.svg'
import logoHoriWhite from 'assets/media/svg/wt-hori-all-white.svg'
import { Link } from 'react-router-dom'
import { useAuth } from 'hooks'
import { valiator } from 'utils'
import { GuestLayout } from 'ui-organisms'
import UIHelperClass from 'constant/UIHelper'
import { Button, IconSvg } from 'ui-atoms'
import { HiCollection } from 'react-icons/hi'
import { WtSignInBtn } from 'ui-atoms/Icons'

function SignIn() {
  const auth = useAuth()
  const [showPassword, setShowPassword] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)
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
    setMode()
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

  const setMode = () => {
    const root = document.getElementsByTagName('html')[0]
    const mode = localStorage.getItem('mode')
    if (mode === 'dark') {
      root.setAttribute('class', 'dark')
      setIsDarkMode(true)
    } else if (mode === 'light') {
      root.setAttribute('class', '')
      setIsDarkMode(false)
    }
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
        onSuccess: () => {},
        onFailure: (err) => {
          console.log(err)
          setLoginFailed(err?.message || 'Email or Password is incorrect. Please try again.')
        },
        onFinish: () => {
          setIsSubmitting(false)
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
            <div className='px-6 xl:py-6 lg:py-4 py-3 bg-white rounded-b-3xl'>
              <h2 className='text-xl lg:text-2xl xl:text-3xl font-medium text-black-500 dark:text-white text-center'>
                Welcome to WatchTower
              </h2>
              <form
                className='xl:mt-6 lg:mt-4 mt-3 xl:space-y-6 lg:space-y-4 space-y-3'
                onSubmit={(e: any) => submitForm(e)}
              >
                <div>
                  <label htmlFor='email' className='block mb-2 text-sm font-bold text-black-500 dark:text-white'>
                    Email
                  </label>
                  <input
                    type='email'
                    name='email'
                    id='email'
                    className={['form-control', errors.email ? 'invalid' : ''].filter(Boolean).join(' ')}
                    placeholder='Email'
                    value={form.email || ''}
                    onChange={onChangeEmail}
                    onBlur={validateEmail}
                  />
                  <p className='text-red-600 mt-1'>{errors.email}</p>
                </div>
                <div>
                  <label htmlFor='password' className='block mb-2 text-sm font-bold text-black-500 dark:text-white'>
                    Password
                  </label>
                  <div className='relative'>
                    <input
                      type={showPassword ? 'password' : 'text'}
                      name='password'
                      id='password'
                      className={['form-control', errors.password ? 'invalid' : ''].filter(Boolean).join(' ')}
                      placeholder='Password'
                      value={form.password || ''}
                      onChange={onChangePassword}
                      onBlur={validatePassword}
                    />
                    <div className='absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5'>
                      <span className='cursor-pointer block' onClick={() => setShowPassword(!showPassword)}>
                        <IconSvg icon={showPassword ? 'showPassIcon' : 'hidePassIcon'} />
                      </span>
                    </div>
                  </div>

                  <p className='text-red-600 mt-1'>{errors.password}</p>
                  <p className='text-red-600 mt-1'>{loginFailed}</p>
                </div>
                <div className='flex flex-wrap items-center'>
                  <div className='flex items-center mr-auto mb-4 sm:mb-0'>
                    <div className='flex items-center justify-center'>
                      <input
                        id='remember'
                        aria-describedby='remember'
                        name='remember'
                        type='checkbox'
                        className='check-gradient-blue w-6 h-6 border-gray-300 rounded-lg'
                      />
                    </div>
                    <div className='ml-3 text-sm'>
                      <label
                        htmlFor='remember'
                        className='font-normal text-xs lg:text-sm xl:text-base text-black-500 dark:text-white'
                      >
                        Remember me
                      </label>
                    </div>
                  </div>
                  <a
                    href='#'
                    className='text-xs lg:text-sm xl:text-base font-bold border-b border-blue-500  bg-gradient-to-b from-blue-500 to-blue-600 dark:text-blue-500 text-transparent bg-clip-text hover:from-blue-700 hover:to-blue-800 h-fit'
                  >
                    <div className=''>Forgot your password?</div>
                  </a>
                </div>
                <div className='xl:pt-8 lg:pt-6 pt-4'>
                  <Button
                    type='submit'
                    isLoading={isSubmitting}
                    className='flex items-center justify-center w-full font-semibold text-xs lg:text-sm xl:text-base text-white bg-blue-500 rounded-md py-3'
                  >
                    <WtSignInBtn className='mr-3' />
                    Sign in
                  </Button>
                </div>
                <div className='flex flex-wrap items-center justify-center pb-4'>
                  <span className='text-xs lg:text-sm xl:text-base font-normal text-black-500 dark:text-gray-400 text-center mr-2'>
                    Don't have an account?
                  </span>

                  <Link
                    to={'/sign-up'}
                    className='text-xs lg:text-sm xl:text-base font-bold border-b border-blue-500  bg-gradient-to-b from-blue-500 to-blue-600 dark:text-blue-500 text-transparent bg-clip-text hover:from-blue-700 hover:to-blue-800'
                  >
                    Sign Up
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default SignIn
