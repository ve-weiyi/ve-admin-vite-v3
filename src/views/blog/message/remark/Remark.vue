<template>
  <div>
    <TablePage
      :get-column-fields="getColumnFields"
      :get-search-fields="getSearchFields"
      :get-form-fields="getFormFields"
      :handle-api="handleApi"
      :show-add-button="false"
      :show-edit-button="false"
      :default-order="defaultOrder"
      :tab-list="tabList"
      model-name="留言管理"
    >
      <template #operation="{ selectionIds, checkedColumnFields }">
        <el-button
          type="success"
          size="default"
          icon="CircleCheck"
          v-if="checkedColumnFields.filter((item) => item.type === 'selection').length > 0"
          :disabled="selectionIds.length === 0"
          @click="1"
        >
          批量通过
        </el-button>
      </template>
    </TablePage>
  </div>
</template>

<script setup lang="ts">
import TablePage from "@/components/TablePage/TablePage.vue"
import { useTableHook } from "./hook"
import { onMounted } from "vue"

const defaultOrder = { id: "desc" }
const tabList = [
  {
    key: "is_review",
    label: "全部",
    count: null,
  },
  {
    key: "is_review",
    label: "正常",
    count: 1,
  },
  {
    key: "is_review",
    label: "审核中",
    count: 0,
  },
]

const { getSearchFields, getColumnFields, getFormFields, handleApi } = useTableHook()

onMounted(() => {})
</script>

<style lang="scss" scoped></style>
