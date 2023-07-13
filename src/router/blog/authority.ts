import Layout from '@/layout/index.vue'

export default {
  path: '/authority',
  component: Layout,
  name: 'Authority',
  redirect: '/authority/role',
  meta: { title: '权限管理', elIcon: "lock" },
  children: [
    {
      path: 'role',
      component: () => import('@/views/blog/authority/role/Role.vue'),
      name: 'Role',
      meta: { title: '角色管理', noCache: true }
    },
    {
      path: 'menu',
      component: () => import('@/views/blog/authority/menu/Menu.vue'),
      name: 'Menu',
      meta: { title: '菜单管理', noCache: true }
    },
    {
      path: 'resource',
      component: () => import('@/views/blog/authority/resource/Resource.vue'),
      name: 'Resource',
      meta: { title: '接口管理', noCache: true }
    }
  ]
}
