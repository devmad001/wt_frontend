import { createContext, useState } from 'react'
export const AppContext = createContext<any>({})

export const AppProvider = (props: any) => {
  const store: any = {}

  const avatarColorStore = () => {
    return JSON.parse(localStorage.getItem('avar_color') || '{}')
  }

  const backupAvatarColor = (item: any) => {
    const params = {
      [`${item.id}`]: {
        color: item.color
      }
    }
    const current: any = avatarColorStore()
    localStorage.setItem(
      'avar_color',
      JSON.stringify({
        ...params,
        ...current
      })
    )
  }

  return <AppContext.Provider value={{ avatarColorStore, backupAvatarColor }}>{props?.children}</AppContext.Provider>
}
