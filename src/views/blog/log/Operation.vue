<template>
  <div class="app-container">
    <!-- 表格搜索条件 -->
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchFields">
        <el-form-item v-for="item of searchFields" :key="item.field" :prop="item.field" :label="item.label + '：'">
          <template v-if="item.field">
            <component
              style="display: flex; justify-content: center; align-items: center"
              :is="builderRender(item, searchData)"
            />
          </template>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="onSearchList">搜索</el-button>
          <el-button icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格 -->
    <el-card v-loading="loading" shadow="never" class="main-card">
      <div class="table-title">{{ $route.meta.title }}</div>
      <div class="toolbar-wrapper">
        <div class="status-menu" v-if="tabList.length !== 0">
          <template v-for="item of tabList" :key="item.count">
            <span @click="checkTabType(item.count)" :class="isActive(item.count)">
              {{ item.label }}
            </span>
          </template>
        </div>
        <!-- 表格操作 -->
        <div class="operation-container">
          <el-button
            type="danger"
            size="default"
            icon="Delete"
            :disabled="selectionIds.length === 0"
            @click="removeVisibility = true"
          >
            批量删除
          </el-button>
          <div style="margin-left: 0.5rem; margin-right: 0.5rem">
            <el-tooltip content="刷新表格" placement="top">
              <el-button type="primary" icon="RefreshRight" circle @click="refreshTable" />
            </el-tooltip>

            <el-tooltip content="下载表格" placement="top">
              <el-dropdown trigger="click">
                <el-button style="margin-inline: 0.5rem" type="primary" icon="Download" circle />
                <template #dropdown>
                  <el-dropdown-menu class="translation">
                    <el-dropdown-item :style="getDropdownItemStyle('large')" @click="size = 'large'">
                      宽松
                    </el-dropdown-item>
                    <el-dropdown-item :style="getDropdownItemStyle('default')" @click="size = 'default'">
                      默认
                    </el-dropdown-item>
                    <el-dropdown-item :style="getDropdownItemStyle('small')" @click="size = 'small'">
                      紧凑
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-tooltip>

            <el-tooltip content="表格设置" placement="top">
              <el-button ref="buttonRef" type="primary" icon="setting" circle @click="refreshTable" />
            </el-tooltip>

            <!-- 其他部分保持不变 -->
            <el-popover
              ref="popoverRef"
              :virtual-ref="buttonRef"
              trigger="click"
              placement="bottom-start"
              virtual-triggering
            >
              <div class="toolbar-wrapper">
                <el-checkbox
                  label="列展示"
                  v-model="checkAll"
                  :indeterminate="isIndeterminate"
                  @change="handleCheckAllChange"
                />
                <el-button type="primary" link @click="onReset"> 重置</el-button>
              </div>

              <el-divider direction="horizontal" style="margin-top: 0; margin-bottom: 5px" />
              <el-checkbox-group v-model="checkedColumns" @change="handleCheckedColumnsChange">
                <el-space direction="vertical" alignment="stretch">
                  <!-- 单列拖拽 -->
                  <draggable
                    v-model="columnFields"
                    item-key="key"
                    @change="change"
                    force-fallback="true"
                    animation="300"
                    draggable=".item-single"
                  >
                    <template #item="{ element, index }">
                      <div class="flex item-single" style="display: flex; align-items: center">
                        <el-icon style="margin-right: 5px; font-size: 16px"><Operation /></el-icon>
                        <el-checkbox
                          v-if="element"
                          :label="element"
                          @change="(value) => handleCheckColumnListChange(value, element)"
                        >
                          <span :title="element" class="inline-block w-[120px] truncate hover:text-text_color_primary">
                            {{ element.title }}
                          </span>
                        </el-checkbox>
                      </div>
                    </template>
                  </draggable>
                </el-space>
              </el-checkbox-group>
            </el-popover>
          </div>
        </div>
      </div>

      <!-- 表格展示 -->
      <el-table
        border
        ref="tableRef"
        :data="tableData"
        :loading="loading"
        @selection-change="handleSelectionChange"
        @sort-change="handleSortChange"
      >
        <el-table-column
          v-for="item of columnFields.filter((item) => item.hidden !== true)"
          :type="item.type"
          :key="item.key"
          :prop="item.dataKey"
          :label="item.hidden ? 'hidden' : item.title"
          :align="item.align"
          :width="item.width"
          :sortable="item.sortable"
        >
          <template #default="{ row }">
            <template v-if="item.cellRenderer">
              <component
                style="display: flex; justify-content: center; align-items: center"
                :is="item.cellRenderer(row)"
              />
            </template>
            <template v-else-if="item.type !== 'selection'">
              <div>{{ row[item.dataKey] }}</div>
            </template>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" width="150">
          <template #default="scope">
            <el-button text type="primary" size="small" @click="handleAddOrEdit(scope.row)" icon="view">
              <i class="el-icon-view" /> 查看
            </el-button>
            <el-popconfirm title="确定删除吗？" style="margin-left: 10px" @confirm="onDelete(scope.row)">
              <template #reference>
                <el-button text type="primary" size="small" class="operation-button" icon="delete"> 删除</el-button>
              </template>
            </el-popconfirm>
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
    </el-card>

    <!-- 批量彻底删除对话框 -->
    <el-dialog v-model="removeVisibility" width="30%">
      <template #header>
        <div class="dialog-title-container">
          <el-icon style="color: #ff9900">
            <WarningFilled />
          </el-icon>
          删除提示
        </div>
      </template>
      <div style="font-size: 1rem">是否彻底删除选中项？</div>
      <template #footer>
        <el-button @click="removeVisibility = false">取 消</el-button>
        <el-button type="primary" @click="onDeleteByIds(selectionIds)">确 定</el-button>
      </template>
    </el-dialog>

    <!-- 查看模态框 -->
    <el-dialog v-model="addOrEditVisibility" class="dialog-container">
      <template #header>
        <div class="dialog-title-container">
          <el-icon>
            <MoreFilled />
          </el-icon>
          详细信息
        </div>
      </template>

      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" size="default">
        <el-form-item v-for="item of formFields" :key="item.field" :prop="item.field" :label="item.label + '：'">
          <template v-if="item.field">
            <component :is="builderRender(item, formData)" />
          </template>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick, onMounted } from "vue"
import { useTableHook } from "./hook"
import { builderRender } from "@/utils/render"
import Bar from "./Bar.vue"
import Sortable from "sortablejs"
import draggable from "vuedraggable/src/vuedraggable"

const change = (evt): void => {
  console.log("evt: ", evt)
  console.log("evt from: ", columnFields)
}
const {
  loading,
  removeVisibility,
  addOrEditVisibility,
  formRef,
  formData,
  formRules,
  searchFormRef,
  searchData,
  tableRef,
  tableData,
  selectionIds,
  pagination,
  resetForm,
  resetSearch,
  onSearchList,
  onSave,
  onDelete,
  onDeleteByIds,
  handleAddOrEdit,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange,
  handleSortChange,
  refreshTable,
  columnFields,
  searchFields,
  formFields,
} = useTableHook()

const linkTitle = computed(() => {
  if (formData.value.id == 0) {
    return "添加友链"
  } else {
    return "编辑友链"
  }
})

const tabList = [
  {
    label: "全部",
    count: null,
  },
  {
    label: "待审核",
    count: 1,
  },
  {
    label: "已通过",
    count: 2,
  },
  {
    label: "未通过",
    count: 3,
  },
]

const type = ref(null)

const checkTabType = (count: number) => {
  type.value = count
  searchData.value.type = count
  onSearchList()
}

const isActive = (status) => {
  return status === type.value ? "active-status" : "status"
}

const cloneDeep = (arr: any[]) => {
  return JSON.parse(JSON.stringify(arr))
}

const getKeyList = (arr: any[], key: string) => {
  return arr.map((item) => item[key])
}

const buttonRef = ref()
const size = ref("default")
const checkAll = ref(true)
const isIndeterminate = ref(false)

// 已选列表
const checkedColumns = ref([])

const getDropdownItemStyle = computed(() => {
  return (s) => {
    return {
      background: s === size.value ? "#409eff" : "",
      color: s === size.value ? "#fff" : "var(--el-text-color-primary)",
    }
  }
})

// 可选列表
let initColumnFields = []
onMounted(() => {
  initColumnFields = columnFields.value.map((item) => item)
  onReset()
})

const onReset = () => {
  checkAll.value = true
  isIndeterminate.value = false
  checkedColumns.value = initColumnFields
  columnFields.value = initColumnFields
  columnFields.value.map((column) => (column.hidden = false))
  console.log("columnFields", initColumnFields)
  console.log("checkedColumns", checkedColumns.value)
}

function handleCheckAllChange(val: boolean) {
  checkedColumns.value = val ? columnFields.value : []
  isIndeterminate.value = false
  columnFields.value.map((column) => (val ? (column.hidden = false) : (column.hidden = true)))
  console.log("handleCheckAllChange val", val, columnFields.value)
}

// 已选列表发送变化
function handleCheckedColumnsChange(value: string[]) {
  console.log("handleCheckedColumnsChange value", value)
  const checkedCount = value.length
  checkAll.value = checkedCount === columnFields.value.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < columnFields.value.length
}

function handleCheckColumnListChange(val: boolean, element: any) {
  columnFields.value.filter((item) => item.title === element.title)[0].hidden = !val
  console.log("handleCheckColumnListChange val", val, element)
}
</script>

<style lang="scss" scoped>
.search-wrapper {
  margin-bottom: 10px;

  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}

.comment-content {
  display: inline-block;
}

.status-menu {
  font-size: 14px;
  margin-top: 20px;
  color: #999;
}

.status-menu span {
  margin-right: 24px;
}

.status {
  cursor: pointer;
}

.active-status {
  cursor: pointer;
  color: #333;
  font-weight: bold;
}

.dropdown-item-active {
  background: #409eff;
  color: #fff;
}

.dropdown-item-normal {
  color: var(--el-text-color-primary);
}
</style>
