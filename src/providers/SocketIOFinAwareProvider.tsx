import { createContext, useRef, useState } from 'react'
import { FINAWARE_SOCKET_ENDPOINT } from 'constant'
export const SocketIOFinAwareContext = createContext<any>({})

export const SocketIOFinAwareProvider = (props: any) => {
  const [data, setData] = useState<any>(null)
  const socketRef = useRef<any>(null)

  const connectSocket = (case_id: string | number, session_id: string | number) => {
    if (
      socketRef.current &&
      (socketRef.current.readyState === WebSocket.OPEN || socketRef.current.readyState === WebSocket.CONNECTING)
    ) {
      socketRef.current.close()
    socketRef.current = null;
    }
    
    socketRef.current = new WebSocket(`${FINAWARE_SOCKET_ENDPOINT}?case_id=${case_id}&session_id=${session_id}`)

    socketRef.current.onmessage = (event: any) => {
      try {
        // Try to parse the message as JSON
        const receivedData: any = JSON.parse(event.data)
        console.log("FinAware Socket", receivedData);
        setData(receivedData)
      } catch (e) {
        // If JSON parsing fails, handle it as a plain text message
        console.log('Received non-JSON message: ', event.data)
        // Handle non-JSON messages if necessary
      }
    }
  }

  const disconnectSocket = () => {
    if (!socketRef?.current) {
      socketRef.current.close()
      socketRef.current = null
    }
  }

  return (
    <SocketIOFinAwareContext.Provider
      value={{
        finAwareSocket: socketRef.current,
        socketData: data,
        connectFinAwareSocket: connectSocket,
        disconnectFinAwareSocket: disconnectSocket
      }}
    >
      {props?.children}
    </SocketIOFinAwareContext.Provider>
  )
}
