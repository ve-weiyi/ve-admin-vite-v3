import { onMounted, reactive, ref, VNode } from "vue"
import { Column, ElMessage, ElMessageBox, FormInstance, FormRules, TableInstance } from "element-plus"
import { defaultPaginationData, Pagination, Sort, Condition, FormField, RenderType } from "@/utils/render"
import { createApiApi, deleteApiByIdsApi, deleteApiApi, updateApiApi, findApiListDetailsApi } from "@/api/api"
import { Api, ApiDetails } from "@/api/types"
import { Timer } from "@element-plus/icons-vue"
import { assign } from "xe-utils"
import { an } from "vitest/dist/types-198fd1d9"

const align = "center"

type changeEvent = "traceable" | "add" | "delete" | "edit"

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

function getColumnFields(onChange: (row: any, event: changeEvent) => void): Column[] {
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
      key: "path",
      title: "路径",
      dataKey: "path",
      width: 0,
      align: align,
    },
    {
      key: "method",
      title: "方法",
      dataKey: "method",
      width: 120,
      align: align,
      cellRenderer: (row: any) => {
        return <el-tag type={tagType(row.method)}>{row.method}</el-tag>
      },
    },
    {
      key: "traceable",
      title: "是否追溯操作",
      dataKey: "traceable",
      width: 120,
      align: align,
      cellRenderer: (row: any) => {
        return (
          <el-switch
            v-model={row.traceable}
            active-color="#13ce66"
            inactive-color="#F4F4F5"
            active-value={1}
            inactive-value={0}
            onClick={() => onChange(row, "traceable")}
          />
        )
      },
    },
    {
      key: "created_at",
      title: "操作日期",
      dataKey: "created_at",
      width: 0,
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

function getFormFields(): FormField[] {
  return [
    {
      type: RenderType.Input,
      field: "name",
      label: "接口名称",
    },
    {
      type: RenderType.Input,
      field: "path",
      label: "接口路径",
    },
    {
      type: RenderType.Radio,
      field: "method",
      label: "请求方式",
      options: methodOpt,
    },
  ]
}

const defaultOrder = { id: "desc" }

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
  const columnFields = ref<Column[]>([])
  const checkedColumnFields = ref<Column[]>([])
  const checkAllColumns = ref(true)
  const isIndeterminate = ref(false)

  // 表格数据定义
  const tableRef = ref<TableInstance | null>(null)
  const tableData = ref<ApiDetails[]>([])
  const pagination = reactive<Pagination>({ ...defaultPaginationData })
  const selectionIds = reactive<number[]>([])

  // 表搜素条件定义
  const searchFields = ref<FormField[]>(getSearchFields())
  const searchFormRef = ref<FormInstance | null>(null)
  // 搜索条件,{k:v}
  const searchData = ref<any>({})
  // 排序条件,{k:v}
  const orderData = ref<any>(defaultOrder)
  // 条件查询 (key,value)
  const conditions = reactive<Condition[]>([])
  const sorts = reactive<Sort[]>([])

  function onSearchList() {
    console.log("onSearchList", searchData.value, orderData.value)

    conditions.length = 0
    sorts.length = 0

    // 搜索条件
    for (const key in searchData.value) {
      const item = searchFields.value[key]
      const value = searchData.value[key]
      conditions.push({
        flag: item?.flag || "and",
        field: key,
        value: value,
        rule: item?.rule || "=",
      })
    }

    // 排序条件
    for (const key in orderData.value) {
      const value = orderData.value[key]
      sorts.push({
        field: key,
        order: value,
      })
    }

    loading.value = true
    findApiListDetailsApi({
      // page: pagination.currentPage,
      // page_size: pagination.pageSize,
      sorts: sorts,
      conditions: conditions,
    }).then((res) => {
      tableData.value = res.data.list
      pagination.currentPage = res.data.page
      // pagination.pageSize = res.data.page_size
      pagination.total = res.data.total
      loading.value = false
    })
  }

  function onCreate(row) {
    console.log("onCreate", row)
    createApiApi(row).then((res) => {
      ElMessage.success("创建成功")
      formVisibility.value = false
      onSearchList()
    })
  }

  function onUpdate(row) {
    console.log("onUpdate", row)
    updateApiApi(row).then((res) => {
      ElMessage.success("更新成功")
      formVisibility.value = false
      onSearchList()
    })
  }

  function onDelete(row) {
    console.log("onDelete", row)
    deleteApiApi(row.id).then((res) => {
      ElMessage.success("删除成功")
      onSearchList()
    })
  }

  function onDeleteByIds(ids: number[]) {
    console.log("onDeleteByIds", ids)
    deleteApiByIdsApi(ids).then((res) => {
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
  function handleStatusChange(row: any, event: changeEvent) {
    console.log("handleStatusChange", row, event)
    switch (event) {
      case "delete":
        onDelete(row)
        break
      case "add":
        handleFormVisibility(null)
        break
      case "edit":
        handleFormVisibility(row)
        break
      case "traceable":
        updateApiApi(row).then((res) => {
          ElMessage.success("更新状态成功")
        })
    }
    // ElMessageBox.confirm(
    //   `确认要<strong>${row.status === 0 ? "停用" : "启用"}</strong><strong style="color:var(--el-color-primary)">${
    //     row.username
    //   }</strong>用户吗?`,
    //   "系统提示",
    //   {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning",
    //     dangerouslyUseHTMLString: true,
    //     draggable: true,
    //   }
    // )
    //   .then(() => {
    //     ElMessage({
    //       message: "已成功修改用户状态",
    //       type: "success",
    //     })
    //   })
    //   .catch(() => {
    //     row.status === 0 ? (row.status = 1) : (row.status = 0)
    //   })
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

    const value = order === "ascending" ? "asc" : "desc"
    orderData.value = assign({ [prop]: value }, orderData.value)
    orderData.value[prop] = value
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
    console.log("resetForm", formData.value)
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
    columnFields.value = getColumnFields(handleStatusChange)
    checkedColumnFields.value = columnFields.value.filter((column) => (column.hidden != true))
    console.log("columnFields", columnFields.value)
    console.log("checkedColumnFields", checkedColumnFields.value)
  }

  onMounted(() => {
    resetTable()
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
