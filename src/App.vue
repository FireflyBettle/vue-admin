<template>
  <div id="app" @click="changeName">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return  {
      index: 1
    }
  },
  methods: {
    changeName() {
      this.$store.dispatch('user/changeName')
    }
  }
}
</script>
