<template>
  <div class="app-container">
    <el-card class="main-card">
      <div class="table-title">{{ $route.meta.title }}</div>
      <!-- 文章状态 -->
      <div class="status-menu">
        <span>状态</span>
        <span @click="changeStatus(null)" :class="isActive(null)">全部</span>
        <span @click="changeStatus(1)" :class="isActive(1)"> 公开 </span>
        <span @click="changeStatus(2)" :class="isActive(2)"> 私密 </span>
      </div>
      <el-empty v-if="tableData == null" description="暂无说说" />
      <!-- 说说列表 -->
      <div class="talk-item" v-for="item of tableData" :key="item.id">
        <!-- 用户信息 -->
        <div class="user-info-wrapper">
          <el-avatar class="user-avatar" :src="item.avatar" :size="36" />
          <div class="user-detail-wrapper">
            <div class="user-nickname">
              <div>{{ item.nickname || "与梦" }}</div>
              <!-- 操作 -->
              <el-dropdown trigger="click" @command="handleCommand">
                <el-icon style="color: #333; cursor: pointer"><MoreFilled /></el-icon>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item :command="'1,' + item.id">
                      <el-icon><Edit /></el-icon>编辑
                    </el-dropdown-item>
                    <el-dropdown-item :command="'2,' + item.id">
                      <el-icon><Delete /></el-icon>删除
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
            <!-- 发表时间 -->
            <div class="time">
              {{ item.created_at }}
              <span class="top" v-if="item.isTop === 1"> <i class="iconfont icon-upload-fill" /> 置顶 </span>
              <span class="secret" v-if="item.status === 2"> <i class="iconfont icon-password-fill" /> 私密 </span>
            </div>
            <!-- 说说信息 -->
            <div class="talk-content" v-html="item.content" />
            <!-- 图片列表 -->
            <el-row :gutter="4" class="talk-images" v-if="item.imgList">
              <el-col :md="8" :cols="6" v-for="(img, index) of item.imgList" :key="index">
                <el-image class="images-items" :src="img" :preview-src-list="previewList" />
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <!-- 分页 -->
      <el-pagination
        :hide-on-single-page="false"
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
      <!-- 删除对话框 -->
      <el-dialog v-model="isdelete" width="30%">
        <template #header>
          <div class="dialog-title-container">
            <el-icon style="color: #ff9900">
              <WarningFilled />
            </el-icon>
            提示
          </div>
        </template>
        <div style="font-size: 1rem">是否删除该说说？</div>
        <template #footer>
          <el-button @click="isdelete = false">取 消</el-button>
          <el-button type="primary" @click="onDelete"> 确 定 </el-button>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import { useTableHook } from "./talk_list"

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

const status = ref(1)
const isdelete = ref(false)
const previewList = ref([])
const talkId = ref(null)

onMounted(() => {
  onSearchList()
})

function handleCommand(command) {
  const arr = command.split(",")
  talkId.value = arr[1]
  switch (arr[0]) {
    case "1":
      this.$router.push({ path: "/talks/" + talkId.value })
      break
    case "2":
      isdelete.value = true
      break
  }
}

function changeStatus(status) {
  searchData.status = status
  onSearchList()
}

const isActive = computed(() => {
  return function (status) {
    return status === searchData.status ? "active-status" : "status"
  }
})
</script>

<style scoped>
.status-menu {
  font-size: 14px;
  margin-top: 20px;
  color: #999;
}

.status-menu span {
  margin-right: 24px;
}

.status {
  cursor: pointer;
}

.active-status {
  cursor: pointer;
  color: #333;
  font-weight: bold;
}

.talk-item:not(:first-child) {
  margin-top: 20px;
}

.talk-item {
  padding: 16px 20px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 3px 8px 6px rgb(7 17 27 / 6%);
  transition: all 0.3s ease 0s;
}

.talk-item:hover {
  box-shadow: 0 5px 10px 8px rgb(7 17 27 / 16%);
  transform: translateY(-3px);
}

.user-info-wrapper {
  width: 100%;
  display: flex;
}

.user-avatar {
  border-radius: 50%;
}

.user-avatar {
  transition: all 0.5s;
}

.user-avatar:hover {
  transform: rotate(360deg);
}

.user-detail-wrapper {
  margin-left: 10px;
  width: 100%;
}

.user-nickname {
  font-size: 15px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
}

.user-sign {
  margin-left: 4px;
}

.time {
  color: #999;
  margin-top: 2px;
  font-size: 12px;
}

.top {
  color: #ff7242;
  margin-left: 10px;
}

.secret {
  color: #999;
  margin-left: 10px;
}

.talk-content {
  margin-top: 8px;
  font-size: 14px;
  white-space: pre-line;
  word-wrap: break-word;
  word-break: break-all;
}

.talk-images {
  margin-top: 8px;
}

.images-items {
  cursor: pointer;
  object-fit: cover;
  height: 200px;
  width: 100%;
  border-radius: 4px;
}
</style>
