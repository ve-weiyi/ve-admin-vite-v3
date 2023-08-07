<template>
  <div>
    <div class="clearfix sticky-button">
      <el-input v-model="filterText" class="filter" placeholder="筛选" />
    </div>
    <div class="tree-content">
      <el-tree
        ref="menuTreeRef"
        :data="menuTreeData"
        :default-checked-keys="defaultCheckIds"
        :props="menuDefaultProps"
        default-expand-all
        highlight-current
        node-key="id"
        show-checkbox
        :filter-node-method="filterNode"
        @check="nodeChange"
      >
        <template #default="{ node, data }">
          <span class="custom-tree-node">
            <span>{{ values.name }}</span>
          </span>
        </template>
      </el-tree>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, nextTick, ref, unref, watch } from "vue"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox, ElTree } from "element-plus"
import { findMenuListDetailsApi } from "@/api/menu"

// 父组件向子组件传输的数据
const props = defineProps({
  row: {
    type: Array,
    required: false,
    default: function () {
      return []
    },
  },
})

// 子组件向父组件通讯
const emit = defineEmits(["changeRow"])

const filterText = ref("")
const menuTreeRef = ref<InstanceType<typeof ElTree>>()
const menuTreeData = ref([])
const defaultCheckIds = ref([])
const menuDefaultProps = ref({
  children: "children",
  label: function (data) {
    return data.name
  },
})

const getTableData = () => {
  defaultCheckIds.value = props.row
  findMenuListDetailsApi({}).then((res) => {
    menuTreeData.value = res.data.list
  })
}
getTableData()

const needConfirm = ref(false)
const nodeChange = () => {
  emit("changeRow", "menuTreeRef", menuTreeRef.value.getCheckedKeys())
  needConfirm.value = true
}

// 暴露给外层使用的切换拦截统一方法
const enterAndNext = () => {
  // relation()
}
// 关联树 确认方法

defineExpose({ enterAndNext, needConfirm })

const filterNode = (value, data) => {
  if (!data) return true
  return data.name.includes(value)
}

watch(filterText, (val) => {
  menuTreeRef.value.filter(val)
})

defineComponent({
  name: "Menus",
})
</script>

<style lang="scss" scoped>
.clearfix:after {
  content: "";
  display: block;
  height: 0;
  visibility: hidden;
  clear: both;
}
.sticky-button {
  position: sticky;
  top: 2px;
  z-index: 2;
  background-color: #fff;
}
.filter {
  width: 60%;
}

.custom-tree-node {
  span + span {
    margin-left: 12px;
  }
}

.tree-content {
  margin-top: 10px;
  height: calc(100vh - 148px);
  overflow: auto;
}

.fl-right {
  float: right;
}
</style>
