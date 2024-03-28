import { AsyncReactSelect } from 'ui-atoms'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAgency } from 'hooks'
import { debounce } from 'lodash'

const AgencySelect = forwardRef((props: any, ref: any) => {
  const agencyHook = useAgency()
  const search = useRef<string>('')
  const [key, setKey] = useState<string>(new Date().getTime().toString())

  useEffect(() => {
    //
  }, [])

  useImperativeHandle(ref, () => ({
    reload
  }))

  const reload = () => {
    setKey(new Date().getTime().toString())
  }

  const loadOptions = (inputValue: string, callback: (options: App.ReactSelectOptions[]) => void) => {
    search.current = inputValue
    loadData(inputValue, callback)
  }

  const loadData = debounce((key: string, callback: (options: App.ReactSelectOptions[]) => void = () => {}) => {
    const params: Agency.GetListParams = {
      page: 1,
      limit: 100,
      key: key || ''
    }
    agencyHook.getAgencies({
      params: params,
      callback: {
        onSuccess: (res) => {
          const arr: App.ReactSelectOptions[] = res?.items?.map((item: Agency.Details) => {
            return {
              value: item?._id,
              label: item?.name
            }
          })
          callback && callback(arr)
        }
      }
    })
  }, 300)

  return (
    <>
      <AsyncReactSelect
        key={key}
        loadOptions={loadOptions}
        menuPosition={'fixed'}
        placeholder='Select..'
        defaultOptions
        closeMenuOnSelect={true}
        isClearable={true}
        {...props}
      />
    </>
  )
})

export default AgencySelect
