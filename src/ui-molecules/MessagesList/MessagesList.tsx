import { ScrollView, Spinner, TextAvatar } from 'ui-atoms'
import { useGroup } from 'hooks'
import { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { debounce } from 'lodash'
import { ToastControl } from 'utils/toast'
import moment from 'moment'
import { SocketIOContext } from 'providers'
import { SocketListenType } from 'constant/Socket'
import { useSignal } from 'hooks/useSignal'
import { WtSearchIcon } from 'ui-atoms/Icons'
import { LastMessage } from './elements'

const MessagesList = forwardRef((props: any, ref: any) => {
  const { socket } = useContext(SocketIOContext)
  const useGroupHook = useGroup()
  const signal = useSignal()
  const scrollViewRef: any = useRef(null)
  const hasMore: any = useRef(true)
  const groupsTemp = useRef<Group.Details[]>([])
  const [groups, setGroups] = useState<Group.Details[]>([])
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [keySearch, setKeySearch] = useState('')
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
  const currentPage = useRef(1)
  const limit = useRef(100)

  useEffect(() => {
    scrollViewRef?.current?.initScrollEvent()
    loadData(1, true)
  }, [])

  useEffect(() => {
    socket?.on(SocketListenType.GROUP_UPDATED, handleGroupUpdate)

    return () => {
      socket?.off(SocketListenType.GROUP_UPDATED, handleGroupUpdate)
    }
  }, [socket])

  useImperativeHandle(ref, () => ({
    reloadData() {
      loadData(1)
    }
  }))

  const handleGroupUpdate = async ({ data }: { data: Group.Details }) => {
    if (data) {
      if (groupsTemp.current.some((x: Group.Details) => x._id == data._id)) {
        groupsTemp.current = groupsTemp.current.map((x: Group.Details) => {
          if (x._id === data._id) {
            return data
          } else {
            return x
          }
        })
      } else {
        groupsTemp.current = [data].concat(groupsTemp.current)
      }

      groupsTemp.current = groupsTemp.current.sort((a: Group.Details, b: Group.Details) => {
        const dateA: any = new Date(a.lastMessage?.createdAt || '')
        const dateB: any = new Date(b.lastMessage?.createdAt || '')
        return dateB - dateA
      })
      setGroups(groupsTemp.current.map((x: Group.Details) => x))
    }
  }

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

    requestGetGroups(params, isLoadMore)
  }

  const loadMore = debounce(() => {
    currentPage.current = currentPage.current + 1
    loadData(currentPage.current, true)
  }, 300)

  const requestGetGroups = (params: Group.ListParams, isLoadMore = false) => {
    isLoadMore ? setIsLoadingMore(true) : setIsLoadingMore(false)
    useGroupHook.groups({
      params: params,
      callback: {
        onSuccess: async (res) => {
          if (res?.items?.length <= 0 || res?.items?.length < limit.current) hasMore.current = false

          for (let i = 0; i < res?.items.length; i++) {
            signal.saveGroupSignalKeysBase(res?.items[i])
            await signal.createGroupSignalManager(res?.items[i])
          }

          if (isLoadMore) {
            const data = groupsTemp.current.concat(res?.items?.map((x: Group.Details) => x))
            groupsTemp.current = data
          } else {
            groupsTemp.current = res?.items?.map((x: Group.Details) => x)
          }
          groupsTemp.current = groupsTemp.current.sort((a: Group.Details, b: Group.Details) => {
            const dateA: any = new Date(a.lastMessage?.createdAt || '')
            const dateB: any = new Date(b.lastMessage?.createdAt || '')
            return dateB - dateA
          })

          setGroups(groupsTemp.current)
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

  const getTime = (date: string) => {
    const _date: any = new Date(date)
    if (_date !== 'Invalid Date') {
      if (moment(_date).isSame(moment(), 'day')) {
        return moment(_date).format('hh:mm A')
      } else {
        return moment(_date).calendar(moment().add(0, 'day')) //.format('MM/DD/YYYY')
      }
    }
  }

  const clickGroupRecordHandler = (group: Group.Details) => {
    setSelectedGroupId(group._id)
    props?.onSelectItem && props?.onSelectItem(group)
  }

  return (
    <>
      <div className={'w-full flex p-4 ' + props?.className}>
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
                placeholder='Search by name...'
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
        id='message_list'
        className='list-view w-full max-h-[60vh] border-t border-wt-primary-20 overflow-y-auto dark:border-gray-600'
        onScrolledToEnd={scrolledToEndContactListHandler}
      >
        {groups.map((x: Group.Details) => {
          return (
            <div
              key={x._id}
              className={[
                'w-full px-4 py-3 border-b border-wt-primary-20 dark:border-gray-600 item cursor-pointer-all',
                selectedGroupId === x._id ? 'active' : ''
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => {
                clickGroupRecordHandler(x)
              }}
            >
              <div className='flex items-center overflow-hidden'>
                <TextAvatar label={x.name} className='basis-11 grow-0 shrink-0' />
                <div className='flex-1 pl-4'>
                  <div className='flex'>
                    <div className='flex-1 text-overflow overflow-hidden'>
                      <div className='flex flex-col'>
                        <label className='text-overflow text-medium font-bold text-wt-primary-60 dark:text-wt-primary-20'>
                          {x.name}
                        </label>
                        <LastMessage group={x} />
                      </div>
                    </div>
                    <div className='basis-24 grow-0 shrink-0 text-right'>
                      <span className='text-sm font-semibold text-wt-primary-75 dark:text-gray-400'>
                        {getTime(x.lastMessage?.createdAt || '')}
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
    </>
  )
})

export default MessagesList
