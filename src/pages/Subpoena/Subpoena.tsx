import './style.css'

import AuthHelper from 'constant/AuthHelper'
import Message from 'constant/Message'
import { useSubpoena } from 'hooks'
import moment from 'moment'
import { useEffect, useRef, useState } from 'react'
import { HiArchive, HiOutlineEye, HiOutlineReply, HiPencil, HiPencilAlt, HiTrash } from 'react-icons/hi'
import ReactPaginate from 'react-paginate'
import { toast } from 'react-toastify'
import { Button, IconSvg, Spinner } from 'ui-atoms'
import { WTPasswordTabIcon, WTUploadNewFile, WtFileOutline, WtSearchIcon } from 'ui-atoms/Icons'
import { SubpoenaDetailModal, SubpoenaEditUploadModal, SubpoenaNewUploadModal, AlertModal } from 'ui-molecules'
import { getUserScopeInfo } from 'utils'
import { ToastControl } from 'utils/toast'

function Subpoena() {
  const pageInforDefault = {
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPage: 0
  }
  const newUploadModalRef: any = useRef(null)
  const detailModalRef: any = useRef(null)
  const editModalRef: any = useRef(null)
  const alertModalRef: any = useRef(null)
  const subpoenaHook = useSubpoena()
  const [files, setFiles] = useState<Subpoena.Details[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [pageInfor, setPageInfor] = useState<App.PageInfor>(pageInforDefault)
  const [keySearch, setKeySearch] = useState('')
  const [role, setRole] = useState<any>('')
  const [activeTab, setActiveTab] = useState<number>(0)
  const [isArchived, setArchived] = useState(false)

  useEffect(() => {
    const userScope: Auth.ScopeInfo = getUserScopeInfo()

    setRole(userScope?.role || '')
    loadData()
    return () => {
      //
    }
  }, [])

  useEffect(() => {
    loadData(1)
  }, [activeTab])

  const switchTab = (tabId: number): void => {
    setActiveTab(tabId)
    if (tabId === 1) {
      setArchived(true)
    } else {
      setArchived(false)
    }
  }

  const onChangeKeySearch = (e: any) => {
    setKeySearch(e.target.value)
  }

  const submitSearch = (e: any) => {
    e.preventDefault()
    loadData(1)
  }

  const loadData = (page = 1) => {
    setPageInfor((current: any) => {
      return {
        ...current,
        page: page
      }
    })
    const params: Subpoena.ListParams = {
      page: page,
      limit: 10,
      key: keySearch || '',
      status: '',
      archived: isArchived || undefined
    }
    requestGetSubpoenaList(params)
  }

  const requestGetSubpoenaList = async (params: Subpoena.ListParams): Promise<void> => {
    setIsLoading(true)
    subpoenaHook.getSubpoenaList({
      params: params,
      callback: {
        onSuccess: (res) => {
          setPageInfor((current) => {
            return {
              ...current,
              ...res?.pageInfo
            }
          })
          setFiles(
            res?.items?.map((item: Subpoena.Details) => {
              return {
                ...item,
                createdAt: moment(new Date(item.createdAt)).format('MM/DD/YYYY H:mm:ss')
              }
            }) || []
          )
          setIsLoading(false)
        },
        onFailure: () => {
          setIsLoading(false)
        },
        onFinish: () => {
          //
        }
      }
    })
  }

  const openDetailModal = (id: string) => {
    detailModalRef?.current.openPopup({ _id: id })
  }

  const openEditModal = (id: string) => {
    editModalRef?.current.openPopup({ _id: id })
  }

  const removeRecord = (id: string) => {
    alertModalRef?.current.open({
      title: 'Warning',
      content: 'Are you sure you want to delete this record?',
      isShowTwoButton: true,
      confirmButton: {
        label: 'Yes, do it',
        action: () => {
          requestDeleteSubpoena(id)
        }
      }
    })
  }

  const requestDeleteSubpoena = (_id: string) => {
    subpoenaHook.deleteSubpoena({
      _id: _id,
      callback: {
        onSuccess: () => {
          ToastControl.showSuccessMessage('You have successfully deleted')
          loadData()
        },
        onFailure: (err) => {
          ToastControl.showErrorMessage(err?.message || Message.DEFAULT_ERR_MSG)
        }
      }
    })
  }

  const archiveRecord = (id: string) => {
    alertModalRef?.current.open({
      title: 'Warning',
      content: 'Are you sure you want to archive this record?',
      isShowTwoButton: true,
      confirmButton: {
        label: 'Yes, do it',
        action: () => {
          requestArchiveRecord(id)
        }
      }
    })
  }

  const requestArchiveRecord = (_id: string) => {
    subpoenaHook.archiveDocument({
      _id: _id,
      callback: {
        onSuccess: () => {
          ToastControl.showSuccessMessage('You have successfully archived')
          loadData()
        },
        onFailure: (err) => {
          ToastControl.showErrorMessage(err?.message || Message.DEFAULT_ERR_MSG)
        }
      }
    })
  }

  const restoreRecord = (id: string) => {
    alertModalRef?.current.open({
      title: 'Warning',
      content: 'Are you sure you want to restore this record?',
      isShowTwoButton: true,
      confirmButton: {
        label: 'Yes, do it',
        action: () => {
          requestRestoreRecord(id)
        }
      }
    })
  }

  const requestRestoreRecord = (_id: string) => {
    subpoenaHook.restoreDocument({
      _id: _id,
      callback: {
        onSuccess: () => {
          ToastControl.showSuccessMessage('You have successfully restored')
          loadData()
        },
        onFailure: (err) => {
          ToastControl.showErrorMessage(err?.message || Message.DEFAULT_ERR_MSG)
        }
      }
    })
  }

  const openNewUploadPopup = () => {
    newUploadModalRef?.current.openPopup()
  }

  const uploadedEventListener = () => {
    loadData()
  }

  return (
    <>
      <div className='p-4 pt-0 px-6 block sm:flex items-center justify-between lg:mt-1.5 dark:bg-gray-800'>
        <div className='p-4 flex flex-col md:flex-row w-full items-center bg-white rounded-lg dark:bg-gray-700'>
          <div className='flex-1 w-full'>
            <h1 className='text-xl font-bold text-gray-900 sm:text-2xl dark:text-white mb-2'>Subpoena List</h1>
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
                      Subpoena List
                    </a>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
          <div className='mb-1 w-full sm:w-auto'>
            <div className='items-center justify-end block sm:flex md:divide-x md:divide-gray-100 dark:divide-gray-700'>
              <div className='flex items-center justify-end mb-4 sm:mb-0'>
                <form className='sm:pr-3' onSubmit={submitSearch}>
                  <label htmlFor='products-search' className='sr-only'>
                    Search
                  </label>
                  <div className='relative lg:w-96'>
                    <input
                      type='text'
                      name='keySearch'
                      id='keySearch'
                      className='block w-full px-3 py-3 text-sm placeholder:text-sm text-wt-primary-40 bg-gray-100 border border-white text-gray-900 rounded-full focus:ring-blue-500 focus:border-blue-500'
                      placeholder='Search by name...'
                      onChange={onChangeKeySearch}
                    />
                    <div className='absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none'>
                      <WtSearchIcon className='w-4 h-4 text-wt-primary-40' />
                    </div>
                  </div>
                </form>
              </div>
              {role != AuthHelper.RoleType.TECH_OWNER ? (
                <button
                  id='uploadFile'
                  className='btn bg-wt-orange-1 px-3 text-white rounded-lg flex items-center ml-auto sm:ml-0'
                  type='button'
                  onClick={() => openNewUploadPopup()}
                >
                  <WTUploadNewFile className='h-5 w-5' />
                  <span className='ml-2'>New upload</span>
                </button>
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
      </div>

      <div className='px-6 flex flex-col dark:bg-gray-800'>
        <div className='tabs-tb bg-white rounded-lg'>
          <div className='tabs-nav'>
            <div
              className={['tabs-nav-item', activeTab == 0 ? 'active' : ''].filter(Boolean).join(' ')}
              onClick={() => {
                switchTab(0)
              }}
            >
              {/* <WTPasswordTabIcon className='icon mr-2' /> */}
              <span className='font-bold'>All</span>
            </div>
            <div
              className={['tabs-nav-item', activeTab == 1 ? 'active' : ''].filter(Boolean).join(' ')}
              onClick={() => {
                switchTab(1)
              }}
            >
              {/* <WTPasswordTabIcon className='icon mr-2' /> */}
              <span className='font-bold'>Archived</span>
            </div>
          </div>
        </div>
      </div>

      <div className='px-6 flex flex-col dark:bg-gray-800'>
        <div className='overflow-x-auto'>
          <div className='inline-block min-w-full align-middle'>
            {isLoading ? (
              <div className='flex items-center justify-center w-100 my-2'>
                <Spinner />
              </div>
            ) : (
              <div className='overflow-hidden shadow'>
                <table className='table min-w-full'>
                  <thead>
                    <tr>
                      <th scope='col'>ID</th>
                      <th scope='col'>File Name</th>
                      <th scope='col'>Created Date</th>
                      <th scope='col' style={{ width: '200px' }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200 dark:bg-gray-700 dark:divide-gray-700'>
                    {files &&
                      files.map((item, index) => (
                        <tr key={index} className='bg-white hover:bg-wt-primary-85'>
                          <td className='px-4 py-2 text-base font-medium text-gray-900 whitespace-nowrap'>
                            {item._id}
                          </td>
                          <td className='px-4 py-2 text-base font-medium text-gray-900 whitespace-nowrap'>
                            <a
                              className='flex items-center text-blue-400 underline cursor-pointer'
                              onClick={() => {
                                openDetailModal(item._id)
                              }}
                            >
                              <WtFileOutline className='mr-2' />
                              {item.originalName}
                            </a>
                          </td>
                          <td className='px-4 py-2 text-base font-medium text-gray-900 whitespace-nowrap'>
                            {item.createdAt}
                          </td>
                          <td className='px-4 py-2'>
                            <div className='flex space-x-3 whitespace-nowrap'>
                              <a
                                className='flex items-center text-sm font-bold text-blue-500 cursor-pointer'
                                onClick={() => {
                                  openDetailModal(item._id)
                                }}
                              >
                                <HiOutlineEye className='w-5 h-5 mr-1' /> View details
                              </a>
                              <div className='border-space h-6'></div>
                              <a
                                className='flex items-center text-sm font-bold text-blue-500 cursor-pointer'
                                onClick={() => {
                                  openEditModal(item._id)
                                }}
                              >
                                <HiPencilAlt className='w-5 h-5 mr-1' /> Edit
                              </a>
                              <div className='border-space h-6'></div>
                              {isArchived === true ? (
                                <a
                                  className='flex items-center text-sm font-bold text-blue-500 cursor-pointer'
                                  onClick={() => {
                                    restoreRecord(item._id)
                                  }}
                                >
                                  <HiOutlineReply className='w-5 h-5 mr-1' /> Restore
                                </a>
                              ) : (
                                <a
                                  className='flex items-center text-sm font-bold text-blue-500 cursor-pointer'
                                  onClick={() => {
                                    archiveRecord(item._id)
                                  }}
                                >
                                  <HiArchive className='w-5 h-5 mr-1' /> Archive
                                </a>
                              )}
                              <div className='border-space h-6'></div>
                              <a
                                className='flex items-center text-sm font-bold text-red-500 cursor-pointer'
                                onClick={() => {
                                  removeRecord(item._id)
                                }}
                              >
                                <HiTrash className='w-5 h-5 mr-1' /> Remove
                              </a>
                              {/* <a className='flex items-center text-sm font-bold text-blue-500'>
                              <WtDocumentDownload className='w-5 h-5 mr-1' /> Download
                            </a> */}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                <div className='w-full flex bg-white rounded-b-lg p-4 border-t border-gray-200'>
                  {files.length != 0 && (
                    <span className='text-wt-primary-40 text-xs font-semibold mr-auto'>
                      Show results from {(pageInfor?.page - 1) * 10 + 1} to {(pageInfor?.page - 1) * 10 + files.length}{' '}
                      in total of {pageInfor?.totalItems || ''} items
                    </span>
                  )}
                  <ReactPaginate
                    key='subpoenaPagination'
                    breakLabel='...'
                    nextLabel='>'
                    onPageChange={(data: any) => {
                      loadData(Number(data?.selected + 1))
                    }}
                    forcePage={pageInfor ? pageInfor.page - 1 : -1}
                    pageCount={pageInfor?.totalPage || 0}
                    previousLabel='<'
                    renderOnZeroPageCount={null}
                    className='pagination'
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <SubpoenaNewUploadModal ref={newUploadModalRef} onSaved={uploadedEventListener} />
      <SubpoenaDetailModal ref={detailModalRef} />
      <SubpoenaEditUploadModal ref={editModalRef} onUpdated={loadData} />
      <AlertModal ref={alertModalRef} />
    </>
  )
}

export default Subpoena
