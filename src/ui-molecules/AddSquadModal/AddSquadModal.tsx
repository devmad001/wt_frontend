import { Modal } from 'flowbite-react'
import { forwardRef, useImperativeHandle, useState, useEffect } from 'react'
import { AgencySelect, Button, IconSvg, ReactSelect } from 'ui-atoms'
import { getOption, getUserScopeInfo, valiator } from 'utils'
import addIcon from 'assets/media/image/tag-right.png'
import './style.css'
import { useAuth, useFieldOffice, useSquad } from 'hooks'
import { ToastControl } from 'utils/toast'
import { userStatus } from 'constant'
import AuthHelper from 'constant/AuthHelper'

const AddFieldOfficeModal = forwardRef((props: any, ref: any) => {
  const fieldOffice = useFieldOffice()
  const squad = useSquad()
  const auth = useAuth()
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false)
  const [fieldOfficeOptions, setFieldOfficeOptions] = useState<any[]>([])
  const [form, setForm] = useState<Squad.CreateParams>({
    status: '',
    id: '',
    name: '',
    fieldOffice: '',
    agency: ''
  })
  const [formError, setFormErrors] = useState<Squad.CreateParams>({
    status: '',
    id: '',
    name: '',
    fieldOffice: '',
    agency: ''
  })
  const [role, setRole] = useState<any>('')
  const [agencySelected, setAgencySelected] = useState<any>(null)

  useImperativeHandle(ref, () => ({
    showModal
  }))

  useEffect(() => {
    getProfile()
  }, [openModal])

  useEffect(() => {
    if (form.agency) {
      setForm((form: any) => {
        return { ...form, fieldOffice: null }
      })
      const params: FieldOffice.GetListParams = {
        key: '',
        page: 1,
        limit: 100,
        agency: form.agency
      }
      getFieldOfficeOptions(params)
    }
  }, [form.agency])

  const onChangeInput = (e: any) => {
    setForm((form: any) => {
      return { ...form, [e.target.id]: e.target.value }
    })
  }

  const onChangeStatus = (e: any) => {
    setForm((form: any) => {
      return { ...form, status: e.value }
    })
  }

  const onChangedAgency = (e: any) => {
    console.log(e)
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
      return { ...form, fieldOffice: e.value }
    })
  }

  const validateRequired = (fieldName: keyof Squad.CreateParams): string => {
    const err = valiator.validate(form[fieldName], {
      required: true,
      errorsMessage: { required: 'This field is required.' }
    })

    setFormErrors((errors: any) => {
      return { ...errors, [fieldName]: err || '' }
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
    arrRes.push(validateRequired('status'))
    arrRes.push(validateRequired('name'))
    arrRes.push(validateRequired('fieldOffice'))
    arrRes.push(validateRequired('id'))
    arrRes.push(validateAgency())

    return arrRes.findIndex((x) => x && x.length > 0) < 0
  }

  const submitForm = (e: any) => {
    e.preventDefault()

    if (!validateForm()) return

    createSquad(form)
  }

  const showModal = () => {
    setOpenModal(true)
  }

  const hideModal = () => {
    setOpenModal(false)
    setForm({
      status: '',
      id: '',
      name: '',
      fieldOffice: '',
      agency: ''
    })
    setFormErrors({
      status: '',
      id: '',
      name: '',
      fieldOffice: '',
      agency: ''
    })
    setAgencySelected(null)
    setFieldOfficeOptions([])
  }

  const getProfile = () => {
    setIsLoading(true)
    auth.getMyProfile({
      callback: {
        onSuccess: (res) => {
          setForm({ ...form, agency: res?.agency?._id || '', fieldOffice: res?.fieldOffice?._id || '' })
          setRole(res?.role)
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

  const createSquad = (params: Squad.CreateParams) => {
    setIsSubmitting(true)
    squad.createSquad({
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

  return (
    <>
      <Modal show={openModal} size={'xl'} id='addLibraryModal' onClose={() => (!isSubmitting ? hideModal() : null)}>
        <div className='flex items-center rounded-t dark:border-gray-600 border-b p-4'>
          <img src={addIcon} />
          <h3 className='text-lg font-bold text-wt-primary-40 dark:text-white ml-2 mb-0'>Add Squad</h3>
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
              <label htmlFor='id' className='text-wt-primary-40 text-sm font-bold'>
                ID <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                id='id'
                name='id'
                placeholder='Enter Squad ID'
                value={form.id || ''}
                onChange={onChangeInput}
                onBlur={() => validateRequired('id')}
                disabled={isSubmitting}
                className={['form-control', formError.id ? 'invalid' : ''].filter(Boolean).join(' ')}
              />
              <p className='error-message text-xs mt-1 font-semibold'>{formError.id}</p>
            </div>
            <div>
              <label htmlFor='status' className='text-wt-primary-40 text-sm font-bold'>
                Status <span className='text-red-500'>*</span>
              </label>
              <ReactSelect
                aria-invalid={formError.status ? true : false}
                value={getOption(form.status, userStatus)}
                options={userStatus}
                menuPosition={'fixed'}
                isDisabled={isSubmitting}
                closeMenuOnSelect={true}
                onChange={onChangeStatus}
                onBlur={() => validateRequired('status')}
                className='react-select-container'
                classNamePrefix='react-select'
              />
              <p className='error-message text-xs mt-1 font-semibold'>{formError.status}</p>
            </div>
            {role === AuthHelper.RoleType.TECH_OWNER && (
              <div>
                <label htmlFor='name' className='text-wt-primary-40 text-sm font-bold'>
                  Agency <span className='text-red-500'>*</span>
                </label>
                <AgencySelect
                  aria-invalid={formError.agency ? true : false}
                  value={agencySelected}
                  isDisabled={isSubmitting}
                  onChange={onChangedAgency}
                  onBlur={validateAgency}
                />
                <p className='error-message text-xs mt-1 font-semibold'>{formError.agency}</p>
              </div>
            )}
            <div>
              <label htmlFor='fieldOffice' className='text-wt-primary-40 text-sm font-bold'>
                Field Office <span className='text-red-500'>*</span>
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
              <label htmlFor='name' className='text-wt-primary-40 text-sm font-bold'>
                Squad <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                id='name'
                name='name'
                placeholder='Enter Squad'
                value={form.name || ''}
                onChange={onChangeInput}
                onBlur={() => validateRequired('name')}
                disabled={isSubmitting}
                className={['form-control', formError.name ? 'invalid' : ''].filter(Boolean).join(' ')}
              />
              <p className='error-message text-xs mt-1 font-semibold'>{formError.name}</p>
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
                <span className='ml-2'>Add Squad</span>
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  )
})

export default AddFieldOfficeModal
