<template>
  <div class="app-container">
    <el-card class="main-card">
      <!-- 标题 -->
      <div class="table-title">{{ $route.meta.title }}</div>
      <div class="operation-container">
        <el-button type="primary" size="default" icon="plus" @click="onSave(null)"> 新建相册 </el-button>
        <div style="margin-left: auto">
          <el-button
            type="text"
            size="default"
            icon="delete"
            style="margin-right: 1rem"
            @click="removeVisibility == true"
          >
            回收站
          </el-button>
          <el-input
            v-model="keywords"
            prefix-icon="search"
            size="default"
            placeholder="请输入相册名"
            style="width: 200px"
            @keyup.enter="onSearchList"
          />
          <el-button
            type="primary"
            size="default"
            icon="search"
            style="margin-left: 1rem"
            @click="onSearchList"
          >
            搜索
          </el-button>
        </div>
      </div>
      <!-- 相册列表 -->
      <el-row class="album-container" :gutter="12" v-loading="loading">
        <!-- 空状态 -->
        <el-empty v-if="!tableData" description="暂无相册" />
        <el-col v-for="item in tableData" :key="item.id" :md="6">
          <div class="album-item" @click="checkPhoto(item)">
            <!-- 相册操作 -->
            <div class="album-operation">
              <el-dropdown @command="handleCommand">
                <i class="more" style="color: #fff" />
                <el-dropdown-menu v-slot="dropdown">
                  <el-dropdown-item :command="'update' + JSON.stringify(item)">
                    <i class="el-icon-edit" />编辑
                  </el-dropdown-item>
                  <el-dropdown-item :command="'delete' + item.id"> <i class="delete" />删除 </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div class="album-photo-count">
              <div>{{ item.photoCount }}</div>
              <i v-if="item.status === 2" class="iconfont el-icon-mymima" />
            </div>
            <el-image fit="cover" class="album-cover" :src="item.albumCover" />
            <div class="album-name">{{ item.albumName }}</div>
          </div>
        </el-col>
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
      <!-- 新增模态框 -->
      <el-dialog v-model="addOrEditVisibility" width="35%" top="10vh">
        <template #header>
          <div class="dialog-title-container">
            <el-icon>
              <MoreFilled />
            </el-icon>
            {{ dialogTitle }}}
          </div>
        </template>
        <el-form label-width="80px" size="default" :model="formData">
          <el-form-item label="相册名称">
            <el-input style="width: 220px" v-model="formData.albumName" />
          </el-form-item>
          <el-form-item label="相册描述">
            <el-input style="width: 220px" v-model="formData.albumDesc" />
          </el-form-item>
          <el-form-item label="相册封面">
            <el-upload
              class="upload-cover"
              drag
              :show-file-list="false"
              :before-upload="beforeUpload"
              action="/api/admin/photos/albums/cover"
              multiple
              :on-success="uploadCover"
            >
              <i class="el-icon-upload" v-if="!formData.albumCover" />
              <div class="el-upload__text" v-if="!formData.albumCover">将文件拖到此处，或<em>点击上传</em></div>
              <img v-else :src="formData.albumCover" width="360px" height="180px" />
            </el-upload>
          </el-form-item>
          <el-form-item label="发布形式">
            <el-radio-group v-model="formData.status">
              <el-radio :label="1">公开</el-radio>
              <el-radio :label="2">私密</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="addOrEditVisibility = false">取 消</el-button>
          <el-button type="primary" @click="onSave(formData)"> 确 定 </el-button>
        </template>
      </el-dialog>
      <!-- 删除对话框 -->
      <el-dialog v-model="removeVisibility" width="30%">
        <template #header>
          <div class="dialog-title-container">
            <el-icon style="color: #ff9900">
              <Warning />
            </el-icon>
            提示
          </div>
        </template>
        <div style="font-size: 1rem">是否删除该相册？</div>
        <template #footer>
          <el-button @click="removeVisibility = false">取 消</el-button>
          <el-button type="primary" @click="onDelete(formData)"> 确 定 </el-button>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue"
import { useTableHook } from "./album"
import { useRouter } from "vue-router"

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

// 路由
const router = useRouter()

const dialogTitle = computed(() => {
  if (formData.value.id == 0) {
    return "添加友链"
  } else {
    return "编辑友链"
  }
})

const checkPhoto = (item) => {
  router.push({ path: "/albums/" + item.id })
}

onMounted(() => {
  onSearchList()
})
</script>

<style scoped>
.album-cover {
  position: relative;
  border-radius: 4px;
  width: 100%;
  height: 170px;
}
.album-cover::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
}
.album-photo-count {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.5rem;
  z-index: 1000;
  position: absolute;
  left: 0;
  right: 0;
  padding: 0 0.5rem;
  bottom: 2.6rem;
  color: #fff;
}
.album-name {
  text-align: center;
  margin-top: 0.5rem;
}
.album-item {
  position: relative;
  cursor: pointer;
  margin-bottom: 1rem;
}
.album-opreation {
  position: absolute;
  z-index: 1000;
  top: 0.5rem;
  right: 0.8rem;
}
</style>
