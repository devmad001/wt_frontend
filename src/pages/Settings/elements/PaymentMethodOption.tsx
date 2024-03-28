import { WtChooseToolChecked, WtChooseToolUncheck, WtMasterCard, WtVisaCard } from 'ui-atoms/Icons'

function PaymentMethodOption(props: any) {
  const cardStyles = () => {
    return [
      'flex items-center p-4 border rounded-lg',
      props?.isChecked ? 'bg-white border-blue-500' : 'bg-wt-primary-110 border-wt-primary-110',
      props?.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
    ]
      .filter(Boolean)
      .join(' ')
  }

  const iconStyle = () => {
    return ['mr-2', props?.isChecked ? 'text-blue-500' : 'text-wt-primary-40'].filter(Boolean).join(' ')
  }

  const labelStyle = () => {
    return ['font-semibold text-lg', props?.isChecked ? 'text-gray-900' : 'text-wt-primary-40']
      .filter(Boolean)
      .join(' ')
  }

  return (
    <>
      <div
        className={cardStyles()}
        onClick={() => {
          !props?.disabled && props?.onClick && props?.onClick()
        }}
      >
        <div className='flex-1'>
          <div className='flex items-center'>
            <div className={iconStyle()}>{props?.data?.icon}</div>
            <label className={labelStyle()}>{props?.data?.label}</label>
          </div>
        </div>
        <div className='flex items-center'>
          {props?.isChecked ? <WtChooseToolChecked className='w-6 h-6' /> : <WtChooseToolUncheck className='w-6 h-6' />}
        </div>
      </div>
    </>
  )
}

export default PaymentMethodOption
