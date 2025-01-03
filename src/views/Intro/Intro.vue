<template>
  <div class="page-container" style="width: 99%; margin-top: 15px">
    <el-carousel :interval="3000" type="card" height="450px" class="carousel">
      <el-carousel-item class="carousel-item-intro">
        <h2>项目介绍</h2>
        <ul>
          <li>
            基于 Spring Boot、Spring Cloud、Vue、Element 的 Java EE 快速开发平台
          </li>
          <li>
            xxxxxxxxxxxxxxxx
          </li>
          <li>
            xxxxxxxxxxxxxxxx
          </li>
        </ul>
        <div>
          <img
            src="@/assets/logo.png"
            style="width: 120px; height: 120px; padding-top: 15px"
            alt=""
          />
        </div>
      </el-carousel-item>
      <el-carousel-item class="carousel-item-func">
        <h2>功能计划</h2>
        <ul>
          <li>✔ 系统登录：系统用户登录，系统登录认证（token方式）</li>
          <li>✔ 用户管理：新增用户，编辑用户，删除用户，查询用户</li>
          <li>✔ 机构管理：新增机构，编辑机构，删除机构</li>
          <li>✔ 角色管理：新增角色，编辑角色，删除角色，查询角色</li>
          <li>✔ 菜单管理：新增菜单，编辑菜单，删除菜单</li>
          <li>✔ 系统日志：记录用户操作日志，查看系统执行日志记录</li>
          <li>...</li>
        </ul>
      </el-carousel-item>
      <el-carousel-item class="carousel-item-env">
        <h2>开发环境</h2>
        <ul>
          <li>IDE : IntelliJ IDEA 2024.1.7 JDK: JDK 1.8.0_202</li>
          <li>Maven : Maven 3.9.9 MySQL: MySQL 8.0.26</li>
          <li>IDE : WebStorm 2024.1.7  vite: 6.0.1</li>
          <li>NODE: Node v20.18.1 NPM: 10.9.0</li>
        </ul>
        <h2>技术选型</h2>
        <ul>
          <li>核心框架：Spring Boot 2.1.1.RELEASE。 服务治理：Spring Cloud 2.1.1.RELEASE</li>
          <li>视图框架：Spring MVC 5.1.3 持久层框架：MyBatis 3.4.6</li>
          <li>数据库连接池：Druid 1.x 安全框架：Shiro 1.4.x</li>
          <li>前端框架：Vue3 页面组件：Element plus</li>
          <li>状态管理：pinia 后台交互：axios</li>
          <li>...</li>
        </ul>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup lang="ts"></script>

<style>
.carousel {
  padding-left: 20px;
  padding-right: 20px;
  margin-right: 20px;
}
.carousel h2 {
  color: #475669;
  font-size: 22px;
  opacity: 1.75;
  line-height: 100px;
  margin: 0;
}
.carousel ul {
  color: #475669;
  font-size: 15px;
  opacity: 1.75;
  line-height: 40px;
  margin: 0;
}
.carousel-item-intro h2 {
  color: #ffffff;
  font-size: 22px;
  opacity: 1.75;
  line-height: 80px;
  margin: 0;
}
.carousel-item-intro ul {
  color: #ffffff;
  font-size: 15px;
  opacity: 1.75;
  line-height: 65px;
  padding: 5px;
  margin: 0;
}
.carousel-item-func h2 {
  color: #3f393b;
  font-size: 22px;
  opacity: 1.75;
  line-height: 50px;
  margin: 0;
}
.carousel-item-func ul {
  color: #3f393b;
  font-size: 15px;
  opacity: 1.75;
  line-height: 30px;
  text-align: left;
  padding-left: 90px;
  margin: 0;
}
.carousel-item-env h2 {
  color: #475669;
  font-size: 22px;
  opacity: 1.75;
  line-height: 50px;
  margin: 0;
}
.carousel-item-env ul {
  color: #475669;
  font-size: 15px;
  opacity: 1.75;
  line-height: 35px;
  text-align: left;
  padding-left: 110px;
  margin: 0;
}
.carousel-item-intro {
  background-color: #19aaaf73;
  -webkit-border-radius: 25px;
  border-radius: 25px;
  -moz-border-radius: 15px;
  background-clip: padding-box;
  box-shadow: 0 0 25px #a3b3b965;
}
.carousel-item-func {
  background-color: #19aaaf73;
  -webkit-border-radius: 25px;
  border-radius: 25px;
  -moz-border-radius: 15px;
  background-clip: padding-box;
  box-shadow: 0 0 25px #a3b3b965;
}
.carousel-item-env {
  background-color: #19aaaf73;
  -webkit-border-radius: 25px;
  border-radius: 25px;
  -moz-border-radius: 15px;
  background-clip: padding-box;
  box-shadow: 0 0 25px #a3b3b965;
}
.carousel-item-intro {
  background-color: #b95e5e;
}
.carousel-item-func {
  background-color: #52c578;
}
.carousel-item-env {
  background-color: #41a7b9;
}
</style>
