import '../../style.css'

import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth, useCommon } from 'hooks'
import { Button, ReactSelect } from 'ui-atoms'
import { valiator } from 'utils'
import {
  WTArrowRightBg,
  WTTickedCircleOutline,
  WtChooseToolChecked,
  WtChooseToolUncheck,
  WtSpinner
} from 'ui-atoms/Icons'
import { ToggleSwitch } from 'flowbite-react'
import ThemeHelper from 'constant/ThemeHelper'
import AuthHelper from 'constant/AuthHelper'
import { ToastControl } from 'utils/toast'
import { debounce } from 'lodash'

interface Form {
  name: string
  registerType: string | number | null
  agency: string | any
  agencyId: string | any
  chooseTool: number | null
  fieldOffice: string | any
  squad: string | any
  activationCode: string
}

function Step1(props: any) {
  const auth = useAuth()
  const useCommonApi = useCommon()
  const registerType = [
    { value: AuthHelper.RegisterType.SUPER_ADMIN, label: 'Super Admin' },
    { value: AuthHelper.RegisterType.ADMIN, label: 'Admin' },
    { value: AuthHelper.RegisterType.USER, label: 'User' }
  ]
  const chooseToolOptions = [
    { value: 1, label: 'FinAware', desc: 'description and price here' },
    { value: 2, label: 'Track', desc: 'description and price here' },
    { value: 3, label: 'Both', desc: 'description and price here' }
  ]
  const [form, setForm] = useState<Form>({
    name: '',
    registerType: AuthHelper.RegisterType.SUPER_ADMIN,
    agency: '',
    agencyId: '',
    chooseTool: 3,
    fieldOffice: '',
    squad: '',
    activationCode: ''
  })
  const [errors, setErrors] = useState<any>({
    name: '',
    registerType: '',
    agency: '',
    chooseTool: '',
    fieldOffice: '',
    squad: '',
    activationCode: ''
  })
  const fieldOfficeSelectRef = useRef<any>(null)
  const [toolType, setToolType] = useState('')
  const [squadToggle, setSquadToggle] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [timer, setTimer] = useState<any>(null)
  const [activationCodeValid, setActiviationCodeValid] = useState(false)
  const [isCheckingActivationCode, setIsCheckingActivationCode] = useState(false)
  const [fieldOfficeOptions, setFieldOfficeOptions] = useState<any[]>([])
  const [squadOptions, setSquadOptions] = useState<any[]>([])

  const statusActivationCode = (props: any = null) => {
    if (isCheckingActivationCode) {
      return <WtSpinner className='inline w-4 h-4 mr-3 text-blue-500 animate-spin' />
    }
    if (activationCodeValid && !isCheckingActivationCode) {
      return <WTTickedCircleOutline className='' />
    }
    return <></>
  }

  const onChangeName = (e: any) => {
    setForm((form: any) => {
      return { ...form, name: e.target.value }
    })
  }

  const onChangeRegistertype = (e: any) => {
    setForm((form: any) => {
      return {
        ...form,
        registerType: e.target.value,
        agency: '',
        fieldOffice: null,
        squad: null,
        activationCode: ''
      }
    })
    setErrors((current: any) => {
      return {
        ...current,
        agency: '',
        chooseTool: '',
        fieldOffice: '',
        squad: '',
        activationCode: ''
      }
    })
    setSquadToggle(false)
    setIsCheckingActivationCode(false)
    setActiviationCodeValid(false)
  }

  const onChangeAgency = (e: any) => {
    setForm((form: any) => {
      return { ...form, agency: e.target.value }
    })
  }

  const onChangeChooseTool = (e: any) => {
    setForm((form: any) => {
      return { ...form, chooseTool: e.target.value }
    })
  }

  const onChangeActivationCode = (e: any) => {
    setForm((form: any) => {
      return { ...form, activationCode: e.target.value }
    })

    setActiviationCodeValid(false)

    if (!e.target.value) return

    clearTimeout(timer)

    const newTimer = setTimeout(() => {
      checkActivationCode(e.target.value)
    }, 500)

    setTimer(newTimer)
  }

  const onChangeFieldOffice = (e: any) => {
    setForm((form: any) => {
      return { ...form, fieldOffice: e, squad: null }
    })

    requestSquads(e.value)
  }

  const onChangeToggleSquad = (e: any) => {
    setSquadToggle(e)
    if (!e) {
      setForm((form: any) => {
        return { ...form, squad: null }
      })
    }
  }

  const onChangeSquad = (e: any) => {
    setForm((form: any) => {
      return { ...form, squad: e }
    })
  }

  const validateName = (): string => {
    const err = valiator.validate(form.name, {
      required: true,
      errorsMessage: { required: 'This field is required.' }
    })
    setErrors((errors: any) => {
      return { ...errors, name: err || '' }
    })

    return err
  }

  const validateAgency = (): string => {
    if (form.registerType != AuthHelper.RegisterType.SUPER_ADMIN) {
      setErrors((errors: any) => {
        return { ...errors, agency: '' }
      })

      return ''
    }

    const err = valiator.validate(form.agency, {
      required: true,
      errorsMessage: { required: 'This field is required.' }
    })
    setErrors((errors: any) => {
      return { ...errors, agency: err || '' }
    })

    return err
  }

  const validateActivationCode = (): string => {
    if (form.registerType == AuthHelper.RegisterType.SUPER_ADMIN) {
      setErrors((errors: any) => {
        return { ...errors, activationCode: '' }
      })

      return ''
    }

    if (form.activationCode && errors.activationCode === 'Your activation code is invalid') {
      return errors.activationCode
    }

    const err = valiator.validate(form.activationCode, {
      required: true,
      errorsMessage: { required: 'This field is required.' }
    })
    setErrors((errors: any) => {
      return { ...errors, activationCode: err || '' }
    })

    return err
  }

  const validateFieldOffice = (): string => {
    if (form.registerType != AuthHelper.RegisterType.SUPER_ADMIN) {
      const err = valiator.validate(form.fieldOffice, {
        required: true,
        errorsMessage: { required: 'This field is required.' }
      })
      setErrors((errors: any) => {
        return { ...errors, fieldOffice: err || '' }
      })
      return err
    } else {
      setErrors((errors: any) => {
        return { ...errors, fieldOffice: '' }
      })
      return ''
    }
  }

  const validateSquad = (): string => {
    if (form.registerType == AuthHelper.RegisterType.USER) {
      const err = valiator.validate(form.squad, {
        required: true,
        errorsMessage: { required: 'This field is required.' }
      })
      setErrors((errors: any) => {
        return { ...errors, squad: err || '' }
      })
      return err
    } else {
      setErrors((errors: any) => {
        return { ...errors, squad: '' }
      })
      return ''
    }
  }

  const validateForm = (): boolean => {
    const arrRes = []
    arrRes.push(validateName())
    arrRes.push(validateActivationCode())
    arrRes.push(validateAgency())
    arrRes.push(validateFieldOffice())
    arrRes.push(validateSquad())

    return arrRes.findIndex((x) => x && x.length > 0) < 0
  }

  const getChooseToolOption = (memberships: string[]) => {
    if (memberships?.length >= 2) {
      return 3
    }
    if (memberships?.length == 1) {
      if (memberships[0] === AuthHelper.MembershipType.FINAWARE) return 1
      if (memberships[0] === AuthHelper.MembershipType.TRACKER) return 2
    }
  }

  const getToolTypeLabel = (value: any) => {
    switch (value) {
      case 1:
        return 'FinAware'
      case 2:
        return 'Track'
      case 3:
        return 'Both'
      default:
        return ''
    }
  }

  const checkActivationCode = (activationCode: string) => {
    setIsCheckingActivationCode(true)
    auth.checkActivationCode({
      id: activationCode || '',
      callback: {
        onSuccess: (res) => {
          if (!res) {
            setErrors((errors: any) => {
              return { ...errors, activationCode: 'Your activation code is invalid' }
            })
            setActiviationCodeValid(false)
            return
          }

          setIsCheckingActivationCode(false)
          setErrors((errors: any) => {
            return { ...errors, activationCode: '' }
          })
          setActiviationCodeValid(true)
          setForm((form: any) => {
            return { ...form, agency: res?.name, agencyId: res?._id, chooseTool: getChooseToolOption(res?.memberships) }
          })

          requestFieldOffices(res?._id)
        },
        onFailure: (err) => {
          setIsCheckingActivationCode(false)
          setErrors((errors: any) => {
            return { ...errors, activationCode: 'Your activation code is invalid' }
          })
          setActiviationCodeValid(false)
        }
      }
    })
  }

  const requestFieldOffices = (id: string) => {
    useCommonApi.getFieldOfficesByAgency({
      id: id,
      callback: {
        onSuccess: (res: any) => {
          const arr = res?.map((x: any) => {
            return {
              value: x._id,
              label: x.name
            }
          })
          setFieldOfficeOptions(arr)
        },
        onFailure: (err) => {
          setFieldOfficeOptions([])
        }
      }
    })
  }

  const requestSquads = (id: string) => {
    useCommonApi.getSquadByOfficeId({
      id: id,
      callback: {
        onSuccess: (res: any) => {
          const arr = res?.map((x: any) => {
            return {
              value: x._id,
              label: x.name
            }
          })
          setSquadOptions(arr)
        },
        onFailure: (err) => {
          setSquadOptions([])
        }
      }
    })
  }

  const getMemberships = (value: any) => {
    if (value == 1) return [AuthHelper.MembershipType.FINAWARE]
    if (value == 2) return [AuthHelper.MembershipType.TRACKER]
    if (value == 3) return [AuthHelper.MembershipType.FINAWARE, AuthHelper.MembershipType.TRACKER]
    return []
  }

  const submitForm = (event: any) => {
    event.preventDefault()

    if (!validateForm()) return

    let params: Auth.RegisterParams = {
      registerType: form.registerType?.toString() || '',
      activationCode: '',
      memberships: [],
      email: '',
      password: '',
      agency: '',
      fieldOffice: '',
      squad: '',
      fullName: form.name || '',
      phone: ''
    }

    if (form.registerType == AuthHelper.RegisterType.SUPER_ADMIN) {
      params = {
        ...params,
        agencyName: form.agency || '',
        memberships: getMemberships(form.chooseTool),
        agency: undefined,
        fieldOffice: undefined,
        squad: undefined
      }
    } else if (form.registerType == AuthHelper.RegisterType.ADMIN) {
      params = {
        ...params,
        activationCode: form.activationCode || '',
        agency: form.agencyId || '',
        memberships: getMemberships(form.chooseTool),
        squad: squadToggle ? form.squad?.value || undefined : undefined,
        fieldOffice: form.fieldOffice?.value || ''
      }
    } else if (form.registerType == AuthHelper.RegisterType.USER) {
      params = {
        ...params,
        activationCode: form.activationCode || '',
        agency: form.agencyId || '',
        memberships: getMemberships(form.chooseTool),
        squad: form.squad?.value || undefined,
        fieldOffice: form.fieldOffice?.value || ''
      }
    }

    props?.onNext & props?.onNext(params)
  }

  return (
    <div className='w-full min-h-screen flex items-center justify-center py-10 md:py-3'>
      <div className='w-[80%] lg:w-[70%] py-24 bg-white rounded-lg dark:bg-gray-800'>
        <div className='w-full h-full'>
          <form className='h-full' onSubmit={(e: any) => submitForm(e)}>
            <div className='step-header w-full'>
              <p className='text-gray-350 text-xs xl:text-sm font-bold mb-3'>Step 1 of 2</p>
              <h2 className='text-lg lg:text-2xl font-bold text-black-500 dark:text-white'>
                {'Registration ' +
                  (form.registerType == AuthHelper.RegisterType.SUPER_ADMIN
                    ? ' As Super Admin'
                    : form.registerType == AuthHelper.RegisterType.ADMIN
                    ? ' As Admin'
                    : form.registerType == AuthHelper.RegisterType.USER
                    ? ' As User'
                    : '')}
              </h2>
            </div>
            <div className='lg:my-24 my-12'>
              <div className='mb-4'>
                <label htmlFor='name' className='block mb-2 font-bold text-wt-primary-40 dark:text-white'>
                  Name <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  name='name'
                  id='name'
                  className={['form-control', errors.name ? 'invalid' : ''].filter(Boolean).join(' ')}
                  placeholder='Enter your name'
                  disabled={isSubmitting}
                  value={form.name || ''}
                  onChange={onChangeName}
                  onBlur={() => validateName()}
                />
                <p className='text-red-600 text-xs lg:text-sm xl:text-base font-semibold mt-1'>{errors.name}</p>
              </div>
              <div className='mb-4'>
                <label className='block mb-2 font-bold text-wt-primary-40 dark:text-white'>
                  Register type <span className='text-red-500'>*</span>
                </label>
                <div className='flex items-center'>
                  {registerType.map((item) => (
                    <div key={item.value} className='flex flex-row items-center cursor-pointer px-1 mr-4'>
                      <input
                        id={'registerType_' + item.value}
                        className='radio-btn w-5 h-5'
                        name='registerType'
                        type='radio'
                        value={item.value}
                        disabled={isSubmitting}
                        checked={form.registerType == item.value}
                        onChange={onChangeRegistertype}
                      />
                      <label
                        htmlFor={'registerType_' + item.value}
                        className='cursor-pointer text-bold text-center text-wt-primary-40 ml-2'
                      >
                        {item.label}
                      </label>
                    </div>
                  ))}
                </div>
                <p className='text-red-600 text-xs lg:text-sm xl:text-base font-semibold mt-1'>{errors.registerType}</p>
              </div>
              {form.registerType == AuthHelper.RegisterType.SUPER_ADMIN ? (
                <>
                  <div className='mb-4'>
                    <label htmlFor='agency' className='block mb-2 font-bold text-wt-primary-40 dark:text-white'>
                      Agency or company name <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='text'
                      name='agency'
                      id='agency'
                      className={['form-control', errors.agency ? 'invalid' : ''].filter(Boolean).join(' ')}
                      placeholder='Enter agency or company name'
                      disabled={isSubmitting}
                      value={form.agency || ''}
                      onChange={onChangeAgency}
                      onBlur={() => validateAgency()}
                    />
                    <p className='text-red-600 text-xs lg:text-sm xl:text-base font-semibold mt-1'>{errors.agency}</p>
                  </div>
                  <div className='mb-4'>
                    <label htmlFor='name' className='block mb-2 font-bold text-wt-primary-40 dark:text-white'>
                      Choose tool(s) <span className='text-red-500'>*</span>
                    </label>
                    <div className='choose-tools mt-3'>
                      {chooseToolOptions.map((item) => (
                        <div key={item.value} className='flex mr-4'>
                          <input
                            id={'chooseTool_' + item.value}
                            className='radio-btn w-5 h-5 hidden'
                            name='chooseTool'
                            type='radio'
                            value={item.value}
                            disabled={isSubmitting}
                            checked={form.chooseTool == item.value}
                            onChange={onChangeChooseTool}
                          />
                          <label
                            htmlFor={'chooseTool_' + item.value}
                            className={['item ', form.chooseTool == item.value ? 'checked' : 'unchecked']
                              .filter(Boolean)
                              .join(' ')}
                          >
                            <span className='title'>{item.label}</span>
                            <span className='desc mt-3'>{item.desc}</span>
                            <span className='icon'>
                              {form.chooseTool == item.value ? <WtChooseToolChecked /> : <WtChooseToolUncheck />}
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                    <p className='text-red-600 text-xs lg:text-sm xl:text-base font-semibold mt-1'>
                      {errors.chooseTool}
                    </p>
                  </div>
                </>
              ) : (
                ''
              )}
              {form.registerType == AuthHelper.RegisterType.ADMIN ? (
                <>
                  <div className='mb-4'>
                    <label htmlFor='activationCode' className='block mb-2 font-bold text-wt-primary-40 dark:text-white'>
                      Your Activation Code <span className='text-red-500'>*</span>
                    </label>
                    <div className='relative'>
                      <input
                        type='text'
                        name='activationCode'
                        id='activationCode'
                        className={['form-control', errors.activationCode ? 'invalid' : ''].filter(Boolean).join(' ')}
                        placeholder='Enter activation code'
                        disabled={isSubmitting}
                        value={form.activationCode || ''}
                        onChange={onChangeActivationCode}
                        onBlur={() => validateActivationCode()}
                      />
                      <span className='absolute end-0 top-0 p-3'>{statusActivationCode()}</span>
                    </div>
                    <p className='text-red-600 text-xs lg:text-sm xl:text-base font-semibold mt-1'>
                      {errors.activationCode}
                    </p>
                  </div>
                  {activationCodeValid && !isCheckingActivationCode ? (
                    <>
                      <hr className='mb-4' />
                      <div className='mb-4'>
                        <label className='block mb-2 font-bold text-wt-primary-40 dark:text-white'>
                          Agency or company name
                        </label>
                        <div className='relative'>
                          <input
                            type='text'
                            name='agency'
                            className='form-control'
                            placeholder='Enter agency or company name'
                            value={form.agency || ''}
                            disabled
                          />
                          <span className='absolute end-0 top-0 p-3'>
                            <WTTickedCircleOutline className='' />
                          </span>
                        </div>
                      </div>
                      <div className='mb-4'>
                        <label className='block mb-2 font-bold text-wt-primary-40 dark:text-white'>
                          Field office <span className='text-red-500'>*</span>
                        </label>
                        <ReactSelect
                          aria-invalid={errors.fieldOffice ? true : false}
                          options={fieldOfficeOptions}
                          value={form.fieldOffice}
                          menuPosition={'fixed'}
                          defaultOptions
                          isDisabled={isSubmitting}
                          closeMenuOnSelect={true}
                          onChange={onChangeFieldOffice}
                          onBlur={validateFieldOffice}
                        />
                        <p className='text-red-600 text-xs lg:text-sm xl:text-base font-semibold mt-1'>
                          {errors.fieldOffice}
                        </p>
                      </div>
                      <div className='mb-4'>
                        <label className='block mb-2 font-bold text-wt-primary-40 dark:text-white'>Tool type</label>
                        <div className='relative'>
                          <input
                            type='text'
                            className='form-control'
                            placeholder=''
                            value={getToolTypeLabel(form.chooseTool)}
                            disabled
                          />
                          <span className='absolute end-0 top-0 p-3'>
                            <WTTickedCircleOutline className='' />
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    ''
                  )}
                </>
              ) : (
                ''
              )}
              {form.registerType == AuthHelper.RegisterType.USER ? (
                <>
                  <div className='mb-4'>
                    <label htmlFor='activationCode' className='block mb-2 font-bold text-wt-primary-40 dark:text-white'>
                      Your Activation Code <span className='text-red-500'>*</span>
                    </label>
                    <div className='relative'>
                      <input
                        type='text'
                        name='activationCode'
                        id='activationCode'
                        className={['form-control', errors.activationCode ? 'invalid' : ''].filter(Boolean).join(' ')}
                        placeholder='Enter activation code'
                        disabled={isSubmitting}
                        value={form.activationCode || ''}
                        onChange={onChangeActivationCode}
                        onBlur={() => validateActivationCode()}
                      />
                      <span className='absolute end-0 top-0 p-3'>{statusActivationCode()}</span>
                    </div>
                    <p className='text-red-600 text-xs lg:text-sm xl:text-base font-semibold mt-1'>
                      {errors.activationCode}
                    </p>
                  </div>
                  {activationCodeValid && !isCheckingActivationCode ? (
                    <>
                      <hr className='mb-4' />
                      <div className='mb-4'>
                        <label className='block mb-2 font-bold text-wt-primary-40 dark:text-white'>
                          Agency or company name
                        </label>
                        <div className='relative'>
                          <input
                            type='text'
                            name='agency'
                            className='form-control'
                            placeholder='Enter agency or company name'
                            value={form.agency || ''}
                            disabled
                          />
                          <span className='absolute end-0 top-0 p-3'>
                            <WTTickedCircleOutline className='' />
                          </span>
                        </div>
                      </div>
                      <div className='mb-4'>
                        <label className='block mb-2 font-bold text-wt-primary-40 dark:text-white'>
                          Field office <span className='text-red-500'>*</span>
                        </label>
                        <ReactSelect
                          aria-invalid={errors.fieldOffice ? true : false}
                          options={fieldOfficeOptions}
                          value={form.fieldOffice}
                          menuPosition={'fixed'}
                          defaultOptions
                          isDisabled={isSubmitting}
                          closeMenuOnSelect={true}
                          onChange={onChangeFieldOffice}
                          onBlur={validateFieldOffice}
                        />
                        <p className='text-red-600 text-xs lg:text-sm xl:text-base font-semibold mt-1'>
                          {errors.fieldOffice}
                        </p>
                      </div>
                      <div className='mb-4'>
                        <label className='block mb-2 font-bold text-wt-primary-40 dark:text-white'>
                          Squad <span className='text-red-500'>*</span>
                        </label>
                        <ReactSelect
                          aria-invalid={errors.fieldOffice ? true : false}
                          options={squadOptions}
                          value={form.squad}
                          menuPosition={'fixed'}
                          defaultOptions
                          isDisabled={isSubmitting}
                          closeMenuOnSelect={true}
                          onChange={onChangeSquad}
                          onBlur={validateSquad}
                        />
                        <p className='text-red-600 text-xs lg:text-sm xl:text-base font-semibold mt-1'>
                          {errors.squad}
                        </p>
                      </div>
                    </>
                  ) : (
                    ''
                  )}
                </>
              ) : (
                ''
              )}
            </div>

            <div>
              <div className='xl:pt-4 pt-2'>
                <Button
                  type='submit'
                  isLoading={isSubmitting}
                  className='btn btn-blue w-full flex items-center justify-center'
                >
                  Continue <WTArrowRightBg className='ml-3' />
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
}

export default Step1
