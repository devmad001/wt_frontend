import { Button, IconSvg, Spinner } from 'ui-atoms'
import './style.css'
import { Link } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { formatDate, getUserScopeInfo } from 'utils'
import { FaChevronUp, FaChevronDown } from 'react-icons/fa'
import { Role, UserStatus } from 'constant'
import { AcceptModal, ActivityCodeModal, AddAccountModal, EditAccountModal, RejectModal } from 'ui-molecules'
import ReactPaginate from 'react-paginate'
import { useUserManagement } from 'hooks'
import { ToastControl } from 'utils/toast'
import AuthHelper from 'constant/AuthHelper'

const VIEW_TYPE = {
  USER: 'user',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin'
}

const userTableHeader = [
  {
    id: 0,
    label: 'Name',
    isSort: true
  },
  {
    id: 1,
    label: 'Email',
    isSort: true
  },
  {
    id: 2,
    label: 'Phone Number',
    isSort: false
  },
  {
    id: 3,
    label: 'Status',
    isSort: true
  },
  {
    id: 4,
    label: 'Agency',
    isSort: true
  },
  {
    id: 5,
    label: 'Field Office',
    isSort: true
  },
  {
    id: 6,
    label: 'Squad',
    isSort: true
  },
  {
    id: 7,
    label: 'Date Created',
    isSort: true
  },
  { id: 8, label: 'Date Updated', isSort: true },
  { id: 9, label: '', isSort: false }
]

const adminTableHeader = [
  {
    id: 0,
    label: 'Name',
    isSort: true
  },
  {
    id: 1,
    label: 'Email',
    isSort: true
  },
  {
    id: 2,
    label: 'Phone Number',
    isSort: false
  },
  {
    id: 3,
    label: 'Status',
    isSort: true
  },
  {
    id: 4,
    label: 'Agency',
    isSort: true
  },
  {
    id: 5,
    label: 'Field Office',
    isSort: true
  },
  {
    id: 6,
    label: 'Date Created',
    isSort: true
  },
  { id: 7, label: 'Date Updated', isSort: true },
  { id: 8, label: '', isSort: false }
]

const superAdminTableHeader = [
  {
    id: 0,
    label: 'Name',
    isSort: true
  },
  {
    id: 1,
    label: 'Agency name',
    isSort: true
  },
  {
    id: 2,
    label: 'Status',
    isSort: true
  },
  { id: 3, label: '', isSort: false }
]

function UserManagement() {
  const userManagementHook = useUserManagement()
  const addAccountModal: any = useRef(null)
  const editAccountModal: any = useRef(null)
  const activityCodeModal: any = useRef(null)
  const rejectModal: any = useRef(null)
  const acceptModal: any = useRef(null)

  const [viewType, setViewType] = useState<string>()
  const [isLoading, setIsLoading] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const [currentUserPage, setCurrentUserPage] = useState(1)
  const [listUsers, setListUsers] = useState([])
  const [usersPageInfo, setUsersPageInfo] = useState<any>()

  const [currentAdminPage, setCurrentAdminPage] = useState(1)
  const [listAdmins, setListAdmins] = useState([])
  const [adminsPageInfo, setAdminsPageInfo] = useState<any>()

  const [currentSuperAdminPage, setCurrentSuperAdminPage] = useState(1)
  const [listSuperAdmins, setListSuperAdmins] = useState([])
  const [superAdminsPageInfo, setSuperAdminsPageInfo] = useState<any>()

  const role = getUserScopeInfo()?.role

  useEffect(() => {
    if (role == AuthHelper.RoleType.ADMIN) {
      setViewType(VIEW_TYPE.USER)
    } else if (role == AuthHelper.RoleType.SUPER_ADMIN) {
      setViewType(VIEW_TYPE.USER)
    } else if (role == AuthHelper.RoleType.TECH_OWNER) {
      setViewType(VIEW_TYPE.USER)
    }
  }, [])

  useEffect(() => {
    if (role == AuthHelper.RoleType.ADMIN || role == AuthHelper.RoleType.SUPER_ADMIN) {
      loadUserData(currentUserPage)
    }
  }, [currentUserPage])

  useEffect(() => {
    if (role == AuthHelper.RoleType.SUPER_ADMIN) {
      loadAdminData(currentAdminPage)
    }
  }, [currentAdminPage])

  useEffect(() => {
    if (role == AuthHelper.RoleType.TECH_OWNER) {
      loadSuperAdminData(currentSuperAdminPage)
    }
  }, [currentSuperAdminPage])

  useEffect(() => {
    setSearchValue('')
    search('')
  }, [viewType])

  const loadUserData = (page = 1, value = searchValue) => {
    const params: User.GetUsersParams = {
      key: value,
      page: page,
      limit: 10,
      role: Role.USER
    }

    requestGetUsersList(params)
  }

  const loadAdminData = (page = 1, value = searchValue) => {
    const params: User.GetUsersParams = {
      key: value,
      page: page,
      limit: 10,
      role: Role.ADMIN
    }

    requestGetUsersList(params)
  }

  const loadSuperAdminData = (page = 1, value = searchValue) => {
    const params: User.GetUsersParams = {
      key: value,
      page: page,
      limit: 10,
      role: Role.SUPER_ADMIN
    }

    requestGetUsersList(params)
  }

  const search = (value = searchValue) => {
    if (viewType == VIEW_TYPE.USER) {
      loadUserData(currentUserPage, value)
    } else if (viewType == VIEW_TYPE.ADMIN) {
      loadAdminData(currentAdminPage, value)
    } else if (viewType == VIEW_TYPE.SUPER_ADMIN) {
      loadSuperAdminData(currentSuperAdminPage, value)
    }
  }

  const requestGetUsersList = async (params: User.GetUsersParams): Promise<void> => {
    setIsLoading(true)
    userManagementHook.getUsersList({
      params: params,
      callback: {
        onSuccess: (res) => {
          if (params.role == Role.USER) {
            setUsersPageInfo(res?.pageInfo)
            setListUsers(res?.items)
          } else if (params.role == Role.ADMIN) {
            setListAdmins(res?.items)
            setAdminsPageInfo(res?.pageInfo)
          } else {
            setListSuperAdmins(res?.items)
            setSuperAdminsPageInfo(res?.pageInfo)
          }
          setIsLoading(false)
        },
        onFailure: (err) => {
          ToastControl.showErrorMessage(err)
          setIsLoading(false)
        },
        onFinish: () => {
          //
        }
      }
    })
  }

  const toggleAddModal = () => {
    addAccountModal.current.showModal()
  }

  const toggleEditModal = (id: string) => {
    editAccountModal.current.setUserId(id)
    editAccountModal.current.showModal()
  }

  const toggleRejectModal = (item: any) => {
    rejectModal.current.setUserDetail(item)
    rejectModal.current.showModal()
  }

  const toggleAcceptModal = (item: any) => {
    acceptModal.current.setUserDetail(item)
    acceptModal.current.showModal()
  }

  const toggleActivityCodeModal = () => {
    activityCodeModal.current.showModal()
  }

  const renderTab = () => {
    if (role == AuthHelper.RoleType.ADMIN) {
      return (
        <span
          className={['viewType_btn mr-auto', viewType == VIEW_TYPE.USER ? 'active' : ''].filter(Boolean).join(' ')}
          onClick={() => {
            setViewType(VIEW_TYPE.USER)
          }}
        >
          <IconSvg icon='userCircleIcon' />
          <p>User</p>
        </span>
      )
    } else if (role == AuthHelper.RoleType.SUPER_ADMIN) {
      return (
        <>
          <span
            className={['viewType_btn', viewType == VIEW_TYPE.USER ? 'active' : ''].filter(Boolean).join(' ')}
            onClick={() => {
              setViewType(VIEW_TYPE.USER)
            }}
          >
            <IconSvg icon='userCircleIcon' />
            <p>User</p>
          </span>
          <span
            className={['viewType_btn ml-5 mr-auto', viewType == VIEW_TYPE.ADMIN ? 'active' : '']
              .filter(Boolean)
              .join(' ')}
            onClick={() => {
              setViewType(VIEW_TYPE.ADMIN)
            }}
          >
            <IconSvg icon='adminIcon' />
            <p>Admin</p>
          </span>
        </>
      )
    } else if (role == AuthHelper.RoleType.TECH_OWNER) {
      return (
        <>
          <span
            className={['viewType_btn', viewType == VIEW_TYPE.USER ? 'active' : ''].filter(Boolean).join(' ')}
            onClick={() => {
              setViewType(VIEW_TYPE.USER)
            }}
          >
            <IconSvg icon='userCircleIcon' />
            <p>User</p>
          </span>
          <span
            className={['viewType_btn ml-5', viewType == VIEW_TYPE.ADMIN ? 'active' : ''].filter(Boolean).join(' ')}
            onClick={() => {
              setViewType(VIEW_TYPE.ADMIN)
            }}
          >
            <IconSvg icon='adminIcon' />
            <p>Admin</p>
          </span>
          <span
            className={['viewType_btn ml-5 mr-auto', viewType == VIEW_TYPE.SUPER_ADMIN ? 'active' : '']
              .filter(Boolean)
              .join(' ')}
            onClick={() => {
              setViewType(VIEW_TYPE.SUPER_ADMIN)
            }}
          >
            <IconSvg icon='starIcon' />
            <p>Super Admin</p>
          </span>
        </>
      )
    }
  }

  return (
    <>
      <div className='flex flex-col px-4 pb-4 user-management overflow-y-auto'>
        <div className='bg-white flex flex-wrap items-center px-4 py-3 rounded-lg'>
          <div className='mr-auto'>
            <p className='text-wt-primary-120 font-bold text-2xl mb-2'>User Management</p>
            <nav className='flex' aria-label='Breadcrumb'>
              <ol className='inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse'>
                <li className='inline-flex items-center'>
                  <Link
                    to='#'
                    className='inline-flex items-center text-xs font-medium text-wt-primary-40 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white'
                  >
                    <IconSvg icon='homeIcon' />
                    <span className='ml-1'>Home</span>
                  </Link>
                </li>
                <li>
                  <div className='flex items-center'>
                    <span className='text-xs font-medium text-wt-primary-40 dark:text-gray-400 mr-1'>/</span>
                    <Link
                      to='#'
                      className='inline-flex items-center text-xs font-medium text-wt-primary-120 dark:text-gray-400 dark:hover:text-white'
                    >
                      User Management
                    </Link>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
          {(role == AuthHelper.RoleType.SUPER_ADMIN || role == AuthHelper.RoleType.TECH_OWNER) && (
            <div>
              <Button
                className='text-white text-sm font-bold px-4 py-2 bg-wt-orange-1 hover:bg-wt-orange-1/75 rounded-md flex items-center my-2.5 mr-2.5'
                type='button'
                onClick={() => toggleActivityCodeModal()}
              >
                <IconSvg icon='activityCode' />
                <span className='ml-2'>Activity code</span>
              </Button>
            </div>
          )}
          {(role == AuthHelper.RoleType.SUPER_ADMIN ||
            role == AuthHelper.RoleType.ADMIN ||
            role == AuthHelper.RoleType.TECH_OWNER) && (
            <div>
              <Button
                className='text-white text-sm font-bold px-4 py-2 bg-wt-primary-115 hover:bg-wt-primary-115/75 rounded-md flex items-center my-2.5 '
                type='button'
                onClick={() => toggleAddModal()}
              >
                <IconSvg icon='addProfile' />
                <span className='ml-2'>Add Account</span>
              </Button>
            </div>
          )}
        </div>
        <div className='bg-white rounded-lg mt-4'>
          <div className='rounded-t-lg bg-white flex flex-wrap items-stretch px-4 border-b border-wt-primary-125'>
            {renderTab()}
            <form className='py-3'>
              <div className='relative'>
                <input
                  type='text'
                  name='search'
                  id='header-search'
                  className='bg-wt-primary-110 border border-wt-primary-125 text-wt-primary-120 text-sm font-normal rounded-3xl focus:ring-primary-500 focus:border-primary-500 block w-full pr-10 p-2 pl-3.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-wt-primary-40 dark:text-gray-200 dark:focus:ring-primary-500 dark:focus:border-primary-500 min-w-[300px]'
                  placeholder='Search by name...'
                  value={searchValue}
                  onChange={(e: any) => setSearchValue(e.target?.value)}
                />
                <div
                  className='absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer'
                  onClick={() => search()}
                >
                  <IconSvg icon='searchIcon' />
                </div>
              </div>
            </form>
          </div>
          {viewType == VIEW_TYPE.USER ? (
            <div className='rounded-b-lg w-full'>
              {isLoading ? (
                <div className='flex items-center justify-center w-100 py-3'>
                  <Spinner />
                </div>
              ) : (
                <>
                  <div className='relative overflow-x-auto table-scroll bg-white'>
                    <table className='w-full'>
                      <thead className='dark:bg-gray-700'>
                        <tr className='border-b border-[#BDC9E2]'>
                          {userTableHeader.map((item) => {
                            return (
                              <th
                                scope='col'
                                className='px-4 py-3 text-xs font-bold text-left leading-5 text-wt-primary-40'
                                key={item?.id}
                              >
                                <div className='flex items-center'>
                                  {item.label}
                                  {item.isSort && (
                                    <span className='flex flex-col items-center justify-center ml-2.5'>
                                      <FaChevronUp className='cursor-pointer' />
                                      <FaChevronDown className='cursor-pointer' />
                                    </span>
                                  )}
                                </div>
                              </th>
                            )
                          })}
                        </tr>
                      </thead>
                      <tbody className='divide-y divide-wt-primary-125 dark:bg-gray-800 dark:divide-gray-700'>
                        {listUsers.map((item: any) => {
                          return (
                            <tr key={item?._id} className='hover:bg-wt-primary-85 cursor-pointer'>
                              <td className='p-4 text-wt-primary-120 text-sm font-semibold max-w-[200px] truncate'>
                                {item?.fullName || ''}
                              </td>
                              <td className='p-4 text-wt-primary-120 text-sm font-normal max-w-[200px] truncate'>
                                {item?.email || ''}
                              </td>
                              <td className='p-4 text-wt-primary-120 text-sm font-normal min-w-[150px]'>
                                {item?.phone || ''}
                              </td>
                              <td className='p-4 min-w-[120px]'>
                                <div className='flex items-center space-x-1.5 text-sm font-semibold'>
                                  {item?.reviewStatus == AuthHelper.ReviewType.ACCEPTED ? (
                                    <>
                                      <span
                                        className='w-1.5 h-1.5 rounded-full bg-wt-primary-115
                            '
                                      ></span>
                                      <span className='text-wt-primary-115'>Accepted</span>
                                    </>
                                  ) : item?.reviewStatus == AuthHelper.ReviewType.REJECTED ? (
                                    <>
                                      <span className='w-1.5 h-1.5 rounded-full bg-wt-red-1'></span>
                                      <span className='text-wt-red-1'>Rejected</span>
                                    </>
                                  ) : item?.reviewStatus == AuthHelper.ReviewType.IN_PROGRESS ? (
                                    <>
                                      <span className='w-1.5 h-1.5 rounded-full bg-wt-primary-75'></span>
                                      <span className='text-wt-primary-75'>In progress</span>
                                    </>
                                  ) : (
                                    <></>
                                  )}
                                </div>
                              </td>
                              <td className='p-4 text-wt-primary-120 text-sm font-normal max-w-[250px] truncate'>
                                {item?.agency?.name || ''}
                              </td>
                              <td className='p-4 text-wt-primary-120 text-sm font-normal min-w-[150px]'>
                                {item?.fieldOffice?.name || ''}
                              </td>
                              <td className='p-4 text-wt-primary-120 text-sm font-normal min-w-[150px]'>
                                {item?.squad?.name || ''}
                              </td>
                              <td className='p-4 text-wt-primary-120 text-sm font-normal min-w-[150px]'>
                                {formatDate(item?.createdAt, 'MMM D, YYYY')}
                              </td>
                              <td className='p-4 text-wt-primary-120 text-sm font-normal min-w-[150px]'>
                                {formatDate(item?.updatedAt, 'MMM D, YYYY')}
                              </td>
                              <td>
                                <div className='flex items-center justify-end'>
                                  <div
                                    className='flex items-center space-x-1 cursor-pointer text-wt-primary-75 text-xs font-bold p-4 edit'
                                    onClick={() => toggleEditModal(item?._id)}
                                  >
                                    <IconSvg icon='userEdit' />
                                    <span>Edit</span>
                                  </div>
                                  {(item?.reviewStatus == AuthHelper.ReviewType.REJECTED ||
                                    item?.reviewStatus == AuthHelper.ReviewType.IN_PROGRESS) && (
                                    <div
                                      className='flex items-center space-x-1 cursor-pointer  text-wt-primary-75 text-xs font-bold p-4 border-r border-wt-primary-125 edit'
                                      onClick={() => toggleAcceptModal(item)}
                                    >
                                      <IconSvg icon='tickSquare' />
                                      <span>Accept</span>
                                    </div>
                                  )}
                                  {(item?.reviewStatus == AuthHelper.ReviewType.ACCEPTED ||
                                    item?.reviewStatus == AuthHelper.ReviewType.IN_PROGRESS) && (
                                    <div
                                      className='flex items-center space-x-1 cursor-pointer text-wt-primary-75 text-xs font-bold p-4 delete'
                                      onClick={() => toggleRejectModal(item)}
                                    >
                                      <IconSvg icon='closeSquare' />
                                      <span>Reject</span>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className='rounded-b-lg w-full border-t border-[#BDC9E2] px-4 py-2.5 flex flex-wrap items-center bg-white'>
                    {listUsers.length != 0 && (
                      <span className='text-wt-primary-40 text-xs font-semibold mr-auto'>
                        Show results from {(usersPageInfo?.page - 1) * 10 + 1} to{' '}
                        {(usersPageInfo?.page - 1) * 10 + listUsers.length} in total of{' '}
                        {usersPageInfo?.totalItems || ''} items
                      </span>
                    )}
                    <ReactPaginate
                      key='userPagination'
                      breakLabel='...'
                      nextLabel='>'
                      onPageChange={(data: any) => {
                        setCurrentUserPage(Number(data?.selected + 1))
                      }}
                      forcePage={usersPageInfo ? usersPageInfo.page - 1 : -1}
                      pageCount={usersPageInfo?.totalPage || 0}
                      previousLabel='<'
                      renderOnZeroPageCount={null}
                      className='pagination'
                    />
                  </div>
                </>
              )}
            </div>
          ) : viewType == VIEW_TYPE.ADMIN ? (
            <div className='rounded-b-lg w-full'>
              {isLoading ? (
                <div className='flex items-center justify-center w-100 py-3'>
                  <Spinner />
                </div>
              ) : (
                <>
                  <div className='relative overflow-x-auto table-scroll bg-white'>
                    <table className='w-full'>
                      <thead className='dark:bg-gray-700'>
                        <tr className='border-b border-[#BDC9E2]'>
                          {adminTableHeader.map((item) => {
                            return (
                              <th
                                scope='col'
                                className='px-4 py-3 text-xs font-bold text-left leading-5 text-wt-primary-40'
                                key={item?.id}
                              >
                                <div className='flex items-center'>
                                  {item.label}
                                  {item.isSort && (
                                    <span className='flex flex-col items-center justify-center ml-2.5'>
                                      <FaChevronUp className='cursor-pointer' />
                                      <FaChevronDown className='cursor-pointer' />
                                    </span>
                                  )}
                                </div>
                              </th>
                            )
                          })}
                        </tr>
                      </thead>
                      <tbody className='divide-y divide-wt-primary-125 dark:bg-gray-800 dark:divide-gray-700'>
                        {listAdmins.map((item: any) => {
                          return (
                            <tr key={item?._id} className='hover:bg-wt-primary-85 cursor-pointer'>
                              <td className='p-4 text-wt-primary-120 text-sm font-semibold max-w-[200px] truncate'>
                                {item?.fullName || ''}
                              </td>
                              <td className='p-4 text-wt-primary-120 text-sm font-normal max-w-[200px] truncate'>
                                {item?.email || ''}
                              </td>
                              <td className='p-4 text-wt-primary-120 text-sm font-normal min-w-[150px]'>
                                {item?.phone || ''}
                              </td>
                              <td className='p-4 min-w-[120px]'>
                                <div className='flex items-center space-x-1.5 text-sm font-semibold'>
                                  {item?.reviewStatus == AuthHelper.ReviewType.ACCEPTED ? (
                                    <>
                                      <span
                                        className='w-1.5 h-1.5 rounded-full bg-wt-primary-115
                            '
                                      ></span>
                                      <span className='text-wt-primary-115'>Accepted</span>
                                    </>
                                  ) : item?.reviewStatus == AuthHelper.ReviewType.REJECTED ? (
                                    <>
                                      <span className='w-1.5 h-1.5 rounded-full bg-wt-red-1'></span>
                                      <span className='text-wt-red-1'>Rejected</span>
                                    </>
                                  ) : item?.reviewStatus == AuthHelper.ReviewType.IN_PROGRESS ? (
                                    <>
                                      <span className='w-1.5 h-1.5 rounded-full bg-wt-primary-75'></span>
                                      <span className='text-wt-primary-75'>In progress</span>
                                    </>
                                  ) : (
                                    <></>
                                  )}
                                </div>
                              </td>
                              <td className='p-4 text-wt-primary-120 text-sm font-normal max-w-[250px] truncate'>
                                {item?.agency?.name || ''}
                              </td>
                              <td className='p-4 text-wt-primary-120 text-sm font-normal min-w-[150px]'>
                                {item?.fieldOffice?.name || ''}
                              </td>
                              <td className='p-4 text-wt-primary-120 text-sm font-normal min-w-[150px]'>
                                {formatDate(item?.createdAt, 'MMM D, YYYY')}
                              </td>
                              <td className='p-4 text-wt-primary-120 text-sm font-normal min-w-[150px]'>
                                {formatDate(item?.updatedAt, 'MMM D, YYYY')}
                              </td>
                              <td>
                                <div className='flex items-center justify-end'>
                                  <div
                                    className='flex items-center space-x-1 cursor-pointer text-wt-primary-75 text-xs font-bold p-4 edit'
                                    onClick={() => toggleEditModal(item?._id)}
                                  >
                                    <IconSvg icon='userEdit' />
                                    <span>Edit</span>
                                  </div>
                                  {(item?.reviewStatus == AuthHelper.ReviewType.REJECTED ||
                                    item?.reviewStatus == AuthHelper.ReviewType.IN_PROGRESS) && (
                                    <div
                                      className='flex items-center space-x-1 cursor-pointer  text-wt-primary-75 text-xs font-bold p-4 border-r border-wt-primary-125 edit'
                                      onClick={() => toggleAcceptModal(item)}
                                    >
                                      <IconSvg icon='tickSquare' />
                                      <span>Accept</span>
                                    </div>
                                  )}
                                  {(item?.reviewStatus == AuthHelper.ReviewType.ACCEPTED ||
                                    item?.reviewStatus == AuthHelper.ReviewType.IN_PROGRESS) && (
                                    <div
                                      className='flex items-center space-x-1 cursor-pointer text-wt-primary-75 text-xs font-bold p-4 delete'
                                      onClick={() => toggleRejectModal(item)}
                                    >
                                      <IconSvg icon='closeSquare' />
                                      <span>Reject</span>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className='rounded-b-lg w-full border-t border-[#BDC9E2] px-4 py-2.5 flex flex-wrap items-center bg-white'>
                    {listAdmins.length != 0 && (
                      <span className='text-wt-primary-40 text-xs font-semibold mr-auto'>
                        Show results from {(adminsPageInfo?.page - 1) * 10 + 1} to{' '}
                        {(adminsPageInfo?.page - 1) * 10 + listAdmins.length} in total of{' '}
                        {adminsPageInfo?.totalItems || ''} items
                      </span>
                    )}
                    <ReactPaginate
                      key='adminPagination'
                      breakLabel='...'
                      nextLabel='>'
                      onPageChange={(data: any) => {
                        setCurrentAdminPage(Number(data?.selected + 1))
                      }}
                      forcePage={adminsPageInfo ? adminsPageInfo.page - 1 : -1}
                      pageCount={adminsPageInfo?.totalPage || 0}
                      previousLabel='<'
                      renderOnZeroPageCount={null}
                      className='pagination'
                    />
                  </div>
                </>
              )}
            </div>
          ) : viewType == VIEW_TYPE.SUPER_ADMIN ? (
            <div className='rounded-b-lg w-full'>
              {isLoading ? (
                <div className='flex items-center justify-center w-100 py-3'>
                  <Spinner />
                </div>
              ) : (
                <>
                  <div className='relative overflow-x-auto table-scroll bg-white'>
                    <table className='w-full'>
                      <thead className='dark:bg-gray-700'>
                        <tr className='border-b border-[#BDC9E2]'>
                          {superAdminTableHeader.map((item) => {
                            return (
                              <th
                                scope='col'
                                className='px-4 py-3 text-xs font-bold text-left leading-5 text-wt-primary-40'
                                key={item?.id}
                              >
                                <div className='flex items-center'>
                                  {item.label}
                                  {item.isSort && (
                                    <span className='flex flex-col items-center justify-center ml-2.5'>
                                      <FaChevronUp className='cursor-pointer' />
                                      <FaChevronDown className='cursor-pointer' />
                                    </span>
                                  )}
                                </div>
                              </th>
                            )
                          })}
                        </tr>
                      </thead>
                      <tbody className='divide-y divide-wt-primary-125 dark:bg-gray-800 dark:divide-gray-700'>
                        {listSuperAdmins.map((item: any) => {
                          return (
                            <tr key={item?._id} className='hover:bg-wt-primary-85 cursor-pointer'>
                              <td className='p-4 text-wt-primary-120 text-sm font-semibold max-w-[200px] truncate'>
                                {item?.fullName || ''}
                              </td>
                              <td className='p-4 text-wt-primary-120 text-sm font-normal max-w-[250px] truncate'>
                                {item?.agency?.name || ''}
                              </td>
                              <td className='p-4'>
                                <div className='flex items-center space-x-1.5 text-sm font-semibold'>
                                  {item?.reviewStatus == AuthHelper.ReviewType.ACCEPTED ? (
                                    <>
                                      <span
                                        className='w-1.5 h-1.5 rounded-full bg-wt-primary-115
                            '
                                      ></span>
                                      <span className='text-wt-primary-115'>Accepted</span>
                                    </>
                                  ) : item?.reviewStatus == AuthHelper.ReviewType.REJECTED ? (
                                    <>
                                      <span className='w-1.5 h-1.5 rounded-full bg-wt-red-1'></span>
                                      <span className='text-wt-red-1'>Rejected</span>
                                    </>
                                  ) : item?.reviewStatus == AuthHelper.ReviewType.IN_PROGRESS ? (
                                    <>
                                      <span className='w-1.5 h-1.5 rounded-full bg-wt-primary-75'></span>
                                      <span className='text-wt-primary-75'>In progress</span>
                                    </>
                                  ) : (
                                    <></>
                                  )}
                                </div>
                              </td>
                              <td>
                                <div className='flex items-center justify-end'>
                                  {(item?.reviewStatus == AuthHelper.ReviewType.REJECTED ||
                                    item?.reviewStatus == AuthHelper.ReviewType.IN_PROGRESS) && (
                                    <div
                                      className='flex items-center space-x-1 cursor-pointer  text-wt-primary-75 text-xs font-bold p-4 border-r border-wt-primary-125 edit'
                                      onClick={() => toggleAcceptModal(item)}
                                    >
                                      <IconSvg icon='tickSquare' />
                                      <span>Accept</span>
                                    </div>
                                  )}
                                  {(item?.reviewStatus == AuthHelper.ReviewType.ACCEPTED ||
                                    item?.reviewStatus == AuthHelper.ReviewType.IN_PROGRESS) && (
                                    <div
                                      className='flex items-center space-x-1 cursor-pointer text-wt-primary-75 text-xs font-bold p-4 delete ml-auto'
                                      onClick={() => toggleRejectModal(item)}
                                    >
                                      <IconSvg icon='closeSquare' />
                                      <span>Reject</span>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className='rounded-b-lg w-full border-t border-[#BDC9E2] px-4 py-2.5 flex flex-wrap items-center bg-white'>
                    {listSuperAdmins.length != 0 && (
                      <span className='text-wt-primary-40 text-xs font-semibold mr-auto'>
                        Show results from {(superAdminsPageInfo?.page - 1) * 10 + 1} to{' '}
                        {(superAdminsPageInfo?.page - 1) * 10 + listSuperAdmins.length} in total of{' '}
                        {superAdminsPageInfo?.totalItems || ''} items
                      </span>
                    )}
                    <ReactPaginate
                      key='superAdminPagination'
                      breakLabel='...'
                      nextLabel='>'
                      onPageChange={(data: any) => {
                        setCurrentSuperAdminPage(Number(data?.selected + 1))
                      }}
                      forcePage={superAdminsPageInfo ? superAdminsPageInfo.page - 1 : -1}
                      pageCount={superAdminsPageInfo?.totalPage || 0}
                      previousLabel='<'
                      renderOnZeroPageCount={null}
                      className='pagination'
                    />
                  </div>
                </>
              )}
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
      <AddAccountModal ref={addAccountModal} reloadPage={search} />
      <EditAccountModal ref={editAccountModal} reloadPage={search} />
      <ActivityCodeModal ref={activityCodeModal} />
      <RejectModal ref={rejectModal} reloadPage={search} />
      <AcceptModal ref={acceptModal} reloadPage={search} />
    </>
  )
}

export default UserManagement
