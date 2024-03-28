import { get, noop } from 'lodash'
import { useGroupAPI } from 'api'
import { useRef, useState } from 'react'
import { SignalProtocolManager, SignalServerStore, createSignalProtocolManagerAll } from 'utils/signal/SignalGateway'
import SignalProtocolStore from 'utils/signal/InMemorySignalProtocolStore'
import util from 'utils/signal/helpers'

export const useSignal = () => {
  const groupAPI = useGroupAPI()
  const groupRef = useRef<Group.Details>()

  const saveGroupSignalKeysBase = (group: Group.Details) => {
    if (!group?.signalKeys) return
    localStorage.setItem(group?._id + '_group_base', JSON.stringify(group?.signalKeys))
  }

  const createGroupSignalManager = async (group: Group.Details): Promise<SignalProtocolManager | undefined> => {
    groupRef.current = group
    if (group?.signalKeys) {
      const signalProtocolManagerGroup: SignalProtocolManager = await createSignalProtocolManagerAll(
        group?._id + '_group',
        group?.name,
        new SignalServerStore()
      )
      return signalProtocolManagerGroup
    } else {
      try {
        const signalProtocolManagerGroup: SignalProtocolManager = await createSignalProtocolManagerAll(
          group?._id + '_group',
          group?.name,
          new SignalServerStore()
        )
        await requestUpdateSignalKeys(group?._id, signalProtocolManagerGroup.store)
        return signalProtocolManagerGroup
      } catch (error) {
        console.log(error)
        return undefined
      }
    }
  }

  const requestUpdateSignalKeys = async (groupId: string, store: SignalProtocolStore | null) => {
    if (!store) return
    if (!groupId) return
    const localSignalKeys: string | null = localStorage.getItem(groupId + '_group')
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
        localStorage.setItem(groupId + '_group_base', JSON.stringify(params))
        await groupAPI.updateSignalKeys(groupId, params)
      } catch (error) {
        console.log(error)
      }
    }
  }

  return {
    createGroupSignalManager,
    requestUpdateSignalKeys,
    saveGroupSignalKeysBase
  }
}
