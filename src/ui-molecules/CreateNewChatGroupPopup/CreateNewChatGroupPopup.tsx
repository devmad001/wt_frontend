import modalIcon from 'assets/media/png/add-new-group-chat.png'

import Message from 'constant/Message'
import ThemeHelper from 'constant/ThemeHelper'
import UIHelperClass from 'constant/UIHelper'
import { Modal } from 'flowbite-react'
import { useContact, useGroup } from 'hooks'
import moment from 'moment'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Button, IconSvg, ScrollView, Spinner, TextAvatar } from 'ui-atoms'
import { AlertModal } from 'ui-molecules'
import { valiator } from 'utils'
import defaultAvatar from 'assets/media/png/default_avatar_img.png'
import { ToastControl } from 'utils/toast'
import { debounce } from 'lodash'
import { useSignal } from 'hooks/useSignal'
import { SignalProtocolManager } from 'utils/signal/SignalGateway'
import { WtSearchIcon, WtSubmitIcon } from 'ui-atoms/Icons'

const CreateNewChatGroupPopup = forwardRef((props: any, ref: any) => {
  const signal = useSignal()
  const useContactHook = useContact()
  const useGroupHook = useGroup()
  const contentScrollRef = useRef<any>(null)
  const alertModalRef: any = useRef(null)
  const currentPage = useRef(1)
  const hasMoreContact = useRef(true)
  const limit = useRef(10)
  const contactsTemp = useRef<Contact.Details[]>([])
  const selectedContactsTemp = useRef<Contact.Details[]>([])
  const keySearchRef = useRef('')
  const [openModal, setOpenModal] = useState<string | undefined>()
  const createNewGroupProps = { openModal, setOpenModal }
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [keySearch, setKeySearch] = useState('')
  const [contacts, setContacts] = useState<Contact.Details[]>([])
  const [form, setForm] = useState({
    groupName: ''
  })
  const [formError, setFormErrors] = useState<any>({
    groupName: '',
    contacts: ''
  })
  const [timer, setTimer] = useState<any>(null)
  const [noContactsFound, setNoContactsFound] = useState('')

  useEffect(() => {
    return () => {
      //
    }
  }, [])

  useImperativeHandle(ref, () => ({
    openPopup() {
      showModal()
    }
  }))

  const settingScrollEvent = () => {
    contentScrollRef?.current?.initScrollEvent()
  }

  const scrollToEndHandler = (e: any) => {
    if (hasMoreContact.current && !isLoadingMore) {
      loadMore()
    }
  }

  const resetData = () => {
    contactsTemp.current = []
    selectedContactsTemp.current = []
    hasMoreContact.current = true
    currentPage.current = 0
    setForm({
      groupName: ''
    })
    setFormErrors({
      groupName: '',
      contacts: ''
    })
    setContacts([])
    setIsLoadingMore(false)
    setKeySearch('')
  }

  const showModal = () => {
    createNewGroupProps.setOpenModal('show')
    resetData()
    loadMore()
    setTimeout(() => {
      settingScrollEvent()
    }, 100)
  }

  const closeModal = () => {
    contentScrollRef?.current?.destroyScrollEvent()
    createNewGroupProps.setOpenModal(undefined)
    resetData()
  }

  const loadData = (page: number, isLoadMore = false) => {
    setNoContactsFound('')
    currentPage.current = page

    const params: Contact.MyContactsParams = {
      key: keySearchRef.current || '',
      page: currentPage.current,
      limit: limit.current
    }

    requestGetMyContacts(params, isLoadMore)
  }

  const requestGetMyContacts = (params: Contact.MyContactsParams, isLoadMore = false) => {
    setIsLoadingMore(true)
    useContactHook.contactsFind({
      params: params,
      callback: {
        onSuccess: (res) => {
          let data: Contact.Details[] = []
          if (res?.items?.length <= 0 || res?.items?.length < limit.current) hasMoreContact.current = false
          if (isLoadMore) {
            data = contactsTemp.current.concat(res?.items?.map((x: Contact.Details) => x))
          } else {
            data = res?.items?.map((x: Contact.Details) => x)
            if (data.length <= 0) setNoContactsFound('No contacts found')
          }

          data = data.map((x: Contact.Details) => {
            return {
              ...x,
              selected: selectedContactsTemp.current.some((y: Contact.Details) => y._id === x._id)
            }
          })
          contactsTemp.current = data
          setContacts(contactsTemp.current)

          setIsLoadingMore(false)
        },
        onFailure: (err) => {
          ToastControl.showErrorMessage(err)
          setIsLoadingMore(false)
        }
      }
    })
  }

  const loadMore = debounce(() => {
    currentPage.current = currentPage.current + 1
    loadData(currentPage.current, true)
  }, 300)

  const onChangedKeySearch = (e: any) => {
    setKeySearch(e?.target?.value || '')
    keySearchRef.current = e?.target?.value || ''

    clearTimeout(timer)

    const newTimer = setTimeout(() => {
      loadData(1)
    }, 500)

    setTimer(newTimer)
  }

  const submitSearchContact = (e: any) => {
    e.preventDefault()
    loadData(1)
  }

  const onChangeGroupName = (e: any) => {
    setForm((form: any) => {
      return { ...form, groupName: e.target.value }
    })
  }

  const onSelectContact = (_id: string) => {
    if (isSubmitting) return

    const contact: Contact.Details | undefined = contactsTemp.current.find((x: Contact.Details) => x._id === _id)
    if (contact) {
      contact.selected = !contact.selected
      if (contact.selected) {
        selectedContactsTemp.current.push(contact)
      } else {
        const index: any = selectedContactsTemp.current.findIndex((x: Contact.Details) => x._id === _id)
        if (index >= 0) {
          selectedContactsTemp.current.splice(index, 1)
        }
      }
      setContacts(
        contactsTemp.current.map((x: Contact.Details) => {
          return {
            ...x
          }
        })
      )
    }
  }

  const renderStatusContactSelected = () => {
    if (selectedContactsTemp?.current?.length > 0) {
      const n = selectedContactsTemp?.current?.length
      return (
        <span className='text-sm text-wt-primary-40 ml-auto'>
          {n} people{n > 1 ? 's' : ''} are chosen
        </span>
      )
    }
    return ''
  }

  const validateGroupName = (): string => {
    const err = valiator.validate(form.groupName, {
      required: true,
      errorsMessage: { required: 'This field is required.' }
    })
    setFormErrors((errors: any) => {
      return { ...errors, groupName: err || '' }
    })

    return err
  }

  const validatePeopleInGroup = (): string => {
    const err = valiator.validate(selectedContactsTemp.current, {
      required: true,
      errorsMessage: { required: 'Please select add contact into group.' }
    })
    setFormErrors((errors: any) => {
      return { ...errors, contacts: err || '' }
    })

    return err
  }

  const validateForm = (): boolean => {
    const arrRes = []
    arrRes.push(validateGroupName())
    arrRes.push(validatePeopleInGroup())
    return arrRes.findIndex((x) => x && x.length > 0) < 0
  }

  const createGroup = () => {
    if (!validateForm()) return

    alertModalRef?.current.open({
      title: 'Warning',
      content: 'Are you sure you want to create new group?',
      isShowTwoButton: true,
      confirmButton: {
        label: 'Yes, do it',
        action: () => {
          requestCreateGroup()
        }
      }
    })
  }

  const requestCreateGroup = () => {
    setIsSubmitting(true)
    const params: Group.CreateParams = {
      name: form.groupName,
      memberIds: selectedContactsTemp.current.map((x: Contact.Details) => x._id)
    }
    useGroupHook.createGroup({
      params,
      callback: {
        onSuccess: async (res: Group.Details) => {
          ToastControl.showSuccessMessage('You have successfully created new group')
          closeModal()
          await signal.createGroupSignalManager(res)
          props.onCreated && props.onCreated()
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
        show={createNewGroupProps.openModal === 'show'}
        size={'xl'}
        id='subpoenaDetailModal'
        onClose={() => (!isLoading ? closeModal() : null)}
      >
        <div className='flex items-start justify-between rounded-t border-b p-5'>
          <h3 id=':rl:' className='flex items-center text-xl font-bold text-wt-primary-40 dark:text-white'>
            <img src={modalIcon} className='mr-2' />
            Create New Group
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
        <ScrollView
          ref={contentScrollRef}
          id='new_chat_group_body'
          className='p-6 flex-1 overflow-auto'
          onScrolledToEnd={scrollToEndHandler}
        >
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
                      Group Name <span className='text-red-600'>*</span>
                    </label>
                    <input
                      type='text'
                      name='groupName'
                      id='groupName'
                      className={[
                        'form-control form-gray',
                        formError.publicCorruptionTag ? UIHelperClass.INVALID_CLASS : ''
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      placeholder='Enter Group Name'
                      value={form.groupName || ''}
                      disabled={isSubmitting}
                      onInput={onChangeGroupName}
                    />
                    <p className='text-red-600 mt-1'>{formError.groupName}</p>
                  </div>
                </div>
                <div className='w-full'>
                  <div className='flex items-center mb-4'>
                    <label
                      htmlFor='publicCorruptionTag'
                      className='block mb-2 text-sm font-bold text-wt-primary-40 dark:text-white'
                    >
                      Add people to group <span className='text-red-600'>*</span>
                    </label>
                    {renderStatusContactSelected()}
                  </div>
                  <div className='w-full flex'>
                    <div className='flex-1 flex items-center mb-4 sm:mb-0'>
                      <form className='min-w-full' onSubmit={submitSearchContact}>
                        <label htmlFor='contact-search' className='sr-only'>
                          Search
                        </label>
                        <div className='relative min-w-full'>
                          <input
                            type='text'
                            name='email'
                            id='contact-search'
                            className='block w-full px-4 py-3 text-base text-wt-primary-40 bg-gray-100 border border-white text-gray-900 rounded-full focus:ring-blue-500 focus:border-blue-500'
                            placeholder='Search by name, email'
                            disabled={isSubmitting}
                            onChange={onChangedKeySearch}
                          />

                          <div className='absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none'>
                            <WtSearchIcon className='w-4 h-4 text-wt-primary-40' />
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className='list-view w-full overflow-y-auto mt-4'>
                    <p className='w-full text-wt-primary-40 text-center text-sm'>{noContactsFound}</p>
                    {contacts.map((x: Contact.Details) => {
                      return (
                        <div
                          key={x._id}
                          className='w-full px-4 py-3 border-b border-wt-primary-20 dark:border-gray-600 item'
                        >
                          <div
                            className='flex'
                            onClick={() => {
                              onSelectContact(x._id)
                            }}
                          >
                            <div className='profile-img'>
                              <TextAvatar label={x.fullName} />
                            </div>
                            <div className='flex-1 pl-4'>
                              <div className='flex items-center'>
                                <div className='flex-1'>
                                  <div className='flex flex-col'>
                                    <label className='text-base font-bold text-wt-primary-60 dark:text-wt-primary-20'>
                                      {x.fullName}
                                    </label>
                                    <span className='text-sm font-normal dark:text-wt-primary-20'>{x.email}</span>
                                  </div>
                                </div>
                                <div className='flex items-center'>
                                  <div className='flex items-center'>
                                    <input
                                      type='checkbox'
                                      className='w-4 h-4 rounded'
                                      checked={x.selected == true}
                                      readOnly={true}
                                      disabled={isSubmitting}
                                    />
                                    <label
                                      htmlFor='checkbox'
                                      className='ml-2 text-sm font-medium text-gray-400 dark:text-gray-500'
                                    ></label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div className='w-full flex justify-center mt-3'>{isLoadingMore ? <Spinner /> : ''}</div>
                </div>
              </>
            )}
          </div>
        </ScrollView>
        <Modal.Footer>
          <Button
            className='btn btn-secondary py-3 bg-wt-primary-75 hover:bg-gray-400 font-bold text-white rounded-lg ml-auto px-5'
            type='button'
            disabled={isSubmitting}
            onClick={() => closeModal()}
          >
            Cancel
          </Button>
          <Button
            className='flex items-center btn bg-wt-orange-1 hover:bg-wt-orange-3 py-3 rounded-lg font-bold text-white'
            type='button'
            isLoading={isSubmitting}
            onClick={() => {
              createGroup()
            }}
          >
            <WtSubmitIcon className='h-5 w-5 mr-2' />
            Create
          </Button>
        </Modal.Footer>
      </Modal>
      <AlertModal ref={alertModalRef} />
    </>
  )
})

export default CreateNewChatGroupPopup
