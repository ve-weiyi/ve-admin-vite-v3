<script lang="ts" setup>
import { reactive, ref, watch } from 'vue'
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from 'element-plus'
import { CirclePlus, Delete, Download, RefreshRight, EditPen, Timer, Plus } from '@element-plus/icons-vue'
import { usePagination } from '@/hooks/usePagination'
import { createMenuApi, deleteByIdsMenuApi, updateMenuApi, getMenuTreeApi } from '@/api/menu'
import options from './icon'

const loading = ref<boolean>(false)
const alignType = ref<string>('left')
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

const tableData = ref<any[]>([])
// 查询列表
const getTableData = () => {
  loading.value = true
  getMenuTreeApi()
    .then((res) => {
      paginationData.total = res.data.total
      // paginationData.pageSize = res.values.pageSize
      tableData.value = res.data.list
    })
    .catch(() => {
      tableData.value = []
    })
    .finally(() => {
      loading.value = false
    })
}

// 刷新
const handleRefresh = () => {
  getTableData()
}
// #endregion

// #region 增,改
// 表单提交
// ref 当值发生变化时，Vue 会自动更新相关的视图 values.value++. 用来做表单参数验证
// reactive 当对象的属性发生变化时，Vue 会自动更新相关的视图 values++. 用来做数据传输
const formRef = ref<FormInstance | null>(null)
const formData = ref({
  id: null,
  name: '',
  icon: '',
  component: '',
  path: '',
  rank: 1,
  parentId: null,
  isHidden: false,
  parentName: '',
})

const formRules: FormRules = reactive({
  name: [{ required: true, trigger: 'blur', message: '请输入' }],
  path: [{ required: true, trigger: 'blur', message: '请输入' }],
})

const dialogFormVisible = ref<boolean>(false)
const isAdd = ref(false)
const isCategory = ref(false)

const addMenu = (row) => {
  resetForm()
  if (row !== null) {
    formData.value.parentId = row.id
    formData.value.parentName = row.name
  }
  isCategory.value = true
  isAdd.value = true
  dialogFormVisible.value = true
}
// 修改菜单方法
const editMenu = (row) => {
  formData.value = row
  isCategory.value = false
  isAdd.value = false
  dialogFormVisible.value = true
}

const resetForm = () => {
  formData.value = {
    id: null,
    name: '',
    icon: '',
    component: '',
    path: '',
    rank: 1,
    parentId: null,
    isHidden: false,
    parentName: '',
  }
}
// 提交
const submitForm = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      if (isAdd.value) {
        doCreate(formData.value)
      } else {
        doUpdate(formData.value)
      }
      dialogFormVisible.value = false
    }
  })
}

const doCreate = (row) => {
  createMenuApi(row).then(() => {
    ElMessage.success('添加成功')
    getTableData()
  })
}

const doUpdate = (row) => {
  updateMenuApi(row).then(() => {
    ElMessage.success('修改成功')
    getTableData()
  })
}
// #endregion

// #region 删
// 多选删除，表格列改变
const isDelete = ref<boolean>(false)
const selectionIds = ref<undefined | number[]>([])

function selectionChange(dataList) {
  selectionIds.value = []
  dataList.forEach((item) => {
    selectionIds.value.push(item.id)
  })

  console.log('selectionIds', selectionIds.value)
}

const doDeleteByIds = (ids) => {
  deleteByIdsMenuApi(ids).then(() => {
    ElMessage.success('批量删除成功')
    getTableData()
    isDelete.value = false
  })
}

const doDelete = (row) => {
  deleteByIdsMenuApi([row.id]).then(() => {
    ElMessage.success('删除成功')
    getTableData()
  })
}
const handleDelete = (row) => {
  ElMessageBox.confirm(`正在删除用户：${row.roleName}，确认删除？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    console.log('row', row.id)
    doDelete({ id: row.id })
  })
}
// #endregion

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })

defineOptions({
  name: 'Menu',
})
</script>

<template>
  <div class="app-container">
    <!-- 表格内容 -->
    <el-card v-loading="loading" shadow="never" class="main-card">
      <div class="table-title">{{ $route.name }}</div>
      <div class="operation-container">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="addMenu(null)">新增菜单</el-button>
        </div>
        <div style="margin-left: auto">
          <el-tooltip content="下载">
            <el-button type="primary" :icon="Download" circle />
          </el-tooltip>
          <el-tooltip content="刷新表格">
            <el-button type="primary" :icon="RefreshRight" circle @click="handleRefresh" />
          </el-tooltip>
        </div>
      </div>

      <!-- 表格展示 -->
      <div class="table-wrapper">
        <el-table
          border
          :data="tableData"
          v-loading="loading"
          row-key="id"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
          <!-- 表格列 -->
          <!--          <el-table-column prop="id" label="id" :align=alignType sortable />-->
          <el-table-column prop="name" label="菜单名称" :align="alignType" />
          <!--          <el-table-column prop="icon" label="图标" :align="alignType" />-->
          <el-table-column prop="icon" label="图标" :align="alignType">
            <template #default="scope">
              <el-icon class="icon-item">
                <component :is="scope.row.icon" />
              </el-icon>
              {{ scope.row.icon }}
            </template>
          </el-table-column>
          <el-table-column prop="rank" label="排序" align="center" width="60" />
          <el-table-column prop="path" label="访问路径" :align="alignType" />
          <el-table-column prop="component" label="组件路径" :align="alignType" />
          <el-table-column prop="isHidden" label="隐藏" :align="alignType" width="100">
            <template #default="scope">
              <el-switch
                v-model="scope.row.isHidden"
                active-color="#13ce66"
                inactive-color="#F4F4F5"
                :active-value="true"
                :inactive-value="false"
                @click="doUpdate(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="创建时间" width="130" :align="alignType">
            <template #default="scope">
              <el-icon>
                <Timer />
              </el-icon>
              {{ scope.row.createdAt }}
            </template>
          </el-table-column>

          <!-- 列操作 -->
          <el-table-column fixed="right" label="操作" :align="alignType" width="180">
            <template #default="scope">
              <el-button
                class="operation-button"
                text
                type="primary"
                size="small"
                :icon="Plus"
                @click="addMenu(scope.row)"
              >
                新增
              </el-button>
              <el-button
                class="operation-button"
                text
                type="primary"
                size="small"
                :icon="EditPen"
                @click="editMenu(scope.row)"
              >
                修改
              </el-button>
              <el-popconfirm title="确定删除吗？" @confirm="doDelete(scope.row)">
                <template #reference>
                  <el-button text type="danger" size="small" class="operation-button" :icon="Delete"> 删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <div class="pager-wrapper">
        <el-pagination
          background
          :layout="paginationData.layout"
          :page-sizes="paginationData.pageSizes"
          :total="paginationData.total"
          :page-size="paginationData.pageSize"
          :currentPage="paginationData.currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 批量删除对话框 -->
    <el-dialog class="dialog-title-container" v-model="isDelete" title="提示" width="30%">
      <div class="dialog-title-container"><i class="el-icon-warning" style="color: #ff9900" />是否删除选中项？</div>
      <template #footer>
        <el-button @click="isDelete = false">取 消</el-button>
        <el-button type="primary" @click="doDeleteByIds(selectionIds)"> 确 定</el-button>
      </template>
    </el-dialog>

    <!-- 菜单-菜单对话框 -->
    <el-dialog
      v-model="dialogFormVisible"
      :title="isAdd === true ? '新增菜单' : '修改菜单'"
      @close="resetForm"
      width="30%"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
        <!-- 菜单类型 -->
        <el-form-item label="菜单类型">
          <el-radio-group v-model="isCategory" disabled>
            <el-radio :label="formData.parentId === 0">目录</el-radio>
            <el-radio :label="formData.parentId !== 0">一级菜单</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="父菜单名称" v-if="formData.parentName">
          <el-input
            v-model="formData.parentName"
            v-if="formData.parentName"
            style="width: 250px"
            placeholder="请输入"
            disabled
          />
        </el-form-item>
        <el-form-item label="菜单名称">
          <el-input v-model="formData.name" style="width: 250px" placeholder="请输入" />
        </el-form-item>
        <!--                <el-form-item label="菜单图标1">-->
        <!--                  <el-input v-model="formData.icon" style="width: 250px" placeholder="请输入" />-->
        <!--                </el-form-item>-->
        <el-form-item label="菜单图标">
          <div style="width: 250px">
            <span class="gva-icon" style="position: absolute; z-index: 9999; padding: 3px 10px 0">
              <el-icon>
                <component :is="formData.icon" />
              </el-icon>
            </span>
            <el-select
              v-model="formData.icon"
              style="width: 100%"
              clearable
              filterable
              class="gva-select"
              placeholder="请选择"
            >
              <el-option
                v-for="item in options"
                :key="item.key"
                class="select__option_item"
                :label="item.key"
                :value="item.key"
              >
                <span class="gva-icon" style="padding: 3px 0 0" :class="item.label">
                  <el-icon>
                    <component :is="item.label" />
                  </el-icon>
                </span>
                <span style="text-align: left">{{ item.key }}</span>
              </el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="组件路径" v-if="!isCategory">
          <el-input v-model="formData.component" style="width: 250px" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="访问路径">
          <el-input v-model="formData.path" style="width: 250px" placeholder="请输入" />
        </el-form-item>
        <!-- 显示排序 -->
        <el-form-item label="显示排序">
          <el-input-number v-model="formData.rank" controls-position="right" :min="1" :max="10" />
        </el-form-item>
        <!-- 显示状态 -->
        <el-form-item label="显示状态">
          <el-radio-group v-model="formData.isHidden">
            <el-radio :label="true">显示</el-radio>
            <el-radio :label="false">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss">
.gva-icon {
  color: rgb(132, 146, 166);
  font-size: 14px;
  margin-right: 10px;
}

.gva-select .el-input__inner {
  padding: 0 30px !important;
}

.select__option_item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
</style>
