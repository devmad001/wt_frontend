import { IconSvg } from 'ui-atoms'
import './style.css'
import { useContext, useEffect, useRef, useState } from 'react'
import {
  AddContactPopup,
  CreateNewChatGroupPopup,
  AlertModal,
  MessagesList,
  ContactsList,
  RequestList,
  ChatBox
} from 'ui-molecules'
import { SocketIOContext } from 'providers/SocketIOProvider'
import { debounce } from 'lodash'
import { WtAddSquare, WtProfileAdd } from 'ui-atoms/Icons'

function Message() {
  const { socket } = useContext(SocketIOContext)
  const alertModalRef: any = useRef(null)
  const createNewGroupPopupRef: any = useRef(null)
  const addContactPopupRef: any = useRef(null)
  const messagesListRef: any = useRef(null)
  const contactsListRef: any = useRef(null)
  const requestListRef: any = useRef(null)
  const chatBoxRef: any = useRef(null)
  const [tab, setTab] = useState(0)
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
  const [cacheSelectedGroupId, setCacheSelectedGroupId] = useState<string[] | null>([])

  useEffect(() => {
    //
  }, [socket])

  const changeTab = (index: number) => {
    setTab(index)
  }

  const openCreateNewGroupPopup = () => {
    createNewGroupPopupRef?.current.openPopup()
  }

  const openAddContactPopup = () => {
    addContactPopupRef?.current.openPopup()
  }

  const sentRequestHandler = () => {
    requestListRef?.current?.reloadData()
  }

  const onCreatedNewChatGroupHandler = () => {
    messagesListRef?.current?.reloadData()
  }

  const messageSelectedItemHandler = debounce((group: Group.Details) => {
    setSelectedGroupId(group._id)
    setTimeout(() => {
      chatBoxRef?.current?.reload(group)
    }, 100)
  }, 300)

  return (
    <>
      <div className='p-4 pt-0 px-6 block sm:flex items-center justify-between lg:mt-1.5 dark:bg-gray-800'>
        <div className='p-4 flex flex-col md:flex-row w-full items-center bg-white rounded-lg dark:bg-gray-700'>
          <div className='flex-1 w-full'>
            <h1 className='text-xl font-bold text-gray-900 sm:text-2xl dark:text-white mb-2'>Chat</h1>
            <nav className='flex mb-2' aria-label='Breadcrumb'>
              <ol className='inline-flex items-center space-x-1 text-sm font-medium md:space-x-2'>
                <li className='inline-flex items-center'>
                  <a
                    href='#'
                    className='inline-flex items-center font-semibold text-wt-primary-40 hover:text-primary-600 dark:text-gray-300 dark:hover:text-white'
                  >
                    <span className='mr-1'>
                      <IconSvg icon='homeIcon' />
                    </span>
                    Home
                  </a>
                </li>
                <li>
                  <div className='flex items-center'>
                    <span className='text-wt-primary-65 dark:text-gray-300'>/</span>
                    <a href='#' className='ml-1 font-semibold text-wt-primary-65 md:ml-2 dark:text-gray-300'>
                      Chat
                    </a>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
          <div className='mb-1 w-full sm:w-auto'>
            <div className='items-center justify-end block sm:flex'>
              <button
                id='uploadFile'
                className='btn bg-wt-orange-1 hover:bg-wt-orange-3 px-3 text-white rounded-lg flex items-center ml-auto sm:ml-0'
                type='button'
                onClick={() => openCreateNewGroupPopup()}
              >
                <WtAddSquare className='h-5 w-5' />
                <span className='ml-2'>New Group</span>
              </button>
              <button
                id='uploadFile'
                className='btn bg-blue-500 hover:bg-blue-400 px-3 text-white rounded-lg flex items-center ml-2'
                type='button'
                onClick={() => openAddContactPopup()}
              >
                <WtProfileAdd className='h-5 w-5' />
                <span className='ml-2'>Add Contact</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className='p-4 pt-0 px-6 flex flex-col dark:bg-gray-800'>
        <div className='overflow-x-auto'>
          <div className='inline-block min-w-full align-middle'>
            <div className='grid grid-cols-12 gap-4'>
              <div className='col-span-4'>
                <div className='min-w-full bg-white rounded-lg dark:bg-gray-700'>
                  <div className='tab-bar'>
                    <ul className='flex flex-wrap cursor-pointer'>
                      <li className={'tab-item' + (tab === 0 ? ' active' : '')}>
                        <a
                          href='#'
                          className='inline-block p-4 rounded-t-lg active'
                          onClick={() => {
                            changeTab(0)
                          }}
                        >
                          Messages
                        </a>
                      </li>
                      <li className={'tab-item' + (tab === 1 ? ' active' : '')}>
                        <a
                          href='#'
                          className='inline-block p-4 rounded-t-lg'
                          aria-current='page'
                          onClick={() => {
                            changeTab(1)
                          }}
                        >
                          Contacts
                        </a>
                      </li>
                      <li className={'tab-item' + (tab === 2 ? ' active' : '')}>
                        <a
                          href='#'
                          className='inline-block p-4 rounded-t-lg'
                          onClick={() => {
                            changeTab(2)
                          }}
                        >
                          Requests
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className='tab-content'>
                    <div className={'w-full' + (tab === 0 ? '' : ' hidden')} id='messages-tab'>
                      <MessagesList ref={messagesListRef} onSelectItem={messageSelectedItemHandler} />
                    </div>
                    <div className={'w-full' + (tab === 1 ? '' : ' hidden')} id='contacts-tab'>
                      <ContactsList ref={contactsListRef} onSelectItem={messageSelectedItemHandler} />
                    </div>
                    <div className={'w-full' + (tab === 2 ? '' : ' hidden')} id='requests-tab'>
                      <RequestList
                        ref={requestListRef}
                        onApproved={() => {
                          contactsListRef?.current?.reloadData()
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-span-8'>
                {selectedGroupId ? <ChatBox ref={chatBoxRef} className={selectedGroupId ? '' : 'hidden'} /> : ''}
              </div>
            </div>
          </div>
        </div>
      </div>
      <CreateNewChatGroupPopup
        ref={createNewGroupPopupRef}
        onCreated={() => {
          onCreatedNewChatGroupHandler()
        }}
      />
      <AddContactPopup
        ref={addContactPopupRef}
        sentRequest={() => {
          sentRequestHandler()
        }}
      />
      <AlertModal ref={alertModalRef} />
    </>
  )
}

export default Message
