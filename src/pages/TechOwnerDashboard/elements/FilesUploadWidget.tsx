import iconWidget from 'assets/media/png/document-upload.png'
import { useAdmin } from 'hooks'
import moment from 'moment'

import { useEffect, useRef, useState } from 'react'
import { Spinner } from 'ui-atoms'
import { WtFileOutline } from 'ui-atoms/Icons'
import { SubpoenaDetailModal } from 'ui-molecules'

function FilesUploadWidget() {
  const detailModalRef: any = useRef(null)
  const adminAPI = useAdmin()
  const [isLoading, setIsLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [files, setFiles] = useState<any[]>([])

  useEffect(() => {
    getFilesUploaded()
    return () => {
      //
    }
  }, [])

  const getFilesUploaded = () => {
    setIsLoading(true)
    adminAPI.filesUploaded({
      callback: {
        onSuccess: (res) => {
          setTotal(res?.total || 0)
          setFiles(
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

  const openDetailModal = (id: string) => {
    detailModalRef?.current.openPopup({ _id: id })
  }

  return (
    <>
      <div className='h-full w-full rounded-lg bg-gray-50'>
        <div className='flex items-center p-4 bg-white border-b border-gray-200 rounded-t-lg'>
          <img src={iconWidget} className='w-7 h-7 mr-3' />
          <label className='text-lg font-bold text-wt-primary-40'>Files uploaded</label>

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
                    <th scope='col'>File</th>
                  </tr>
                </thead>
                <tbody className='bg-transparent rounded-b-lg divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700'>
                  {files &&
                    files.map((item: any, index) => (
                      <tr key={index} className='bg-white hover:bg-wt-primary-85'>
                        <td className='px-4 py-2 text-sm font-semibold text-wt-primary-40 whitespace-nowrap'>
                          {item.from}
                        </td>
                        <td className='px-4 py-2 text-sm font-semibold text-wt-primary-40 whitespace-nowrap'>
                          {item.date}
                        </td>
                        <td className='px-4 py-2 text-sm font-semibold text-wt-primary-40 whitespace-nowrap'>
                          <a className='flex items-center text-blue-400 underline cursor-pointer'>
                            <WtFileOutline className='mr-2' />
                            {item.fileName}
                          </a>
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
      <SubpoenaDetailModal ref={detailModalRef} />
    </>
  )
}

export default FilesUploadWidget
