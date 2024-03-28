import avatar from 'assets/media/image/avatar.png'

interface Props {
  children: any
}

function DashBoardChat(props: Props) {
  return (
    <div className='flex w-full p-4 border-b border-wt-primary-125 bg-white hover:bg-wt-primary-85'>
      <img src={avatar} className='w-9 h-9 rounded-full mr-2.5' />
      <div className='mr-auto'>
        <p className='text-wt-primary-120 text-sm font-semibold'>WatchTower Admin</p>
        {props?.children}
      </div>
      <p className='text-wt-primary-40 text-xs font-semibold'>21:19 PM</p>
    </div>
  )
}

export default DashBoardChat
