import './style.css'
import { useEffect, useState } from 'react'
import { useAuth } from 'hooks'
import { Button, IconSvg } from 'ui-atoms'
import { WTPasswordTabIcon, WTPaymentTabIcon, WtNoteInfor, WtPasswordInvalid, WtPasswordValid, WtPromoCodeTabIcon, WtSubmitIcon } from 'ui-atoms/Icons'
import { valiator } from 'utils'
import RegexHelper from 'constant/RegexHelper'
import UIHelperClass from 'constant/UIHelper'
import { ToastControl } from 'utils/toast'
import AuthHelper from 'constant/AuthHelper'
import { ChangePassword, Payment, PromoCode } from './elements'

function Settings() {
  const useAuthApi = useAuth()
  const [userInfor, setUserInfo] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<number>(0)

  const renderRoleName = (role: string) => {
    if (role === AuthHelper.RoleType.TECH_OWNER) return 'Tech Owner'
    if (role === AuthHelper.RoleType.SUPER_ADMIN) return 'Super Admin'
    if (role === AuthHelper.RoleType.ADMIN) return 'Admin'
    if (role === AuthHelper.RoleType.USER) return 'User'
  }

  useEffect(() => {
    getProfile()
  }, [])

  const getProfile = () => {
    useAuthApi.getMyProfile({
      callback: {
        onSuccess: (res) => {
          setUserInfo(res)
        },
        onFailure: (err) => {
          ToastControl.showErrorMessage(err)
        }
      }
    })
  }

  const switchTab = (tabId: number): void => {
    setActiveTab(tabId)
  }

  return (
    <>
      <div className='p-4 pt-0 px-6 block sm:flex items-center justify-between lg:mt-1.5 dark:bg-gray-800'>
        <div className='p-4 flex flex-col md:flex-row w-full items-center bg-white rounded-lg dark:bg-gray-700'>
          <div className='flex-1 w-full'>
            <h1 className='text-xl font-bold text-gray-900 sm:text-2xl dark:text-white mb-2'>Settings</h1>
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
                    <span className='text-wt-primary-65 dark:text-gray-300'>/</span>
                    <a href='#' className='ml-1 font-semibold text-wt-primary-65 md:ml-2 dark:text-gray-300'>
                      Settings
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
                  <h2 className='text-2xl font-bold text-wt-primary-40'>{renderRoleName(userInfor?.role)}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='p-4 pt-0 px-6 block'>
        <div className='bg-white rounded-lg'>
          <div className='tabs bg-white rounded-lg'>
            <div className='tabs-nav'>
              <div
                className={['tabs-nav-item', activeTab == 0 ? 'active' : ''].filter(Boolean).join(' ')}
                onClick={() => {
                  switchTab(0)
                }}
              >
                <WTPasswordTabIcon className='icon mr-2' />
                <span className='font-bold'>Password</span>
              </div>
              <div
                className={['tabs-nav-item', activeTab == 1 ? 'active' : ''].filter(Boolean).join(' ')}
                onClick={() => {
                  switchTab(1)
                }}
              >
                <WTPaymentTabIcon className='icon mr-2' />
                <span className='font-bold'>Payment</span>
              </div>
              {userInfor?.role === AuthHelper.RoleType.TECH_OWNER && (
                <div
                  className={['tabs-nav-item', activeTab == 2 ? 'active' : ''].filter(Boolean).join(' ')}
                  onClick={() => {
                    switchTab(2)
                  }}
                >
                  <WtPromoCodeTabIcon className='icon mr-2' />
                  <span className='font-bold'>Promo code</span>
                </div>
              )}
              {activeTab == 2 && (
                <div className='flex items-center ml-auto'>
                  <WtNoteInfor className='mr-2' />
                  <span className='text-wt-primary-40 font-base'>
                    Tech owner can create promo code and set limit number what can add as free in one agency
                  </span>
                </div>
              )}
            </div>
            <div className='tabs-content'>
              {activeTab == 0 ? <ChangePassword /> : activeTab == 1 ? <Payment /> : activeTab == 2 ? <PromoCode /> : ''}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Settings
