<template>
  <div class="container">
    <!-- 导航菜单栏 -->
    <NavBar/>
    <!-- 头部区域 -->
    <HeadBar/>
    <!-- 主内容区域 -->
    <MainContent/>
  </div>
</template>

<script setup lang="ts">
import HeadBar from "./HeadBar.vue";
import NavBar from "./NavBar.vue";
import MainContent from "./MainContent.vue";
</script>

<style scoped lang="scss">
.container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

</style>
