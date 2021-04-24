<template>
<div>
<v-container>
 <v-row>
   <h1>Hi</h1>
 </v-row>

 <v-row>
   <v-btn
   v-on:click="showAddMember = !showAddMember"
   >
    Add a member
    </v-btn>
 </v-row>
  <v-row>
    <div>
    <input type="file" ref="file" v-on:change="handleUpload()"/>
    <v-btn v-on:click="uploadFile()">Upload</v-btn>
   </div>
    
</v-row>
<v-row>
    <v-btn v-on:click="listFiles()">list files</v-btn>
</v-row>
<v-row>
<div v-for="item in fileList" :key="item.name">
    {{item.fullPath}}
</div>
</v-row>
<v-row>
    <v-btn v-on:click="downloadFile()">
        Download
    </v-btn>
</v-row>
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
import {db, st} from '../firebase'
import firebase from 'firebase/app'
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
        downloadFile(){
            st.ref().child("YqscZpHvtADt3LAdJpjK/file").getDownloadURL().then((url) =>{
                 var xhr = new XMLHttpRequest();
                 xhr.responseType = 'blob';
                 xhr.onload = () => {
                let blob = xhr.response;
                const fr = new FileReader();
                 fr.readAsDataURL(blob);
                 fr.onload = function (event)  {
                const text = event.target.result;
                console.log(atob(text.split(",")[1]));
              };
                };
                
                xhr.open('GET', url);
                xhr.send();
            })
        },
        listFiles(){
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
    uploadFile(){
      console.log(this.file)
      st.ref().child(`${this.groupId}/file`).put(this.file)
     },
    },
    created() {
    this.groupId = this.$route.params.groupId  
    console.log(this.groupId)
    db.collection("groups").doc(this.groupId).get().then((doc) => {
        this.groupName = doc.data().groupName
    })
},
    data() {
        return {
            showAddMember: false,
            groupName: "",
            imageData: null,
            picture: null,
            uploadValue: 0,
            file: '',
            newMember: "",
            fileList: [],
        }
    }
}
</script>



<style>



</style>