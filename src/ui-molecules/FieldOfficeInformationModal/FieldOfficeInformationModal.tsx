import { userStatus } from 'constant'
import { Modal } from 'flowbite-react'
import { forwardRef, useImperativeHandle, useState, useEffect } from 'react'
import { Button, IconSvg, ReactSelect } from 'ui-atoms'
import { formatDate, getOption, valiator } from 'utils'
import './style.css'
import { useFieldOffice } from 'hooks'
import { ToastControl } from 'utils/toast'

interface Form {
  id: string
  alphaCode: string
  name: string
  status: string
  createdAt: string
  updatedAt: string
}

const FieldOfficeInformationModal = forwardRef((props: any, ref: any) => {
  const fieldOfficeHook = useFieldOffice()
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [fieldOfficeId, setFieldOfficeId] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState<Form>({
    id: '',
    alphaCode: '',
    name: '',
    status: '',
    createdAt: '',
    updatedAt: ''
  })
  const [formError, setFormErrors] = useState<Form>({
    id: '',
    alphaCode: '',
    name: '',
    status: '',
    createdAt: '',
    updatedAt: ''
  })

  useImperativeHandle(ref, () => ({
    showModal,
    setFieldOfficeId
  }))

  useEffect(() => {
    if (openModal && fieldOfficeId) {
      getFieldOfficeDetail()
    }
  }, [openModal])

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

  const validateForm = (): boolean => {
    const arrRes = []
    arrRes.push(validateRequired('id'))
    arrRes.push(validateRequired('alphaCode'))
    arrRes.push(validateRequired('name'))
    arrRes.push(validateRequired('status'))

    return arrRes.findIndex((x) => x && x.length > 0) < 0
  }

  const submitForm = (e: any) => {
    e.preventDefault()

    if (!validateForm()) return

    const params: FieldOffice.UpdateParams = {
      id: form.id,
      name: form.name,
      status: form.status,
      alphaCode: form.alphaCode
    }

    editFieldOffice(params)
  }

  const getFieldOfficeDetail = () => {
    setIsLoading(true)
    fieldOfficeHook.getFieldOfficesById({
      id: fieldOfficeId,
      callback: {
        onSuccess: (res) => {
          setForm(res)
          setIsLoading(false)
        },
        onFailure: (err) => {
          ToastControl.showErrorMessage(err)
          setIsLoading(false)
        }
      }
    })
  }

  const editFieldOffice = (params: FieldOffice.UpdateParams) => {
    setIsSubmitting(true)
    fieldOfficeHook.updateFieldOfficesById({
      id: fieldOfficeId,
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
      createdAt: '',
      updatedAt: ''
    })
    setFormErrors({
      id: '',
      alphaCode: '',
      name: '',
      status: '',
      createdAt: '',
      updatedAt: ''
    })
    setFieldOfficeId(null)
  }

  return (
    <>
      <Modal show={openModal} size={'xl'} id='addLibraryModal' onClose={() => (!isSubmitting ? hideModal() : null)}>
        <div className='flex items-center rounded-t dark:border-gray-600 border-b p-4'>
          <h3 className='text-lg font-bold text-wt-primary-40 dark:text-white ml-2 mb-0'>Field Office Information</h3>
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
                <label htmlFor='id' className='text-wt-primary-40 text-xs font-semibold'>
                  Id
                </label>
                <input
                  type='text'
                  id='id'
                  name='id'
                  placeholder='Enter Agency ID'
                  value={form.id || ''}
                  onChange={onChangeInput}
                  onBlur={() => validateRequired('id')}
                  disabled={isSubmitting}
                  className={['form-control', formError.id ? 'invalid' : ''].filter(Boolean).join(' ')}
                />
                <p className='error-message text-xs mt-1 font-semibold'>{formError.id}</p>
              </div>
              <div>
                <label htmlFor='alphaCode' className='text-wt-primary-40 text-xs font-semibold'>
                  Alpha Code
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
                  className={['form-control uppercase placeholder:normal-case', formError.alphaCode ? 'invalid' : '']
                    .filter(Boolean)
                    .join(' ')}
                />
                <p className='error-message text-xs mt-1 font-semibold'>{formError.alphaCode}</p>
              </div>
            </div>
            <div>
              <label htmlFor='name' className='text-wt-primary-40 text-xs font-semibold'>
                Field Office
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
                className={['form-control', formError.name ? 'invalid' : ''].filter(Boolean).join(' ')}
              />
              <p className='error-message text-xs mt-1 font-semibold'>{formError.name}</p>
            </div>
            <div>
              <label htmlFor='status' className='text-wt-primary-40 text-xs font-semibold'>
                Status
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
            <div className='grid grid-cols-2 space-x-4'>
              <div>
                <label htmlFor='createdAt' className='text-wt-primary-40 text-xs font-semibold'>
                  Created Date
                </label>
                <input
                  type='texts'
                  id='createdAt'
                  name='createdAt'
                  value={formatDate(form.createdAt, 'MM/DD/YYYY')}
                  disabled
                  className='form-control'
                />
              </div>
              <div>
                <label htmlFor='updatedAt' className='text-wt-primary-40 text-xs font-semibold'>
                  Last Updated
                </label>
                <input
                  disabled
                  type='text'
                  id='updatedAt'
                  name='updatedAt'
                  value={formatDate(form.updatedAt, 'MM/DD/YYYY')}
                  className='form-control'
                />
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
                <IconSvg icon='tickCircle' />
                <span className='ml-2'>Save</span>
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  )
})

export default FieldOfficeInformationModal
