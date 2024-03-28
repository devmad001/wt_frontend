import { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Button, IconSvg, ScrollView, Spinner, TextAvatar } from 'ui-atoms'
import { useMessage } from 'hooks/useMessage'
import { ToastControl } from 'utils/toast'
import moment from 'moment'
import {} from 'providers/SocketIOProvider'
import { SocketEmitType, SocketListenType } from 'constant/Socket'
import { AuthContext, SignalContext, SocketIOContext } from 'providers'
import { debounce } from 'lodash'
import { useAuth } from 'hooks'
import { SignalProtocolManager } from 'utils/signal/SignalGateway'
import { useSignal } from 'hooks/useSignal'
import { WtSendMessage } from 'ui-atoms/Icons'

const ChatBox = forwardRef((props: any, ref: any) => {
  const doneTypingInterval = 2000
  const signal = useSignal()
  const { socket } = useContext(SocketIOContext)
  const authContext = useContext(AuthContext)
  const { signalProtocolManager } = useContext(SignalContext)
  const authHook = useAuth()
  const messsageHook = useMessage()
  const scrollViewRef = useRef<any>(null)
  const inputMessageRef = useRef<any>(null)
  const groupId = useRef('')
  const markId = useRef<string | null>(null)
  const hasMore = useRef(true)
  const typingTimer = useRef<any>(null)
  const messagesTemp = useRef<Message.Details[]>([])
  const signalManagerRef = useRef<SignalProtocolManager>()
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isSendingMessage, setIsSendingMessage] = useState(false)
  const [group, setGroup] = useState<Group.Details | null>(null)
  const [messageContent, setMessageContent] = useState('')
  const [messages, setMessages] = useState<Message.Details[]>([])
  const [typingMsg, setTypingMsg] = useState('')

  useEffect(() => {
    //
  }, [])

  useEffect(() => {
    socket?.emit(SocketEmitType.ROOM_JOIN, groupId.current)

    socket?.on(SocketListenType.MESSAGE_CREATE, handleNewMessage)
    socket?.on(SocketListenType.GROUP_UPDATED, handleGroupUpdate)
    socket?.on(SocketListenType.MESSAGE_TYPING, handleMessageTyping)

    return () => {
      socket?.off(SocketListenType.MESSAGE_CREATE, handleNewMessage)
      socket?.off(SocketListenType.GROUP_UPDATED, handleGroupUpdate)
    }
  }, [socket, group])

  useImperativeHandle(ref, () => ({
    reload(group: Group.Details) {
      reload(group)
    }
  }))

  const handleNewMessage = async ({ data }: { data: Message.Details }) => {
    if (data) {
      const msg = await signalManagerRef.current?.decryptMessage(data.content)
      data.content = msg
      messagesTemp.current.push(data)
      setMessages(messagesTemp.current.map((x: Message.Details) => x))
      scrollViewRef?.current?.scrollToEnd()
    }
  }

  const handleGroupUpdate = ({ data }: { data: Group.Details }) => {
    if (data) {
      if (data._id == group?._id) {
        setGroup(data)
      }
    }
  }

  const handleMessageTyping = ({ data }: { data: Message.TypingDetails }) => {
    const groupDetails = group
    if (groupDetails) {
      groupDetails.members = groupDetails?.members?.map((x: Contact.Details) => {
        if (x._id == data?.memberId && data?.memberId != authContext.user._id) {
          return {
            ...x,
            isTyping: data?.isTyping
          }
        } else {
          return x
        }
      })
    }
    setGroup(groupDetails)
    setTypingMsg(getMembersAreTyping(groupDetails?.members || []))
  }

  const getMembersAreTyping = (members: Contact.Details[]): string => {
    const msgs: any = members?.map((x: Contact.Details) => {
      if (x.isTyping) {
        return `${x.fullName} is typing`
      } else {
        return ''
      }
    })
    if (msgs && msgs.length > 0) {
      return [].concat(msgs).filter(Boolean).join(', ')
    } else {
      return ''
    }
  }

  const reload = async (group: Group.Details) => {
    setGroup(group)
    groupId.current = group._id
    messagesTemp.current = []
    setMessages(messagesTemp.current)

    await handleGroupSignal(group)
    loadMessages()
  }

  const getMemberPublicKeys = (userIds: string[] | undefined) => {
    const params: User.GetPublicKeysParams = {
      userIds: userIds || []
    }
    authHook.getPublicKeys({
      params,
      callback: {
        onSuccess: (res) => {
          if (res && res instanceof Array) {
            res.forEach((x: User.MemberPublicKeys) => {
              if (x.signalKeys) {
                const params = {
                  identityKey: x.signalKeys?.identityKey?.publicKey,
                  registrationId: x.signalKeys?.registrationId,
                  preKey: {
                    keyId: x.signalKeys?.preKey?.keyId,
                    publicKey: x.signalKeys?.preKey?.publicKey
                  },
                  signedPreKey: {
                    keyId: x.signalKeys?.signedPreKey?.keyId,
                    publicKey: x.signalKeys?.signedPreKey?.publicKey,
                    signature: x.signalKeys?.signedPreKey?.signature
                  }
                }
                localStorage.setItem(x._id, JSON.stringify(params))
              }
            })
          }
        },
        onFailure: (err) => {
          console.log(err)
        }
      }
    })
  }

  const handleGroupSignal = async (group: Group.Details) => {
    signal.saveGroupSignalKeysBase(group)
    signalManagerRef.current = await signal.createGroupSignalManager(group)
  }

  const loadMessages = () => {
    markId.current = null
    hasMore.current = true
    requestLoadMessages()
  }

  const loadMoreMessages = debounce(() => {
    if (messagesTemp.current.length <= 0) return
    requestLoadMessages(true)
  }, 300)

  const requestLoadMessages = debounce((isLoadMore = false) => {
    setIsLoadingMore(true)
    const params: Message.ListParams = {
      groupId: groupId.current,
      markId: markId.current
    }

    messsageHook.messages({
      params: params,
      callback: {
        onSuccess: async (res) => {
          const data: Message.Details[] = res?.items?.map((x: Message.Details) => x).reverse()
          for (let i = 0; i < data.length; i++) {
            if (data[i].source === 'user' && i < data.length) {
              const remoteId = data[i].sender._id
              const msg = await signalManagerRef.current?.decryptMessage(data[i].content)
              data[i].content = msg
            }
          }
          hasMore.current = !res?.pageInfo?.isEnd

          if (data.length > 0) {
            markId.current = data[0]._id
          }

          if (isLoadMore) {
            messagesTemp.current = data.concat(messagesTemp.current)
            setMessages(messagesTemp.current)
            scrollViewRef?.current.restorePositionScrollOnTop()
          } else {
            messagesTemp.current = data
            setMessages(data)
            scrollViewRef?.current?.scrollToEnd()
          }

          setIsLoadingMore(false)
        },
        onFailure: (err) => {
          ToastControl.showErrorMessage(err)
          setIsLoadingMore(false)
        }
      }
    })
  }, 300)

  const onScrolledToTopHandler = () => {
    if (hasMore.current && !isLoadingMore) {
      loadMoreMessages()
    }
  }

  const onInputMessage = (e: any) => {
    setMessageContent(e.target.value)
  }

  const onKeyUpHandler = (e: any) => {
    clearTimeout(typingTimer?.current)
    typingTimer.current = setTimeout(() => {
      emitEndTyping()
    }, doneTypingInterval)
  }

  const onKeyDownHandler = (e: any) => {
    clearTimeout(typingTimer?.current)
    emitTyping()
  }

  const emitTyping = () => {
    socket.emit(SocketEmitType.MESSAGE_TYPING, {
      groupId: groupId.current,
      isTyping: true
    })
  }

  const emitEndTyping = () => {
    socket.emit(SocketEmitType.MESSAGE_TYPING, {
      groupId: groupId.current,
      isTyping: false
    })
  }

  const onSubmitSendMessage = (e: any) => {
    e.preventDefault()
    if (messageContent) {
      requestSendMessage()
    }
  }

  const requestSendMessage = async () => {
    setIsSendingMessage(true)
    const cipherText = await signalManagerRef.current?.encryptMessage(messageContent)

    const params: Message.CreateParams = {
      groupId: groupId.current,
      content: cipherText
    }

    messsageHook.createMessage({
      params,
      callback: {
        onSuccess: (res) => {
          setMessageContent('')
          setTimeout(() => {
            inputMessageRef?.current?.focus()
          })
          setIsSendingMessage(false)
        },
        onFailure: (err) => {
          ToastControl.showErrorMessage(err)
          setIsSendingMessage(false)
        }
      }
    })
  }

  const clickSendMessageHandler = () => {
    if (messageContent) {
      requestSendMessage()
    }
  }

  const getTime = (date: string) => {
    const _date: any = new Date(date)
    if (_date !== 'Invalid Date') {
      if (moment(_date).isSame(moment(), 'day')) {
        return moment(_date).format('hh:mm A')
      } else {
        return moment(_date).format('MM/DD/YYYY')
      }
    }
  }

  return (
    <div className='chatbox'>
      <div className='chatbox-header'>
        <div className='w-full flex items-center'>
          <div className='avatar'>
            <TextAvatar label={group?.name} className='w-12 h-12 text-2xl' />
          </div>
          <div className='flex-1 flex flex-col overflow-hidden'>
            <h1 className='text-overflow text-lg font-bold dark:text-gray-200 ml-4'>{group?.name}</h1>
            <span className='text-overflow text-sm font-medium italic dark:text-wt-primary-20 ml-4'>
              {typingMsg ? '...' + typingMsg : ''}
            </span>
          </div>
          <div className=''>
            <button
              id='removeContact'
              className='btn btn-outline-orange rounded-full flex items-center ml-auto hidden'
              type='button'
              onClick={() => {
                //
              }}
            >
              <IconSvg icon='removeContact' />
              <span className='ml-2'>Remove contact</span>
            </button>
          </div>
        </div>
      </div>
      <ScrollView
        ref={scrollViewRef}
        id='message_list'
        className='chatbox-body w-full max-h-[60vh] border-t border-wt-primary-20 overflow-y-auto dark:border-gray-600 px-4'
        onScrolledToTop={onScrolledToTopHandler}
      >
        <>
          {isLoadingMore ? (
            <>
              <div className='flex justify-center mt-2 mb-2'>
                <Spinner />
              </div>
              <p className='w-full text-center text-sm text-wt-primary-75'>Loading messages...</p>
            </>
          ) : (
            ''
          )}
          {messages.map((msg: Message.Details) => {
            return (
              <div
                key={msg._id}
                className={[
                  'chat-msg px-4 py-3 mb-2',
                  msg.source != 'system' ? (msg.sender._id === authContext.user?._id ? 'from-me' : '') : 'system'
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {msg.source === 'system' ? (
                  <div className='flex items-center justify-center'>
                    <span className='text-sm font-semibold dark:text-wt-primary-20'>{msg.content}</span>
                  </div>
                ) : (
                  <div className='flex items-center'>
                    <div className='profile-img'>
                      <TextAvatar label={msg.sender?.fullName} />
                    </div>
                    <div className='flex-1 px-4'>
                      <div className='h-full flex items-top'>
                        <div className='flex flex-col'>
                          <label className='text-sm font-bold text-wt-primary-50 dark:text-wt-primary-20'>
                            {msg.sender?.fullName}
                          </label>
                          <span className='text-base font-medium dark:text-wt-primary-20 break-words break-word'>
                            {msg.content}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className='border-space h-12 mx-4'></div>
                    <div className='message-action'>
                      {/* <div className=''>
                        <button className='text-wt-primary-50 dark:text-gray-200 mr-2'>
                          <IconSvg icon='actionMessageItem' />
                        </button>
                      </div> */}
                      <span className='text-sm italic font-sm dark:text-gray-400'>{getTime(msg.createdAt)}</span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </>
      </ScrollView>
      <div className='chatbox-footer'>
        <div className='flex items-center'>
          {/* <button
            id='attachmentBtn'
            className='btn btn-secondary btn-img-attach rounded-full flex items-center'
            type='button'
            onClick={() => {
              //
            }}
          >
            <IconSvg icon='imageAttachment' />
          </button> */}
          <form className='flex-1 px-4' onSubmit={onSubmitSendMessage}>
            <div className='relative min-w-full'>
              <input
                ref={inputMessageRef}
                type='text'
                name='chatInput'
                id='inputChatContent'
                className='form-control form-gray'
                placeholder='Type your message here...'
                disabled={isSendingMessage}
                value={messageContent}
                onInput={onInputMessage}
                onKeyUp={onKeyUpHandler}
                onKeyDown={onKeyDownHandler}
              />
              <button type='submit' className='hidden'></button>
            </div>
          </form>
          <Button
            className='flex items-center btn btn-primary py-3 bg-blue-500 hover:bg-blue-600 text-base font-bold text-white rounded-lg px-6'
            type='button'
            isLoading={isSendingMessage}
            disabled={isSendingMessage || !messageContent}
            onClick={clickSendMessageHandler}
          >
            <span className='mr-2'>Send</span>
            <WtSendMessage className='w-6 h-6' />
          </Button>
        </div>
      </div>
    </div>
  )
})

export default ChatBox
