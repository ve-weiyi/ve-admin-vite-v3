<template>
  <div class="app-container">
    <!-- 表格搜索条件 -->
    <el-card v-loading="loading" shadow="never" class="search-container">
      <el-form ref="searchFormRef" :inline="true" :model="searchFields">
        <el-form-item v-for="item of searchFields" :key="item.field" :prop="item.field" :label="item.label + '：'">
          <template v-if="item.field">
            <component
              style="display: flex; justify-content: center; align-items: center"
              :is="builderFormRender(item, searchData)"
            />
          </template>
        </el-form-item>
        <el-form-item class="align-right">
          <el-button type="primary" icon="Search" @click="onSearchList">搜索</el-button>
          <el-button icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格 -->
    <el-card v-loading="loading" shadow="never" class="main-card">
      <div class="table-title">{{ tableTitle }}</div>
      <div class="operation-container">
        <!-- 表格菜单 -->
        <div class="status-menu" v-if="tabList.length !== 0">
          <span>状态</span>
          <template v-for="item of tabList" :key="item.count">
            <span @click="checkTabType(item.count)" :class="isActive(item.count)">
              {{ item.label }}
            </span>
          </template>
        </div>

        <!-- 表格操作 -->
        <div class="flex-between align-right">
          <div class="flex-between">
            <!-- 通过data属性传递参数 -->
            <slot name="operation" :selectionIds="selectionIds" :checkedColumnFields="checkedColumnFields"></slot>
            <el-button
              v-if="props.showAddButton"
              type="primary"
              size="default"
              icon="plus"
              @click="handleFormVisibility(null)"
            >
              新增{{ tableName }}
            </el-button>
            <el-button
              v-if="checkedColumnFields.filter((item) => item.type === 'selection').length > 0"
              type="danger"
              size="default"
              icon="Delete"
              :disabled="selectionIds.length === 0"
              @click="removeVisibility = true"
            >
              批量删除
            </el-button>
          </div>
          <div style="margin-left: 0.5rem; margin-right: 0.5rem">
            <el-tooltip content="刷新表格" placement="top">
              <el-button type="primary" icon="RefreshRight" circle @click="onSearchList" />
            </el-tooltip>

            <el-tooltip content="表格密度" placement="top">
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
              <el-button ref="buttonRef" type="primary" icon="setting" circle />
            </el-tooltip>

            <!-- 其他部分保持不变 -->
            <el-popover
              ref="popoverRef"
              :virtual-ref="buttonRef"
              trigger="click"
              placement="bottom-start"
              virtual-triggering
            >
              <div class="flex-between">
                <el-checkbox
                  label="列展示"
                  v-model="checkAllColumns"
                  :indeterminate="isIndeterminate"
                  @change="handleCheckAllChange"
                />
                <el-button type="primary" link @click="resetTable"> 重置</el-button>
              </div>

              <el-divider direction="horizontal" style="margin-top: 0; margin-bottom: 5px" />
              <el-checkbox-group v-model="checkedColumnFields" @change="handleCheckedColumnFieldsChange">
                <el-space direction="vertical" alignment="stretch">
                  <!-- 单列拖拽 -->
                  <draggable
                    v-model="columnFields"
                    item-key="key"
                    @change="handleDragChange"
                    force-fallback="true"
                    animation="300"
                    draggable=".item-single"
                  >
                    <template #item="{ element, index }">
                      <div class="flex item-single" style="display: flex; align-items: center">
                        <el-icon style="margin-right: 5px; font-size: 16px">
                          <Operation />
                        </el-icon>
                        <el-checkbox
                          v-if="element"
                          :label="element"
                          @change="(value) => handleCheckedColumnChange(value, element)"
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
        :loading="loading"
        :data="tableData"
        :size="size"
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
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
          :fixed="item.fixed"
        >
          <template #default="{ row }">
            <template v-if="item.cellRenderer">
              <component
                style="display: flex; justify-content: center; align-items: center"
                :is="item.cellRenderer(row)"
              />
            </template>
            <template v-else-if="item.type !== 'selection'">
              {{ row[item.dataKey] }}
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
    </el-card>

    <!-- 批量彻底删除对话框 -->
    <el-dialog v-model="removeVisibility" class="dialog-container">
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

    <!-- 角色-菜单对话框 -->
    <el-dialog v-model="formVisibility" class="dialog-container">
      <template #header>
        <div class="dialog-title-container">
          {{ formTitle }}
        </div>
      </template>
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" size="default">
        <el-form-item v-for="item of formFields" :key="item.field" :prop="item.field" :label="item.label + '：'">
          <template v-if="item.field">
            <component :is="builderFormRender(item, formData)" />
          </template>
        </el-form-item>
      </el-form>
      <template #footer v-if="showEditButton">
        <el-button @click="handleFormHidden">取消</el-button>
        <el-button type="primary" @click="onSaveForm(formData)">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, getCurrentInstance, onMounted, reactive, ref } from "vue"
import { builderFormRender, Condition, defaultPaginationData, FormField, Pagination, Sort } from "@/utils/render"
import { Column, ElMessage, FormInstance, FormRules, TableInstance } from "element-plus"
import { MenuDetails } from "@/api/types"
import { assign } from "xe-utils"
import draggable from "vuedraggable/src/vuedraggable"
import { useRoute } from "vue-router"

// 父组件向子组件传输的数据
const props = defineProps({
  getColumnFields: {
    type: Function,
    required: true,
  },
  getFormFields: {
    type: Function,
    required: true,
  },
  getSearchFields: {
    type: Function,
    required: true,
  },
  handleApi: {
    type: Function,
    required: true,
  },
  showAddButton: {
    type: Boolean,
    default: true,
  },
  showEditButton: {
    type: Boolean,
    default: true,
  },
  tableTitle: {
    type: String,
    default: "",
  },
  modelName: {
    type: String,
    default: "",
  },
  tabList: {
    type: Array,
    default: () => {
      return []
    },
  },
  defaultOrder: {
    type: Object,
    default: () => {
      return {}
    },
  },
})

// 父组件向子组件传输的事件
const emit = defineEmits([
  // 定义事件
  // 'eventName',
])

const tabList = reactive(props.tabList)

const type = ref(null)
const checkTabType = (count: number) => {
  type.value = count
  // searchData.value.type = count
  onSearchList()
}
const isActive = (status) => {
  return status === type.value ? "status-menu-active" : "status-menu-normal"
}

const tableTitle = props.tableTitle ? props.tableTitle : useRoute().meta.title
const tableName = props.modelName ? props.modelName : useRoute().meta.title
const formTitle = computed(() => {
  if (formData.value.id) {
    if (!props.showAddButton) {
      return `查看${tableName}`
    }
    return `编辑${tableName}`
  } else {
    return `新增${tableName}`
  }
})

const buttonRef = ref()
const size = ref("default")

const getDropdownItemStyle = computed(() => {
  return (s) => {
    return {
      background: s === size.value ? "#409eff" : "",
      color: s === size.value ? "#fff" : "var(--el-text-color-primary)",
    }
  }
})

// 表单数据定义
const formFields = ref<FormField[]>([])
const formVisibility = ref(false)
const formStatus = ref("")

// 表单规则定义
const formRef = ref<FormInstance | null>(null)
const formData = ref<any>({})
const formRules: FormRules = reactive({})

// 表格加载状态
const loading = ref(true)
// 批量移除提示框
const removeVisibility = ref(false)

// 表格结构定义
const columnFields = ref<Column[]>([])
const checkedColumnFields = ref<Column[]>([])
const checkAllColumns = ref(true)
const isIndeterminate = ref(false)

// 表格数据定义
const tableRef = ref<TableInstance | null>(null)
const tableData = ref<MenuDetails[]>([])
const pagination = reactive<Pagination>({ ...defaultPaginationData })
const selectionIds = reactive<number[]>([])

// 表搜素条件定义
const searchFields = ref<FormField[]>(props.getSearchFields())
const searchFormRef = ref<FormInstance | null>(null)
// 搜索条件,{k:v}
const searchData = ref<any>({})
// 排序条件,{k:v}
const orderData = ref<any>({})
// 条件查询 (key,value)
const conditions = reactive<Condition[]>([])
const sorts = reactive<Sort[]>([])

function onSearchList() {
  console.log("onSearchList", searchData.value, orderData.value)

  conditions.length = 0
  sorts.length = 0

  // 搜索条件
  for (const key in searchData.value) {
    const item = searchFields.value.find((v) => v.field === key)
    const value = searchData.value[key]
    conditions.push({
      flag: item?.flag || "and",
      field: key,
      value: value,
      rule: item?.rule || "=",
    })
  }

  // 排序条件
  for (const key in orderData.value) {
    const value = orderData.value[key]
    sorts.push({
      field: key,
      order: value,
    })
  }

  loading.value = true
  props
    .handleApi("list", {
      page: pagination.currentPage,
      page_size: pagination.pageSize,
      sorts: sorts,
      conditions: conditions,
    })
    .then((res) => {
      tableData.value = res.data.list
      pagination.total = res.data.total
      loading.value = false
    })
}

function onCreate(row) {
  console.log("onCreate", row)
  props.handleApi(row, "create").then((res) => {
    ElMessage.success("创建成功")
    formVisibility.value = false
    onSearchList()
  })
}

function onUpdate(row) {
  console.log("onUpdate", row)
  props.handleApi("update", row).then((res) => {
    ElMessage.success("更新成功")
    formVisibility.value = false
    onSearchList()
  })
}

function onDelete(row) {
  console.log("onDelete", row)
  props.handleApi("delete", row.id).then((res) => {
    ElMessage.success("删除成功")
    onSearchList()
  })
}

function onDeleteByIds(ids: number[]) {
  console.log("onDeleteByIds", ids)
  props.handleApi("deleteByIds", ids).then((res) => {
    ElMessage.success("批量删除成功")
    removeVisibility.value = false
    onSearchList()
  })
}

// 表格点击事件 查看、新增、编辑、删除、启用、停用
type actionEvent = "add" | "edit" | "view" | "delete" | "enable" | "disable" | "onSaveForm"

// function onClickAction(event: actionEvent, data: any) {
//   console.log("onClickAction", event, data)
//   switch (event) {
//     case "onSaveForm":
//       onSaveForm(data)
//       break
//     default:
//       break
//   }
// }

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

  const value = order === "ascending" ? "asc" : "desc"
  orderData.value = assign({ [prop]: value }, orderData.value)
  orderData.value[prop] = value
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

function onSaveForm(row) {
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

function handleFormHidden() {
  formVisibility.value = false
  resetForm(null)
}

function handleFormVisibility(row: any) {
  formVisibility.value = true
  resetForm(row)
}

function resetForm(row) {
  if (row != null) {
    formData.value = row
  } else {
    formData.value = {}
  }

  console.log("resetForm", formData.value)
  formFields.value = props.getFormFields(row)
}

function resetSearch() {
  searchData.value = {}
  orderData.value = props.defaultOrder
  tableRef.value?.clearSort()
  tableRef.value?.clearSelection()
  onSearchList()
}

function resetTable() {
  checkAllColumns.value = true
  isIndeterminate.value = false
  columnFields.value = props.getColumnFields()
  checkedColumnFields.value = columnFields.value.filter((column) => column.hidden != true)
  console.log("columnFields", columnFields.value)
  console.log("checkedColumnFields", checkedColumnFields.value)
}

onMounted(() => {
  resetForm(null)
  resetSearch()
  resetTable()
  onSearchList()
})

defineExpose({
  handleSortChange,
  handleDragChange,
  handleCheckAllChange,
  handleCheckedColumnFieldsChange,
  handleCheckedColumnChange,
  handleSelectionChange,
  handleSizeChange,
  handleCurrentChange,
  handleFormVisibility,
  onSaveForm,
  onDelete,
  onDeleteByIds,
  onSearchList,
  resetSearch,
  resetTable,
  resetForm,
})
</script>

<style lang="scss" scoped>
.search-container {
  margin-bottom: 10px;

  :deep(.el-card__body) {
    padding-bottom: 2px;
    width: 100%;
  }
}
</style>
