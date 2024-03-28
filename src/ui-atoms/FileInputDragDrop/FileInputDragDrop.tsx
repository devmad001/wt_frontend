import UIHelperClass from 'constant/UIHelper'
import { useEffect, useRef, useState } from 'react'
import { IconSvg } from 'ui-atoms'

import './style.css'
import fileUploadIcon from 'assets/media/png/upload-drag-drop.png'

function FileInputDragDrop(props: any) {
  const inputFileRef = useRef<any>(null)
  const [fileName, setFileName] = useState('')
  const [fileSelected, setFileSelected] = useState(null)
  const [opacity, setOpacity] = useState('')

  useEffect(() => {
    setFileName(props.fileName || '')
  }, [props.fileName])

  const handleFileInput = ($event: any) => {
    props.onInput && props.onInput($event.target.files)
    if ($event.target.files) {
      if ($event.target.files.length > 1) {
        setFileName(`${$event.target.files.length} files`)
      } else if ($event.target.files.length == 1) {
        setFileName($event.target.files[0].name)
      } else {
        setFileName('')
      }
    } else {
      setFileName('')
    }
  }

  const listenerClickInputEvent = ($event: any) => {
    inputFileRef?.current?.click()
  }

  const dropHandler = (ev: any) => {
    if (props.disabled) return
    ev.preventDefault()
    setOpacity('')
    props.onInput && props.onInput(ev.dataTransfer.files)
    if (ev.dataTransfer.files) {
      if (ev.dataTransfer.files.length > 1) {
        setFileName(`${ev.dataTransfer.files.length} files`)
      } else if (ev.dataTransfer.files.length == 1) {
        setFileName(ev.dataTransfer.files[0].name)
      } else {
        // setFileName('No file chosen')
      }
    } else {
      setFileName('')
    }
    inputFileRef.current.value = null
  }

  const dragOverHandler = (ev: any) => {
    ev.preventDefault()
    ev.stopPropagation()
    setOpacity('opacity-40')
  }

  const dragLeaveHandler = (ev: any) => {
    ev.preventDefault()
    ev.stopPropagation()
    setOpacity('')
  }

  return (
    <div
      className={[
        'p-4 flex flex-col items-center justify-center border border-dashed border-wt-primary-90 rounded-lg bg-wt-primary-85 cursor-pointer dark:bg-gray-600',
        props?.disabled ? 'dragdrop-disabled' : '',
        opacity
      ]
        .filter(Boolean)
        .join(' ')}
      onDrop={dropHandler}
      onDragOver={dragOverHandler}
      onDragLeave={dragLeaveHandler}
      onClick={listenerClickInputEvent}
    >
      <div className='flex items-center w-full'>
        <div className='flex items-center'>
          <img src={fileUploadIcon} />
          <div className='ml-2'>
            <p className='text-blue-500 text-sm font-semibold underline'> Click to upload</p>
            <p className='text-wt-primary-40 text-sm font-semibold'>or drag and drop subpoena file here</p>
          </div>
        </div>
        <p className='text-sm text-wt-primary-65 dark:text-white font-light text-right ml-auto'>
          File formats accepted:
          <br /> PDF.
        </p>
      </div>
      {/* <p className='text-wt-primary-50 dark:text-white font-light'>{fileName || ''}</p> */}
      <input
        ref={inputFileRef}
        id='inputFileRef'
        type='file'
        accept={'.pdf'}
        hidden
        multiple={props.multiple || false}
        disabled={props.disabled || false}
        onInput={handleFileInput}
      ></input>
    </div>
  )
}

export default FileInputDragDrop
