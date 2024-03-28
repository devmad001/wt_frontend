import { useFinAwareAPI } from 'api'
import { Accordion } from 'flowbite-react'
import { useEffect, useState } from 'react'

interface ICaseAnalysisBox {
  case_id?: string | null
}

const CaseAnalysisBox: React.FC<ICaseAnalysisBox> = ({ case_id }) => {
  const finAwareAPI = useFinAwareAPI()
  const [reportData, setReportData] = useState<any>(null)

  useEffect(() => {
    if (!case_id) return
    finAwareAPI.getCaseReport(case_id).then((res) => {
      if (!!res?.data?.data) setReportData(res?.data?.data)
      else setReportData(null)
    })
  }, [case_id])

  return (
    <Accordion alwaysOpen className='base-accordion divide-wt-primary-90 mb-4 divide-y-1' collapseAll>
      <Accordion.Panel>
        <Accordion.Title className='base-accordion-title'>{case_id || ''}</Accordion.Title>
        <Accordion.Content className='base-accordion-content'>
          <div className='w-full'>
            <table className='w-full'>
              <thead>
                <tr>
                  <th className='w-40 sm:w-1/3'></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Account Holder Name</td>
                  <td>{reportData?.account_holder_name || ''}</td>
                </tr>
                <tr>
                  <td>Account Holder Address</td>
                  <td>{reportData?.account_holder_address || ''}</td>
                </tr>
                <tr>
                  <td>Number of Transactions</td>
                  <td>{reportData?.number_of_transactions || ''}</td>
                </tr>
                <tr>
                  <td>Opening Balance</td>
                  <td>{reportData?.opening_balance || ''}</td>
                </tr>
                <tr>
                  <td>Closing Balance</td>
                  <td>{reportData?.closing_balance || ''}</td>
                </tr>
                <tr>
                  <td>Number of Inflows</td>
                  <td>{reportData?.number_of_inflows || ''}</td>
                </tr>
                <tr>
                  <td>Number of Outflows</td>
                  <td>{reportData?.number_of_outflows || ''}</td>
                </tr>
                <tr>
                  <td>Inflow Amount</td>
                  <td>{reportData?.inflow_amount || ''}</td>
                </tr>
                <tr>
                  <td>Outflow Amount</td>
                  <td>{reportData?.outflow_amount || ''}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Accordion.Content>
      </Accordion.Panel>
    </Accordion>
  )
}

export default CaseAnalysisBox
