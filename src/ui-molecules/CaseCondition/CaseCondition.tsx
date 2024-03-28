import { useFinAwareAPI } from 'api'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const CaseCondition = () => {
  const [searchParams] = useSearchParams()
  const finAwareAPI = useFinAwareAPI()
  const [statusInfo, setStatusInfo] = useState<any>(null)

  useEffect(() => {
    if (!searchParams?.get('case_id')?.length) return
    finAwareAPI?.getCaseProcessingStatus(searchParams?.get('case_id') || '').then((res) => {
      if (res?.data?.data) {
        setStatusInfo(res?.data?.data)
      }
    })
  }, [searchParams])

  return (
    <>
      {statusInfo && !statusInfo?.last_state?.toLowerCase()?.includes("ready") && (
        <div className='flex flex-wrap items-stretch justify-between bg-orange-50 text-sm font-semibold pl-4 rounded-md'>
          <div className='flex items-center'>
            <span className='text-orange-100 mr-1.5'>Status</span>
          </div>
          <div className='flex items-center ml-auto'>
            <span className='text-orange-100 mr-1.5'></span>
            <div className='text-white bg-orange-200 px-4 h-full py-2 rounded-r-md flex items-center'>
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
