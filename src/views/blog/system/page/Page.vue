<template>
  <el-card class="main-card">
    <div class="table-title">{{ $route.meta.title }}</div>
    <div class="operation-container">
      <el-button type="primary" size="default" icon="plus" @click="openModel(null)"> 新建页面 </el-button>
    </div>
    <el-row class="page-container" :gutter="12" v-loading="loading">
      <el-empty v-if="pageList.length == 0" description="暂无页面" />
      <el-col v-for="item of pageList" :key="item.id" :md="6">
        <div class="page-item">
          <div class="page-opreation">
            <el-dropdown @command="handleCommand">
              <i class="el-icon-more" style="color: #fff" />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item :command="'update' + JSON.stringify(item)">
                    <i class="el-icon-edit" />编辑
                  </el-dropdown-item>
                  <el-dropdown-item :command="'delete' + item.id"> <i class="el-icon-delete" />删除 </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <el-image fit="cover" class="page-cover" :src="item.pageCover" />
          <div class="page-name">{{ item.pageName }}</div>
        </div>
      </el-col>
    </el-row>
    <el-dialog v-model="addOrEdit" width="35%" top="10vh">
      <template #header>
        <div class="dialog-title-container">{{ pageTitle }}}</div>
      </template>
      <el-form label-width="80px" size="default" :model="pageForum">
        <el-form-item label="页面名称">
          <el-input style="width: 220px" v-model="pageForum.pageName" />
        </el-form-item>
        <el-form-item label="页面标签">
          <el-input style="width: 220px" v-model="pageForum.pageLabel" />
        </el-form-item>
        <el-form-item label="页面封面">
          <el-upload
            class="upload-cover"
            drag
            :show-file-list="false"
            action="/api/admin/config/images"
            multiple
            :before-upload="beforeUpload"
            :on-success="uploadCover"
          >
            <i class="el-icon-upload" v-if="pageForum.pageCover == ''" />
            <div class="el-upload__text" v-if="pageForum.pageCover == ''">将文件拖到此处，或<em>点击上传</em></div>
            <img v-else :src="pageForum.pageCover" width="360px" height="180px" />
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addOrEdit = false">取 消</el-button>
        <el-button type="primary" @click="addOrEditPage"> 确 定 </el-button>
      </template>
    </el-dialog>
    <el-dialog v-model="isdeletePage" width="30%">
      <template #header>
        <div class="dialog-title-container">
          <el-icon style="color: #ff9900">
            <WarningFilled />
          </el-icon>
          提示
        </div>
      </template>
      <div style="font-size: 1rem">是否删除该页面？</div>
      <template #footer>
        <el-button @click="isdeletePage = false">取 消</el-button>
        <el-button type="primary" @click="deletePage"> 确 定 </el-button>
      </template>
    </el-dialog>
  </el-card>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from "vue"
import * as imageConversion from "image-conversion"
import axios from "axios"
import { ElMessage, ElNotification } from "element-plus"

const keywords = ref("")
const loading = ref(true)
const current = ref(1)
const size = ref(8)
const count = ref(0)
const isdeletePage = ref(false)
const addOrEdit = ref(false)
const pageForum = reactive({
  id: null,
  pageName: "",
  pageLabel: "",
  pageCover: "",
})
const pageList = ref([])
const pageTitle = ref()

const openModel = (item) => {
  if (item) {
    console.log(item)
    Object.assign(pageForum, JSON.parse(item))
    pageTitle.value.innerHTML = "修改页面"
  } else {
    Object.assign(pageForum, {
      id: null,
      pageName: "",
      pageLabel: "",
      pageCover: "",
    })
    pageTitle.value.innerHTML = "新建页面"
  }
  addOrEdit.value = true
}

const listPages = () => {
  axios.get("/api/admin/pages").then(({ data }) => {
    pageList.value = data.data
    loading.value = false
  })
}

const addOrEditPage = () => {
  if (pageForum.pageName.trim() == "") {
    ElMessage.error("页面名称不能为空")
    return false
  }
  if (pageForum.pageLabel.trim() == "") {
    ElMessage.error("页面标签不能为空")
    return false
  }
  if (pageForum.pageCover == null) {
    ElMessage.error("页面封面不能为空")
    return false
  }
  axios.post("/api/admin/pages", pageForum).then(({ data }) => {
    if (data.flag) {
      ElNotification.success({
        title: "成功",
        message: data.message,
      })
      listPages()
    } else {
      ElNotification.error({
        title: "失败",
        message: data.message,
      })
    }
  })
  addOrEdit.value = false
}

const uploadCover = (response) => {
  pageForum.pageCover = response.data
}

const beforeUpload = (file) => {
  return new Promise((resolve) => {
    if (file.size / 1024 < 200) {
      resolve(file)
    }
    // 压缩到200KB,这里的200就是要压缩的大小,可自定义
    imageConversion.compressAccurately(file, 200).then((res) => {
      resolve(res)
    })
  })
}

const handleCommand = (command) => {
  const type = command.substring(0, 6)
  const data = command.substring(6)
  if (type == "delete") {
    pageForum.id = data
    isdeletePage.value = true
  } else {
    console.log(data)
    openModel(data)
  }
}

const deletePage = () => {
  axios.delete("/api/admin/pages/" + pageForum.id).then(({ data }) => {
    if (data.flag) {
      ElNotification.success({
        title: "成功",
        message: data.message,
      })
      listPages()
    } else {
      ElNotification.error({
        title: "失败",
        message: data.message,
      })
    }
    isdeletePage.value = false
  })
}

onMounted(() => {
  listPages()
})
</script>

<style scoped>
.page-cover {
  position: relative;
  border-radius: 4px;
  width: 100%;
  height: 170px;
}
.page-name {
  text-align: center;
  margin-top: 0.5rem;
}
.page-item {
  position: relative;
  cursor: pointer;
  margin-bottom: 1rem;
}
.page-opreation {
  position: absolute;
  z-index: 1000;
  top: 0.5rem;
  right: 0.8rem;
}
</style>
