<template>
    <router-view /> <!-- This will render the matched component based on the route -->
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  padding: 0;
  border: 0;
  
  width: 100%; /* Force full viewport width */
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-x: hidden; /* Prevents horizontal scrolling */
}


</style>
