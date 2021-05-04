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
            <h3>🔍 Common Reference <small>(Click cell to open semantic scholar url)</small></h3>
            <div v-if="paperInfo.counter.length">
                <CommonReference :dataset="paperInfo.counter"></CommonReference>
            </div>
            <div v-else>
                <div class="alert alert-danger" role="alert">
                    Common Reference More than > 200, Can't show the data :(
                </div>
            </div>
        </div>

        <div class="detail">
            <h3>Citations <small>(Click cell to open semantic scholar url)</small></h3>
            <!--            <PaperCards :cards="paperInfo.metadata.citations"></PaperCards>-->
            <ReferenceTable :dataset="paperInfo.metadata.citations"></ReferenceTable>
        </div>
        <div class="detail">
            <h3>References <small>(Click cell to open semantic scholar url)</small></h3>
            <ReferenceTable :dataset="paperInfo.metadata.references"></ReferenceTable>
            <!--            <PaperCards :cards="paperInfo.metadata.references"></PaperCards>-->
        </div>
    </div>
</template>

<script>
  // import PaperCards from "./PaperCards";
  import CommonReference from "./CommonReference";
  import ReferenceTable from "./ReferenceTable";

  export default {
    name: "Paper",
    components: {ReferenceTable, CommonReference},
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

    small {
        font-weight: 200;
        font-size: 1rem;
    }
</style>