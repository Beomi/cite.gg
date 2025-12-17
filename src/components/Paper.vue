<template>
  <div>
    <!-- API Key Error -->
    <div v-if="apiKeyError" class="alert alert-danger" role="alert">
      <h4 class="alert-heading">Invalid API Key</h4>
      <p>Your API key appears to be invalid or has been rejected (403 Forbidden).</p>
      <hr />
      <p class="mb-0">
        Please check your API key in
        <router-link to="/settings">Settings</router-link>
        and try again.
      </p>
    </div>

    <!-- Rate Limit Error -->
    <div v-else-if="rateLimitError" class="alert alert-warning" role="alert">
      <h4 class="alert-heading">Rate Limit Exceeded (429)</h4>
      <p>Too many requests. The Semantic Scholar API has rate limits for unauthenticated requests.</p>
      <hr />
      <p class="mb-0">
        To get higher rate limits, please add your API key in
        <router-link to="/settings">Settings</router-link>.
        You can get a free API key from
        <a href="https://www.semanticscholar.org/product/api" target="_blank">Semantic Scholar API</a>.
      </p>
    </div>

    <!-- Normal content -->
    <template v-else>
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
      <div v-else-if="commonRefProgress.loading">
        <div class="alert alert-info" role="alert">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span>Fetching Common References...</span>
            <span class="badge bg-primary">{{ commonRefProgress.current }} / {{ commonRefProgress.total }}</span>
          </div>
          <div class="progress" style="margin-top: 10px;">
            <div
              class="progress-bar progress-bar-striped progress-bar-animated"
              role="progressbar"
              :style="{ width: (commonRefProgress.total > 0 ? (commonRefProgress.current / commonRefProgress.total) * 100 : 0) + '%' }"
              :aria-valuenow="commonRefProgress.current"
              aria-valuemin="0"
              :aria-valuemax="commonRefProgress.total"
            ></div>
          </div>
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
    </template>
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
    async paper_query_limits() {
      window.localStorage.setItem(
        "paper_query_limits",
        this.paper_query_limits
      );
      // Re-fetch common references with new limit
      if (
        this.paperInfo.citations &&
        this.paperInfo.citations.length < 1000 &&
        this.paperInfo.citations.length >= 1 &&
        !this.commonRefProgress.loading
      ) {
        this.commonReference = [];
        await this.getCommonReference();
        this.addHistory(); // Update cache with new data
      }
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
      apiKeyError: false,
      rateLimitError: false,
      lastRequestTime: 0,
      usedCache: false,
      commonRefProgress: { current: 0, total: 0, loading: false },
    };
  },
  async mounted() {
    await this.getMetaData();
    if (this.apiKeyError || this.rateLimitError) return;

    // Load commonReference from cache or fetch
    let shouldFetchCommonRef = false;
    if (this.usedCache) {
      const cached = this.getHistoryCache(this.paperId);
      if (cached && cached.commonReference && cached.commonReference.length > 0) {
        this.commonReference = cached.commonReference;
      } else {
        // Cache exists but no commonReference, need to fetch
        shouldFetchCommonRef = true;
      }
    } else {
      shouldFetchCommonRef = true;
    }

    if (
      shouldFetchCommonRef &&
      this.paperInfo.citations &&
      this.paperInfo.citations.length < 1000 &&
      this.paperInfo.citations.length >= 1
    ) {
      await this.getCommonReference();
    }

    // Save to history if we fetched new data or updated commonReference
    if (!this.apiKeyError && !this.rateLimitError) {
      if (!this.usedCache || shouldFetchCommonRef) {
        this.addHistory();
      }
    }
  },
  methods: {
    async throttle() {
      const now = Date.now();
      const elapsed = now - this.lastRequestTime;
      const minInterval = 1000; // 1 req/s
      if (elapsed < minInterval) {
        await new Promise(resolve => setTimeout(resolve, minInterval - elapsed));
      }
      this.lastRequestTime = Date.now();
    },
    async rateLimitedGet(url) {
      await this.throttle();
      return this.$axios.get(url);
    },
    async rateLimitedPost(url, data) {
      await this.throttle();
      return this.$axios.post(url, data);
    },
    addHistory() {
      const history = window.localStorage.getItem("history")
        ? JSON.parse(window.localStorage.getItem("history"))
        : [];
      // Store full paper metadata including commonReference
      const item = {
        ...this.paperInfo,
        paperId: this.paperId,
        commonReference: this.commonReference,
      };
      const idx = history.findIndex(function(i) {
        return i.paperId === item.paperId;
      });
      if (idx > -1) history.splice(idx, 1);
      history.push(item);
      // Keep only last 20 items to avoid localStorage size issues
      const trimmedHistory = history.reverse().slice(0, 20);
      window.localStorage.setItem("history", JSON.stringify(trimmedHistory));
    },
    getHistoryCache(paperId) {
      const history = window.localStorage.getItem("history")
        ? JSON.parse(window.localStorage.getItem("history"))
        : [];
      return history.find(item => item.paperId === paperId);
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
      try {
        this.paperId = this.getPaperId(this.paper_url);

        // Check cache first
        const cached = this.getHistoryCache(this.paperId);
        if (cached && cached.citations && cached.references) {
          this.paperInfo = cached;
          this.usedCache = true;
          return;
        }

        const fields = [
          'paperId', 'url', 'title', 'abstract', 'venue', 'year', 'authors',
          'citations.paperId', 'citations.title', 'citations.venue', 'citations.year',
          'references.paperId', 'references.title', 'references.venue', 'references.year',
        ].join(',');
        const r = await this.rateLimitedGet(
          `https://api.semanticscholar.org/graph/v1/paper/${this.paperId}?fields=${fields}`
        );
        this.paperInfo = r.data;

        // Fetch arxivId and doi via batch API for citations and references
        await this.enrichWithBatchData();
      } catch (e) {
        if (e.response && e.response.status === 403) {
          this.apiKeyError = true;
        } else if (e.response && e.response.status === 429) {
          this.rateLimitError = true;
        } else {
          console.error("Error fetching paper metadata:", e);
        }
      }
    },
    async enrichWithBatchData() {
      const citations = this.paperInfo.citations || [];
      const references = this.paperInfo.references || [];
      const allPaperIds = [
        ...citations.map(c => c.paperId),
        ...references.map(r => r.paperId),
      ].filter(id => id); // filter out nulls

      if (allPaperIds.length === 0) return;

      // Batch API supports up to 500 IDs per request
      const batchSize = 500;
      const extraDataMap = {};

      for (let i = 0; i < allPaperIds.length; i += batchSize) {
        const batch = allPaperIds.slice(i, i + batchSize);
        try {
          const batchRes = await this.rateLimitedPost(
            'https://api.semanticscholar.org/graph/v1/paper/batch?fields=paperId,externalIds',
            { ids: batch }
          );
          batchRes.data.forEach(paper => {
            if (paper && paper.paperId) {
              extraDataMap[paper.paperId] = {
                arxivId: paper.externalIds?.ArXiv || null,
                doi: paper.externalIds?.DOI || null,
              };
            }
          });
        } catch (e) {
          if (e.response && e.response.status === 403) {
            this.apiKeyError = true;
            return;
          } else if (e.response && e.response.status === 429) {
            this.rateLimitError = true;
            return;
          }
          console.error("Error fetching batch data:", e);
        }
      }

      // Merge extra data into citations and references
      this.paperInfo.citations = citations.map(c => ({
        ...c,
        ...extraDataMap[c.paperId],
      }));
      this.paperInfo.references = references.map(r => ({
        ...r,
        ...extraDataMap[r.paperId],
      }));
    },
    async getCommonReference() {
      try {
        // Filter out null paperIds and use paper_query_limits
        const citationIds = this.paperInfo.citations
          .slice(0, this.paper_query_limits)
          .map((citation) => citation.paperId)
          .filter((id) => id); // remove null/undefined

        // Initialize progress
        this.commonRefProgress = { current: 0, total: citationIds.length, loading: true };

        const commonReferences = {};
        const allReferences = [];

        for (const id of citationIds) {
          try {
            const fields = [
              'paperId', 'url', 'title', 'venue', 'year',
              'references.paperId', 'references.title', 'references.venue', 'references.year',
            ].join(',');
            const paperData = await this.rateLimitedGet(
              `https://api.semanticscholar.org/graph/v1/paper/${id}?fields=${fields}`
            );
            const references = paperData.data.references || [];
            allReferences.push(...references);

            // Update progress
            this.commonRefProgress.current++;

            // Count each reference's occurrence (skip null paperIds)
            references.forEach((reference) => {
              const refId = reference?.paperId;
              if (!refId) return;
              if (commonReferences[refId]) {
                commonReferences[refId]++;
              } else {
                commonReferences[refId] = 1;
              }
            });
          } catch (innerError) {
            // Update progress even on error
            this.commonRefProgress.current++;
            // Handle individual request errors (403/429)
            if (innerError.response && innerError.response.status === 403) {
              this.apiKeyError = true;
              return;
            } else if (innerError.response && innerError.response.status === 429) {
              this.rateLimitError = true;
              return;
            }
            // Continue with other citations if single request fails
            console.error(`Error fetching references for ${id}:`, innerError);
          }
        }

        // Convert to an array and sort by count in descending order
        const sortedReferences = Object.entries(commonReferences)
          .map(([id, count]) => ({ id, count }))
          .sort((a, b) => b.count - a.count);

        // Find reference details from allReferences (filter out undefined)
        let referenceDetails = sortedReferences
          .map((ref) => {
            const reference = allReferences.find((r) => r.paperId === ref.id);
            if (!reference) return null;
            return {
              ...reference,
              count: ref.count,
            };
          })
          .filter((r) => r !== null);

        // Enrich with arxivId and doi via batch API
        const paperIds = referenceDetails.map(r => r.paperId).filter(id => id);
        if (paperIds.length > 0) {
          const extraDataMap = {};
          const batchSize = 500;
          for (let i = 0; i < paperIds.length; i += batchSize) {
            const batch = paperIds.slice(i, i + batchSize);
            try {
              const batchRes = await this.rateLimitedPost(
                'https://api.semanticscholar.org/graph/v1/paper/batch?fields=paperId,externalIds',
                { ids: batch }
              );
              batchRes.data.forEach(paper => {
                if (paper && paper.paperId) {
                  extraDataMap[paper.paperId] = {
                    arxivId: paper.externalIds?.ArXiv || null,
                    doi: paper.externalIds?.DOI || null,
                  };
                }
              });
            } catch (e) {
              if (e.response && e.response.status === 403) {
                this.apiKeyError = true;
                return;
              } else if (e.response && e.response.status === 429) {
                this.rateLimitError = true;
                return;
              }
              console.error("Error fetching batch data for common references:", e);
            }
          }
          referenceDetails = referenceDetails.map(r => ({
            ...r,
            ...extraDataMap[r.paperId],
          }));
        }

        // Update the commonReference property
        this.commonReference = referenceDetails;
      } catch (e) {
        if (e.response && e.response.status === 403) {
          this.apiKeyError = true;
        } else if (e.response && e.response.status === 429) {
          this.rateLimitError = true;
        } else {
          console.error("Error fetching common references:", e);
          this.isQueryFailed = true;
        }
      } finally {
        this.commonRefProgress.loading = false;
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
