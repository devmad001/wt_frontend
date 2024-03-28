import { Modal } from 'flowbite-react'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { Button, IconSvg } from 'ui-atoms'
import { valiator } from 'utils'
import addIcon from 'assets/media/image/buildings.png'
import './style.css'
import { WtChooseToolChecked, WtChooseToolUncheck } from 'ui-atoms/Icons'
import AuthHelper from 'constant/AuthHelper'
import { useAgency } from 'hooks'
import { ToastControl } from 'utils/toast'

interface Form {
  id: string
  agencyName: string
  chooseTool: any
}

const chooseToolOptions = [
  { value: 1, label: 'FinAware', desc: 'description and price here' },
  { value: 2, label: 'Track', desc: 'description and price here' },
  { value: 3, label: 'Both', desc: 'description and price here' }
]

const AddAgencyModal = forwardRef((props: any, ref: any) => {
  const agencyHook = useAgency()
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [form, setForm] = useState<Form>({
    id: '',
    agencyName: '',
    chooseTool: 1
  })
  const [formError, setFormErrors] = useState<any>({
    id: '',
    agencyName: '',
    chooseTool: ''
  })

  useImperativeHandle(ref, () => ({
    showModal
  }))

  const onChangeInput = (e: any) => {
    setForm((form: any) => {
      return { ...form, [e.target.id]: e.target.value }
    })
  }

  const onChangeChooseTool = (e: any) => {
    setForm((form: any) => {
      return { ...form, chooseTool: e.target.value }
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
    arrRes.push(validateRequired('agencyName'))
    arrRes.push(validateRequired('id'))

    return arrRes.findIndex((x) => x && x.length > 0) < 0
  }

  const getMemberships = (value: any) => {
    if (value == 1) return [AuthHelper.MembershipType.FINAWARE]
    if (value == 2) return [AuthHelper.MembershipType.TRACKER]
    if (value == 3) return [AuthHelper.MembershipType.FINAWARE, AuthHelper.MembershipType.TRACKER]
    return []
  }

  const submitForm = (e: any) => {
    e.preventDefault()

    if (!validateForm()) return

    const params: Agency.CreateParams = {
      id: form.id,
      status: 'active',
      name: form.agencyName,
      memberships: getMemberships(form.chooseTool)
    }

    requestCreateAgency(params)
  }

  const requestCreateAgency = (params: Agency.CreateParams) => {
    setIsSubmitting(true)
    agencyHook.createAgency({
      params: params,
      callback: {
        onSuccess: () => {
          ToastControl.showSuccessMessage('You have successfully created new agency')
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
      agencyName: '',
      chooseTool: 1
    })
    setFormErrors({
      id: '',
      agencyName: '',
      chooseTool: ''
    })
  }

  return (
    <>
      <Modal show={openModal} size={'xl'} id='addLibraryModal' onClose={() => (!isSubmitting ? hideModal() : null)}>
        <div className='flex items-center rounded-t dark:border-gray-600 border-b p-4'>
          <img src={addIcon} />
          <h3 className='text-lg font-bold text-wt-primary-40 dark:text-white ml-2 mb-0'>Add Agency</h3>
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
              <label className='block mb-2 text-sm font-bold text-wt-primary-40 dark:text-white'>
                ID <span className='text-red-500'>*</span>
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
                className={['form-control form-gray', formError.id ? 'invalid' : ''].filter(Boolean).join(' ')}
              />
              <p className='error-message text-xs mt-1 font-semibold'>{formError.id}</p>
            </div>
            <div>
              <label className='block mb-2 text-sm font-bold text-wt-primary-40 dark:text-white'>
                Agency Name <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                id='agencyName'
                name='agencyName'
                placeholder='Enter Agency Name'
                value={form.agencyName || ''}
                onChange={onChangeInput}
                onBlur={() => validateRequired('agencyName')}
                disabled={isSubmitting}
                className={['form-control form-gray', formError.agencyName ? 'invalid' : ''].filter(Boolean).join(' ')}
              />
              <p className='error-message text-xs mt-1 font-semibold'>{formError.agencyName}</p>
            </div>
            <div className='mb-4'>
              <label className='block mb-2 text-sm font-bold text-wt-primary-40 dark:text-white'>
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
              <p className='text-red-600 text-xs lg:text-sm xl:text-base font-semibold mt-1'>{formError.chooseTool}</p>
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
                <span className='ml-2'>Add Agency</span>
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  )
})

export default AddAgencyModal
