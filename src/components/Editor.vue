<template>
  <div
    ref="editorRef"
    class="edit-container"
    v-html="innerText"
    :placeholder="placeholder"
    :contenteditable="disable"
    @focus="onFocus"
    @blur="onBlur"
    @input="onInput"
  />
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue"

const props = defineProps({
  value: {
    type: String,
    default: "",
  },
  disable: {
    type: Boolean,
    default: true,
  },
  placeholder: {
    type: String,
    default: "",
  },
})

// 父组件向子组件传输的事件
const emit = defineEmits([
  // 定义事件
  "input",
  "focus",
  "blur",
])

const editorRef = ref(null)
const innerText = ref(props.value)
const isLocked = ref(false)
let range = null

watchEffect(() => {
  if (!isLocked.value) {
    innerText.value = props.value
  }
})

function clear() {
  editorRef.value.innerHTML = ""
  emit("input", editorRef.value.innerHTML)
}

function onInput() {
  emit("input", editorRef.value.innerHTML)
}

function onFocus() {
  emit("focus", editorRef.value.innerHTML)
  isLocked.value = true
}

function onBlur() {
  // 记录光标
  if (window.getSelection) {
    const selection = window.getSelection()
    range = selection.getRangeAt(0)
  }
  emit("blur", editorRef.value.innerHTML)
  isLocked.value = false
}

function addText(value) {
  // 还原光标
  if (window.getSelection) {
    const selection = window.getSelection()
    selection.removeAllRanges()
    // 为空初始化光标
    if (range === null) {
      editorRef.value.focus()
      range = selection.getRangeAt(0)
    }
    // 删除选中内容
    range.deleteContents()
    // 添加内容
    range.insertNode(range.createContextualFragment(value))
    range.collapse(false)
    selection.addRange(range)
    emit("input", editorRef.value.innerHTML)
  }
}

defineExpose({
  addText,
})
</script>

<style scoped>
.edit-container {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  background: #f0f1f4;
  font-size: 14px;
  line-height: 1.5;
  padding: 6px 12px;
  box-sizing: border-box;
  overflow: auto;
  word-break: break-all;
  outline: none;
  user-select: text;
  white-space: pre-wrap;
  text-align: left;
  -webkit-user-modify: read-write-plaintext-only;
}
.edit-container:empty::before {
  cursor: text;
  content: attr(placeholder);
  color: #999;
}
</style>
