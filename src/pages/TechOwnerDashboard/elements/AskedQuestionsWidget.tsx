import iconWidget from 'assets/media/png/message-question.png'

import { useEffect } from 'react'

function AskedQuestionsWidget() {
  useEffect(() => {
    //
    return () => {
      //
    }
  }, [])

  return (
    <>
      <div className='h-full w-full rounded-lg bg-gray-50'>
        <div className='flex items-center p-4 bg-white border-b border-gray-200 rounded-t-lg'>
          <img src={iconWidget} className='w-7 h-7 mr-3' />
          <label className='text-lg font-bold text-wt-primary-40'>Asked questions</label>

          <div className='border-space h-10 ml-auto mr-6'></div>
          <div className='flex items-center'>
            <span className='text-6xl font-semibold text-wt-primary-40'>0</span>
          </div>
        </div>
        <div className='flex flex-col p-4'></div>
      </div>
    </>
  )
}

export default AskedQuestionsWidget
