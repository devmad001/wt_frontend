import iconWidget from 'assets/media/png/group-user.png'
import { useAdmin } from 'hooks'
import moment from 'moment'

import { useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate'
import { Spinner } from 'ui-atoms'
import { WtSearchIcon } from 'ui-atoms/Icons'

function AllUserOnline() {
  const pageInforDefault = {
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPage: 0
  }
  const adminAPI = useAdmin()
  const [isLoading, setIsLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [users, setUsers] = useState<any[]>([])
  const [pageInfor, setPageInfor] = useState<App.PageInfor>(pageInforDefault)
  const [keySearch, setKeySearch] = useState('')

  useEffect(() => {
    loadData(1)
    return () => {
      //
    }
  }, [])

  const loadData = (page: number) => {
    const params: any = {
      page: page,
      limit: 10,
      key: keySearch || ''
    }

    getAllUserOnline(params)
  }

  const getAllUserOnline = (params: any) => {
    setIsLoading(true)
    adminAPI.onlineUsers({
      params,
      callback: {
        onSuccess: (res) => {
          setTotal(res?.total || 0)
          setUsers(
            res?.items?.map((item: any) => {
              return {
                ...item,
                date: moment(item?.date).format('MMM DD')
              }
            })
          )
          setIsLoading(false)
        },
        onFailure: () => {
          setIsLoading(false)
        }
      }
    })
  }

  const onChangeKeySearch = (e: any) => {
    setKeySearch(e.target.value)
  }

  const submitSearch = (e: any) => {
    e.preventDefault()
    loadData(1)
  }

  return (
    <>
      <div className='h-full w-full rounded-lg bg-gray-50'>
        <div className='flex items-center p-4 bg-white border-b border-gray-200 rounded-t-lg'>
          <img src={iconWidget} className='w-7 h-7 mr-3' />
          <label className='text-lg font-bold text-wt-primary-40'>All users online</label>
          <div className='flex items-center ml-auto'>
            <form className='sm:pr-3' onSubmit={submitSearch}>
              <label htmlFor='products-search' className='sr-only'>
                Search
              </label>
              <div className='relative lg:w-52'>
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
        </div>
        <div className='overflow-hidden flex flex-col p-4'>
          {isLoading ? (
            <div className='flex items-center justify-center w-full h-full'>
              <Spinner />
            </div>
          ) : (
            <div className='overflow-auto max-h-[350px] min-w-full'>
              <table className='table min-w-full'>
                <thead>
                  <tr>
                    <th scope='col' className='text-left'>
                      Name
                    </th>
                    <th scope='col'>IP address</th>
                    <th scope='col'>Company</th>
                    <th scope='col'>Pageviews</th>
                    <th scope='col'>On page</th>
                  </tr>
                </thead>
                <tbody className='bg-transparent rounded-b-lg divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700'>
                  {users &&
                    users.map((item: any, index) => (
                      <tr key={index} className='bg-white hover:bg-wt-primary-85'>
                        <td className='px-4 py-2 text-sm font-semibold text-wt-primary-40 whitespace-nowrap'>
                          {item.user?.fullName}
                        </td>
                        <td className='px-4 py-2 text-sm font-semibold text-wt-primary-40 whitespace-nowrap'>
                          {item.ipAddress}
                        </td>
                        <td className='px-4 py-2 text-sm font-semibold text-wt-primary-40 whitespace-nowrap'>
                          {item.agency}
                        </td>
                        <td className='px-4 py-2 text-sm font-semibold text-wt-primary-40 whitespace-nowrap'>
                          {item.views}
                        </td>
                        <td className='px-4 py-2 text-sm font-semibold text-wt-primary-40 whitespace-nowrap'>
                          {item.page}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <div className='w-full flex bg-white rounded-b-lg p-4 border-t border-gray-200'>
                {users.length != 0 && (
                  <span className='text-wt-primary-40 text-xs font-semibold mr-auto'>
                    Show results from {(pageInfor?.page - 1) * 10 + 1} to {(pageInfor?.page - 1) * 10 + users.length} in
                    total of {pageInfor?.totalItems || ''} items
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
    </>
  )
}

export default AllUserOnline
