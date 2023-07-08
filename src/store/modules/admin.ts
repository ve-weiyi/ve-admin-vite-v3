import { defineStore } from 'pinia'

export const useAdminStore = defineStore({
  id: 'admin',
  state: () => ({
    collapse: false,
    tabList: [{ name: '首页', path: '/' }],
    userId: null,
    roleList: null,
    avatar: null,
    nickname: null,
    intro: null,
    webSite: null,
    userMenuList: [],
  }),
  getters: {
    getTabList: (state) => state.tabList,
    getUserId: (state) => state.userId,
    getRoleList: (state) => state.roleList,
    getAvatar: (state) => state.avatar,
    getNickname: (state) => state.nickname,
    getIntro: (state) => state.intro,
    getWebSite: (state) => state.webSite,
    getUserMenuList: (state) => state.userMenuList,
  },
  actions: {
    saveTab(tab) {
      if (this.state.tabList.findIndex((item) => item.path === tab.path) === -1) {
        this.state.tabList.push({ name: tab.name, path: tab.path })
      }
    },
    removeTab(tab) {
      const index = this.state.tabList.findIndex((item) => item.name === tab.name)
      this.state.tabList.splice(index, 1)
    },
    resetTab() {
      this.state.tabList = [{ name: '首页', path: '/' }]
    },
    trigger() {
      this.state.collapse = !this.state.collapse
    },
    login(user) {
      this.state.userId = user.userInfoId
      this.state.roleList = user.roleList
      this.state.avatar = user.avatar
      this.state.nickname = user.nickname
      this.state.intro = user.intro
      this.state.webSite = user.webSite
    },
    saveUserMenuList(userMenuList) {
      this.state.userMenuList = userMenuList
    },
    logout() {
      this.state.userId = null
      this.state.roleList = null
      this.state.avatar = null
      this.state.nickname = null
      this.state.intro = null
      this.state.webSite = null
      this.state.userMenuList = []
    },
    updateAvatar(avatar) {
      this.state.avatar = avatar
    },
    updateUserInfo(user) {
      this.state.nickname = user.nickname
      this.state.intro = user.intro
      this.state.webSite = user.webSite
    },
  },
})
