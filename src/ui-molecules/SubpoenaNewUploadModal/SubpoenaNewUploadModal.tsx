import modalIcon from 'assets/media/png/new-upload-modal-icon.png'
import fileUploadIcon from 'assets/media/png/upload-drag-drop.png'

import Message from 'constant/Message'
import ThemeHelper from 'constant/ThemeHelper'
import UIHelperClass from 'constant/UIHelper'
import { Modal } from 'flowbite-react'
import { useSubpoena } from 'hooks'
import { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { Button, FileInput, FileInputDragDrop, IconSvg } from 'ui-atoms'
import { AlertModal } from 'ui-molecules'
import { getAccessToken, getUserInfo, getUserScopeInfo, valiator } from 'utils'
import { io } from 'socket.io-client'
import { GlobalContext, SocketIOContext } from 'providers'
import { WtSubmitIcon } from 'ui-atoms/Icons'
import { useFinAwareAPI, useSubpoenaAPI } from 'api'
import axios from 'axios'
import { ToastControl } from 'utils/toast'
import AuthHelper from 'constant/AuthHelper'
import { SET_LOADING } from 'constant'

let interVal: any = null

const SubpoenaNewUploadModal = forwardRef((props: any, ref: any) => {
  const { dispatch } = useContext(GlobalContext)
  const { socket } = useContext(SocketIOContext)
  const alertModalRef: any = useRef(null)
  const filesSeletedRef: any = useRef([])
  const subpoenaHook = useSubpoena()
  const subpoenaAPI = useSubpoenaAPI()
  const finAwareAPI = useFinAwareAPI()
  const [userInfo, setUserInfo] = useState<User.Details | null>(null)
  const [memberships, setMemberships] = useState<string[]>([])
  const [role, setRole] = useState<any>('')
  const [uploadForm, setUploadForm] = useState({
    caseFileNumber: null,
    threatTagging: 1,
    publicCorruptionTag: '',
    description: '',
    originalName: ''
  })
  const [uploadFormErrors, setUploadFormErrors] = useState<any>({
    originalName: '',
    file: '',
    caseFileNumber: '',
    threatTagging: '',
    publicCorruptionTag: '',
    description: ''
  })
  const [openModal, setOpenModal] = useState<string | undefined>()
  const uploadFileModalProps = { openModal, setOpenModal }
  const [filesSeleted, setFilesSelected] = useState<any>([])
  const threatTaggingOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  const [isSubmitingNewUpload, setIsSubmittingNewUpload] = useState(false)
  const requestIdRef = useRef('')

  let estimationPercent = 0

  const resetUploadForm = () => {
    requestIdRef.current = ''
    setUploadForm({
      caseFileNumber: null,
      threatTagging: 1,
      publicCorruptionTag: '',
      description: '',
      originalName: ''
    })
    setUploadFormErrors({
      originalName: '',
      file: '',
      caseFileNumber: '',
      threatTagging: '',
      publicCorruptionTag: '',
      description: ''
    })
    setFilesSelected([])
    filesSeletedRef.current = []
  }

  useEffect(() => {
    const userScope: Auth.ScopeInfo = getUserScopeInfo()

    setUserInfo(getUserInfo())
    setRole(userScope?.role || '')
    setMemberships(userScope?.memberships || [])
  }, [])

  useEffect(() => {
    socket?.on('process.detect', processDetectHandler)

    return () => {
      socket?.off('process.detect', processDetectHandler)
    }
  }, [socket])

  useImperativeHandle(ref, () => ({
    openPopup() {
      openNewUploadPopup()
    }
  }))

  const processDetectHandler = (event: any) => {
    try {
      dispatch({
        type: SET_LOADING,
        payload: {
          open: true,
          content: {
            percent: 100,
            label: 'Uploading'
          }
        }
      })
      if (interVal !== null) clearInterval(interVal)
      estimationPercent = 0
      const files = filesSeletedRef.current

      if (event && event.requestId === requestIdRef.current) {
        const fileIndex = files.findIndex((x: any) => event.uploadUrl?.uuid === x.uuid)

        if (fileIndex < 0) return

        files[fileIndex].status = event.status
        files[fileIndex].note = event.note || ''
        filesSeletedRef.current = files
        setFilesSelected(files.map((x: any) => x))
        const isInProgress = files.some((x: any) => x.status === 'draft')
        if (isInProgress) {
          //
        } else {
          const hasFailedRecord = files.some((x: any) => x.status != 'done')
          if (hasFailedRecord) {
            const errorRecord = files.find((x: any) => x.status == 'failed')
            let msg = Message.DEFAULT_ERR_MSG
            if (errorRecord) msg = errorRecord.note || Message.DEFAULT_ERR_MSG
            ToastControl.showErrorMessage(msg || Message.DEFAULT_ERR_MSG)
            setIsSubmittingNewUpload(false)
          } else {
            props.onSaved && props.onSaved()
            ToastControl.showSuccessMessage('You have successfully uploaded')
            uploadFileModalProps.setOpenModal(undefined)
            setIsSubmittingNewUpload(false)
          }
        }
      }
      clearInterval(interVal);
      dispatch({
        type: SET_LOADING,
        payload: {
          open: false,
          content: null
        }
      })
    } catch (err) {
      clearInterval(interVal);
      dispatch({
        type: SET_LOADING,
        payload: {
          open: false,
          content: null
        }
      })
    }
  }

  const openNewUploadPopup = async () => {
    uploadFileModalProps.setOpenModal('show')
    resetUploadForm()
  }

  const handleFileInput = (files: any) => {
    if (files) {
      if (files[0] && files[0] !== null && files[0] !== undefined) {
        const arr: any[] = []
        for (let i = 0; i < files.length && i < 5; i++) {
          arr.push({
            uuid: '',
            file: files[i],
            status: 'draft'
          })
        }
        filesSeletedRef.current = arr
        setFilesSelected(arr.map((x: any) => x))
      } else {
        filesSeletedRef.current = []
        setFilesSelected([])
      }
    }
  }

  const removeFile = (index: number) => {
    const arr: any[] = filesSeleted
    arr.splice(index, 1)

    filesSeletedRef.current = arr
    setFilesSelected(arr.map((x: any) => x))
  }

  const onChangeCaseFileNumber = (e: any) => {
    setUploadForm((form: any) => {
      return { ...form, caseFileNumber: e.target.value }
    })
  }

  const onChangeThreatTagging = (e: any) => {
    setUploadForm((form: any) => {
      return { ...form, threatTagging: e.target.value }
    })
  }
  const onChangePublicCorruptionTag = (e: any) => {
    setUploadForm((form: any) => {
      return { ...form, publicCorruptionTag: e.target.value }
    })
  }

  const onChangeOriginalName = (e: any) => {
    setUploadForm((form: any) => {
      return { ...form, originalName: e.target.value }
    })
  }

  const onChangeDescription = (e: any) => {
    setUploadForm((form: any) => {
      return { ...form, description: e.target.value }
    })
  }

  const validateFile = () => {
    const err = valiator.validate(filesSeleted, {
      required: true,
      errorsMessage: { required: 'This field is required.' }
    })
    setUploadFormErrors((errors: any) => {
      return { ...errors, file: err || '' }
    })
    return err
  }

  const isValidForm = (): boolean => {
    const arrRes = []
    arrRes.push(validateFile())

    return arrRes.findIndex((x) => x && x.length > 0) < 0
  }

  const submitUploadForm = () => {
    if (!isValidForm()) return
    console.log(filesSeleted)
    alertModalRef?.current.open({
      title: 'Warning',
      content: 'Are you sure you want to upload new case?',
      isShowTwoButton: true,
      confirmButton: {
        label: 'Yes, do it',
        action: () => {
          generateURL(filesSeleted)
        }
      }
    })
  }

  const setTime = () => {
    estimationPercent++
    if (estimationPercent > 98) return
    dispatch({
      type: SET_LOADING,
      payload: {
        open: true,
        content: {
          percent: estimationPercent,
          label: 'Uploading'
        }
      }
    })
  }

  const generateURL = (filesSeleted: any) => {
    setIsSubmittingNewUpload(true)
    let totalSize = 0
    let percentPerSec = 0
    filesSeleted?.forEach((item: any) => {
      totalSize += item?.file?.size
    })
    percentPerSec = (30 + (totalSize / 1000) * 0.045) / 100

    dispatch({
      type: SET_LOADING,
      payload: {
        open: true,
        content: {
          percent: 0,
          label: 'Uploading'
        }
      }
    })

    interVal = setInterval(setTime, percentPerSec * 1000)

    subpoenaHook.generateURL({
      callback: {
        onSuccess: (res: any) => {
          if (res) {
            requestIdRef.current = res?.requestId
            uploadToGgAPI(filesSeleted, res?.uploadUrls, res?.requestId)
          }
        },
        onFailure: (err) => {
          console.log(err)
          props.onFailed && props.onFailed()
          ToastControl.showErrorMessage(err || Message.DEFAULT_ERR_MSG)
          requestIdRef.current = ''
          setIsSubmittingNewUpload(false)
          clearInterval(interVal)
          dispatch({
            type: SET_LOADING,
            payload: {
              open: false,
              content: null
            }
          })
        }
      }
    })
  }

  const uploadToGgAPI = async (files: any, uploadUrls: any[], requestId: string) => {
    const filesSelectedArr = filesSeleted
    const requests: any[] = []
    for (let i = 0; i < filesSelectedArr?.length; i++) {
      if (uploadUrls[i]) {
        filesSelectedArr[i].uuid = uploadUrls[i].uuid
        requests.push(subpoenaAPI.requestGgApiUpload(uploadUrls[i]?.signedUrl, filesSelectedArr[i].file))
      }
    }

    try {
      const resp = await axios.all(requests)
      const params: Subpoena.CreateParams = {
        requestId: requestId || '',
        uploadedObjects: filesSeleted?.map((x: any) => {
          return {
            id: x.uuid,
            originalName: x.file?.name
          }
        }),
        threatTagging: uploadForm.threatTagging.toString(),
        publicCorruptionTag: uploadForm.publicCorruptionTag,
        description: uploadForm.description
      }
      requestNewUpload(params)
    } catch (error) {
      console.log(error)
      setIsSubmittingNewUpload(false)
      clearInterval(interVal)
      dispatch({
        type: SET_LOADING,
        payload: {
          open: false,
          content: null
        }
      })
    }
  }

  const requestNewUpload = (params: Subpoena.CreateParams) => {
    setIsSubmittingNewUpload(true)
    subpoenaHook.newUpload({
      params: params,
      callback: {
        onSuccess: (res) => {
          handleNewUploadData(res)
        },
        onFailure: (err) => {
          console.log(err)
          props.onFailed && props.onFailed()
          ToastControl.showErrorMessage(err || Message.DEFAULT_ERR_MSG)
          setIsSubmittingNewUpload(false)
          clearInterval(interVal)
          dispatch({
            type: SET_LOADING,
            payload: {
              open: false,
              content: null
            }
          })
        }
      }
    })
  }

  const handleNewUploadData = async (data: Subpoena.Details[]) => {
    if (!memberships.includes(AuthHelper.MembershipType.FINAWARE)) return

    const requests: any[] = []
    for (let i = 0; i < data?.length; i++) {
      if (data[i]) {
        const params: FinAware.PostCaseDetailsParams = {
          user_id: userInfo?._id || '',
          name: data[i]?.name || '',
          originalName: uploadForm?.originalName || data[i]?.originalName || '',
          threatTagging: data[i]?.threatTagging || '',
          publicCorruptionTag: data[i]?.publicCorruptionTag || '',
          description: data[i]?.description || '',
          case_creation_date: data[i]?.createdAt || '',
          size: data[i]?.size?.toString() || '0',
          file_urls: data[i]?.url ? [data[i]?.url] : []
        }
        requests.push(finAwareAPI.postCaseDetails(data[i]?.caseId || '', params))
      }
    }

    try {
      const resp: any = await axios.all(requests);

      if (resp?.detail && resp?.detail instanceof Array) {
        const msg = resp?.detail
          ?.map((x: any) => {
            return x.msg
          })
          .filter(Boolean)
          .join(' ')
        ToastControl.showErrorMessage(msg)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Modal
        theme={ThemeHelper.MODAL_THEME}
        show={uploadFileModalProps.openModal === 'show'}
        onClose={() => (!isSubmitingNewUpload ? uploadFileModalProps.setOpenModal(undefined) : null)}
      >
        <div className='flex items-start justify-between rounded-t border-b p-5'>
          <h3 id=':rl:' className='flex items-center text-xl font-bold text-wt-primary-40 dark:text-white'>
            <img src={modalIcon} className='mr-2' />
            Upload New Subpoena
          </h3>
          <button
            aria-label='Close'
            className='ml-auto inline-flex items-center justify-center rounded-full bg-wt-primary-75 p-1 text-sm text-white hover:bg-wt-primary-40 hover:text-white'
            type='button'
            disabled={isSubmitingNewUpload}
            onClick={() => (!isSubmitingNewUpload ? uploadFileModalProps.setOpenModal(undefined) : null)}
          >
            <IconSvg className='h-3 w-3' icon='closeModal' />
          </button>
        </div>
        <Modal.Body>
          <div className='space-y-6'>
            <form>
              <div className='mb-4'>
                <label className='block mb-2 text-sm font-bold text-wt-primary-40'>
                  Upload file <span className='text-red-600'>*</span>
                </label>
                {filesSeleted?.map((item: any, index: number) => {
                  return (
                    <div
                      key={index}
                      className={[
                        'flex border border-wt-primary-90 rounded-lg mb-2',
                        isSubmitingNewUpload ? 'opacity-50 cursor-not-allowed' : ''
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      <img src={fileUploadIcon} />
                      <div className='flex-1 flex items-center min-h-full text-base text-wt-primary-40 border-l border-r border-wt-primary-90 px-2'>
                        {item.file?.name}
                      </div>
                      <div className='p-3 flex items-center justify-center'>
                        <a
                          className='inline-flex items-center justify-center rounded-full bg-wt-primary-75 p-1 text-white cursor-pointer'
                          onClick={() => {
                            if (isSubmitingNewUpload) return
                            removeFile(index)
                          }}
                          aria-disabled={isSubmitingNewUpload}
                        >
                          <IconSvg className='h-2 w-2' icon='closeModal' />
                        </a>
                      </div>
                    </div>
                  )
                })}
                <FileInputDragDrop
                  onInput={handleFileInput}
                  multiple={true}
                  disabled={isSubmitingNewUpload}
                  error={uploadFormErrors.file}
                />
                <p className='text-red-600 text-center mt-1'>{uploadFormErrors.file}</p>
              </div>
              <div className='mb-4'>
                <label htmlFor='originalName' className='block mb-2 text-sm font-bold text-wt-primary-40'>
                  Original Name
                </label>
                <input
                  type='text'
                  name='originalName'
                  id='originalName'
                  className={[
                    'form-control form-gray',
                    uploadFormErrors.originalName ? UIHelperClass.INVALID_CLASS : ''
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  placeholder='Original Name'
                  value={uploadForm.originalName || ''}
                  disabled={isSubmitingNewUpload}
                  onChange={onChangeOriginalName}
                />
                <p className='text-red-600 mt-1'>{uploadFormErrors.originalName}</p>
              </div>
              <div className='mb-4'>
                <label htmlFor='threatTagging' className='block mb-2 text-sm font-bold text-wt-primary-40'>
                  Threat tagging
                </label>
                <div className='flex flex-col space-y-2 p-2 w-100'>
                  <div className='flex justify-between w-full mb-1'>
                    {threatTaggingOptions.map((value) => (
                      <div key={value} className='flex flex-row items-center cursor-pointer px-1'>
                        <input
                          id={'threatTagging' + value}
                          className='w-4 h-4 border-gray-400 focus:ring-blue-500'
                          name='threatTagging'
                          type='radio'
                          value={value}
                          checked={uploadForm.threatTagging == value}
                          disabled={isSubmitingNewUpload}
                          onChange={onChangeThreatTagging}
                        />
                        <label
                          htmlFor={'threatTagging' + value}
                          className='cursor-pointer text-bold text-center dark:text-white ml-2'
                        >
                          {value}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <p className='text-red-600 mt-1'>{uploadFormErrors.threatTagging}</p>
              </div>
              <div className='mb-4'>
                <label htmlFor='publicCorruptionTag' className='block mb-2 text-sm font-bold text-wt-primary-40'>
                  Public corruption tag
                </label>
                <input
                  type='text'
                  name='publicCorruptionTag'
                  id='publicCorruptionTag'
                  className={[
                    'form-control form-gray',
                    uploadFormErrors.publicCorruptionTag ? UIHelperClass.INVALID_CLASS : ''
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  placeholder='Public corruption tag'
                  value={uploadForm.publicCorruptionTag || ''}
                  disabled={isSubmitingNewUpload}
                  onChange={onChangePublicCorruptionTag}
                />
                <p className='text-red-600 mt-1'>{uploadFormErrors.publicCorruptionTag}</p>
              </div>
              <div>
                <label htmlFor='description' className='block mb-2 text-sm font-bold text-wt-primary-40'>
                  Description
                </label>
                <input
                  type='text'
                  name='description'
                  id='description'
                  className={['form-control form-gray', uploadFormErrors.description ? UIHelperClass.INVALID_CLASS : '']
                    .filter(Boolean)
                    .join(' ')}
                  placeholder='Description'
                  value={uploadForm.description || ''}
                  disabled={isSubmitingNewUpload}
                  onChange={onChangeDescription}
                />
                <p className='text-red-600 mt-1'>{uploadFormErrors.description}</p>
              </div>
            </form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className='btn btn-secondary py-3 bg-wt-primary-75 hover:bg-gray-400 font-bold text-white rounded-lg ml-auto px-5'
            type='button'
            disabled={isSubmitingNewUpload}
            onClick={() => uploadFileModalProps.setOpenModal(undefined)}
          >
            Cancel
          </Button>
          <Button
            className='flex items-center btn bg-wt-orange-1 hover:bg-wt-orange-3 py-3 rounded-lg font-bold text-white'
            type='button'
            isLoading={isSubmitingNewUpload}
            onClick={() => submitUploadForm()}
          >
            <WtSubmitIcon className='h-5 w-5 mr-2' />
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
      <AlertModal ref={alertModalRef} />
    </>
  )
})

export default SubpoenaNewUploadModal
