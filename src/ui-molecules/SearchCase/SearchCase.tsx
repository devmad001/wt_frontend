import { AsyncReactSelect } from 'ui-atoms'
import { forwardRef, useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { useSearchParams } from 'react-router-dom'
import { EventBus } from 'utils/event-bus'
import { GlobalEvents } from 'constant/GlobalEvent'
import { useSubpoena } from 'hooks'
import { debounce } from 'lodash'

const controlStyles = {
  base: 'form-control react-select py-0 border rounded-full bg-white hover:cursor-pointer',
  focus: 'ring-1 ring-wt-primary-1 border-wt-primary-90',
  nonFocus: 'border-gray-300 hover:border-gray-400'
}

const renderOption = ({ innerProps, data, isDisabled, isSelected }: any) =>
  !isDisabled ? (
    <div
      {...innerProps}
      className={[
        'flex flex-col rounded-lg p-2 px-3 cursor-pointer hover:bg-blue-100 hover:text-gray-900',
        isSelected ? 'text-white bg-blue-200' : ''
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className='font-semibold'>{data?.label}</span>
    </div>
  ) : null

const SearchCase = forwardRef((props: any, ref: any) => {
  const subpoenaHook = useSubpoena()
  const search = useRef<string>('')
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [caseId, setCaseId] = useState<string | null>(null)
  const [key, setKey] = useState<string>(new Date().getTime().toString())

  useEffect(() => {
    EventBus.on(GlobalEvents.CREATED_NEW_UPLOAD, (data: any) => {
      // Using key to reload data of React Async Select
      setKey(new Date().getTime().toString())
    })

    return () => {
      EventBus.remove(GlobalEvents.CREATED_NEW_UPLOAD, () => {})
    }
  }, [])

  useEffect(() => {
    reSelecteCaseByQueryParams()
  }, [searchParams])

  const reSelecteCaseByQueryParams = () => {
    const caseId: any = searchParams.get('case_id')
    if (!caseId) {
      setCaseId(null);
      setSelectedItem(null);
      return;
    }
    setCaseId(caseId)
    subpoenaHook.getSubpoenaDetail({
      _id: caseId,
      params: {
        page: 1,
        key: '',
        limit: 1
      },
      callback: {
        onSuccess: (res) => {
          if (res?.document) {
            setSelectedItem({
              value: res?.document?._id,
              label: res?.document?.originalName
            })
          }
        }
      }
    })
  }

  const loadOptions = (inputValue: string, callback: (options: App.ReactSelectOptions[]) => void) => {
    search.current = inputValue
    loadData(inputValue, callback)
  }

  const loadData = debounce((key: string, callback: (options: App.ReactSelectOptions[]) => void = () => {}) => {
    const params: Subpoena.ListParams = {
      page: 1,
      limit: 500,
      key: key || '',
      status: ''
    }
    subpoenaHook.getSubpoenaList({
      params: params,
      callback: {
        onSuccess: (res) => {
          const arr: App.ReactSelectOptions[] = res?.items?.map((item: Subpoena.Details) => {
            return {
              value: item?._id,
              label: item?.originalName
            }
          })
          callback && callback(arr)
        }
      }
    })
  }, 300)

  const onChangedContact = (e: any) => {
    setSelectedItem(e || null)
    if (e) {
      setSearchParams({ case_id: e?.value })
    } else {
      setSearchParams({})
    }
  }

  const onClearValue = (e: any) => {
    setSelectedItem(null)
  }

  return (
    <>
      <form action='#' method='GET' className='hidden mr-3 lg:block lg:pl-3.5'>
        <label htmlFor='topbar-search' className='sr-only'>
          Search
        </label>
        <AsyncReactSelect
          key={key}
          className='lg:w-96'
          classNames={{
            control: ({ isFocused }: any) =>
              clsx(isFocused ? controlStyles.focus : controlStyles.nonFocus, controlStyles.base)
          }}
          value={selectedItem}
          loadOptions={loadOptions}
          menuPosition={'fixed'}
          placeholder='Search case...'
          defaultOptions
          components={{ Option: renderOption }}
          closeMenuOnSelect={true}
          isClearable={true}
          clearValue={onClearValue}
          onChange={onChangedContact}
        />
      </form>
    </>
  )
})

export default SearchCase
