import { onMounted, reactive, ref } from "vue"
import { Column, ElMessage, ElMessageBox, FormInstance, FormRules } from "element-plus"
import { defaultPaginationData, Pagination, Condition, Order, FormField, RenderType, formRender } from "@/utils/render"
import {
  createOperationApi,
  deleteByIdsOperationApi,
  deleteOperationApi,
  findOperationListApi,
  updateOperationApi,
} from "@/api/operation"
import { Timer } from "@element-plus/icons-vue"

const align = "center"

const tagType = (type) => {
  switch (type) {
    case "GET":
      return ""
    case "POST":
      return "success"
    case "PUT":
      return "warning"
    case "DELETE":
      return "danger"
    default:
      return ""
  }
}

const options = [
  {
    value: "新增",
    label: "新增",
  },
  {
    value: "修改",
    label: "修改",
  },
  {
    value: "删除",
    label: "删除",
  },
  {
    value: "查询",
    label: "查询",
  },
  {
    value: "新增或修改",
    label: "新增或修改",
  },
]

function getSearchFields(): FormField[] {
  return [
    {
      type: RenderType.Input,
      label: "系统模块",
      field: "opt_module",
      flag: "and",
      rule: "like",
    },
    {
      type: RenderType.Select,
      label: "操作类型",
      field: "opt_type",
      flag: "and",
      rule: "=",
      options: options,
    },
  ]
}

function getColumnFields(): Column[] {
  return [
    {
      type: "selection",
      width: 60,
      align: align,
    },
    {
      key: "id",
      title: "id",
      dataKey: "id",
      width: 60,
      align: align,
    },
    {
      key: "optModule",
      title: "系统模块",
      dataKey: "optModule",
      width: 100,
      align: align,
    },
    {
      key: "optType",
      title: "操作类型",
      dataKey: "optType",
      width: 100,
      align: align,
    },
    {
      key: "optDesc",
      title: "操作描述",
      dataKey: "optDesc",
      width: 100,
      align: align,
    },
    {
      key: "requestMethod",
      title: "请求方式",
      dataKey: "requestMethod",
      width: 100,
      align: align,
      cellRenderer: (row: any) => {
        return <el-tag type={tagType(row.requestMethod)}>{row.requestMethod}</el-tag>
      },
    },
    {
      key: "nickname",
      title: "操作人员",
      dataKey: "nickname",
      width: 100,
      align: align,
    },
    {
      key: "ipAddress",
      title: "登录ip",
      dataKey: "ipAddress",
      width: 120,
      align: align,
    },
    {
      key: "ipSource",
      title: "登录地址",
      dataKey: "ipSource",
      width: 150,
      align: align,
    },
    {
      key: "createdAt",
      title: "操作日期",
      dataKey: "createdAt",
      width: 150,
      align: align,
      cellRenderer: (row: any) => {
        return (
          <div>
            <el-icon style="margin-right: 5px">
              <Timer />
            </el-icon>
            <span>{row.createdAt.substring(0, 10)}</span>
          </div>
        )
      },
    },
  ]
}

function getFormFields(): FormField[] {
  return [
    {
      field: "optModule",
      label: "操作模块",
    },
    {
      field: "optUrl",
      label: "请求地址",
    },
    {
      field: "optDesc",
      label: "操作描述",
    },
    {
      field: "requestMethod",
      label: "请求方式",
      render: (field, model) => {
        return <el-tag type={tagType(model.requestMethod)}>{model.requestMethod}</el-tag>
      },
    },
    {
      field: "optMethod",
      label: "操作方法",
    },
    {
      field: "requestParam",
      label: "请求参数",
    },
    {
      field: "responseData",
      label: "返回数据",
    },
    {
      field: "nickname",
      label: "操作人员",
    },
    {
      field: "createdAt",
      label: "操作日期",
      render: (field, model) => {
        return (
          <div>
            <span>{model.createdAt.substring(0, 10)}</span>
          </div>
        )
      },
    },
  ]
}

export function useTableHook() {
  // 页面数据定义
  const columnFields = ref<Column[]>(getColumnFields())
  const searchFields = ref<FormField[]>(getSearchFields())
  const formFields = ref<FormField[]>(getFormFields())

  // 数据绑定
  const removeVisibility = ref(false)
  const addOrEditVisibility = ref(false)

  // 表格加载状态
  const loading = ref(true)
  // 表单数据定义
  const formRef = ref<FormInstance | null>(null)
  const formData = ref<any>({})
  const formRules: FormRules = reactive({})

  // 搜索表单数据定义
  const searchFormRef = ref<FormInstance | null>(null)
  const searchData = ref<any>({})

  // 表格数据定义
  const tableData = ref([])
  const selectionIds = reactive([])
  const pagination = reactive({ ...defaultPaginationData })

  // 条件查询
  const conditions = reactive<Condition[]>([])
  const orders = reactive<Order[]>([])

  const resetForm = (row) => {
    if (row != null) {
      formData.value = row
    } else {
      formData.value = {}
    }
    formRef.value?.resetFields()
  }

  const resetSearch = () => {
    searchData.value = {}
    handleSearch()
  }

  const applySearch = () => {
    conditions.length = 0
    orders.length = 0

    // 搜索条件
    searchFields.value.forEach((item) => {
      const value = searchData.value[item.field]
      if (value != null) {
        conditions.push({
          flag: item.flag,
          field: item.field,
          value: value,
          rule: item.rule,
        })
      }
    })
    // 倒序
    orders.push({
      field: "id",
      rule: "desc",
    })
  }

  function handleSearch() {
    applySearch()

    loading.value = true
    findOperationListApi({
      page: pagination.currentPage,
      page_size: pagination.pageSize,
      orders: orders,
      conditions: conditions,
    }).then((res) => {
      tableData.value = res.data.list
      pagination.total = res.data.total
      pagination.currentPage = res.data.page
      loading.value = false
    })
  }

  function handleSave(row) {
    formRef.value?.validate((valid: boolean, fields: any) => {
      if (valid) {
        if (row.id === 0) {
          handleCreate(row)
        } else {
          handleUpdate(row)
        }
      } else {
        console.error("表单校验不通过", fields)
      }
    })
  }

  function handleCreate(row) {
    console.log("handleCreate", row)
    createOperationApi(row).then((res) => {
      ElMessage.success("创建成功")
      addOrEditVisibility.value = false
      handleSearch()
    })
  }

  function handleUpdate(row) {
    console.log("handleUpdate", row)
    updateOperationApi(row).then((res) => {
      ElMessage.success("更新成功")
      addOrEditVisibility.value = false
      handleSearch()
    })
  }

  function handleDelete(row) {
    console.log("handleDelete", row)
    deleteOperationApi(row).then((res) => {
      ElMessage.success("删除成功")
      removeVisibility.value = false
      handleSearch()
    })
  }

  function handleDeleteByIds(ids: number[]) {
    console.log("handleDeleteByIds", ids)
    deleteByIdsOperationApi(ids).then((res) => {
      ElMessage.success("批量删除成功")
      removeVisibility.value = false
      handleSearch()
    })
  }

  // 分页大小改变回调
  function handleSizeChange(val: number) {
    console.log(`${val} items per page`)
    pagination.pageSize = val
    handleSearch()
  }

  // 分页回调
  function handleCurrentChange(val: number) {
    console.log(`current page: ${val}`)
    pagination.currentPage = val
    handleSearch()
  }

  // 批量选择回调
  function handleSelectionChange(rows: any[]) {
    console.log("handleSelectionChange", rows)
    selectionIds.length = 0
    rows.forEach((item) => {
      selectionIds.push(item.id)
    })
  }

  // 行数据状态改变回调
  function onChange({ row, index }) {
    ElMessageBox.confirm(
      `确认要<strong>${row.status === 0 ? "停用" : "启用"}</strong><strong style="color:var(--el-color-primary)">${
        row.username
      }</strong>用户吗?`,
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        dangerouslyUseHTMLString: true,
        draggable: true,
      }
    )
      .then(() => {
        ElMessage({
          message: "已成功修改用户状态",
          type: "success",
        })
      })
      .catch(() => {
        row.status === 0 ? (row.status = 1) : (row.status = 0)
      })
  }

  const onAddOrEdit = (row: any) => {
    addOrEditVisibility.value = true
    resetForm(row)
  }

  onMounted(() => {
    handleSearch()
  })

  return {
    loading,
    removeVisibility,
    addOrEditVisibility,
    formRef,
    formData,
    formRules,
    searchFormRef,
    searchData,
    tableData,
    selectionIds,
    pagination,
    resetForm,
    resetSearch,
    handleSearch,
    handleSave,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleDeleteByIds,
    onChange,
    onAddOrEdit,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange,
    columnFields,
    searchFields,
    formFields,
  }
}
