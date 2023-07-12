// core
import { createApp } from "vue"
import App from "@/App.vue"
import store from "@/store"
import router from "@/router"
import "@/router/permission"
// load
import { loadSvg } from "@/icons"
import { loadPlugins } from "@/plugins"
import { loadDirectives } from "@/directives"
// css
// import "uno.css"
import "normalize.css"
import "element-plus/dist/index.css"
import "element-plus/theme-chalk/dark/css-vars.css"
import "vxe-table/lib/style.css"
import "vxe-table-plugin-element/dist/style.css"
import "@/styles/index.scss"
import "@/styles/admin.scss"
// 导入 ECharts 相关组件和图表类型
// import ECharts from "vue-echarts"
// import "echarts/lib/chart/line"
// import "echarts/lib/chart/pie"
// import "echarts/lib/chart/bar"
// import "echarts/lib/chart/map"
// import "echarts/lib/component/tooltip"
// import "echarts/lib/component/legend"
// import "echarts/lib/component/title"

const app = createApp(App)

// app.component("v-chart", ECharts) // 注册 ECharts 组件
/** 加载插件 */
loadPlugins(app)
/** 加载全局 SVG */
loadSvg(app)
/** 加载自定义指令 */
loadDirectives(app)

app.use(store).use(router)
router.isReady().then(() => {
  app.mount("#app")
})
