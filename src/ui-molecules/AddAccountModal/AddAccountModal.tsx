import { Modal } from 'flowbite-react'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { AgencySelect, Button, IconSvg, ReactSelect } from 'ui-atoms'
import { getOption, valiator } from 'utils'
import addIcon from 'assets/media/image/profile-add.png'
import { Role } from 'constant'
import RegexHelper from 'constant/RegexHelper'
import { useAuth, useFieldOffice, useUserManagement, useSquad, useAgency } from 'hooks'
import { ToastControl } from 'utils/toast'
import { getUserInfo, getUserScopeInfo } from 'utils'
import './style.css'
import AuthHelper from 'constant/AuthHelper'

interface Form {
  fullName: string
  role: string
  phone: string
  email: string
  agency: string | any
  fieldOffice: string | any
  squad: string | any
}

const roleOptionsOfAdmin = [
  {
    label: 'User',
    value: Role.USER
  }
]

const roleOptionsOfSuperAdmin = [
  {
    label: 'User',
    value: Role.USER
  },
  {
    label: 'Admin',
    value: Role.ADMIN
  }
]

const roleOptionsOfTechOwner = [
  {
    label: 'Super Admin',
    value: Role.SUPER_ADMIN
  },
  {
    label: 'Admin',
    value: Role.ADMIN
  },
  {
    label: 'User',
    value: Role.USER
  }
]

const AddAccountModal = forwardRef((props: any, ref: any) => {
  const userManagementHook = useUserManagement()
  const auth = useAuth()
  const agency = useAgency()
  const fieldOffice = useFieldOffice()
  const squad = useSquad()
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false)
  const [agencyOptions, setAgencyOptions] = useState<any[]>([])
  const [fieldOfficeOptions, setFieldOfficeOptions] = useState<any[]>([])
  const [squadOptions, setSquadOptions] = useState<any[]>([])
  const [userInfo, setUserInfo] = useState<User.Details>()
  const [role, setRole] = useState(getUserInfo())
  const [form, setForm] = useState<Form>({
    fullName: '',
    role: '',
    phone: '',
    email: '',
    agency: '',
    fieldOffice: '',
    squad: ''
  })
  const [formError, setFormErrors] = useState<Form>({
    fullName: '',
    role: '',
    phone: '',
    email: '',
    agency: '',
    fieldOffice: '',
    squad: ''
  })
  const [agencySelected, setAgencySelected] = useState<any>(null)

  useEffect(() => {
    const userScope: Auth.ScopeInfo = getUserScopeInfo()
    setRole(userScope?.role)
    setUserInfo(getUserInfo())
  }, [])

  useEffect(() => {
    if (openModal && userInfo) {
      getProfile()
    }
  }, [openModal])

  useEffect(() => {
    if (form.agency) {
      const params: FieldOffice.GetListParams = {
        key: '',
        page: 1,
        limit: 10,
        agency: form.agency
      }
      getFieldOfficeOptions(params)
    }
  }, [form.agency])

  useEffect(() => {
    if (form.fieldOffice) {
      const params: Squad.GetListParams = {
        key: '',
        page: 1,
        limit: 10,
        agency: form.agency,
        fieldOffice: form.fieldOffice
      }
      getSquadOptions(params)
    }
  }, [form.fieldOffice])

  useImperativeHandle(ref, () => ({
    showModal
  }))

  const getProfile = () => {
    setIsLoading(true)
    auth.getMyProfile({
      callback: {
        onSuccess: (res) => {
          setForm((form: any) => {
            return {
              ...form,
              agency: res?.agency?._id,
              fieldOffice: res?.fieldOffice?._id,
              squad: res?.squad?._id
            }
          })
          res?.agency
            ? setAgencySelected({
                value: res?.agency?._id,
                label: res?.agency?.name
              })
            : setAgencySelected(null)
          setIsLoading(false)
        },
        onFailure: (err) => {
          ToastControl.showErrorMessage(err)
          setIsLoading(false)
        }
      }
    })
  }

  const getFieldOfficeOptions = (params: FieldOffice.GetListParams) => {
    setIsLoading(true)
    fieldOffice.getFieldOfficesByAgency({
      params: params,
      callback: {
        onSuccess: (res) => {
          setFieldOfficeOptions(
            res?.items.map((item: any) => {
              return {
                value: item?._id,
                label: item?.name
              }
            })
          )
          setIsLoading(false)
        },
        onFailure: (err) => {
          ToastControl.showErrorMessage(err)
          setIsLoading(false)
        }
      }
    })
  }

  const getSquadOptions = (params: Squad.GetListParams) => {
    setIsLoading(true)
    squad.getSquadByFieldOffice({
      params: params,
      callback: {
        onSuccess: (res) => {
          setSquadOptions(
            res?.items.map((item: any) => {
              return {
                value: item?._id,
                label: item?.name
              }
            })
          )
          setIsLoading(false)
        },
        onFailure: (err) => {
          ToastControl.showErrorMessage(err)
          setIsLoading(false)
        }
      }
    })
  }

  const createUser = (params: User.CreateUserParams) => {
    setIsSubmitting(true)
    userManagementHook.createUser({
      params: params,
      callback: {
        onSuccess: (res) => {
          if (props?.reloadPage) {
            props?.reloadPage()
          }

          setIsSubmitting(false)
          hideModal()
        },
        onFailure: (err) => {
          ToastControl.showErrorMessage(err)
          setIsSubmitting(false)
        }
      }
    })
  }

  const onChangedAgency = (e: any) => {
    if (e) {
      setAgencySelected(e)
      setForm((form: any) => {
        return { ...form, agency: e.value }
      })
    } else {
      setAgencySelected(null)
      setForm((form: any) => {
        return { ...form, agency: null }
      })
    }
  }

  const onChangeFieldOffice = (e: any) => {
    setForm((form: any) => {
      return { ...form, fieldOffice: e.value, squad: '' }
    })
  }

  const onChangeInput = (e: any) => {
    setForm((form: any) => {
      return { ...form, [e.target.name]: e.target.value }
    })
  }

  const onChangeSquad = (e: any) => {
    setForm((form: any) => {
      return { ...form, squad: e.value }
    })
  }

  const onChangeRole = (e: any) => {
    setForm((form: any) => {
      return { ...form, role: e.value }
    })
  }

  const validateRequired = (fieldName: keyof Form): string => {
    const err = valiator.validate(form[fieldName], {
      required: true,
      errorsMessage: { required: 'This field is required.' }
    })

    setFormErrors((errors: any) => {
      return { ...errors, [fieldName]: err || '' }
    })

    return err
  }

  const validateFieldOffice = (): string => {
    if (form.role == AuthHelper.RoleType.SUPER_ADMIN) {
      setFormErrors((errors: any) => {
        return { ...errors, fieldOffice: '' }
      })
      return ''
    }

    const err = valiator.validate(form.fieldOffice, {
      required: true,
      errorsMessage: { required: 'This field is required.' }
    })

    setFormErrors((errors: any) => {
      return { ...errors, fieldOffice: err || '' }
    })

    return err
  }

  const validateEmail = (): string => {
    const err = valiator.validate(form.email, {
      pattern: RegexHelper.EMAIL,
      required: true,
      errorsMessage: { required: 'This field is required.' }
    })

    setFormErrors((errors: any) => {
      return { ...errors, email: err || '' }
    })

    return err
  }

  const validateAgency = () => {
    if (role === AuthHelper.RoleType.TECH_OWNER) {
      const err = valiator.validate(form.agency, {
        required: true,
        errorsMessage: { required: 'This field is required.' }
      })

      setFormErrors((errors: any) => {
        return { ...errors, agency: err || '' }
      })

      return err
    }
    setFormErrors((errors: any) => {
      return { ...errors, agency: '' }
    })
    return ''
  }

  const validateForm = (): boolean => {
    const arrRes = []
    arrRes.push(validateRequired('agency'))
    arrRes.push(validateFieldOffice())
    arrRes.push(validateRequired('fullName'))
    arrRes.push(validateRequired('phone'))
    arrRes.push(validateRequired('role'))
    arrRes.push(validateEmail())
    arrRes.push(validateAgency())

    if (form.role == AuthHelper.RoleType.USER) {
      arrRes.push(validateRequired('squad'))
    }

    return arrRes.findIndex((x) => x && x.length > 0) < 0
  }

  const submitForm = (e: any) => {
    e.preventDefault()

    if (!validateForm()) return

    createUser(form as User.CreateUserParams)
  }

  const showModal = () => {
    setOpenModal(true)
  }

  const hideModal = () => {
    setOpenModal(false)
    setForm({
      fullName: '',
      role: '',
      phone: '',
      email: '',
      agency: '',
      fieldOffice: '',
      squad: ''
    })
    setFormErrors({
      fullName: '',
      role: '',
      phone: '',
      email: '',
      agency: '',
      fieldOffice: '',
      squad: ''
    })
    setAgencyOptions([])
    setFieldOfficeOptions([])
    setSquadOptions([])
  }

  return (
    <>
      <Modal show={openModal} size={'xl'} id='addLibraryModal' onClose={() => (!isSubmitting ? hideModal() : null)}>
        <div className='flex items-center rounded-t dark:border-gray-600 border-b p-4'>
          <img src={addIcon} />
          <h3 className='text-lg font-bold text-wt-primary-40 dark:text-white ml-2 mb-0'>Add Account</h3>
          <button
            aria-label='Close'
            className='ml-auto inline-flex items-center p-1'
            type='button'
            onClick={() => (!isSubmitting ? hideModal() : null)}
          >
            <IconSvg icon='closeModalCircle' />
          </button>
        </div>
        <Modal.Body className='p-0'>
          <form className='flex flex-col space-y-2 p-4' onSubmit={(e: any) => submitForm(e)}>
            <div>
              <label htmlFor='fullName' className='text-wt-primary-40 text-xs font-semibold'>
                Name <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                id='fullName'
                name='fullName'
                placeholder='Enter name'
                value={form.fullName || ''}
                onChange={onChangeInput}
                onBlur={() => validateRequired('fullName')}
                disabled={isSubmitting}
                className={['form-control form-gray', formError.fullName ? 'invalid' : ''].filter(Boolean).join(' ')}
              />
              <p className='error-message text-xs mt-1 font-semibold'>{formError.fullName}</p>
            </div>
            <div className='grid grid-cols-2 space-x-4'>
              <div>
                <label htmlFor='role' className='text-wt-primary-40 text-xs font-semibold'>
                  Role <span className='text-red-500'>*</span>
                </label>
                <ReactSelect
                  aria-invalid={formError.role ? true : false}
                  options={
                    role == AuthHelper.RoleType.ADMIN
                      ? roleOptionsOfAdmin
                      : role == AuthHelper.RoleType.SUPER_ADMIN
                      ? roleOptionsOfSuperAdmin
                      : role == AuthHelper.RoleType.TECH_OWNER
                      ? roleOptionsOfTechOwner
                      : []
                  }
                  menuPosition={'fixed'}
                  isDisabled={isSubmitting}
                  closeMenuOnSelect={true}
                  onChange={onChangeRole}
                  onBlur={() => validateRequired('role')}
                  className='react-select-container'
                  classNamePrefix='react-select'
                />
                <p className='error-message text-xs mt-1 font-semibold'>{formError.role}</p>
              </div>
              <div>
                <label htmlFor='phone' className='text-wt-primary-40 text-xs font-semibold'>
                  Phone Number <span className='text-red-500'>*</span>
                </label>
                <input
                  type='tel'
                  id='phone'
                  name='phone'
                  placeholder='Enter phone number'
                  value={form.phone || ''}
                  onChange={onChangeInput}
                  onBlur={() => validateRequired('phone')}
                  disabled={isSubmitting}
                  className={['form-control form-gray', formError.phone ? 'invalid' : ''].filter(Boolean).join(' ')}
                />
                <p className='error-message text-xs mt-1 font-semibold'>{formError.phone}</p>
              </div>
            </div>
            <div>
              <label htmlFor='email' className='text-wt-primary-40 text-xs font-semibold'>
                Email <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                id='email'
                name='email'
                placeholder='Enter email'
                value={form.email || ''}
                onChange={onChangeInput}
                onBlur={validateEmail}
                disabled={isSubmitting}
                className={['form-control form-gray', formError.email ? 'invalid' : ''].filter(Boolean).join(' ')}
              />
              <p className='error-message text-xs mt-1 font-semibold'>{formError.email}</p>
            </div>
            <div>
              <label htmlFor='agency' className='text-wt-primary-40 text-xs font-semibold'>
                Agency <span className='text-red-500'>*</span>
              </label>
              <AgencySelect
                aria-invalid={formError.agency ? true : false}
                value={agencySelected}
                isDisabled={isSubmitting || role != AuthHelper.RoleType.TECH_OWNER}
                onChange={onChangedAgency}
                onBlur={validateAgency}
              />
              <p className='error-message text-xs mt-1 font-semibold'>{formError.agency}</p>
            </div>
            <div className='grid grid-cols-2 space-x-4'>
              <div>
                <label htmlFor='fieldOffice' className='text-wt-primary-40 text-xs font-semibold'>
                  Field Office {form.role != AuthHelper.RoleType.SUPER_ADMIN && <span className='text-red-500'>*</span>}
                </label>
                <ReactSelect
                  aria-invalid={formError.fieldOffice ? true : false}
                  options={fieldOfficeOptions}
                  value={getOption(form.fieldOffice, fieldOfficeOptions)}
                  menuPosition={'fixed'}
                  isDisabled={isSubmitting || role == AuthHelper.RoleType.ADMIN}
                  closeMenuOnSelect={true}
                  onChange={onChangeFieldOffice}
                  onBlur={() => validateFieldOffice()}
                  className='react-select-container'
                  classNamePrefix='react-select'
                  isLoading={isLoading}
                />
                <p className='error-message text-xs mt-1 font-semibold'>{formError.fieldOffice}</p>
              </div>
              <div>
                <label htmlFor='squad' className='text-wt-primary-40 text-xs font-semibold'>
                  Squad
                </label>
                <ReactSelect
                  aria-invalid={formError.squad ? true : false}
                  options={squadOptions}
                  value={getOption(form.squad, squadOptions)}
                  menuPosition={'fixed'}
                  isDisabled={isSubmitting}
                  closeMenuOnSelect={true}
                  onChange={onChangeSquad}
                  className='react-select-container'
                  classNamePrefix='react-select'
                  isLoading={isLoading}
                />
                {form.role == AuthHelper.RoleType.USER && (
                  <p className='error-message text-xs mt-1 font-semibold'>{formError.squad}</p>
                )}
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer className='py-3'>
          <div className='flex items-center justify-end w-full'>
            <div>
              <Button
                className='text-white text-sm font-semibold h-10 px-5 bg-wt-primary-75 hover:bg-wt-primary-75/80 rounded-md'
                type='button'
                disabled={isSubmitting}
                onClick={() => hideModal()}
              >
                Cancel
              </Button>
            </div>
            <div>
              <Button
                className='text-white text-sm font-bold h-10 px-5 bg-wt-orange-1 hover:bg-wt-orange-1/80 rounded-md flex items-center ml-2'
                type='button'
                isLoading={isSubmitting}
                onClick={(e: any) => submitForm(e)}
              >
                <IconSvg icon='addSquare' />
                <span className='ml-2'>Add User</span>
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  )
})

export default AddAccountModal
