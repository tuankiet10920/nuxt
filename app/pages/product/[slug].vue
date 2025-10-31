<script setup>
import { useRoute } from 'vue-router';

const route = useRoute()

console.log('route params: ', route.params);

const result = route.params.slug
</script>
<template>
    <div>
        Hi, I'm Detail Page, result: {{ result }}!
        <NuxtLink to="/san-pham/111111">111</NuxtLink><br>
        <NuxtLink to="/san-pham/21222">2222</NuxtLink>
    </div>
</template>
<style scoped></style>