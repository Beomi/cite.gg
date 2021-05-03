<template>
    <div>
        <Header></Header>
        <div class="container" id="main">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
  import Header from "./components/Header";

  export default {
    name: "App",
    components: {Header},
  };
</script>

<style scoped>
    #main {
        margin-top: 50px;
    }
</style>
