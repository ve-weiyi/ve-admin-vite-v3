<template>
  <div class="app-container">
    <!-- 统计数据 -->
    <el-row :gutter="30">
      <el-col :span="6">
        <el-card>
          <div class="card-icon-container">
            <i class="iconfont icon-user-fill" style="color: #40c9c6" />
          </div>
          <div class="card-desc">
            <div class="card-title">访问量</div>
            <div class="card-count">{{ viewsCount }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="card-icon-container">
            <i class="iconfont icon-user-fill" style="color: #34bfa3" />
          </div>
          <div class="card-desc">
            <div class="card-title">用户量</div>
            <div class="card-count">{{ userCount }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="card-icon-container">
            <i class="iconfont icon-a-filelist-fill" style="color: #f4516c" />
          </div>
          <div class="card-desc">
            <div class="card-title">文章量</div>
            <div class="card-count">{{ articleCount }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="card-icon-container">
            <i class="iconfont icon-a-message3-fill" style="color: #36a3f7" />
          </div>
          <div class="card-desc">
            <div class="card-title">留言量</div>
            <div class="card-count">{{ messageCount }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 一周访问量展示 -->
    <el-card style="margin-top: 1.25rem">
      <div class="e-title">一周访问量</div>
      <div style="height: 350px">
        <LineChart v-loading="loading" :data="viewCountData" />
      </div>
    </el-card>
    <!-- 文章贡献统计 -->
    <el-card style="margin-top: 1.25rem">
      <div class="e-title">文章贡献统计</div>
      <div v-loading="loading">
        <Calender v-loading="loading" start-date="2022-01-01" end-date="2023-01-01" :data="articleStatisticsList" />
      </div>
    </el-card>
    <el-row :gutter="20" style="margin-top: 1.25rem">
      <!-- 文章浏览量排行 -->
      <el-col :span="16">
        <el-card>
          <div class="e-title">文章浏览量排行</div>
          <div style="height: 350px">
            <Rank v-loading="loading" :data="articleRankData" />
            <!--            <v-chart :options="ariticleRank" v-loading="loading" />-->
          </div>
        </el-card>
      </el-col>
      <!-- 分类数据统计 -->
      <el-col :span="8">
        <el-card>
          <div class="e-title">文章分类统计</div>
          <div style="height: 350px">
            <Category v-loading="loading" :data="categoryData" />
            <!--            <v-chart :options="category"  />-->
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 1.25rem">
      <!-- 用户地域分布 -->
      <el-col :span="12">
        <el-card>
          <div class="e-title">用户地域分布</div>
          <div style="height: 350px" v-loading="loading">
            <div class="area-wrapper">
              <el-radio-group v-model="type">
                <el-radio :label="1">用户</el-radio>
                <el-radio :label="2">游客</el-radio>
              </el-radio-group>
            </div>
            <ChinaMap v-loading="loading" :data="areaData" />
            <!--            <v-chart :options="userAreaMap" />-->
          </div>
        </el-card>
      </el-col>
      <!-- 文章标签统计 -->
      <el-col :span="12">
        <el-card>
          <div class="e-title">文章标签统计</div>
          <div style="height: 350px" v-loading="loading">
            <!--       <tag-cloud style="margin-top: 1.5rem" :values="tagDTOList" />-->
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue"
import { getHomeInfoApi } from "@/api/blog"
import { findUserListAreasApi } from "@/api/user"
import Calender from "@/views/blog/home/components/Calender.vue"
import LineChart from "@/views/blog/home/components/LineChart.vue"
import ChinaMap from "@/views/blog/home/components/ChinaMap.vue"
import Category from "@/views/blog/home/components/Category.vue"
import Rank from "@/views/blog/home/components/Rank.vue"

const viewsCount = ref(0)
const messageCount = ref(0)
const userCount = ref(0)
const articleCount = ref(0)
const articleStatisticsList = ref([])
const tagDTOList = ref([])
const loading = ref(true)

const categoryData = ref<{
  legendData: string[]
  seriesData: number[]
}>({
  legendData: [],
  seriesData: [],
})

const viewCountData = ref<{
  xAxis: string[]
  values: number[]
}>({
  xAxis: [],
  values: [],
})

const articleRankData = ref<{
  xAxis: string[]
  values: number[]
}>({
  xAxis: [],
  values: [],
})

const areaData = ref<{
  type: number
  data: { name: string; value: number }[]
}>({
  type: 1,
  data: [],
})

// 获取数据
const getData = () => {
  // 发送请求获取数据
  getHomeInfoApi().then((res) => {
    console.log("res", res)
    viewsCount.value = res.data.views_count
    messageCount.value = res.data.message_count
    userCount.value = res.data.user_count
    articleCount.value = res.data.article_count
    articleStatisticsList.value = res.data.article_statistics_list

    if (res.data.unique_view_dto_list != null) {
      const x = []
      const y = []
      res.data.unique_view_dto_list.forEach((item) => {
        x.push(item.day)
        y.push(item.count)
      })

      viewCountData.value = {
        xAxis: x,
        values: y,
      }
    }

    if (res.data.category_dto_list != null) {
      const series = []
      const legend = []

      res.data.category_dto_list.forEach((item) => {
        series.push({
          value: item.article_count,
          name: item.category_name,
        })
        legend.push(item.category_name)
      })

      categoryData.value = {
        legendData: legend,
        seriesData: series,
      }
    }

    if (res.data.article_rank_dto_list != null) {
      const x = []
      const y = []
      res.data.article_rank_dto_list.forEach((item) => {
        x.push(item.article_title)
        y.push(item.count)
      })

      articleRankData.value = {
        xAxis: x,
        values: y,
      }
    }

    if (res.data.tag_dto_list != null) {
      res.data.tag_dto_list.forEach((item) => {
        tagDTOList.value.push({
          id: item.id,
          name: item.tag_name,
        })
      })
    }

    loading.value = false
  })
}

// 切换用户/游客类型
const type = ref(1)
const listUserArea = () => {
  // 发送请求获取用户地域分布数据
  findUserListAreasApi({}).then((res) => {
    // userAreaMap.series[0].data = res.data
    areaData.value = res.data.list
  })
}

// 在组件创建时获取数据
onMounted(() => {
  getData()
  listUserArea()
})

// 监听type变化，重新获取用户地域分布数据
watch(type, () => {
  listUserArea()
})
</script>

<style scoped>
.card-icon-container {
  display: inline-block;
  font-size: 3rem;
}

.area-wrapper {
  display: flex;
  justify-content: center;
}

.card-desc {
  font-weight: bold;
  float: right;
}

.card-title {
  margin-top: 0.3rem;
  line-height: 18px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 1rem;
}

.card-count {
  margin-top: 0.75rem;
  color: #666;
  font-size: 1.25rem;
}

.echarts {
  width: 100%;
  height: 100%;
}

.e-title {
  font-size: 13px;
  color: #202a34;
  font-weight: 700;
}
</style>
