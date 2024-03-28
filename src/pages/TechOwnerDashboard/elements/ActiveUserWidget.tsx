import './style.css'

import { useAdmin } from 'hooks'
import { useEffect, useState } from 'react'
import { Spinner } from 'ui-atoms'

function ActiveUserWidget() {
  const colorsGallery = [
    'bg-gradient-to-r from-red-500 to-red-400',
    'bg-gradient-to-r from-orange-400 to-orange-100',
    'bg-gradient-to-r from-blue-500 to-blue-200',
    'bg-gradient-to-r from-indigo-800 to-indigo-600'
  ]
  const adminAPI = useAdmin()
  const [isLoading, setIsLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [categories, setCategories] = useState<any[]>([])
  const [totalCategories, setTolalCategories] = useState(0)

  useEffect(() => {
    getActiveUsers()
    return () => {
      //
    }
  }, [])

  const getActiveUsers = () => {
    setIsLoading(true)
    adminAPI.activeUsers({
      callback: {
        onSuccess: (res) => {
          setTotal(res?.activeUsers || 0)
          let sum = 0
          res?.items?.forEach((item: any) => {
            sum = sum + item.value
          })
          setTolalCategories(sum)
          setCategories(
            res?.items?.map((item: any) => {
              return {
                ...item,
                percent: ((item.value / sum) * 100).toFixed(0) || 0
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

  const renderCategoryDesc = (index: number, data: any) => {
    const className = ['w-3 h-3 rounded-sm mr-2', colorsGallery[index] || ''].filter(Boolean).join(' ')
    return (
      <div key={index} className='flex items-center px-2'>
        <div className={className}></div>
        <label className='font-bold text-wt-primary-40'>{data?.name}</label>
      </div>
    )
  }

  const renderCategoryBar = (index: number, data: any) => {
    const className = ['item h-full text-white text-center font-semibold', colorsGallery[index] || '']
      .filter(Boolean)
      .join(' ')
    return (
      <div
        key={index}
        className={className}
        style={{
          width: data?.percent + '%'
        }}
      >
        {data?.percent}%
      </div>
    )
  }

  return (
    <>
      <div className='w-full rounded-lg bg-gray-50'>
        {isLoading ? (
          <div className='flex items-center justify-center w-full h-full'>
            <Spinner />
          </div>
        ) : (
          <>
            <div className='flex flex-col items-center justify-center px-4 py-8 bg-white border-b border-gray-200 rounded-t-lg'>
              <label className='text-lg font-bold text-wt-primary-40'>Right now</label>
              <h1 className='text-6xl font-bold text-wt-primary-40'>{total}</h1>
              <span className='text-base text-wt-primary-40'>active users on site</span>
            </div>
            <div className='flex flex-col p-4 py-12'>
              <div className='flex justify-center'>
                {categories &&
                  categories.map((item: any, index: number) => {
                    return renderCategoryDesc(index, item)
                  })}
              </div>
              <div className='flex justify-center mt-6'>
                <div className='min-w-[90%] h-6 flex rounded-md activeusers-bar'>
                  {categories &&
                    categories.map((item: any, index: number) => {
                      return renderCategoryBar(index, item)
                    })}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default ActiveUserWidget
