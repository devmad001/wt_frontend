import { useState } from 'react'
import { useAuth } from 'hooks'
import { Button } from 'ui-atoms'
import { WtPasswordInvalid, WtPasswordValid, WtSubmitIcon } from 'ui-atoms/Icons'
import { valiator } from 'utils'
import RegexHelper from 'constant/RegexHelper'
import UIHelperClass from 'constant/UIHelper'
import { ToastControl } from 'utils/toast'

function ChangePassword() {
  const useAuthApi = useAuth()
  const [form, setForm] = useState({
    currentPassword: '',
    password: '',
    repeatPassword: ''
  })
  const [formErrors, setFormErrors] = useState<any>({
    currentPassword: '',
    password: '',
    repeatPassword: ''
  })
  const [passwordValidate, setPasswordValidate] = useState<any>({
    minLenght: false,
    lowercase: false,
    uppercase: false,
    numberAndSpecialChar: false
  })
  const [isSubmitting, setSubmitting] = useState(false)
  const [userInfor, setUserInfo] = useState<any>(null)

  const renderValidateInforOfPassword = (valid: boolean) => {
    return valid ? <WtPasswordValid /> : <WtPasswordInvalid />
  }

  const resetForm = () => {
    setForm({
      currentPassword: '',
      password: '',
      repeatPassword: ''
    })
    setFormErrors({
      currentPassword: '',
      password: '',
      repeatPassword: ''
    })
  }

  const onChangeCurrentPassword = (e: any) => {
    setForm((form: any) => {
      return { ...form, currentPassword: e.target.value }
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

  const validatePassword = (): string => {
    const err = valiator.validate(form.password, {
      required: true,
      pattern: RegexHelper.PASSWORD,
      errorsMessage: { required: 'This field is required.', pattern: 'Password is not strong enough' }
    })
    setFormErrors((errors: any) => {
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
    setFormErrors((errors: any) => {
      return { ...errors, repeatPassword: err || '' }
    })

    if (form.password !== form.repeatPassword) {
      setFormErrors((errors: any) => {
        return { ...errors, repeatPassword: 'Repeat password is incorrect' }
      })
    }

    return err
  }

  const validateForm = (): boolean => {
    const arrRes = []
    arrRes.push(validatePassword())
    arrRes.push(validateRepeatPassword())

    return arrRes.findIndex((x) => x && x.length > 0) < 0
  }

  const submit = () => {
    if (!validateForm()) return

    setSubmitting(true)
    const params: Auth.ChangePasswordParams = {
      currentPassword: form.currentPassword || '',
      newPassword: form.password || ''
    }

    useAuthApi.changePassword({
      params: params,
      callback: {
        onSuccess: (res) => {
          ToastControl.showSuccessMessage('You have successfully changed password')
          resetForm()
          setSubmitting(false)
        },
        onFailure: (err) => {
          ToastControl.showErrorMessage(err)
          setSubmitting(false)
        }
      }
    })
  }

  return (
    <>
      <div className='tabs-content-item'>
        <div className='p-4'>
          <div className='grid grid-cols-12 gap-4'>
            <div className='col-span-6'>
              <div className='mb-4'>
                <label
                  htmlFor='caseFileNumber'
                  className='block mb-2 text-sm font-bold text-wt-primary-40 dark:text-white'
                >
                  Your current password <span className='text-red-600'>*</span>
                </label>
                <input
                  className={['form-control', formErrors.currentPassword ? UIHelperClass.INVALID_CLASS : '']
                    .filter(Boolean)
                    .join(' ')}
                  name='currentPassword'
                  type='text'
                  placeholder='Enter your current password
                    '
                  value={form.currentPassword}
                  disabled={isSubmitting}
                  onChange={onChangeCurrentPassword}
                />
                <p className='text-red-600 mt-1'>{formErrors.currentPassword}</p>
              </div>
            </div>
            <div className='col-span-6'></div>
            <div className='col-span-6'>
              <div className='mb-4'>
                <label
                  htmlFor='caseFileNumber'
                  className='block mb-2 text-sm font-bold text-wt-primary-40 dark:text-white'
                >
                  Your new password <span className='text-red-600'>*</span>
                </label>
                <input
                  className={['form-control', formErrors.password ? UIHelperClass.INVALID_CLASS : '']
                    .filter(Boolean)
                    .join(' ')}
                  name='newpassword'
                  type='text'
                  placeholder='Enter your new password'
                  value={form.password}
                  disabled={isSubmitting}
                  onChange={onChangePassword}
                  onInput={validateDetailPasssword}
                  onBlur={() => validatePassword()}
                />
                <p className='text-red-600 mt-1'>{formErrors.password}</p>
              </div>
            </div>
            <div className='col-span-6'>
              <div className='mb-4'>
                <label
                  htmlFor='caseFileNumber'
                  className='block mb-2 text-sm font-bold text-wt-primary-40 dark:text-white'
                >
                  Repeat new password <span className='text-red-600'>*</span>
                </label>
                <input
                  className={['form-control', formErrors.repeatPassword ? UIHelperClass.INVALID_CLASS : '']
                    .filter(Boolean)
                    .join(' ')}
                  name='newpassword'
                  type='text'
                  placeholder='Repeat your new password'
                  value={form.repeatPassword}
                  disabled={isSubmitting}
                  onChange={onChangeRepeatPassword}
                  onBlur={() => validateRepeatPassword()}
                />
                <p className='text-red-600 mt-1'>{formErrors.repeatPassword}</p>
              </div>
            </div>
          </div>
          <div className='mb-4'>
            <label className='block mb-2 font-bold text-wt-primary-40 dark:text-white'>Password must contain:</label>
            <div className='flex flex-col lg:flex-row gap-3'>
              <div className='flex flex-row mb-2 pr-3 border-r'>
                <div className='flex items-center'>
                  {renderValidateInforOfPassword(passwordValidate.minLenght)}
                  <span className='text-wt-primary-40 ml-3'>At least 8 character</span>
                </div>
              </div>
              <div className='flex flex-row mb-2 pr-3 border-r'>
                <div className='flex items-center'>
                  {renderValidateInforOfPassword(passwordValidate.lowercase)}
                  <span className='text-wt-primary-40 ml-3'>At least 1 lowercase character</span>
                </div>
              </div>
              <div className='flex flex-row mb-2 pr-3 border-r'>
                <div className='flex items-center'>
                  {renderValidateInforOfPassword(passwordValidate.uppercase)}
                  <span className='text-wt-primary-40 ml-3'>At least 1 uppercase character</span>
                </div>
              </div>
              <div className='flex flex-row mb-2 pr-3 border-r'>
                <div className='flex items-center'>
                  {renderValidateInforOfPassword(passwordValidate.numberAndSpecialChar)}
                  <span className='text-wt-primary-40 ml-3'>At least 1 number and 1 special character</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='p-4 border-t border-gray-200'>
          <div className='flex'>
            <Button
              className='flex items-center btn bg-wt-primary-40 hover:bg-wt-primary-45 py-3 rounded-lg font-bold text-white ml-auto'
              type='button'
              isLoading={isSubmitting}
              onClick={() => submit()}
            >
              <WtSubmitIcon className='h-5 w-5 mr-2' />
              Change password
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ChangePassword
