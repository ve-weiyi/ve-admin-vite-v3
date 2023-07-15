<template>
  <div class="app-container">
    <el-card class="main-card">
      <div class="table-title">{{ $route.meta.title }}</div>
      <div class="talk-container">
        <!-- 输入框 -->
        <Editor ref="editorRef" class="editor-wrapper" v-model="talk.content" placeholder="说点什么吧" />
        <!-- 操作菜单 -->
        <div class="operation-wrapper">
          <div class="left-wrapper">
            <!-- 表情 -->
            <el-popover placement="bottom-start" width="460" trigger="click">
              <span
                class="emoji-item"
                v-for="(item, key, index) of emojiList"
                :key="index"
                @click="addEmoji(key, item.normal)"
              >
                <img :src="item.normal" :title="item.key" class="emoji" width="24" height="24" />
              </span>
              <template #reference>
                <i class="iconfont icon-smile operation-btn" />
              </template>
            </el-popover>
            <!-- 图片上传 -->
            <el-upload
              action="/api/admin/talks/images"
              multiple
              :before-upload="beforeUpload"
              :on-success="upload"
              :show-file-list="false"
            >
              <i class="iconfont icon-picture operation-btn" />
            </el-upload>
          </div>
          <div class="right-wrapper">
            <!-- 是否置顶 -->
            <el-switch
              style="margin-right: 16px"
              v-model="talk.isTop"
              inactive-text="置顶"
              :active-value="1"
              :inactive-value="0"
            />
            <!-- 说说状态 -->
            <el-dropdown trigger="click" @command="handleCommand" style="margin-right: 16px">
              <span class="talk-status"> {{ dropdownTitle }}<i class="el-icon-arrow-down el-icon--right" /> </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-for="(item, index) of statusList" :key="index" :command="item.status">
                    {{ item.desc }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-button type="primary" size="small" @click="saveOrUpdateTalk" :disabled="talk.content === ''">
              发布
            </el-button>
          </div>
        </div>
        <!-- 图片上传 -->
        <el-upload
          class="talk-image-upload"
          v-show="uploadList.length > 0"
          action="/api/admin/talks/images"
          list-type="picture-card"
          :file-list="uploadList"
          multiple
          :before-upload="beforeUpload"
          :on-success="upload"
          :on-remove="handleRemove"
        >
          <i class="el-icon-plus" />
        </el-upload>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue"
import * as imageConversion from "image-conversion"
import EmojiList from "@/assets/emojis/qq_emoji.json"
import Editor from "@/components/Editor.vue"
import { useRoute } from "vue-router"
import { findTalkApi } from "@/api/talk"

const route = useRoute()
const emojiList = ref(EmojiList)
const talk = ref({
  id: null,
  content: "",
  isTop: 0,
  status: 1,
  images: null,
})
const statusList = ref([
  { status: 1, desc: "公开" },
  { status: 2, desc: "私密" },
])
const uploadList = ref([])

onMounted(() => {
  if (route.params.talkId) {
    findTalkApi({ id: route.params.talkId }).then((res) => {
      talk.value = res.data
      if (res.data.imgList) {
        res.data.imgList.forEach((item) => {
          uploadList.value.push({ url: item })
        })
      }
    })
  }
})

function handleCommand(command) {
  talk.value.status = command
}

const editorRef = ref(null)

function addEmoji(key, value) {
  const emojiTag = `<img src="${value}" width="24" height="24" alt="${key}" style="margin: 0 1px;vertical-align: text-bottom"/>`
  editorRef.value.addText(emojiTag)
}

function handleRemove(file) {
  const index = uploadList.value.findIndex((item) => item.url === file.url)
  if (index !== -1) {
    uploadList.value.splice(index, 1)
  }
}

function upload(response) {
  uploadList.value.push({ url: response.data })
}

function beforeUpload(file) {
  return new Promise((resolve) => {
    if (file.size / 1024 < this.config.UPLOAD_SIZE) {
      resolve(file)
    } else {
      // 压缩到200KB，这里的200就是要压缩的大小，可自定义
      imageConversion.compressAccurately(file, this.config.UPLOAD_SIZE).then((res) => {
        resolve(res)
      })
    }
  })
}

function saveOrUpdateTalk() {
  if (talk.value.content.trim() === "") {
    this.$message.error("说说内容不能为空")
    return false
  }

  // 转换图片
  if (uploadList.value.length > 0) {
    const imgList = uploadList.value.map((item) => item.url)
    talk.value.images = JSON.stringify(imgList)
  }

  this.axios.post("/api/admin/talks", talk.value).then(({ data }) => {
    if (data.flag) {
      this.$refs.editor.clear()
      uploadList.value = []
      this.$notify.success({
        title: "成功",
        message: data.message,
      })
    } else {
      this.$notify.error({
        title: "失败",
        message: data.message,
      })
    }
  })
}

const dropdownTitle = computed(() => {
  const currentStatus = talk.value.status
  const status = statusList.value.find((item) => item.status === currentStatus)
  return status ? status.desc : ""
})
</script>

<style scoped>
.talk-container {
  margin-top: 40px;
}
.editor-wrapper {
  min-height: 150px;
}
.operation-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}
.operation-btn {
  cursor: pointer;
  color: #838383;
  font-size: 20px;
  margin-right: 12px;
}
.talk-status {
  cursor: pointer;
  font-size: 12px;
  color: #999;
}
.emoji {
  user-select: none;
  margin: 0.25rem;
  display: inline-block;
  vertical-align: middle;
}
.emoji-item {
  cursor: pointer;
  display: inline-block;
}
.emoji-item:hover {
  transition: all 0.2s;
  border-radius: 0.25rem;
  background: #dddddd;
}
.left-wrapper {
  display: flex;
  width: 50%;
}
.talk-image-upload {
  margin-top: 8px;
}
</style>
