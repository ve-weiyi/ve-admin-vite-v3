import Layout from "@/layout/index.vue"

export default {
  path: "/",
  component: Layout,
  name: "album-management",
  redirect: "/albums",
  meta: { title: "相册管理", elIcon: "Grid" },
  children: [
    {
      path: "albums",
      component: () => import("@/views/blog/album/Album.vue"),
      name: "Albums",
      meta: { title: "相册列表", noCache: true }
    },
    {
      path: "albums/:id",
      component: () => import("@/views/blog/album/Photo.vue"),
      name: "Photo",
      meta: { title: "照片管理", hidden: true, noCache: true }
    },
    {
      path: "photo/delete",
      component: () => import("@/views/blog/album/Delete.vue"),
      name: "Delete",
      meta: { title: "照片回收站", noCache: true }
    }
  ]
}
