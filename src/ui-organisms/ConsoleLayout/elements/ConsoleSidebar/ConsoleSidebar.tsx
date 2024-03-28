import './style.css'
import goToDashboardIcon from 'assets/media/svg/go-to-dashboard-icon.svg'
import wtLogoWhite from 'assets/media/svg/wt-logo-white.svg'
import { NavLink } from 'react-router-dom'
import { IconSvg } from 'ui-atoms'
import { HiDocumentDownload } from 'react-icons/hi'
import { useContext, useEffect, useState } from 'react'
import { SuperAdminMenu, UserMenu } from './elements'
import { getUserScopeInfo } from 'utils'
import AuthHelper from 'constant/AuthHelper'
import { SocketIOFinAwareContext } from 'providers'

const SpawnDownload = () => {
  const { socketData } = useContext(SocketIOFinAwareContext)
  const [spawnURL, setSpawnURL] = useState('')

  useEffect(() => {
    if (!socketData || socketData?.update_type !== 'spawn_download') return
    setSpawnURL(socketData?.url)
  }, [socketData])

  const handleDownload = () => {
    window.location.href = spawnURL;
  }

  return (
    <>
      {!!spawnURL?.length && (
        <ul className='pb-2 space-y-2'>
          <li className='nav-item relative px-4 cursor-pointer'>
            <a className='nav-link' onClick={() => handleDownload()}>
              <div className={'nav-link-icon'}>
                <HiDocumentDownload className={'w-6 h-6'} />
              </div>
              Spawn Download
            </a>
          </li>
        </ul>
      )}
    </>
  )
}

function ConsoleSidebar(props: any) {
  const footerMenu = [
    {
      icon: 'chatMenu',
      title: 'Chat',
      path: '/message'
    },
    {
      icon: 'settingsMenu',
      title: 'Settings',
      path: '/settings'
    }
  ]
  const [role, setRole] = useState('')
  const [memberships, setMemberships] = useState<string[]>([])

  useEffect(() => {
    const userScope: Auth.ScopeInfo = getUserScopeInfo()
    setMemberships(userScope?.memberships || [])
    setRole(userScope?.role)
  }, [])

  const renderMenuByRole = () => {
    const adminRole = [AuthHelper.RoleType.ADMIN, AuthHelper.RoleType.SUPER_ADMIN, AuthHelper.RoleType.TECH_OWNER]
    if (adminRole.includes(role)) return <SuperAdminMenu />
  }

  const renderFinAwareLoad = () => {
    if (memberships.includes(AuthHelper.MembershipType.FINAWARE) || role === AuthHelper.RoleType.TECH_OWNER) {
      return <SpawnDownload />
    }
  }

  const renderTechOwnerMenu = () => {
    if (role === AuthHelper.RoleType.TECH_OWNER)
      return (
        <div className='w-full px-3 py-3 bg-wt-primary-59 text-wt-primary-5 rounded-md mb-3'>
          <NavLink to={`/dashboard`} className='flex items-center'>
            <div className='rounded-l-md'>
              <img src={goToDashboardIcon} width={24} height={24} />
            </div>
            <div className='flex-1 flex flex-col px-2'>
              <span className='gradient-orange-text text-md font-semibold text-left'>Go to Dashboard</span>
            </div>
            <div className='cursor-pointer'>
              <IconSvg icon='openLinkIcon' />
            </div>
          </NavLink>
        </div>
      )
    else return ''
  }

  return (
    <aside
      id='sidebar'
      className='sidebar fixed top-0 left-0 z-30 md:pt-0 flex-col flex-shrink-0 w-72 h-full font-normal duration-75 lg:flex transition-width hidden bg-wt-primary-65 overflow-auto'
      aria-label='Sidebar'
    >
      <div className='relative flex flex-col flex-1 min-h-0 pt-0 bg-wt-primary-65 dark:bg-gray-800 dark:border-gray-700'>
        <div className='flex py-4 px-4 pb-8'>
          <div className='flex'>
            {/* <img src={logoHoriWhite} className='h-8 mr-3' alt='WatchTower Logo' /> */}
            <img src={wtLogoWhite} className='mr-3 h-12' />
          </div>
          {/* <button aria-expanded='true' aria-controls='sidebar' className='ml-auto text-gray-600'>
            <svg className='w-6 h-6' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path d='M3 7H21' stroke='white' strokeWidth='1.5' strokeLinecap='round' />
              <path d='M3 12H21H3Z' fill='white' />
              <path d='M3 12H21' stroke='white' strokeWidth='1.5' strokeLinecap='round' />
              <path d='M3 17H21' stroke='white' strokeWidth='1.5' strokeLinecap='round' />
            </svg>
          </button> */}
        </div>
        <div className='flex flex-col flex-1 pt-5 pb-4 overflow-y-auto'>
          <div className='flex-1 flex space-y-1 bg-wt-primary-65 divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700'>
            <div className='w-full'>
              <UserMenu />
            </div>
          </div>
        </div>
        <div className='flex flex-col mt-auto'>
          <div className='flex flex-col flex-1 pt-5 pb-3 overflow-y-auto'>
            <div className='flex-1 flex space-y-1 bg-wt-primary-65 divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700'>
              <div className='w-full'>
                {renderFinAwareLoad()}
                {renderMenuByRole()}
                <ul className='pb-2 space-y-2'>
                  {footerMenu.map((item) => {
                    return (
                      <li key={item.path} className='nav-item relative px-4'>
                        <NavLink
                          to={item.path}
                          className={({ isActive }) =>
                            ['nav-link group ', isActive ? 'active' : null].filter(Boolean).join(' ')
                          }
                        >
                          <div className={'nav-link-icon'}>
                            <IconSvg icon={item.icon} className={'w-6 h-6'} />
                          </div>
                          <span className='nav-label'>{item.title}</span>
                        </NavLink>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          </div>
          <div className='flex flex-col px-4 mt-3 mb-3'>{renderTechOwnerMenu()}</div>
        </div>
      </div>
    </aside>
  )
}

export default ConsoleSidebar
