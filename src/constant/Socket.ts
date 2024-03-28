export enum SocketListenType {
  ROOM_JOINED = 'room.join',
  MESSAGE_CREATE = 'message.created',
  MESSAGE_TYPING = 'message.typing',
  GROUP_UPDATED = 'group.updated',

  FINAWARE_SPAWN_DOWNLOAD = 'spawn_download'
}

export enum SocketEmitType {
  ROOM_JOIN = 'room.join',
  MESSAGE_TYPING = 'message.typing',

  FINAWARE_SPAWN_DOWNLOAD = 'spawn_download'
}
