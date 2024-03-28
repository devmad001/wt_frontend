import modalIcon from 'assets/media/png/contact-add.png'

import Message from 'constant/Message'
import ThemeHelper from 'constant/ThemeHelper'
import UIHelperClass from 'constant/UIHelper'
import { Modal } from 'flowbite-react'
import { useContact, useSubpoena } from 'hooks'
import { Callbacks } from 'jquery'
import { debounce } from 'lodash'
import moment from 'moment'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Button, IconSvg, AsyncReactSelect, Spinner } from 'ui-atoms'
import { WtSubmitIcon } from 'ui-atoms/Icons'
import { AlertModal } from 'ui-molecules'
import { valiator } from 'utils'
import { ToastControl } from 'utils/toast'

const optionContact = ({ innerProps, data, isDisabled, isSelected }: any) =>
  !isDisabled ? (
    <div
      {...innerProps}
      className={[
        'flex flex-col rounded-lg p-2 px-3 cursor-pointer hover:bg-wt-primary-20',
        isSelected ? 'bg-wt-primary-20' : ''
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className='font-semibold'>{data?.addition?.fullName}</span>
      <span>{data?.addition?.email}</span>
    </div>
  ) : null

const AddContactPopup = forwardRef((props: any, ref: any) => {
  const useContactHook = useContact()
  const alertModalRef: any = useRef(null)
  const currentPage = useRef(1)
  const limit = useRef(100)
  const contactsTemp = useRef<App.ReactSelectOptions[]>([])
  const search = useRef<string>('')
  const [openModal, setOpenModal] = useState<string | undefined>()
  const addContactModalProps = { openModal, setOpenModal }
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [keySearch, setKeySearch] = useState('')
  const [contactsOptions, setContactsOptions] = useState<App.ReactSelectOptions[]>([])
  const [selectedContact, setSelectedContact] = useState<App.ReactSelectOptions | any>([])
  const [isLoadingContactSelect, setIsLoadingContactSelect] = useState<boolean>(false)
  const [formError, setFormErrors] = useState<any>({
    contact: ''
  })

  useEffect(() => {
    //
  }, [])

  useImperativeHandle(ref, () => ({
    openPopup() {
      showModal()
    }
  }))

  const resetData = () => {
    contactsTemp.current = []
    currentPage.current = 0
    setFormErrors({
      contact: ''
    })
    setContactsOptions([])
    setSelectedContact(null)
    setIsLoadingContactSelect(false)
    setKeySearch('')
  }

  const showModal = () => {
    resetData()
    addContactModalProps.setOpenModal('show')
  }

  const closeModal = () => {
    addContactModalProps.setOpenModal(undefined)
  }

  const loadData = debounce(
    (page: number, isLoadMore = false, callback: (options: App.ReactSelectOptions[]) => void = () => {}) => {
      currentPage.current = page

      const params: Contact.MyContactsParams = {
        key: search.current,
        page: currentPage.current,
        limit: limit.current
      }

      requestGetMyContacts(params, isLoadMore, callback)
    },
    300
  )

  const requestGetMyContacts = (
    params: Contact.MyContactsParams,
    isLoadMore = false,
    callback: (options: App.ReactSelectOptions[]) => void = () => {}
  ) => {
    isLoadMore ? setIsLoadingContactSelect(true) : setIsLoadingContactSelect(false)
    useContactHook.contactsFind({
      params: params,
      callback: {
        onSuccess: (res) => {
          contactsTemp.current = res?.items?.map((x: Contact.Details) => {
            return {
              value: x._id,
              label: x.email,
              addition: x
            }
          })
          callback(contactsTemp.current)
          setContactsOptions(contactsTemp.current)
          setIsLoadingContactSelect(false)
        },
        onFailure: (err) => {
          ToastControl.showErrorMessage(err)
          setIsLoadingContactSelect(false)
        }
      }
    })
  }

  const loadContactOptions = (inputValue: string, callback: (options: App.ReactSelectOptions[]) => void) => {
    setKeySearch(inputValue)
    search.current = inputValue
    loadData(1, false, callback)
  }

  const onChangedContact = (e: any) => {
    setSelectedContact(e.value || null)
  }

  const validateContact = (): string => {
    const err = valiator.validate(selectedContact, {
      required: true,
      errorsMessage: { required: 'Please select select contact.' }
    })
    setFormErrors((errors: any) => {
      return { ...errors, contact: err || '' }
    })

    return err
  }

  const validateForm = (): boolean => {
    const arrRes = []
    arrRes.push(validateContact())
    return arrRes.findIndex((x) => x && x.length > 0) < 0
  }

  const submit = () => {
    if (!validateForm()) return

    alertModalRef?.current.open({
      title: 'Warning',
      content: 'Are you sure you want to request add contact?',
      isShowTwoButton: true,
      confirmButton: {
        label: 'Yes, do it',
        action: () => {
          requestAddContact()
        }
      }
    })
  }

  const requestAddContact = () => {
    setIsSubmitting(true)

    const params: Contact.RequestContactParams = {
      friendId: selectedContact
    }

    useContactHook.request({
      params: params,
      callback: {
        onSuccess: () => {
          props?.sentRequest && props?.sentRequest()
          ToastControl.showSuccessMessage('You have successfully sent request add contact')
          closeModal()
          setIsSubmitting(false)
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
      <Modal
        theme={ThemeHelper.MODAL_THEME}
        show={addContactModalProps.openModal === 'show'}
        size={'xl'}
        id='subpoenaDetailModal'
        onClose={() => (!isLoading ? addContactModalProps.setOpenModal(undefined) : null)}
      >
        <div className='flex items-start justify-between rounded-t dark:border-gray-600 border-b p-5'>
          <h3 id=':rl:' className='flex items-center text-xl font-bold text-wt-primary-40 dark:text-white'>
            <img src={modalIcon} className='mr-2' />
            Add Contact
          </h3>
          <button
            aria-label='Close'
            className='ml-auto inline-flex items-center justify-center rounded-full bg-wt-primary-75 p-1 text-sm text-white hover:bg-wt-primary-40 hover:text-white'
            type='button'
            onClick={() => closeModal()}
          >
            <IconSvg className='h-3 w-3' icon='closeModal' />
          </button>
        </div>
        <Modal.Body>
          <div className='space-y-6'>
            {isLoading ? (
              <div className='flex items-center justify-center w-100'>
                <Spinner />
              </div>
            ) : (
              <>
                <div className='w-full'>
                  <div className='mb-4'>
                    <label
                      htmlFor='publicCorruptionTag'
                      className='block mb-2 text-sm font-bold text-wt-primary-40 dark:text-white'
                    >
                      Select contact <span className='text-red-600'>*</span>
                    </label>
                    <AsyncReactSelect
                      loadOptions={loadContactOptions}
                      menuPosition={'fixed'}
                      defaultOptions
                      components={{ Option: optionContact }}
                      isDisabled={isSubmitting}
                      closeMenuOnSelect={true}
                      onChange={onChangedContact}
                      onBlur={validateContact}
                    />
                    <p className='text-red-600 mt-1'>{formError.contact}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className='btn btn-secondary py-3 bg-wt-primary-75 hover:bg-gray-400 font-bold text-white rounded-lg ml-auto px-5'
            type='button'
            disabled={isSubmitting}
            onClick={() => addContactModalProps.setOpenModal(undefined)}
          >
            Cancel
          </Button>
          <Button
            className='flex items-center btn bg-wt-orange-1 hover:bg-wt-orange-3 py-3 rounded-lg font-bold text-white'
            type='button'
            isLoading={isSubmitting}
            onClick={() => {
              submit()
            }}
          >
            <WtSubmitIcon className='h-5 w-5 mr-2' />
            Send Request
          </Button>
        </Modal.Footer>
      </Modal>
      <AlertModal ref={alertModalRef} />
    </>
  )
})

export default AddContactPopup
