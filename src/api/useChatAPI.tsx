import axios from 'axios'
import { useHttpRequest } from './useHttpRequest'
import { CHATBOX_API_URL } from 'constant'

const headers = {
  headers: {
    Authorization_H:
      'ncft4T9QZTTe6WhPxIT3H1wlwoilslLpynstOsHvf9bFACazWOXaUEHUZOvMgZMPemQiFJFXne0myjL1QJfiQR06BotYlqohxdLgQZIzyOD3VIKEcJHme6pZjFYuZ2Pg',
    'Content-Type': 'multipart/form-data'
  }
}

export const useChatAPI = () => {
  const createShortcut = async (params: any): Promise<any> =>
    axios.post(`${CHATBOX_API_URL}/save_wt_short_cut_buttons`, params, headers)

  const getShortcutList = async (): Promise<any> => axios.get(`${CHATBOX_API_URL}/get_wt_short_cut_list`)

  const deleteShortcut = async (params: any): Promise<any> =>
    axios.post(`${CHATBOX_API_URL}/delete_wt_short_cut_buttons`, params, headers)

  return {
    createShortcut,
    getShortcutList,
    deleteShortcut
  }
}
