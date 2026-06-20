<script setup>
import { onMounted, ref } from 'vue'

const message = ref('正在连接 Java 后端...')
const status = ref('checking')

onMounted(async () => {
  try {
    const response = await fetch('http://localhost:8080/api/hello')
    const data = await response.json()
    message.value = data.message
    status.value = 'ok'
  } catch (error) {
    message.value = '前端已打开。启动 Java 后端后，这里会显示接口返回的数据。'
    status.value = 'offline'
  }
})
</script>

<template>
  <main class="page-shell">
    <section class="hero">
      <p class="eyebrow">Vue 3 + Java 21</p>
      <h1>物业项目 Demo</h1>
      <p class="intro">
        这是一个前后端分离的最小演示页面，前端使用 Vue 3，后端使用 Java 21 和 Spring Boot 3。
      </p>

      <div class="status-panel">
        <span class="status-dot" :class="status"></span>
        <span>{{ message }}</span>
      </div>
    </section>
  </main>
</template>

