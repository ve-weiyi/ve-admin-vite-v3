<template>
  <!-- 表格展示 -->
  <el-table
    border
    ref="tableRef"
    :loading="loading"
    :data="tableData"
    :size="size"
    @selection-change="handleSelectionChange"
    @sort-change="handleSortChange"
  >
    <el-table-column
      v-for="item of columnFields.filter((item) => item.hidden !== true)"
      :type="item.type"
      :key="item.key"
      :prop="item.dataKey"
      :label="item.title"
      :align="item.align"
      :width="item.width"
      :sortable="item.sortable"
    >
      <template #default="{ row }">
        <template v-if="item.cellRenderer">
          <component style="display: flex; justify-content: center; align-items: center" :is="item.cellRenderer(row)" />
        </template>
        <template v-else-if="item.type !== 'selection'">
          <div>{{ row[item.dataKey] }}</div>
        </template>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页 -->
  <el-pagination
    class="pagination-container"
    background
    :current-page="pagination.currentPage"
    :page-size="pagination.pageSize"
    :total="pagination.total"
    :page-sizes="pagination.pageSizes"
    :layout="pagination.layout"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  ></el-pagination>
</template>

<script setup lang="ts">
// 表格结构定义
import { reactive, ref, defineProps } from "vue"
import { Column, TableInstance } from "element-plus"
import { OperationLog } from "@/api/types"
import { defaultPaginationData, Sort, Pagination } from "@/utils/render"

const props = defineProps({
  getColumnFields: {
    type: Function,
    required: false,
  },
})

// 表格加载状态
const loading = ref(true)
const size = ref("default")

const columnFields = ref<Column[]>(props.getColumnFields())
const checkedColumnFields = ref<Column[]>(columnFields.value)
const checkAllColumns = ref(true)
const isIndeterminate = ref(false)

// 表格数据定义
const tableRef = ref<TableInstance | null>(null)
const tableData = ref<OperationLog[]>([])
const pagination = reactive<Pagination>({ ...defaultPaginationData })
const selectionIds = reactive<number[]>([])

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

  const item: Sort = {
    field: prop,
    order: order === "ascending" ? "asc" : "desc",
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
</script>

<style scoped></style>
