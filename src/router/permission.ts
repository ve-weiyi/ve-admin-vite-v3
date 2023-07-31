import router from "@/router"
import NProgress from "nprogress"
import "nprogress/nprogress.css"
import cookies from "@/utils/cookies"

NProgress.configure({ showSpinner: false })

router.beforeEach(async (to, _from, next) => {
  NProgress.start()

  if (to.path === "/login") {
    // 如果已经登录，并准备进入 Login 页面，则重定向到主页
    next()
    NProgress.done()
  } else if (!cookies.get("token")) {
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
