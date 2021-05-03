<template>
    <div class="row row-cols-1 row-cols-md-3 g-4">
        <div v-for="card in cards" class="col" :key="card">
            <div class="card h-100">
                <a target="_blank" :href="card.url">
                    <div class="card-body">
                        <h5 class="card-title">{{card.title}}</h5>
                        <p class="card-text">
                            Year: {{card.year}} <br/>
                            Venue: {{card.venue}}
                        </p>
                    </div>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: "PaperCards",
    props: ['cards'],
  }
</script>

<style scoped>
    .card > a {
        color: inherit;
        text-decoration: none;
    }
</style>