import { ComponentInternalInstance, getCurrentInstance, onMounted, reactive, ref } from "vue"
import { Column, ElMessage, ElMessageBox, FormInstance, FormRules, TableInstance } from "element-plus"
import { defaultPaginationData, Pagination, Sort, Condition, FormField, RenderType } from "@/utils/render"
import { FixedDir } from "element-plus/es/components/table-v2/src/constants"
import { ElTag } from "element-plus"
import { Timer } from "@element-plus/icons-vue"

import {
  createRemarkApi,
  deleteRemarkByIdsApi,
  deleteRemarkApi,
  findRemarkListApi,
  updateRemarkApi,
} from "@/api/remark"
import { Remark } from "@/api/types"

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
      key: "avatar",
      title: "头像",
      dataKey: "avatar",
      width: 80,
      align: align,
      cellRenderer: (row: any) => {
        return (
          <div>
            <img src={row.avatar} width="40" height="40" />
          </div>
        )
      },
    },
    {
      key: "message_content",
      title: "留言内容",
      dataKey: "message_content",
      width: 140,
      align: align,
      cellRenderer: (row: any) => {
        return (
          <div>
           <div v-html={row.message_content}></div>
          </div>
        )
      }
    },
    {
      key: "ip_address",
      title: "IP地址",
      dataKey: "ip_address",
      width: 140,
      align: align,
    },
    {
      key: "ip_source",
      title: "IP来源",
      dataKey: "ip_source",
      width: 0,
      align: align,
    },
    {
      key: "is_review",
      title: "状态",
      dataKey: "is_review",
      width: 80,
      align: align,
      cellRenderer: (row: any) => {
        return (
          <div>
            <span>
              {row.is_review === true && <ElTag type="success">正常</ElTag>}
              {row.is_review === false && <ElTag type="warning">审核中</ElTag>}
            </span>
          </div>
        )
      },
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
            {row.is_review === false && (
              <el-button type="success" size="default" onClick={() => instance.exposed.handleFormVisibility(row)}>
                通过
              </el-button>
            )}
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
      label: "用户昵称",
      field: "nickname",
      flag: "and",
      rule: "like",
    },
  ]
}

// 表单字段
function getFormFields(model: Remark): FormField[] {
  return []
}

function handleApi(event: string, data: any) {
  console.log("event", event)
  switch (event) {
    case "create":
      return createRemarkApi(data)
    case "update":
      return updateRemarkApi(data)
    case "delete":
      return deleteRemarkApi(data)
    case "deleteByIds":
      return deleteRemarkByIdsApi(data)
    case "list":
      return findRemarkListApi(data)
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
