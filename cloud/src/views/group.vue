<template>
<div>
<v-container>
 
    <v-row justify="center">
        <h1 class="font-weight-thin">{{this.groupName}}</h1>
   </v-row>

   <v-row justify="center">
        <h4 class="font-weight-thin">Group Owner: {{this.groupOwner}}</h4>
   </v-row>


 <v-row justify="center">
     <div v-if="isOwner">
   <v-btn
   v-on:click="showAddMember = !showAddMember"
   class="ma-4"
   color="blue lighten-2" text
   >
    Add a member
    </v-btn>
     <v-btn
    v-on:click="showRemoveMember = !showRemoveMember"
    class="ma-4"
    color="blue lighten-2" text
   >
    Remove Member
    </v-btn>
    </div>
 </v-row>
 
 <v-row justify="center">
    <h3 class="font-weight-thin"> Upload a file </h3>
</v-row>

  <v-row justify="center" outlined>
    <div class="ma-4">
    <input type="file" ref="file" v-on:change="handleUpload()"/>
    <v-btn color="blue lighten-2" text v-on:click="uploadFile(file)">Upload</v-btn>
   </div>
    
</v-row>

<div v-for="item in fileList" :key="item.name" class="ma-4"> 
    <v-row justify="center">
    <v-card style="width:40%" class="mx-auto">
        <v-card-title>
            <v-card-text class="text--primary">
                {{item.name}}
                <v-card-actions>
                <v-btn 
                color="blue lighten-2"
                text
                @click="downloadFile(item)"
                >
                Download
                </v-btn>
                <v-btn 
                color="blue lighten-2"
                text
                @click="deleteFile(item)"
                >
                Delete
                </v-btn>
                </v-card-actions>
            </v-card-text>
        </v-card-title>
    </v-card>
    </v-row>
</div>
</v-container>
<v-dialog v-model="showAddMember" max-width="500px">
  <v-card>
      <v-card-text>
          <v-container>
              <v-text-field
              v-model="newMember"
              label="Enter an email"
              ></v-text-field>
              <v-row justify="center">
              <v-btn
                  @click="addMember"
                  
              > Add</v-btn>
              </v-row>
          </v-container>
      </v-card-text>
  </v-card>
</v-dialog>

<v-dialog v-model="showRemoveMember" max-width="500px">
  <v-card>
      <v-card-text>
          <v-container>
              <v-text-field
              v-model="removeMember"
              label="Enter an email"
              ></v-text-field>
              <v-row justify="center">
              <v-btn
                  @click="removeMemberFunc"
              > Remove</v-btn>
              </v-row>
          </v-container>
      </v-card-text>
  </v-card>
</v-dialog>
</div>
</template>


<script>
import {db, st, auth} from '../firebase'
import firebase from 'firebase/app'
import fileDownload from 'js-file-download';
import { Crypt } from 'hybrid-crypto-js'
import CryptoJS from "crypto-js";
export default {
name: "group",
components: {
},
methods: {
    addMember() {
        db.collection("users").doc(this.newMember).get().then((doc) => {
            const crypt = new Crypt()
            var newPubKey = doc.data().publicKey
            this.newUserGKey = crypt.encrypt(newPubKey, String(this.groupPrivKey));
            db.collection("groups").doc(this.groupId).update({
            members: firebase.firestore.FieldValue.arrayUnion({
                member: this.newMember
                })
            }).then(() => {
                db.collection("users").doc(this.newMember).update({
                    groups: firebase.firestore.FieldValue.arrayUnion({
                        groupID: this.groupId,
                        groupName: this.groupName,
                        encryptedKey: this.newUserGKey
                    })
                })
            })
        }) 
        this.showAddMember = !this.showAddMember
    },
    removeMemberFunc() {
         db.collection("users").doc(this.removeMember).get().then((doc) =>{
             var uGroups = doc.data().groups
             for(var i in uGroups){
                 if(uGroups[i].groupID == this.groupId){
                     this.groupToRemove = uGroups[i]
                 }
             }
            db.collection("users").doc(this.removeMember).update({
            groups: firebase.firestore.FieldValue.arrayRemove({
                encryptedKey: this.groupToRemove.encryptedKey,
                groupID: this.groupToRemove.groupID,
                groupName: this.groupToRemove.groupName
                })
            })
         })
         this.showRemoveMember = ! this.showRemoveMember
    },
    async downloadFile(file){
            var privKey = this.groupPrivKey
            var pubKey = this.publicKey
            st.ref().child(file.fullPath).getDownloadURL().then( async (url) =>{
                var xhr = new XMLHttpRequest();
                xhr.responseType = 'text';
                xhr.onload = async () => {
                const text = xhr.response
                var crypt = new Crypt();
                var decrypted = crypt.decrypt(privKey, text)

                var buf = new ArrayBuffer(decrypted.message.length*2);
                var bufView = new Uint8Array(buf)
                var strLen = decrypted.message.length
                for(var i =0; i<strLen; i++){
                    bufView[i] = decrypted.message.charCodeAt(i)
                }
                var verified = crypt.verify(
                    pubKey,
                    decrypted.signature,
                    decrypted.message,
                )
                console.log(verified)
                fileDownload(buf, file.name)
            };  
                xhr.open('GET', url);
                xhr.send();
            })
        },
    listFiles(){
            this.fileList = []
            var listRef = st.ref().child(this.groupId)
            listRef.listAll()
            .then((res) => {
            res.prefixes.forEach(() => {
            });
            res.items.forEach((itemRef) => {
            this.fileList.push(itemRef)
    });
    })
},
    handleUpload() {
            this.file = this.$refs.file.files[0]
    },
    async uploadFile(file) {    
        var pubKey = this.publicKey
        var ID = this.groupId
        var privKey = this.groupPrivKey
            var buffer = await file.arrayBuffer()
            var text = String.fromCharCode.apply(null, new Uint8Array(buffer));
            var crypt = new Crypt();
            var sig = crypt.signature(privKey, text)
            var encrypted = crypt.encrypt(pubKey, text, sig);
            st.ref().child(`${ID}/${file.name}`).putString(encrypted)        
        this.listFiles()
      },
      deleteFile(file) {
        var ID = this.groupId
        st.ref().child(`${ID}/${file.name}`).delete()
        this.listFiles()
    },
    },
    
    created() {
    this.groupId = this.$route.params.groupId  
    db.collection("groups").doc(this.groupId).get().then((doc) => {  
        this.groupName = doc.data().groupName
        this.groupOwner = doc.data().owner
        this.publicKey = doc.data().publicKey
        if(doc.data().owner == auth.currentUser.email){
            this.isOwner = true
        }
    })
    db.collection("users").doc(auth.currentUser.email).get().then((doc) => {
        var userPrivKey = doc.data().encryptedKey
        var userPass = sessionStorage.getItem("pass")
        var bytes = CryptoJS.AES.decrypt(userPrivKey, userPass)
        userPrivKey = bytes.toString(CryptoJS.enc.Utf8)
        this.userGroups = doc.data().groups

        for(var i in this.userGroups){
            if(this.userGroups[i].groupName == this.groupName){
                this.groupPrivKey = this.userGroups[i].encryptedKey
            }
        }
        var crypt = new Crypt()
        var decrypted = crypt.decrypt(userPrivKey, String(this.groupPrivKey))
        this.groupPrivKey = decrypted.message
    })
    this.listFiles()
},
    data() {
        return {
            showAddMember: false,
            removeMember: "",
            groupToRemove: "",
            userGroups: [],
            newUserGKey: "",
            groupOwner: "",
            groupName: "",
            publicKey: null,
            privateKey: null,
            imageData: null,
            picture: null,
            uploadValue: 0,
            newMember: "",
            fileList: [],
            isOwner: false,
            groupPrivKey: null,
            showRemoveMember: false,
        }
    }
}
</script>


<style>
</style>