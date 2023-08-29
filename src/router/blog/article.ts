import Layout from "@/layout/index.vue"

export default {
  path: "/article",
  component: Layout,
  name: "article",
  redirect: "article/publish",
  meta: { title: "文章管理", elIcon: "document" },
  children: [
    {
      path: "publish",
      component: () => import("@/views/blog/article/Article.vue"),
      name: "article/publish",
      meta: { title: "发布文章", noCache: true },
    },
    {
      path: "list",
      component: () => import("@/views/blog/article/ArticleList.vue"),
      name: "article/list",
      meta: { title: "文章列表", noCache: true },
    },
    {
      path: "category",
      component: () => import("@/views/blog/article/category/Category.vue"),
      name: "article/category",
      meta: { title: "分类管理", noCache: true },
    },
    {
      path: "tag",
      component: () => import("@/views/blog/article/tag/Tag.vue"),
      name: "article/tag",
      meta: { title: "标签管理", noCache: true },
    },
  ],
}
