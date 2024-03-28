import UIHelperClass from 'constant/UIHelper'
import { useEffect, useRef, useState } from 'react'

function FileInput(props: any) {
  const inputFileRef = useRef<any>(null)
  const [fileName, setFileName] = useState('No file chosen')
  const [fileSelected, setFileSelected] = useState(null)

  useEffect(() => {
    setFileName(props.fileName || 'No file chosen')
  }, [props.fileName])

  const handleFileInput = ($event: any) => {
    props.onInput && props.onInput($event)
    if ($event.target.files) {
      if ($event.target.files.length > 1) {
        setFileName(`${$event.target.files.length} files`)
      } else if ($event.target.files.length == 1) {
        setFileName($event.target.files[0].name)
      } else {
        // setFileName('No file chosen')
      }
    } else {
      setFileName('No file chosen')
    }
  }

  const listenerClickInputEvent = ($event: any) => {
    inputFileRef?.current?.click()
  }

  return (
    <div className='flex'>
      <label
        className='flex-shrink-0 flex items-center px-4 py-2 text-center font-medium text-sm relative rounded-l-lg focus:z-10 focus:outline-none text-white bg-wt-primary-4 enabled:hover:bg-wt-primary-3 enabled:hover:text-white :ring-wt-primary-4 dark:border-gray-600 focus:ring-2'
        htmlFor='inputFileRef'
      >
        Choose File
      </label>
      <div className='w-full'>
        <input
          type='text'
          className={[
            'block w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-r-lg focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-wt-primary-1 dark:focus:border-blue-500',
            props.error ? UIHelperClass.INVALID_CLASS : ''
          ]
            .filter(Boolean)
            .join(' ')}
          readOnly={true}
          value={fileName || ''}
          disabled={props.disabled || false}
          onClick={listenerClickInputEvent}
        />
      </div>
      <input
        ref={inputFileRef}
        id='inputFileRef'
        type='file'
        hidden
        multiple={props.multiple || false}
        disabled={props.disabled || false}
        onInput={handleFileInput}
      ></input>
    </div>
  )
}

export default FileInput
