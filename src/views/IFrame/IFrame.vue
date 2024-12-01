<template>
  <div class="iframe-container">
    <iframe :src="src" class="frame"  :loading="onloaded()"></iframe>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref, watchEffect} from "vue";

let src = ref("")
let loading = reactive<any>(null)

function resetSrc(url: string) {
  src.value = url
  load()
}

function load() {

}

function onloaded() {
  if(loading) {
    loading.close()
  }
}

watchEffect(()=>{

})

onMounted(() => {
  resetSrc(src.value)
})


// export default {
//   data() {
//     return {
//       src: "",
//       loading: null
//     }
//   },
//   methods: {
//     // 获取路径
//     resetSrc: function(url) {
//       src.value = url
//       this.load()
//     },
//     load: function() {
//       loading = this.$loading({
//         lock: true,
//         text: "loading...",
//         spinner: "el-icon-loading",
//         background: "rgba(0, 0, 0, 0.5)",
//         // fullscreen: false,
//         target: document.querySelector("#main-container ")
//       })
//     },
//     onloaded: function() {
//       if(this.loading) {
//         this.loading.close()
//       }
//     }
//   },
//   mounted() {
//     this.resetSrc(this.$store.state.iframe.iframeUrl);
//   },
//   watch: {
//     $route: {
//       handler: function(val, oldVal) {
//         // 如果是跳转到嵌套页面，切换iframe的url
//         this.resetSrc(this.$store.state.iframe.iframeUrl);
//       }
//     }
//   }
// }
</script>

<style lang="scss">
.iframe-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;;
  bottom: 0;
  .frame {
    width: 100%;
    height: 100%;
  }
}
</style>
