import loadingGif from 'assets/media/image/loading1.gif'
import { GlobalContext } from 'providers'
import { useContext } from 'react'

const LoadingModal = () => {
  const { state } = useContext(GlobalContext)
  const { loading } = state;

  return (
    <div className='bg-wt-primary-65 fixed top-0 right-0 left-0 bottom-0 bg-opacity-30 backdrop-blur-[2px] flex flex-row justify-center items-center z-[60]'>
      <div className='p-4 flex relative justify-center items-center bg-white shadow-loading rounded-lg flex-col w-40 h-40'>
        <img src={loadingGif} className='absolute top-[10px] right-[10px] left-[10px] bottom-[10px] z-0 w-30 h-30' />
        {loading?.content?.percent > -1 && <p className='text-wt-primary-40 font-semibold z-10'>{loading?.content?.percent}%</p>}
        <p className='text-wt-primary-40 font-semibold z-10'>{loading?.content?.label ? loading?.content?.label : 'Loading..'}</p>
      </div>
    </div>
  )
}

export default LoadingModal
