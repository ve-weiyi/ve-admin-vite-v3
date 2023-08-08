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
        <el-form-item>
          <el-button type="primary" icon="Search" @click="onSearchList">搜索</el-button>
          <el-button icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格 -->
    <el-card v-loading="loading" shadow="never" class="main-card">
      <div class="table-title">{{ $route.meta.title }}</div>
      <div class="operation-container">
        <div class="flex-between">
          <el-button type="primary" size="default" icon="plus" @click="formVisibility = true"> 新增模块 </el-button>
          <el-button
            type="danger"
            size="default"
            icon="Delete"
            v-if="checkedColumnFields.filter((item) => item.type === 'selection').length > 0"
            :disabled="selectionIds.length === 0"
            @click="removeVisibility = true"
          >
            批量删除
          </el-button>
        </div>
        <!-- 表格操作 -->
        <div class="flex-between">
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
                        <el-icon style="margin-right: 5px; font-size: 16px"><Operation /></el-icon>
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

    <!-- 角色-菜单对话框 -->
    <el-dialog v-model="formVisibility" :title="formTitle" @close="resetForm" width="35%">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" size="default">
        <el-form-item v-for="item of formFields" :key="item.field" :prop="item.field" :label="item.label + '：'">
          <template v-if="item.field">
            <component :is="builderFormRender(item, formData)" />
          </template>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="formVisibility = false">取消</el-button>
        <el-button type="primary" @click="onSaveForm(formData)">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick, onMounted } from "vue"
import { useTableHook } from "./hook"
import { builderFormRender } from "@/utils/render"
import draggable from "vuedraggable/src/vuedraggable"

const {
  removeVisibility,
  formFields,
  formVisibility,
  formRef,
  formData,
  formRules,
  searchFields,
  searchFormRef,
  searchData,
  loading,
  columnFields,
  checkedColumnFields,
  checkAllColumns,
  isIndeterminate,
  tableRef,
  tableData,
  pagination,
  selectionIds,
  onSearchList,
  onSaveForm,
  onCreate,
  onUpdate,
  onDelete,
  onDeleteByIds,
  handleFormVisibility,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange,
  handleSortChange,
  handleDragChange,
  handleCheckAllChange,
  handleCheckedColumnFieldsChange,
  handleCheckedColumnChange,
  resetForm,
  resetSearch,
  resetTable,
} = useTableHook()

const formTitle = computed(() => {
  if (formData.value.id == 0) {
    return "新增接口"
  } else {
    return "编辑接口"
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

onMounted(() => {})
</script>

<style lang="scss" scoped>
.search-container {
  margin-bottom: 10px;

  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}

</style>
