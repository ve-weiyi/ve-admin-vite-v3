import dayjs from "dayjs"
import { Column, ElMessageBox } from "element-plus"
import { reactive, ref, computed, onMounted } from "vue"
import { ElTag, ElMessage } from "element-plus"
import { findUserListApi } from "@/api/admin"

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

export function useHook() {
  const form = reactive({})
  const dataList = ref([])
  const loading = ref(true)
  const switchLoadMap = ref({})
  const pagination = reactive({ ...defaultPaginationData })
  const align = "center"
  const columns: Column<any>[] = [
    {
      key: "id",
      dataKey: "id",
      title: "id",
      width: 100,
      align: align,
    },
    {
      key: "avatar",
      dataKey: "avatar",
      title: "头像",
      width: 100,
      align: align,
      cellRenderer: (row) => <el-avatar size={40} src={row.cellData} style={{ margin: "0 auto" }}></el-avatar>,
    },
    {
      key: "nickname",
      dataKey: "nickname",
      title: "昵称",
      width: 100,
      align: align,
    },
    {
      key: "loginType",
      dataKey: "loginType",
      title: "登录方式",
      width: 100,
      cellRenderer: ({ cellData: name }) => <ElTag>{name}</ElTag>,
      align: align,
    },
    {
      key: "ipSource",
      dataKey: "ipSource",
      title: "ipSource",
      width: 100,
      align: align,
    },
    {
      key: "ipAddress",
      dataKey: "ipAddress",
      title: "ipAddress",
      width: 100,
      align: align,
    },
    {
      key: "loginTime",
      dataKey: "loginTime",
      title: "loginTime",
      width: 100,
      align: align,
      formatter: ({ dept }) => dept.name,
    },
    {
      key: "loginType",
      dataKey: "loginType",
      title: "loginType",
      width: 100,
      align: align,
    },
  ]

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
        switchLoadMap.value[index] = Object.assign({}, switchLoadMap.value[index], {
          loading: true,
        })
        setTimeout(() => {
          switchLoadMap.value[index] = Object.assign({}, switchLoadMap.value[index], {
            loading: false,
          })
          ElMessage({
            message: "已成功修改用户状态",
            type: "success",
          })
        }, 300)
      })
      .catch(() => {
        row.status === 0 ? (row.status = 1) : (row.status = 0)
      })
  }

  function onUpdate(row) {
    console.log(row)
  }

  function onDelete(row) {
    console.log(row)
  }

  function handleSizeChange(val: number) {
    console.log(`${val} items per page`)
  }

  function handleCurrentChange(val: number) {
    console.log(`current page: ${val}`)
  }

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val)
  }

  function onSearch() {
    loading.value = true
    findUserListApi({}).then((res) => {
      dataList.value = res.data.list
      pagination.total = res.data.total
      loading.value = false
    })
  }

  const resetForm = (formEl) => {
    if (!formEl) return
    formEl.resetFields()
    onSearch()
  }

  onMounted(() => {
    onSearch()
  })

  return {
    form,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    onUpdate,
    onDelete,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange,
  }
}
