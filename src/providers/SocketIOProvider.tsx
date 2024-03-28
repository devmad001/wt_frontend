import { createContext, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { SOCKET_ENDPOINT } from 'constant'
import { getAccessToken } from 'utils'
export const SocketIOContext = createContext<any>({})

export const SocketIOProvider = (props: any) => {
  const [socket, setSocket] = useState<any>(null)
  const socketRef = useRef<any>(null)

  const connectSocket = () => {
    if (socketRef?.current && socketRef.current?.connected) return

    socketRef.current = io(`${SOCKET_ENDPOINT}`, {
      auth: {
        token: getAccessToken()
      },
      path: '/socket.io',
      forceNew: true,
      reconnectionAttempts: 100,
      timeout: 10000,
      transports: ['websocket']
    })

    socketRef?.current?.on('connect', () => {
      console.log('socket.io connect', socketRef.current.id)
    })

    socketRef?.current?.on('disconnect', () => {
      console.log('socket.io disconnect', socketRef.current.id)
    })

    socketRef?.current?.on('reconnect', () => {
      console.log('socket.io reconnect', socketRef.current.id)
    })

    setSocket(socketRef.current)
  }

  const disconnectSocket = () => {
    if (socket) {
      socket.removeAllListeners()
      socket.disconnect()
      socket.close()
    }
  }

  return (
    <SocketIOContext.Provider value={{ socket, connectSocket, disconnectSocket }}>
      {props?.children}
    </SocketIOContext.Provider>
  )
}
