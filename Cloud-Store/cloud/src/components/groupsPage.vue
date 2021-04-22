<template>
<div>
    <v-btn v-on:click.stop="newGroup = !newGroup">
        create a group
    </v-btn>
<v-dialog v-model="newGroup" max-width="500px">
    <v-card>
        <v-card-title>
            <span > Create a new group!</span>
        </v-card-title>
        <v-card-text>
            <v-container>
                <v-text-field
                v-model="groupName"
                label="Enter the name of the new Group"
                required
                > 
                </v-text-field>
                <v-row>
                    <v-col>
                <v-btn @click="createGroup">
                    Create Group
                </v-btn>
                </v-col>
                <v-col>
                    <v-btn v-on:click.stop="newGroup = !newGroup">
                        Cancel
                    </v-btn>
                </v-col>
                </v-row>
            </v-container>
        </v-card-text>
    </v-card>
</v-dialog>
<upload/>
</div>
</template>


<script>
import upload from "./upload"
import firebase from "firebase/app";
const db = firebase.firestore();
export default {
    name: "groupsPage",
    components: {
        upload,
    },
    methods: {
        createGroup() {
            console.log(this.groupName)
            console.log(firebase.auth().currentUser.email)

            db.collection("groups").add({
             groupName: this.groupName,
             owner: firebase.auth().currentUser.email    
            }).then(
                function(docRef) {
                    db.collection("users")
                    .doc(firebase.auth().currentUser.email)
                    .update({
                        groups: firebase.firestore.FieldValue.arrayUnion({
                            groupName: this.groupName,
                            groupID: docRef.id
                        }),
                    })
                }.bind(this)
            )
    },
}, 
data() {
    return{
        newGroup: false,
        groupName: "",
    }
}
}
</script>


<style>



</style>