<template>
    <div>
        <!--        <h1>Paper detail</h1>-->
        <h2>{{paperInfo.title}} </h2>
        <h5>Published at {{paperInfo.venue}}, {{paperInfo.year}}</h5>
        <small>(paper_id: {{paperInfo.paperId}})</small>
        <div>
            <a target="blank" :href="paperInfo.url">{{paperInfo.url}}</a>
        </div>

        <div class="detail">
            <h3>Authors</h3>
            <ul>
                <li v-for="i in paperInfo['authors']" :key="i['authorId']">
                    <a :href="i.url" target="_blank">{{i.name}}</a>
                </li>
            </ul>
        </div>
        <div class="detail">
            <h3>Abstract</h3>
            {{paperInfo.abstract}}
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


            <div v-if="paperInfo.citations.length === 0">
                <div class="alert alert-secondary" role="alert">
                    No citations found.
                </div>
            </div>
            <div v-else-if="commonReference.length">
                <CommonReference :dataset="commonReference"></CommonReference>
            </div>
            <div v-else-if="paperInfo.citations.length >= paper_query_limits">
                <div class="alert alert-danger" role="alert">
                    This paper has too many citations({{paperInfo.citations.length}}) to get common references
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
            <!--            <PaperCards :cards="paperInfo.citations"></PaperCards>-->
            <ReferenceTable :dataset="paperInfo.citations"></ReferenceTable>
        </div>
        <div class="detail">
            <h3>References <small>(Click cell to open semantic scholar url)</small></h3>
            <ReferenceTable :dataset="paperInfo.references"></ReferenceTable>
            <!--            <PaperCards :cards="paperInfo.references"></PaperCards>-->
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
      if (this.paperInfo.citations.length < this.paper_query_limits && this.paperInfo.citations.length >= 1) {
        await this.getCommonReference()
      }
      this.addHistory()
    },
    methods: {
      addHistory() {
        const history = window.localStorage.getItem('history') ? JSON.parse(window.localStorage.getItem('history')) : []
        const item = {
          'paperId': this.paperId,
          'title': this.paperInfo.title,
          'venue': this.paperInfo.venue,
          'year': this.paperInfo.year,
        }
        const idx = history.findIndex(function (i) {
          return i.paperId === item.paperId
        })
        if (idx > -1) history.splice(idx, 1)
        history.push(item)
        window.localStorage.setItem('history', JSON.stringify(history.reverse()))
      },
      getPaperId(x) {
        if (x.length === 40) {
          return x
        } else if (x.match(/\d{4}[.]\d+/g).length) {
          return 'arXiv:' + x.match(/\d{4}[.]\d+/g)[0]
        } else if (x.match(/\b(10[.][0-9]{4,}(?:[.][0-9]+)*\/(?:(?!["&'<>])\S)+)\b/g).length) {
          return x.match(/\b(10[.][0-9]{4,}(?:[.][0-9]+)*\/(?:(?!["&'<>])\S)+)\b/g)[0]
        } else if (x.includes('semanticscholar.org')) {
          const splits = x.split('/')
          return splits[splits.length - 1].slice(0, 40)
        }
      },
      async getMetaData() {
        // TODO: API 대신 Semantic Scholar API로 대체하기
        this.paperId = this.getPaperId(this.paper_url)
        const r = await this.$axios.get(`https://api.semanticscholar.org/v1/paper/${this.paperId}`)
        // const r = await this.$axios.get(`/papers/?query=${decodeURIComponent(this.paper_url)}`)
        this.paperInfo = r.data
      },
      async getCommonReference() {
        try {
          const r = await this.$axios.get(`/papers/common-references/?query=${this.paperInfo['paperId']}`)
          this.commonReference = r.data
        } catch (e) {
          console.log("Timeout?")
          console.error(e)
          this.isQueryFailed = true
        }
      },
    },
    metaInfo() {
      return {
        'title': this.paperInfo.title,
      }
    },
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