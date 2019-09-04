interface UpdateStatus {
  id: number
  name: string
  order: number
}

export interface UpdateStatusOrderBody {
  firstStatus: UpdateStatus
  secondStatus: UpdateStatus
}
