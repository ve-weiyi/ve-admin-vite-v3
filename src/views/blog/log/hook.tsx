import { onMounted, reactive, ref } from "vue"
import { Column, ElMessage, ElMessageBox, FormInstance, FormRules, TableInstance } from "element-plus"
import { defaultPaginationData, Pagination, Order, Condition, FormField, RenderType } from "@/utils/render"
import {
  createOperationLogApi,
  deleteOperationLogByIdsApi,
  deleteOperationLogApi,
  findOperationLogListApi,
  updateOperationLogApi,
} from "@/api/operation_log"
import { OperationLog } from "@/api/types"
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
      width: 80,
      align: align,
      sortable: true,
    },
    {
      key: "opt_module",
      title: "系统模块",
      dataKey: "opt_module",
      width: 100,
      align: align,
    },
    {
      key: "opt_type",
      title: "操作类型",
      dataKey: "opt_type",
      width: 100,
      align: align,
    },
    {
      key: "opt_desc",
      title: "操作描述",
      dataKey: "opt_desc",
      width: 140,
      align: align,
    },
    {
      key: "request_method",
      title: "请求方式",
      dataKey: "request_method",
      width: 100,
      align: align,
      cellRenderer: (row: any) => {
        return <el-tag type={tagType(row.request_method)}>{row.request_method}</el-tag>
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
      key: "ip_address",
      title: "登录ip",
      dataKey: "ip_address",
      width: 140,
      align: align,
    },
    {
      key: "ip_source",
      title: "登录地址",
      dataKey: "ip_source",
      width: 100,
      align: align,
    },
    {
      key: "created_at",
      title: "操作日期",
      dataKey: "created_at",
      width: 150,
      align: align,
      sortable: true,
      cellRenderer: (row: any) => {
        return (
          <div>
            <el-icon style="margin-right: 5px">
              <Timer />
            </el-icon>
            <span>{row.created_at.substring(0, 10)}</span>
          </div>
        )
      },
    },
  ]
}

function getFormFields(): FormField[] {
  return [
    {
      field: "opt_module",
      label: "操作模块",
    },
    {
      field: "opt_url",
      label: "请求地址",
    },
    {
      field: "opt_desc",
      label: "操作描述",
    },
    {
      field: "request_method",
      label: "请求方式",
      render: (field, model) => {
        return <el-tag type={tagType(model.request_method)}>{model.request_method}</el-tag>
      },
    },
    {
      field: "opt_method",
      label: "操作方法",
    },
    {
      field: "request_param",
      label: "请求参数",
    },
    {
      field: "response_data",
      label: "返回数据",
    },
    {
      field: "nickname",
      label: "操作人员",
    },
    {
      field: "created_at",
      label: "操作日期",
      render: (field, model) => {
        return (
          <div>
            <span>{model.created_at.substring(0, 10)}</span>
          </div>
        )
      },
    },
  ]
}

const defaultOrder = [{ field: "id", rule: "desc" }]

export function useTableHook() {
  // 表单数据定义
  const formFields = ref<FormField[]>(getFormFields())
  const formVisibility = ref(false)

  // 表单规则定义
  const formRef = ref<FormInstance | null>(null)
  const formData = ref<any>({})
  const formRules: FormRules = reactive({})

  // 表格加载状态
  const loading = ref(true)
  // 批量移除提示框
  const removeVisibility = ref(false)

  // 表格结构定义
  const columnFields = ref<Column[]>(getColumnFields())
  const checkedColumnFields = ref<Column[]>(columnFields.value)
  const checkAllColumns = ref(true)
  const isIndeterminate = ref(false)

  // 表格数据定义
  const tableRef = ref<TableInstance | null>(null)
  const tableData = ref<OperationLog[]>([])
  const pagination = reactive<Pagination>({ ...defaultPaginationData })
  const selectionIds = reactive<number[]>([])

  // 表搜素条件定义
  const searchFields = ref<FormField[]>(getSearchFields())
  const searchFormRef = ref<FormInstance | null>(null)
  const searchData = ref<any>({})
  const orderData = ref<Order[]>(defaultOrder)
  // 条件查询
  const conditions = reactive<Condition[]>([])
  const sorts = reactive<Order[]>(defaultOrder)

  function onSearchList() {
    console.log("onSearchList")

    loading.value = true
    conditions.length = 0
    sorts.length = 0

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

    // 排序条件
    for (const item of orderData.value) {
      sorts.push(item)
    }

    findOperationLogListApi({
      page: pagination.currentPage,
      page_size: pagination.pageSize,
      sorts: sorts,
      conditions: conditions,
    }).then((res) => {
      tableData.value = res.data.list
      pagination.total = res.data.total
      pagination.currentPage = res.data.page
      loading.value = false
    })
  }

  function onCreate(row) {
    console.log("onCreate", row)
    createOperationLogApi(row).then((res) => {
      ElMessage.success("创建成功")
      formVisibility.value = false
      onSearchList()
    })
  }

  function onUpdate(row) {
    console.log("onUpdate", row)
    updateOperationLogApi(row).then((res) => {
      ElMessage.success("更新成功")
      formVisibility.value = false
      onSearchList()
    })
  }

  function onDelete(row) {
    console.log("onDelete", row)
    deleteOperationLogApi(row.id).then((res) => {
      ElMessage.success("删除成功")
      onSearchList()
    })
  }

  function onDeleteByIds(ids: number[]) {
    console.log("onDeleteByIds", ids)
    deleteOperationLogByIdsApi(ids).then((res) => {
      ElMessage.success("批量删除成功")
      removeVisibility.value = false
      onSearchList()
    })
  }

  function onSaveForm(row) {
    formRef.value?.validate((valid: boolean, fields: any) => {
      if (valid) {
        if (row.id === 0) {
          onCreate(row)
        } else {
          onUpdate(row)
        }
      } else {
        console.error("表单校验不通过", fields)
      }
    })
  }

  function handleFormVisibility(row: any) {
    formVisibility.value = true
    resetForm(row)
  }

  // 行数据状态改变回调
  function handleStatusChange({ row, index }) {
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

  // 分页大小改变回调
  function handleSizeChange(val: number) {
    console.log(`${val} items per page`)
    pagination.pageSize = val
    onSearchList()
  }

  // 分页回调
  function handleCurrentChange(val: number) {
    console.log(`current page: ${val}`)
    pagination.currentPage = val
    onSearchList()
  }

  // 批量选择回调
  function handleSelectionChange(rows: any[]) {
    console.log("handleSelectionChange", rows)
    selectionIds.length = 0
    rows.forEach((item) => {
      selectionIds.push(item.id)
    })
  }

  /***
   * 批量排序回调
   * column是发生排序变化的列。
   * order是排序方式，有三个选项 ascending 升序、descending 降序、 null 默认排序
   * prop就是该列的prop。
   * */
  function handleSortChange({ column, prop, order }) {
    console.log("handleSortChange", prop, order)

    const item: Order = {
      field: prop,
      rule: order === "ascending" ? "asc" : "desc",
    }

    // 删除已有的key
    const newArray = orderData.value.filter((item) => item.field !== prop)
    // 将新的 [key, value] 元素添加至数组的第一个位置
    orderData.value = [item, ...newArray]
    onSearchList()
  }

  // 拖拽排序
  function handleDragChange(evt): void {
    console.log("handleDragItemChange: ", evt)
  }

  // 选择所有的列
  function handleCheckAllChange(val: boolean) {
    console.log("handleCheckAllChange ", val, columnFields.value)
    isIndeterminate.value = false
    checkedColumnFields.value = val ? columnFields.value : []
    columnFields.value.map((column) => (val ? (column.hidden = false) : (column.hidden = true)))
  }

  // 已选列表发送变化
  function handleCheckedColumnFieldsChange(element: any[]) {
    console.log("handleCheckedColumnFieldsChange ", element)
    checkAllColumns.value = element.length === columnFields.value.length
    isIndeterminate.value = element.length > 0 && !checkAllColumns.value
  }

  // 当前选择的列
  function handleCheckedColumnChange(val: boolean, element: any) {
    console.log("handleCheckedColumnChange ", val, element)
    columnFields.value.filter((item) => item.title === element.title)[0].hidden = !val
  }

  function resetForm(row) {
    if (row != null) {
      formData.value = row
    } else {
      formData.value = {}
    }
    formRef.value?.resetFields()
  }

  function resetSearch() {
    searchData.value = {}
    orderData.value = defaultOrder
    tableRef.value?.clearSort()
    tableRef.value?.clearSelection()
    onSearchList()
  }

  function resetTable() {
    checkAllColumns.value = true
    isIndeterminate.value = false
    columnFields.value = getColumnFields()
    columnFields.value.map((column) => (column.hidden = false))
    checkedColumnFields.value = columnFields.value
    console.log("columnFields", columnFields.value)
    console.log("checkedColumnFields", checkedColumnFields.value)
  }

  onMounted(() => {
    onSearchList()
  })

  return {
    removeVisibility,
    formFields,
    formVisibility,
    formRef,
    formData,
    formRules,
    searchFields,
    searchFormRef,
    searchData,
    loading,
    columnFields,
    checkedColumnFields,
    checkAllColumns,
    isIndeterminate,
    tableRef,
    tableData,
    pagination,
    selectionIds,
    onSearchList,
    onSaveForm,
    onCreate,
    onUpdate,
    onDelete,
    onDeleteByIds,
    handleFormVisibility,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange,
    handleSortChange,
    handleDragChange,
    handleCheckAllChange,
    handleCheckedColumnFieldsChange,
    handleCheckedColumnChange,
    resetForm,
    resetSearch,
    resetTable,
  }
}
