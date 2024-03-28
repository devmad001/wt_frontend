import { createContext, useEffect, useState } from 'react'
import { SignalProtocolManager, SignalServerStore, createSignalProtocolManagerAll } from 'utils/signal/SignalGateway'
import { useAuthAPI, useGroupAPI } from 'api'
import SignalProtocolStore from 'utils/signal/InMemorySignalProtocolStore'
import util from 'utils/signal/helpers'
import CacheKey from 'constant/CacheKey'
import { getUserInfo } from 'utils'
export const SignalContext = createContext<any>({})

export const SignalProvider = (props: any) => {
  const authAPI = useAuthAPI()
  const groupAPI = useGroupAPI()
  const [dummySignalServer, setDummySignalServer] = useState(new SignalServerStore())
  const [signalProtocolManager, setSignalProtocolManager] = useState<SignalProtocolManager>()
  const [user, setUser] = useState<User.Details>()

  useEffect(() => {
    const user = getUserInfo()
    if (user) {
      restoreSignalManager(user)
    }
  }, [])

  const createUserSignalManager = async (user: User.Details) => {
    setUser(user)
    if (user?.signalKeys) {
      await restoreSignalManager(user)
    } else {
      const signalProtocolManagerGroup: SignalProtocolManager = await createSignalProtocolManagerAll(
        user?._id,
        user?.fullName,
        dummySignalServer
      )
      setSignalProtocolManager(signalProtocolManagerGroup)
      requestUpdateSignalKeys(user?._id, signalProtocolManagerGroup.store)
    }
  }

  const restoreSignalManager = async (user: User.Details) => {
    const signalProtocolManagerGroup: SignalProtocolManager = await createSignalProtocolManagerAll(
      user?._id,
      user?.fullName,
      dummySignalServer
    )
    setSignalProtocolManager(signalProtocolManagerGroup)
  }

  const requestUpdateSignalKeys = async (userId: string, store: SignalProtocolStore | null) => {
    if (!store) return
    if (!userId) return
    const localSignalKeys: string | null = localStorage.getItem(userId)
    if (localSignalKeys) {
      try {
        const signalKeys = JSON.parse(localSignalKeys)
        const indentifyKey = store.get('identityKey')
        const registrationId = store.get('registrationId')
        const preKey = await store.loadPreKey(registrationId + 1)
        const signedPreKey = await store.loadSignedPreKey(registrationId + 1)

        const params: User.updateSignalKeysParams = {
          identityKey: {
            publicKey: util.arrayBufferToBase64(indentifyKey?.pubKey),
            privateKey: util.arrayBufferToBase64(indentifyKey?.privKey)
          },
          registrationId: registrationId,
          preKey: {
            keyId: registrationId + 1,
            publicKey: util.arrayBufferToBase64(preKey?.pubKey),
            privateKey: util.arrayBufferToBase64(preKey?.privKey)
          },
          signedPreKey: {
            keyId: registrationId + 1,
            publicKey: util.arrayBufferToBase64(signedPreKey?.pubKey),
            privateKey: util.arrayBufferToBase64(signedPreKey?.privKey),
            signature: signalKeys?.signedPreKey?.signature
          }
        }
        localStorage.setItem(CacheKey.SIGNAL_KEYS, JSON.stringify(params))
        await authAPI.updateSignalKeys(params)
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <SignalContext.Provider
      value={{
        signalProtocolManager,
        createUserSignalManager,
        restoreSignalManager,
        requestUpdateSignalKeys
      }}
    >
      {props?.children}
    </SignalContext.Provider>
  )
}
