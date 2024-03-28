import axios from 'axios'
import { CORE_FINAWARE_API } from 'constant'
import queryString from 'query-string'

const header: any = { Accept: '*', 'Content-Type': 'application/pdf', Authorization: null }

const url = (path: string): string => {
  return CORE_FINAWARE_API + path
}

export const useFinAwareAPI = () => {
  const postCaseDetails = (case_id: string, params: FinAware.PostCaseDetailsParams): Promise<any> =>
    axios.post(url(`/api/v1/case/${case_id}/post_case_details`), params, header)

  const getCaseDetails = (case_id: string, fin_session_id: string): Promise<any> =>
    axios.get(url(`/api/v1/case/${case_id}/get_case_details?fin_session_id=${fin_session_id}`), header)

  const startCaseProcessing = (case_id: string, fin_session_id: string): Promise<any> =>
    axios.get(url(`/api/v1/case/${case_id}/start_case_processing?fin_session_id=${fin_session_id}`), header)

  const getCaseProcessingStatus = (case_id: string): Promise<any> =>
    axios.get(url(`/api/v1/case/${case_id}/get_case_processing_status`), header)

  const getListUserFinshsedCases = (user_id: string, fin_session_id: string): Promise<any> =>
    axios.get(
      url(`/api/v1/user/list_user_finished_cases_ids?user_id=${user_id}&fin_session_id=${fin_session_id}`),
      header
    )

  const getListUserStatus = (user_id: string, fin_session_id: string): Promise<any> =>
    axios.get(url(`/api/v1/user/list_cases_statuses?user_id=${user_id}&fin_session_id=${fin_session_id}`), header)

  const getCaseReport = (case_id: string): Promise<any> =>
    axios.get(url(`/api/v1/case/${case_id}/get_case_report`), header)

  const getButtons = (case_id: string, params: any): Promise<any> => {
    const param_str = queryString.stringify(params, {
      arrayFormat: 'bracket'
    })
    return axios.get(url(`/api/v1/case/${case_id}/get_buttons?${param_str}`), header)
  }
  const postButton = (case_id: string, params: any): Promise<any> =>
    axios.post(url(`/api/v1/case/${case_id}/create_button`), params, header)
    
  const getButtonHandler = (case_id: string, params: any): Promise<any> => {
    const param_str = queryString.stringify(params, {
      arrayFormat: 'bracket'
    })
    return axios.get(url(`/api/v1/case/${case_id}/button_handler?${param_str}`), header)
  }
  const deleteButton = (case_id: string, button_id: any, fin_session_id: string, params: any): Promise<any> =>
    axios.post(url(`/api/v1/case/${case_id}/delete_button/${button_id}?fin_session_id=${fin_session_id}`), params,header)

  const getSquareAPI = ({ user_id, fin_session_id, caseId }: any): Promise<any> => {
    const param_str = queryString.stringify(
      { fin_session_id, user_id },
      {
        arrayFormat: 'bracket'
      }
    )
    return axios.get(url(`/api/v1/case/${caseId}/square_data?${param_str}`), header)
  }

  const getQuery = (case_id: string, params: any): Promise<any> => {
    const param_str = queryString.stringify(params, {
      arrayFormat: 'bracket'
    })
    return axios.get(url(`/api/v1/case/${case_id}/ask?${param_str}`), header)
  }

  const postFeedback = (case_id: string, params: any): Promise<any> =>
    axios.post(url(`/api/v1/case/${case_id}/submit_feedback`), params, header)

  return {
    postCaseDetails,
    startCaseProcessing,
    getCaseProcessingStatus,
    getCaseReport,
    getCaseDetails,
    getListUserFinshsedCases,
    getListUserStatus,
    getButtonHandler,
    getSquareAPI,
    getButtons,
    postButton,
    deleteButton,
    getQuery,
    postFeedback
  }
}
