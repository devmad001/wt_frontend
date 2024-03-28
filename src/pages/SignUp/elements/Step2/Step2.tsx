import '../../style.css'

import { forwardRef, useImperativeHandle, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from 'hooks'
import Select, { components } from 'react-select'
import { Button, IconSvg, ReactSelect } from 'ui-atoms'
import { valiator } from 'utils'
import {
  WTArrowRightBg,
  WtCreateAccountBtn,
  WtPasswordInvalid,
  WtPasswordValid,
  WtSignUpBackIcon
} from 'ui-atoms/Icons'
import { ToggleSwitch } from 'flowbite-react'
import ThemeHelper from 'constant/ThemeHelper'
import { HiEye, HiEyeOff } from 'react-icons/hi'
import RegexHelper from 'constant/RegexHelper'

interface Form {
  email: string
  phoneNumber: string
  password: string
  repeatPassword: string
}
const Step2 = forwardRef((props: any, ref: any) => {
  const [form, setForm] = useState<Form>({
    email: '',
    phoneNumber: '',
    password: '',
    repeatPassword: ''
  })
  const [errors, setErrors] = useState<any>({
    email: '',
    phoneNumber: '',
    password: '',
    repeatPassword: ''
  })
  const [passwordValidate, setPasswordValidate] = useState<any>({
    minLenght: false,
    lowercase: false,
    uppercase: false,
    numberAndSpecialChar: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showRepeatPassword, setShowRepeatPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useImperativeHandle(ref, () => ({
    setIsSubmitting(value: boolean) {
      setIsSubmitting(value)
    },
    resetForm() {
      setForm({
        email: '',
        phoneNumber: '',
        password: '',
        repeatPassword: ''
      })
      setErrors({
        email: '',
        phoneNumber: '',
        password: '',
        repeatPassword: ''
      })
    }
  }))

  const renderValidateInforOfPassword = (valid: boolean) => {
    return valid ? <WtPasswordValid /> : <WtPasswordInvalid />
  }

  const onChangeEmail = (e: any) => {
    setForm((form: any) => {
      return { ...form, email: e.target.value }
    })
  }

  const onChangePhoneNumber = (e: any) => {
    setForm((form: any) => {
      return { ...form, phoneNumber: e.target.value }
    })
  }

  const onChangePassword = (e: any) => {
    setForm((form: any) => {
      return { ...form, password: e.target.value }
    })
  }

  const onChangeRepeatPassword = (e: any) => {
    setForm((form: any) => {
      return { ...form, repeatPassword: e.target.value }
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

  const validatePhoneNumber = (): string => {
    const err = valiator.validate(form.phoneNumber, {
      required: true,
      // pattern: RegexHelper.US_PHONENUMBER,
      errorsMessage: { required: 'This field is required.' }
    })
    setErrors((errors: any) => {
      return { ...errors, phoneNumber: err || '' }
    })

    return err
  }

  const validatePassword = (): string => {
    const err = valiator.validate(form.password, {
      required: true,
      pattern: RegexHelper.PASSWORD,
      errorsMessage: { required: 'This field is required.', pattern: 'Password is not strong enough' }
    })
    setErrors((errors: any) => {
      return { ...errors, password: err || '' }
    })

    return err
  }

  const validateDetailPasssword = (e: any): void => {
    const value = e.target.value || ''
    const err = {
      minLenght: false,
      lowercase: false,
      uppercase: false,
      numberAndSpecialChar: false
    }

    const isValidLength = /^.{8,}$/
    if (isValidLength.test(value)) {
      err.minLenght = true
    }

    const isContainsLowercase = /^(?=.*[a-z])/
    if (isContainsLowercase.test(value)) {
      err.lowercase = true
    }

    const isContainsUppercase = /^(?=.*[A-Z])/
    if (isContainsUppercase.test(value)) {
      err.uppercase = true
    }

    const isContainsNumber = /^(?=.*[0-9])/
    const isContainsSymbol = /^(?=.*[~`!@#$%^&*()--+={}[\]|\\:;"'<>,.?/_₹])/
    if (isContainsNumber.test(value) && isContainsSymbol.test(value)) {
      err.numberAndSpecialChar = true
    }

    setPasswordValidate(err)
    validatePassword()
  }

  const validateRepeatPassword = (): string => {
    const err = valiator.validate(form.repeatPassword, {
      required: true,
      errorsMessage: { required: 'This field is required.' }
    })
    setErrors((errors: any) => {
      return { ...errors, repeatPassword: err || '' }
    })

    if (form.password !== form.repeatPassword) {
      setErrors((errors: any) => {
        return { ...errors, repeatPassword: 'Repeat password is incorrect' }
      })
    }

    return err
  }

  const validateForm = (): boolean => {
    const arrRes = []
    arrRes.push(validateEmail())

    return arrRes.findIndex((x) => x && x.length > 0) < 0
  }

  const submitForm = (event: any) => {
    event.preventDefault()

    if (!validateForm()) return
  }

  const onBack = () => {
    props?.onBack && props?.onBack()
  }

  const onCreateAccount = () => {
    const params: Auth.RegisterParams = {
      registerType: '',
      activationCode: '',
      memberships: [],
      email: form.email,
      password: form.password,
      agency: '',
      fieldOffice: '',
      squad: '',
      fullName: '',
      phone: form.phoneNumber
    }
    props?.onCreateAccount && props.onCreateAccount(params)
  }

  return (
    <div className='w-full min-h-screen flex items-center justify-center py-10 md:py-3'>
      <div className='w-[80%] lg:w-[70%] py-24 bg-white rounded-lg dark:bg-gray-800'>
        <div className='w-full h-full'>
          <form className='h-full' onSubmit={(e: any) => submitForm(e)}>
            <div className='step-header w-full'>
              <p className='text-gray-350 text-xs xl:text-sm font-bold mb-3'>Step 2 of 2</p>
              <div className='flex items-center'>
                <WtSignUpBackIcon className='cursor-pointer mr-5' onClick={onBack} />
                <h2 className='text-lg lg:text-2xl font-bold text-black-500 dark:text-white'>Tell Us About Yourself</h2>
              </div>
            </div>
            <div className='lg:my-24 my-12'>
              <div className='mb-4'>
                <label className='block mb-2 font-bold text-wt-primary-40 dark:text-white'>
                  Email <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  name='email'
                  id='email'
                  className={['form-control', errors.email ? 'invalid' : ''].filter(Boolean).join(' ')}
                  placeholder='Enter your email'
                  value={form.email || ''}
                  onChange={onChangeEmail}
                  onBlur={() => validateEmail()}
                />
                <p className='text-red-600 text-xs lg:text-sm xl:text-base font-semibold mt-1'>{errors.email}</p>
              </div>
              <div className='mb-4'>
                <label className='block mb-2 font-bold text-wt-primary-40 dark:text-white'>
                  Phone number <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  name='phoneNumber'
                  id='phoneNumber'
                  className={['form-control', errors.phoneNumber ? 'invalid' : ''].filter(Boolean).join(' ')}
                  placeholder='Enter your phone number'
                  value={form.phoneNumber || ''}
                  onChange={onChangePhoneNumber}
                  onBlur={() => validatePhoneNumber()}
                />
                <p className='text-red-600 text-xs lg:text-sm xl:text-base font-semibold mt-1'>{errors.phoneNumber}</p>
              </div>
              <div className='mb-4'>
                <label className='block mb-2 font-bold text-wt-primary-40 dark:text-white'>
                  Password <span className='text-red-500'>*</span>
                </label>
                <div className='relative'>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name='password'
                    id='password'
                    className={['form-control', errors.password ? 'invalid' : ''].filter(Boolean).join(' ')}
                    placeholder='Enter your password'
                    value={form.password || ''}
                    onChange={onChangePassword}
                    onInput={validateDetailPasssword}
                    onBlur={() => validatePassword()}
                  />
                  <span className='absolute end-0 top-0 p-3' onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <HiEyeOff className='w-5 h-5 text-wt-primary-40 cursor-pointer' />
                    ) : (
                      <HiEye className='w-5 h-5 text-wt-primary-40 cursor-pointer' />
                    )}
                  </span>
                </div>
                <p className='text-red-600 text-xs lg:text-sm xl:text-base font-semibold mt-1'>{errors.password}</p>
              </div>
              {/* <div className='mb-4'>
                <label className='block mb-2 font-bold text-wt-primary-40 dark:text-white'>
                  Repeat password <span className='text-red-500'>*</span>
                </label>
                <div className='relative'>
                  <input
                    type={showRepeatPassword ? 'text' : 'password'}
                    name='repeatPassword'
                    id='repeatPassword'
                    className={['form-control', errors.repeatPassword ? 'invalid' : ''].filter(Boolean).join(' ')}
                    placeholder='Enter your password'
                    value={form.repeatPassword || ''}
                    onChange={onChangeRepeatPassword}
                    onBlur={() => validateRepeatPassword()}
                  />
                  <span className='absolute end-0 top-0 p-3' onClick={() => setShowRepeatPassword(!showRepeatPassword)}>
                    {showRepeatPassword ? (
                      <HiEyeOff className='w-5 h-5 text-wt-primary-40 cursor-pointer' />
                    ) : (
                      <HiEye className='w-5 h-5 text-wt-primary-40 cursor-pointer' />
                    )}
                  </span>
                </div>
                <p className='text-red-600 text-xs lg:text-sm xl:text-base font-semibold mt-1'>
                  {errors.repeatPassword}
                </p>
              </div> */}
              <div className='mb-4'>
                <label className='block mb-2 font-bold text-wt-primary-40 dark:text-white'>
                  Password must contain:
                </label>
                <div className='flex flex-row mb-2'>
                  <div className='flex items-center'>
                    {renderValidateInforOfPassword(passwordValidate.minLenght)}
                    <span className='text-wt-primary-40 ml-3'>At least 8 character</span>
                  </div>
                </div>
                <div className='flex flex-row mb-2'>
                  <div className='flex items-center'>
                    {renderValidateInforOfPassword(passwordValidate.lowercase)}
                    <span className='text-wt-primary-40 ml-3'>At least 1 lowercase character</span>
                  </div>
                </div>
                <div className='flex flex-row mb-2'>
                  <div className='flex items-center'>
                    {renderValidateInforOfPassword(passwordValidate.uppercase)}
                    <span className='text-wt-primary-40 ml-3'>At least 1 uppercase character</span>
                  </div>
                </div>
                <div className='flex flex-row mb-2'>
                  <div className='flex items-center'>
                    {renderValidateInforOfPassword(passwordValidate.numberAndSpecialChar)}
                    <span className='text-wt-primary-40 ml-3'>At least 1 number and 1 special character</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className='xl:pt-4 pt-2'>
                <Button
                  type='submit'
                  isLoading={isSubmitting}
                  className='btn btn-blue w-full flex items-center justify-center'
                  onClick={onCreateAccount}
                >
                  <WtCreateAccountBtn className='mr-3' /> Create your account
                </Button>
              </div>
              <div className='flex flex-wrap items-center justify-center pb-4 mt-3'>
                <span className='text-xs lg:text-sm xl:text-base font-normal text-wt-primary-40 dark:text-gray-400 text-center mr-2'>
                  Already have an account?
                </span>

                <Link
                  to={'/sign-in'}
                  className='text-xs lg:text-sm xl:text-base font-bold border-b border-blue-500 bg-gradient-to-b from-blue-500 to-blue-600 dark:text-blue-500 text-transparent bg-clip-text hover:from-blue-700 hover:to-blue-800'
                >
                  Sign In
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
})

export default Step2
