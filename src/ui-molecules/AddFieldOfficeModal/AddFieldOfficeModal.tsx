import { Modal } from 'flowbite-react'
import { forwardRef, useImperativeHandle, useState, useEffect } from 'react'
import { AgencySelect, Button, IconSvg, ReactSelect } from 'ui-atoms'
import { getOption, valiator } from 'utils'
import addIcon from 'assets/media/image/location-add.png'
import './style.css'
import { ToastControl } from 'utils/toast'
import { UserStatus, userStatus } from 'constant'
import { useFieldOffice, useAuth } from 'hooks'
import AuthHelper from 'constant/AuthHelper'

const AddSquadModal = forwardRef((props: any, ref: any) => {
  const fieldOfficeHook = useFieldOffice()
  const auth = useAuth()
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [form, setForm] = useState<FieldOffice.CreateParams>({
    id: '',
    alphaCode: '',
    name: '',
    status: '',
    agency: ''
  })
  const [formError, setFormErrors] = useState<FieldOffice.CreateParams>({
    id: '',
    alphaCode: '',
    name: '',
    status: '',
    agency: ''
  })
  const [role, setRole] = useState<any>('')
  const [agencySelected, setAgencySelected] = useState<any>(null)

  useEffect(() => {
    getProfile()
  }, [openModal])

  useImperativeHandle(ref, () => ({
    showModal
  }))

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

  const validateRequired = (fieldName: keyof FieldOffice.CreateParams): string => {
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
    arrRes.push(validateRequired('name'))
    arrRes.push(validateRequired('id'))
    arrRes.push(validateRequired('alphaCode'))
    arrRes.push(validateRequired('status'))
    arrRes.push(validateAgency())

    return arrRes.findIndex((x) => x && x.length > 0) < 0
  }

  const submitForm = (e: any) => {
    e.preventDefault()

    if (!validateForm()) return

    createFieldOffice(form)
  }

  const showModal = () => {
    setOpenModal(true)
  }

  const hideModal = () => {
    setOpenModal(false)
    setForm({
      id: '',
      alphaCode: '',
      name: '',
      status: '',
      agency: ''
    })
    setFormErrors({
      id: '',
      alphaCode: '',
      name: '',
      status: '',
      agency: ''
    })
    setAgencySelected(null)
  }

  const getProfile = () => {
    auth.getMyProfile({
      callback: {
        onSuccess: (res) => {
          setForm({ ...form, agency: res?.agency?._id })
          setRole(res?.role)
        },
        onFailure: (err) => {
          ToastControl.showErrorMessage(err)
        }
      }
    })
  }

  const createFieldOffice = (params: FieldOffice.CreateParams) => {
    setIsSubmitting(true)
    fieldOfficeHook.createFieldOffice({
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
          <h3 className='text-lg font-bold text-wt-primary-40 dark:text-white ml-2 mb-0'>Add Field Office</h3>
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
            <div className='grid grid-cols-2 space-x-4'>
              <div>
                <label htmlFor='id' className='text-wt-primary-40 text-xs font-bold'>
                  ID <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  id='id'
                  name='id'
                  placeholder='Enter Field Office ID'
                  value={form.id || ''}
                  onChange={onChangeInput}
                  onBlur={() => validateRequired('id')}
                  disabled={isSubmitting}
                  className={['form-control form-gray', formError.id ? 'invalid' : ''].filter(Boolean).join(' ')}
                />
                <p className='error-message text-xs mt-1 font-semibold'>{formError.id}</p>
              </div>
              <div>
                <label htmlFor='alphaCode' className='text-wt-primary-40 text-xs font-bold'>
                  Alpha Code <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  id='alphaCode'
                  name='alphaCode'
                  placeholder='Enter Alpha Code'
                  value={form.alphaCode || ''}
                  onChange={onChangeInput}
                  onBlur={() => validateRequired('alphaCode')}
                  disabled={isSubmitting}
                  className={[
                    'form-control form-gray uppercase placeholder:normal-case',
                    formError.alphaCode ? 'invalid' : ''
                  ]
                    .filter(Boolean)
                    .join(' ')}
                />
                <p className='error-message text-xs mt-1 font-semibold'>{formError.alphaCode}</p>
              </div>
            </div>
            <div>
              <label htmlFor='status' className='text-wt-primary-40 text-xs font-bold'>
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
            <div>
              <label htmlFor='name' className='text-wt-primary-40 text-xs font-bold'>
                Field Office <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                id='name'
                name='name'
                placeholder='Enter Field Office'
                value={form.name || ''}
                onChange={onChangeInput}
                onBlur={() => validateRequired('name')}
                disabled={isSubmitting}
                className={['form-control form-gray', formError.name ? 'invalid' : ''].filter(Boolean).join(' ')}
              />
              <p className='error-message text-xs mt-1 font-semibold'>{formError.name}</p>
            </div>
            {role === AuthHelper.RoleType.TECH_OWNER && (
              <div>
                <label htmlFor='name' className='text-wt-primary-40 text-xs font-bold'>
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
                <span className='ml-2'>Add Field Office</span>
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  )
})

export default AddSquadModal
