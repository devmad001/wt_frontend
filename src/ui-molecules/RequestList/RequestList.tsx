import { IconSvg, ScrollView, Spinner, TextAvatar } from 'ui-atoms'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useContact } from 'hooks'
import { ToastControl } from 'utils/toast'
import { debounce } from 'lodash'
import { AlertModal } from 'ui-molecules'
import { WtSearchIcon } from 'ui-atoms/Icons'

const RequestList = forwardRef((props: any, ref: any) => {
  const useContactHook = useContact()
  const alertModalRef: any = useRef(null)
  const scrollViewRef: any = useRef(null)
  const hasMore: any = useRef(true)
  const contactsTemp = useRef<Contact.Details[]>([])
  const [contacts, setContacts] = useState<Contact.Details[]>([])
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [keySearch, setKeySearch] = useState('')
  const currentPage = useRef(1)
  const limit = useRef(10)

  useEffect(() => {
    scrollViewRef?.current?.initScrollEvent()
    loadData(1)
  }, [])

  useImperativeHandle(ref, () => ({
    reloadData() {
      contactsTemp.current = []
      setContacts(contactsTemp.current)
      loadData(1, true)
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

    requestGetPendingList(params, isLoadMore)
  }

  const loadMore = debounce(() => {
    currentPage.current = currentPage.current + 1
    loadData(currentPage.current, true)
  }, 300)

  const requestGetPendingList = (params: Contact.MyContactsParams, isLoadMore = false) => {
    isLoadMore ? setIsLoadingMore(true) : setIsLoadingMore(false)
    useContactHook.pendingList({
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

  const approveRequest = (_id: string) => {
    alertModalRef?.current.open({
      title: 'Warning',
      content: 'Are you sure you want to approve this friend request?',
      isShowTwoButton: true,
      confirmButton: {
        label: 'Yes, do it',
        action: () => {
          requestApproveRequest(_id)
        }
      }
    })
  }

  const rejectRequest = (_id: string) => {
    alertModalRef?.current.open({
      title: 'Warning',
      content: 'Are you sure you want to decline this friend request?',
      isShowTwoButton: true,
      confirmButton: {
        label: 'Yes, do it',
        className: 'btn btn-orange rounded-full',
        action: () => {
          requestRejectRequest(_id)
        }
      }
    })
  }

  const requestApproveRequest = (_id: string) => {
    const id = ToastControl.toastLoading()
    const params: Contact.ApproveContactParams = {
      friendId: _id
    }
    useContactHook.approve({
      params: params,
      callback: {
        onSuccess: () => {
          ToastControl.toastUpdateSuccess(id, 'You have successfully approved request')
          props?.onApproved && props?.onApproved()
          loadData(1)
        },
        onFailure: (err) => {
          ToastControl.toastUpdateError(id, err)
        }
      }
    })
  }

  const requestRejectRequest = (_id: string) => {
    const id = ToastControl.toastLoading()
    const params: Contact.RejectContactParams = {
      friendId: _id
    }
    useContactHook.reject({
      params: params,
      callback: {
        onSuccess: () => {
          ToastControl.toastUpdateSuccess(id, 'You have successfully rejected request')
          props?.onRejected && props?.onRejected()
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
        id='request_list_scroll'
        className='list-view w-full max-h-[60vh] border-t border-wt-primary-20 overflow-y-auto dark:border-gray-600'
        onScrolledToEnd={scrolledToEndContactListHandler}
      >
        {contacts.map((x: Contact.Details) => {
          return (
            <div key={x._id} className='w-full px-4 py-3 border-b border-wt-primary-20 dark:border-gray-600 item'>
              <div className='flex items-center'>
                <div className='profile-img'>
                  <TextAvatar label={x.fullName} />
                </div>
                <div className='flex-1 pl-4'>
                  <div className='flex'>
                    <div className='flex-1'>
                      <div className='flex flex-col'>
                        <label className='text-base font-bold text-wt-primary-60 dark:text-wt-primary-20'>
                          {x.fullName}
                        </label>
                        <span className='text-sm font-normal dark:text-wt-primary-20'>{x.email}</span>
                      </div>
                    </div>
                    <div className='flex items-center pl-2'>
                      <span
                        className='text-blue-500 cursor-pointer mr-2'
                        onClick={() => {
                          approveRequest(x._id)
                        }}
                      >
                        <IconSvg icon='acceptRequest' />
                      </span>
                      <span
                        className='text-red-500 cursor-pointer'
                        onClick={() => {
                          rejectRequest(x._id)
                        }}
                      >
                        <IconSvg icon='rejectRequest' />
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

export default RequestList
