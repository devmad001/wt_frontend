import { IconSvg, Spinner } from 'ui-atoms'
import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { getFinAwareSessionId, getUserInfo } from 'utils'

interface ILayout1 {
  setting: any
}

const Layout1: React.FC<ILayout1> = ({ setting }) => {
  const [topContent, setTopContent] = useState<any>(null)
  const [bottomLeftContent, setBottomLeftContent] = useState<any>(null)
  const [bottomRightContent, setButtomRightContent] = useState<any>(null)

  const [topIframeLoaded, setTopIframeLoaded] = useState(false)
  const [bottomLeftIframeLoaded, setBottomLeftIframeLoaded] = useState(false)
  const [bottomRightIframeLoaded, setBottomRightIframeLoaded] = useState(false)

  const userInfo = getUserInfo()?._id || ''
  const finAwareSesstionId = getFinAwareSessionId()

  useEffect(() => {
    setHeightDashBoard()
    setHeightGrid()
  }, [])

  useEffect(() => {
    if (!setting) return
    const top = setting?.find((item: any) => item.position === 'top_full')
    const bottomLeft = setting?.find((item: any) => item.position === 'bottom_left')
    const bottomRight = setting?.find((item: any) => item.position === 'bottom_right')
    setTopContent(top)
    setBottomLeftContent(bottomLeft)
    setButtomRightContent(bottomRight)
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
      const row_widget: any = document.getElementsByClassName('row-widget')
      main_detail.style.height = `${dashboard_page.offsetHeight - dashboard_header.offsetHeight}px`
      for (let i = 0; i < row_widget?.length; i++) {
        if (window.innerWidth > 640) {
          row_widget[i].style.height = `${(dashboard_page.offsetHeight - dashboard_header.offsetHeight) / 2}px`
        } else {
          row_widget[i].style.height = `${dashboard_page.offsetHeight - dashboard_header.offsetHeight}px`
        }
      }
    }
  }

  return (
    <>
      <div className='flex flex-col' id='main-detail'>
        <div
          className='row-widget bg-white rounded-md col-span-1 xl:col-span-2 flex flex-col space-y-4 mb-4 relative'
          id='case-chart'
        >
          {!!topContent?.src?.length && (
            <iframe
              src={`${topContent?.src}?user_id=${userInfo}&fin_session_id=${finAwareSesstionId}`}
              onLoad={() => setTopIframeLoaded(true)}
              className={clsx('w-full h-full', {
                invisible: !topIframeLoaded,
                visible: !!topIframeLoaded
              })}
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
              allowFullScreen
            />
          )}
          {topContent?.src && !topIframeLoaded && (
            <div className='absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center'>
              <Spinner />
            </div>
          )}
        </div>
        <div className='row-widget min-h-[350px] grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4'>
          <div className='row-widget col-span-1 w-full h-full min-h-[350px] bg-white rounded-md flex flex-col relative'>
            {!!bottomLeftContent?.src?.length && (
              <iframe
                onLoad={() => setBottomLeftIframeLoaded(true)}
                className={clsx('w-full h-full', {
                  invisible: !bottomLeftIframeLoaded,
                  visible: !!bottomLeftIframeLoaded
                })}
                src={`${bottomLeftContent?.src}?user_id=${userInfo}&fin_session_id=${finAwareSesstionId}`}
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                allowFullScreen
              />
            )}
            {bottomLeftContent?.src && !bottomLeftIframeLoaded && (
              <div className='absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center'>
                <Spinner />
              </div>
            )}
          </div>
          <div className='row-widget col-span-2 w-full h-full min-h-[350px] bg-white rounded-md flex flex-col relative'>
            {!!bottomRightContent?.src?.length && (
              <iframe
                onLoad={() => setBottomRightIframeLoaded(true)}
                className={clsx('w-full h-full', {
                  invisible: !bottomRightIframeLoaded,
                  visible: !!bottomRightIframeLoaded
                })}
                src={`${bottomRightContent?.src}?user_id=${userInfo}&fin_session_id=${finAwareSesstionId}`}
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                allowFullScreen
              />
            )}
            {bottomRightContent?.src && !bottomRightIframeLoaded && (
              <div className='absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center'>
                <Spinner />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Layout1
