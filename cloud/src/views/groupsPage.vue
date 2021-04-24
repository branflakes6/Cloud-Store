<template>
<div>
 <v-container>
     <v-row>
     <v-spacer></v-spacer>
     </v-row>
    <v-row align="end" justify="center">
     <v-btn @click="newGroup = !newGroup">
         create a group
     </v-btn>
     <v-btn to="/myGroups" >
         Show Groups
     </v-btn>
     </v-row>
     <v-row align="center" justify="center">
    <upload/>
    </v-row>
  
</v-container>

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
                    <v-btn @click="newGroup = !newGroup">
                        Cancel
                    </v-btn>
                </v-col>
                </v-row>
            </v-container>
        </v-card-text>
    </v-card>
   </v-dialog>
   
</div>
</template>


<script>
import {db, auth} from '../firebase'
import firebase from 'firebase/app'
export default {
    name: "groupsPage",
    components: {

    },
    methods: {
        createGroup() {
            console.log(this.groupName)
            console.log(auth.currentUser.email)

            db.collection("groups").add({
             groupName: this.groupName,
             owner: auth.currentUser.email    
            }).then(
                function(docRef) {
                    db.collection("users")
                    .doc(auth.currentUser.email)
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