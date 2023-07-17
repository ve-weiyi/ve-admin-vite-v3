import { defineStore } from "pinia"

export const useAdminStore = defineStore({
  id: "admin",
  state: () => ({
    collapse: false,
    tabList: [{ name: "首页", path: "/" }],
    userId: null,
    roleList: null,
    avatar: null,
    nickname: null,
    intro: null,
    webSite: null,
    userMenuList: [],
    name: null,
    phone: null,
    email: null,
    identity: null,
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
      if (this.tabList.findIndex((item) => item.path === tab.path) === -1) {
        this.tabList.push({ name: tab.name, path: tab.path })
      }
    },
    removeTab(tab) {
      const index = this.tabList.findIndex((item) => item.name === tab.name)
      this.tabList.splice(index, 1)
    },
    resetTab() {
      this.tabList = [{ name: "首页", path: "/" }]
    },
    trigger() {
      this.collapse = !this.collapse
    },
    setUserInfo(user) {
      // console.log("user", user)
      this.userId = user.id
      this.roleList = user.roleList
      this.avatar = user.avatar
      this.nickname = user.nickname
      this.intro = user.intro
      this.webSite = user.webSite
    },
    saveUserMenuList(userMenuList) {
      this.userMenuList = userMenuList
    },
    logout() {
      this.userId = null
      this.roleList = null
      this.avatar = null
      this.nickname = null
      this.intro = null
      this.webSite = null
      this.userMenuList = []
    },
    updateAvatar(avatar) {
      this.avatar = avatar
    },
    updateUserInfo(user) {
      this.nickname = user.nickname
      this.intro = user.intro
      this.webSite = user.webSite
    },
  },
})
