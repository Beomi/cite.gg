<template>
    <div>
        <!--        <h1>Paper detail</h1>-->
        <h2>{{paperInfo.metadata.title}} </h2>
        <small>(paper_id: {{paperInfo.paper_id}})</small>
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
            <div class="form-floating">
                <div><strong>Query Limits</strong></div>
                <div class="">
                    <input value="500" v-model="paper_query_limits"
                           class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1">
                    <label class="form-check-label" for="flexRadioDefault1">
                        500 (default)
                    </label>
                    <input value="1000" v-model="paper_query_limits"
                           class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2">
                    <label class="form-check-label" for="flexRadioDefault2">
                        1000
                    </label>
                    <input value="2000" v-model="paper_query_limits"
                           class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault3">
                    <label class="form-check-label" for="flexRadioDefault3">
                        2000
                    </label>
                </div>
            </div>

            <h3>🔍 Common Reference <small>(Click cell to open semantic scholar url)</small></h3>


            <div v-if="paperInfo.metadata.citations.length === 0">
                <div class="alert alert-secondary" role="alert">
                    No citations found.
                </div>
            </div>
            <div v-else-if="commonReference.length">
                <CommonReference :dataset="commonReference"></CommonReference>
            </div>
            <div v-else-if="paperInfo.metadata.citations.length >= paper_query_limits">
                <div class="alert alert-danger" role="alert">
                    This paper has too many citations({{paperInfo.metadata.citations.length}}) to get common references
                    :( <br>
                    Plz try with less-cited(~{{paper_query_limits}}) paper to get common refs.
                </div>
            </div>
            <div v-else-if="isQueryFailed">
                <div class="alert alert-warning" role="alert">
                    Timeout occured! (Maybe too much citations..)
                </div>
            </div>
            <div v-else>
                <div class="alert alert-info" role="alert">
                    Please wait to get Common Reference data! (it will takes some time...)
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
    watch: {
      paper_query_limits() {
        window.localStorage.setItem('paper_query_limits', this.paper_query_limits)
      }
    },
    data() {
      return {
        paper_query_limits: window.localStorage.getItem('paper_query_limits') || 500,
        paperInfo: {},
        commonReference: [],
        isQueryFailed: false,
      }
    },
    async mounted() {
      await this.getMetaData()
      if (this.paperInfo.metadata.citations.length < this.paper_query_limits && this.paperInfo.metadata.citations.length >= 1) {
        await this.getCommonReference()
      }
    },
    methods: {
      async getMetaData() {
        const r = await this.$axios.get(`/papers/?query=${decodeURIComponent(this.paper_url)}`)
        this.paperInfo = r.data
      },
      async getCommonReference() {
        try {
          const r = await this.$axios.get(`/papers/common-references/?query=${this.paperInfo.metadata['paperId']}`)
          this.commonReference = r.data
        } catch (e) {
          console.log("Timeout?")
          console.error(e)
          this.isQueryFailed = true
        }
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

    .form-floating {
        float: right;
    }

    .form-check-label {
        margin: 0 5px;
    }
</style>