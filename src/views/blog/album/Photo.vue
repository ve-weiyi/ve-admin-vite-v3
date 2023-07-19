<template>
  <div class="app-container">
    <el-card class="main-card">
      <!-- 标题 -->
      <div class="table-title">{{ $route.meta.title }}</div>
      <!-- 相册信息 -->
      <div class="album-info">
        <el-image fit="cover" class="album-cover" :src="albumInfo.albumCover" />
        <div class="album-detail">
          <div style="margin-bottom: 0.6rem">
            <span class="album-name">{{ albumInfo.albumName }}</span>
            <span class="photo-count">{{ albumInfo.photoCount }}张</span>
          </div>
          <div>
            <span v-if="albumInfo.albumDesc" class="album-desc">
              {{ albumInfo.albumDesc }}
            </span>
            <el-button icon="picture" type="primary" size="small" @click="uploadPhoto = true">
              上传照片
            </el-button>
          </div>
        </div>
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
            @click="movePhoto = true"
            :disabled="selectionIds.length === 0"
            size="small"
            icon="deleteItem"
          >
            移动到
          </el-button>
          <el-button
            type="danger"
            @click="batchDeletePhoto = true"
            :disabled="selectionIds.length === 0"
            size="small"
            icon="deleteItem"
          >
            批量删除
          </el-button>
        </div>
      </div>
      <!-- 照片列表 -->
      <el-row class="photo-container" :gutter="10" v-loading="loading">
        <!-- 空状态 -->
        <el-empty v-if="tableData.length === 0" description="暂无照片" />
        <el-checkbox-group v-model="selectionIds" @change="handleCheckedPhotoChange">
          <el-col :md="4" v-for="item in tableData" :key="item.id">
            <el-checkbox :label="item.id">
              <div class="photo-item">
                <!-- 照片操作 -->
                <div class="photo-opreation">
                  <el-dropdown @command="handleCommand">
                    <i class="el-icon-more" style="color: #fff" />
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item :command="JSON.stringify(item)">
                          <i class="el-icon-edit" />编辑
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
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
      <!-- 上传模态框 -->
      <el-dialog v-model="uploadPhoto" width="70%" top="10vh">
        <template #header>
          <div class="dialog-title-container">上传照片</div>
        </template>
        <!-- 上传 -->
        <div class="upload-container">
          <el-upload
            v-show="uploadList.length > 0"
            action="/api/admin/photos/albums/cover"
            list-type="picture-card"
            :file-list="uploadList"
            multiple
            :before-upload="beforeUpload"
            :on-success="upload"
            :on-remove="handleRemove"
          >
            <i class="el-icon-plus" />
          </el-upload>
          <div class="upload">
            <el-upload
              v-show="uploadList.length === 0"
              drag
              action="/api/admin/photos/albums/cover"
              multiple
              :before-upload="beforeUpload"
              :on-success="upload"
              :show-file-list="false"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <template #tip>
                <div class="el-upload__tip">支持上传jpg/png文件</div>
              </template>
            </el-upload>
          </div>
        </div>
        <template #footer>
          <div class="upload-footer">
            <div class="upload-count">共上传{{ uploadList.length }}张照片</div>
            <div style="margin-left: auto">
              <el-button @click="uploadPhoto = false">取 消</el-button>
              <el-button @click="savePhotos" type="primary" :disabled="uploadList.length === 0"> 开始上传</el-button>
            </div>
          </div>
        </template>
      </el-dialog>
      <!-- 编辑对话框 -->
      <el-dialog v-model="editPhoto" width="30%">
        <template #header>
          <div class="dialog-title-container">修改信息</div>
        </template>
        <el-form label-width="80px" size="medium" :model="photoForm">
          <el-form-item label="照片名称">
            <el-input style="width: 220px" v-model="photoForm.photoName" />
          </el-form-item>
          <el-form-item label="照片描述">
            <el-input style="width: 220px" v-model="photoForm.photoDesc" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="editPhoto = false">取 消</el-button>
          <el-button type="primary" @click="updatePhoto"> 确 定</el-button>
        </template>
      </el-dialog>
      <!-- 批量删除对话框 -->
      <el-dialog v-model="batchDeletePhoto" width="30%">
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
          <el-button @click="batchDeletePhoto = false">取 消</el-button>
          <el-button type="primary" @click="updatePhotoDelete(null)"> 确 定</el-button>
        </template>
      </el-dialog>
      <!-- 移动对话框 -->
      <el-dialog v-model="movePhoto" width="30%">
        <template #header>
          <div class="dialog-title-container">移动照片</div>
        </template>
        <el-empty v-if="albumList.length < 2" description="暂无其他相册" />
        <el-form v-else label-width="80px" size="medium" :model="photoForm">
          <el-radio-group v-model="albumId">
            <div class="album-check-item">
              <template v-for="item in albumList">
                <el-radio v-if="item.id !== albumInfo.id" :key="item.id" :label="item.id" style="margin-bottom: 1rem">
                  <div class="album-check">
                    <el-image fit="cover" class="album-check-cover" :src="item.albumCover" />
                    <div style="margin-left: 0.5rem">{{ item.albumName }}</div>
                  </div>
                </el-radio>
              </template>
            </div>
          </el-radio-group>
        </el-form>
        <template #footer>
          <el-button @click="movePhoto = false">取 消</el-button>
          <el-button :disabled="albumId === null" type="primary" @click="updatePhotoAlbum"> 确 定</el-button>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue"
import { useTableHook } from "./photo"
import { useRoute } from "vue-router"

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
  albumInfo,
  getAlbumInfo,
} = useTableHook()

const dialogTitle = computed(() => {
  if (formData.value.id == 0) {
    return "添加友链"
  } else {
    return "编辑友链"
  }
})

// 获取路由参数
const route = useRoute()
const albumId = route.params.id ? parseInt(route.params.id as string) : 0 // 假设路由参数名为 "id"

onMounted(() => {
  getAlbumInfo(albumId)
  onSearchList()
})
</script>

<style scoped>
.album-info {
  display: flex;
  margin-top: 2.25rem;
  margin-bottom: 2rem;
}

.album-cover {
  border-radius: 4px;
  width: 5rem;
  height: 5rem;
}

.album-check-cover {
  border-radius: 4px;
  width: 4rem;
  height: 4rem;
}

.album-detail {
  padding-top: 0.4rem;
  margin-left: 0.8rem;
}

.album-desc {
  font-size: 14px;
  margin-right: 0.8rem;
}

.operation {
  padding-top: 1.5rem;
  margin-left: auto;
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

.album-name {
  font-size: 1.25rem;
}

.photo-count {
  font-size: 12px;
  margin-left: 0.5rem;
}

.photo-item {
  width: 100%;
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

.upload-container {
  height: 400px;
}

.upload {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-footer {
  display: flex;
  align-items: center;
}

.photo-opreation {
  position: absolute;
  z-index: 1000;
  top: 0.3rem;
  right: 0.5rem;
}

.album-check {
  display: flex;
  align-items: center;
}
</style>
