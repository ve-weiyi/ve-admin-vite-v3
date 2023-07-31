import { defineStore } from "pinia"
import cookies from "@/utils/cookies"

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
  actions: {
    setLoginUser(user) {
      // console.log("user", user)
      this.userId = user.id
      this.roleList = user.roleList
      this.avatar = user.avatar
      this.nickname = user.nickname
      this.intro = user.intro
      this.webSite = user.webSite
      cookies.set("uid", user.id)
    },
    logout() {
      this.userId = null
      this.roleList = null
      this.avatar = null
      this.nickname = null
      this.intro = null
      this.webSite = null
      this.userMenuList = []
      cookies.clearAll()
    },
    getToken() {
      return cookies.get("token")
    },
    setToken(token) {
      cookies.set("token", token)
    },
    removeToken() {
      cookies.remove("token")
    },

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
    saveUserMenuList(userMenuList) {
      this.userMenuList = userMenuList
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
