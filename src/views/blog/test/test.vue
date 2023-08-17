<template>
  <div>
    <TablePage
      :get-column-fields="getColumnFields"
      :get-search-fields="getSearchFields"
      :get-form-fields="getFormFields"
    />
  </div>
</template>

<script setup lang="ts">
import TablePage from "@/components/TablePage/TablePage.vue"
import { getColumnFields, getSearchFields, getFormFields } from "./hook"

</script>

<style lang="scss" scoped>

</style>
