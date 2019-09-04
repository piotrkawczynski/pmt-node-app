export interface CreateCommentBody {
  id: number
  issueId: number
  authorId: number
  description: string
  attachmentId: number
  permissionId: number
}
