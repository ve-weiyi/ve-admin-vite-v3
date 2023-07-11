import Layout from "@/layout/index.vue"

export default {
  path: "/mine",
  component: Layout,
  name: "mine",
  redirect: "/mine/userinfo",
  meta: { title: "个人中心", alwaysShow: true, elIcon: "Grid" },
  children: [
    {
      path: "userinfo",
      component: () => import("@/views/blog/mine/Mine.vue"),
      name: "userinfo",
      meta: { title: "个人信息", keepAlive: true }
    }
  ]
}
