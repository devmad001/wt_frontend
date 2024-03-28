import { IconSvg, Spinner } from 'ui-atoms'
import { useEffect, useRef, useState } from 'react'
import { getFinAwareSessionId, getUserInfo } from 'utils'
import clsx from 'clsx'
import LLMBox from './LLMBox'
import Square from './Square'

interface ILayout2 {
  setting: any
}

const Layout2: React.FC<ILayout2> = ({ setting }) => {
  const leftTopRef = useRef<any>(null)
  const leftBottomRef = useRef<any>(null)
  const totalRightRef = useRef<any>(null)

  const [leftTopContent, setLeftTopContent] = useState<any>(null)
  const [leftBottomContent, setLeftBottomContent] = useState<any>(null)
  const [totalRightContent, setTotalRightContent] = useState<any>(null)

  const [leftTopIframeLoaded, setLeftTopIframeLoaded] = useState(false)
  const [leftBottomIframeLoaded, setLeftBottomeLoaded] = useState(false)
  const [bottomRightIframeLoaded, setBottomRightIframeLoaded] = useState(false)

  const userInfo = getUserInfo()
  const finAwareSesstionId = getFinAwareSessionId()

  useEffect(() => {
    setHeightDashBoard()
    setHeightGrid()
  }, [])

  useEffect(() => {
    if (!setting) return
    const top = setting?.find((item: any) => item.position === 'left_top')
    const bottomLeft = setting?.find((item: any) => item.position === 'left_bottom')
    const bottomRight = setting?.find((item: any) => item.position === 'total_right' || item.position === 'top_full')
    setLeftTopContent(top)
    setLeftBottomContent(bottomLeft)
    setTotalRightContent(null)
    setTimeout(() => {
      setTotalRightContent(bottomRight)
    }, 500)
  }, [setting])

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
      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 flex-1' id='main-detail'>
        <div className='flex flex-col col-span-1 space-y-4 sm:mr-2' id='case-chart'>
          <div className='bg-white w-full rounded-md h-[50%] flex flex-col space-y-2 relative' ref={leftTopRef}>
            {/* {!!leftTopContent?.src?.length && !!leftTopRef?.current && (
              <iframe
                onLoad={() => setLeftTopIframeLoaded(true)}
                className={clsx('w-full h-full', {
                  invisible: !leftTopIframeLoaded,
                  visible: !!leftTopIframeLoaded
                })}
                src={`${leftTopContent?.src}?user_id=${userInfo?._id}&fin_session_id=${finAwareSesstionId}&maxWidth=${leftTopRef?.current?.clientWidth}&maxHeight=${leftTopRef?.current?.clientHeight}`}
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                allowFullScreen
              />
            )}
            {!!leftTopContent?.src?.length && !leftTopIframeLoaded && (
              <div className='absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center'>
                <Spinner />
              </div>
            )} */}
            <LLMBox />
          </div>
          <div className='bg-white w-full rounded-md h-[50%] flex flex-col space-y-2 relative' ref={leftBottomRef}>
            <Square />
            {/* {!!leftBottomContent?.src?.length && !!leftBottomRef?.current && (
              <iframe
                onLoad={() => setLeftBottomeLoaded(true)}
                className={clsx('w-full h-full', {
                  invisible: !leftBottomIframeLoaded,
                  visible: !!leftBottomIframeLoaded
                })}
                src={`${leftBottomContent?.src}?user_id=${userInfo?._id}&fin_session_id=${finAwareSesstionId}&maxWidth=${leftBottomRef?.current?.clientWidth}&maxHeight=${leftBottomRef?.current?.clientHeight}`}
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                allowFullScreen
              />
            )}
            {!!leftBottomContent?.src?.length && !leftBottomIframeLoaded && (
              <div className='absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center'>
                <Spinner />
              </div>
            )} */}
          </div>
        </div>
        <div
          className='bg-white rounded-md col-span-1 xl:col-span-2 flex flex-col space-y-4 sm:ml-2 mt-4 sm:mt-0 relative'
          ref={totalRightRef}
        >
          {!!totalRightContent?.src?.length && !!totalRightRef?.current && (
            <iframe
              onLoad={() => setBottomRightIframeLoaded(true)}
              className={clsx('w-full h-full', {
                invisible: !bottomRightIframeLoaded,
                visible: !!bottomRightIframeLoaded
              })}
              src={`${totalRightContent?.src}?user_id=${userInfo?._id}&fin_session_id=${finAwareSesstionId}&maxWidth=${
                totalRightRef?.current?.clientWidth
              }&maxHeight=${totalRightRef?.current?.clientHeight}&agency_name=${userInfo?.agency?.name || ''}`}
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
              allowFullScreen
            />
          )}
          {!!totalRightContent?.src?.length && !bottomRightIframeLoaded && (
            <div className='absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center'>
              <Spinner />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Layout2
