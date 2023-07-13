import Layout from "@/layout/index.vue"

export default {
  path: "/",
  component: Layout,
  name: "article",
  redirect: "article/publish",
  meta: { title: "文章管理", elIcon: "list" },
  children: [
    {
      path: "article/publish",
      component: () => import("@/views/blog/article/Article.vue"),
      name: "article/publish",
      meta: { title: "发布文章", noCache: true }
    },
    {
      path: "article/list",
      component: () => import("@/views/blog/article/ArticleList.vue"),
      name: "article/list",
      meta: { title: "文章列表", noCache: true }
    },
    {
      path: "article/category",
      component: () => import("@/views/blog/article/Category.vue"),
      name: "article/category",
      meta: { title: "标签管理", noCache: true }
    },
    {
      path: "article/tag",
      component: () => import("@/views/blog/article/Tag.vue"),
      name: "article/tag",
      meta: { title: "分类管理", noCache: true }
    }
  ]
}
