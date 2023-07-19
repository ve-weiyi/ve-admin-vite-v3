<template>
  <div class="app-container">
    <el-card class="main-card">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 修改信息 -->
        <el-tab-pane label="修改信息" name="info">
          <div class="info-container">
            <el-upload
              class="avatar-uploader"
              action="/api/v1/user/avatar"
              :http-request="uploadAvatar"
              :show-file-list="false"
              :on-success="updateAvatar"
            >
              <img v-if="avatar" :src="avatar" class="avatar" alt="avatar" />
              <i v-else class="plus avatar-uploader-icon" />
            </el-upload>
            <el-form label-width="70px" :model="infoForm" style="width: 320px; margin-left: 3rem">
              <el-form-item label="昵称">
                <el-input v-model="infoForm.nickname" size="default" />
              </el-form-item>
              <el-form-item label="个人简介">
                <el-input v-model="infoForm.intro" size="default" />
              </el-form-item>
              <el-form-item label="个人网站">
                <el-input v-model="infoForm.webSite" size="default" />
              </el-form-item>
              <el-button @click="updateInfo" type="primary" size="default" style="margin-left: 4.375rem">
                修改
              </el-button>
            </el-form>
          </div>
        </el-tab-pane>
        <!-- 修改密码 -->
        <el-tab-pane label="修改密码" name="password">
          <el-form label-width="70px" :model="passwordForm" style="width: 320px">
            <el-form-item label="旧密码">
              <el-input @keyup.enter="updatePassword" v-model="passwordForm.oldPassword" size="small" show-password />
            </el-form-item>
            <el-form-item label="新密码">
              <el-input @keyup.enter="updatePassword" v-model="passwordForm.newPassword" size="small" show-password />
            </el-form-item>
            <el-form-item label="确认密码">
              <el-input
                @keyup.enter="updatePassword"
                v-model="passwordForm.confirmPassword"
                size="small"
                show-password
              />
            </el-form-item>
            <el-button type="primary" size="default" style="margin-left: 4.4rem" @click="updatePassword">
              修改
            </el-button>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { ElTabs, ElTabPane, ElUpload, ElForm, ElFormItem, ElInput, ElButton, UploadRequestOptions } from "element-plus"
import { ElMessage } from "element-plus"
import axios from "axios"
import { useAdminStore } from "@/store/modules/admin"
import { updateUserAvatarApi } from "@/api/user"

// 获取缓存信息
const store = useAdminStore()

const activeName = ref("info")
const infoForm = ref({
  nickname: "",
  intro: "",
  webSite: "",
})
const passwordForm = ref({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
})
const avatar = ref("")
const notice = ref("")

const handleClick = (tab) => {
  if (tab.index === 2 && notice.value === "") {
    axios.get("/api/admin/notice").then(({ data }) => {
      notice.value = data.data
    })
  }
}

const uploadAvatar = (options: UploadRequestOptions) => {
  return updateUserAvatarApi(options.file)
}

const updateAvatar = (response) => {
  if (response.code === 200) {
    ElMessage.success(response.message)
    store.updateAvatar(response.data.avatar)
  } else {
    ElMessage.error(response.message)
  }
}

const updateInfo = () => {
  if (infoForm.value.nickname.trim() === "") {
    ElMessage.error("昵称不能为空")
    return false
  }
  updateUserAvatarApi()
  axios.put("/api/users/info", infoForm.value).then(({ data }) => {
    if (data.flag) {
      ElMessage.success(data.message)
      store.updateUserInfo(infoForm.value)
    } else {
      ElMessage.error(data.message)
    }
  })
}

const updatePassword = () => {
  if (passwordForm.value.oldPassword.trim() === "") {
    ElMessage.error("旧密码不能为空")
    return false
  }
  if (passwordForm.value.newPassword.trim() === "") {
    ElMessage.error("新密码不能为空")
    return false
  }
  if (passwordForm.value.newPassword.length < 6) {
    ElMessage.error("新密码不能少于6位")
    return false
  }
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    ElMessage.error("两次密码输入不一致")
    return false
  }
  axios.put("/api/admin/users/password", passwordForm.value).then(({ data }) => {
    if (data.flag) {
      passwordForm.value.oldPassword = ""
      passwordForm.value.newPassword = ""
      passwordForm.value.confirmPassword = ""
      ElMessage.success(data.message)
    } else {
      ElMessage.error(data.message)
    }
  })
}

onMounted(() => {
  console.log("mounted", store)
  avatar.value = store.avatar

  infoForm.value.nickname = store.nickname
  infoForm.value.intro = store.intro
  infoForm.value.webSite = store.webSite
})
</script>

<style scoped>
.info-container {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  margin-top: 1rem;
}

.avatar-uploader {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  width: 100px;
  height: 100px;
  margin-right: 1rem;
}

.avatar {
  width: 100%;
  height: 100%;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  cursor: pointer;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
}
</style>
