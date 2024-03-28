import Message from 'constant/Message'
import ThemeHelper from 'constant/ThemeHelper'
import UIHelperClass from 'constant/UIHelper'
import { Modal } from 'flowbite-react'
import { useSubpoena } from 'hooks'
import moment from 'moment'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { HiChevronRight, HiHome } from 'react-icons/hi'
import ReactPaginate from 'react-paginate'
import { toast } from 'react-toastify'
import { Button, IconSvg, Spinner } from 'ui-atoms'
import { valiator } from 'utils'

const SubpoenaDetailModal = forwardRef((props: any, ref: any) => {
  const pageInforDefault = {
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPage: 0
  }
  const subpoenaHook = useSubpoena()
  const [subpoenaDetail, setSubpoenaDetail] = useState<Subpoena.Details>()
  const [statements, setStatements] = useState<Subpoena.Statement[]>([])
  const [pageInfor, setPageInfor] = useState<App.PageInfor>(pageInforDefault)
  const [openModal, setOpenModal] = useState<string | undefined>()
  const uploadFileModalProps = { openModal, setOpenModal }
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isLoadingStatements, setIsLoadingStatements] = useState<boolean>(false)

  useImperativeHandle(ref, () => ({
    openPopup(data: { _id: string }) {
      openDetailModal(data)
    }
  }))

  const openDetailModal = (data: { _id: string }) => {
    uploadFileModalProps.setOpenModal('show')
    if (data && data._id) {
      const params: Subpoena.StatementParams = {
        key: '',
        page: 1,
        limit: 10
      }
      requestGetSubpoenaDetail(data._id, params)
    }
  }

  const requestGetSubpoenaDetail = (_id: string, params: Subpoena.StatementParams) => {
    setIsLoading(true)
    subpoenaHook.getSubpoenaDetail({
      _id: _id,
      params: params,
      callback: {
        onSuccess: (res: any) => {
          setSubpoenaDetail(res?.document)
          setStatements(
            res?.items?.map((x: Subpoena.Statement) => {
              return {
                ...x,
                createdAt: moment(new Date(x.createdAt)).format('MM/DD/YYYY H:mm:ss')
              }
            })
          )
          setPageInfor(res?.pageInfo)
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

  const loadStatements = (page = 1) => {
    setPageInfor((current) => {
      return {
        ...current,
        page: page
      }
    })
    const params: Subpoena.StatementParams = {
      key: '',
      page: page,
      limit: 10
    }
    requestGetStatements(subpoenaDetail?._id || '', params)
  }

  const requestGetStatements = (_id: string, params: Subpoena.StatementParams) => {
    if (!_id) return

    setIsLoadingStatements(true)
    subpoenaHook.getSubpoenaDetail({
      _id: _id,
      params: params,
      callback: {
        onSuccess: (res: any) => {
          setStatements(
            res?.items?.map((x: Subpoena.Statement) => {
              return {
                ...x,
                createdAt: moment(new Date(x.createdAt)).format('MM/DD/YYYY H:mm:ss')
              }
            })
          )
          setPageInfor(res?.pageInfo)
          setIsLoadingStatements(false)
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
          setIsLoadingStatements(false)
        }
      }
    })
  }

  return (
    <>
      <Modal
        theme={ThemeHelper.MODAL_THEME}
        show={uploadFileModalProps.openModal === 'show'}
        size={'7xl'}
        id='subpoenaDetailModal'
        onClose={() => (!isLoading ? uploadFileModalProps.setOpenModal(undefined) : null)}
      >
        {/* <Modal.Header>{subpoenaDetail?.originalName || 'Subpoena detail'}</Modal.Header> */}
        <div className='flex items-start justify-between rounded-t dark:border-gray-600 border-b p-5'>
          <h3 id=':rl:' className='text-xl font-bold text-wt-primary-40'>
            {subpoenaDetail?.originalName || 'Subpoena detail'}
          </h3>
          <button
            aria-label='Close'
            className='ml-auto inline-flex items-center justify-center rounded-full bg-wt-primary-75 p-1 text-sm text-white hover:bg-wt-primary-40 hover:text-white'
            type='button'
            onClick={() => uploadFileModalProps.setOpenModal(undefined)}
          >
            <IconSvg className='h-3 w-3' icon='closeModal' />
          </button>
        </div>
        <Modal.Body className='px-0 flex-1 overflow-auto'>
          <div className='space-y-6'>
            {isLoading ? (
              <div className='flex items-center justify-center w-100'>
                <Spinner />
              </div>
            ) : (
              <>
                <div className='px-6'>
                  <div className='flex flex-wrap gap-3'>
                    <div className='mb-4 pr-3 border-r'>
                      <label
                        htmlFor='caseFileNumber'
                        className='inline mb-2 mr-2 text-sm font-bold text-wt-primary-40 dark:text-white'
                      >
                        Case file number:
                      </label>
                      <span className='dark:text-white'>{subpoenaDetail?.caseFileNumber || ''}</span>
                    </div>
                    <div className='mb-4 pr-3 border-r'>
                      <label
                        htmlFor='caseFileNumber'
                        className='inline mb-2 mr-2 text-sm font-bold text-wt-primary-40 dark:text-white'
                      >
                        Threat tagging:
                      </label>
                      <span className='dark:text-white'>{subpoenaDetail?.threatTagging || ''}</span>
                    </div>
                    <div className='mb-4'>
                      <label
                        htmlFor='caseFileNumber'
                        className='inline mb-2 mr-2 text-sm font-bold text-wt-primary-40 dark:text-white'
                      >
                        Public corruption tag:
                      </label>
                      <span className='dark:text-white'>{subpoenaDetail?.publicCorruptionTag || ''}</span>
                    </div>
                  </div>
                  <div className='flex gap-3'>
                    <div className='mb-4 pr-3 border-r'>
                      <label className='inline mb-2 mr-2 text-sm font-bold text-wt-primary-40 dark:text-white'>
                        Tracking Number:
                      </label>
                      <span className='dark:text-white'>{subpoenaDetail?.trackingNumber || ''}</span>
                    </div>
                    <div className='mb-4 pr-3 border-r'>
                      <label className='inline mb-2 mr-2 text-sm font-bold text-wt-primary-40 dark:text-white'>
                        Date Order Prepared:
                      </label>
                      <span className='dark:text-white'>{subpoenaDetail?.usaoOrderDate || ''}</span>
                    </div>
                    <div className='mb-4'>
                      <label className='inline mb-2 mr-2 text-sm font-bold text-wt-primary-40 dark:text-white'>
                        USAO Number:
                      </label>
                      <span className='dark:text-white'>{subpoenaDetail?.usaoNumber || ''}</span>
                    </div>
                  </div>
                  <div className='flex gap-3'>
                    <div className='mb-4 pr-3 border-r'>
                      <label className='inline mb-2 mr-2 text-sm font-bold text-wt-primary-40 dark:text-white'>
                        Name of the Bank:
                      </label>
                      <span className='dark:text-white'>{subpoenaDetail?.bankName || ''}</span>
                    </div>
                    <div className='mb-4 pr-3 border-r'>
                      <label className='inline mb-2 mr-2 text-sm font-bold text-wt-primary-40 dark:text-white'>
                        Agent:
                      </label>
                      <span className='dark:text-white'>{subpoenaDetail?.agent || ''}</span>
                    </div>
                    <div className='mb-4 border-r'>
                      <label className='inline mb-2 mr-2 text-sm font-bold text-wt-primary-40 dark:text-white'>
                        Return date:
                      </label>
                      <span className='dark:text-white'>{subpoenaDetail?.requestedDate || ''}</span>
                    </div>
                    <div className='mb-4'>
                      <label className='inline mb-2 mr-2 text-sm font-bold text-wt-primary-40 dark:text-white'>
                        Limit Pay:
                      </label>
                      <span className='dark:text-white'>{subpoenaDetail?.limitPay || ''}</span>
                    </div>
                  </div>
                  <div className='flex gap-3'>
                    <div className='mb-4 pr-3 border-r'>
                      <label className='inline mb-2 mr-2 text-sm font-bold text-wt-primary-40 dark:text-white'>
                        Name of Requestor:
                      </label>
                      <span className='dark:text-white'>{subpoenaDetail?.requestorName || ''}</span>
                    </div>
                    <div className='mb-4 pr-3 border-r'>
                      <label className='inline mb-2 mr-2 text-sm font-bold text-wt-primary-40 dark:text-white'>
                        AUSA Phone number:
                      </label>
                      <span className='dark:text-white'>{subpoenaDetail?.requestorPhoneNumber || ''}</span>
                    </div>
                    <div className='mb-4'>
                      <label className='inline mb-2 mr-2 text-sm font-bold text-wt-primary-40 dark:text-white'>
                        AUSA Requested Date:
                      </label>
                      <span className='dark:text-white'>{subpoenaDetail?.requestedDate || ''}</span>
                    </div>
                  </div>
                </div>
                <div className='flex flex-col mt-5'>
                  <div className='flex-1 flex px-6'>
                    <label className='block mb-2 text-sm font-bold text-wt-primary-40 dark:text-white'>
                      Statements
                    </label>
                    <p className='inline text-end mb-2 ml-auto'>
                      <span className='mr-3'>
                        <label className='inline mb-2 text-sm font-bold text-wt-primary-40 dark:text-white'>
                          Total pages:{' '}
                        </label>
                        <span className='inline mb-2 text-sm dark:text-white'>{subpoenaDetail?.totalPages || ''}</span>
                      </span>
                      <span>
                        <label className='inline mb-2 text-sm font-bold text-wt-primary-40 dark:text-white'>
                          Total months:{' '}
                        </label>
                        <span className='inline mb-2 text-sm dark:text-white'>{subpoenaDetail?.totalMonths || ''}</span>
                      </span>
                    </p>
                  </div>
                  <div className='overflow-hidden p-4 bg-gray-100'>
                    <div className='overflow-auto min-w-full'>
                      {isLoadingStatements ? (
                        <div className='flex items-center justify-center w-100 pb-5'>
                          <Spinner />
                        </div>
                      ) : (
                        <table className='table min-w-full'>
                          <thead>
                            <tr>
                              <th scope='col'>ID</th>
                              <th scope='col'>Account Number</th>
                              <th scope='col'>Account Name</th>
                              <th scope='col'>Pages</th>
                              <th scope='col'>Date From</th>
                              <th scope='col'>Date To</th>
                              <th scope='col'>Created Date</th>
                            </tr>
                          </thead>
                          <tbody className='bg-transparent rounded-b-lg divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700'>
                            {statements &&
                              statements.map((item: Subpoena.Statement, index) => (
                                <tr key={index} className='bg-white hover:bg-wt-primary-85'>
                                  <td className='px-4 py-2 text-base font-medium text-gray-900 whitespace-nowrap'>
                                    {item._id}
                                  </td>
                                  <td className='px-4 py-2 text-base font-medium text-gray-900 whitespace-nowrap'>
                                    {item.accountNumber}
                                  </td>
                                  <td className='px-4 py-2 text-base font-medium text-gray-900 whitespace-nowrap'>
                                    {item.accountName}
                                  </td>
                                  <td className='px-4 py-2 text-base font-medium text-gray-900 whitespace-nowrap'>
                                    {item.pages.split(',').length}
                                  </td>
                                  <td className='px-4 py-2 text-base font-medium text-gray-900 whitespace-nowrap'>
                                    {item.dateFrom}
                                  </td>
                                  <td className='px-4 py-2 text-base font-medium text-gray-900 whitespace-nowrap'>
                                    {item.dateTo}
                                  </td>
                                  <td className='px-4 py-2 text-base font-medium text-gray-900 whitespace-nowrap'>
                                    {item.createdAt}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                    <div className='w-full flex bg-white rounded-b-lg p-4 border-t border-gray-200'>
                      {statements.length != 0 && (
                        <span className='text-wt-primary-40 text-xs font-semibold mr-auto'>
                          Show results from {(pageInfor?.page - 1) * 10 + 1} to{' '}
                          {(pageInfor?.page - 1) * 10 + statements.length} in total of {pageInfor?.totalItems || ''}{' '}
                          items
                        </span>
                      )}
                      <ReactPaginate
                        key='subpoenaPagination'
                        breakLabel='...'
                        nextLabel='>'
                        onPageChange={(data: any) => {
                          loadStatements(Number(data?.selected + 1))
                        }}
                        forcePage={pageInfor ? pageInfor.page - 1 : -1}
                        pageCount={pageInfor?.totalPage || 0}
                        previousLabel='<'
                        renderOnZeroPageCount={null}
                        className='pagination'
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </Modal.Body>
        <div className='p-2 py-3'></div>
      </Modal>
    </>
  )
})

export default SubpoenaDetailModal
