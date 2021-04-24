<template>
<div>
 <v-container>
 <v-row>
  <div v-for="item in groupList" :key="item.groupName">
    <v-col>
   <v-btn @click="toGroup(item.groupID)">
        {{item.groupName}}
   </v-btn>
   </v-col>
  </div>
  </v-row>
 </v-container>
</div>
</template>

<script>
import {db, auth} from '../firebase'
export default {
    name: "myGroups",
    components: {

    },
    methods: {
        toGroup(ID) {
            this.$router.push(`group/${ID}`)
        }
    },
    created() {
        db.collection("users").doc(auth.currentUser.email).get().then((doc) => {
            this.groupList = doc.data().groups
        })
    },
    data() {
        return{
            groupList: []
        }
    }
}
</script>

<style>
</style>