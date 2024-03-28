declare namespace FinAware {
  export interface PostCaseDetailsParams {
    user_id: string
    name: string
    originalName: string
    size?: number | string
    threatTagging: string
    publicCorruptionTag: string
    description: string
    case_creation_date: string
    file_urls: (string | undefined)[]
    case_id?: string
  }
}
