import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { WTUploadNewFile } from 'ui-atoms/Icons'
import { SubpoenaNewUploadModal, AlertModal } from 'ui-molecules'
import { getUserScopeInfo } from 'utils'
import { EventBus } from 'utils/event-bus'
import { GlobalEvents } from 'constant/GlobalEvent'
import AuthHelper from 'constant/AuthHelper'

const HeaderNewUpload = forwardRef((props: any, ref: any) => {
  const newUploadModalRef: any = useRef(null)
  const alertModalRef: any = useRef(null)
  const [memberships, setMemberships] = useState<string[]>([])
  const [role, setRole] = useState<any>('')

  useEffect(() => {
    const userScope: Auth.ScopeInfo = getUserScopeInfo()

    setRole(userScope?.role || '')
    setMemberships(userScope?.memberships || [])
  }, [])

  useImperativeHandle(ref, () => ({
    //
  }))

  const openNewUploadPopup = () => {
    newUploadModalRef?.current.openPopup()
  }

  const uploadedEventListener = (data: any) => {
    EventBus.dispatch(GlobalEvents.CREATED_NEW_UPLOAD, data)
  }

  return (
    <>
      {role !== AuthHelper.RoleType.TECH_OWNER ? (
        <>
          <button
            id='uploadFileHeader'
            className='btn bg-wt-orange-1 px-3 py-2.5 text-white rounded-lg flex items-center ml-auto'
            type='button'
            onClick={() => openNewUploadPopup()}
          >
            <WTUploadNewFile className='h-5 w-5' />
            <span className='ml-2'>New upload</span>
          </button>
          <SubpoenaNewUploadModal ref={newUploadModalRef} onSaved={uploadedEventListener} />
          <AlertModal ref={alertModalRef} />
        </>
      ) : (
        ''
      )}
    </>
  )
})

export default HeaderNewUpload
