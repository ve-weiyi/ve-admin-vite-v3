import { reactive, ref, computed, onMounted } from "vue"
import { Column, ElMessageBox, FormInstance, FormRules } from "element-plus"
import { ElTag, ElMessage } from "element-plus"
import { createTalkApi, deleteByIdsTalkApi, deleteTalkApi, findTalkListApi, updateTalkApi } from "@/api/talk"

interface Pagination {
  total?: number
  currentPage?: number
  pageSizes?: number[]
  pageSize?: number
  layout?: string
}

/** 默认的分页参数 */
const defaultPaginationData: Pagination = {
  total: 0,
  currentPage: 1,
  pageSizes: [10, 20, 50],
  pageSize: 10,
  layout: "total, sizes, prev, pager, next, jumper",
}
const align = "center"

export function useTableHook() {
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
  const searchData = reactive({
    linkName: "",
    isReview: null,
  })

  // 表格数据定义
  const tableData = ref([])
  const selectionIds = reactive([])
  const pagination = reactive({ ...defaultPaginationData })
  const albumInfo = ref<any>({})

  // eslint-disable-next-line no-undef
  const conditions = reactive<Condition[]>([])
  // eslint-disable-next-line no-undef
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
    searchData.linkName = ""
    searchData.isReview = null
    handleSearch()
  }

  const applySearch = () => {
    conditions.length = 0
    orders.length = 0
    if (searchData.linkName != "") {
      conditions.push({
        flag: "AND",
        field: "link_name",
        value: searchData.linkName,
        rule: "like",
      })
    }
    if (searchData.isReview != null) {
      conditions.push({
        flag: "AND",
        field: "is_review",
        value: searchData.isReview,
        rule: "=",
      })
    }
  }

  // eslint-disable-next-line no-undef
  function handleSearch() {
    applySearch()

    loading.value = true
    findTalkListApi({
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
    createTalkApi(row).then((res) => {
      ElMessage.success("创建成功")
      addOrEditVisibility.value = false
      handleSearch()
    })
  }

  function handleUpdate(row) {
    console.log("handleUpdate", row)
    updateTalkApi(row).then((res) => {
      ElMessage.success("更新成功")
      addOrEditVisibility.value = false
      handleSearch()
    })
  }

  function handleDelete(row) {
    console.log("handleDelete", row)
    deleteTalkApi(row).then((res) => {
      ElMessage.success("删除成功")
      removeVisibility.value = false
      handleSearch()
    })
  }

  function handleDeleteByIds(ids: number[]) {
    console.log("handleDeleteByIds", ids)
    deleteByIdsTalkApi(ids).then((res) => {
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
      `确认要<strong>${row.status === 0 ? "停用" : "启用"}</strong><strong style='color:var(--el-color-primary)'>${
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
    albumInfo,
  }
}
