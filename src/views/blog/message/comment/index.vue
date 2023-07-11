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
          <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
          <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格 -->
    <el-card v-loading="loading" shadow="never" class="main-card">
      <div class="title">{{ $route.name }}</div>
      <div class="toolbar-wrapper">
        <div class="review-menu">
          <span>状态</span>
          <span @click="changeReview(null)" :class="{ 'active-review': isReview === null, review: isReview !== null }">
            全部
          </span>
          <span @click="changeReview(1)" :class="{ 'active-review': isReview === 1, review: isReview !== 1 }">
            正常
          </span>
          <span @click="changeReview(0)" :class="{ 'active-review': isReview === 0, review: isReview !== 0 }">
            审核中
          </span>
        </div>
        <!-- 表格操作 -->
        <div class="operation-container">
          <el-button
            type="danger"
            size="default"
            icon="el-icon-delete"
            :disabled="selectIds.length === 0"
            @click="remove = true"
          >
            批量删除
          </el-button>
          <el-button
            type="success"
            size="default"
            icon="el-icon-success"
            :disabled="selectIds.length === 0"
            @click="handleUpdate(null)"
          >
            批量通过
          </el-button>
        </div>
      </div>
      <!-- 表格展示 -->
      <el-table border :data="tableData" @selection-change="handleSelectionChange" :loading="loading">
        <!-- 表格列 -->
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="avatar" label="头像" align="center" width="80">
          <template #default="{ row }">
            <img :src="row.avatar" width="40" height="40" />
          </template>
        </el-table-column>
        <!-- 评论人昵称 -->
        <el-table-column prop="nickname" label="评论人" align="center" width="120"></el-table-column>
        <!-- 回复人昵称 -->
        <el-table-column prop="replyNickname" label="回复人" align="center" width="120">
          <template #default="{ row }">
            <span v-if="row.replyNickname">{{ row.replyNickname }}</span>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <!-- 评论文章标题 -->
        <el-table-column prop="articleTitle" label="文章标题" align="center">
          <template #default="{ row }">
            <span v-if="row.articleTitle">{{ row.articleTitle }}</span>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <!-- 评论内容 -->
        <el-table-column prop="commentContent" label="评论内容" align="center">
          <template #default="{ row }">
            <span v-html="row.commentContent" class="comment-content"></span>
          </template>
        </el-table-column>
        <!-- 评论时间 -->
        <el-table-column prop="createdAt" label="评论时间" width="150" align="center">
          <template #default="{ row }">
            <i class="el-icon-time" style="margin-right: 5px"></i>
            {{ row.createdAt }}
          </template>
        </el-table-column>
        <!-- 状态 -->
        <el-table-column prop="isReview" label="状态" width="80" align="center">
          <template #default="{ row }">
            <el-tag v-if="!row.isReview" type="warning">审核中</el-tag>
            <el-tag v-if="row.isReview" type="success">正常</el-tag>
          </template>
        </el-table-column>
        <!-- 来源 -->
        <el-table-column label="来源" align="center" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.type === 1">文章</el-tag>
            <el-tag v-if="row.type === 2" type="warning">友链</el-tag>
            <el-tag v-if="row.type === 3" type="danger">说说</el-tag>
          </template>
        </el-table-column>
        <!-- 列操作 -->
        <el-table-column label="操作" width="160" align="center">
          <template #default="{ row }">
            <el-button :disabled="row.isReview" size="default" type="success" @click="handleUpdate(row)"> 通过 </el-button>
            <el-popconfirm style="margin-left: 10px" title="确定删除吗？" @confirm="handleDelete(row)">
              <el-button size="default" type="danger">删除</el-button>
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
      <!-- 批量彻底删除对话框 -->
      <el-dialog :v-model="remove" width="30%">
        <div class="dialog-title-container"><i class="el-icon-warning" style="color: #ff9900" />提示</div>
        <div style="font-size: 1rem">是否彻底删除选中项？</div>
        <template #footer>
          <el-button @click="remove = false">取 消</el-button>
          <el-button type="primary" @click="handleDelete(null)">确 定</el-button>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue"
import { useTableHook } from "./hook"
import { Refresh, Search } from "@element-plus/icons-vue"

const {
  loading,
  formRef,
  formData,
  formRules,
  searchFormRef,
  searchData,
  tableData,
  selectIds,
  pagination,
  resetForm,
  resetSearch,
  handleSearch,
  handleCreate,
  handleUpdate,
  handleDelete,
  onChange,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange
} = useTableHook()

// 数据绑定
const isReview = ref(null)
const remove = ref(false)

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
  isReview.value = review
  // Perform the necessary logic
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
