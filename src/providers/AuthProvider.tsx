import { createContext, useState } from 'react'

export const AuthContext = createContext<any>({
  username: null,
  user: null
})

export const AuthProvider = (props: ICommonProps) => {
  const [username, setUsername] = useState('')
  const [user, setUser] = useState(null)

  const store: any = {
    username,
    setUsername,
    user,
    setUser
  }

  return <AuthContext.Provider value={store}>{props?.children}</AuthContext.Provider>
}
