<template>
  <div class="log-container">
    <el-card v-loading="loading" shadow="never" class="main-card">
      <!-- 标题 -->
      <div class="title">{{ route.name }}</div>
      <div class="operation-container">
        <el-button
          type="danger"
          size="small"
          icon="el-icon-delete"
          :disabled="logIdList.length === 0"
          @click="isDelete = true"
        >
          批量删除
        </el-button>
        <!-- 数据筛选 -->
        <div style="margin-left: auto">
          <el-input
            v-model="keywords"
            prefix-icon="el-icon-search"
            size="small"
            placeholder="请输入模块名或描述"
            style="width: 200px"
            @keyup.enter="searchLogs"
          />
          <el-button type="primary" size="small" icon="el-icon-search" style="margin-left: 1rem" @click="searchLogs">
            搜索
          </el-button>
        </div>
      </div>
      <!-- 权限列表 -->
      <el-table @selection-change="selectionChange" :loading="loading" :data="logList">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="optModule" label="系统模块" align="center" width="120" />
        <el-table-column width="100" prop="optType" label="操作类型" align="center" />
        <el-table-column prop="optDesc" label="操作描述" align="center" width="150" />
        <el-table-column prop="requetMethod" label="请求方式" align="center" width="100">
          <template #default="scope">
            <el-tag :type="tagType(scope.row.requestMethod)">
              {{ scope.row.requestMethod }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="nickname" label="操作人员" align="center" />
        <el-table-column prop="ipAddress" label="登录ip" align="center" width="130" />
        <el-table-column prop="ipSource" label="登录地址" align="center" width="150" />
        <el-table-column prop="createdAt" label="操作日期" align="center" width="190">
          <template #default="scope">
            <i class="el-icon-time" style="margin-right: 5px" />
            {{ scope.row.createdAt }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" width="150">
          <template #default="scope">
            <el-button size="small" text @click="check(scope.row)"> <i class="el-icon-view" /> 查看 </el-button>
            <el-popconfirm title="确定删除吗？" style="margin-left: 10px" @confirm="deleteLog(scope.row.id)">
              <template #reference>
                <el-button text type="danger" size="small" class="operation-button" :icon="Delete"> 删除 </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        class="pagination-container"
        background
        :layout="paginationData.layout"
        :page-sizes="paginationData.pageSizes"
        :total="paginationData.total"
        :page-size="paginationData.pageSize"
        :currentPage="paginationData.currentPage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <!-- 查看模态框 -->
      <el-dialog v-model="isCheck" width="40%">
        <div class="dialog-title-container"><i class="el-icon-more" />详细信息</div>

        <el-form ref="form" :model="optLog" label-width="100px" size="small">
          <el-form-item label="操作模块：">
            {{ optLog.optModule }}
          </el-form-item>
          <el-form-item label="请求地址：">
            {{ optLog.optUrl }}
          </el-form-item>
          <el-form-item label="请求方式：">
            <el-tag :type="tagType(optLog.requestMethod)">
              {{ optLog.requestMethod }}
            </el-tag>
          </el-form-item>
          <el-form-item label="操作方法：">
            {{ optLog.optMethod }}
          </el-form-item>
          <el-form-item label="请求参数：">
            {{ optLog.requestParam }}
          </el-form-item>
          <el-form-item label="返回数据：">
            {{ optLog.responseData }}
          </el-form-item>
          <el-form-item label="操作人员：">
            {{ optLog.nickname }}
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 批量删除对话框 -->
      <el-dialog v-model="isDelete" width="30%">
        <div class="dialog-title-container"><i class="el-icon-warning" style="color: #ff9900" />提示</div>
        <div style="font-size: 1rem">是否删除选中项？</div>
        <template #footer>
          <el-button @click="isDelete = false">取 消</el-button>
          <el-button type="primary" @click="deleteLog(null)"> 确 定 </el-button>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue"
import { useRoute } from "vue-router"
import { findOperationListApi } from "@/api/operation"
import { usePagination } from "@/hooks/usePagination"
import { Delete } from "@element-plus/icons-vue"

const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
// 获取路由参数
const route = useRoute()

const loading = ref(false)
const logList = ref([])
const logIdList = ref([])
const keywords = ref(null)
const isCheck = ref(false)
const isDelete = ref(false)
const optLog = ref({})

const selectionChange = (logList) => {
  logIdList.value = logList.map((item) => item.id)
}

const searchLogs = () => {
  paginationData.currentPage = 1
  listLogs()
}

const listLogs = () => {
  findOperationListApi({
    page: paginationData.currentPage,
    pageSize: paginationData.pageSize
  }).then((res) => {
    logList.value = res.data.list
    paginationData.total = res.data.total
  })
}

const deleteLog = (id) => {
  // Your delete logic here
}

const check = (optLog) => {
  // Your check logic here
}

const tagType = (type) => {
  switch (type) {
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
watch([() => paginationData.currentPage, () => paginationData.pageSize], listLogs, { immediate: true })
// On mounted hook
onMounted(() => {
  listLogs()
})
</script>

<style scoped>
label {
  font-weight: bold !important;
}
</style>
