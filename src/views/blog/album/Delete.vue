<template>
  <div class="app-container">
    <el-card class="main-card">
      <!-- 标题 -->
      <div class="table-title">{{ $route.meta.title }}</div>
      <!-- 相册操作 -->
      <div class="operation">
        <div class="all-check">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">
            全选
          </el-checkbox>
          <div class="check-count">已选择{{ selectionIds.length }}张</div>
        </div>
        <el-button
          type="success"
          @click="updatePhotoDelete(null)"
          :disabled="selectionIds.length === 0"
          size="default"
          icon="deleteItem"
        >
          批量恢复
        </el-button>
        <el-button
          type="danger"
          @click="batchDeletePhoto = true"
          :disabled="selectionIds.length === 0"
          size="default"
          icon="deleteItem"
        >
          批量删除
        </el-button>
      </div>
      <!-- 照片列表 -->
      <el-row class="photo-container" :gutter="10" v-loading="loading">
        <!-- 空状态 -->
        <el-empty v-if="tableData.length === 0" style="width: 100%" description="暂无照片" />
        <el-checkbox-group v-model="selectionIds" @change="handleCheckedPhotoChange">
          <el-col :md="4" v-for="item in tableData" :key="item.id">
            <el-checkbox :label="item.id">
              <div class="photo-item">
                <el-image
                  fit="cover"
                  class="photo-img"
                  :src="item.photoSrc"
                  :preview-src-list="tableData.map((photo) => photo.photoSrc)"
                />
                <div class="photo-name">{{ item.photoName }}</div>
              </div>
            </el-checkbox>
          </el-col>
        </el-checkbox-group>
      </el-row>
      <!-- 分页 -->
      <el-pagination
        :hide-on-single-page="true"
        class="pagination-container"
        background
        :current-page="pagination.currentPage"
        :page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="pagination.pageSizes"
        :layout="pagination.layout"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <!-- 批量删除对话框 -->
      <el-dialog v-model="removeVisibility" width="30%">
        <template #header>
          <div class="dialog-title-container">
            <el-icon style="color: #ff9900">
              <Warning />
            </el-icon>
            提示
          </div>
        </template>
        <div style="font-size: 1rem">是否删除选中照片？</div>
        <template #footer>
          <el-button @click="removeVisibility = false">取 消</el-button>
          <el-button type="primary" @click="onDeleteByIds(selectionIds)"> 确 定</el-button>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue"
import { useTableHook } from "./delete"

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
  onSearchList,
  onSave,
  onDelete,
  onDeleteByIds,
  onChange,
  handleAddOrEdit,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange,
} = useTableHook()

const dialogTitle = computed(() => {
  if (formData.value.id == 0) {
    return "添加友链"
  } else {
    return "编辑友链"
  }
})

onMounted(() => {
  loading.value = false
  // onSearchList()
})
</script>

<style scoped>
.operation {
  display: flex;
  justify-content: flex-end;
  margin-top: 2.25rem;
  margin-bottom: 2rem;
}

.all-check {
  display: inline-flex;
  align-items: center;
  margin-right: 1rem;
}

.check-count {
  margin-left: 1rem;
  font-size: 12px;
}

.photo-item {
  position: relative;
  cursor: pointer;
  margin-bottom: 1rem;
}

.photo-img {
  width: 100%;
  height: 7rem;
  border-radius: 4px;
}

.photo-name {
  font-size: 14px;
  margin-top: 0.3rem;
  text-align: center;
}
</style>
