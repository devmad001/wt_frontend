import ThemeHelper from 'constant/ThemeHelper'
import { CustomFlowbiteTheme, Datepicker } from 'flowbite-react'
import { useEffect, useRef, useState } from 'react'
import { Button, IconSvg } from 'ui-atoms'
import { WtSubmitIcon } from 'ui-atoms/Icons'
import { formatPromoCode, valiator } from 'utils'
import { AlertModal } from 'ui-molecules'
import { usePromoCode } from 'hooks'
import { ToastControl } from 'utils/toast'
import moment from 'moment'

interface PromoCodeForm {
  code: string
  limit: number | string
  expiresAt: string
}

const customTheme: CustomFlowbiteTheme['datepicker'] | any = ThemeHelper.DATEPICKER

function EditPromoCode(props: any) {
  const promoCode = usePromoCode()
  const alertModalRef: any = useRef(null)
  const [promoCodeDetails, setPromoCodeDetails] = useState<PromoCode.Details>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState<PromoCodeForm>({
    code: '',
    limit: 1,
    expiresAt: moment().format('DD MMM, YYYY')
  })

  const [formErrors, setFormErrors] = useState<PromoCodeForm>({
    code: '',
    limit: '',
    expiresAt: ''
  })

  useEffect(() => {
    resetForm()
    setPromoCodeDetails({
      ...props?.data,
      expiresAt: moment(props?.data?.expiresAt).format('DD MMM, YYYY')
    })

    setForm({
      code: props?.data?.code || '',
      limit: props?.data?.limit,
      expiresAt: moment(props?.data?.expiresAt).format('DD MMM, YYYY')
    })
  }, [])

  const resetForm = () => {
    setForm({
      code: '',
      limit: 1,
      expiresAt: moment().format('DD MMM, YYYY')
    })

    setFormErrors({
      code: '',
      limit: '',
      expiresAt: ''
    })
  }

  const onChangedPromoCode = (e: any) => {
    e.target.value = formatPromoCode(e.target.value)
    setForm((current) => {
      return {
        ...current,
        code: e.target.value
      }
    })
  }

  const onChangedLimit = (e: any) => {
    setForm((current) => {
      return {
        ...current,
        limit: e.target.value
      }
    })
  }

  const onSelectedDateChanged = (e: any) => {
    setForm((current) => {
      return {
        ...current,
        expiresAt: moment(new Date(e)).format('DD MMM, YYYY') || ''
      }
    })

    validateExpiredDate()
  }

  const validateCode = () => {
    const err = valiator.validate(form.code, {
      required: true,
      errorsMessage: { required: 'This field is required.' }
    })
    setFormErrors((errors: any) => {
      return { ...errors, code: err || '' }
    })
    return err
  }

  const validateLimit = () => {
    const err = valiator.validate(form.limit, {
      required: true,
      errorsMessage: { required: 'This field is required.' }
    })
    setFormErrors((errors: any) => {
      return { ...errors, limit: err || '' }
    })
    return err
  }

  const validateExpiredDate = () => {
    const err = valiator.validate(form.expiresAt, {
      required: true,
      errorsMessage: { required: 'This field is required.' }
    })
    setFormErrors((errors: any) => {
      return { ...errors, expiresAt: err || '' }
    })
    return err
  }

  const isValidForm = (): boolean => {
    const arrRes = []
    arrRes.push(validateCode())
    arrRes.push(validateLimit())
    arrRes.push(validateExpiredDate())

    return arrRes.findIndex((x) => x && x.length > 0) < 0
  }

  const submit = () => {
    if (!isValidForm()) return
    alertModalRef?.current.open({
      title: 'Warning',
      content: 'Are you sure you want to edit the promo code?',
      isShowTwoButton: true,
      confirmButton: {
        label: 'Yes, do it',
        action: () => {
          const params: PromoCode.EditParams = {
            code: form.code || '',
            limit: Number(form.limit || 0),
            expiresAt: new Date(form.expiresAt).toISOString() || ''
          }
          requestEditPromoCode(promoCodeDetails?._id || '', params)
        }
      }
    })
  }

  const requestEditPromoCode = (id: string, params: PromoCode.EditParams) => {
    setIsSubmitting(true)
    promoCode.editPromoCode({
      id,
      params,
      callback: {
        onSuccess: (res) => {
          ToastControl.showSuccessMessage('You have successfully edited promo code')
          props?.edited &&
            props?.edited({
              ...promoCodeDetails,
              ...params
            })
          resetForm()
          setIsSubmitting(false)
        },
        onFailure: (err) => {
          ToastControl.showErrorMessage(err)
          setIsSubmitting(false)
        }
      }
    })
  }

  const cancel = () => {
    props?.cancelled && props?.cancelled()
  }

  return (
    <>
      <div className='border border-blue-100 rounded-lg bg-wt-primary-130'>
        <div className='flex items-center p-4 py-3 border-b border-blue-100 rounded-t-lg bg-wt-primary-130'>
          <span className='text-gray-900 font-semibold'>Promocode {props?.index} editting</span>
        </div>
        <div className='p-4 bg-wt-primary-130'>
          <div className='grid grid-cols-12 gap-4'>
            <div className='col-span-4'>
              <div className='mb-5'>
                <label className='block font-bold text-base text-wt-primary-40 mb-2'>
                  Enter Promocode <span className='text-red-500'>*</span>
                </label>
                <div className='flex items-center relative w-full'>
                  <input
                    className='block w-full p-3 px-4 font-bold text-base text-wt-primary-40 bg-wt-primary-85 border border-dashed border-wt-primary-90 rounded-lg outline-none focus:bg-white focus:border-blue-500'
                    value={form.code}
                    onChange={onChangedPromoCode}
                    onBlur={validateCode}
                  />
                </div>
                <p className='text-red-600 mt-1'>{formErrors.code}</p>
              </div>
            </div>
            <div className='col-span-4'>
              <div className='mb-5'>
                <label className='block font-bold text-base text-wt-primary-40 mb-2'>
                  Set limit number of members who can use it <span className='text-red-500'>*</span>
                </label>
                <input
                  className='form-control text-base bg-wt-primary-85 outline-none focus:bg-white focus:border-blue-500'
                  value={form.limit}
                  onChange={onChangedLimit}
                  onBlur={validateCode}
                />
                <p className='text-red-600 mt-1'>{formErrors.limit}</p>
              </div>
            </div>
            <div className='col-span-4'>
              <div className='mb-5'>
                <label className='block font-bold text-base text-wt-primary-40 mb-2'>
                  The code is valid until <span className='text-red-500'>*</span>
                </label>
                <Datepicker theme={customTheme} value={form.expiresAt} onSelectedDateChanged={onSelectedDateChanged} />
                <p className='text-red-600 mt-1'>{formErrors.expiresAt}</p>
              </div>
            </div>
          </div>
        </div>
        <div className='p-4 border-t border-blue-100'>
          <div className='w-full flex items-center'>
            <Button
              className='text-base btn btn-secondary py-3 bg-wt-primary-75 hover:bg-gray-400 font-bold text-white rounded-lg ml-auto mr-3 px-5'
              type='button'
              onClick={() => cancel()}
            >
              Cancel
            </Button>
            <Button
              className='text-base flex items-center justify-center btn bg-blue-500 hover:bg-blue-600 py-3 rounded-lg font-bold text-white'
              type='button'
              isLoading={isSubmitting}
              onClick={() => submit()}
            >
              <WtSubmitIcon className='h-5 w-5 mr-2' />
              Save
            </Button>
          </div>
        </div>
      </div>
      <AlertModal ref={alertModalRef} />
    </>
  )
}

export default EditPromoCode
