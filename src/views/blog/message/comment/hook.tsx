import { reactive, ref, computed, onMounted } from "vue"
import { Column, ElMessageBox, FormInstance, FormRules } from "element-plus"
import { ElTag, ElMessage } from "element-plus"
import { defaultPaginationData, Pagination, Sort, Condition, FormField, RenderType } from "@/utils/render"
import { findCommentBackListApi } from "@/api/comment"

const align = "center"

export function useTableHook() {
  // 表格加载状态
  const loading = ref(true)
  // 表单数据定义
  const formRef = ref<FormInstance | null>(null)
  const formData = reactive({
    username: "",
    password: "",
  })
  const formRules: FormRules = reactive({
    username: [{ required: true, trigger: "blur", message: "请输入用户名" }],
    password: [{ required: true, trigger: "blur", message: "请输入密码" }],
  })

  // 搜索表单数据定义
  const searchFormRef = ref<FormInstance | null>(null)
  const searchData = reactive({
    type: null,
    username: "",
    isReview: null,
  })

  // 表格数据定义
  const tableData = ref([])
  const selectionIds = reactive<number[]>([])
  const pagination = reactive<Pagination>({ ...defaultPaginationData })

  const conditions = reactive<Condition[]>([])
  const sorts = reactive<Sort[]>([])

  const resetForm = (formEl) => {
    if (!formEl) return
    formEl.resetFields()
    onSearchList()
  }

  const resetSearch = () => {
    searchData.type = null
    searchData.username = ""
    searchData.isReview = null
    onSearchList()
  }

  const applySearch = () => {
    conditions.length = 0
    sorts.length = 0
    if (searchData.username != "") {
      conditions.push({
        flag: "AND",
        field: "username",
        value: searchData.username,
        rule: "like",
      })
    }
    if (searchData.type != null) {
      conditions.push({
        flag: "AND",
        field: "type",
        value: searchData.type,
        rule: "=",
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
  function onSearchList() {
    applySearch()

    loading.value = true
    findCommentBackListApi({
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
  }

  function onUpdate(row) {
    console.log("onUpdate", row)
  }

  function onDelete(row) {
    console.log("onDelete", row)
    // commentIdList.value = selection.map((item) => item.id)
  }

  function onDeleteByIds(ids: number[]) {
    console.log("onDeleteByIds", ids)
    // commentIdList.value = selection.map((item) => item.id)
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

  onMounted(() => {
    onSearchList()
  })
  return {
    loading,
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
    onSearchList,
    onCreate,
    onUpdate,
    onDelete,
    onDeleteByIds,
    onChange,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange,
  }
}
