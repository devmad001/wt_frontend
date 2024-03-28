import { createRef, forwardRef, useContext, useEffect, useRef, useState } from 'react'
import { useLocation, useParams, useSearchParams } from 'react-router-dom'
import { chunkArray, getFinAwareSessionId, getUserInfo } from 'utils'
import { useFinAwareAPI } from 'api'
import { Button, IconSvg, Spinner } from 'ui-atoms'
import { generatePDF } from 'utils'
import { PDFOptions } from 'constant'
import { SocketIOFinAwareContext } from 'providers'

const Square = forwardRef(({}, ref: any) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { socketData } = useContext(SocketIOFinAwareContext)
  const finAwareAPI = useFinAwareAPI()
  const [columns, setColumns] = useState<any>([])
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [caseId, setCaseId] = useState<string | null>(null)
  const userInfo = getUserInfo() || ''
  const finAwareSesstionId = getFinAwareSessionId()
  const dynamicRefs = useRef<any>([])
  const [chunkData, setChunkData] = useState<any>([])
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const userinfo = getUserInfo()

  useEffect(() => {
    if (!searchParams?.get('case_id')) setCaseId(null)
    setCaseId(searchParams?.get('case_id'))
  }, [searchParams])

  useEffect(() => {
    if (!userInfo?._id || !finAwareSesstionId || !caseId || !socketData || socketData?.action !== 'init_data') return
    setLoading(true)
    finAwareAPI
      .getSquareAPI({ user_id: userInfo?._id, fin_session_id: finAwareSesstionId, caseId: caseId })
      .then((res: any) => {
        if (!res || !res?.data?.data) {
          setColumns([])
          setData([])
          return
        }
        setColumns(Object.keys(res?.data?.data?.[0])?.sort())
        setData(res?.data?.data)
      })
      .finally(() => setLoading(false))
  }, [userInfo?._id, finAwareSesstionId, caseId, socketData])

  useEffect(() => {
    if (!data?.length) setFilteredData([])
    if (!!searchValue?.length) {
      const newData = [...data].filter((item: any) => {
        let flag = false
        columns.forEach((column: string) => {
          if (item?.[column]?.toString().toLowerCase()?.includes(searchValue.toLowerCase())) flag = true
        })
        return flag
      })
      setFilteredData([...newData])
    } else {
      setFilteredData([...data])
    }
  }, [data, searchValue])

  useEffect(() => {
    if (!dynamicRefs?.current?.length) return
    setIsLoading(true)
    let promises: any = []
    dynamicRefs?.current?.forEach((target: any, idx: number) => {
      promises.push(generatePDF(target, { ...PDFOptions, filename: `square-${idx + 1}` }, userinfo?.agency?.name || ''))
    })
    Promise.all(promises)
      .then((res) => {
        // console.log('res', res);
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [dynamicRefs?.current?.[0]])

  const handleDownload = () => {
    if (isLoading) return
    setIsLoading(true)
    const data = chunkArray([...filteredData], 50)
    setChunkData(data)
    dynamicRefs.current = Array(data?.length)
      .fill(null)
      .map((_, index) => createRef())
  }

  return (
    <div className='flex flex-col h-full'>
      {loading ? (
        <div className='absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center'>
          <Spinner />
        </div>
      ) : (
        <>
          <div className='w-full flex flex-row justify-start mb-4'>
            <div className='relative max-w-[300px] mt-3 ml-3'>
              <input
                type='text'
                name='search'
                id='header-search'
                className='bg-wt-primary-110 border border-wt-primary-125 text-wt-primary-120 text-sm font-normal rounded-3xl focus:ring-primary-500 focus:border-primary-500 block w-full pr-10 p-2 pl-3.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-wt-primary-40 dark:text-gray-200 dark:focus:ring-primary-500 dark:focus:border-primary-500 min-w-[300px]'
                placeholder='Search by name...'
                value={searchValue}
                onChange={(e: any) => setSearchValue(e.target?.value)}
              />
              <div className='absolute inset-y-0  right-0 flex items-center pr-3 cursor-pointer'>
                <IconSvg icon='searchIcon' />
              </div>
            </div>
            <Button
              className='absolute top-3 right-7 btn bg-wt-orange-1 px-3 py-2 text-white rounded-lg flex items-center'
              disabled={isLoading}
              onClick={() => handleDownload()}
            >
              Download
            </Button>
          </div>
          {!!filteredData?.length && (
            <div className='flex h-full overflow-auto'>
              <table className='table min-w-full h-fit'>
                <thead>
                  <tr>
                    {columns.map((column: string, idx: number) => (
                      <th scope='col' key={idx} className='text-sm'>
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200 dark:bg-gray-700 dark:divide-gray-700'>
                  {!!filteredData?.length &&
                    filteredData?.map((item, index) => (
                      <tr key={index} className='bg-white hover:bg-wt-primary-85'>
                        {columns.map((column: string, idx: number) => {
                          return (
                            <td className='px-4 py-2 text-sm text-gray-900 ' key={idx} title={item?.[column] || ''}>
                              <p className='line-clamp-2'>
                                {typeof item?.[column] === 'string' || typeof item?.[column] === 'number'
                                  ? item?.[column] || ''
                                  : ''}
                              </p>
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {!!dynamicRefs.current?.length && (
        <div className='w-0 h-0'>
          {chunkData?.map((arr: any, idx: number) => (
            <table className='table min-w-full' key={idx} ref={dynamicRefs.current?.[idx]}>
              <thead>
                <tr>
                  {columns.map((column: string, idx: number) => (
                    <th scope='col' key={idx} className='text-sm'>
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200 dark:bg-gray-700 dark:divide-gray-700'>
                {!!arr?.length &&
                  arr?.map((item: any, index: number) => (
                    <tr key={index} className='bg-white hover:bg-wt-primary-85'>
                      {columns.map((column: string, idx: number) => (
                        <td className='px-4 py-2 text-sm text-gray-900' key={idx}>
                          {item?.[column] || ''}
                        </td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            </table>
          ))}
        </div>
      )}
    </div>
  )
})

export default Square
