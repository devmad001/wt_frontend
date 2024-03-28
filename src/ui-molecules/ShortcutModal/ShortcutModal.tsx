import { Modal } from 'flowbite-react'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { Button, IconSvg } from 'ui-atoms'
import { getFinAwareSessionId, getUserInfo, valiator } from 'utils'
import addIcon from 'assets/media/image/buildings.png'
import { useChat } from 'hooks'
import { toast } from 'react-toastify'
import Message from 'constant/Message'
import { useFinAwareAPI } from 'api'
import { useSearchParams } from 'react-router-dom'

interface Form {
  name: string
  question: string
}

const ShortcutModal = forwardRef((props: any, ref: any) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [openModal, setOpenModal] = useState<boolean>(false)
  const finAwareAPI = useFinAwareAPI()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [caseId, setCaseId] = useState<string | null>(null)
  const [form, setForm] = useState<Form>({
    name: '',
    question: ''
  })
  const [formError, setFormErrors] = useState<Form>({
    name: '',
    question: ''
  })
  const finAwareSesstionId = getFinAwareSessionId()
  const userId = getUserInfo()?._id || ''

  useEffect(() => {
    if (!searchParams?.get('case_id')) setCaseId(null)
    setCaseId(searchParams?.get('case_id'))
  }, [searchParams])

  useImperativeHandle(ref, () => ({
    showModal
  }))

  const onChangeInput = (e: any) => {
    setForm((form: any) => {
      return { ...form, [e.target.id]: e.target.value }
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
    arrRes.push(validateRequired('name'))
    arrRes.push(validateRequired('question'))

    return arrRes.findIndex((x) => x && x.length > 0) < 0
  }

  const submitForm = (e: any) => {
    e.preventDefault()
    if (!caseId) return
    if (!validateForm()) return
    setIsSubmitting(true)

    let param = {
      user_id: userId,
      label: form.name,
      query: form.question,
      fin_session_id: finAwareSesstionId,
      action: '',
      visible: true,
      category: '',
      case_id: caseId
    }
    finAwareAPI.postButton(caseId, param).then((res) => {
      setIsSubmitting(false)
      if (res) {
        hideModal()
        props.getShortcutList()
      }
    })

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      hideModal()
    }, 1000)
  }

  const showModal = () => {
    setOpenModal(true)
  }

  const hideModal = () => {
    setOpenModal(false)
    setForm({
      name: '',
      question: ''
    })
    setFormErrors({
      name: '',
      question: ''
    })
  }

  return (
    <>
      <Modal show={openModal} size={'xl'} id='addLibraryModal' onClose={() => (!isSubmitting ? hideModal() : null)}>
        <div className='flex items-center rounded-t dark:border-gray-600 border-b p-4'>
          {/* <img src={addIcon} /> */}
          <h3 className='text-lg font-bold text-wt-primary-40 dark:text-white ml-2 mb-0'>Create a Shortcut Macro</h3>
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
              <label htmlFor='name' className='text-wt-primary-40 text-xs font-semibold'>
                Shortcut Name
              </label>
              <input
                type='text'
                id='name'
                name='name'
                placeholder='Enter Shortcut Name'
                value={form.name || ''}
                onChange={onChangeInput}
                onBlur={() => validateRequired('name')}
                disabled={isSubmitting}
                className={['form-control', formError.name ? 'invalid' : ''].filter(Boolean).join(' ')}
              />
              <p className='error-message text-xs mt-1 font-semibold'>{formError.name}</p>
            </div>
            <div>
              <label htmlFor='' className='text-wt-primary-40 text-xs font-semibold'>
                Shortcut Question
              </label>
              <textarea
                id='question'
                name='question'
                placeholder='Enter Shortcut Question'
                value={form.question || ''}
                onChange={onChangeInput}
                onBlur={() => validateRequired('question')}
                disabled={isSubmitting}
                className={['form-control', formError.question ? 'invalid' : ''].filter(Boolean).join(' ')}
              />
              <p className='error-message text-xs mt-1 font-semibold'>{formError.question}</p>
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
                <span className='ml-2'>Save</span>
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  )
})

export default ShortcutModal
