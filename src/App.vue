<script setup lang="ts">
import { h, onBeforeMount, onMounted } from "vue"
import { useTheme } from "@/hooks/useTheme"
import { resetConfigLayout } from "@/utils"
import { ElNotification } from "element-plus"
// 将 Element Plus 的语言设置为中文
import zhCn from "element-plus/es/locale/lang/zh-cn"
import { useAdminStore } from "@/store/modules/admin"
import { getUserInfoApi, getUserMenusApi } from "@/api/user"
import { usePermissionStoreHook } from "@/store/modules/permission"
import asyncRouteSettings from "@/config/async-route"
import { useRouter } from "vue-router"

const { initTheme } = useTheme()

/** 初始化主题 */
initTheme()

// 获取路由参数
const router = useRouter()
const permissionStore = usePermissionStoreHook()
const userStore = useAdminStore()
// 生命周期钩子
onMounted(() => {
  console.log("mounted")
  // mounted钩子代码
  if (userStore.getToken()) {
    getUserInfoApi().then((res) => {
      userStore.setLoginUser(res.data)
    })
    getUserMenusApi().then((res) => {
      permissionStore.setRoutes(asyncRouteSettings.defaultRoles)
    })
  } else {
    router.push({ path: "/login" })
  }
})

/** 作者小心思 */
// ElNotification({
//   title: "Hello",
//   type: "success",
//   message: h(
//     "a",
//     { style: "color: teal", target: "_blank", href: "https://github.com/un-pany/v3-admin-vite" },
//     "小项目获取 star 不易，如果你喜欢这个项目的话，欢迎点击这里支持一个 star ！这是作者持续维护的唯一动力（小声：毕竟是免费的）"
//   ),
//   duration: 0,
//   position: "bottom-right"
// })
// ElNotification({
//   title: "提示",
//   type: "warning",
//   message: h(
//     "span",
//     {
//       style: "color: teal; cursor: pointer;",
//       onClick: resetConfigLayout
//     },
//     "由于平台 4.1.0 版本新增了多种布局模式，如果出现白屏情况，点击这里或手动前往控制台清理 LocalStorage 缓存数据后刷新页面即可！"
//   ),
//   duration: 0,
//   position: "bottom-right",
//   offset: 150
// })
</script>

<template>
  <ElConfigProvider :locale="zhCn">
    <router-view />
  </ElConfigProvider>
</template>
