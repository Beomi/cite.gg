<template>
    <div>
        <!--        <h1>Paper detail</h1>-->
        <h2>{{paperInfo.metadata.title}} </h2>
        <small>(uri: {{paperInfo.uri}})</small>
        <div>
            <a target="blank" :href="paperInfo.metadata.url">{{paperInfo.metadata.url}}</a>
            <p>
                last update at: {{paperInfo.updated_at}}
            </p>
        </div>
        <!--        <div>-->
        <!--            <router-link to="/common-reference/" class="btn btn-primary btn-sm">-->
        <!--                🔍 Find Common Reference!-->
        <!--            </router-link>-->
        <!--        </div>-->

        <div class="detail">
            <h3>Abstract</h3>
            {{paperInfo.metadata.abstract}}
        </div>

        <div class="detail">
            <h3>🔍 Common Reference</h3>
            <CommonReference :dataset="paperInfo.counter"></CommonReference>
        </div>

        <div class="detail">
            <h3>Citations</h3>
            <PaperCards :cards="paperInfo.metadata.citations"></PaperCards>
        </div>
        <div class="detail">
            <h3>References</h3>
            <PaperCards :cards="paperInfo.metadata.references"></PaperCards>

        </div>
    </div>
</template>

<script>
  import PaperCards from "./PaperCards";
  import CommonReference from "./CommonReference";

  export default {
    name: "Paper",
    components: {CommonReference, PaperCards},
    computed: {
      paper_url() {
        return this.$route.query['q']
      }
    },
    data() {
      return {
        paperInfo: {},
      }
    },
    mounted() {
      this.getMetaData()
    },
    methods: {
      async getMetaData() {
        const r = await this.$axios.get(`/papers/info/?query=${decodeURIComponent(this.paper_url)}`)
        this.paperInfo = r.data
      }
    }
  }
</script>

<style scoped>
    .detail {
        padding-top: 20px;
    }
</style>