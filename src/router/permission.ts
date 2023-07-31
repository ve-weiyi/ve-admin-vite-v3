import router from "@/router"
import { ElMessage } from "element-plus"
import { getToken } from "@/utils/cache/cookies"
import NProgress from "nprogress"
import "nprogress/nprogress.css"
import { useAdminStore } from "@/store/modules/admin"

NProgress.configure({ showSpinner: false })
const userStore = useAdminStore()

router.beforeEach(async (to, _from, next) => {
  NProgress.start()

  if (to.path === "/login") {
    // 如果已经登录，并准备进入 Login 页面，则重定向到主页
    next()
    NProgress.done()
  } else if (!userStore.getToken()) {
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
