declare namespace User {
  export interface Details {
    _id: string
    fullName: string
    address: string
    phone: string
    email: string
    role: string
    signalKeys?: SignalKeys
    createdAt: string
    updatedAt: string
    agency?: Agency
  }

  export interface SignalKeys {
    identityKey: { publicKey: string; privateKey: string }
    preKey: { keyId: number; publicKey: string; privateKey: string }
    registrationId: number
    signedPreKey: { keyId: number; publicKey: string; privateKey: string; signature: string }
  }

  export interface updateSignalKeysParams {
    identityKey: { publicKey: string; privateKey: string }
    preKey: { keyId: number; publicKey: string; privateKey: string }
    registrationId: number
    signedPreKey: { keyId: number; publicKey: string; privateKey: string; signature: string }
  }

  export interface GetPublicKeysParams {
    userIds: string[]
  }

  export interface MemberPublicKeys {
    _id: string
    email: string
    fullName: string
    signalKeys: SignalKeys
  }

  export interface GetUsersParams {
    key: string
    page: number
    limit: number
    role: string
    reviewStatus?: string
  }

  export interface Agency {
    _id: string
    name: string
  }

  export interface CreateUserParams {
    fullName: string
    role: string
    phone: string
    email: string
    agency: string
    fieldOffice: string
    squad?: string
  }

  export interface UpdateUserParams {
    fullName: string
    role: string
    phone: string
    email: string
    agency: string
    fieldOffice: string
    squad?: string
  }
}
