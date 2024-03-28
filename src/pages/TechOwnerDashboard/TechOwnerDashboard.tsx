import { useEffect, useState } from 'react'
import { IconSvg } from 'ui-atoms'
import {
  ActiveUserWidget,
  AllUserOnline,
  AskedQuestionsWidget,
  FilesUploadWidget,
  MessagesSentWidget,
  PageViewsWidget
} from './elements'
import AuthHelper from 'constant/AuthHelper'
import { getUserScopeInfo } from 'utils'

function TechOwnerDashboard() {
  const [role, setRole] = useState<any>('')

  useEffect(() => {
    const userScope: Auth.ScopeInfo = getUserScopeInfo()

    setRole(userScope?.role || '')
  }, [])

  const renderRoleName = (role: string) => {
    if (role === AuthHelper.RoleType.TECH_OWNER) return 'Tech Owner'
    if (role === AuthHelper.RoleType.SUPER_ADMIN) return 'Super Admin'
    if (role === AuthHelper.RoleType.ADMIN) return 'Admin'
    if (role === AuthHelper.RoleType.USER) return 'User'
  }

  return (
    <>
      <div className='p-4 pt-0 px-6 block sm:flex items-center justify-between lg:mt-1.5 dark:bg-gray-800'>
        <div className='p-4 flex flex-col md:flex-row w-full items-center bg-white rounded-lg dark:bg-gray-700'>
          <div className='flex-1 w-full'>
            <h1 className='text-xl font-bold text-wt-primary-120 sm:text-2xl dark:text-white mb-2'>Dashboard</h1>
            <nav className='flex' aria-label='Breadcrumb'>
              <ol className='inline-flex items-center space-x-1 text-sm font-medium md:space-x-2'>
                <li className='inline-flex items-center'>
                  <a
                    href='#'
                    className='inline-flex items-center font-semibold text-wt-primary-40 hover:text-primary-600 dark:text-gray-300 dark:hover:text-white'
                  >
                    <span className='mr-1'>
                      <IconSvg icon='homeIcon' />
                    </span>
                    Home
                  </a>
                </li>
                <li>
                  <div className='flex items-center'>
                    <span className='text-wt-primary-120 dark:text-gray-300'>/</span>
                    <a href='#' className='ml-1 font-semibold text-wt-primary-120 md:ml-2 dark:text-gray-300'>
                      Dashboard
                    </a>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
          <div className='mb-1 w-full sm:w-auto'>
            <div className='items-center justify-end block sm:flex md:divide-x md:divide-gray-100 dark:divide-gray-700'>
              <div className='flex items-center'>
                <div className='flex flex-col px-4'>
                  <label className='text-sm font-bold text-wt-primary-40'>Your role is:</label>
                  <h2 className='text-2xl font-bold text-wt-primary-40'>{renderRoleName(role)}</h2>
                </div>
                {/* <div className='border-space h-10'></div>
                <div className='flex flex-col px-4'>
                  <label className='text-sm font-bold text-wt-primary-40'>Info header 1:</label>
                  <h2 className='text-2xl font-bold text-wt-primary-40'>Info line 1</h2>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='px-6 flex flex-col dark:bg-gray-800'>
        <div className='inline-block min-w-full'>
          <div className='grid grid-cols-1 lg:grid-cols-12 lg:gap-4 mb-4'>
            <div className='col-span-4 min-h-[350px] w-full '>
              <ActiveUserWidget />
            </div>
            <div className='col-span-8 min-h-[350px] w-full'>
              <PageViewsWidget />
            </div>
          </div>
          <div className='grid grid-cols-1 lg:grid-cols-12 lg:gap-4 mb-4'>
            <div className='col-span-4 min-h-[350px] w-full '>
              <MessagesSentWidget />
            </div>
            <div className='col-span-4 min-h-[350px] w-full'>
              <FilesUploadWidget />
            </div>
            <div className='col-span-4 min-h-[350px] w-full'>
              <AskedQuestionsWidget />
            </div>
          </div>
          <div className='grid grid-cols-1 lg:grid-cols-12 lg:gap-4'>
            <div className='col-span-12 min-h-[350px] w-full'>
              <AllUserOnline />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default TechOwnerDashboard
