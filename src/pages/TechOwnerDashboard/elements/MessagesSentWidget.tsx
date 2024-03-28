import iconWidget from 'assets/media/png/messages-wg.png'
import { useAdmin } from 'hooks'
import moment from 'moment'

import { useEffect, useState } from 'react'
import { Spinner } from 'ui-atoms'

function MessagesSentWidget() {
  const adminAPI = useAdmin()
  const [isLoading, setIsLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [messages, setMessages] = useState<any[]>([])

  useEffect(() => {
    getMessagesSent()
    return () => {
      //
    }
  }, [])

  const getMessagesSent = () => {
    setIsLoading(true)
    adminAPI.messagesSent({
      callback: {
        onSuccess: (res) => {
          setTotal(res?.total || 0)
          setMessages(
            res?.items?.map((item: any) => {
              return {
                ...item,
                date: moment(item?.date).format('MMM DD')
              }
            })
          )
          setIsLoading(false)
        },
        onFailure: () => {
          setIsLoading(false)
        }
      }
    })
  }

  return (
    <>
      <div className='h-full w-full rounded-lg bg-gray-50'>
        <div className='flex items-center p-4 bg-white border-b border-gray-200 rounded-t-lg'>
          <img src={iconWidget} className='w-7 h-7 mr-3' />
          <label className='text-lg font-bold text-wt-primary-40'>Messages sent</label>

          <div className='border-space h-10 ml-auto mr-6'></div>
          <div className='flex items-center'>
            <span className='text-6xl font-semibold text-wt-primary-40'>{total}</span>
          </div>
        </div>
        <div className='overflow-hidden flex flex-col p-4'>
          {isLoading ? (
            <div className='flex items-center justify-center w-full h-full'>
              <Spinner />
            </div>
          ) : (
            <div className='overflow-auto max-h-[300px] min-w-full'>
              <table className='table min-w-full'>
                <thead>
                  <tr>
                    <th scope='col'>From</th>
                    <th scope='col'>Date</th>
                    <th scope='col'>To</th>
                  </tr>
                </thead>
                <tbody className='bg-transparent rounded-b-lg divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700'>
                  {messages &&
                    messages.map((item: any, index) => (
                      <tr key={index} className='bg-white hover:bg-wt-primary-85'>
                        <td className='px-4 py-2 text-sm font-semibold text-wt-primary-40 whitespace-nowrap'>
                          {item.from}
                        </td>
                        <td className='px-4 py-2 text-sm font-semibold text-wt-primary-40 whitespace-nowrap'>
                          {item.date}
                        </td>
                        <td className='px-4 py-2 text-sm font-semibold text-wt-primary-40 whitespace-nowrap'>
                          {item.to}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <div className='w-full flex bg-white rounded-b-lg p-4 border-t border-gray-200'></div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default MessagesSentWidget
