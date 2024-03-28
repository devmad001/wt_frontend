import { NavLink, useLocation, useSearchParams } from 'react-router-dom'

import '../../style.css'
import { IconSvg, NavLinkGroup } from 'ui-atoms'
import {
  WtDirectboxSend,
  WtFinAwareMenuIcon,
  WtMoneySend,
  WtTechOwnerDashboard,
  WtTrackerMenuIcon
} from 'ui-atoms/Icons'
import { useEffect, useRef, useState, useContext } from 'react'
import { getFinAwareSessionId, getUserInfo, getUserScopeInfo } from 'utils'
import AuthHelper from 'constant/AuthHelper'
import { HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi'
import { ShortcutModal } from 'ui-molecules'
import { useFinAwareAPI } from 'api'
import { ToastControl } from 'utils/toast'
import { GlobalContext } from 'providers'
import { SET_LOADING } from 'constant'

function UserMenu(props: any) {
  const finAwareSubMenus = [
    {
      icon: () => <WtMoneySend className={'w-6 h-6'} />,
      title: 'Case Dashboard',
      path: '/fin-aware/dashboard'
    },
    {
      icon: () => <WtDirectboxSend className={'w-6 h-6'} />,
      title: 'User Case Page',
      path: '/fin-aware/user-case'
    }
  ]
  const trackerSubMenus = [
    {
      icon: () => <IconSvg icon='subpoenaMenu' className={'w-6 h-6'} />,
      title: 'Subpoena',
      path: '/subpoena'
    }
  ]
  const { dispatch } = useContext(GlobalContext)
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [memberships, setMemberships] = useState<string[]>([])
  const [role, setRole] = useState<any>('')
  const shortcutModalRef = useRef<any>(null)
  const [shortcutList, setShortcutList] = useState<any>([])
  const finAwareAPI = useFinAwareAPI()
  const [caseId, setCaseId] = useState<string | null>(null)
  const finAwareSesstionId = getFinAwareSessionId()
  const userInfo = getUserInfo()

  useEffect(() => {
    if (!searchParams?.get('case_id')) setCaseId(null)
    setCaseId(searchParams?.get('case_id'))
  }, [searchParams])

  useEffect(() => {
    const userScope: Auth.ScopeInfo = getUserScopeInfo()

    setRole(userScope?.role || '')
    setMemberships(userScope?.memberships || [])
  }, [])

  useEffect(() => {
    if (!caseId || !location?.pathname.includes('fin-aware/dashboard')) return
    getShortcutList()
  }, [caseId, location])

  const getShortcutList = () => {
    let params = {
      user_id: userInfo?._id,
      fin_session_id: finAwareSesstionId
    }
    finAwareAPI.getButtons(caseId || '', params).then((res: any) => {
      if (res?.data?.data) setShortcutList(res?.data?.data)
      else setShortcutList([])
    })
  }

  const deleteShortcutList = (id: string | number) => {
    let params = {
      user_id: caseId
    }
    finAwareAPI.deleteButton(caseId || '', id, finAwareSesstionId, params).then((res) => {
      if (res?.data?.status === 'success') getShortcutList()
    })
  }

  const toggleShortcutModal = () => {
    shortcutModalRef?.current.showModal()
  }

  const handleShortcut = (item: any) => {
    try {
      dispatch({
        type: SET_LOADING,
        payload: {
          open: true,
          content: null
        }
      })
      const payload = {
        case_id: caseId,
        fin_session_id: finAwareSesstionId,
        button_label: item?.title,
        button_action: item?.action,
        button_id: item?.id
      }
      finAwareAPI
        .getButtonHandler(caseId || '', payload)
        .then((res: any) => {
          if (res?.data?.message?.length) {
            ToastControl.showSuccessMessage("Requested Processing")
          }
        })
        .finally(() => {
          dispatch({
            type: SET_LOADING,
            payload: {
              open: false,
              content: null
            }
          })
        })
    } catch (err) {
      dispatch({
        type: SET_LOADING,
        payload: {
          open: false,
          content: null
        }
      })
    }
  }

  const renderTechOwnerMenu = () => {
    if (role === AuthHelper.RoleType.TECH_OWNER)
      return (
        <li className='nav-item relative px-3'>
          <NavLink
            to={`/dashboard`}
            className={({ isActive }) => ['nav-link ', isActive ? 'active' : null].filter(Boolean).join(' ')}
          >
            <div className={'nav-link-icon'}>
              <WtTechOwnerDashboard />
            </div>
            <span className='nav-label'>Dashboard</span>
          </NavLink>
        </li>
      )
    else return ''
  }

  const renderFinAwareMenu = () => {
    if (memberships.includes(AuthHelper.MembershipType.FINAWARE) || role === AuthHelper.RoleType.TECH_OWNER)
      return (
        <li className='nav-item has-group relative px-4'>
          <NavLinkGroup className='nav-link group' icon={() => <WtFinAwareMenuIcon />} label={'FinAware'}>
            {finAwareSubMenus.map((item) => {
              return (
                <li key={item.path} className='nav-item relative px-3'>
                  <NavLink
                    to={`${item.path}?case_id=${caseId || ''}`}
                    className={({ isActive }) => ['nav-link ', isActive ? 'active' : null].filter(Boolean).join(' ')}
                  >
                    <div className={'nav-link-icon'}>{item.icon()}</div>
                    <span className='nav-label'>{item.title}</span>
                  </NavLink>
                </li>
              )
            })}

            {!!caseId && location?.pathname.includes('fin-aware/dashboard') && (
              <>
                <li className='nav-item relative px-3 cursor-pointer flex justify-center'>
                  <button
                    className='nav-link shortcut w-full flex justify-center !after:bg-transparent'
                    onClick={() => toggleShortcutModal()}
                  >
                    <HiOutlinePlus className='nav-link-icon mr-2' /> Add Shortcut
                  </button>
                </li>
                {shortcutList?.map((item: any, idx: number) => (
                  <li className='nav-item relative px-3 cursor-pointer flex justify-center' key={idx}>
                    <button
                      className='nav-link shortcut w-full flex justify-center !after:bg-transparent relative'
                      onClick={() => handleShortcut(item)}
                    >
                      <span>{item?.label || ''}</span>
                      <div
                        className='absolute top-0 right-0 bottom-0 flex justify-center items-center px-2'
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteShortcutList(item.id)
                        }}
                      >
                        <HiOutlineTrash className=' w-6 h-6' />
                      </div>
                    </button>
                  </li>
                ))}
              </>
            )}
          </NavLinkGroup>
        </li>
      )
    else return ''
  }

  const renderTrackerMenu = () => {
    if (memberships.includes(AuthHelper.MembershipType.TRACKER) || role === AuthHelper.RoleType.TECH_OWNER)
      return (
        <li className='nav-item has-group relative px-4'>
          <NavLinkGroup className='nav-link group' icon={() => <WtTrackerMenuIcon />} label={'Tracker'}>
            {trackerSubMenus.map((item) => {
              return (
                <li key={item.path} className='nav-item relative px-3'>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => ['nav-link ', isActive ? 'active' : null].filter(Boolean).join(' ')}
                  >
                    <div className={'nav-link-icon'}>{item.icon()}</div>
                    <span className='nav-label'>{item.title}</span>
                  </NavLink>
                </li>
              )
            })}
          </NavLinkGroup>
        </li>
      )
    else return ''
  }

  return (
    <>
      <ul className='pb-2 space-y-2'>
        {renderFinAwareMenu()}
        {renderTrackerMenu()}
      </ul>
      <ShortcutModal ref={shortcutModalRef} getShortcutList={getShortcutList} />
    </>
  )
}

export default UserMenu
