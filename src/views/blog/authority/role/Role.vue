<template>
  <div class="app-container">
    <!-- 表格搜索条件 -->
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="username" label="角色名">
          <el-input v-model="searchData.username" placeholder="请输入" :prefix-icon="Search" />
        </el-form-item>
        <el-form-item prop="phone" label="手机号">
          <el-input v-model="searchData.phone" placeholder="请输入" :prefix-icon="Search" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="onSearchList">查询</el-button>
          <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格内容 -->
    <el-card v-loading="loading" shadow="never" class="main-card">
      <div class="operation-container">
        <div class="table-title">{{ $route.meta.title }}</div>
        <div style="margin-left: auto">
          <el-button type="primary" :icon="CirclePlus" @click="addMenu">新增角色</el-button>
          <el-button type="danger" icon="delete" @click="isDelete = true" :disabled="selectionIds.length === 0">
            批量删除
          </el-button>
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
        <el-table border :data="tableData" v-loading="loading" @selection-change="selectionChange">
          <!-- 表格列 -->
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="id" label="id" align="center" sortable />
          <el-table-column prop="role_name" label="角色名" align="center" />
          <el-table-column prop="role_domain" label="权限范围" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.roleDomain === 'blog'" effect="plain">{{ scope.row.roleDomain }}</el-tag>
              <el-tag v-else type="warning" effect="plain">{{ scope.row.roleDomain }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="role_comment" label="权限标签" align="center" />
          <el-table-column prop="is_disable" label="禁用" align="center" width="100">
            <template #default="scope">
              <el-switch
                v-model="scope.row.isDisable"
                active-color="#13ce66"
                inactive-color="#F4F4F5"
                :active-value="true"
                :inactive-value="false"
                @click="doUpdate(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="created_at" label="创建时间" width="200" align="center">
            <template #default="scope">
              <el-icon>
                <Timer />
              </el-icon>
              {{ scope.row.created_at }}
            </template>
          </el-table-column>

          <!-- 列操作 -->
          <el-table-column fixed="right" label="操作" align="center" width="200">
            <template #default="scope">
              <el-button
                link
                type="primary"
                size="small"
                class="operation-button"
                :icon="EditPen"
                @click="openDrawer(scope.row)"
              >
                权限
              </el-button>
              <el-button
                text
                type="primary"
                size="small"
                class="operation-button"
                :icon="EditPen"
                @click="editMenu(scope.row)"
              >
                编辑
              </el-button>
              <el-popconfirm title="确定删除吗？" @confirm="doDelete(scope.row)">
                <template #reference>
                  <el-button text type="danger" size="small" class="operation-button" icon="delete"> 删除 </el-button>
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

    <!-- 角色信息对话框 -->
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
        <el-form-item label="权限范围">
          <el-input v-model="formData.roleDomain" style="width: 250px" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="权限标签">
          <el-input v-model="formData.roleComment" style="width: 250px" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>

    <!-- 角色权限设置对话框 -->
    <el-drawer v-if="drawer" v-model="drawer" :before-close="handleClose" :show-close="false" size="40%">
      <template #header>
        <h4 style="font-size: 20px; font-weight: bold">权限设置</h4>
      </template>
      <el-tabs type="border-card">
        <el-tab-pane label="角色菜单权限">
          <Menus ref="menus" :row="formData.menuIdList" @changeRow="onMenusChange" />
        </el-tab-pane>
        <el-tab-pane label="角色接口权限">
          <Resource ref="apis" :row="formData.resourceIdList" @changeRow="onResourceChange" />
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="cancelClick">cancel</el-button>
          <el-button type="primary" @click="confirmClick">confirm</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, reactive, ref, watch } from "vue"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox, ElTree } from "element-plus"
import {
  Search,
  Refresh,
  CirclePlus,
  Delete,
  Download,
  RefreshRight,
  EditPen,
  Menu,
  Timer,
} from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import {
  createRoleApi,
  deleteRoleByIdsApi,
  updateRoleApi,
  findRoleListDetailsApi,
  updateRoleMenusApi,
  updateRoleResourcesApi,
} from "@/api/role"
import Menus from "./components/menus.vue"
import Resource from "./components/resource.vue"

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

// #region 查
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  username: "",
  phone: "",
})
// 搜索
const onSearchList = () => {
  if (paginationData.currentPage === 1) {
    getTableData()
  }
  paginationData.currentPage = 1
}

// 重置
const resetSearch = () => {
  searchFormRef.value?.resetFields()
  if (paginationData.currentPage === 1) {
    getTableData()
  }
  paginationData.currentPage = 1
}

const tableData = ref<any[]>([])

// 查询列表
const getTableData = () => {
  loading.value = true
  findRoleListDetailsApi({})
    .then((res) => {
      paginationData.total = res.data.total
      // 会引起页面刷新
      paginationData.pageSize = res.data.page_size
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
  id: 0,
  roleName: "",
  roleDomain: "",
  roleComment: "",
  // created_at: '',
  resourceIdList: [],
  menuIdList: [],
})
const formRules: FormRules = reactive({
  username: [{ required: false, trigger: "blur", message: "请输入角色名" }],
  password: [{ required: false, trigger: "blur", message: "请输入密码" }],
})

const dialogFormVisible = ref<boolean>(false)
const isAdd = ref(false)

const addMenu = (row) => {
  resetForm()
  isAdd.value = true
  dialogFormVisible.value = true
}
// 修改菜单方法
const editMenu = (row) => {
  if (row) {
    formData.value = row
  } else {
    resetForm()
  }
  isAdd.value = false
  // drawer.value = true
  dialogFormVisible.value = true
}

const openDrawer = (row) => {
  if (row) {
    formData.value = row
  } else {
    resetForm()
  }
  drawer.value = true
}

const resetForm = () => {
  // currentUpdateId.value = undefined
  formData.value = {
    id: 0,
    roleName: "",
    roleDomain: "",
    roleComment: "",
    // created_at: '',
    resourceIdList: [],
    menuIdList: [],
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
  createRoleApi(row).then(() => {
    ElMessage.success("添加成功")
    getTableData()
  })
}

const doUpdate = (row) => {
  updateRoleApi(row).then(() => {
    ElMessage.success("修改成功")
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

  console.log("selectionIds", selectionIds.value)
}

const doDeleteByIds = (ids) => {
  deleteRoleByIdsApi(ids).then(() => {
    ElMessage.success("批量删除成功")
    getTableData()
    isDelete.value = false
  })
}

const doDelete = (row) => {
  deleteRoleByIdsApi([row.id]).then(() => {
    ElMessage.success("删除成功")
    getTableData()
  })
}
const onDelete = (row) => {
  ElMessageBox.confirm(`正在删除角色：${row.roleName}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    console.log("row", row.id)
    doDelete({ id: row.id })
  })
}
// #endregion

const drawer = ref(false)
const activeMenus = ref([])
const activeResources = ref([])
const onMenusChange = (key, value) => {
  console.log(key, value)
  activeMenus.value = value
}
const onResourceChange = (key, value) => {
  console.log(key, value)
  activeResources.value = value
}

const handleClose = (done: () => void) => {
  ElMessageBox.confirm("Are you sure you want to close this?")
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}
function cancelClick() {
  drawer.value = false
}
function confirmClick() {
  ElMessageBox.confirm(`Are you confirm to chose ?`)
    .then(() => {
      updateMenus()
      updateResources()

      drawer.value = false
    })
    .catch(() => {
      // catch error
    })
}

function updateResources() {
  const v1 = JSON.stringify(activeResources.value.sort(fun))
  const v2 = JSON.stringify(formData.value.resourceIdList.sort(fun))
  // console.log('1--', v1)
  // console.log('2--', v2)

  const isEqual = v1 === v2
  console.log(isEqual)

  if (v1 != "[]" && !isEqual) {
    updateRoleResourcesApi({
      roleId: formData.value.id,
      resourceIds: activeResources.value,
    }).then((res) => {
      ElMessage.success("操作成功")
      getTableData()
    })
  }
}

function updateMenus() {
  const v1 = JSON.stringify(activeMenus.value.sort(fun))
  const v2 = JSON.stringify(formData.value.menuIdList.sort(fun))
  // console.log('1--', v1)
  // console.log('2--', v2)

  const isEqual = v1 === v2
  console.log(isEqual)

  if (v1 != "[]" && !isEqual) {
    updateRoleMenusApi({
      roleId: formData.value.id,
      menuIds: activeMenus.value,
    }).then((res) => {
      ElMessage.success("操作成功")
      getTableData()
    })
  }
}

const fun = (a, b) => {
  if (a < b) {
    return -1
  }
  if (a > b) {
    return 1
  }
  return 0
}
/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })

defineComponent({
  name: "Role",
})
</script>
