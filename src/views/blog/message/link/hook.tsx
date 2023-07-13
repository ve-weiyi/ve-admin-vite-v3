import { reactive, ref, computed, onMounted } from "vue"
import { Column, ElMessageBox, FormInstance, FormRules } from "element-plus"
import { ElTag, ElMessage } from "element-plus"
import { createLinkApi, deleteByIdsLinkApi, deleteLinkApi, findLinkListApi, updateLinkApi } from "@/api/link"

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
  const formData = reactive({
    id: 0,
    linkName: "",
    linkAvatar: "",
    linkAddress: "",
    linkIntro: "",
    createdAt: null,
  })
  const formRules: FormRules = reactive({
    linkName: [{ required: true, trigger: "blur", message: "请输入友链名称" }],
    linkAvatar: [{ required: true, trigger: "blur", message: "请输入友链头像" }],
    linkAddress: [{ required: true, trigger: "blur", message: "请输入友链地址" }],
  })

  // 搜索表单数据定义
  const searchFormRef = ref<FormInstance | null>(null)
  const searchData = reactive({
    linkName: "",
    status: null,
  })

  // 表格数据定义
  const tableData = ref([])
  const selectionIds = reactive([])
  const pagination = reactive({ ...defaultPaginationData })

  // eslint-disable-next-line no-undef
  const conditions = reactive<Condition[]>([])
  // eslint-disable-next-line no-undef
  const orders = reactive<Order[]>([])

  const resetForm = (row) => {
    if (row != null) {
      formData.id = row.id
      formData.linkName = row.linkName
      formData.linkAvatar = row.linkAvatar
      formData.linkAddress = row.linkAddress
      formData.linkIntro = row.linkIntro
      formData.createdAt = row.createdAt
    } else {
      formData.id = 0
      formData.linkName = ""
      formData.linkAvatar = ""
      formData.linkAddress = ""
      formData.linkIntro = ""
      formData.createdAt = null
    }
    formRef.value?.resetFields()
  }

  const resetSearch = () => {
    searchData.linkName = ""
    searchData.status = null
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
    if (searchData.status != null) {
      conditions.push({
        flag: "AND",
        field: "status",
        value: searchData.status,
        rule: "=",
      })
    }
  }

  // eslint-disable-next-line no-undef
  function handleSearch() {
    applySearch()

    loading.value = true
    findLinkListApi({
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
    createLinkApi(row).then((res) => {
      ElMessage.success("创建成功")
      addOrEditVisibility.value = false
      handleSearch()
    })
  }

  function handleUpdate(row) {
    console.log("handleUpdate", row)
    updateLinkApi(row).then((res) => {
      ElMessage.success("更新成功")
      addOrEditVisibility.value = false
      handleSearch()
    })
  }

  function handleDelete(row) {
    console.log("handleDelete", row)
    deleteLinkApi(row).then((res) => {
      ElMessage.success("删除成功")
      removeVisibility.value = false
      handleSearch()
    })
  }

  function handleDeleteByIds(ids: number[]) {
    console.log("handleDeleteByIds", ids)
    deleteByIdsLinkApi(ids).then((res) => {
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
  }
}
