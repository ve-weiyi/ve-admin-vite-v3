<template>
  <div class="app-container">
    <!-- 表格搜索条件 -->
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="linkName" label="友链名：">
          <el-input clearable v-model="searchData.linkName" placeholder="请输入友链名" />
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
        <!-- 表格操作 -->
        <div class="operation-container">
          <el-button type="primary" size="default" icon="Plus" @click="onAddOrEdit(null)"> 新增</el-button>
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
      <el-table border :data="tableData" @selection-change="handleSelectionChange" :loading="loading">
        <!-- 表格列 -->
        <el-table-column type="selection" width="40"></el-table-column>
        <!-- 标签名 -->
        <el-table-column prop="tagName" label="标签名" align="center">
          <template #default="scope">
            <el-tag>
              {{ scope.row.tagName }}
            </el-tag>
          </template>
        </el-table-column>
        <!-- 创建时间 -->
        <el-table-column prop="createdAt" label="创建时间" align="center">
          <template #default="scope">
            <i class="el-icon-time" style="margin-right: 5px" />
            {{ scope.row.createdAt }}
          </template>
        </el-table-column>
        <!-- 文章量 -->
        <el-table-column prop="articleCount" label="文章量" align="center" />
        <!-- 列操作 -->
        <el-table-column label="操作" align="center" width="160">
          <template #default="{ row }">
            <el-button type="primary" size="default" @click="onAddOrEdit(row)"> 编辑</el-button>
            <el-popconfirm title="确定删除吗？" style="margin-left: 1rem" @confirm="handleDelete(row)">
              <template #reference>
                <el-button type="danger" size="default"> 删除</el-button>
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

    <!-- 添加对话框 -->
    <el-dialog v-model="addOrEditVisibility" width="40%">
      <template #header>
        <div class="dialog-title-container">
          {{ linkTitle }}
        </div>
      </template>
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="80px" size="default">
        <el-form-item prop="linkAvatar" label="链接头像">
          <el-input style="width: 100%" v-model="formData.linkAvatar" />
        </el-form-item>
        <el-form-item prop="linkName" label="链接名">
          <el-input style="width: 100%" v-model="formData.linkName" />
        </el-form-item>
        <el-form-item prop="linkAddress" label="链接地址">
          <el-input style="width: 100%" v-model="formData.linkAddress" />
        </el-form-item>
        <el-form-item prop="linkIntro" label="链接介绍">
          <el-input style="width: 100%" v-model="formData.linkIntro" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addOrEditVisibility = false">取 消</el-button>
        <el-button type="primary" @click="handleSave(formData)"> 确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue"
import { useTableHook } from "./tag"

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
  if (formData.id == 0) {
    return "添加友链"
  } else {
    return "编辑友链"
  }
})

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
