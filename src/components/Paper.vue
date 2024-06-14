<template>
  <div>
    <!--        <h1>Paper detail</h1>-->
    <h2>{{ paperInfo.title }}</h2>
    <h5>Published at {{ paperInfo.venue }}, {{ paperInfo.year }}</h5>
    <small>(paper_id: {{ paperInfo.paperId }})</small>
    <div>
      <a target="blank" :href="paperInfo.url">{{ paperInfo.url }}</a>
    </div>

    <div class="detail">
      <h3>Authors</h3>
      <ul>
        <li v-for="i in paperInfo['authors']" :key="i['authorId']">
          <a :href="i.url" target="_blank">{{ i.name }}</a>
        </li>
      </ul>
    </div>
    <div class="detail">
      <h3>Abstract</h3>
      {{ paperInfo.abstract }}
    </div>
    <div class="detail">
      <div class="form-floating">
        <div><strong>Query Limits</strong></div>
        <div class="">
          <input
            value="10"
            v-model="paper_query_limits"
            class="form-check-input"
            type="radio"
            name="flexRadioDefault"
            id="flexRadioDefault1"
          />
          <label class="form-check-label" for="flexRadioDefault1">
            10 (default: takes ~10s)
          </label>
          <input
            value="20"
            v-model="paper_query_limits"
            class="form-check-input"
            type="radio"
            name="flexRadioDefault"
            id="flexRadioDefault2"
          />
          <label class="form-check-label" for="flexRadioDefault2">
            20
          </label>
          <input
            value="30"
            v-model="paper_query_limits"
            class="form-check-input"
            type="radio"
            name="flexRadioDefault"
            id="flexRadioDefault3"
          />
          <label class="form-check-label" for="flexRadioDefault3">
            30
          </label>
        </div>
      </div>

      <h3>
        🔍 Common Reference
        <small>(Click cell to open semantic scholar url)</small>
      </h3>

      <div v-if="paperInfo.citations.length === 0">
        <div class="alert alert-secondary" role="alert">
          No citations found.
        </div>
      </div>
      <div v-else-if="commonReference.length">
        <CommonReference :dataset="commonReference"></CommonReference>
      </div>
      <div v-else-if="paperInfo.citations.length >= 1000">
        <div class="alert alert-danger" role="alert">
          This paper has too many citations({{ paperInfo.citations.length }}) to
          get common references :( <br />
          Plz try with less-cited(~1000) paper to get common refs.
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
      <h3>
        Citations <small>(Click cell to open semantic scholar url)</small>
      </h3>
      <!--            <PaperCards :cards="paperInfo.citations"></PaperCards>-->
      <ReferenceTable :dataset="paperInfo.citations"></ReferenceTable>
    </div>
    <div class="detail">
      <h3>
        References <small>(Click cell to open semantic scholar url)</small>
      </h3>
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
  components: { ReferenceTable, CommonReference },
  computed: {
    paper_url() {
      return this.$route.query["q"];
    },
  },
  watch: {
    paper_query_limits() {
      window.localStorage.setItem(
        "paper_query_limits",
        this.paper_query_limits
      );
    },
  },
  data() {
    return {
      paper_query_limits: Math.min(
        // set default value as 10
        parseInt(window.localStorage.getItem("paper_query_limits")) || 10,
        // set max value as 30
        30
      ),
      paperInfo: {},
      commonReference: [],
      isQueryFailed: false,
    };
  },
  async mounted() {
    await this.getMetaData();
    if (
      this.paperInfo.citations.length < 1000 &&
      this.paperInfo.citations.length >= 1
    ) {
      await this.getCommonReference();
    }
    this.addHistory();
  },
  methods: {
    addHistory() {
      const history = window.localStorage.getItem("history")
        ? JSON.parse(window.localStorage.getItem("history"))
        : [];
      const item = {
        paperId: this.paperId,
        title: this.paperInfo.title,
        venue: this.paperInfo.venue,
        year: this.paperInfo.year,
      };
      const idx = history.findIndex(function(i) {
        return i.paperId === item.paperId;
      });
      if (idx > -1) history.splice(idx, 1);
      history.push(item);
      window.localStorage.setItem("history", JSON.stringify(history.reverse()));
    },
    getPaperId(x) {
      if (x.length === 40) {
        return x;
      } else if (x.match(/\d{4}[.]\d+/g).length) {
        return "arXiv:" + x.match(/\d{4}[.]\d+/g)[0];
      } else if (
        x.match(/\b(10[.][0-9]{4,}(?:[.][0-9]+)*\/(?:(?!["&'<>])\S)+)\b/g)
          .length
      ) {
        return x.match(
          /\b(10[.][0-9]{4,}(?:[.][0-9]+)*\/(?:(?!["&'<>])\S)+)\b/g
        )[0];
      } else if (x.includes("semanticscholar.org")) {
        const splits = x.split("/");
        return splits[splits.length - 1].slice(0, 40);
      }
    },
    async getMetaData() {
      // TODO: API 대신 Semantic Scholar API로 대체하기
      this.paperId = this.getPaperId(this.paper_url);
      const r = await this.$axios.get(
        `https://api.semanticscholar.org/v1/paper/${this.paperId}`
      );
      // const r = await this.$axios.get(`/papers/?query=${decodeURIComponent(this.paper_url)}`)
      this.paperInfo = r.data;
    },
    async getCommonReference() {
      try {
        const citationIds = this.paperInfo.citations
          .slice(0, Math.min(this.paperInfo.citations.length, 30)) // limit to 30
          .map((citation) => citation.paperId);
        const commonReferences = {};
        const allReferences = [];

        for (const id of citationIds) {
          // Throttle requests to avoid hitting API limits
          // await new Promise((resolve) => setTimeout(resolve, 100));

          const paperData = await this.$axios.get(
            `https://api.semanticscholar.org/v1/paper/${id}`
          );
          const references = paperData.data.references;
          allReferences.push(...references);

          // Count each reference's occurrence
          references.forEach((reference) => {
            const refId = reference.paperId;
            if (commonReferences[refId]) {
              commonReferences[refId]++;
            } else {
              commonReferences[refId] = 1;
            }
          });
        }

        // Convert to an array and sort by count in descending order
        const sortedReferences = Object.entries(commonReferences)
          .map(([id, count]) => ({ id, count }))
          .sort((a, b) => b.count - a.count);

        // FIXME: 여기는 호출할 필요가 없는디?
        // Find reference details from allReferences
        const referenceDetails = sortedReferences.map((ref) => {
          const reference = allReferences.find((r) => r.paperId === ref.id);
          return {
            ...reference,
            count: ref.count,
          };
        });

        // Update the commonReference property

        this.commonReference = referenceDetails;
      } catch (e) {
        console.error("Error fetching common references:", e);
        this.isQueryFailed = true;
      }
    },
  },
  metaInfo() {
    return {
      title: this.paperInfo.title,
    };
  },
};
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
