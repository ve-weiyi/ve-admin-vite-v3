import Layout from "@/layout/index.vue"

export default {
  path: "/user",
  component: Layout,
  name: "user",
  redirect: "/user/list",
  meta: { title: "用户管理", alwaysShow: true, elIcon: "user" },
  children: [
    {
      path: "list",
      component: () => import("@/views/blog/user/UserList.vue"),
      name: "list",
      meta: { title: "用户列表", keepAlive: true, elIcon: "user-filled" },
    },
    {
      path: "online",
      component: () => import("@/views/blog/user/online/index.vue"),
      name: "online",
      meta: { title: "在线用户", keepAlive: true, elIcon: "user-filled" },
    },
  ],
}
