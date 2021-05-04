<template>
    <div class="hello">
        <autocomplete
                :search="search"
                :autoSelect="true"
                placeholder="Find your Reference! 🌟"
                aria-label="Find your Reference! 🌟"
                @submit="onSubmit"
        ></autocomplete>
        <div class="history">
            <button class="btn btn-sm btn-danger right">Clear History <i class="bi bi-trash-fill"></i></button>
            <h4>History <small>(on your browser!)</small></h4>
            <div class="card" v-if="history.length">
                <ul class="list-group list-group-flush" :key="i" v-for="i in history">
                    <router-link :to="`/paper?q=${i}`">
                        <li class="list-group-item">{{i}}</li>
                    </router-link>
                </ul>
            </div>
            <div v-else class="alert alert-light" role="alert">
                No history yet 🤗
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: "HelloWorld",
    data() {
      return {
        history: window.localStorage.getItem('history') ? JSON.parse(window.localStorage.getItem('history')) : [],
      }
    },
    watch: {
      history() {
        window.localStorage.setItem('history', JSON.stringify(this.history))
        console.log(history)
      }
    },
    methods: {
      search(input) {
        // const r = this.$axios.get('/papers/autocomplete', {
        //   params: {query: input}
        // })
        // console.log(r)
        return [input];
      },
      async onSubmit(result) {
        await this.history.push(result)
        await this.$router.push({
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

    .history {
        margin-top: 40px;
    }

    .history h4 small {
        font-weight: 200;
        font-size: 1rem;
    }

    button.right {
        position: relative;
        float: right;
    }
</style>
