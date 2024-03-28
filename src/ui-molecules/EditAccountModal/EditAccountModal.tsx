import { Modal } from 'flowbite-react'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { Button, IconSvg, ReactSelect } from 'ui-atoms'
import { getOption, valiator } from 'utils'
import addIcon from 'assets/media/image/profile-add.png'
import { userRoles, Role } from 'constant'
import RegexHelper from 'constant/RegexHelper'
import { useUserManagement, useFieldOffice, useSquad } from 'hooks'
import { ToastControl } from 'utils/toast'
import { getUserScopeInfo } from 'utils'
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

const EditAccountModal = forwardRef((props: any, ref: any) => {
  const userManagementHook = useUserManagement()
  const fieldOffice = useFieldOffice()
  const squad = useSquad()
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false)
  const [agencyOptions, setAgencyOptions] = useState<any[]>([])
  const [fieldOfficeOptions, setFieldOfficeOptions] = useState<any[]>([])
  const [squadOptions, setSquadOptions] = useState<any[]>([])
  const [userId, setUserId] = useState<string>('')
  const role = getUserScopeInfo()?.role
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

  useEffect(() => {
    if (openModal && userId) {
      getUserDetail()
    }
  }, [openModal])

  useImperativeHandle(ref, () => ({
    showModal,
    setUserId
  }))

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
        onSuccess: (res: any) => {
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
        onFailure: (err: any) => {
          ToastControl.showErrorMessage(err)
          setIsLoading(false)
        }
      }
    })
  }

  const getUserDetail = () => {
    setIsLoading(true)
    userManagementHook.getUserById({
      id: userId,
      callback: {
        onSuccess: (res) => {
          setForm((form: any) => {
            return {
              fullName: res?.fullName,
              role: res?.role,
              phone: res?.phone,
              email: res?.email,
              agency: res?.agency?._id,
              fieldOffice: res?.fieldOffice?._id,
              squad: res?.squad?._id
            }
          })
          setAgencyOptions([
            {
              value: res?.agency?._id,
              label: res?.agency?.name
            }
          ])
          setIsLoading(false)
        },
        onFailure: (err) => {
          ToastControl.showErrorMessage(err)
          setIsLoading(false)
        }
      }
    })
  }

  const editUser = (params: User.UpdateUserParams) => {
    setIsSubmitting(true)
    userManagementHook.updateUserById({
      id: userId,
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

  const onChangeFieldOffice = (e: any) => {
    setForm((form: any) => {
      return { ...form, fieldOffice: e.value, squad: null }
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

  const validateForm = (): boolean => {
    const arrRes = []
    arrRes.push(validateRequired('agency'))
    arrRes.push(validateRequired('fieldOffice'))
    arrRes.push(validateRequired('fullName'))
    arrRes.push(validateRequired('phone'))
    arrRes.push(validateRequired('role'))
    arrRes.push(validateEmail())

    if (form.role == AuthHelper.RoleType.USER) {
      arrRes.push(validateRequired('squad'))
    }

    return arrRes.findIndex((x) => x && x.length > 0) < 0
  }

  const submitForm = (e: any) => {
    e.preventDefault()

    if (!validateForm()) return

    editUser(form as User.UpdateUserParams)
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
    setUserId('')
  }

  return (
    <>
      <Modal show={openModal} size={'xl'} id='addLibraryModal' onClose={() => (!isSubmitting ? hideModal() : null)}>
        <div className='flex items-center rounded-t dark:border-gray-600 border-b p-4'>
          <img src={addIcon} />
          <h3 className='text-lg font-bold text-wt-primary-40 dark:text-white ml-2 mb-0'>Edit Account</h3>
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
                Full name
              </label>
              <input
                type='text'
                id='fullName'
                name='fullName'
                placeholder='Enter fullName'
                value={form.fullName || ''}
                onChange={onChangeInput}
                onBlur={() => validateRequired('fullName')}
                disabled={isSubmitting}
                className={['form-control', formError.fullName ? 'invalid' : ''].filter(Boolean).join(' ')}
              />
              <p className='error-message text-xs mt-1 font-semibold'>{formError.fullName}</p>
            </div>
            <div className='grid grid-cols-2 space-x-4'>
              <div>
                <label htmlFor='role' className='text-wt-primary-40 text-xs font-semibold'>
                  Role
                </label>
                <ReactSelect
                  aria-invalid={formError.role ? true : false}
                  options={
                    role == AuthHelper.RoleType.ADMIN
                      ? roleOptionsOfAdmin
                      : role == AuthHelper.RoleType.SUPER_ADMIN
                      ? roleOptionsOfSuperAdmin
                      : null
                  }
                  value={getOption(form.role, userRoles)}
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
                  Phone Number
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
                  className={['form-control', formError.phone ? 'invalid' : ''].filter(Boolean).join(' ')}
                />
                <p className='error-message text-xs mt-1 font-semibold'>{formError.phone}</p>
              </div>
            </div>
            <div>
              <label htmlFor='email' className='text-wt-primary-40 text-xs font-semibold'>
                Email
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
                className={['form-control', formError.email ? 'invalid' : ''].filter(Boolean).join(' ')}
              />
              <p className='error-message text-xs mt-1 font-semibold'>{formError.email}</p>
            </div>
            <div>
              <label htmlFor='agency' className='text-wt-primary-40 text-xs font-semibold'>
                Agency
              </label>
              <ReactSelect
                aria-invalid={formError.agency ? true : false}
                options={agencyOptions}
                value={getOption(form.agency, agencyOptions)}
                menuPosition={'fixed'}
                isDisabled
                closeMenuOnSelect={true}
                className='react-select-container'
                classNamePrefix='react-select'
                isLoading={isLoading}
              />
              <p className='error-message text-xs mt-1 font-semibold'>{formError.agency}</p>
            </div>
            <div className='grid grid-cols-2 space-x-4'>
              <div>
                <label htmlFor='fieldOffice' className='text-wt-primary-40 text-xs font-semibold'>
                  Field Office
                </label>
                <ReactSelect
                  aria-invalid={formError.fieldOffice ? true : false}
                  options={fieldOfficeOptions}
                  value={getOption(form.fieldOffice, fieldOfficeOptions)}
                  menuPosition={'fixed'}
                  isDisabled={isSubmitting || role == AuthHelper.RoleType.ADMIN}
                  closeMenuOnSelect={true}
                  onChange={onChangeFieldOffice}
                  onBlur={() => validateRequired('fieldOffice')}
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
                  onBlur={() => validateRequired('squad')}
                  className='react-select-container'
                  classNamePrefix='react-select'
                  isLoading={isLoading}
                />
                <p className='error-message text-xs mt-1 font-semibold'>{formError.squad}</p>
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
                <span className='ml-2'>Edit User</span>
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  )
})

export default EditAccountModal
