import { reactive, ref, computed, onMounted } from "vue"
import { Column, ElMessageBox, FormInstance, FormRules } from "element-plus"
import { ElTag, ElMessage } from "element-plus"
import { adminCommentsApi } from "@/api/admin"

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
  layout: "total, sizes, prev, pager, next, jumper"
}
const align = "center"

export function useTableHook() {
  // 表格加载状态
  const loading = ref(true)
  // 表单数据定义
  const formRef = ref<FormInstance | null>(null)
  const formData = reactive({
    username: "",
    password: ""
  })
  const formRules: FormRules = reactive({
    username: [{ required: true, trigger: "blur", message: "请输入用户名" }],
    password: [{ required: true, trigger: "blur", message: "请输入密码" }]
  })

  // 搜索表单数据定义
  const searchFormRef = ref<FormInstance | null>(null)
  const searchData = reactive({
    type: null,
    username: ""
  })

  // 表格数据定义
  const tableData = ref([])
  const selectIds = ref([])
  const pagination = reactive({ ...defaultPaginationData })

  const resetForm = (formEl) => {
    if (!formEl) return
    formEl.resetFields()
    handleSearch()
  }

  const resetSearch = (formEl) => {}
  onMounted(() => {
    handleSearch()
  })

  function handleSearch() {
    loading.value = true
    adminCommentsApi({
      page: pagination.currentPage,
      page_size: pagination.pageSize
    }).then((res) => {
      tableData.value = res.data.list
      pagination.total = res.data.total
      pagination.currentPage = res.data.page
      loading.value = false
    })
  }

  function handleCreate(row) {
    console.log(row)
  }

  function handleUpdate(row) {
    console.log(row)
  }

  function handleDelete(row) {
    console.log(row)
    // commentIdList.value = selection.map((item) => item.id)
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
  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val)
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
        draggable: true
      }
    )
      .then(() => {
        ElMessage({
          message: "已成功修改用户状态",
          type: "success"
        })
      })
      .catch(() => {
        row.status === 0 ? (row.status = 1) : (row.status = 0)
      })
  }

  return {
    loading,
    formRef,
    formData,
    formRules,
    searchFormRef,
    searchData,
    tableData,
    selectIds,
    pagination,
    resetForm,
    resetSearch,
    handleSearch,
    handleCreate,
    handleUpdate,
    handleDelete,
    onChange,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange
  }
}
