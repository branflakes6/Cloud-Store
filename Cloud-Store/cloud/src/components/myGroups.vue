<template>
<div>
<div v-for="item in groupList" :key="item">
   <v-btn @click="toGroup(item.groupID)">
        {{item.groupName}}
   </v-btn>

</div>
</div>
</template>



<script>
import firebase from 'firebase';

const db = firebase.firestore();
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
        db.collection("users").doc(firebase.auth().currentUser.email).get().then((doc) => {
            this.groupList = doc.data().groups
            console.log(this.groupList)
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