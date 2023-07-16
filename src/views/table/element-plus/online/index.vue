<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="main-card">
      <div style="height: 700px" class="table-wrapper">
        <el-auto-resizer>
          <template #default="{ height, width }">
            <el-table-v2
              :columns="columns"
              :data="dataList"
              :width="width"
              :height="height"
              v-model:sort-state="sortState"
              @column-sort="onSort"
              header-class="table-header"
              fixed
              border
            />
          </template>
        </el-auto-resizer>
      </div>
      <!-- 分页 -->
      <el-pagination
        class="pagination-container"
        background
        :layout="pagination.layout"
        :page-sizes="pagination.pageSizes"
        :total="pagination.total"
        :page-size="pagination.pageSize"
        :currentPage="pagination.currentPage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { useHook } from "@/views/blog/user/online/hook"
import { ref } from "vue"

// 自行编写排序事件处理方法
const handleSort = () => {}
// 记录排序状态, key: 排序项的key, order: 升/降序
const sortState = ref({ key: "no", order: "asc" })
// 监听排序事件
const onSort = ({ key, order }) => {
  handleSort()
  sortState.value = { key, order }
}

const {
  form,
  loading,
  columns,
  dataList,
  pagination,
  buttonClass,
  onSearch,
  resetForm,
  onUpdate,
  onDelete,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange,
} = useHook()
</script>

<style lang="scss" scoped></style>
