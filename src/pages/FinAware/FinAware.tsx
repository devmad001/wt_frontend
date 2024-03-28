import './style.css'

import { useEffect, useState, useContext } from 'react'
import { expiryIsComming, getFinAwareSessionId, getUserInfo } from 'utils'
import { useAuth } from 'hooks'
import { Layout1, Layout2 } from './elements'
import SlidingPane from 'react-sliding-pane'
import { SocketIOFinAwareContext } from 'providers'
import clsx from 'clsx'
import loadingGif from 'assets/media/image/loading.gif'
import { useSearchParams } from 'react-router-dom'

function FinAware() {
  const useAuthApi = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const { socketData, connectFinAwareSocket, disconnectFinAwareSocket } = useContext(SocketIOFinAwareContext)
  const [layoutSetting, setLayoutSetting] = useState({ layout_type: 'view_standard_1' })
  const [componentSetting, setComponentSetting] = useState(null)
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [caseId, setCaseId] = useState<string | null>(null)
  const [state, setState] = useState<any>({
    isPaneOpen: false,
    isPaneOpenLeft: false
  })

  const userInfo = getUserInfo()?._id || ''
  const finAwareSesstionId = getFinAwareSessionId()

  useEffect(() => {
    if (!searchParams?.get('case_id')) setCaseId(null)
    setCaseId(searchParams?.get('case_id'))
  }, [searchParams])

  useEffect(() => {
    if (!finAwareSesstionId || !caseId) return
    connectFinAwareSocket(caseId, finAwareSesstionId)
    return () => {
      disconnectFinAwareSocket()
    }
  }, [finAwareSesstionId, caseId])

  useEffect(() => {
    if (!socketData && socketData?.action !== 'init_data') return
    setLayoutSetting(socketData?.data?.dsettings)
    setComponentSetting(socketData?.data?.components)
  }, [socketData])

  const handleDataInit = async ({ data }: any) => {
    //
  }

  const checkFinAwareSession = () => {
    const findAwareSesstionId = getFinAwareSessionId()
    if (expiryIsComming(findAwareSesstionId)) {
      useAuthApi.reRegisterFindawareSessionId()
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

  const handleIframeLoad = () => {
    setIframeLoaded(true)
  }

  return (
    <>
      <div className='px-4 mb-4 flex flex-col dashboard overflow-hidden' id='dashboard-page'>
        <div className='pb-4' id='dashboard-header'>
          <div className='flex flex-wrap items-stretch justify-between bg-orange-50 text-sm font-semibold pl-4 rounded-md'>
            <div className='flex items-center'>
              <span className='text-orange-100 mr-1.5'>Case:</span>
              <span className='text-orange-200 mr-1.5'>12_EU_Competition_Investigation</span>
            </div>
            <div className='flex items-center ml-auto'>
              <span className='text-orange-100 mr-1.5'>Status:</span>
              <div className='text-white bg-orange-200 px-4 h-full py-2.5 rounded-r-md flex items-center'>
                <span className='bg-white w-1.5 h-1.5 mr-1.5 rounded-full'></span>
                <span>Ready</span>
              </div>
            </div>
          </div>
        </div>

        {layoutSetting?.layout_type === 'view_standard_1' && <Layout1 setting={componentSetting} />}
        {layoutSetting?.layout_type === 'view_standard_2' && <Layout2 setting={componentSetting} />}

        {/* <div className='left-0 lg:left-72 bottom-0 fixed cursor-pointer'>
          <IconSvg icon='botIcon' />
        </div> */}

        <div className='fixed right-0 top-[50%]' onClick={() => setState({ isPaneOpen: true })}>
          <button className='btn btn-primary flex flex-col items-center py-12 px-3 rounded-l-lg'>
            <span>F</span>
            <span>A</span>
            <span>Q</span>
          </button>
        </div>
        <SlidingPane
          className='faq-customize relative'
          overlayClassName='z-50'
          isOpen={state.isPaneOpen}
          width='40%'
          title='FAQ'
          subtitle=''
          onRequestClose={() => {
            setState({ isPaneOpen: false })
            setTimeout(() => {
              setIframeLoaded(false)
            }, 500)
          }}
        >
          <iframe
            src={`https://bank-webapp-front-end-service.azurewebsites.net/faq?user_id=${userInfo}&fin_session_id=${finAwareSesstionId}`}
            width='100%'
            height='100%'
            onLoad={handleIframeLoad}
            className={clsx({
              invisible: !iframeLoaded,
              visible: !!iframeLoaded
            })}
          />
          {!iframeLoaded && (
            <div className='absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center'>
              <img src={loadingGif} className='w-12 h-12' />
            </div>
          )}
        </SlidingPane>
      </div>
    </>
  )
}

export default FinAware
