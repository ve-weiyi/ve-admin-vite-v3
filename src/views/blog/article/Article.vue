<template>
  <div class="app-container">
    <el-card class="main-card">
      <div class="table-title">{{ $route.meta.title }}</div>
      <!-- 文章标题 -->
      <div class="article-title-container">
        <el-input v-model="article.articleTitle" size="default" placeholder="输入文章标题" />
        <el-button
          type="danger"
          size="default"
          class="save-btn"
          @click="saveArticleDraft"
          v-if="article.id == null || article.status == 3"
        >
          保存草稿
        </el-button>
        <el-button type="danger" size="default" @click="openModel" style="margin-left: 10px"> 发布文章 </el-button>
      </div>
      <!-- 文章内容 -->
      <!--      <mavon-editor-->
      <!--        ref="mdRef"-->
      <!--        v-model="article.articleContent"-->
      <!--        @imgAdd="uploadImg"-->
      <!--        style="height: calc(100vh - 260px)"-->
      <!--      />-->
      <MdEditor
        style="height: calc(100vh - 260px)"
        ref="mdRef"
        v-model="article.articleContent"
        placeholder="快编辑一篇文章吧~"
        :auto-detect-code="true"
        @onUploadImg="uploadImg"
      >
      </MdEditor>
      <!-- 添加文章对话框 -->
      <el-dialog v-model="addOrEdit" width="40%" top="3vh">
        <template #header>
          <div class="dialog-title-container">发布文章</div>
        </template>
        <!-- 文章数据 -->
        <el-form label-width="80px" size="default" :model="article">
          <!-- 文章分类 -->
          <el-form-item label="文章分类">
            <el-tag
              type="success"
              v-show="article.categoryName"
              style="margin: 0 1rem 0 0"
              :closable="true"
              @close="removeCategory"
            >
              {{ article.categoryName }}
            </el-tag>
            <!-- 分类选项 -->
            <el-popover placement="bottom-start" width="460" trigger="click" v-if="!article.categoryName">
              <div class="popover-title">分类</div>
              <!-- 搜索框 -->
              <el-autocomplete
                style="width: 100%"
                v-model="categoryName"
                :fetch-suggestions="searchCategories"
                placeholder="请输入分类名搜索，enter可添加自定义分类"
                :trigger-on-focus="false"
                @keyup.enter="saveCategory"
                @select="handleSelectCategories"
              >
                <template #default="{ item }">
                  <div>{{ item.categoryName }}</div>
                </template>
              </el-autocomplete>
              <!-- 分类 -->
              <div class="popover-container">
                <div v-for="item of categoryList" :key="item.id" class="category-item" @click="addCategory(item)">
                  {{ item.categoryName }}
                </div>
              </div>
              <template #reference>
                <el-button type="success" plain size="small"> 添加分类 </el-button>
              </template>
            </el-popover>
          </el-form-item>
          <!-- 文章标签 -->
          <el-form-item label="文章标签">
            <el-tag
              v-for="(item, index) of article.tagNameList"
              :key="index"
              style="margin: 0 1rem 0 0"
              :closable="true"
              @close="removeTag(item)"
            >
              {{ item }}
            </el-tag>
            <!-- 标签选项 -->
            <el-popover placement="bottom-start" width="460" trigger="click" v-if="article.tagNameList.length < 3">
              <div class="popover-title">标签</div>
              <!-- 搜索框 -->
              <el-autocomplete
                style="width: 100%"
                v-model="tagName"
                :fetch-suggestions="searchTags"
                placeholder="请输入标签名搜索，enter可添加自定义标签"
                :trigger-on-focus="false"
                @keyup.enter="saveTag"
                @select="handleSelectTag"
              >
                <template #default="{ item }">
                  <div>{{ item.tagName }}</div>
                </template>
              </el-autocomplete>
              <!-- 标签 -->
              <div class="popover-container">
                <div style="margin-bottom: 1rem">添加标签</div>
                <el-tag v-for="(item, index) of tagList" :key="index" :class="tagClass(item)" @click="addTag(item)">
                  {{ item.tagName }}
                </el-tag>
              </div>
              <template #reference>
                <el-button type="primary" plain size="small"> 添加标签 </el-button>
              </template>
            </el-popover>
          </el-form-item>
          <el-form-item label="文章类型">
            <el-select v-model="article.type" placeholder="请选择类型">
              <el-option v-for="item in typeList" :key="item.type" :label="item.label" :value="item.type" />
            </el-select>
          </el-form-item>
          <!-- 文章类型 -->
          <el-form-item label="原文地址" v-if="article.type != 1">
            <el-input v-model="article.originalUrl" placeholder="请填写原文链接" />
          </el-form-item>
          <el-form-item label="上传封面">
            <el-upload
              class="upload-cover"
              drag
              action="/api/admin/articles/images"
              multiple
              :before-upload="beforeUpload"
              :on-success="uploadCover"
            >
              <i class="el-icon-upload" v-if="article.articleCover == ''" />
              <div class="el-upload__text" v-if="article.articleCover == ''">将文件拖到此处，或<em>点击上传</em></div>
              <img v-else :src="article.articleCover" width="360px" height="180px" />
            </el-upload>
          </el-form-item>
          <el-form-item label="置顶">
            <el-switch
              v-model="article.isTop"
              active-color="#13ce66"
              inactive-color="#F4F4F5"
              :active-value="1"
              :inactive-value="0"
            />
          </el-form-item>
          <el-form-item label="发布形式">
            <el-radio-group v-model="article.status">
              <el-radio :label="1">公开</el-radio>
              <el-radio :label="2">私密</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="addOrEdit = false">取 消</el-button>
          <el-button type="danger" @click="saveOrUpdateArticle"> 发 表 </el-button>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from "vue"
import { useRoute, useRouter } from "vue-router"
import imageConversion from "image-conversion"
import { MdEditor, MdPreview, MdCatalog } from "md-editor-v3"
import "md-editor-v3/lib/style.css"
import { findCategoryListApi } from "@/api/category"
import { findTagListApi } from "@/api/tag"
import { createArticleApi, findArticleApi } from "@/api/article"
import { uploadFileApi } from "@/api/file"

const route = useRoute()
const router = useRouter()
const article = ref({
  id: null,
  articleTitle: new Date().toISOString().split("T")[0],
  articleContent: "",
  articleCover: "",
  categoryName: null,
  tagNameList: [],
  originalUrl: "",
  isTop: 0,
  type: 1,
  status: 1,
})

const mdRef = ref(null)

const addOrEdit = ref(false)
const autoSave = ref(true)
const categoryName = ref("")
const tagName = ref("")
const categoryList = ref([])
const tagList = ref([])
const typeList = ref([
  {
    type: 1,
    label: "原创",
  },
  {
    type: 2,
    label: "转载",
  },
  {
    type: 3,
    label: "翻译",
  },
])

function listCategories() {
  findCategoryListApi({}).then((res) => {
    categoryList.value = res.data.list
  })
}

function listTags() {
  findTagListApi({}).then((res) => {
    tagList.value = res.data.list
  })
}

function openModel() {
  if (article.value.articleTitle.trim() === "") {
    alert("文章标题不能为空")
    return
  }
  if (article.value.articleContent.trim() === "") {
    alert("文章内容不能为空")
    return
  }
  listCategories()
  listTags()
  addOrEdit.value = true
}

function uploadCover(response) {
  article.value.articleCover = response.data
}

function beforeUpload(file) {
  return new Promise((resolve) => {
    if (file.size / 1024 < 200) {
      resolve(file)
    }
    imageConversion.compressAccurately(file, 200).then((res) => {
      resolve(res)
    })
  })
}

function uploadImg(pos, file) {
  if (file.size / 1024 < 200) {
    uploadFileApi("article", file).then((res) => {
      mdRef.value.$img2Url(pos, res.data.fileUrl)
    })
  } else {
    imageConversion.compressAccurately(file, 200).then((res) => {
      uploadFileApi("article", file).then((res) => {
        mdRef.value.$img2Url(pos, res.data.fileUrl)
      })
    })
  }
}

function saveArticleDraft() {
  if (article.value.articleTitle.trim() === "") {
    alert("文章标题不能为空")
    return
  }
  if (article.value.articleContent.trim() === "") {
    alert("文章内容不能为空")
    return
  }
  article.value.status = 3
  createArticleApi(article.value).then((res) => {
    if (res.data.code == 200) {
      if (article.value.id === null) {
        // store.commit("removeTab", "发布文章")
      } else {
        // store.commit("removeTab", "修改文章")
      }
      sessionStorage.removeItem("article")
      router.push({ path: "/article-list" })
      alert("保存草稿成功")
    } else {
      alert("保存草稿失败")
    }
  })

  autoSave.value = false
}

function saveOrUpdateArticle() {
  if (article.value.articleTitle.trim() === "") {
    alert("文章标题不能为空")
    return
  }
  if (article.value.articleContent.trim() === "") {
    alert("文章内容不能为空")
    return
  }
  if (article.value.categoryName === null) {
    alert("文章分类不能为空")
    return
  }
  if (article.value.tagNameList.length === 0) {
    alert("文章标签不能为空")
    return
  }
  if (article.value.articleCover.trim() === "") {
    alert("文章封面不能为空")
    return
  }
  createArticleApi(article.value).then((res) => {
    if (res.data.code === 200) {
      if (article.value.id === null) {
        // store.commit("removeTab", "发布文章")
      } else {
        // store.commit("removeTab", "修改文章")
      }
      sessionStorage.removeItem("article")
      router.push({ path: "/article-list" })
      alert("发布文章成功")
    } else {
      alert("发布文章失败")
    }
    addOrEdit.value = false
  })

  autoSave.value = false
}

function autoSaveArticle() {
  if (
    autoSave.value &&
    article.value.articleTitle.trim() !== "" &&
    article.value.articleContent.trim() !== "" &&
    article.value.id !== null
  ) {
    createArticleApi(article.value).then((res) => {
      if (res.data.code === 200) {
        alert("自动保存成功")
      } else {
        alert("自动保存失败")
      }
    })
  }
  if (autoSave.value && article.value.id === null) {
    sessionStorage.setItem("article", JSON.stringify(article.value))
  }
}

function searchCategories(keywords, cb) {
  findCategoryListApi({
    conditions: [
      {
        field: "category_name",
        value: keywords,
        rule: "like",
      },
    ],
  }).then((res) => {
    cb(res.data.list)
  })
}

function handleSelectCategories(item) {
  addCategory({ categoryName: item.categoryName })
}

function saveCategory() {
  if (categoryName.value.trim() !== "") {
    addCategory({ categoryName: categoryName.value })
    categoryName.value = ""
  }
}

function addCategory(item) {
  article.value.categoryName = item.categoryName
}

function removeCategory() {
  article.value.categoryName = null
}

function searchTags(keywords, cb) {
  findTagListApi({
    conditions: [
      {
        field: "tag_name",
        value: keywords,
        rule: "like",
      },
    ],
  }).then((res) => {
    cb(res.data.list)
  })
}

function handleSelectTag(item) {
  addTag({ tagName: item.tagName })
}

function saveTag() {
  if (tagName.value.trim() !== "") {
    addTag({ tagName: tagName.value })
    tagName.value = ""
  }
}

function addTag(item) {
  if (!article.value.tagNameList.includes(item.tagName)) {
    article.value.tagNameList.push(item.tagName)
  }
}

function removeTag(item) {
  const index = article.value.tagNameList.indexOf(item)
  if (index !== -1) {
    article.value.tagNameList.splice(index, 1)
  }
}

listCategories()
listTags()

onBeforeUnmount(() => {
  autoSaveArticle()
})

const getArticle = (articleId: number) => {
  findArticleApi({ id: articleId }).then((res) => {
    article.value = res.data.data
  })
}

const articleId = route.params.articleId ? parseInt(route.params.articleId as string) : 0  // 获取路由参数

if (articleId) {
  getArticle(Number(articleId))
} else {
  const articleData = sessionStorage.getItem("article")
  if (articleData) {
    article.value = JSON.parse(articleData)
  }
}

const tagClass = (item) => {
  const index = article.value.tagNameList.indexOf(item.tagName)
  return index !== -1 ? "tag-item-select" : "tag-item"
}
</script>

<style scoped>
.article-title-container {
  display: flex;
  align-items: center;
  margin-bottom: 1.25rem;
  margin-top: 2.25rem;
}
.save-btn {
  margin-left: 0.75rem;
  background: #fff;
  color: #f56c6c;
}
.tag-item {
  margin-right: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
}
.tag-item-select {
  margin-right: 1rem;
  margin-bottom: 1rem;
  cursor: not-allowed;
  color: #ccccd8 !important;
}
.category-item {
  cursor: pointer;
  padding: 0.6rem 0.5rem;
}
.category-item:hover {
  background-color: #f0f9eb;
  color: #67c23a;
}
.popover-title {
  margin-bottom: 1rem;
  text-align: center;
}
.popover-container {
  margin-top: 1rem;
  height: 260px;
  overflow-y: auto;
}
</style>
