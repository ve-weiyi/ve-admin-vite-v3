<script lang="ts" setup>
import { reactive, ref, watch } from 'vue'
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from 'element-plus'
import { CirclePlus, Delete, Download, RefreshRight, EditPen, Timer, Plus } from '@element-plus/icons-vue'
import { usePagination } from '@/hooks/usePagination'
import { createResourceApi, deleteByIdsResourceApi, updateResourceApi, getResourceTreeApi } from '@/api/resource'

const loading = ref<boolean>(false)
const alignType = ref<string>('left')
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

const tableData = ref<any[]>([])
// 查询列表
const getTableData = () => {
  loading.value = true
  getResourceTreeApi()
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
  id: '',
  roleName: '',
  roleComment: '',
  createdAt: '',
})
const formRules: FormRules = reactive({
  username: [{ required: false, trigger: 'blur', message: '请输入用户名' }],
  password: [{ required: false, trigger: 'blur', message: '请输入密码' }],
})
const menuList = reactive([{ id: 1 }, { id: 2 }, { id: 3 }])

const dialogFormVisible = ref<boolean>(false)
const isAdd = ref(false)

const addResource = (row) => {
  resetForm()
  isAdd.value = true
  dialogFormVisible.value = true
}
// 修改菜单方法
const editResource = (row) => {
  formData.value = row
  isAdd.value = false
  dialogFormVisible.value = true
}

const resetForm = () => {
  formData.value = {
    id: '',
    roleName: '',
    roleComment: '',
    createdAt: '',
  }
}
// 提交
const submitForm = () => {
  if (isAdd.value) {
    doCreate(formData.value)
  } else {
    doUpdate(formData.value)
  }
  dialogFormVisible.value = false
}

const doCreate = (row) => {
  createResourceApi(row).then(() => {
    ElMessage.success('添加成功')
    getTableData()
  })
}

const doUpdate = (row) => {
  updateResourceApi(row).then(() => {
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
  deleteByIdsResourceApi(ids).then(() => {
    ElMessage.success('批量删除成功')
    getTableData()
    isDelete.value = false
  })
}

const doDelete = (row) => {
  deleteByIdsResourceApi([row.id]).then(() => {
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

function tagType(method) {
  switch (method) {
    case 'GET':
      return ''
    case 'POST':
      return 'success'
    case 'PUT':
      return 'warning'
    case 'DELETE':
      return 'danger'
    default:
      return ''
  }
}

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })

defineOptions({
  name: 'UserOnline',
})
</script>

<template>
  <div class="app-container">
    <!-- 表格内容 -->
    <el-card v-loading="loading" shadow="never" class="main-card">
      <div class="table-title">{{ $route.name }}</div>
      <div class="operation-container">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="addResource">新增菜单</el-button>
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
          <el-table-column prop="id" label="id" :align="alignType" width="100px" />
          <el-table-column prop="name" label="接口名称" :align="alignType" width="auto" />
          <el-table-column prop="path" label="接口路径" :align="alignType" width="auto" />
          <el-table-column prop="method" label="请求方式" :align="alignType" width="auto">
            <template #default="scope">
              <el-tag v-if="scope.row.method" :type="tagType(scope.row.method)">
                {{ scope.row.method }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="accessType" label="匿名访问" align="center" width="100">
            <template #default="scope">
              <el-switch
                v-model="scope.row.accessType"
                active-color="#13ce66"
                inactive-color="#F4F4F5"
                :active-value="1"
                :inactive-value="2"
                @click="doUpdate(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="创建时间" width="auto" :align="alignType">
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
                @click="editResource(scope.row)"
              >
                新增
              </el-button>
              <el-button
                class="operation-button"
                text
                type="primary"
                size="small"
                :icon="EditPen"
                @click="editResource(scope.row)"
              >
                修改
              </el-button>
              <el-popconfirm title="确定删除吗？" @confirm="doDelete(scope.row)">
                <template #reference>
                  <el-button text type="danger" size="small" class="operation-button" :icon="Delete"> 删除 </el-button>
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

    <!-- 角色-菜单对话框 -->
    <el-dialog
      v-model="dialogFormVisible"
      :title="isAdd === true ? '新增角色' : '修改角色'"
      @close="resetForm"
      width="30%"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
        <el-form-item label="角色名">
          <el-input v-model="formData.roleName" style="width: 250px" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="权限标签">
          <el-input v-model="formData.roleComment" style="width: 250px" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-tree
            :data="menuList"
            :default-checked-keys="menuList"
            check-strictly
            show-checkbox
            node-key="id"
            ref="menuTreeRef"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
