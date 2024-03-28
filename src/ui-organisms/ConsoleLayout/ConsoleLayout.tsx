import { AuthContext } from 'providers'
import React, { useContext, useEffect, useState } from 'react'
import { Outlet } from 'react-router'
import { getUserInfo } from 'utils'
import { ConsoleHeader, ConsoleSidebar } from './elements'
import { ToastContainer } from 'react-toastify'
import { SocketIOContext } from 'providers/SocketIOProvider'

function ConsoleLayout(props: any) {
  const authContext = useContext(AuthContext)
  const { socket, connectSocket } = useContext(SocketIOContext)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)

  useEffect(() => {
    const user: any = getUserInfo()
    authContext.setUser(user)
    connectSocket()
    setMode()
    detectScale()
    return () => {
      //
    }
  }, [])

  const setMode = () => {
    const root = document.getElementsByTagName('html')[0]
    const mode = localStorage.getItem('mode')
    if (mode === 'dark') {
      root.setAttribute('class', 'dark')
      setIsDarkMode(true)
    } else if (mode === 'light') {
      root.setAttribute('class', '')
      setIsDarkMode(false)
    }
  }

  const detectScale = () => {
    const toggleSidebarMobile = document.getElementById('toggleSidebarMobile')
    const toggleSidebarMobileHamburger = document.getElementById('toggleSidebarMobileHamburger')
    const toggleSidebarMobileClose = document.getElementById('toggleSidebarMobileClose')
    const sidebarBackdrop = document.getElementById('sidebarBackdrop')
    const sidebar = document.getElementById('sidebar')

    window.onresize = function (event) {
      if (window.innerWidth < 992) {
        //
      } else if (window.innerWidth >= 1024) {
        sidebar?.classList.add('hidden')
        toggleSidebarMobileHamburger?.classList.remove('hidden')
        toggleSidebarMobileClose?.classList.add('hidden')
        sidebarBackdrop?.classList.add('hidden')
      }
    }
  }

  const listenerChangedModeEvent = (value: boolean) => {
    setIsDarkMode(value)
  }

  const hideSideBar = () => {
    const toggleSidebarMobile = document.getElementById('toggleSidebarMobile')
    const toggleSidebarMobileHamburger = document.getElementById('toggleSidebarMobileHamburger')
    const toggleSidebarMobileClose = document.getElementById('toggleSidebarMobileClose')
    const sidebarBackdrop = document.getElementById('sidebarBackdrop')
    const sidebar = document.getElementById('sidebar')

    sidebar?.classList.add('hidden')
    toggleSidebarMobileHamburger?.classList.remove('hidden')
    toggleSidebarMobileClose?.classList.add('hidden')
    sidebarBackdrop?.classList.add('hidden')
  }

  return (
    <>
      <ConsoleHeader onChangedMode={listenerChangedModeEvent} />
      <div className='flex pt-20 overflow-hidden dark:bg-gray-900'>
        <div
          className='fixed inset-0 z-30 hidden bg-gray-900/50 dark:bg-gray-900/90'
          id='sidebarBackdrop'
          onClick={hideSideBar}
        ></div>
        <ConsoleSidebar />
        <div
          id='main-content'
          className='relative w-full h-full min-h-[100vh] overflow-y-auto bg-gray-100 lg:ml-72 dark:bg-gray-900'
        >
          <main>
            <Outlet />
          </main>
        </div>
      </div>
      <ToastContainer />
    </>
  )
}

export default ConsoleLayout
