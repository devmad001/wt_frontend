import { IconSvg } from 'ui-atoms'
import tick from 'assets/media/image/shield-tick.png'
import clsx from 'clsx'

interface StatusProps {
  title: string
  state: string
  percent: string
  remaining_minutes: number
}

function DashBoardCase({title, state, percent, remaining_minutes}: StatusProps) {
  return (
    <div
      className={`relative flex flex-col w-full space-y-2 p-3 rounded-md ${
        Number(percent) < 100 ? ' bg-wt-primary-85' : 'bg-wt-primary-100 border border-wt-orange-3'
      }`}
    >
      {Number(percent) == 100 && <img src={tick} className='absolute top-2 right-2' />}

      <p className='text-sm font-semibold text-wt-primary-120'>{title}</p>
      <div className='flex flex-wrap items-center text-xs text-wt-primary-40 font-semibold'>
        <div className='flex items-center mt-1'>
          <IconSvg icon='pieChart' />
          <p className='mr-2.5 ml-1'>{state}</p>
        </div>
        <div className='flex items-center mt-1'>
          <IconSvg icon='clockIcon' />
          <p className='ml-1'>{remaining_minutes} Minutes</p>
        </div>
      </div>
      {Number(percent) < 100 ? (
        <div className='flex flex-wrap items-center text-xs text-wt-primary-40 font-semibold'>
          <div className='flex flex-1 items-center mt-1 space-x-2.5 mr-2.5'>
            <p className='w-7'>{`${Number(percent)}%`}</p>
            <div className='min-w-[100px] flex-1 bg-white rounded-full p-0.5 border border-wt-primary-125 dark:bg-gray-700'>
              <div className='bg-wt-primary-90 h-2 rounded-full' style={{ width: `${percent}%` }}></div>
            </div>
          </div>
          <p className='mt-1'>Reading data...</p>
        </div>
      ) : (
        <div className='flex flex-wrap items-center text-xs text-wt-orange-3 font-semibold'>
          <div className='flex flex-1 items-center mt-1 space-x-2.5 mr-2.5'>
            <p className='w-7'>{`${Number(percent)}%`}</p>
            <div className='min-w-[100px] flex-1 bg-white rounded-full p-0.5 border border-wt-primary-125 dark:bg-gray-700'>
              <div className={clsx('bg-wt-primary-105 h-2 rounded-full')} style={{ width: `${percent}%` }}></div>
            </div>
          </div>
          <p className='mt-1'>Done!</p>
        </div>
      )}
    </div>
  )
}

export default DashBoardCase
