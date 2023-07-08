<template>
  <div ref="container" :class="props.className" :style="{ height: props.height, width: props.width }" />
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import {
  onMounted,
  ref,
  nextTick,
  onBeforeUnmount,
  shallowRef,
  ShallowRef,
  Ref,
  computed,
  watch,
  watchEffect,
} from 'vue'
import { EChartsOption } from 'echarts'

type ECharts = echarts.ECharts

const props = defineProps({
  values: {
    type: Array as () => { day: string; count: number }[],
    default: () => [
      { day: '2022-01-18', count: 100 },
      { day: '2022-01-19', count: 100 },
    ],
  },
  className: {
    type: String,
    default: 'chart',
  },
  width: {
    type: String,
    default: '100%',
  },
  height: {
    type: String,
    default: '250px',
  },
})

const chart: ShallowRef<ECharts | null> = shallowRef(null)
const container: Ref<HTMLElement | null> = ref(null)
const option: Ref<EChartsOption | null> = ref(null)

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
      data: [150, 230, 224, 218, 135, 147, 260],
      smooth: true,
    },
  ],
}

const initChart = () => {
  chart.value = echarts.init(container.value as HTMLElement)
}

const resetOption = () => {
  if (!chart.value) {
    return
  }

  chart.value.setOption(viewCount)
}

// watchEffect 会自动追踪依赖并在其变化时执行回调函数。
watchEffect(() => {
  if (!chart.value) {
    return
  }
  resetOption()
})

onMounted(() => {
  nextTick(() => {
    initChart()
  })
})
onBeforeUnmount(() => {
  if (!chart.value) {
    return
  }
  chart.value.dispose()
  chart.value = null
})
</script>
