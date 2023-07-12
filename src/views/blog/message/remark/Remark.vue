<template>
  <div class="app-container">
    <!-- 表格搜索条件 -->
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="type" label="来源：">
          <el-select clearable v-model="searchData.type" placeholder="请选择来源">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item prop="username" label="用户昵称：">
          <el-input clearable v-model="searchData.username" placeholder="请输入用户昵称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleSearch">搜索</el-button>
          <el-button icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格 -->
    <el-card v-loading="loading" shadow="never" class="main-card">
      <div class="table-title">{{ $route.name }}</div>
      <div class="toolbar-wrapper">
        <div class="review-menu">
          <span>状态</span>
          <span
            @click="changeReview(null)"
            :class="{ 'active-review': searchData.isReview === null, review: searchData.isReview !== null }"
          >
            全部
          </span>
          <span
            @click="changeReview(1)"
            :class="{ 'active-review': searchData.isReview === 1, review: searchData.isReview !== 1 }"
          >
            正常
          </span>
          <span
            @click="changeReview(0)"
            :class="{ 'active-review': searchData.isReview === 0, review: searchData.isReview !== 0 }"
          >
            审核中
          </span>
        </div>
        <!-- 表格操作 -->
        <div class="operation-container">
          <el-button
            type="danger"
            size="default"
            icon="delete"
            :disabled="selectionIds.length === 0"
            @click="removeVisibility = true"
          >
            批量删除
          </el-button>
          <el-button
            type="success"
            size="default"
            icon="CircleCheck"
            :disabled="selectionIds.length === 0"
            @click="handleUpdate(null)"
          >
            批量通过
          </el-button>
        </div>
      </div>
      <!-- 表格展示 -->
      <el-table border :data="tableData" @selection-change="handleSelectionChange" :loading="loading">
        <!-- 表格列 -->
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column prop="avatar" label="头像" align="center" width="80">
          <template #default="{ row }">
            <img :src="row.avatar" width="40" height="40" />
          </template>
        </el-table-column>
        <el-table-column prop="nickname" label="留言人" align="center" width="150" />
        <el-table-column prop="messageContent" label="留言内容" align="center" />
        <el-table-column prop="ipAddress" label="ip地址" align="center" width="150" />
        <el-table-column prop="ipSource" label="ip来源" align="center" width="170" />
        <!-- 状态 -->
        <el-table-column prop="isReview" label="状态" width="80" align="center">
          <template #default="{ row }">
            <el-tag v-if="!row.isReview" type="warning">审核中</el-tag>
            <el-tag v-if="row.isReview" type="success">正常</el-tag>
          </template>
        </el-table-column>
        <!-- 评论时间 -->
        <el-table-column prop="createdAt" label="评论时间" width="150" align="center">
          <template #default="{ row }">
            <i class="el-icon-time" style="margin-right: 5px"></i>
            {{ formatDateTime(row.createdAt) }}
          </template>
        </el-table-column>
        <!-- 列操作 -->
        <el-table-column label="操作" width="160" align="center">
          <template #default="{ row }">
            <el-button v-if="!row.isReview" size="default" type="success" @click="handleUpdate(row)"> 通过 </el-button>
            <el-popconfirm style="margin-left: 10px" title="确定删除吗？" @confirm="handleDelete(row)">
              <template #reference>
                <el-button size="default" type="danger">删除</el-button>
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue"
import { useTableHook } from "./hook"
import { formatDateTime } from "@/utils"

const {
  loading,
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
  handleCreate,
  handleUpdate,
  handleDelete,
  handleDeleteByIds,
  onChange,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange
} = useTableHook()

// 数据绑定
const removeVisibility = ref(false)

const options = [
  {
    value: 1,
    label: "文章"
  },
  {
    value: 2,
    label: "友链"
  },
  {
    value: 3,
    label: "说说"
  }
]

const changeReview = (review) => {
  searchData.isReview = review
  // Perform the necessary logic
  handleSearch()
}
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
