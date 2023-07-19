<template>
  <div ref="container" :class="props.className" :style="{ height: props.height, width: props.width }" />
</template>

<script setup lang="ts">
import * as echarts from "echarts"
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
} from "vue"
import { EChartsOption } from "echarts"

type ECharts = echarts.ECharts

const props = defineProps({
  data: {
    type: Object as () => {
      legendData: string[]
      seriesData: number[]
    },
    default: () => ({}),
  },
  className: {
    type: String,
    default: "chart",
  },
  width: {
    type: String,
    default: "90%",
  },
  height: {
    type: String,
    default: "90%",
  },
})

const chart: ShallowRef<ECharts | null> = shallowRef(null)
const container: Ref<HTMLElement | null> = ref(null)
const option: Ref<EChartsOption | null> = ref(null)

const initChart = () => {
  chart.value = echarts.init(container.value as HTMLElement)
}

const updateCharts = () => {
  option.value = {
    color: ["#7EC0EE", "#FF9F7F", "#FFD700", "#C9C9C9", "#E066FF", "#C0FF3E"],
    legend: {
      data: props.data.legendData,
      bottom: "bottom",
    },
    tooltip: {
      trigger: "item",
    },
    series: [
      {
        name: "文章分类",
        type: "pie",
        roseType: "radius",
        data: props.data.seriesData,
      },
    ],
  }
  chart.value.setOption(option.value)
}

// watchEffect 会自动追踪依赖并在其变化时执行回调函数。
watchEffect(() => {
  if (!chart.value) {
    return
  }
  updateCharts()
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

defineExpose({
  chart,
})
</script>
