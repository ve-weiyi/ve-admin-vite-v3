<template>
  <div class="app-container">
    <!-- 统计数据 -->
    <el-row :gutter="30">
      <el-col :span="6">
        <el-card>
          <div class="card-icon-container">
            <i class="iconfont el-icon-myfangwenliang" style="color: #40c9c6" />
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
            <i class="iconfont el-icon-myuser" style="color: #34bfa3" />
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
            <i class="iconfont el-icon-mywenzhang-copy" style="color: #f4516c" />
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
            <i class="iconfont icon-message" style="color: #36a3f7" />
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
        <LineChart />
<!--        <v-chart :options="viewCount" v-loading="loading" />-->
      </div>
    </el-card>
    <!-- 文章贡献统计 -->
    <el-card style="margin-top: 1.25rem">
      <div class="e-title">文章贡献统计</div>
      <div v-loading="loading">
        <Calender start-date="2022-01-01" end-date="2023-01-01" :values="articleStatisticsList" />
      </div>
    </el-card>
    <el-row :gutter="20" style="margin-top: 1.25rem">
      <!-- 文章浏览量排行 -->
      <el-col :span="16">
        <el-card>
          <div class="e-title">文章浏览量排行</div>
          <div style="height: 350px">
            <v-chart :options="ariticleRank" v-loading="loading" />
          </div>
        </el-card>
      </el-col>
      <!-- 分类数据统计 -->
      <el-col :span="8">
        <el-card>
          <div class="e-title">文章分类统计</div>
          <div style="height: 350px">
            <v-chart :options="category" v-loading="loading" />
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 1.25rem">
      <!-- 用户地域分布 -->
      <el-col :span="16">
        <el-card>
          <div class="e-title">用户地域分布</div>
          <div style="height: 350px" v-loading="loading">
            <div class="area-wrapper">
              <el-radio-group v-model="type">
                <el-radio :label="1">用户</el-radio>
                <el-radio :label="2">游客</el-radio>
              </el-radio-group>
            </div>
            <v-chart :options="userAreaMap" />
          </div>
        </el-card>
      </el-col>
      <!-- 文章标签统计 -->
      <el-col :span="8">
        <el-card>
          <div class="e-title">文章标签统计</div>
          <!--          <div style="height: 350px" v-loading="loading">-->
          <!--            <tag-cloud style="margin-top: 1.5rem" :values="tagDTOList" />-->
          <!--          </div>-->
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { adminHomeInfoApi, adminUserAreasApi } from '@/api/admin'
import axios from 'axios'
import VChart from 'vue-echarts'
import * as echarts from 'echarts'
import chinaMap from '@/assets/js/china.json'
import Calender from '@/views/blog/home/components/Calender.vue'
import LineChart from '@/views/blog/home/components/LineChart.vue'

const viewsCount = ref(0)
const messageCount = ref(0)
const userCount = ref(0)
const articleCount = ref(0)
const articleStatisticsList = ref([])
const tagDTOList = ref([])
const loading = ref(true)

const viewCount = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
    },
  },
  color: ['#3888fa'],
  legend: {
    data: ['访问量'],
  },
  grid: {
    left: '0%',
    right: '0%',
    bottom: '0%',
    top: '10%',
    containLabel: true,
  },
  xAxis: {
    data: [],
    axisLine: {
      lineStyle: {
        color: '#666',
      },
    },
  },
  yAxis: {
    axisLine: {
      lineStyle: {
        color: '#048CCE',
      },
    },
  },
  series: [
    {
      name: '访问量',
      type: 'line',
      data: [],
      smooth: true,
    },
  ],
}

const ariticleRank = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
    },
  },
  color: ['#58AFFF'],
  grid: {
    left: '0%',
    right: '0%',
    bottom: '0%',
    top: '10%',
    containLabel: true,
  },
  xAxis: {
    data: [],
  },
  yAxis: {},
  series: [
    {
      name: ['浏览量'],
      type: 'bar',
      data: [],
    },
  ],
}

const category = {
  color: ['#7EC0EE', '#FF9F7F', '#FFD700', '#C9C9C9', '#E066FF', '#C0FF3E'],
  legend: {
    data: [],
    bottom: 'bottom',
  },
  tooltip: {
    trigger: 'item',
  },
  series: [
    {
      name: '文章分类',
      type: 'pie',
      roseType: 'radius',
      data: [],
    },
  ],
}

const userAreaMap = {
  tooltip: {
    formatter: function(e) {
      var value = e.value ? e.value : 0
      return e.seriesName + '<br />' + e.name + '：' + value
    },
  },
  visualMap: {
    min: 0,
    max: 1000,
    right: 26,
    bottom: 40,
    showLabel: true,
    pieces: [
      {
        gt: 100,
        label: '100人以上',
        color: '#ED5351',
      },
      {
        gte: 51,
        lte: 100,
        label: '51-100人',
        color: '#59D9A5',
      },
      {
        gte: 21,
        lte: 50,
        label: '21-50人',
        color: '#F6C021',
      },
      {
        label: '1-20人',
        gt: 0,
        lte: 20,
        color: '#6DCAEC',
      },
    ],
    show: true,
  },
  geo: {
    map: 'china',
    zoom: 1.2,
    layoutCenter: ['50%', '50%'],
    itemStyle: {
      normal: {
        borderColor: 'rgba(0, 0, 0, 0.2)',
      },
      emphasis: {
        areaColor: '#F5DEB3',
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        borderWidth: 0,
      },
    },
  },
  series: [
    {
      name: '用户人数',
      type: 'map',
      geoIndex: 0,
      data: [],
      areaColor: '#0FB8F0',
    },
  ],
}

// 获取数据
const getData = () => {
  // 发送请求获取数据
  adminHomeInfoApi().then((res) => {
    viewsCount.value = res.data.viewsCount
    messageCount.value = res.data.messageCount
    userCount.value = res.data.userCount
    articleCount.value = res.data.articleCount
    articleStatisticsList.value = res.data.articleStatisticsList

    if (res.data.uniqueViewDTOList != null) {
      res.data.uniqueViewDTOList.forEach((item) => {
        viewCount.xAxis.data.push(item.day)
        viewCount.series[0].data.push(item.viewsCount)
      })
    }

    if (res.data.categoryDTOList != null) {
      res.data.categoryDTOList.forEach((item) => {
        category.series[0].data.push({
          value: item.articleCount,
          name: item.categoryName,
        })
        category.legend.data.push(item.categoryName)
      })
    }

    if (res.data.articleRankDTOList != null) {
      res.data.articleRankDTOList.forEach((item) => {
        ariticleRank.series[0].data.push(item.viewsCount)
        ariticleRank.xAxis.data.push(item.articleTitle)
      })
    }

    if (res.data.tagDTOList != null) {
      res.data.tagDTOList.forEach((item) => {
        tagDTOList.value.push({
          id: item.id,
          name: item.tagName,
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
  adminUserAreasApi({
    type: type.value,
  }).then(({ data }) => {
    userAreaMap.series[0].data = data.data
  })
}

// 在组件创建时获取数据
onMounted(() => {
  echarts.registerMap('china', chinaMap)
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
