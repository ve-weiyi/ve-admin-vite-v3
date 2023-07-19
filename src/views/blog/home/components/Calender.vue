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
    type: Array as () => { day: string; count: number }[],
    default: () => [
      { day: "2022-01-18", count: 100 },
      { day: "2022-01-19", count: 100 },
    ],
  },
  startDate: {
    type: String,
    default: () => {
      const date = new Date()
      console.log("startDate", date.getFullYear(), date.getMonth(), date.getDate())
      const year = date.getFullYear() - 1
      const month = date.getMonth() + 1
      const day = date.getDate() - 1
      return `${year}-${month}-${day}`
    },
  },
  endDate: {
    type: String,
    default: new Date().toISOString().slice(0, 10),
  },
  className: {
    type: String,
    default: "chart",
  },
  width: {
    type: String,
    default: "100%",
  },
  height: {
    type: String,
    default: "250px",
  },
})

const chart: ShallowRef<ECharts | null> = shallowRef(null)
const container: Ref<HTMLElement | null> = ref(null)
const option: Ref<EChartsOption | null> = shallowRef(null)

const initChart = () => {
  chart.value = echarts.init(container.value as HTMLElement)
}

const updateCharts = () => {
  if (!chart.value) {
    return
  }
  const colorRange = ["#ebedf0", "#40c463", "#0be148", "#30a14e", "#216e39"]
  const startYear = props.startDate.split("-")[0]
  const endYear = props.endDate.split("-")[0]
  const rangeMin = 0
  let rangeMax = 5

  const data: [string, number][] = []
  const date = +echarts.time.parse(props.startDate)
  const end = +echarts.time.parse(props.endDate)
  const dayTime = 3600 * 24 * 1000
  for (let time = date; time < end; time += dayTime) {
    const key = echarts.time.format(time, "{yyyy}-{MM}-{dd}", false)
    const count = props.data.find((item) => item.day === key)?.count || 0
    // Math.floor(Math.random() * rangeMax)]
    if (count > rangeMax) {
      rangeMax = count
    }
    data.push([key, count])
  }

  option.value = {
    title: {
      top: 30,
      left: "center",
      text: `${startYear}-${endYear}年每日代码提交次数`,
    },
    tooltip: {
      trigger: "item", // 设置触发方式为项触发
      formatter: function (data: any) {
        // 定义提示框的内容
        return `${data.value[0]},${data.value[1]}次提交`
      },
    },
    visualMap: {
      min: rangeMin,
      max: rangeMax,
      calculable: true, // 开启值域漫游，根据数据动态调整间隔
      type: "piecewise",
      orient: "horizontal",
      left: "center",
      top: 65,
      // 颜色范围
      inRange: {
        color: colorRange,
      },
      formatter: function (value) {
        // 自定义单位显示
        return value + " 次/日"
      },
    },
    calendar: {
      top: 100,
      left: 30,
      right: 30,
      cellSize: ["auto", 13],
      range: [props.startDate, props.endDate],
      // 月份样式
      splitLine: {
        show: false,
      },
      itemStyle: {
        // 设置热力图边框样式
        borderColor: "#fff", // 边框颜色
        borderWidth: 3, // 边框宽度
        borderType: "solid", // 边框线型
      },
      // 月份边框
      yearLabel: {
        show: true,
      },
      monthLabel: {
        show: true,
        position: "end",
        nameMap: "ZH",
      },
      dayLabel: {
        show: true,
        nameMap: "ZH",
      },
    },
    series: {
      type: "heatmap",
      coordinateSystem: "calendar",
      data: data,
    },
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
</script>
