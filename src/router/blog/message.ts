import Layout from "@/layout/index.vue"

export default {
  path: "/message",
  component: Layout,
  name: "message",
  redirect: "/message/comment",
  meta: { title: "消息管理", alwaysShow: true, elIcon: "message" },
  children: [
    {
      path: "comment",
      component: () => import("@/views/blog/message/comment/Comment.vue"),
      name: "comment",
      meta: { title: "评论管理", keepAlive: true },
    },
    {
      path: "remark",
      component: () => import("@/views/blog/message/remark/Remark.vue"),
      name: "remark",
      meta: { title: "留言管理", keepAlive: true },
    },
    {
      path: "links",
      component: () => import("@/views/blog/message/link/FriendLink.vue"),
      name: "links",
      meta: { title: "友链管理", keepAlive: true },
    },
  ],
}
