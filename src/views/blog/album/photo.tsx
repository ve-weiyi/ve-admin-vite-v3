import { reactive, ref, computed, onMounted } from "vue"
import { Column, ElMessageBox, FormInstance, FormRules } from "element-plus"
import { ElTag, ElMessage } from "element-plus"
import { createPhotoApi, deletePhotoByIdsApi, deletePhotoApi, findPhotoListApi, updatePhotoApi } from "@/api/photo"
import { findPhotoAlbumApi } from "@/api/photo_album"

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
  const sorts = reactive<Sort[]>([])

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
    onSearchList()
  }

  const applySearch = () => {
    conditions.length = 0
    sorts.length = 0
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
  function onSearchList() {
    applySearch()

    loading.value = true
    findPhotoListApi({
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

  function onSave(row) {
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

  function onCreate(row) {
    console.log("onCreate", row)
    createPhotoApi(row).then((res) => {
      ElMessage.success("创建成功")
      addOrEditVisibility.value = false
      onSearchList()
    })
  }

  function onUpdate(row) {
    console.log("onUpdate", row)
    updatePhotoApi(row).then((res) => {
      ElMessage.success("更新成功")
      addOrEditVisibility.value = false
      onSearchList()
    })
  }

  function onDelete(row) {
    console.log("onDelete", row)
    deletePhotoApi(row).then((res) => {
      ElMessage.success("删除成功")
      removeVisibility.value = false
      onSearchList()
    })
  }

  function onDeleteByIds(ids: number[]) {
    console.log("onDeleteByIds", ids)
    deletePhotoByIdsApi(ids).then((res) => {
      ElMessage.success("批量删除成功")
      removeVisibility.value = false
      onSearchList()
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

  const handleAddOrEdit = (row: any) => {
    addOrEditVisibility.value = true
    resetForm(row)
  }

  const getAlbumInfo = (id: number) => {
    findPhotoAlbumApi(id).then((res) => {
      albumInfo.value = res.data
    })
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
    onSearchList,
    onSave,
    onCreate,
    onUpdate,
    onDelete,
    onDeleteByIds,
    onChange,
    handleAddOrEdit,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange,
    albumInfo,
    getAlbumInfo,
  }
}
