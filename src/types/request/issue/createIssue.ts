export interface CreateIssueBody {
  id?: number
  code: number
  reviewerId: number
  assigneeId: number
  authorId: number
  title: string
  description: string
  tagId: number
  projectId: number
  statusId: number
  order: number
}
