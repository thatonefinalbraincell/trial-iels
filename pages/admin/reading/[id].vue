<template>
  <AdminTestEditor :test-id="Number($route.params.id)" />
</template>
<script setup lang="ts">
definePageMeta({ layout: 'admin' })
</script>
