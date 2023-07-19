import Layout from "@/layout/index.vue"

export default {
  path: "/system",
  component: Layout,
  name: "system",
  redirect: "system/website",
  meta: { title: "网站管理", elIcon: "setting" },
  children: [
    {
      path: "website",
      component: () => import("@/views/blog/system/website/Website.vue"),
      name: "Website",
      meta: { title: "网站设置", noCache: true },
    },
    {
      path: "page",
      component: () => import("@/views/blog/system/page/Page.vue"),
      name: "Page",
      meta: { title: "页面管理", noCache: true },
    },
    {
      path: "about",
      component: () => import("@/views/blog/system/about/About.vue"),
      name: "About",
      meta: { title: "关于我", noCache: true },
    },
  ],
}
