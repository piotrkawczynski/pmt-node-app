export interface UpdateIssueBody {
  id: number
  reviewerId: number
  assigneeId: number
  title: string
  description: string
  tagId: number
  statusId: number
  attachmentUrls: string[]
}
