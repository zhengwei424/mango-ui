<template>
  <div class="container">
    <!-- 导航菜单栏 -->
    <NavBar />
    <div class="main">
      <!-- 头部区域 -->
      <HeadBar />
      <!-- 主内容区域 -->
      <MainContent />
    </div>
  </div>
</template>

<script setup lang="ts">
import HeadBar from "./HeadBar.vue";
import NavBar from "./NavBar.vue";
import MainContent from "./MainContent.vue";
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: nowrap;
  height: 100%;
  width: 100%;
}

.main {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
  height: 100%;
  width: 100%;
}
</style>
