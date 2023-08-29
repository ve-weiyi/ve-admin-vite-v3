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
      model-name="用户"
    />
  </div>
</template>

<script setup lang="ts">
import TablePage from "@/components/TablePage/TablePage.vue"
import { useTableHook } from "./hook"
import { onMounted } from "vue"

const defaultOrder = { id: "desc" }

const {
  getSearchFields,
  getColumnFields,
  getFormFields,
  handleApi,
} = useTableHook()

onMounted(() => {

})
</script>

<style lang="scss" scoped>

</style>
