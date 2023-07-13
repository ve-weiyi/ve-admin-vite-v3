<template>
  <div class="app-container">
    <svg-icon icon-class="copyright" class="icon" />
    <el-card v-loading="loading" shadow="never" class="main-card">
      <!-- Element 虚拟表格-->
      <el-table-v2
        border
        v-loading="loading"
        class="table-wrapper"
        :columns="columns"
        :data="tableData"
        :width="985"
        :height="800"
        :fixed="false"
      />
    </el-card>
  </div>
</template>

<script lang="jsx" setup>
import { reactive, ref, watch } from "vue"
import SvgIcon from "@/components/YuSvgIcon"
import { ElMessage } from "element-plus"
import { usePagination } from "@/hooks/usePagination"
import { createMenuApi, deleteByIdsMenuApi, deleteMenuApi, getMenuApi, getMenuListApi, updateMenuApi } from "@/api/menu"

const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

// ref 当值发生变化时，Vue 会自动更新相关的视图 values.value++. 用来做表单参数验证
// reactive 当对象的属性发生变化时，Vue 会自动更新相关的视图 values++. 用来做数据传输

// 是否加载状态
const loading = ref(false)
// 列 column 的配置数组
const align = "left"
const columns = ref([
  // {
  //   dataKey: 'id',
  //   title : 'id',
  //   align : align,
  //   width : 106,
  // },
  {
    dataKey: "name",
    title: "菜单名称",
    align,
    width: 231,
    cellRenderer: (scope) => {
      const rowData = scope.rowData
      console.log("scope", rowData)

      return <ElTag>{rowData.name}</ElTag>
    },
  },
  {
    dataKey: "icon",
    title: "图标",
    align,
    width: 110,
    cellRenderer: (scope) => {
      const rowData = scope.rowData
      return <SvgIcon icon-class="copyright" className="icon" />
    },
  },
  {
    dataKey: "rank",
    title: "排序",
    align,
    width: 231,
  },
  {
    dataKey: "path",
    title: "访问路径",
    align,
    width: 231,
  },
  {
    dataKey: "component",
    title: "组件路径",
    align,
    width: 231,
  },
  {
    dataKey: "isHidden",
    title: "是否隐藏",
    align,
    width: 231,
  },
  {
    dataKey: "updatedAt",
    title: "创建时间",
    align,
    width: 231,
  },
  {
    dataKey: "login_time",
    title: "操作",
    align,
    width: 231,
  },
])
// 要在表中渲染的数据数组
const tableData = ref([])

const getTableData = () => {
  loading.value = true
  getMenuListApi({
    page: paginationData.currentPage,
    pageSize: paginationData.pageSize,
  })
    .then((res) => {
      paginationData.total = res.data.total
      tableData.value = res.data.list

      console.log(res.data)
    })
    .catch(() => {
      tableData.value = []
    })
    .finally(() => {
      loading.value = false
    })
}

const doCreate = (row) => {
  createMenuApi(row.id).then(() => {
    ElMessage.success("创建成功")
    getTableData()
  })
}

const doDelete = (row) => {
  deleteMenuApi(row).then(() => {
    ElMessage.success("删除成功")
    getTableData()
  })
}

const doUpdate = (row) => {
  updateMenuApi(row).then(() => {
    ElMessage.success("修改成功")
    getTableData()
  })
}

const doList = (row) => {
  deleteMenuApi(row.id).then(() => {
    getTableData()
  })
}

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>
