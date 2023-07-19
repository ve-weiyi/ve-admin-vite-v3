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
    type: Object as () => { xAxis: string[]; values: number[] },
    default: () => ({
      xAxis: ["2022-01-18", "2022-01-19"],
      values: [100, 100],
    }),
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
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
      },
    },
    color: ["#58AFFF"],
    grid: {
      left: "0%",
      right: "0%",
      bottom: "0%",
      top: "10%",
      containLabel: true,
    },
    xAxis: {
      data: props.data.xAxis,
    },
    yAxis: {},
    series: [
      {
        name: "浏览量",
        type: "bar",
        data: props.data.values,
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
