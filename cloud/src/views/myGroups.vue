<template>
<div>
 <v-container>
     <v-row>
     <v-spacer></v-spacer>
     </v-row>
    <v-row align="end" justify="center" class="ma-8">
     <v-btn @click="newGroup = !newGroup">
         create a group
     </v-btn>
    </v-row>
    <v-row justify="center">
        <h3> Your Groups </h3>
    </v-row>
 <v-row justify="center">
     
  <div v-for="item in groupList" :key="item.groupName">
    <v-col>
   <v-btn @click="toGroup(item.groupID)">
        {{item.groupName}}
   </v-btn>
   </v-col>
  </div>
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
import { RSA } from 'hybrid-crypto-js'
export default {
    name: "myGroups",
    components: {

    },
    methods: {
        toGroup(ID) {
            this.$router.push(`group/${ID}`)
        },
        exKeys(keyPair) {
        var pubKey = keyPair.publicKey
        var privKey = keyPair.privateKey
        this.publicKey = pubKey
        this.privateKey = privKey
        console.log(this.publicKey)
        console.log(this.privateKey)
          db.collection("groups").add({
            groupName: this.groupName,
            owner: auth.currentUser.email,
            publicKey: this.publicKey,
            privateKey: this.privateKey

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
         createGroup() {
        var rsa = new RSA();
        rsa.generateKeyPair(this.exKeys);

      
    },
    },
    created() {
        db.collection("users").doc(auth.currentUser.email).get().then((doc) => {
            this.groupList = doc.data().groups
        })
    },
    data() {
        return{
            groupList: [],
            newGroup: false,
            groupName: "",
            publicKey: null,
            privateKey: null,
        }
    }
}
</script>

<style>
</style>