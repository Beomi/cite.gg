<template>
    <div>
        <vue-good-table
                :columns="columns"
                :rows="dataset"
                :pagination-options="{enabled: true}"
                theme="polar-bear"
                @on-cell-click="onCellClick"
        />
    </div>
</template>

<script>
  export default {
    name: 'ReferenceTable',
    props: ['dataset'],
    methods: {
      onCellClick(params) {
        const routeData = this.$router.resolve({path: '/paper', query: {q: params.row.paperId}})
        window.open(routeData.href, '_blank')
      }
    },
    data() {
      return {
        columns: [
          {
            label: 'Title',
            field: 'title',
          },
          {
            label: 'arXiv ID',
            field: 'arxivId',
          },
          {
            label: 'doi',
            field: 'doi',
          },
          // {
          //   label: 'URL',
          //   field: 'url',
          // },
          {
            label: 'Venue',
            field: 'venue',
          },
          {
            label: 'Year',
            field: 'year',
            type: 'number',
          },
          {
            label: 'paperId',
            field: 'paperId',
            hidden: true,
          },
        ],
      };
    },
  };
</script>