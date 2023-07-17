import router from "@/router"
import { useUserStoreHook } from "@/store/modules/user"
import { usePermissionStoreHook } from "@/store/modules/permission"
import { ElMessage } from "element-plus"
import { getToken } from "@/utils/cache/cookies"
import asyncRouteSettings from "@/config/async-route"
import isWhiteList from "@/config/white-list"
import NProgress from "nprogress"
import "nprogress/nprogress.css"

NProgress.configure({ showSpinner: false })

router.beforeEach(async (to, _from, next) => {
  NProgress.start()
  const userStore = useUserStoreHook()
  const permissionStore = usePermissionStoreHook()

  if (to.path === "/login") {
    // 如果已经登录，并准备进入 Login 页面，则重定向到主页
    next()
    NProgress.done()
  } else if (!getToken()) {
    // 用户未登录
    next({ path: "/login" })
  } else {
    next()
    NProgress.done()
  }
})

router.afterEach(() => {
  NProgress.done()
})
