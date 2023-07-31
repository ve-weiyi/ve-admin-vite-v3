<template>
  <div class="app-container">
    <el-card class="main-card">
      <div class="table-title">{{ $route.meta.title }}</div>
      <!--    <mavon-editor-->
      <!--      ref="mdRef"-->
      <!--      @imgAdd="uploadImg"-->
      <!--      v-model="aboutContent"-->
      <!--      style="height: calc(100vh - 250px); margin-top: 2.25rem"-->
      <!--    />-->
      <MdEditor
        style="height: calc(100vh - 250px); margin-top: 2.25rem"
        ref="mdRef"
        v-model="aboutContent"
        placeholder="快编辑你的个人信息吧~"
        :auto-detect-code="true"
        @onUploadImg="onUploadImg"
      >
      </MdEditor>
      <el-button type="danger" size="default" class="edit-btn" @click="updateAbout"> 修改 </el-button>
    </el-card>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue"
import * as imageConversion from "image-conversion"
import axios from "axios"
import { ElNotification } from "element-plus"
import { MdEditor, MdPreview, MdCatalog } from "md-editor-v3"
import "md-editor-v3/lib/style.css"
import { uploadFileApi } from "@/api/file"
import { updateAboutApi } from "@/api/admin"
import { getAboutApi } from "@/api/blog"

const mdRef = ref(null)
const aboutContent = ref("")

const getAbout = () => {
  getAboutApi().then((res) => {
    aboutContent.value = res.data
  })
}

const onUploadImg = async (files, callback) => {
  const res = await Promise.all(
    files.map((file) => {
      return new Promise((rev, rej) => {
        uploadFileApi("about", file)
          .then((res) => rev(res))
          .catch((error) => rej(error))
      })
    })
  )

  callback(res.map((item) => item.data.fileUrl))

  // const formdata = new FormData()
  // if (file.size / 1024 < 200) {
  //   formdata.append("file", file)
  //   axios.post("/api/admin/articles/images", formdata).then(({ data }) => {
  //     mdRef.value.img2Url(pos, data.data)
  //   })
  // } else {
  //   imageConversion.compressAccurately(file, 200).then((res) => {
  //     formdata.append("file", new window.File([res], file.name, { type: file.type }))
  //     axios.post("/api/admin/articles/images", formdata).then(({ data }) => {
  //       mdRef.value.img2Url(pos, data.data)
  //     })
  //   })
  // }
}

const updateAbout = () => {
  updateAboutApi(aboutContent.value).then((res) => {
    ElNotification.success({
      title: "成功",
      message: res.message,
    })
  })
}

onMounted(() => {
  getAbout()
})
</script>

<style scoped>
.edit-btn {
  float: right;
  margin: 1rem 0;
}
</style>
