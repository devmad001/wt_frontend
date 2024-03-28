import './style.css'
import { useEffect, useState, useContext } from 'react'
import { getFinAwareSessionId, getUserInfo } from 'utils'
import { Layout1, Layout2 } from './elements'
import SlidingPane from 'react-sliding-pane'
import { SocketIOFinAwareContext } from 'providers'
import clsx from 'clsx'
import loadingGif from 'assets/media/image/loading.gif'
import { useSearchParams } from 'react-router-dom'
import { CaseCondition } from 'ui-molecules'

function CaseDashboard() {
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
    if (!finAwareSesstionId || !caseId) return;
    connectFinAwareSocket(caseId, finAwareSesstionId)
    return () => {
      disconnectFinAwareSocket()
    }
  }, [finAwareSesstionId, caseId])

  useEffect(() => {
    if (!socketData || socketData?.action !== 'init_data') return
    setLayoutSetting(socketData?.data?.dsettings)
    setComponentSetting(socketData?.data?.components)
  }, [socketData])

  const handleIframeLoad = () => {
    setIframeLoaded(true)
  }

  return (
    <>
      <div className='px-4 flex flex-col dashboard overflow-hidden' id='dashboard-page'>
        <div className='mb-4' id='dashboard-header'>
          <CaseCondition />
        </div>

        {!!caseId ? (
          <>
            {layoutSetting?.layout_type === 'view_standard_1' && <Layout1 setting={componentSetting} />}
            {layoutSetting?.layout_type === 'view_standard_2' && <Layout2 setting={componentSetting} />}
          </>
        ) : (
          <div className='w-full h-[calc(100vh-80px)] flex flex-row justify-center items-center'>
            <p className='text-gray-350'>There is not selected case. Please choose the case in header</p>
          </div>
        )}

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

export default CaseDashboard
