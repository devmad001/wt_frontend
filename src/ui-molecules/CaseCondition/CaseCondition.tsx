import { useFinAwareAPI } from 'api'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const CaseCondition = () => {
  const [searchParams] = useSearchParams()
  const finAwareAPI = useFinAwareAPI()
  const [statusInfo, setStatusInfo] = useState<any>(null)

  useEffect(() => {
    if (!searchParams?.get('case_id')?.length) {
      setStatusInfo(null)
      return
    }
    finAwareAPI?.getCaseProcessingStatus(searchParams?.get('case_id') || '').then((res) => {
      if (res?.data?.data) {
        setStatusInfo(res?.data?.data)
      }
    })
  }, [searchParams])

  return (
    <>
      {statusInfo && (
        <div
          className={clsx('flex flex-wrap items-stretch justify-between text-sm font-semibold pl-4 rounded-md', {
            '!bg-wt-green-2': statusInfo?.last_state?.toLowerCase()?.includes('done'),
            'bg-wt-red-2': statusInfo?.last_state?.toLowerCase()?.includes('error'),
            'bg-orange-50':
              !statusInfo?.last_state?.toLowerCase()?.includes('done') &&
              !statusInfo?.last_state?.toLowerCase()?.includes('error')
          })}
        >
          <div className='flex items-center'>
            <span
              className={clsx('text-orange-100 mr-1.5', {
                'text-wt-green-1': statusInfo?.last_state?.toLowerCase()?.includes('done'),
                'text-wt-red-1': statusInfo?.last_state?.toLowerCase()?.includes('error'),
                'text-orange-100':
                  !statusInfo?.last_state?.toLowerCase()?.includes('done') &&
                  !statusInfo?.last_state?.toLowerCase()?.includes('error')
              })}
            >
              Status
            </span>
          </div>
          <div className='flex items-center ml-auto'>
            <div
              className={clsx('text-white px-4 h-full py-2 rounded-r-md flex items-center', {
                'bg-wt-green-1': statusInfo?.last_state?.toLowerCase()?.includes('done'),
                'bg-wt-red-1': statusInfo?.last_state?.toLowerCase()?.includes('error'),
                'bg-orange-200':
                  !statusInfo?.last_state?.toLowerCase()?.includes('done') &&
                  !statusInfo?.last_state?.toLowerCase()?.includes('error')
              })}
            >
              <span className='bg-white w-1.5 h-1.5 mr-1.5 rounded-full'></span>
              <span>{statusInfo?.last_state || ''}</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default CaseCondition
