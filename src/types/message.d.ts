declare namespace Message {
  export interface Details {
    _id: string
    content: string
    createdAt: string
    group: string
    images: any[]
    sender: Sender
    source: string
    type: string
    updatedAt: string
  }

  export interface TypingDetails {
    groupId: string
    memberId: string
    isTyping: boolean
  }

  export interface Sender {
    _id: string
    fullName: string
  }

  export interface CreateParams {
    groupId: string
    content: string
  }

  export interface ListParams {
    groupId: string
    markId?: string | null
  }
}
