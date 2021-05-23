<template>
    <div class="hello">
        <div>
            <small class="alert-light">
                Search with arXiv URL or DOI urls
                (example: https://arxiv.org/abs/2005.12503)
            </small>
            <autocomplete
                    :search="search"
                    :autoSelect="true"
                    placeholder="Find your Reference! 🌟"
                    aria-label="Find your Reference! 🌟"
                    @submit="onSubmit"
            ></autocomplete>
        </div>
        <div class="history">
            <button class="btn btn-sm btn-danger right" @click="clearHistory">Clear History <i
                    class="bi bi-trash-fill"></i></button>
            <h4>History <small>(on your browser!)</small></h4>
            <div class="card" v-if="history.length">
                <ul class="list-group list-group-flush" :key="i.paperId" v-for="i in history">
                    <router-link :to="`/paper?q=${i.paperId}`">
                        <li class="list-group-item">
                            <strong>{{i.title}}</strong>
                            @ {{i.venue}} <small>({{i.year}})</small>
                        </li>
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
    metaInfo() {
      return {
        'title': 'Cite.GG',
      }
    },
    methods: {
      clearHistory() {
        this.history = []
        window.localStorage.setItem('history', '[]')
      },
      search(input) {
        // const r = this.$axios.get('/papers/autocomplete', {
        //   params: {query: input}
        // })
        // console.log(r)
        return [input];
      },
      async onSubmit(result) {
        // await this.history.push(result)
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
