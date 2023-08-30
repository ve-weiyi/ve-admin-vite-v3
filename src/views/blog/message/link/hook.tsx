import { ComponentInternalInstance, getCurrentInstance, onMounted, reactive, ref } from "vue"
import { Column, ElMessage, ElMessageBox, FormInstance, FormRules, TableInstance } from "element-plus"
import { defaultPaginationData, Pagination, Sort, Condition, FormField, RenderType } from "@/utils/render"
import { FixedDir } from "element-plus/es/components/table-v2/src/constants"
import { ElTag } from "element-plus"
import { Timer } from "@element-plus/icons-vue"

import {
  createFriendLinkApi,
  deleteFriendLinkByIdsApi,
  deleteFriendLinkApi,
  findFriendLinkListApi,
  updateFriendLinkApi,
} from "@/api/friend_link"
import { FriendLink } from "@/api/types"

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
      key: "link_avatar",
      title: "链接头像",
      dataKey: "link_avatar",
      width: 100,
      align: align,
      cellRenderer: (row: any) => {
        return (
          <div>
            <img src={row.link_avatar} width="40" height="40" />
          </div>
        )
      },
    },
    {
      key: "link_name",
      title: "链接名称",
      dataKey: "link_name",
      width: 120,
      align: align,
    },
    {
      key: "link_address",
      title: "链接地址",
      dataKey: "link_address",
      width: 120,
      align: align,
    },
    {
      key: "link_intro",
      title: "链接介绍",
      dataKey: "link_intro",
      width: 0,
      align: align,
      cellRenderer: (row: any) => {
        return (
          <div>
            <div v-html={row.link_intro}></div>
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
      label: "链接名称",
      field: "link_name",
      flag: "and",
      rule: "like",
    },
  ]
}

// 表单字段
function getFormFields(model: FriendLink): FormField[] {
  return [
    {
      type: RenderType.Input,
      field: "link_avatar",
      label: "链接头像",
    },
    {
      type: RenderType.Input,
      field: "link_name",
      label: "链接名称",
    },
    {
      type: RenderType.Input,
      field: "link_address",
      label: "链接地址",
    },
    {
      type: RenderType.Input,
      field: "link_intro",
      label: "链接介绍",
    },
  ]
}

function handleApi(event: string, data: any) {
  console.log("event", event)
  switch (event) {
    case "create":
      return createFriendLinkApi(data)
    case "update":
      return updateFriendLinkApi(data)
    case "delete":
      return deleteFriendLinkApi(data)
    case "deleteByIds":
      return deleteFriendLinkByIdsApi(data)
    case "list":
      return findFriendLinkListApi(data)
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
