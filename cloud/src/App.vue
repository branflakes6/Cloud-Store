<template>
<v-app>
    <Navbar></Navbar>
    <v-content>
   <router-view></router-view>
   </v-content>
</v-app>
</template>

<script>
import {auth} from "./firebase.js";
import Navbar from "./components/Navbar"
export default {
  name: 'App',
  components: {
      Navbar
  },
  watch: {
        $route() {
            if(auth.currentUser){
                this.loggedIn = true
                this.userEmail = auth.currentUser.email
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
