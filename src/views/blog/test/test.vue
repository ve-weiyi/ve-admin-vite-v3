<template>
  <div>
    <el-col :xs="25" :sm="8" :md="8" :lg="8">
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      <el-checkbox-group v-model="checkedLists" @change="handleCheckedListChange">
        <draggable
           item-key="key"
        >
          <transition-group>
            <el-checkbox v-for="item in listData" :label="item.sign" :key="item.sign" class="drag-item" border>
              <span>{{ item.name }}</span>
            </el-checkbox>
          </transition-group>
        </draggable>
      </el-checkbox-group>
    </el-col>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
 import draggable from 'vuedraggable'

const listData = ref([
  { name: "1号", sign: 111 },
  { name: "2号", sign: 222 },
  { name: "3号", sign: 333 },
  { name: "4号", sign: 444 },
])
const checkedLists = ref([])
const checkAll = ref(false)
const isIndeterminate = ref(false)

function handleCheckAllChange(val) {
  checkedLists.value = val
    ? listData.value.map((item) => {
        return item.sign
      })
    : []
  isIndeterminate.value = false
}

function handleCheckedListChange(value) {
  const checkedCount = value.length
  checkAll.value = checkedCount === listData.value.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < listData.value.length
}
</script>

<style lang="scss" scoped>
.chosen {
  border: solid 2px #3089dc !important;
}
</style>
