import { useEffect, useState } from 'react'
import { Button, TextAvatar } from 'ui-atoms'
import { WtSendMessage } from 'ui-atoms/Icons'
import LoadingGif from 'assets/media/image/loading.gif'
import { useFinAwareAPI } from 'api'
import { useSearchParams } from 'react-router-dom'
import BlueCircleLogo from 'assets/media/svg/blue-circle-logo.svg'
import LikeImg from 'assets/media/svg/like.svg'
import LikeFillImg from 'assets/media/svg/like-fill.svg'
import DislikeImg from 'assets/media/svg/dislike.svg'
import DislikeFillImg from 'assets/media/svg/dislike-fill.svg'
import clsx from 'clsx'

const FeedbackItem = () => {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState(0)
  const finAwareAPI = useFinAwareAPI()
  const [caseId, setCaseId] = useState<string | null>(null)
  const [positive, setPositive] = useState('')
  const [negative, setNegative] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!searchParams?.get('case_id')) setCaseId(null)
    setCaseId(searchParams?.get('case_id'))
  }, [searchParams])

  const submitFeedback = () => {
    try {
      setIsSubmitting(true)
      finAwareAPI.postFeedback(caseId || '', { feedback: status === 1 ? positive : negative }).finally(() => {
        setStatus(0)
        setIsSubmitting(false)
      })
    } catch (err) {
      setIsSubmitting(true)
    }
  }

  return (
    <div className={clsx('my-2 flex flex-row space-x-2.5 w-full')}>
      <div className='flex flex-row items-center space-x-1.5'>
        <img
          src={status === 1 ? LikeFillImg : LikeImg}
          className='cursor-pointer'
          onClick={() => {
            setStatus(1)
            setPositive('')
          }}
        />
        <div className='h-4 w-px bg-wt-primary-90' />
        <img
          src={status === 2 ? DislikeFillImg : DislikeImg}
          className='cursor-pointer'
          onClick={() => {
            setStatus(2)
            setNegative('')
          }}
        />
      </div>
      {status === 2 && (
        <div className={clsx('flex flex-row space-x-2')}>
          <input
            type='text'
            className='border !border-wt-red-1 bg-wt-primary-85 px-2.5 py-2 rounded-lg min-w-[200px] text-xs focus:ring-0 text-wt-red-1 placeholder:text-wt-red-1 placeholder:opacity-70'
            placeholder='Please provide an explanation'
            value={negative}
            onChange={(e) => setNegative(e?.target?.value)}
            disabled={isSubmitting}
          />
          <button className='text-xs font-bold text-wt-red-1' disabled={isSubmitting} onClick={submitFeedback}>
            Submit
          </button>
        </div>
      )}
      {status === 1 && (
        <div className={clsx('flex flex-row space-x-2')}>
          <input
            type='text'
            className='border !border-wt-green-1 bg-wt-primary-85 px-2.5 py-2 min-w-[200px] rounded-lg text-xs focus:ring-0 text-wt-green-1 placeholder:text-wt-green-1 placeholder:opacity-70'
            placeholder='Please provide an explanation'
            value={positive}
            onChange={(e) => setPositive(e?.target?.value)}
            disabled={isSubmitting}
          />
          <button className='text-xs font-bold text-wt-green-1' disabled={isSubmitting} onClick={submitFeedback}>
            Submit
          </button>
        </div>
      )}
    </div>
  )
}

const LLMBox = () => {
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [caseId, setCaseId] = useState<string | null>(null)
  const [data, setData] = useState<any>([])
  const finAwareAPI = useFinAwareAPI()

  useEffect(() => {
    if (!searchParams?.get('case_id')) setCaseId(null)
    setCaseId(searchParams?.get('case_id'))
  }, [searchParams])

  const onKeyDownHandler = (e: any) => {
    if (e.key === 'Enter') {
      onSendHandler()
    }
  }

  const onSendHandler = () => {
    try {
      setIsLoading(true)
      finAwareAPI
        .getQuery(caseId || '', { query })
        .then((res) => {
          if (res?.data) {
            setData((prevData: any) => [{ query, answer: res?.data?.generated_text }, ...prevData])
            setQuery('')
          }
        })
        .finally(() => {
          setIsLoading(false)
        })
    } catch (err) {
      setIsLoading(false)
    }
  }

  return (
    <div className='w-full h-full flex flex-col chatbox'>
      <div className='w-full p-4 flex flex-row items-center space-x-4'>
        <input
          type='text'
          name='chatInput'
          id='inputChatContent'
          className='form-control form-gray'
          placeholder='Type your question here...'
          value={query}
          onChange={(e: any) => setQuery(e?.target?.value || '')}
          disabled={isLoading}
          onKeyDown={onKeyDownHandler}
        />
        <Button
          className='flex items-center btn btn-primary py-3 bg-blue-500 hover:bg-blue-600 text-base font-bold text-white rounded-lg px-6'
          type='button'
          isLoading={isLoading}
          disabled={isLoading || !query?.length}
          onClick={onSendHandler}
        >
          <span className='mr-2'>Send</span>
          <WtSendMessage className='w-6 h-6' />
        </Button>
      </div>
      <div className='h-full overflow-y-auto bg-wt-primary-85 chatbox-body !min-h-fit'>
        <div className='px-4 py-2'>
          {isLoading && (
            <div className='w-full flex flex-row justify-center items-center space-x-1.5 py-2.5'>
              <img src={LoadingGif} className='w-7 h-7' />
              <span className='text-wt-primary-40 text-sm font-semibold'>Thinking...</span>
            </div>
          )}

          {data?.map((item: any, idx: number) => (
            <>
              <div className='chat-msg px-4 py-3 mb-2 mr-3 max-w-[90%]' key={idx}>
                <div className='flex items-start'>
                  <div className='profile-img'>
                    <img src={BlueCircleLogo} className='w-full h-full' />
                  </div>
                  <div className='flex-1 pl-4'>
                    <div className='h-full flex items-top'>
                      <div className='flex flex-col'>
                        <span className='text-base font-medium dark:text-wt-primary-20 break-words break-word'>
                          {item?.query}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <FeedbackItem />

              <div className='chat-msg px-4 py-3 mb-2 from-me max-w-[90%]'>
                <div className='flex items-start'>
                  <div className='profile-img'>
                    <img src={BlueCircleLogo} className='w-full h-full' />
                  </div>
                  <div className='flex-1 pl-4'>
                    <div className='h-full flex items-top'>
                      <div className='flex flex-col'>
                        <span className='text-base font-medium dark:text-wt-primary-20 break-words break-word'>
                          {item?.answer}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LLMBox
