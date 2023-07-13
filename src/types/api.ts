interface Page {
  page?: number
  page_size?: number
  orders?: Order[]
  conditions?: Condition[]
}

export interface Order {
  field: string
  rule: string
}

export interface Condition {
  flag?: string
  field: string
  value: any
  rule: string
}
