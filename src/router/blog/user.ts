import Layout from "@/layout/index.vue"

export default {
  path: "/user",
  component: Layout,
  name: "user",
  redirect: "/user/list",
  meta: { title: "用户中心", alwaysShow: true, elIcon: "Grid" },
  children: [
    {
      path: "list",
      component: () => import("@/views/blog/user/UserList.vue"),
      name: "list",
      meta: { title: "用户列表", keepAlive: true }
    },
    {
      path: "online",
      component: () => import("@/views/blog/user/online/index.vue"),
      name: "online",
      meta: { title: "在线用户", keepAlive: true }
    }
  ]
}
