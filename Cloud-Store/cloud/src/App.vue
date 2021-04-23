<template>
<v-app>
   <router-view></router-view>
</v-app>
</template>

<script>
import firebase from "firebase";
export default {
  name: 'App',
  components: {
  },
  watch: {
        $route() {
            if(firebase.auth().currentUser){
                this.loggedIn = true
                this.userEmail = firebase.auth().currentUser.email
            }
            else{
                this.loggedIn = false
                this.user = ""
            }
        }
    },
}
</script>

<style>
</style>
