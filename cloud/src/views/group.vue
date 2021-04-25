<template>
<div>
<v-container>
 <v-row>
   <h1>Hi</h1>
 </v-row>

 <v-row>
     <div v-if="isOwner">
   <v-btn
   v-on:click="showAddMember = !showAddMember"
   class="ma-4"
   >
    Add a member
    </v-btn>
    </div>
 </v-row>
  <v-row>
    <div class="ma-4">
    <input type="file" ref="file" v-on:change="handleUpload()"/>
    <v-btn v-on:click="uploadFile(file)">Upload</v-btn>
   </div>
    
</v-row>
<div v-for="item in fileList" :key="item.name" class="ma-4"> 
    <v-row >
    <v-btn 
    align="center" 
    justify="space-around" 
    class="ma-4"
    v-on:click="downloadFile(item)"
    >
    {{item.name}}
    </v-btn>
    </v-row>
</div>
</v-container>
<v-dialog v-model="showAddMember">
  <v-card>
      <v-card-text>
          <v-container>
              <v-text-field
              v-model="newMember"
              label="Enter an email"
              ></v-text-field>
              <v-btn
                  @click="addMember"
              > Add</v-btn>
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
export default {
name: "group",
components: {
},
methods: {
    addMember() {
            db.collection("groups").doc(this.groupId).update({
                members: firebase.firestore.FieldValue.arrayUnion({
                    member: this.newMember
                })
            }).then(
                    db.collection("users").doc(this.newMember).update({
                        groups: firebase.firestore.FieldValue.arrayUnion({
                            groupID: this.groupId,
                            groupName: this.groupName
                        })
                    })
                )
        },
    downloadFile(file){
            var pubKey = this.privateKey
            st.ref().child(file.fullPath).getDownloadURL().then((url) =>{
                var xhr = new XMLHttpRequest();
                xhr.responseType = 'blob';
                xhr.onload = () => {
                const fr = new FileReader();
                fr.readAsBinaryString(xhr.response);
                fr.onload = function (event)  {
                const text = event.target.result;
                console.log(text)
                var crypt = new Crypt();
                var decrypted = crypt.decrypt(pubKey, text)
                console.log(decrypted)
                fileDownload(decrypted.message, file.name)
              };
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
    uploadFile(file) {    
        var reader = new FileReader()
        var pubKey = this.publicKey
        var ID = this.groupId
        reader.onload =function(event) { 
            console.log(event.target.result)  
            var crypt = new Crypt();
            var encrypted = crypt.encrypt(pubKey, event.target.result);
            console.log(encrypted)
            st.ref().child(`${ID}/${file.name}`).putString(encrypted)   
        }
        reader.readAsBinaryString(file);
        this.listFiles()
        }
    },
    created() {
    this.groupId = this.$route.params.groupId  
    db.collection("groups").doc(this.groupId).get().then((doc) => {  
        this.groupName = doc.data().groupName
        this.groupOwner = doc.data().owner
        this.publicKey = doc.data().publicKey
        this.privateKey = doc.data().privateKey
        if(doc.data().owner == auth.currentUser.email){
            this.isOwner = true
        }
    })
    this.listFiles()
},
    data() {
        return {
            showAddMember: false,
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
        }
    }
}
</script>



<style>
</style>