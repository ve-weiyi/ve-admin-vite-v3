import { VNode, Ref, toRef } from "vue"

/** 分页请求参数 */
interface Page {
  page?: number
  page_size?: number
  sorts?: Sort[]
  conditions?: Condition[]
}

export interface Sort {
  field: string
  order: string
}

export interface Condition {
  flag?: string
  field: string
  value?: any
  rule?: "like" | "=" | ">" | "<" | string
}

/** 表格分页参数 */
export interface Pagination {
  total?: number
  currentPage?: number
  pageSizes?: number[]
  pageSize?: number
  layout?: string
}

/** 默认的分页参数 */
export const defaultPaginationData: Pagination = {
  total: 0,
  currentPage: 1,
  pageSizes: [10, 20, 50],
  pageSize: 10,
  layout: "total, sizes, prev, pager, next, jumper",
}

export interface FormField {
  type?: RenderType
  render?: (field: FormField, model: any) => VNode

  label: string
  field: string
  default?: any
  // value?: any
  placeholder?: string
  options?: Option[]
  flag?: string
  rule?: string
}

export enum RenderType {
  Input = "input",
  Select = "select",
  Tag = "tag",
  Radio = "radio",
  Number = "number",
}

interface Option {
  // 展示的标签
  label: string
  // 选择后的值，也做key使用
  value: string | number
}

export function builderFormRender(field: FormField, model: any): VNode {
  if (field.render) {
    return field.render(field, model)
  }

  return formRender(field, model)
}

export function formRender(field: FormField, model: any): VNode {
  switch (field.type) {
    case RenderType.Input:
      return <el-input v-model={model[field.field]} clearable placeholder={`请输入${field.label}`} />
    case RenderType.Select:
      return (
        <el-select v-model={model[field.field]} placeholder={`请选择${field.label}`}>
          {field.options.map((item) => (
            <el-option key={item.value} label={item.label} value={item.value} />
          ))}
        </el-select>
      )
    case RenderType.Tag:
      return <el-tag type={model[field.field]}>{model[field.field]}</el-tag>
    case RenderType.Radio:
      return (
        <el-radio-group v-model={model[field.field]} >
          {field.options.map((item) => (
            <el-radio key={item.value} label={item.value}>
              {item.label}
            </el-radio>
          ))}
        </el-radio-group>
      )
    case RenderType.Number:
      return (
        <el-input-number
          v-model={model[field.field]}
          model-value={field.default}
          controls-position="right"
          placeholder={`${field.label}`}
        />
      )
    default:
      return <div style="width: 100%">{model[field.field]}</div>
  }
}
