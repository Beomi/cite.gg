<template>
    <div class="hello">
        <autocomplete
                :search="search"
                :autoSelect="true"
                placeholder="Find your Reference! 🌟"
                aria-label="Find your Reference! 🌟"
                @submit="onSubmit"
        ></autocomplete>
        <!--        <div class="hello2">-->
        <!--            <h4>TODO</h4>-->
        <!--            <ul>-->
        <!--                <li>Add History</li>-->
        <!--            </ul>-->
        <!--        </div>-->
    </div>
</template>

<script>
  export default {
    name: "HelloWorld",
    methods: {
      search(input) {
        // const r = this.$axios.get('/papers/autocomplete', {
        //   params: {query: input}
        // })
        // console.log(r)
        return [input];
      },
      onSubmit(result) {
        this.$router.push({
          path: '/paper',
          query: {
            q: result,
          }
        });
      },
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .hello {
        margin-top: 20px;
    }

    .hello2 {
        margin-top: 200px;
    }
</style>
