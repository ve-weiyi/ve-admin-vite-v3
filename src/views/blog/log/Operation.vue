<template>
  <div class="app-container">
    <!-- 表格搜索条件 -->
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="optModule" label="模块名：">
          <el-input clearable v-model="searchData.optModule" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="optType" label="操作类型：">
          <el-select v-model="searchData.optType" placeholder="请选择类型">
            <el-option v-for="item in options" :key="item.label" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleSearch">搜索</el-button>
          <el-button icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格 -->
    <el-card v-loading="loading" shadow="never" class="main-card">
      <div class="table-title">{{ $route.meta.title }}</div>
      <div class="toolbar-wrapper">
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
        </div>
      </div>
      <!-- 表格展示 -->
      <el-table :data="tableData" border @selection-change="handleSelectionChange" :loading="loading">
        <el-table-column type="selection" width="40" align="center" />
        <el-table-column prop="id" label="id" align="center" width="80" />
        <el-table-column prop="optModule" label="系统模块" align="center" width="100" />
        <el-table-column prop="optType" label="操作类型" align="center" width="100" />
        <el-table-column prop="optDesc" label="操作描述" align="center" width="150" />
        <el-table-column prop="requestMethod" label="请求方式" align="center" width="100">
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
            {{ formatDateTime(scope.row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" width="150">
          <template #default="scope">
            <el-button text type="primary" size="small" @click="onAddOrEdit(scope.row)" icon="view">
              <i class="el-icon-view" /> 查看
            </el-button>
            <el-popconfirm title="确定删除吗？" style="margin-left: 10px" @confirm="handleDelete(scope.row)">
              <template #reference>
                <el-button text type="primary" size="small" class="operation-button" icon="delete"> 删除 </el-button>
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
        <el-button type="primary" @click="handleDeleteByIds(selectionIds)">确 定</el-button>
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
        <el-form-item label="操作模块：">
          <div>{{ formData.optModule }}</div>
        </el-form-item>
        <el-form-item label="请求地址：">
          {{ formData.optUrl }}
        </el-form-item>
        <el-form-item label="请求方式：">
          <el-tag :type="tagType(formData.requestMethod)">
            {{ formData.requestMethod }}
          </el-tag>
        </el-form-item>
        <el-form-item label="操作方法：">
          <div style="width: 100%">{{ formData.optMethod }}</div>
        </el-form-item>
        <el-form-item label="请求参数：">
          <div style="width: 100%">{{ formData.requestParam }}</div>
        </el-form-item>
        <el-form-item label="返回数据：">
          <div style="width: 100%">{{ formData.responseData }}</div>
        </el-form-item>
        <el-form-item label="操作人员：">
          {{ formData.nickname }}
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue"
import { useTableHook } from "./hook"
import { formatDateTime } from "@/utils"

const {
  loading,
  removeVisibility,
  addOrEditVisibility,
  formRef,
  formData,
  formRules,
  searchFormRef,
  searchData,
  tableData,
  selectionIds,
  pagination,
  resetForm,
  resetSearch,
  handleSearch,
  handleSave,
  handleDelete,
  handleDeleteByIds,
  onChange,
  onAddOrEdit,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange
} = useTableHook()

const linkTitle = computed(() => {
  if (formData.value.id == 0) {
    return "添加友链"
  } else {
    return "编辑友链"
  }
})

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

const options = [
  {
    value: "新增",
    label: "新增"
  },
  {
    value: "修改",
    label: "修改"
  },
  {
    value: "删除",
    label: "删除"
  },
  {
    value: "查询",
    label: "查询"
  },
  {
    value: "新增或修改",
    label: "新增或修改"
  }
]
</script>

<style lang="scss" scoped>
.search-wrapper {
  margin-bottom: 10px;

  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}

.review-menu {
  font-size: 14px;
  margin-top: 30px;
  color: #999;
}

.review-menu span {
  margin-right: 24px;
}

.review {
  cursor: pointer;
}

.active-review {
  cursor: pointer;
  color: #333;
  font-weight: bold;
}

.comment-content {
  display: inline-block;
}
</style>
