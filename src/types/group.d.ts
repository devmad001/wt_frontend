declare namespace Group {
  export interface Details {
    _id: string
    name: string
    updatedAt: string
    createdAt: string
    members: Contact.Details[]
    lastMessage: LastMessage
    signalKeys: SignalKeys
  }

  export interface SignalKeys {
    identityKey: { publicKey: string; privateKey: string }
    preKey: { keyId: number; publicKey: string; privateKey: string }
    registrationId: number
    signedPreKey: { keyId: number; publicKey: string; privateKey: string; signature: string }
  }

  export interface LastMessage {
    content: string
    createdAt: string
    senderFullName: string
    senderId: string
    updatedAt: string
  }

  export interface CreateParams {
    name: string
    memberIds: string[]
  }

  export interface ListParams {
    key?: string
    page?: number
    limit?: number
  }

  export interface LeaveParams {
    groupId: string
  }

  export interface UpdateSignalKeysParams {
    identityKey: { publicKey: string; privateKey: string }
    preKey: { keyId: number; publicKey: string; privateKey: string }
    registrationId: number
    signedPreKey: { keyId: number; publicKey: string; privateKey: string; signature: string }
  }
}
