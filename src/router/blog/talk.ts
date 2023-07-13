import Layout from "@/layout/index.vue"

export default {
  path: "/talk",
  component: Layout,
  name: "talk",
  redirect: "talk/publish",
  meta: { title: "说说管理", elIcon: "comment" },
  children: [
    {
      path: "publish",
      component: () => import("@/views/blog/talk/Talk.vue"),
      name: "publish",
      meta: { title: "发布说说", noCache: true },
    },
    {
      path: "list",
      component: () => import("@/views/blog/talk/TalkList.vue"),
      name: "TalkList",
      meta: { title: "说说列表", noCache: true },
    },
  ],
}
