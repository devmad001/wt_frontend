import { toast } from 'react-toastify'
import { IconSvg, ScrollView, Spinner, TextAvatar } from 'ui-atoms'
import defaultAvatar from 'assets/media/png/default_avatar_img.png'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useContact, useGroup } from 'hooks'
import Message from 'constant/Message'
import { ToastControl } from 'utils/toast'
import { debounce } from 'lodash'
import { AlertModal } from 'ui-molecules'
import { WtSearchIcon } from 'ui-atoms/Icons'

const ContactsList = forwardRef((props: any, ref: any) => {
  const useContactHook = useContact()
  const useGroupHook = useGroup()
  const scrollViewRef: any = useRef(null)
  const alertModalRef: any = useRef(null)
  const hasMore: any = useRef(true)
  const contactsTemp = useRef<Contact.Details[]>([])
  const [contacts, setContacts] = useState<Contact.Details[]>([])
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [keySearch, setKeySearch] = useState('')
  const currentPage = useRef(1)
  const limit = useRef(10)
  const [selectedContact, setSelectedContact] = useState<Contact.Details | null>(null)

  useEffect(() => {
    scrollViewRef?.current?.initScrollEvent()
    loadData(1, true)
  }, [])

  useImperativeHandle(ref, () => ({
    reloadData() {
      loadData(1)
    }
  }))

  const scrolledToEndContactListHandler = () => {
    if (hasMore.current && !isLoadingMore) {
      loadMore()
    }
  }

  const loadData = (page: number, isLoadMore = false) => {
    currentPage.current = page

    const params: Contact.MyContactsParams = {
      key: keySearch,
      page: currentPage.current,
      limit: limit.current
    }

    requestGetMyContacts(params, isLoadMore)
  }

  const loadMore = debounce(() => {
    currentPage.current = currentPage.current + 1
    loadData(currentPage.current, true)
  }, 300)

  const requestGetMyContacts = (params: Contact.MyContactsParams, isLoadMore = false) => {
    isLoadMore ? setIsLoadingMore(true) : setIsLoadingMore(false)
    useContactHook.myContacts({
      params: params,
      callback: {
        onSuccess: (res) => {
          if (res?.items?.length <= 0 || res?.items?.length < limit.current) hasMore.current = false
          if (isLoadMore) {
            const data = contactsTemp.current.concat(res?.items?.map((x: Contact.Details) => x))
            contactsTemp.current = data
            setContacts(contactsTemp.current)
          } else {
            contactsTemp.current = res?.items?.map((x: Contact.Details) => x)
            setContacts(contactsTemp.current)
          }
          setIsLoadingMore(false)
        },
        onFailure: (err) => {
          ToastControl.showErrorMessage(err)
          setIsLoadingMore(false)
        }
      }
    })
  }

  const onChangedSearchInput = (e: any) => {
    setKeySearch(e.target.value)
  }

  const submitSearch = (e: any) => {
    e.preventDefault()
    loadData(1)
  }

  const selectContact = (contact: Contact.Details) => {
    setSelectedContact(contact)
    getPrivateGroupDetails(contact.privateGroup)
  }

  const getPrivateGroupDetails = (id: string | undefined) => {
    if (id) {
      useGroupHook.group({
        id,
        callback: {
          onSuccess: (res) => {
            const group: Group.Details = res
            props?.onSelectItem && props?.onSelectItem(group)
          }
        }
      })
    }
  }

  const removeContact = (friendId: string) => {
    alertModalRef?.current.open({
      title: 'Warning',
      content: 'Are you sure you want to remove this friend?',
      isShowTwoButton: true,
      confirmButton: {
        label: 'Yes, do it',
        action: () => {
          requestRemoveContact(friendId)
        }
      }
    })
  }

  const requestRemoveContact = (friendId: string) => {
    const id = ToastControl.toastLoading()
    useContactHook.remove({
      friendId,
      callback: {
        onSuccess: () => {
          ToastControl.toastUpdateSuccess(id, 'You have successfully removed contact')
          loadData(1)
        },
        onFailure: (err) => {
          ToastControl.toastUpdateError(id, err)
        }
      }
    })
  }

  return (
    <>
      <div className='w-full flex p-4'>
        <div className='flex-1 flex items-center mb-4 sm:mb-0'>
          <form className='min-w-full' onSubmit={submitSearch}>
            <label htmlFor='products-search' className='sr-only'>
              Search
            </label>
            <div className='relative min-w-full'>
              <input
                type='text'
                name='email'
                id='products-search'
                className='block w-full px-4 py-3 text-base text-wt-primary-40 bg-gray-100 border border-white text-gray-900 rounded-full focus:ring-blue-500 focus:border-blue-500'
                placeholder='Search by name, email'
                onChange={onChangedSearchInput}
              />

              <div className='absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none'>
                <WtSearchIcon className='w-4 h-4 text-wt-primary-40' />
              </div>
            </div>
          </form>
        </div>
      </div>
      <ScrollView
        ref={scrollViewRef}
        id='contact_list'
        className='list-view w-full max-h-[60vh] border-t border-wt-primary-20 overflow-y-auto dark:border-gray-600'
        onScrolledToEnd={scrolledToEndContactListHandler}
      >
        {contacts.map((x: Contact.Details) => {
          return (
            <div
              key={x._id}
              className='w-full px-4 py-3 border-b border-wt-primary-20 dark:border-gray-600 item cursor-pointer-all'
              onClick={() => selectContact(x)}
            >
              <div className='flex items-center'>
                <div className='profile-img w-[40px] h-[40px]'>
                  <TextAvatar label={x.fullName} />
                </div>
                <div className='flex-1 pl-4'>
                  <div className='flex'>
                    <div className='flex-1 overflow-hidden'>
                      <div className='flex flex-col overflow-hidden'>
                        <label className='text-overflow text-base font-bold text-wt-primary-60 dark:text-wt-primary-20'>
                          {x.fullName}
                        </label>
                        <span className='text-sm font-normal dark:text-wt-primary-20'>{x.email}</span>
                      </div>
                    </div>
                    <div className=''>
                      <span
                        className='text-red-500 cursor-pointer'
                        onClick={(e) => {
                          e.stopPropagation()
                          removeContact(x._id)
                        }}
                      >
                        <IconSvg icon='removeContactOutline' />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </ScrollView>
      {isLoadingMore ? (
        <div className='flex justify-center mt-2'>
          <Spinner />
        </div>
      ) : (
        ''
      )}
      <div className='py-2'></div>
      <AlertModal ref={alertModalRef} />
    </>
  )
})

export default ContactsList
