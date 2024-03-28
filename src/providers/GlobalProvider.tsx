import { SET_LOADING } from 'constant'
import { createContext, useReducer } from 'react'

const initialState: any = {
  loading: {
    open: false,
    content: null
  },
}

export const GlobalContext = createContext(initialState)

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case SET_LOADING:
      return {
        ...state,
        loading: action?.payload
      }
    default:
      return {
        state
      }
  }
}

export const GlobalContextProvider = (props: any) => {
  const [state, dispatch] = useReducer<any>(reducer, initialState)
  return <GlobalContext.Provider value={{ state, dispatch }}>{props.children}</GlobalContext.Provider>
}
