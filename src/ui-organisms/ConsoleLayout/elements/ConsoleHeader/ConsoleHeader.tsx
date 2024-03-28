import { IconSvg, TextAvatar } from 'ui-atoms'
import { useAuth } from 'hooks'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from 'providers'
import { Dropdown, Toast } from 'flowbite-react'
import { getUserInfo, getUserScopeInfo, isAvailablePath } from 'utils'

import './style.css'
import { HeaderNewUpload, SearchCase } from 'ui-molecules'

function ConsoleHeader(props: any) {
  const auth = useAuth()
  const authContext = useContext(AuthContext)
  const [userInfo, setUserInfo] = useState<User.Details>()
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)
  const [role, setRole] = useState('')

  useEffect(() => {
    // did mount or update mount
    const userScope: Auth.ScopeInfo = getUserScopeInfo()

    setRole(userScope?.role)
    setMode()
    setUserInfo(getUserInfo())
    return () => {
      // unmount
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

  const switchDarkMode = () => {
    const root = document.getElementsByTagName('html')[0]
    if (root.classList.contains('dark')) {
      root.setAttribute('class', '')
      setIsDarkMode(false)
      localStorage.setItem('mode', 'light')
      props.onChangedMode && props.onChangedMode(false)
    } else {
      root.setAttribute('class', 'dark')
      setIsDarkMode(true)
      localStorage.setItem('mode', 'dark')
      props.onChangedMode && props.onChangedMode(true)
    }
  }

  const showSideBar = () => {
    const toggleSidebarMobile = document.getElementById('toggleSidebarMobile')
    const toggleSidebarMobileHamburger = document.getElementById('toggleSidebarMobileHamburger')
    const toggleSidebarMobileClose = document.getElementById('toggleSidebarMobileClose')
    const sidebarBackdrop = document.getElementById('sidebarBackdrop')
    const sidebar = document.getElementById('sidebar')

    sidebar?.classList.remove('hidden')
    toggleSidebarMobileHamburger?.classList.add('hidden')
    toggleSidebarMobileClose?.classList.remove('hidden')
    sidebarBackdrop?.classList.remove('hidden')
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

  const signOut = () => {
    auth.logout()
  }

  return (
    <>
      <nav id='tracker-tool-header' className='nav-header'>
        <div className='flex items-center justify-start w-full'>
          <button
            id='toggleSidebarMobile'
            aria-expanded='true'
            aria-controls='sidebar'
            className='p-2 text-gray-600 rounded cursor-pointer lg:hidden hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
          >
            <svg
              onClick={showSideBar}
              id='toggleSidebarMobileHamburger'
              className='w-6 h-6'
              fill='currentColor'
              viewBox='0 0 20 20'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                fillRule='evenodd'
                d='M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
                clipRule='evenodd'
              ></path>
            </svg>
            <svg
              id='toggleSidebarMobileClose'
              onClick={hideSideBar}
              className='hidden w-6 h-6'
              fill='currentColor'
              viewBox='0 0 20 20'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                fillRule='evenodd'
                d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                clipRule='evenodd'
              ></path>
            </svg>
          </button>
          {isAvailablePath('/fin-aware/user-case') || isAvailablePath('/fin-aware/dashboard') ? (
            <>
              <SearchCase />
              <HeaderNewUpload />
            </>
          ) : (
            <form action='#' method='GET' className='hidden lg:block lg:pl-3.5'>
              <label htmlFor='topbar-search' className='sr-only'>
                Search
              </label>
              <div className='flex items-center relative mt-1 lg:w-96'>
                <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                  <IconSvg icon='headerSearch' className='w-4 h-4' />
                </div>
                <input type='text' name='email' id='topbar-search' className='header-ip-search' placeholder='Search' />
              </div>
            </form>
          )}
        </div>
        <div className='flex items-center'>
          {/* <button
                id='theme-toggle'
                type='button'
                className='text-wt-yellow-1 rounded-full bg-wt-primary-65 dark:text-gray-400 hover:bg-wt-primary-60 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 text-sm p-2.5'
                onClick={switchDarkMode}
              >
                {!isDarkMode ? <IconSvg icon='darkMode' /> : <IconSvg icon='lightMode' />}
              </button> */}
          <div className='flex items-center ml-3'>
            <div>
              <Dropdown
                inline
                className='shadow border-none rounded-lg'
                renderTrigger={() => (
                  <div className='flex items-center p-2 rounded-full bg-white cursor-pointer dark:bg-wt-primary-65 dark:text-gray-400 dark:hover:bg-gray-700'>
                    <TextAvatar label={userInfo?.fullName} className='w-7 h-7 text-sm' />
                    <span className='ml-2 text-sm font-medium'>{userInfo?.email}</span>
                    <svg
                      className='ml-2 h-4 w-4'
                      width='20'
                      height='20'
                      viewBox='0 0 20 20'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M14.9333 6.81665H9.74167H5.06667C4.26667 6.81665 3.86667 7.78332 4.43334 8.34998L8.75 12.6666C9.44167 13.3583 10.5667 13.3583 11.2583 12.6666L12.9 11.025L15.575 8.34998C16.1333 7.78332 15.7333 6.81665 14.9333 6.81665Z'
                        fill='currentColor'
                      />
                    </svg>
                  </div>
                )}
                label={undefined}
              >
                <Dropdown.Header>
                  <p className='text-base font-semibold text-gray-900 dark:text-white' role='none'>
                    {userInfo?.fullName}
                  </p>
                  <p className='text-sm font-medium text-gray-900 truncate dark:text-gray-300' role='none'>
                    {userInfo?.email}
                  </p>
                </Dropdown.Header>
                <Dropdown.Item>Dashboard</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={signOut}>Sign out</Dropdown.Item>
              </Dropdown>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}

export default ConsoleHeader
