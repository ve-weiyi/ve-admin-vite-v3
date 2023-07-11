<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { CirclePlus, Delete, Download, RefreshRight, EditPen, Timer, Plus } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import { getRoleTreeApi } from "@/api/role"
import { deleteByIdsUserAccountApi, findUserListApi, updateUserRolesApi, updateUserStatusApi } from "@/api/admin"

const loading = ref<boolean>(false)
const alignType = ref<string>("center")
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

const tableData = ref<any[]>([])
const roles = ref<any[]>([])
// 查询列表
const getTableData = () => {
  loading.value = true
  findUserListApi({
    page: paginationData.currentPage,
    pageSize: paginationData.pageSize
  })
    .then((res) => {
      paginationData.total = res.data.total
      paginationData.pageSize = res.data.pageSize
      tableData.value = res.data.list
    })
    .catch(() => {
      tableData.value = []
    })
    .finally(() => {
      loading.value = false
    })

  getRoleTreeApi().then((res) => {
    paginationData.total = res.data.total
    roles.value = res.data.list
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
  id: "",
  uuid: "",
  createdAt: "",
  roles: [
    {
      id: 0
    }
  ]
})
const formRules: FormRules = reactive({
  username: [{ required: false, trigger: "blur", message: "请输入用户名" }],
  password: [{ required: false, trigger: "blur", message: "请输入密码" }]
})

const dialogFormVisible = ref<boolean>(false)
const isAdd = ref(false)
const roleCheckIds = ref<number[]>([])

const addUser = (row) => {
  resetForm()
  isAdd.value = true
  dialogFormVisible.value = true
}
// 修改菜单方法
const editUser = (row) => {
  formData.value = row
  const ids = []
  for (const rowKey of formData.value.roles) {
    ids.push(rowKey.id)
  }
  console.log("roleCheckIds", ids)
  roleCheckIds.value = ids
  isAdd.value = false
  dialogFormVisible.value = true
}

const resetForm = () => {
  roleCheckIds.value = []
  formData.value = {
    id: "",
    uuid: "",
    createdAt: "",
    roles: []
  }
}
// 提交
const submitForm = () => {
  updateUserRolesApi({
    userId: formData.value.uuid,
    roleIds: roleCheckIds.value
  })
  getTableData()
  dialogFormVisible.value = false
}

const doUpdate = (row) => {
  updateUserStatusApi(row).then(() => {
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
  deleteByIdsUserAccountApi(ids).then(() => {
    ElMessage.success("批量删除成功")
    getTableData()
    isDelete.value = false
  })
}

const doDelete = (row) => {
  deleteByIdsUserAccountApi([row.id]).then(() => {
    ElMessage.success("删除成功")
    getTableData()
  })
}
const handleDelete = (row) => {
  ElMessageBox.confirm(`正在删除用户：${row.roleName}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    console.log("row", row.id)
    doDelete({ id: row.id })
  })
}
// #endregion

function tagType(method) {
  switch (method) {
    case "GET":
      return ""
    case "POST":
      return "success"
    case "PUT":
      return "warning"
    case "DELETE":
      return "danger"
    default:
      return ""
  }
}

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })

defineOptions({
  name: "UserList"
})
</script>

<template>
  <div class="app-container">
    <!-- 表格内容 -->
    <el-card v-loading="loading" shadow="never" class="main-card">
      <div class="table-title">{{ $route.name }}</div>
      <div class="operation-container">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="addUser">新增菜单</el-button>
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
          <el-table-column prop="avatar" label="头像" :align="alignType" width="auto">
            <template #default="scope">
              <img :src="scope.row.avatar" width="40" height="40" />
            </template>
          </el-table-column>
          <el-table-column prop="nickname" label="昵称" :align="alignType" width="auto" />
          <el-table-column prop="loginType" label="登录方式" :align="alignType" width="auto">
            <template #default="scope">
              <el-tag type="success" v-if="scope.row.loginType === 1">邮箱</el-tag>
              <el-tag v-if="scope.row.loginType === 2">QQ</el-tag>
              <el-tag type="danger" v-if="scope.row.loginType === 3">微博</el-tag>
              <el-tag type="info" v-if="scope.row.loginType === 0">账号</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="roles" label="用户角色" :align="alignType" width="auto">
            <template #default="scope">
              <el-tag v-for="(item, index) of scope.row.roles" :key="index" style="margin-right: 4px; margin-top: 4px">
                {{ item.roleName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="ipAddress" label="登录ip" :align="alignType" width="auto">
            <template #default="scope">
              <el-tag v-if="scope.row.method" :type="tagType(scope.row.method)">
                {{ scope.row.method }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="是否禁用" align="center" width="100">
            <template #default="scope">
              <el-switch
                v-model="scope.row.status"
                active-color="#13ce66"
                inactive-color="#F4F4F5"
                :active-value="1"
                :inactive-value="0"
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
          <el-table-column prop="lastLoginTime" label="上次登录时间" width="auto" :align="alignType">
            <template #default="scope">
              <el-icon>
                <Timer />
              </el-icon>
              {{ scope.row.lastLoginTime }}
            </template>
          </el-table-column>
          <!-- 列操作 -->
          <el-table-column fixed="right" label="操作" :align="alignType" width="120">
            <template #default="scope">
              <el-button
                class="operation-button"
                text
                type="primary"
                size="small"
                :icon="EditPen"
                @click="editUser(scope.row)"
              >
                编辑
              </el-button>
              <!--              <el-popconfirm title="确定删除吗？" @confirm="doDelete(scope.row)">-->
              <!--                <template #reference>-->
              <!--                  <el-button text type="danger" size="small" class="operation-button" :icon="Delete"> 删除 </el-button>-->
              <!--                </template>-->
              <!--              </el-popconfirm>-->
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

    <!-- 修改对话框 -->
    <el-dialog v-model="dialogFormVisible" title="修改用户角色" @close="resetForm" width="30%">
      <el-form label-width="60px" size="default" :model="formData">
        <el-form-item label="昵称">
          <el-input v-model="formData.nickname" style="width: 220px" />
        </el-form-item>
        <el-form-item label="角色">
          <el-checkbox-group v-model="roleCheckIds">
            <el-checkbox v-for="item of roles" :key="item.id" :label="item.id">
              {{ item.roleName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
