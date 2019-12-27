export interface CreateIssueBody {
  id?: number
  reviewerId: number
  assigneeId: number
  title: string
  description: string
  tagId: number
  projectId: number
  statusId: number
  sprintId: number
}
