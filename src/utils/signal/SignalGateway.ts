import CacheKey from 'constant/CacheKey'
import util from './helpers'
import SignalProtocolStore from './InMemorySignalProtocolStore'

const libsignal = (window as any).libsignal
/**
 * Dummy signal server connector.
 * In a real application this component would connect to your signal
 * server for storing and fetching user public keys over HTTP.
 */
export class SignalServerStore {
  /**
   * When a user logs on they should generate their keys and then register them with the server.
   *
   * @param userId The user ID.
   * @param preKeyBundle The user's generated pre-key bundle.
   */
  registerNewPreKeyBundle(userId: string, preKeyBundle: any) {
    const storageBundle = { ...preKeyBundle }
    storageBundle.identityKey = util.arrayBufferToBase64(storageBundle.identityKey)
    storageBundle.preKey = {
      ...storageBundle.preKey,
      publicKey: util.arrayBufferToBase64(storageBundle.preKey.publicKey),
      privateKey: util.arrayBufferToBase64(storageBundle.preKey.privateKey)
    }
    storageBundle.signedPreKey.publicKey = util.arrayBufferToBase64(storageBundle.signedPreKey.publicKey)
    storageBundle.signedPreKey.signature = util.arrayBufferToBase64(storageBundle.signedPreKey.signature)
    storageBundle.signedPreKey.privateKey = util.arrayBufferToBase64(storageBundle.signedPreKey.privateKey)
    localStorage.setItem(userId, JSON.stringify(storageBundle))
  }

  updatePreKeyBundle(userId: string, preKeyBundle: any) {
    localStorage.setItem(userId, JSON.stringify(preKeyBundle))
  }
  /**
   * Gets the pre-key bundle for the given user ID.
   * If you want to start a conversation with a user, you need to fetch their pre-key bundle first.
   *
   * @param userId The ID of the user.
   */
  getPreKeyBundle(userId: string) {
    const preKeyBundle = JSON.parse(localStorage.getItem(userId) || '')
    const preKey = preKeyBundle.preKey
    preKey.publicKey = util.base64ToArrayBuffer(preKey.publicKey)
    // this.updatePreKeyBundle(userId, preKeyBundle)
    return {
      identityKey: util.base64ToArrayBuffer(preKeyBundle.identityKey),
      registrationId: preKeyBundle.registrationId,
      signedPreKey: {
        keyId: preKeyBundle.signedPreKey.keyId,
        publicKey: util.base64ToArrayBuffer(preKeyBundle.signedPreKey.publicKey),
        signature: util.base64ToArrayBuffer(preKeyBundle.signedPreKey.signature)
      },
      preKey: preKey
    }
  }
}

/**
 * A signal protocol manager.
 */
export class SignalProtocolManager {
  userId: string
  store: SignalProtocolStore | null = null
  signalServerStore: SignalServerStore | null = null

  constructor(userId: any, signalServerStore: any) {
    this.userId = userId
    this.store = new SignalProtocolStore()
    this.signalServerStore = signalServerStore
  }

  /**
   * Initialize the manager when the user logs on.
   */
  async initializeAsync() {
    const signalKeys = localStorage.getItem(CacheKey.SIGNAL_KEYS) || null
    if (signalKeys) {
      const preKeyBundle = JSON.parse(signalKeys)

      this.restorePreKeyBundle(this.userId, preKeyBundle)
    } else {
      await this._generateIdentityAsync()

      const preKeyBundle: any = await this._generatePreKeyBundleAsync()

      this.signalServerStore?.registerNewPreKeyBundle(this.userId, preKeyBundle)
    }
  }

  async initializeGroupAsync() {
    const signalKeys = localStorage.getItem(this.userId + '_base') || null
    if (signalKeys) {
      const preKeyBundle = JSON.parse(signalKeys)

      this.restorePreKeyBundle(this.userId, preKeyBundle)
    } else {
      await this._generateIdentityAsync()

      const preKeyBundle: any = await this._generatePreKeyBundleAsync()

      this.signalServerStore?.registerNewPreKeyBundle(this.userId, preKeyBundle)
    }
  }

  /**
   * Restore data in store
   * @param {*} userId
   * @param {*} preKeyBundle
   */
  restorePreKeyBundle(
    userId: any,
    preKeyBundle: {
      identityKey: { privateKey: any; publicKey: any }
      registrationId: any
      preKey: { keyId: any; privateKey: any; publicKey: any }
      signedPreKey: { keyId: any; privateKey: any; publicKey: any; signature: any }
    }
  ) {
    this.store?.put('identityKey', {
      privKey: util.base64ToArrayBuffer(preKeyBundle.identityKey.privateKey),
      pubKey: util.base64ToArrayBuffer(preKeyBundle.identityKey.publicKey)
    })
    this.store?.put('registrationId', preKeyBundle.registrationId)
    this.store?.storePreKey(preKeyBundle.preKey.keyId, {
      privKey: util.base64ToArrayBuffer(preKeyBundle.preKey.privateKey),
      pubKey: util.base64ToArrayBuffer(preKeyBundle.preKey.publicKey)
    })
    this.store?.storeSignedPreKey(preKeyBundle.signedPreKey.keyId, {
      privKey: util.base64ToArrayBuffer(preKeyBundle.signedPreKey.privateKey),
      pubKey: util.base64ToArrayBuffer(preKeyBundle.signedPreKey.publicKey)
    })

    const localParams = {
      identityKey: preKeyBundle.identityKey.publicKey,
      registrationId: preKeyBundle.registrationId,
      preKey: {
        keyId: preKeyBundle.preKey.keyId,
        publicKey: preKeyBundle.preKey.publicKey
      },
      signedPreKey: {
        keyId: preKeyBundle.signedPreKey.keyId,
        publicKey: preKeyBundle.signedPreKey.publicKey,
        signature: preKeyBundle.signedPreKey.signature
      }
    }
    localStorage.setItem(userId, JSON.stringify(localParams))
  }

  /**
   * Encrypt a message for a given user.
   *
   * @param remoteUserId The recipient user ID.
   * @param message The message to send.
   */
  async encryptMessageAsync(remoteUserId: any, message: any) {
    let sessionCipher: any = this.store?.loadSessionCipher(remoteUserId)
    if (sessionCipher == null) {
      const address = new libsignal.SignalProtocolAddress(remoteUserId, 123)
      // Instantiate a SessionBuilder for a remote recipientId + deviceId tuple.
      const sessionBuilder = new libsignal.SessionBuilder(this.store, address)

      const remoteUserPreKey = this.signalServerStore?.getPreKeyBundle(remoteUserId)
      // Process a prekey fetched from the server. Returns a promise that resolves
      // once a session is created and saved in the store, or rejects if the
      // identityKey differs from a previously seen identity for this address.
      await sessionBuilder?.processPreKey(remoteUserPreKey)

      sessionCipher = new libsignal.SessionCipher(this.store, address)
      this.store?.storeSessionCipher(remoteUserId, sessionCipher)
    }
    const cipherText = await sessionCipher?.encrypt(message)
    return cipherText
  }

  /**
   * Decrypts a message from a given user.
   *
   * @param remoteUserId The user ID of the message sender.
   * @param cipherText The encrypted message bundle. (This includes the encrypted message itself and accompanying metadata)
   * @returns The decrypted message string.
   */
  async decryptMessageAsync(remoteUserId: any, cipherText: { type: number; body: any }) {
    let sessionCipher: any = this.store?.loadSessionCipher(remoteUserId)

    if (sessionCipher == null) {
      const address = new libsignal.SignalProtocolAddress(remoteUserId, 123)
      sessionCipher = new libsignal.SessionCipher(this.store, address)
      this.store?.storeSessionCipher(remoteUserId, sessionCipher)
    }

    const messageHasEmbeddedPreKeyBundle = cipherText.type == 3
    if (messageHasEmbeddedPreKeyBundle) {
      const decryptedMessage: any = await sessionCipher?.decryptPreKeyWhisperMessage(cipherText.body, 'binary')
      return util.toString(decryptedMessage)
    } else {
      const decryptedMessage: any = await sessionCipher?.decryptWhisperMessage(cipherText.body, 'binary')
      return util.toString(decryptedMessage)
    }
  }

  async encryptMessage(message: any) {
    if (!localStorage.getItem(this.userId)) {
      throw new Error('Not found preKeyBundle')
    }
    const preKeyBundle: any = JSON.parse(localStorage.getItem(this.userId) || '')
    const identityKey: any = preKeyBundle.identityKey
    if (!identityKey) {
      throw new Error('Not found identityKey')
    }
    return libsignal.CryptoSession.encryptMessage(message, identityKey)
  }

  async decryptMessage(message: any) {
    if (!localStorage.getItem(this.userId)) {
      throw new Error('Not found preKeyBundle')
    }
    const preKeyBundle: any = JSON.parse(localStorage.getItem(this.userId) || '')
    const identityKey: any = preKeyBundle.identityKey
    if (!identityKey) {
      throw new Error('Not found preKeyBundle')
    }
    return libsignal.CryptoSession.decryptMessage(message, identityKey)
  }

  /**
   * Generates a new identity for the local user.
   */
  async _generateIdentityAsync() {
    const results = await Promise.all([
      libsignal.KeyHelper.generateIdentityKeyPair(),
      libsignal.KeyHelper.generateRegistrationId()
    ])

    this.store?.put('identityKey', results[0])
    this.store?.put('registrationId', results[1])
  }

  /**
   * Generates a new pre-key bundle for the local user.
   *
   * @returns A pre-key bundle.
   */
  async _generatePreKeyBundleAsync() {
    const result = await Promise.all([this.store?.getIdentityKeyPair(), this.store?.getLocalRegistrationId()])

    const identity = result[0]
    const registrationId = result[1]

    // PLEASE NOTE: I am creating set of 4 pre-keys for demo purpose only.
    // The libsignal-javascript does not provide a counter to generate multiple keys, contrary to the case of JAVA (KeyHelper.java)
    // Therefore you need to set it manually (as per my research)
    const keys = await Promise.all([
      libsignal.KeyHelper.generatePreKey(registrationId + 1),
      libsignal.KeyHelper.generateSignedPreKey(identity, registrationId + 1)
    ])

    const preKeys = [keys[0]]
    const signedPreKey = keys[1]

    preKeys.forEach((preKey) => {
      this.store?.storePreKey(preKey.keyId, preKey.keyPair)
    })
    this.store?.storeSignedPreKey(signedPreKey.keyId, signedPreKey.keyPair)

    return {
      identityKey: identity.pubKey,
      registrationId: registrationId,
      preKey: {
        keyId: preKeys[0].keyId,
        publicKey: preKeys[0].keyPair.pubKey,
        privateKey: preKeys[0].keyPair.privKey
      },
      signedPreKey: {
        keyId: signedPreKey.keyId,
        publicKey: signedPreKey.keyPair.pubKey,
        privateKey: signedPreKey.keyPair.privKey,
        signature: signedPreKey.signature
      }
    }
  }
}

export async function createSignalProtocolManager(userid: string, name: string, dummySignalServer: SignalServerStore) {
  const signalProtocolManagerUser = new SignalProtocolManager(userid, dummySignalServer)
  await Promise.all([signalProtocolManagerUser.initializeAsync()])
  return signalProtocolManagerUser
}

export async function createSignalProtocolManagerAll(id: string, name: string, dummySignalServer: SignalServerStore) {
  const signalProtocolManagerUser = new SignalProtocolManager(id, dummySignalServer)
  await Promise.all([signalProtocolManagerUser.initializeGroupAsync()])
  return signalProtocolManagerUser
}
