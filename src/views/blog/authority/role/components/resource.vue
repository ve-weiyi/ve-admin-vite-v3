<template>
  <div>
    <div class="clearfix sticky-button">
      <el-input v-model="filterText" class="filter" placeholder="筛选" />
    </div>
    <div class="tree-content">
      <el-tree
        ref="resourceTreeRef"
        :data="resourceTreeData"
        :default-checked-keys="defaultCheckIds"
        :props="resourceDefaultProps"
        default-expand-all
        highlight-current
        node-key="id"
        show-checkbox
        :filter-node-method="filterNode"
        @check="nodeChange"
      >
        <template #default="{ node, data }">
          <span class="custom-tree-node">
            <span>{{ data.name }} {{ data.path }}</span>
          </span>
        </template>
      </el-tree>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, nextTick, ref, watch } from "vue"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox, ElTree } from "element-plus"
import { findApiListDetailsApi } from "@/api/api"

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
const resourceTreeRef = ref<InstanceType<typeof ElTree>>()
const resourceTreeData = ref([])
const defaultCheckIds = ref([])
const resourceDefaultProps = ref({
  children: "children",
  label: function (data) {
    return data.name
  },
})

const getTableData = () => {
  defaultCheckIds.value = props.row
  findApiListDetailsApi({}).then((res) => {
    resourceTreeData.value = res.data.list
  })
}
getTableData()

const needConfirm = ref(false)
const nodeChange = () => {
  emit("changeRow", "resourceTreeRef", resourceTreeRef.value.getCheckedKeys())
  needConfirm.value = true
}
// 暴露给外层使用的切换拦截统一方法
const enterAndNext = () => {
  // relation()
}
// 关联树 确认方法

defineExpose({ enterAndNext, needConfirm })

const filterNode = (value, data) => {
  if (!value) return true
  return data.name.includes(value)
}

watch(filterText, (val) => {
  resourceTreeRef.value.filter(val)
})

defineComponent({
  name: "Resources",
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
