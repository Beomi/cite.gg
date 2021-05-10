<template>
    <div>
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container-fluid container">
                <router-link class="navbar-brand" to="/">Cite.GG</router-link>
                <div class="d-flex">
                    <a href="https://github.com/beomi/find-my-reference" target="_blank">
                        <button class="btn btn-info">
                            Github <i class="bi-github"></i>
                        </button>
                    </a>
                </div>
            </div>
        </nav>
    </div>
</template>

<script>
  export default {
    name: "Header",
  };
</script>

<style scoped>
    i {
        margin-left: 5px;
    }

    a {
        color: inherit;
        text-decoration: none;
    }
</style>
