import { SocketListenType } from 'constant/Socket'
import { useSignal } from 'hooks/useSignal'
import { AuthContext, SocketIOContext } from 'providers'
import { forwardRef, useContext, useEffect, useRef, useState } from 'react'
import { SignalProtocolManager } from 'utils/signal/SignalGateway'

const LastMessage = forwardRef((props: any, ref: any) => {
  const { socket } = useContext(SocketIOContext)
  const signal = useSignal()
  const authContext = useContext(AuthContext)
  const signalManagerRef = useRef<SignalProtocolManager>()
  const [group, setGroup] = useState<Group.Details | null>(null)
  const [lastMessage, setLastMessage] = useState('')

  useEffect(() => {
    setGroup(props?.group || null)
    setLastMessage('')
    decryptLastMessage(props?.group)
  }, [])

  useEffect(() => {
    decryptLastMessage(group)
  }, [group])

  useEffect(() => {
    socket?.on(SocketListenType.GROUP_UPDATED, handleGroupUpdate)

    return () => {
      socket?.off(SocketListenType.GROUP_UPDATED, handleGroupUpdate)
    }
  }, [socket, group])

  const handleGroupUpdate = ({ data }: { data: Group.Details }) => {
    if (data) {
      if (data._id == group?._id) {
        setGroup(data)
        decryptLastMessage(data)
      }
    }
  }

  const decryptLastMessage = async (group: Group.Details | null) => {
    if (!group) return
    signal.saveGroupSignalKeysBase(group)
    signalManagerRef.current = await signal.createGroupSignalManager(group)
    const msg = await signalManagerRef.current?.decryptMessage(group?.lastMessage?.content)
    setLastMessage(msg)
  }

  return (
    <>
      <span className='text-overflow text-sm font-normal dark:text-wt-primary-20'>
        {group?.lastMessage?.senderId !== authContext.user._id ? group?.lastMessage?.senderFullName + ': ' : ''}
        {lastMessage}
      </span>
    </>
  )
})

export default LastMessage
