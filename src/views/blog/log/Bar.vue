<template>
  <div class="w-[99/100] mt-2 px-2 pb-2 bg-bg_color">
    <div class="flex justify-between w-full h-[60px] p-4">
      <slot v-if="slots.title" name="title" />
      <p class="font-bold truncate" v-else>{{ props.title }}</p>

      <div class="flex items-center justify-around">
        <slot v-if="slots.buttons" name="buttons" />

        <el-tooltip effect="dark" content="刷新" placement="top">
          <RefreshIcon :class="['w-[16px]', 'icon-class']" @click="onReFresh" />
        </el-tooltip>

        <el-divider direction="vertical" />

        <el-tooltip effect="dark" content="密度" placement="top">
          <el-dropdown trigger="click">
            <CollapseIcon :class="['w-[16px]', 'icon-class']" />

            <template #dropdown>
              <el-dropdown-menu class="translation">
                <el-dropdown-item :style="getDropdownItemStyle('large')" @click="size = 'large'">
                  宽松
                </el-dropdown-item>
                <el-dropdown-item :style="getDropdownItemStyle('default')" @click="size = 'default'">
                  默认
                </el-dropdown-item>
                <el-dropdown-item :style="getDropdownItemStyle('small')" @click="size = 'small'">
                  紧凑
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-tooltip>

        <el-divider direction="vertical" />

        <el-tooltip
          popper-options="{ modifiers: [{ name: 'computeStyles', options: { adaptive: false, enabled: false } }] }"
          placement="top"
          virtual-ref="buttonRef"
          virtual-triggering
          trigger="hover"
          content="列设置"
        />

        <!-- 其他部分保持不变 -->
        <el-popover placement="bottom-start" popper-style="{ padding: '0' }" width="160" trigger="click">
          <template #reference>
            <SettingIcon :class="['w-[16px]', 'icon-class']" />
          </template>
          <div >
            <el-checkbox
              class="!-mr-1"
              label="列展示"
              v-model="checkAll"
              @change="handleCheckAllChange"
            />
            <el-button type="primary" link @click="onReset"> 重置 </el-button>
          </div>
          <div class="pt-[6px] pl-[11px]">
            <el-checkbox-group v-model="checkedColumns" @change="handleCheckedColumnsChange">
              <el-space direction="vertical" alignment="flex-start" size="0">
                <template v-for="item in checkColumnList" :key="item">
                  <div class="flex items-center">
                    <DragIcon
                      :class="['drag-btn w-[16px] mr-2', isFixedColumn(item) ? '!cursor-no-drop' : '!cursor-grab']"
                      @mouseenter="rowDrop"
                    />
                    <el-checkbox :label="item" @change="handleCheckColumnListChange">
                      <span :title="item" class="inline-block w-[120px] truncate hover:text-text_color_primary">
                        {{ item }}
                      </span>
                    </el-checkbox>
                  </div>
                </template>
              </el-space>
            </el-checkbox-group>
          </div>
        </el-popover>
      </div>
    </div>
    <slot :size="size" :dynamicColumns="dynamicColumns" />
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, defineSlots, defineExpose, computed, withCtx } from "vue"
// import Sortable from "sortablejs";
import DragIcon from "./svg/drag.svg?component"
import ExpandIcon from "./svg/expand.svg?component"
import RefreshIcon from "./svg/refresh.svg?component"
import SettingIcon from "./svg/settings.svg?component"
import CollapseIcon from "./svg/collapse.svg?component"

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
})
const emit = defineEmits({})
const slots = defineSlots()

const buttonRef = ref()
const size = ref("default")
const isExpandAll = ref(true)
const loading = ref(true)
const checkAll = ref(true)
const isIndeterminate = ref(false)
const checkColumnList = []
const checkedColumns = ref([])
const dynamicColumns = ref([])

const iconClass = computed(() => {
  return ["text-black", "dark:text-white", "duration-100", "hover:!text-primary", "cursor-pointer", "outline-none"]
})

const topClass = computed(() => {
  return [
    "flex",
    "justify-between",
    "pt-[3px]",
    "px-[11px]",
    "border-b-[1px]",
    "border-solid",
    "border-[#dcdfe6]",
    "dark:border-[#303030]",
  ]
})
const onExpand = () => {
  // 处理展开逻辑
}

const onReFresh = () => {
  // 处理刷新逻辑
}

function handleCheckAllChange(val: boolean) {
  checkedColumns.value = val ? checkColumnList : []
  isIndeterminate.value = false
  dynamicColumns.value.map((column) => (val ? (column.hide = false) : (column.hide = true)))
}

function handleCheckedColumnsChange(value: string[]) {
  const checkedCount = value.length
  checkAll.value = checkedCount === checkColumnList.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < checkColumnList.length
}

function handleCheckColumnListChange(val: boolean, label: string) {
  dynamicColumns.value.filter((item) => item.label === label)[0].hide = !val
}

const isFixedColumn = (label: string) => {
  return dynamicColumns.value.filter((item) => item.label === label)[0].fixed ? true : false
}

const rowDrop = (event) => {
  event.preventDefault()
  // 处理拖拽逻辑
}

const getDropdownItemStyle = computed(() => {
  return (s) => {
    return {
      background: s === size.value ? "#409eff" : "",
      color: s === size.value ? "#fff" : "var(--el-text-color-primary)",
    }
  }
})
// 定义其他的事件处理逻辑

// 暴露需要给模板使用的数据
defineExpose({ size, dynamicColumns })
</script>

<style lang="scss" scoped>
.icon-class {
  width: 16px;
  height: 16px;
  margin-right: 8px;
  cursor: pointer;
  outline: none;
  &:hover {
    color: #409eff;
  }
}

</style>
