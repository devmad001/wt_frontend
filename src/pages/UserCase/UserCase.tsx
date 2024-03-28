import { Button, IconSvg } from 'ui-atoms'
import { useState, useEffect } from 'react'
import { Accordion } from 'flowbite-react'
import folder from 'assets/media/image/folder.png'
import { CaseCondition, DashBoardCase } from 'ui-molecules'
import queryString from 'query-string'
import './style.css'
import { useLocation } from 'react-router'
import { useFinAwareAPI } from 'api'
import { getFinAwareSessionId, getUserInfo } from 'utils'
import CaseAnalysisBox from './CaseAnalysisBox'
import { useSubpoena } from 'hooks'
import { useSearchParams } from 'react-router-dom'

interface StatusProps {
  title: string
  state: string
  percent: string
  remaining_minutes: number
}

function UserCase() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [loadingPercent, setLoadingPercent] = useState<number>(50)
  const [searchParams, setSearchParams] = useSearchParams()
  const finAwareAPI = useFinAwareAPI()
  const [caseId, setCaseId] = useState<string | null>(null)
  const [analysisIds, setAnalysisIds] = useState([])
  const [statusList, setStatusList] = useState<StatusProps[]>([])
  const finAwareSesstionId = getFinAwareSessionId()
  const userInfo = getUserInfo()
  const [detailInfo, setDetailInfo] = useState<any>(null)

  useEffect(() => {
    if (!searchParams?.get('case_id')) setCaseId(null)
    setCaseId(searchParams?.get('case_id'))
  }, [searchParams])

  useEffect(() => {
    if (!!caseId) {
      finAwareAPI.getCaseDetails(caseId || '', finAwareSesstionId).then((res) => {
        if (!!res?.data?.data) {
          setDetailInfo(res?.data?.data)
        } else {
          setDetailInfo(null)
        }
      })
    } else {
      setDetailInfo(null)
    }

    finAwareAPI.getListUserStatus(userInfo?._id, finAwareSesstionId).then((res) => {
      if (res?.data?.cases?.length) setStatusList(res?.data?.cases)
      else setStatusList([])
    })
  }, [caseId])

  const handleAnalysis = () => {
    if (!!caseId) {
      finAwareAPI.startCaseProcessing(caseId || '', finAwareSesstionId).then((res) => {
        // if (!!res?.data?.message?.length) setStatus(res?.data?.message)
      })
    }

    finAwareAPI.getListUserFinshsedCases(userInfo?._id, finAwareSesstionId).then((res) => {
      setIsSubmitting(false)
      setLoadingPercent(100)
      if (res?.data?.case_ids?.length) setAnalysisIds(res?.data?.case_ids)
      else setAnalysisIds([])
    })
  }

  const render = () => {
    handleAnalysis()
    setIsSubmitting(true)
    setLoadingPercent(0)
  }

  useEffect(() => {
    setHeightCollapse()
    setHeightDashBoard()
    setHeightGrid()
  })

  const setHeightCollapse = () => {
    const dashboard_page: any = document.getElementById('dashboard-page')
    const dashboard_header: any = document.getElementById('dashboard-header')
    const detail_title: any = document.getElementById('detail-title')
    const detail_table: any = document.getElementById('detail-table')
    const analysis_button: any = document.getElementById('analysis-button')
    const collapse: any = document.getElementById('collapse')

    if (collapse && window.innerWidth > 640) {
      const height =
        dashboard_page.offsetHeight -
        (dashboard_header?.offsetHeight +
          detail_title?.offsetHeight +
          detail_table?.offsetHeight +
          analysis_button?.offsetHeight)

      collapse.style.height = `${height - 80}px`
      dashboard_page.style.overflowY = 'hidden'
    }
  }

  const setHeightDashBoard = () => {
    const dashboard_page: any = document.getElementById('dashboard-page')
    if (dashboard_page) {
      if (window.innerWidth > 640) {
        if (window.innerHeight > 800) {
          dashboard_page.style.height = 'calc(100vh - 80px)'
        } else {
          dashboard_page.style.height = '800px'
        }
      }
    }
  }

  const setHeightGrid = () => {
    if (window.innerWidth > 640) {
      const dashboard_page: any = document.getElementById('dashboard-page')
      const dashboard_header: any = document.getElementById('dashboard-header')
      const main_detail: any = document.getElementById('main-detail')
      const case_chart: any = document.getElementById('case-chart')
      main_detail.style.height = `${dashboard_page.offsetHeight - dashboard_header.offsetHeight}px`
      case_chart.style.height = `${dashboard_page.offsetHeight - dashboard_header.offsetHeight}px`
    }
  }

  return (
    <>
      <div className='px-4 flex flex-col dashboard overflow-hidden' id='dashboard-page'>
        <div className='mb-4' id='dashboard-header'>
          <CaseCondition />
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 flex-1' id='main-detail'>
          <div className='bg-white rounded-md col-span-1 xl:col-span-2 p-4 flex flex-col space-y-4 sm:mr-2'>
            <div className='flex items-center' id='detail-title'>
              <IconSvg icon='infoIcon' />
              <span className='text-gray-350 text-sm font-bold ml-2'>Case Details</span>
            </div>
            <div
              className='rounded-md relative border border-orange-150 p-4 bg-orange-80/10 bg-[url("assets/media/image/case-details-bg.png")] bg-right-bottom bg-no-repeat'
              id='detail-table'
            >
              <table className='w-full sm:w-3/4'>
                <thead>
                  <tr>
                    <th className='w-40 sm:w-1/3'></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr className='border-b border-orange-150'>
                    <td className='text-gray-350 font-bold text-xs pb-1.5'>Original Name:</td>
                    <td className='text-blue-1000 font-normal text-sm pb-1.5 lowercase'>
                      {detailInfo?.originalName || ''}
                    </td>
                  </tr>
                  <tr className='border-b border-orange-150'>
                    <td className='text-gray-350 font-bold text-xs py-1.5'>Threat Tagging:</td>
                    <td className='text-blue-1000 font-normal text-sm py-1.5 lowercase'>
                      {detailInfo?.threatTagging || ''}
                    </td>
                  </tr>
                  <tr className='border-b border-orange-150'>
                    <td className='text-gray-350 font-bold text-xs py-1.5'>Public Corroption Tag:</td>
                    <td className='text-blue-1000 font-normal text-sm py-1.5 lowercase'>
                      {detailInfo?.publicCorruptionTag || ''}
                    </td>
                  </tr>
                  <tr>
                    <td className='text-gray-350 font-bold text-xs pt-1.5'>Description:</td>
                    <td className='text-blue-1000 font-normal text-sm pt-1.5 lowercase'>
                      {detailInfo?.description || ''}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className='absolute top-1 right-3'>
                <a
                  className='w-full text-sm text-wt-primary-115 font-semibold underline underline-offset-2'
                  href={`/fin-aware/dashboard?case_id=${caseId || ''}`}
                >
                  Case Dashboard Link
                </a>
              </div>
            </div>
            <div className='pb-2.5 border-b border-wt-primary-125' id='analysis-button'>
              <Button
                className={`flex items-center justify-center rounded-md p-3 w-full text-white text-sm font-semibold ${
                  isSubmitting ? 'bg-wt-primary-75 opacity-100' : 'bg-wt-primary-115'
                }`}
                onClick={() => render()}
                disabled={isSubmitting}
              >
                <span className='flex items-center justify-center'>
                  <span className='inline mr-2'>
                    <IconSvg icon={isSubmitting ? 'cancelAnalysis' : 'documentFilter'} />
                  </span>
                  {isSubmitting ? 'Cancel Analysis' : 'Start Analysis'}
                </span>
              </Button>
            </div>

            {loadingPercent == 100 && (
              <div className='overflow-y-auto pb-2 !-mr-2.5 !p-1.5' id='collapse'>
                <p className='text-gray-350 font-bold ml-2 mb-4'>Case Analysis Details</p>
                {analysisIds.map((id, idx) => (
                  <CaseAnalysisBox key={idx} case_id={id} />
                ))}
              </div>
            )}
          </div>
          <div className='flex flex-col col-span-1 space-y-4 sm:ml-2 mt-4 sm:mt-0' id='case-chart'>
            <div className='bg-white w-full rounded-md h-full flex flex-col space-y-2'>
              <div className='flex flex-wrap items-center px-4 pt-4 mb-2.5'>
                <img src={folder} />
                <span className='text-wt-primary-40 text-sm font-bold ml-2 mr-auto'>Case Status</span>
                {/* <div className='border border-wt-primary-75 focus:ring-blue-500 focus:border-blue-500 px-2 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500 max-w-[200px] flex items-center rounded-lg'>
                  <span className='text-wt-primary-75 text-xs font-normal dark:text-white'>Sort by:</span>
                  <select
                    className='text-wt-primary-40 text-xs font-semibold dark:text-white flex-1 border-none max-w-85px focus:ring-0 focus:border-0'
                    value='1'
                    onChange={() => {}}
                  >
                    <option value='1'>None</option>
                  </select>
                </div> */}
              </div>
              <div className='flex flex-col space-y-2 px-4 pb-4 overflow-y-auto'>
                {!!statusList?.length && statusList.map((status: StatusProps, idx) => <DashBoardCase {...status} />)}
              </div>
            </div>
            {/* <div className='bg-white w-full rounded-md h-[50%] flex flex-col space-y-2'>
              <div className='flex flex-wrap items-center p-4'>
                <img src={message} />
                <span className='text-gray-350 text-sm font-bold ml-2 mr-auto'>Chat</span>
                <form>
                  <label className='sr-only text-gray-500'>Search</label>
                  <div className='relative'>
                    <input
                      type='text'
                      name='search'
                      id='header-search'
                      className='bg-wt-primary-110 border border-wt-primary-125 text-wt-primary-40 text-xs font-normal rounded-3xl focus:ring-primary-500 focus:border-primary-500 block w-full pr-10 p-2 pl-3.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-wt-primary-40 dark:text-gray-200 dark:focus:ring-primary-500 dark:focus:border-primary-500'
                      placeholder='Search by name...'
                    />
                    <div className='absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer'>
                      <IconSvg icon='searchIcon' />
                    </div>
                  </div>
                </form>
              </div>
              <div className='flex flex-col pb-4 overflow-y-auto'>
                <DashBoardChat children={<p className='text-wt-primary-120 text-xs font-normal'>Thank you</p>} />
                <DashBoardChat children={<p className='text-wt-primary-120 text-xs font-normal'>Thank you</p>} />
                <DashBoardChat children={<p className='text-wt-primary-120 text-xs font-normal'>Thank you</p>} />
                <DashBoardChat children={<p className='text-wt-primary-120 text-xs font-normal'>Thank you</p>} />
                <DashBoardChat children={<p className='text-wt-primary-120 text-xs font-normal'>Thank you</p>} />
                <DashBoardChat children={<p className='text-wt-primary-120 text-xs font-normal'>Thank you</p>} />
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </>
  )
}

export default UserCase
