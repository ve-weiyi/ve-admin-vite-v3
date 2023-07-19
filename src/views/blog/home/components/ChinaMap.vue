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
import chinaJson from "@/assets/js/china.json"

type ECharts = echarts.ECharts

const props = defineProps({
  data: {
    type: Object,
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

option.value = {
  tooltip: {
    formatter: function (e) {
      var value = e.value ? e.value : 0
      return e.seriesName + "<br />" + e.name + "：" + value
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
        label: "100人以上",
        color: "#ED5351",
      },
      {
        gte: 51,
        lte: 100,
        label: "51-100人",
        color: "#59D9A5",
      },
      {
        gte: 21,
        lte: 50,
        label: "21-50人",
        color: "#F6C021",
      },
      {
        label: "1-20人",
        gt: 0,
        lte: 20,
        color: "#6DCAEC",
      },
    ],
    show: true,
  },
  geo: {
    map: "china",
    zoom: 1.2,
    layoutCenter: ["50%", "50%"],
    itemStyle: {
      // areaColor: "#0FB8F0",
      borderColor: "rgba(0, 0, 0, 0.2)",
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      borderWidth: 0,
    },
  },
  series: [
    {
      name: "用户人数",
      type: "map",
      map: "china",
      roam: true,
      zoom: 1.2, // 控制地图的放大缩小
      geoIndex: 0,
      data: [{ name: "广西", value: 1 }],
      emphasis: {
        // 高亮状态下的多边形和标签样式
        // 控制地图滑过后的颜色
        label: {
          color: "red",
          fontSize: 10,
          show: true, //省份名称
        },
        itemStyle: {
          areaColor: "#0FB8F0",
        },
      },
    },
  ],
}

const initChart = () => {
  chart.value = echarts.init(container.value as HTMLElement)
  echarts.registerMap("china", chinaJson as any)
}

const updateCharts = () => {
  if (!chart.value) {
    return
  }

  chart.value.setOption(option.value)
}

// watchEffect 会自动追踪依赖并在其变化时执行回调函数。
watchEffect(() => {
  if (!chart.value) {
    return
  }
  console.log("watchEffect", props.data)
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
