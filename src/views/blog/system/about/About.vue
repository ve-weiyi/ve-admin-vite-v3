<template>
  <el-card class="main-card">
    <div class="table-title">{{ $route.name }}</div>
    <mavon-editor
      ref="mdRef"
      @imgAdd="uploadImg"
      v-model="aboutContent"
      style="height: calc(100vh - 250px); margin-top: 2.25rem"
    />
    <el-button type="danger" size="default" class="edit-btn" @click="updateAbout"> 修改 </el-button>
  </el-card>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue"
import * as imageConversion from "image-conversion"
import axios from "axios";
import { ElNotification } from "element-plus";

const mdRef = ref(null)
const aboutContent = ref("")

const getAbout = () => {
  axios.get("/api/about").then(({ data }) => {
    aboutContent.value = data.data
  })
}

const uploadImg = (pos, file) => {
  const formdata = new FormData()
  if (file.size / 1024 < 200) {
    formdata.append("file", file)
    axios.post("/api/admin/articles/images", formdata).then(({ data }) => {
      mdRef.value.img2Url(pos, data.data)
    })
  } else {
    imageConversion.compressAccurately(file, 200).then((res) => {
      formdata.append("file", new window.File([res], file.name, { type: file.type }))
      axios.post("/api/admin/articles/images", formdata).then(({ data }) => {
        mdRef.value.img2Url(pos, data.data)
      })
    })
  }
}

const updateAbout = () => {
  axios
    .put("/api/admin/about", {
      aboutContent: aboutContent.value
    })
    .then(({ data }) => {
      if (data.flag) {
        ElNotification.success({
          title: "成功",
          message: data.message
        })
      } else {
        ElNotification.error({
          title: "失败",
          message: data.message
        })
      }
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
