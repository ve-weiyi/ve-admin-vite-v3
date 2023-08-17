import { FormField, RenderType } from "@/utils/render"
import { Column } from "element-plus"
import { Timer } from "@element-plus/icons-vue"

const align = "center"

const methodOpt = [
  {
    label: "GET",
    value: "GET",
  },
  {
    label: "POST",
    value: "POST",
  },
  {
    label: "PUT",
    value: "PUT",
  },
  {
    label: "DELETE",
    value: "DELETE",
  },
  {
    label: "NULL",
    value: "",
  },
]

function getSearchFields(): FormField[] {
  return [
    {
      type: RenderType.Input,
      label: "名称",
      field: "name",
      flag: "and",
      rule: "like",
    },
    {
      type: RenderType.Select,
      label: "请求方法",
      field: "method",
      flag: "and",
      rule: "=",
      options: methodOpt,
    },
  ]
}

function getColumnFields(onChange: (row: any, event: string) => void): Column[] {
  return [
    {
      key: "selection",
      type: "selection",
      title: "批量操作",
      width: 60,
      align: align,
      hidden: true,
    },
    {
      key: "id",
      title: "id",
      dataKey: "id",
      width: 100,
      align: align,
      sortable: true,
    },
    {
      key: "name",
      title: "名称",
      dataKey: "name",
      width: 120,
      align: align,
    },
    {
      key: "icon",
      title: "图标",
      dataKey: "icon",
      width: 0,
      align: align,
      cellRenderer: (row: any) => {
        return (
          <div>
            <el-icon>
              <component is={row.icon} />
            </el-icon>
            {row.icon}
          </div>
        )
      },
    },
    {
      key: "rank",
      title: "排序",
      dataKey: "rank",
      width: 80,
      align: align,
      sortable: true,
    },
    {
      key: "path",
      title: "路径",
      dataKey: "path",
      width: 0,
      align: align,
    },
    {
      key: "is_hidden",
      title: "隐藏",
      dataKey: "is_hidden",
      width: 120,
      align: align,
      cellRenderer: (row: any) => {
        if (row.path === "") {
          return <div></div>
        }
        return (
          <el-switch
            v-model={row.is_hidden}
            active-color="#13ce66"
            inactive-color="#F4F4F5"
            active-value={true}
            inactive-value={false}
            onClick={() => onChange(row, "is_hidden")}
          />
        )
      },
    },
    {
      key: "created_at",
      title: "创建时间",
      dataKey: "created_at",
      width: 0,
      align: align,
      sortable: true,
      cellRenderer: (row: any) => {
        return (
          <div>
            <el-icon style={"margin-right: 2px"}>
              <Timer />
            </el-icon>
            <span>{new Date(row.created_at).toLocaleDateString()}</span>
          </div>
        )
      },
    },
    {
      key: "operation",
      title: "操作",
      dataKey: "operation",
      width: 150,
      align: align,
      cellRenderer: (row: any) => {
        return (
          <div>
            <el-button
              class="operation-button"
              text
              type="primary"
              size="small"
              icon="Plus"
              onClick={() => onChange(row, "add")}
            >
              新增
            </el-button>
            <el-button
              class="operation-button"
              text
              type="primary"
              size="small"
              icon="editPen"
              onClick={() => onChange(row, "edit")}
            >
              修改
            </el-button>
            <el-popconfirm title="确定删除吗？" onConfirm={() => onChange(row, "delete")}>
              {{
                reference: () => (
                  <el-button text type="danger" size="small" class="operation-button" icon="delete">
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

function getFormFields(row: any): FormField[] {
  return [
    {
      type: RenderType.Radio,
      field: "name",
      label: "菜单类型",
      default: "目录",
      options: [
        {
          label: "目录",
          value: 1,
        },
        {
          label: "一级菜单",
          value: 0,
        },
      ],
    },
    {
      type: RenderType.Input,
      field: "name",
      label: "菜单名称",
    },
    {
      type: RenderType.Input,
      field: "icon",
      label: "菜单图标",
    },
    {
      type: RenderType.Input,
      field: "path",
      label: "菜单路径",
    },
    {
      type: RenderType.Number,
      field: "rank",
      label: "显示排序",
      default: 1,
    },
    {
      type: RenderType.Radio,
      field: "is_hidden",
      label: "显示状态",
      default: "1",
      options: [
        {
          label: "显示",
          value: 1,
        },
        {
          label: "隐藏",
          value: 0,
        },
      ],
    },
  ]
}

export { getSearchFields, getColumnFields, getFormFields }
