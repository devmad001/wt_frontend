import { HiChevronRight, HiHome } from 'react-icons/hi'
import { toast } from 'react-toastify'

function SubpoenaDetails() {
  return (
    <>
      <div className='p-4 pt-8 px-6 bg-white block sm:flex items-center justify-between border-b border-gray-200 lg:mt-1.5 dark:bg-gray-800 dark:border-gray-700'>
        <div className='w-full mb-1'>
          <div className='mb-4'>
            <nav className='flex mb-5' aria-label='Breadcrumb'>
              <ol className='inline-flex items-center space-x-1 text-sm font-medium md:space-x-2'>
                <li className='inline-flex items-center'>
                  <a
                    href='#'
                    className='inline-flex items-center text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-white'
                  >
                    <HiHome className={'w-5 h-5 mr-2.5'}></HiHome>
                    Home
                  </a>
                </li>
                <li>
                  <div className='flex items-center'>
                    <HiChevronRight className={'w-6 h-6 text-gray-400'}></HiChevronRight>
                    <a
                      href='#'
                      className='ml-1 text-gray-400 hover:text-primary-600 md:ml-2 dark:text-gray-300 dark:hover:text-white'
                    >
                      Subpoena Details
                    </a>
                  </div>
                </li>
              </ol>
            </nav>
            <h1 className='text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white'>Subpoena Details</h1>
          </div>
        </div>
      </div>

      <div className='flex flex-col'>
        <div className='overflow-x-auto'>
          <div className='inline-block min-w-full align-middle'>
            <div className='overflow-hidden shadow'></div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SubpoenaDetails
