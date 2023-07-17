<script lang="ts" setup>
import { ref, watchEffect } from "vue"
import { storeToRefs } from "pinia"
import { useSettingsStore } from "@/store/modules/settings"
import { resetConfigLayout } from "@/utils"
import SelectLayoutMode from "./SelectLayoutMode.vue"
import { Setting, Refresh } from "@element-plus/icons-vue"

interface Props {
  buttonTop?: number
}

const props = withDefaults(defineProps<Props>(), {
  buttonTop: 350,
})

const buttonTopCss = props.buttonTop + "px"
const show = ref(false)

const settingsStore = useSettingsStore()

/** 使用 storeToRefs 将提取的属性保持其响应性 */
const {
  layoutMode,
  showTagsView,
  showLogo,
  fixedHeader,
  showNotify,
  showThemeSwitch,
  showScreenfull,
  cacheTagsView,
  showGreyMode,
  showColorWeakness,
} = storeToRefs(settingsStore)

/** 定义 switch 设置项 */
const switchSettings = {
  显示标签栏: showTagsView,
  "显示 Logo": showLogo,
  "固定 Header": fixedHeader,
  显示消息通知: showNotify,
  显示切换主题按钮: showThemeSwitch,
  显示全屏按钮: showScreenfull,
  是否缓存标签栏: cacheTagsView,
  显示灰色模式: showGreyMode,
  显示色弱模式: showColorWeakness,
}

/** 非左侧模式时，Header 都是 fixed 布局 */
watchEffect(() => {
  layoutMode.value !== "left" && (fixedHeader.value = true)
})
</script>

<template>
  <div class="handle-button" @click="show = true">
    <el-icon :size="24">
      <Setting />
    </el-icon>
  </div>
  <el-drawer v-model="show" size="300px" :with-header="false">
    <div class="setting-container">
      <h4>布局配置</h4>
      <SelectLayoutMode />
      <el-divider />
      <h4>功能配置</h4>
      <div class="setting-item" v-for="(settingValue, settingName, index) in switchSettings" :key="index">
        <span class="setting-name">{{ settingName }}</span>
        <el-switch v-model="settingValue.value" :disabled="layoutMode !== 'left' && settingName === '固定 Header'" />
      </div>
      <el-button type="danger" :icon="Refresh" @click="resetConfigLayout">重 置</el-button>
    </div>
  </el-drawer>
</template>

<style lang="scss" scoped>
.handle-button {
  width: 48px;
  height: 48px;
  background-color: var(--v3-rightpanel-button-bg-color);
  position: fixed;
  //top: v-bind(buttonTopCss);
  bottom: 20px;
  right: 0px;
  border-radius: 6px 0 0 6px;
  z-index: 10;
  cursor: pointer;
  pointer-events: auto;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

@import "@/styles/mixins.scss";

.setting-container {
  padding: 20px;
  .setting-item {
    font-size: 14px;
    color: var(--el-text-color-regular);
    padding: 5px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .setting-name {
      @include ellipsis;
    }
  }
  .el-button {
    margin-top: 40px;
    width: 100%;
  }
}
</style>
