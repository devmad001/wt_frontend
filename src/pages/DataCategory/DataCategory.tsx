import { Button, IconSvg, Spinner } from 'ui-atoms'
import './style.css'
import { Link } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { formatDate, getUserScopeInfo } from 'utils'
import { FaChevronUp, FaChevronDown } from 'react-icons/fa'
import { UserStatus } from 'constant'
import ReactPaginate from 'react-paginate'
import { Dropdown } from 'flowbite-react'
import {
  AddFieldOfficeModal,
  AddSquadModal,
  AgencyInformationModal,
  FieldOfficeInformationModal,
  SquadInformationModal,
  AlertModal
} from 'ui-molecules'
import AddAgencyModal from 'ui-molecules/AddAgencyModal'
import AuthHelper from 'constant/AuthHelper'
import { useAgency, useAuth, useFieldOffice, useSquad } from 'hooks'
import { ToastControl } from 'utils/toast'

const VIEW_TYPE = {
  AGENCY: 'AGENCY',
  FIELD_OFFICE: 'FIELD_OFFICE',
  SQUAD: 'SQUAD'
}

const agencyHeader = [
  {
    id: 0,
    label: 'No.',
    isSort: false
  },
  {
    id: 1,
    label: 'ID',
    isSort: true
  },
  {
    id: 2,
    label: 'Agency Name',
    isSort: true
  },
  {
    id: 3,
    label: 'Status',
    isSort: true
  },
  {
    id: 4,
    label: 'Created Date',
    isSort: true
  },
  { id: 5, label: 'Last Updated', isSort: true },
  { id: 6, label: '', isSort: false }
]

const fieldOfficeHeader = [
  {
    id: 0,
    label: 'No.',
    isSort: false
  },
  {
    id: 1,
    label: 'ID',
    isSort: true
  },
  {
    id: 2,
    label: 'Alpha Code',
    isSort: true
  },
  {
    id: 3,
    label: 'Field Office',
    isSort: true
  },
  {
    id: 4,
    label: 'Status',
    isSort: true
  },
  {
    id: 5,
    label: 'Created Date',
    isSort: true
  },
  { id: 6, label: 'Last Updated', isSort: true },
  { id: 7, label: '', isSort: false }
]

const squadHeader = [
  {
    id: 0,
    label: 'No.',
    isSort: false
  },
  {
    id: 1,
    label: 'ID',
    isSort: true
  },
  {
    id: 2,
    label: 'Squad',
    isSort: true
  },
  {
    id: 3,
    label: 'Status',
    isSort: true
  },
  {
    id: 4,
    label: 'Created Date',
    isSort: true
  },
  { id: 5, label: 'Last Updated', isSort: true },
  { id: 6, label: '', isSort: false }
]

const actionRoles = [AuthHelper.RoleType.TECH_OWNER, AuthHelper.RoleType.SUPER_ADMIN, AuthHelper.RoleType.ADMIN]

function DataCategory() {
  const alertModalRef: any = useRef(null)
  const auth = useAuth()
  const agencyHook = useAgency()
  const fieldOffice = useFieldOffice()
  const squad = useSquad()
  const addAgencyModal: any = useRef(null)
  const addFieldOfficeModal: any = useRef(null)
  const addSquadModal: any = useRef(null)
  const agencyInfoModal: any = useRef(null)
  const fieldOfficeInfoModal: any = useRef(null)
  const squadInfoModal: any = useRef(null)

  const [myProfile, setMyProfile] = useState<any>()
  const [viewType, setViewType] = useState<string>()
  const [isLoading, setIsLoading] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const [currentAgencyPage, setCurrentAgencyPage] = useState(1)
  const [listAgencies, setListAgencies] = useState([])
  const [agenciesPageInfo, setAgenciesPageInfo] = useState<any>()

  const [currentFieldOfficePage, setCurrentFieldOfficePage] = useState(1)
  const [listFieldOffices, setListFieldOffices] = useState([])
  const [fieldOfficesPageInfo, setFieldOfficesPageInfo] = useState<any>()

  const [currentSquadPage, setCurrentSquadPage] = useState(1)
  const [listSquads, setListSquads] = useState([])
  const [squadsPageInfo, setSquadsPageInfo] = useState<any>()

  const role = getUserScopeInfo()?.role

  useEffect(() => {
    getProfile()
    if (role == AuthHelper.RoleType.ADMIN) {
      setViewType(VIEW_TYPE.SQUAD)
    } else if (role == AuthHelper.RoleType.SUPER_ADMIN) {
      setViewType(VIEW_TYPE.FIELD_OFFICE)
    } else if (role == AuthHelper.RoleType.TECH_OWNER) {
      setViewType(VIEW_TYPE.AGENCY)
    }
  }, [])

  useEffect(() => {
    setSearchValue('')
    search('')
  }, [viewType])

  useEffect(() => {
    if (role == AuthHelper.RoleType.TECH_OWNER) {
      loadAgencies()
    }
  }, [currentAgencyPage])

  useEffect(() => {
    if (role == AuthHelper.RoleType.SUPER_ADMIN || role == AuthHelper.RoleType.TECH_OWNER) {
      loadFieldOfficesByAgency()
    }
  }, [currentFieldOfficePage])

  useEffect(() => {
    if (role !== AuthHelper.RoleType.USER) {
      loadSquad()
    }
  }, [currentSquadPage])

  useEffect(() => {
    if (myProfile) {
      search()
    }
  }, [myProfile])

  const search = (value = searchValue) => {
    if (viewType == VIEW_TYPE.AGENCY) {
      loadAgencies(currentAgencyPage, value)
    } else if (viewType == VIEW_TYPE.FIELD_OFFICE) {
      loadFieldOfficesByAgency(currentFieldOfficePage, value)
    } else if (viewType == VIEW_TYPE.SQUAD) {
      loadSquad(currentSquadPage, value)
    }
  }

  const loadAgencies = (page = 1, value = searchValue) => {
    if (!myProfile) return
    setIsLoading(true)
    const params: Agency.GetListParams = {
      key: value,
      page: page,
      limit: 10
    }

    agencyHook.getAgencies({
      params: params,
      callback: {
        onSuccess: (res) => {
          setListAgencies(res?.items)
          setAgenciesPageInfo(res?.pageInfo)
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

  const loadFieldOfficesByAgency = (page = 1, value = searchValue) => {
    if (!myProfile) return
    setIsLoading(true)
    const params: FieldOffice.GetListParams = {
      key: value,
      page: page,
      limit: 10,
      agency: role != AuthHelper.RoleType.TECH_OWNER ? myProfile?.agency?._id || null : null
    }

    fieldOffice.getFieldOfficesByAgency({
      params: params,
      callback: {
        onSuccess: (res) => {
          setListFieldOffices(res?.items)
          setFieldOfficesPageInfo(res?.pageInfo)
          setIsLoading(false)
        },
        onFailure: (err) => {
          ToastControl.showErrorMessage(err)
          setIsLoading(false)
        }
      }
    })
  }

  const loadSquad = (page = 1, value = searchValue) => {
    if (!myProfile) return
    const params: Squad.GetListParams = {
      key: value,
      page: page,
      limit: 10,
      agency: role != AuthHelper.RoleType.TECH_OWNER ? myProfile?.agency?._id || null : null,
      fieldOffice: role != AuthHelper.RoleType.TECH_OWNER ? myProfile?.fieldOffice?._id || null : null
    }
    setIsLoading(true)
    squad.getSquadByFieldOffice({
      params: params,
      callback: {
        onSuccess: (res) => {
          setListSquads(res?.items)
          setSquadsPageInfo(res?.pageInfo)
          setIsLoading(false)
        },
        onFailure: (err) => {
          ToastControl.showErrorMessage(err)
          setIsLoading(false)
        }
      }
    })
  }

  const getProfile = () => {
    auth.getMyProfile({
      callback: {
        onSuccess: (res) => {
          setMyProfile(res)
        },
        onFailure: (err) => {
          ToastControl.showErrorMessage(err)
        }
      }
    })
  }

  const toggleAddAgencyModal = () => {
    addAgencyModal.current.showModal()
  }

  const toggleAddFieldOfficeModal = () => {
    addFieldOfficeModal.current.showModal()
  }

  const toggleAddSquadModal = () => {
    addSquadModal.current.showModal()
  }

  const toggleAgencyInfoModal = (id: string) => {
    agencyInfoModal.current.setAgencyId(id)
    agencyInfoModal.current.showModal()
  }

  const toggleFieldOfficeInfoModal = (id: string) => {
    fieldOfficeInfoModal.current.setFieldOfficeId(id)
    fieldOfficeInfoModal.current.showModal()
  }

  const toggleSquadInfoModal = (id: string) => {
    squadInfoModal.current.setSquadId(id)
    squadInfoModal.current.showModal()
  }

  const renderTab = () => {
    if (role == AuthHelper.RoleType.ADMIN) {
      return (
        <>
          <span
            className={['viewType_btn mr-auto', viewType == VIEW_TYPE.SQUAD ? 'active' : ''].filter(Boolean).join(' ')}
            onClick={() => {
              setViewType(VIEW_TYPE.SQUAD)
            }}
          >
            <IconSvg icon='squad' />
            <p>Squad</p>
          </span>
        </>
      )
    } else if (role == AuthHelper.RoleType.SUPER_ADMIN) {
      return (
        <>
          <span
            className={['viewType_btn', viewType == VIEW_TYPE.FIELD_OFFICE ? 'active' : ''].filter(Boolean).join(' ')}
            onClick={() => {
              setViewType(VIEW_TYPE.FIELD_OFFICE)
            }}
          >
            <IconSvg icon='fieldOffice' />
            <p>Field Office</p>
          </span>
          <span
            className={['viewType_btn ml-5 mr-auto', viewType == VIEW_TYPE.SQUAD ? 'active' : '']
              .filter(Boolean)
              .join(' ')}
            onClick={() => {
              setViewType(VIEW_TYPE.SQUAD)
            }}
          >
            <IconSvg icon='squad' />
            <p>Squad</p>
          </span>
        </>
      )
    } else if (role == AuthHelper.RoleType.TECH_OWNER) {
      return (
        <>
          <span
            className={['viewType_btn', viewType == VIEW_TYPE.AGENCY ? 'active' : ''].filter(Boolean).join(' ')}
            onClick={() => {
              setViewType(VIEW_TYPE.AGENCY)
            }}
          >
            <IconSvg icon='agencyTab' />
            <p>Agency</p>
          </span>
          <span
            className={['viewType_btn ml-5', viewType == VIEW_TYPE.FIELD_OFFICE ? 'active' : '']
              .filter(Boolean)
              .join(' ')}
            onClick={() => {
              setViewType(VIEW_TYPE.FIELD_OFFICE)
            }}
          >
            <IconSvg icon='fieldOffice' />
            <p>Field Office</p>
          </span>
          <span
            className={['viewType_btn ml-5 mr-auto', viewType == VIEW_TYPE.SQUAD ? 'active' : '']
              .filter(Boolean)
              .join(' ')}
            onClick={() => {
              setViewType(VIEW_TYPE.SQUAD)
            }}
          >
            <IconSvg icon='squad' />
            <p>Squad</p>
          </span>
        </>
      )
    }
  }

  const deleteAgency = (id: string) => {
    alertModalRef?.current.open({
      title: 'Warning',
      content: 'Are you sure you want to delete this agency?',
      isShowTwoButton: true,
      confirmButton: {
        label: 'Yes, do it',
        action: () => {
          requestDeleteAgency(id)
        }
      }
    })
  }

  const requestDeleteAgency = (id: string) => {
    setIsLoading(true)
    agencyHook.deleteAgencyById({
      id: id,
      callback: {
        onSuccess: (res) => {
          ToastControl.showSuccessMessage('You have successfully deleteed the agency')
          search()
          setIsLoading(false)
        },
        onFailure: (err) => {
          ToastControl.showErrorMessage(err)
          setIsLoading(false)
        }
      }
    })
  }

  const deleteFieldOffice = (id: string) => {
    alertModalRef?.current.open({
      title: 'Warning',
      content: 'Are you sure you want to delete this field office?',
      isShowTwoButton: true,
      confirmButton: {
        label: 'Yes, do it',
        action: () => {
          requestDeleteFieldOffice(id)
        }
      }
    })
  }

  const requestDeleteFieldOffice = (id: string) => {
    setIsLoading(true)
    fieldOffice.deleteFieldOfficesById({
      id: id,
      callback: {
        onSuccess: (res) => {
          ToastControl.showSuccessMessage('You have successfully deleteed the field office')
          search()
          setIsLoading(false)
        },
        onFailure: (err) => {
          ToastControl.showErrorMessage(err)
          setIsLoading(false)
        }
      }
    })
  }

  const deleteSquad = (id: string) => {
    alertModalRef?.current.open({
      title: 'Warning',
      content: 'Are you sure you want to delete this squad?',
      isShowTwoButton: true,
      confirmButton: {
        label: 'Yes, do it',
        action: () => {
          requestDeleteSquad(id)
        }
      }
    })
  }

  const requestDeleteSquad = (id: string) => {
    setIsLoading(true)
    squad.deleteSquadById({
      id: id,
      callback: {
        onSuccess: (res) => {
          ToastControl.showSuccessMessage('You have successfully deleteed the squad')
          search()
          setIsLoading(false)
        },
        onFailure: (err) => {
          ToastControl.showErrorMessage(err)
          setIsLoading(false)
        }
      }
    })
  }

  return (
    <>
      <div className='flex flex-col px-4 pb-4 user-management overflow-y-auto'>
        <div className='bg-white flex flex-wrap items-center px-4 py-3 rounded-lg'>
          <div className='mr-auto'>
            <p className='text-wt-primary-120 font-bold text-2xl mb-2'>Data Category</p>
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
                      Data Category
                    </Link>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
          <div>
            {actionRoles.includes(role) && (
              <Dropdown
                label=''
                dismissOnClick={true}
                renderTrigger={() => (
                  <span>
                    <Button
                      className='text-white text-sm font-bold px-4 py-2 bg-wt-primary-115 hover:bg-wt-primary-115/75 rounded-md flex items-center my-2.5 '
                      type='button'
                      onClick={() => {}}
                    >
                      <IconSvg icon='addSquare' />
                      <span className='mx-2'>Add Data</span>
                      <IconSvg icon='chevronDown' stroke='white' />
                    </Button>
                  </span>
                )}
              >
                {role == AuthHelper.RoleType.TECH_OWNER && (
                  <Dropdown.Item onClick={toggleAddAgencyModal} className='p-0'>
                    <div className='dropdown-item'>
                      <IconSvg icon='agencyTab' />
                      <p>Agency</p>
                    </div>
                  </Dropdown.Item>
                )}
                {(role == AuthHelper.RoleType.SUPER_ADMIN || role == AuthHelper.RoleType.TECH_OWNER) && (
                  <Dropdown.Item onClick={toggleAddFieldOfficeModal} className='p-0'>
                    <div className='dropdown-item'>
                      <IconSvg icon='fieldOffice' />
                      <p>Field Office</p>
                    </div>
                  </Dropdown.Item>
                )}
                <Dropdown.Item onClick={toggleAddSquadModal} className='p-0'>
                  <div className='dropdown-item'>
                    <IconSvg icon='squad' />
                    <p>Squad</p>
                  </div>
                </Dropdown.Item>
              </Dropdown>
            )}
          </div>
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
          {viewType == VIEW_TYPE.AGENCY ? (
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
                          {agencyHeader.map((item) => {
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
                        {listAgencies?.map((item: any, index: number) => {
                          return (
                            <tr key={item?._id} className='hover:bg-wt-primary-85 cursor-pointer'>
                              <td className='p-4 text-wt-primary-120 text-sm font-normal'>{index + 1}</td>
                              <td className='p-4 text-wt-primary-120 text-sm font-semibold'>{item?.id || ''}</td>
                              <td className='p-4 text-wt-primary-120 text-sm font-normal min-w-[200px]'>
                                {item?.name || ''}
                              </td>
                              <td className='p-4'>
                                <div className='flex items-center space-x-1.5 text-sm font-semibold'>
                                  {item?.status == UserStatus.ACTIVE ? (
                                    <>
                                      <span className='w-1.5 h-1.5 rounded-full bg-wt-primary-115'></span>
                                      <span className='text-wt-primary-115'>Active</span>
                                    </>
                                  ) : item?.status == UserStatus.INACTIVE ? (
                                    <>
                                      <span className='w-1.5 h-1.5 rounded-full bg-wt-red-1'></span>
                                      <span className='text-wt-red-1'>Inactive</span>
                                    </>
                                  ) : (
                                    <></>
                                  )}
                                </div>
                              </td>
                              <td className='p-4 text-wt-primary-120 text-sm font-normal min-w-[150px]'>
                                {formatDate(item?.createdAt, 'MMM D, YYYY')}
                              </td>
                              <td className='p-4 text-wt-primary-120 text-sm font-normal min-w-[150px]'>
                                {formatDate(item?.updatedAt, 'MMM D, YYYY')}
                              </td>
                              <td>
                                <div className='flex items-center'>
                                  <div
                                    className='flex items-center space-x-1 cursor-pointer  text-wt-primary-75 text-xs font-bold edit p-4'
                                    onClick={() => toggleAgencyInfoModal(item?._id)}
                                  >
                                    <IconSvg icon='receiptEdit' />
                                    <span>Edit</span>
                                  </div>
                                  <div
                                    className='flex items-center space-x-1 cursor-pointer text-wt-primary-75 text-xs font-bold border-l border-wt-primary-125 delete p-4'
                                    onClick={() => deleteAgency(item?._id)}
                                  >
                                    <IconSvg icon='trashIcon' />
                                    <span>Delete</span>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className='rounded-b-lg w-full border-t border-[#BDC9E2] px-4 py-2.5 flex flex-wrap items-center bg-white'>
                    {listAgencies.length != 0 && (
                      <span className='text-wt-primary-40 text-xs font-semibold mr-auto'>
                        Show results from {(agenciesPageInfo?.page - 1) * 10 + 1} to{' '}
                        {(agenciesPageInfo?.page - 1) * 10 + listAgencies.length} in total of{' '}
                        {agenciesPageInfo?.totalItems || ''} items
                      </span>
                    )}
                    <ReactPaginate
                      key='userPagination'
                      breakLabel='...'
                      nextLabel='>'
                      onPageChange={(data: any) => {
                        setCurrentAgencyPage(Number(data?.selected + 1))
                      }}
                      forcePage={agenciesPageInfo ? agenciesPageInfo.page - 1 : -1}
                      pageCount={agenciesPageInfo?.totalPage || 0}
                      previousLabel='<'
                      renderOnZeroPageCount={null}
                      className='pagination'
                    />
                  </div>
                </>
              )}
            </div>
          ) : viewType == VIEW_TYPE.FIELD_OFFICE ? (
            <div className='rounded-b-lg w-full'>
              {isLoading ? (
                <div className='flex items-center justify-center w-100 py-3'>
                  <Spinner />
                </div>
              ) : (
                <>
                  {' '}
                  <div className='relative overflow-x-auto table-scroll bg-white'>
                    <table className='w-full'>
                      <thead className='dark:bg-gray-700'>
                        <tr className='border-b border-[#BDC9E2]'>
                          {fieldOfficeHeader.map((item) => {
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
                        {listFieldOffices?.map((item: any, index: number) => {
                          return (
                            <tr key={item?._id} className='hover:bg-wt-primary-85 cursor-pointer'>
                              <td className='p-4 text-wt-primary-120 text-sm font-normal'>{index + 1}</td>
                              <td className='p-4 text-wt-primary-120 text-sm font-semibold'>{item?.id || ''}</td>
                              <td className='p-4 text-wt-primary-120 text-sm font-normal'>{item?.alphaCode || ''}</td>
                              <td className='p-4 text-wt-primary-120 text-sm font-normal'>{item?.name || ''}</td>
                              <td className='p-4'>
                                <div className='flex items-center space-x-1.5 text-sm font-semibold'>
                                  {item?.status == UserStatus.ACTIVE ? (
                                    <>
                                      <span className='w-1.5 h-1.5 rounded-full bg-wt-primary-115'></span>
                                      <span className='text-wt-primary-115'>Active</span>
                                    </>
                                  ) : item?.status == UserStatus.INACTIVE ? (
                                    <>
                                      <span className='w-1.5 h-1.5 rounded-full bg-wt-red-1'></span>
                                      <span className='text-wt-red-1'>Inactive</span>
                                    </>
                                  ) : (
                                    <></>
                                  )}
                                </div>
                              </td>
                              <td className='p-4 text-wt-primary-120 text-sm font-normal min-w-[150px]'>
                                {formatDate(item?.createdAt, 'MMM D, YYYY')}
                              </td>
                              <td className='p-4 text-wt-primary-120 text-sm font-normal min-w-[150px]'>
                                {formatDate(item?.updatedAt, 'MMM D, YYYY')}
                              </td>
                              <td>
                                <div className='flex items-center'>
                                  <div
                                    className='flex items-center space-x-1 cursor-pointer  text-wt-primary-75 text-xs font-bold p-4 edit'
                                    onClick={() => toggleFieldOfficeInfoModal(item?._id)}
                                  >
                                    <IconSvg icon='receiptEdit' />
                                    <span>Edit</span>
                                  </div>
                                  <div
                                    className='flex items-center space-x-1 cursor-pointer text-wt-primary-75 text-xs font-bold p-4 border-l border-wt-primary-125 delete'
                                    onClick={() => deleteFieldOffice(item?._id)}
                                  >
                                    <IconSvg icon='trashIcon' />
                                    <span>Delete</span>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className='rounded-b-lg w-full border-t border-[#BDC9E2] px-4 py-2.5 flex flex-wrap items-center bg-white'>
                    {listFieldOffices.length != 0 && (
                      <span className='text-wt-primary-40 text-xs font-semibold mr-auto'>
                        Show results from {(fieldOfficesPageInfo?.page - 1) * 10 + 1} to{' '}
                        {(fieldOfficesPageInfo?.page - 1) * 10 + listFieldOffices.length} in total of{' '}
                        {fieldOfficesPageInfo?.totalItems || ''} items
                      </span>
                    )}
                    <ReactPaginate
                      key='userPagination'
                      breakLabel='...'
                      nextLabel='>'
                      onPageChange={(data: any) => {
                        setCurrentFieldOfficePage(Number(data?.selected + 1))
                      }}
                      forcePage={fieldOfficesPageInfo ? fieldOfficesPageInfo.page - 1 : -1}
                      pageCount={fieldOfficesPageInfo?.totalPage || 0}
                      previousLabel='<'
                      renderOnZeroPageCount={null}
                      className='pagination'
                    />
                  </div>
                </>
              )}
            </div>
          ) : viewType == VIEW_TYPE.SQUAD ? (
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
                          {squadHeader.map((item) => {
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
                        {listSquads?.map((item: any, index: number) => {
                          return (
                            <tr key={item?._id} className='hover:bg-wt-primary-85 cursor-pointer'>
                              <td className='p-4 text-wt-primary-120 text-sm font-normal'>{index + 1}</td>
                              <td className='p-4 text-wt-primary-120 text-sm font-semibold'>{item?.id || ''}</td>
                              <td className='p-4 text-wt-primary-120 text-sm font-normal'>{item?.name || ''}</td>
                              <td className='p-4'>
                                <div className='flex items-center space-x-1.5 text-sm font-semibold'>
                                  {item?.status == UserStatus.ACTIVE ? (
                                    <>
                                      <span className='w-1.5 h-1.5 rounded-full bg-wt-primary-115'></span>
                                      <span className='text-wt-primary-115'>Active</span>
                                    </>
                                  ) : item?.status == UserStatus.INACTIVE ? (
                                    <>
                                      <span className='w-1.5 h-1.5 rounded-full bg-wt-red-1'></span>
                                      <span className='text-wt-red-1'>Inactive</span>
                                    </>
                                  ) : (
                                    <></>
                                  )}
                                </div>
                              </td>
                              <td className='p-4 text-wt-primary-120 text-sm font-normal min-w-[150px]'>
                                {formatDate(item?.createdAt, 'MMM D, YYYY')}
                              </td>
                              <td className='p-4 text-wt-primary-120 text-sm font-normal min-w-[150px]'>
                                {formatDate(item?.updatedAt, 'MMM D, YYYY')}
                              </td>
                              <td>
                                <div className='flex items-center'>
                                  <div
                                    className='flex items-center space-x-1 cursor-pointer  text-wt-primary-75 text-xs font-bold p-4 edit'
                                    onClick={() => toggleSquadInfoModal(item?._id)}
                                  >
                                    <IconSvg icon='receiptEdit' />
                                    <span>Edit</span>
                                  </div>
                                  <div
                                    className='flex items-center space-x-1 cursor-pointer text-wt-primary-75 text-xs font-bold p-4 border-l border-wt-primary-125 delete'
                                    onClick={() => deleteSquad(item?._id)}
                                  >
                                    <IconSvg icon='trashIcon' />
                                    <span>Delete</span>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className='rounded-b-lg w-full border-t border-[#BDC9E2] px-4 py-2.5 flex flex-wrap items-center bg-white'>
                    {listSquads.length != 0 && (
                      <span className='text-wt-primary-40 text-xs font-semibold mr-auto'>
                        Show results from {(squadsPageInfo?.page - 1) * 10 + 1} to{' '}
                        {(squadsPageInfo?.page - 1) * 10 + listSquads.length} in total of{' '}
                        {squadsPageInfo?.totalItems || ''} items
                      </span>
                    )}
                    <ReactPaginate
                      key='userPagination'
                      breakLabel='...'
                      nextLabel='>'
                      onPageChange={(data: any) => {
                        setCurrentSquadPage(Number(data?.selected + 1))
                      }}
                      forcePage={squadsPageInfo ? squadsPageInfo.page - 1 : -1}
                      pageCount={squadsPageInfo?.totalPage || 0}
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
      <AddAgencyModal ref={addAgencyModal} reloadPage={search} />
      <AddSquadModal ref={addSquadModal} reloadPage={search} />
      <AddFieldOfficeModal ref={addFieldOfficeModal} reloadPage={search} />
      <AgencyInformationModal ref={agencyInfoModal} reloadPage={search} />
      <FieldOfficeInformationModal ref={fieldOfficeInfoModal} reloadPage={search} />
      <SquadInformationModal ref={squadInfoModal} reloadPage={search} />
      <AlertModal ref={alertModalRef} />
    </>
  )
}

export default DataCategory
