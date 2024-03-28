import { NavLink } from 'react-router-dom'

import '../../style.css'
import { IconSvg, NavLinkGroup } from 'ui-atoms'
import { WtDataCategory, WtUserManagement } from 'ui-atoms/Icons'

function SuperAdminMenu(props: any) {
  const mainMenu = [
    // {
    //   icon: () => <IconSvg icon={'subpoenaMenu'} className={'w-6 h-6'} />,
    //   title: 'Subpoena',
    //   path: '/subpoena'
    // },
    {
      icon: () => <WtUserManagement className={'w-6 h-6'} />,
      title: 'User Management',
      path: '/user-management'
    },
    {
      icon: () => <WtDataCategory className={'w-6 h-6'} />,
      title: 'Data Category',
      path: '/data-category'
    }
  ]

  return (
    <>
      <ul className='pb-2 space-y-2'>
        {mainMenu.map((item) => {
          return (
            <li key={item.path} className='nav-item relative px-4'>
              <NavLink
                to={item.path}
                className={({ isActive }) => ['nav-link', isActive ? 'active' : null].filter(Boolean).join(' ')}
              >
                <div className={'nav-link-icon'}>{item.icon()}</div>
                <span className='nav-label'>{item.title}</span>
              </NavLink>
            </li>
          )
        })}
      </ul>
    </>
  )
}

export default SuperAdminMenu
