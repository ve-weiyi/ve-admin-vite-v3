import Layout from '@/layout/index.vue'

export default {
  path: '/mine',
  component: Layout,
  name: 'mine',
  redirect: '/mine/userinfo',
  meta: { title: '个人中心', icon: 'devices' },
  children: [
    {
      path: 'userinfo',
      component: () => import('@/views/blog/mine/Mine.vue'),
      name: 'userinfo',
      meta: { title: '个人信息', keepAlive: true },
    },
  ],
}
//
// import Layout from '@/layout/index.vue'
//
// export default {
//   path: '/authority',
//   component: Layout,
//   name: 'Authority',
//   redirect: '/authority/role',
//   meta: { title: '权限管理', icon: 'devices' },
//   children: [
//     {
//       path: 'role',
//       component: () => import('@/views/authority/role/Role.vue'),
//       name: 'Role',
//       meta: { title: '角色管理', noCache: true },
//     },
//     {
//       path: 'menu',
//       component: () => import('@/views/authority/menu/Menu.vue'),
//       name: 'Menu',
//       meta: { title: '菜单管理', noCache: true },
//     },
//     {
//       path: 'resource',
//       component: () => import('@/views/authority/resource/Resource.vue'),
//       name: 'Resource',
//       meta: { title: '接口管理', noCache: true },
//     },
//   ],
// }
