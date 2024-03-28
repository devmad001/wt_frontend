import { useEffect, useState } from 'react'
import { useAuth } from 'hooks'
import { Button } from 'ui-atoms'
import { AddNewPromoCode, AddPaymentMethod, PaymentCard, PromoCodeItem } from '.'
import { uuidv4 } from 'utils'
import { usePromoCode } from 'hooks'

const promoCodesMockup: any[] = [
  // {
  //   _id: uuidv4()
  // },
  // {
  //   _id: uuidv4()
  // }
]

function PromoCode(props: any) {
  const promoCode = usePromoCode()
  const [isSubmitting, setSubmitting] = useState(false)
  const [promoCodes, setPromoCodes] = useState(promoCodesMockup)
  const [isShowAddPromoCode, setIsShowAddPromoCode] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const params: PromoCode.ListParams = {
      key: '',
      page: 1,
      limit: 100
    }

    requestGetListPromoCode(params)
  }

  const requestGetListPromoCode = (params: PromoCode.ListParams) => {
    promoCode.getPromoCodes({
      params,
      callback: {
        onSuccess: (res) => {
          setPromoCodes(res?.items?.map((x: PromoCode.Details) => x))
        }
      }
    })
  }

  return (
    <>
      <div className='tabs-content-item'>
        <div className='p-4'>
          <div className='grid grid-cols-12 gap-4'>
            {promoCodes.map((item: any, index: number) => {
              return (
                <div key={item._id} className='col-span-12'>
                  <PromoCodeItem data={item} index={index} deleted={() => loadData()} />
                </div>
              )
            })}
            <div className='col-span-12'>
              {isShowAddPromoCode && (
                <AddNewPromoCode
                  index={promoCodes.length + 1}
                  created={() => {
                    loadData()
                    setIsShowAddPromoCode(false)
                  }}
                />
              )}
            </div>
          </div>
        </div>
        <div className='p-4 border-t border-gray-200'>
          <div className='flex'>
            <Button
              className='flex items-center btn text-base bg-wt-primary-40 hover:bg-wt-primary-45 py-3 rounded-lg font-bold text-white ml-auto'
              type='button'
              onClick={() => {
                setIsShowAddPromoCode(true)
              }}
            >
              Add new Promo code
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default PromoCode
