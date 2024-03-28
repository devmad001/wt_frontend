import { group } from 'console'
import React, { useState } from 'react'
import { forwardRef } from 'react'
import { WtMenuGroupChevronDown, WtMenuGroupChevronUp } from 'ui-atoms/Icons'

const NavLinkGroup = forwardRef((props: any, ref: any) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const subMeunClass = () => {
    const defaultStyle = 'py-2 rounded-md space-y-2 border-t border-wt-primary-65'
    return [defaultStyle, isExpanded ? 'opened' : 'hidden'].filter(Boolean).join(' ')
  }

  const renderIndicatorIcon = () => {
    return isExpanded ? <WtMenuGroupChevronUp /> : <WtMenuGroupChevronDown />
  }

  return (
    <>
      <a
        className={props?.className + ' bg-menu-group'}
        href='#'
        onClick={() => {
          setIsExpanded(!isExpanded)
        }}
      >
        <div className={'nav-link-icon'}>{props?.icon()}</div>
        <span className='nav-label'>{props?.label}</span>
        <span className='ml-auto'>{renderIndicatorIcon()}</span>
      </a>
      <ul className={subMeunClass() + ' bg-menu-group'}>{props?.children}</ul>
    </>
  )
})

export default NavLinkGroup
