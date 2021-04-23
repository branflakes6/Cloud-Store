<template>
<div>
   <h1>Hi</h1>
</div>

</template>


<script>

import firebase from 'firebase';
const db = firebase.firestore();
export default {
    name: "group",
    components: {
    },
created() {
    this.groupId = this.$route.params.groupId  

    console.log(this.groupId)
    db.collection("groups").doc(this.groupId).get().then((doc) => {

        console.log(doc.data().owner)

    })
},
    data() {
        return {
            
        }
    }
}
</script>



<style>



</style>