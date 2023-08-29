import { ComponentInternalInstance, getCurrentInstance, onMounted, reactive, ref } from "vue"
import { Column, ElMessage, ElMessageBox, FormInstance, FormRules, TableInstance } from "element-plus"
import { defaultPaginationData, Pagination, Sort, Condition, FormField, RenderType } from "@/utils/render"
import { FixedDir } from "element-plus/es/components/table-v2/src/constants"
import { ElTag } from "element-plus"
import { Timer } from "@element-plus/icons-vue"

import {
  createTagApi,
  deleteTagByIdsApi,
  deleteTagApi,
  findTagListApi,
  updateTagApi,
} from "@/api/tag"
import { Tag } from "@/api/types"

const align = "center"

// 表格展示列信息
function getColumnFields(): Column[] {
  const instance = getCurrentInstance()
  return [
    {
      key: "selection",
      type: "selection",
      title: "批量操作",
      width: 60,
      align: align,
    },
    {
      key: "id",
      title: "id",
      dataKey: "id",
      width: 70,
      align: align,
      sortable: true,
    },
    {
      key: "tag_name",
      title: "标签名称",
      dataKey: "tag_name",
      width: 0,
      align: align,
      cellRenderer: (row: any) => {
        return (
          <div>
            <el-tag>{row.tag_name}</el-tag>
          </div>
        )
      }
    },
    {
      key: "article_count",
      title: "文章数量",
      dataKey: "article_count",
      width: 0,
      align: align,
    },
    {
      key: "created_at",
      title: "创建时间",
      dataKey: "created_at",
      width: 170,
      align: align,
      sortable: true,
      cellRenderer: (row: any) => {
        return (
          <div>
            <el-icon style="margin-right: 2px">
              <Timer />
            </el-icon>
            <span>{new Date(row.created_at).toLocaleString()}</span>
          </div>
        )
      },
    },
    {
      key: "operation",
      title: "操作",
      width: 140,
      align: align,
      cellRenderer: (row: any) => {
        return (
          <div>
            {
              <el-button type="primary" size="default" onClick={() => instance.exposed.handleFormVisibility(row)}>
                编辑
              </el-button>
            }
            <el-popconfirm title="确定删除吗？" onConfirm={() => instance.exposed.onDelete(row)}>
              {{
                reference: () => (
                  <el-button type="danger" size="default">
                    删除
                  </el-button>
                ),
              }}
            </el-popconfirm>
          </div>
        )
      },
    },
  ]
}

// 搜索条件
function getSearchFields(): FormField[] {
  return [
    {
      type: RenderType.Input,
      label: "标签名称",
      field: "tag_name",
      flag: "and",
      rule: "like",
    },
  ]
}

// 表单字段
function getFormFields(model: Tag): FormField[] {
  return [
    {
      type: RenderType.Input,
      field: "tag_name",
      label: "标签名称",
    },
  ]
}

function handleApi(event: string, data: any) {
  console.log("event", event)
  switch (event) {
    case "create":
      return createTagApi(data)
    case "update":
      return updateTagApi(data)
    case "delete":
      return deleteTagApi(data)
    case "deleteByIds":
      return deleteTagByIdsApi(data)
    case "list":
      return findTagListApi(data)
    default:
      return
  }
}

export function useTableHook() {
  return {
    getColumnFields,
    getSearchFields,
    getFormFields,
    handleApi,
  }
}
