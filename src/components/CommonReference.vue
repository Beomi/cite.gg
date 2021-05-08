<template>
    <div>
        <vue-good-table
                :columns="columns"
                :rows="dataset"
                :pagination-options="{enabled: true}"
                :sort-options="{enabled: true, initialSortBy: {field: 'counter', type: 'desc'}}"
                theme="polar-bear"
                @on-cell-click="onCellClick"
        />
    </div>
</template>

<script>
  export default {
    name: 'CommonReference',
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
            label: 'Count #',
            field: 'count',
          },
          {
            label: 'Title',
            field: 'title',
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