import { useEffect } from 'react'

function OtpInput(props: any) {
  useEffect(() => {
    handleInputs()
  }, [])

  const handleInputs = () => {
    const inputs: any = document.getElementById('otp_inputs')

    inputs.addEventListener('input', function (e: any) {
      const target = e.target
      const val = target.value

      if (isNaN(val)) {
        target.value = ''
        return
      }

      if (val != '') {
        const next = target.nextElementSibling
        if (next) {
          next.focus()
        }
      }

      const childInputs = inputs.getElementsByClassName('input')
      let res = ''
      for (let i = 0; i < childInputs.length; i++) {
        res = res + childInputs[i].value
      }
      props?.onChange && props?.onChange(res || '')
    })

    inputs.addEventListener('keyup', function (e: any) {
      const target = e.target
      const key = e.key.toLowerCase()

      if (key == 'backspace' || key == 'delete') {
        target.value = ''
        const prev = target.previousElementSibling
        if (prev) {
          prev.focus()
        }
        return
      }
    })

    const childInputs = inputs.getElementsByClassName('input')
    childInputs[0] && childInputs[0].focus()
  }

  return (
    <>
      <div id='otp_inputs' className='flex items-center justify-center gap-4'>
        <input
          className='input w-12 h-12 p-5 px-2 text-xl text-center font-semibold form-control'
          type='text'
          inputMode='numeric'
          maxLength={1}
        />
        <input
          className='input w-12 h-12 p-5 px-2 text-xl text-center font-semibold form-control'
          type='text'
          inputMode='numeric'
          maxLength={1}
        />
        <input
          className='input w-12 h-12 p-5 px-2 text-xl text-center font-semibold form-control'
          type='text'
          inputMode='numeric'
          maxLength={1}
        />
        <input
          className='input w-12 h-12 p-5 px-2 text-xl text-center font-semibold form-control'
          type='text'
          inputMode='numeric'
          maxLength={1}
        />
        <input
          className='input w-12 h-12 p-5 px-2 text-xl text-center font-semibold form-control'
          type='text'
          inputMode='numeric'
          maxLength={1}
        />
        <input
          className='input w-12 h-12 p-5 px-2 text-xl text-center font-semibold form-control'
          type='text'
          inputMode='numeric'
          maxLength={1}
        />
      </div>
    </>
  )
}

export default OtpInput
