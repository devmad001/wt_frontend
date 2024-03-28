import modalIcon from 'assets/media/png/new-upload-modal-icon.png'
import fileUploadIcon from 'assets/media/png/upload-drag-drop.png'

import Message from 'constant/Message'
import ThemeHelper from 'constant/ThemeHelper'
import UIHelperClass from 'constant/UIHelper'
import { Modal } from 'flowbite-react'
import { useSubpoena } from 'hooks'
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { HiChevronRight, HiHome } from 'react-icons/hi'
import { toast } from 'react-toastify'
import { Button, FileInput, IconSvg, Spinner } from 'ui-atoms'
import { WtSubmitIcon } from 'ui-atoms/Icons'
import { AlertModal } from 'ui-molecules'
import { valiator } from 'utils'

interface UpdateForm {
  file?: any
  caseFileNumber: any
  threatTagging: any
  publicCorruptionTag: any
  description: any
  trackingNumber: any
  dateOrderPrepared: any
  usaoNumber: any
  nameOfTheBank: any
  agent: any
  returnDate: any
  limitPay: any
  nameOfRequestor: any
  ausaPhoneNumber: any
  ausaRequestDate: any
}

const uploadFormDefaultValue = {
  caseFileNumber: null,
  threatTagging: null,
  publicCorruptionTag: '',
  description: '',
  trackingNumber: '',
  dateOrderPrepared: '',
  usaoNumber: '',
  nameOfTheBank: '',
  agent: '',
  returnDate: '',
  limitPay: '',
  nameOfRequestor: '',
  ausaPhoneNumber: '',
  ausaRequestDate: ''
}

const uploadFormErrorDefaultValue = {
  file: '',
  caseFileNumber: '',
  threatTagging: '',
  publicCorruptionTag: '',
  description: '',
  trackingNumber: '',
  dateOrderPrepared: '',
  usaoNumber: '',
  nameOfTheBank: '',
  agent: '',
  returnDate: '',
  limitPay: '',
  nameOfRequestor: '',
  ausaPhoneNumber: '',
  ausaRequestDate: ''
}

const SubpoenaEditUploadModal = forwardRef((props: any, ref: any) => {
  const alertModalRef: any = useRef(null)
  const subpoenaHook = useSubpoena()
  const [subpoenaDetail, setSubpoenaDetail] = useState<Subpoena.Details | null>(null)
  const [uploadForm, setUploadForm] = useState<UpdateForm>(uploadFormDefaultValue)
  const [uploadFormErrors, setUploadFormErrors] = useState<UpdateForm>(uploadFormErrorDefaultValue)
  const [openModal, setOpenModal] = useState<string | undefined>()
  const uploadFileModalProps = { openModal, setOpenModal }
  const [fileSeleted, setFileSelected] = useState<any>(null)
  const [fileName, setFileName] = useState('')
  const threatTaggingOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  const [isDisabledCaseFileNumber, setIsDisabledCaseFileNumber] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useImperativeHandle(ref, () => ({
    openPopup(data: { _id: string }) {
      openEditModal(data)
    }
  }))

  const openEditModal = (data: { _id: string }) => {
    uploadFileModalProps.setOpenModal('show')
    if (data && data._id) {
      requestGetSubpoenaDetail(data._id)
    }
  }

  const requestGetSubpoenaDetail = (_id: string) => {
    setIsLoading(true)
    const params: Subpoena.StatementParams = {
      key: '',
      page: 1,
      limit: 10
    }
    subpoenaHook.getSubpoenaDetail({
      _id: _id,
      params: params,
      callback: {
        onSuccess: (res: any) => {
          setSubpoenaDetail(res?.document)
          setUploadForm({
            ...uploadForm,
            caseFileNumber: res?.document?.caseFileNumber || null,
            threatTagging: res?.document?.threatTagging || null,
            publicCorruptionTag: res?.document?.publicCorruptionTag || '',
            description: res?.document?.description || '',
            trackingNumber: res?.document?.trackingNumber || '',
            dateOrderPrepared: res?.document?.usaoOrderDate || '',
            usaoNumber: res?.document?.usaoNumber || '',
            nameOfTheBank: res?.document?.bankName || '',
            agent: res?.document?.agent || '',
            returnDate: res?.document?.returnDate || '',
            limitPay: res?.document?.limitPay || '',
            nameOfRequestor: res?.document?.requestorName || '',
            ausaPhoneNumber: res?.document?.requestorPhoneNumber || '',
            ausaRequestDate: res?.document?.requestedDate || ''
          })
          setFileName(res?.document?.originalName)
          if (res?.document?.caseFileNumber) {
            setIsDisabledCaseFileNumber(true)
          } else {
            setIsDisabledCaseFileNumber(false)
          }
          setIsLoading(false)
        },
        onFailure: (err) => {
          console.log(err)
          toast.error(err?.message || Message.DEFAULT_ERR_MSG, {
            position: 'top-center',
            autoClose: 2500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined
          })
          setIsLoading(false)
        }
      }
    })
  }

  const resetUploadForm = () => {
    setUploadForm(uploadFormDefaultValue)
    setUploadFormErrors(uploadFormErrorDefaultValue)
    setFileSelected(null)
  }

  const handleFileInput = ($event: any) => {
    if ($event.target.files) {
      setFileSelected($event.target.files[0])
      if (fileSeleted && fileSeleted !== null && fileSeleted !== undefined) {
        // if (!Media.validateFileFormat(fileSeleted, fileSeleted.name, fileSeleted.type, ['application/pdf'])) {
        //   //
        // }
      }
    }
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

  const onChangeDescription = (e: any) => {
    setUploadForm((form: any) => {
      return { ...form, description: e.target.value }
    })
  }

  const onChangeTrackingNumber = (e: any) => {
    setUploadForm((form: any) => {
      return { ...form, trackingNumber: e.target.value }
    })
  }

  const onChangeDateOrderPrepared = (e: any) => {
    setUploadForm((form: any) => {
      return { ...form, dateOrderPrepared: e.target.value }
    })
  }

  const onChangeUsaoNumber = (e: any) => {
    setUploadForm((form: any) => {
      return { ...form, usaoNumber: e.target.value }
    })
  }

  const onChangeNameOfTheBank = (e: any) => {
    setUploadForm((form: any) => {
      return { ...form, nameOfTheBank: e.target.value }
    })
  }

  const onChangeAgent = (e: any) => {
    setUploadForm((form: any) => {
      return { ...form, agent: e.target.value }
    })
  }

  const onChangeReturnDate = (e: any) => {
    setUploadForm((form: any) => {
      return { ...form, returnDate: e.target.value }
    })
  }

  const onChangeLimitPay = (e: any) => {
    setUploadForm((form: any) => {
      return { ...form, limitPay: e.target.value }
    })
  }

  const onChangeNameOfRequestor = (e: any) => {
    setUploadForm((form: any) => {
      return { ...form, nameOfRequestor: e.target.value }
    })
  }

  const onChangeAusaPhoneNumber = (e: any) => {
    setUploadForm((form: any) => {
      return { ...form, ausaPhoneNumber: e.target.value }
    })
  }

  const onChangeAusaRequestDate = (e: any) => {
    setUploadForm((form: any) => {
      return { ...form, ausaRequestDate: e.target.value }
    })
  }

  const validateFile = () => {
    const err = valiator.validate(fileSeleted, {
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
    alertModalRef?.current.open({
      title: 'Warning',
      content: 'Are you sure you want to update this subpoena?',
      isShowTwoButton: true,
      confirmButton: {
        label: 'Yes, do it',
        action: () => {
          const params: Subpoena.UpdateParams = {
            threatTagging: uploadForm.threatTagging,
            publicCorruptionTag: uploadForm.publicCorruptionTag,
            description: uploadForm.description,
            trackingNumber: uploadForm.trackingNumber,
            usaoOrderDate: uploadForm.dateOrderPrepared,
            usaoNumber: uploadForm.usaoNumber,
            bankName: uploadForm.nameOfTheBank,
            agent: uploadForm.agent,
            returnDate: uploadForm.returnDate,
            limitPay: uploadForm.limitPay,
            requestorName: uploadForm.nameOfRequestor,
            requestorPhoneNumber: uploadForm.ausaPhoneNumber,
            requestedDate: uploadForm.ausaRequestDate
          }
          if (!isDisabledCaseFileNumber) {
            params.caseFileNumber = uploadForm.caseFileNumber
          }
          requestEditSubpoena(subpoenaDetail?._id || '', params)
        }
      }
    })
  }

  const requestEditSubpoena = (_id: string, params: Subpoena.UpdateParams) => {
    setIsSubmitting(true)
    subpoenaHook.editSubpoena({
      _id: _id,
      params: params,
      callback: {
        onSuccess: (res) => {
          props.onUpdated && props.onUpdated()
          toast.success('You have successfully updated', {
            position: 'top-center',
            autoClose: 2500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined
          })
          uploadFileModalProps.setOpenModal(undefined)
          setIsSubmitting(false)
        },
        onFailure: (err) => {
          console.log(err)
          props.onFailed && props.onFailed()
          toast.error(err?.message || Message.DEFAULT_ERR_MSG, {
            position: 'top-center',
            autoClose: 2500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined
          })
          setIsSubmitting(false)
        }
      }
    })
  }

  return (
    <>
      <Modal
        theme={ThemeHelper.MODAL_THEME}
        size={'2xl'}
        show={uploadFileModalProps.openModal === 'show'}
        onClose={() => (!isSubmitting ? uploadFileModalProps.setOpenModal(undefined) : null)}
      >
        <div className='flex items-start justify-between rounded-t dark:border-gray-600 border-b p-5'>
          <h3 id=':rl:' className='flex items-center text-xl font-bold text-wt-primary-40 dark:text-white'>
            <img src={modalIcon} className='mr-2' />
            Edit Subpoena
          </h3>
          <button
            aria-label='Close'
            className='ml-auto inline-flex items-center justify-center rounded-full bg-wt-primary-75 p-1 text-sm text-white hover:bg-wt-primary-40 hover:text-white'
            type='button'
            disabled={isSubmitting}
            onClick={() => (!isSubmitting ? uploadFileModalProps.setOpenModal(undefined) : null)}
          >
            <IconSvg className='h-3 w-3' icon='closeModal' />
          </button>
        </div>
        <Modal.Body>
          <div className='space-y-6'>
            {isLoading ? (
              <div className='flex items-center justify-center w-100'>
                <Spinner />
              </div>
            ) : (
              <form>
                <div className='grid grid-cols-12 gap-4'>
                  <div className='col-span-12'>
                    <div className='mb-4'>
                      <label className='block mb-2 text-sm font-bold text-wt-primary-40'>File name</label>
                      <span className='block pt-2.5 pb-3 dark:text-white'>{fileName}</span>
                      {/* <FileInput fileName={fileName} disabled={true} multiple={false} error={uploadFormErrors.file} /> */}
                      <p className='text-red-600 mt-1'>{uploadFormErrors.file}</p>
                    </div>
                    <div className='mb-4'>
                      <label htmlFor='caseFileNumber' className='block mb-2 text-sm font-bold text-wt-primary-40'>
                        Case file number
                      </label>
                      <input
                        type='text'
                        name='caseFileNumber'
                        id='caseFileNumber'
                        className={[
                          'form-control form-gray',
                          uploadFormErrors.caseFileNumber ? UIHelperClass.INVALID_CLASS : ''
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        placeholder='Case file number'
                        value={uploadForm.caseFileNumber || ''}
                        disabled={isDisabledCaseFileNumber}
                        onChange={onChangeCaseFileNumber}
                      />
                      <p className='text-red-600 mt-1'>{uploadFormErrors.caseFileNumber}</p>
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
                                disabled={isSubmitting}
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
                        disabled={isSubmitting}
                        onChange={onChangePublicCorruptionTag}
                      />
                      <p className='text-red-600 mt-1'>{uploadFormErrors.publicCorruptionTag}</p>
                    </div>
                    <div className='mb-4'>
                      <label htmlFor='description' className='block mb-2 text-sm font-bold text-wt-primary-40'>
                        Description
                      </label>
                      <input
                        type='text'
                        name='description'
                        id='description'
                        className={[
                          'form-control form-gray',
                          uploadFormErrors.description ? UIHelperClass.INVALID_CLASS : ''
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        placeholder='Description'
                        value={uploadForm.description || ''}
                        disabled={isSubmitting}
                        onChange={onChangeDescription}
                      />
                      <p className='text-red-600 mt-1'>{uploadFormErrors.description}</p>
                    </div>

                    <div className='mb-4'>
                      <label htmlFor='trackingNumber' className='block mb-2 text-sm font-bold text-wt-primary-40'>
                        Tracking number
                      </label>
                      <input
                        type='text'
                        name='trackingNumber'
                        id='trackingNumber'
                        className={[
                          'form-control form-gray',
                          uploadFormErrors.trackingNumber ? UIHelperClass.INVALID_CLASS : ''
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        placeholder='Tracking number'
                        value={uploadForm.trackingNumber || ''}
                        disabled={isSubmitting}
                        onChange={onChangeTrackingNumber}
                      />
                      <p className='text-red-600 mt-1'>{uploadFormErrors.trackingNumber}</p>
                    </div>
                    <div className='mb-4'>
                      <label htmlFor='dateOrderPrepared' className='block mb-2 text-sm font-bold text-wt-primary-40'>
                        Date order prepared
                      </label>
                      <input
                        type='text'
                        name='dateOrderPrepared'
                        id='dateOrderPrepared'
                        className={[
                          'form-control form-gray',
                          uploadFormErrors.dateOrderPrepared ? UIHelperClass.INVALID_CLASS : ''
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        placeholder='Date order prepared'
                        value={uploadForm.dateOrderPrepared || ''}
                        disabled={isSubmitting}
                        onChange={onChangeDateOrderPrepared}
                      />
                      <p className='text-red-600 mt-1'>{uploadFormErrors.dateOrderPrepared}</p>
                    </div>
                    <div className='mb-4'>
                      <label htmlFor='usaoNumber' className='block mb-2 text-sm font-bold text-wt-primary-40'>
                        USAO Number
                      </label>
                      <input
                        type='text'
                        name='usaoNumber'
                        id='usaoNumber'
                        className={[
                          'form-control form-gray',
                          uploadFormErrors.usaoNumber ? UIHelperClass.INVALID_CLASS : ''
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        placeholder='USAO Number'
                        value={uploadForm.usaoNumber || ''}
                        disabled={isSubmitting}
                        onChange={onChangeUsaoNumber}
                      />
                      <p className='text-red-600 mt-1'>{uploadFormErrors.usaoNumber}</p>
                    </div>
                    <div className='mb-4'>
                      <label htmlFor='nameOfTheBank' className='block mb-2 text-sm font-bold text-wt-primary-40'>
                        Name of the Bank
                      </label>
                      <input
                        type='text'
                        name='nameOfTheBank'
                        id='nameOfTheBank'
                        className={[
                          'form-control form-gray',
                          uploadFormErrors.nameOfTheBank ? UIHelperClass.INVALID_CLASS : ''
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        placeholder='USAO Number'
                        value={uploadForm.nameOfTheBank || ''}
                        disabled={isSubmitting}
                        onChange={onChangeNameOfTheBank}
                      />
                      <p className='text-red-600 mt-1'>{uploadFormErrors.nameOfTheBank}</p>
                    </div>
                    <div className='mb-4'>
                      <label htmlFor='agent' className='block mb-2 text-sm font-bold text-wt-primary-40'>
                        Agent
                      </label>
                      <input
                        type='text'
                        name='agent'
                        id='agent'
                        className={['form-control form-gray', uploadFormErrors.agent ? UIHelperClass.INVALID_CLASS : '']
                          .filter(Boolean)
                          .join(' ')}
                        placeholder='Agent'
                        value={uploadForm.agent || ''}
                        disabled={isSubmitting}
                        onChange={onChangeAgent}
                      />
                      <p className='text-red-600 mt-1'>{uploadFormErrors.agent}</p>
                    </div>
                    <div className='mb-4'>
                      <label htmlFor='returnDate' className='block mb-2 text-sm font-bold text-wt-primary-40'>
                        Return date
                      </label>
                      <input
                        type='text'
                        name='returnDate'
                        id='returnDate'
                        className={[
                          'form-control form-gray',
                          uploadFormErrors.returnDate ? UIHelperClass.INVALID_CLASS : ''
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        placeholder='Return date'
                        value={uploadForm.returnDate || ''}
                        disabled={isSubmitting}
                        onChange={onChangeReturnDate}
                      />
                      <p className='text-red-600 mt-1'>{uploadFormErrors.returnDate}</p>
                    </div>
                    <div className='mb-4'>
                      <label htmlFor='limitPay' className='block mb-2 text-sm font-bold text-wt-primary-40'>
                        Limit pay
                      </label>
                      <input
                        type='text'
                        name='limitPay'
                        id='limitPay'
                        className={[
                          'form-control form-gray',
                          uploadFormErrors.limitPay ? UIHelperClass.INVALID_CLASS : ''
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        placeholder='Limit pay'
                        value={uploadForm.limitPay || ''}
                        disabled={isSubmitting}
                        onChange={onChangeLimitPay}
                      />
                      <p className='text-red-600 mt-1'>{uploadFormErrors.limitPay}</p>
                    </div>
                    <div className='mb-4'>
                      <label htmlFor='nameOfRequestor' className='block mb-2 text-sm font-bold text-wt-primary-40'>
                        Name of Requestor
                      </label>
                      <input
                        type='text'
                        name='nameOfRequestor'
                        id='nameOfRequestor'
                        className={[
                          'form-control form-gray',
                          uploadFormErrors.nameOfRequestor ? UIHelperClass.INVALID_CLASS : ''
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        placeholder='Name of Requestor'
                        value={uploadForm.nameOfRequestor || ''}
                        disabled={isSubmitting}
                        onChange={onChangeNameOfRequestor}
                      />
                      <p className='text-red-600 mt-1'>{uploadFormErrors.nameOfRequestor}</p>
                    </div>
                    <div className='mb-4'>
                      <label htmlFor='ausaPhoneNumber' className='block mb-2 text-sm font-bold text-wt-primary-40'>
                        AUSA Phone number
                      </label>
                      <input
                        type='text'
                        name='ausaPhoneNumber'
                        id='ausaPhoneNumber'
                        className={[
                          'form-control form-gray',
                          uploadFormErrors.ausaPhoneNumber ? UIHelperClass.INVALID_CLASS : ''
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        placeholder='AUSA Phone number'
                        value={uploadForm.ausaPhoneNumber || ''}
                        disabled={isSubmitting}
                        onChange={onChangeAusaPhoneNumber}
                      />
                      <p className='text-red-600 mt-1'>{uploadFormErrors.ausaPhoneNumber}</p>
                    </div>
                    <div className='mb-4'>
                      <label htmlFor='ausaRequestDate' className='block mb-2 text-sm font-bold text-wt-primary-40'>
                        AUSA Requested Date
                      </label>
                      <input
                        type='text'
                        name='ausaRequestDate'
                        id='ausaRequestDate'
                        className={[
                          'form-control form-gray',
                          uploadFormErrors.ausaRequestDate ? UIHelperClass.INVALID_CLASS : ''
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        placeholder='AUSA Requested Date'
                        value={uploadForm.ausaRequestDate || ''}
                        disabled={isSubmitting}
                        onChange={onChangeAusaRequestDate}
                      />
                      <p className='text-red-600 mt-1'>{uploadFormErrors.ausaRequestDate}</p>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className='btn btn-secondary py-3 bg-wt-primary-75 hover:bg-gray-400 font-bold text-white rounded-lg ml-auto px-5'
            type='button'
            disabled={isSubmitting || isLoading}
            onClick={() => uploadFileModalProps.setOpenModal(undefined)}
          >
            Cancel
          </Button>
          <Button
            className='flex items-center btn bg-wt-orange-1 hover:bg-wt-orange-3 py-3 rounded-lg font-bold text-white'
            type='button'
            isLoading={isSubmitting || isLoading}
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

export default SubpoenaEditUploadModal
