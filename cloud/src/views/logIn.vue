<template>
<v-container>
  <div>
    <div >
      <v-row justify="center" class="ma-8"> 
      <h1>Welcome To The Cloud</h1>
      </v-row>
      <v-row justify="center" class="ma-16" >
      <div>
        <v-col>
        <v-btn
          width="200"
          v-on:click="showSignUpForm = !showSignUpForm"
        >
          Create Account
        </v-btn>
        </v-col>
        <v-col>
        <v-btn
          width="200"
          v-on:click="showSignInForm = !showSignInForm"
        >
          Sign In
        </v-btn>
        </v-col>
      </div>
      </v-row>
      <v-dialog v-model="showSignUpForm" max-width="640">
        <v-card>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field 
                  v-model="signUpEmail"
                  :error-messages="errors" 
                   label="Email" 
                   required>
                   </v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field 
                  v-model="signUpUsername"
                  :error-messages="errors" 
                  label="Username" 
                  required>
                  </v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="signUpPassword"
                    :error-messages="errors"
                    label="Password"
                    :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showPass ? 'text' : 'password'"
                    required
                    @click:append="showPass = !showPass"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn 
            v-on:click="register" 
            class="createAccount-btn" 
            type="submit"
            color="red darken-1" 
            text
            @click="showSignUpForm = false">
              Create Account
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="showSignInForm" max-width="640">
        <v-card>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="signInEmail"
                    :error-messages="errors"
                    label="Email"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="signInPassword"
                    :error-messages="errors"
                    label="Password"
                    :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showPass ? 'text' : 'password'"
                    required
                    @click:append="showPass = !showPass"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              v-on:click="login" class="login-btn" type="submit"
              color="red darken-1"
              text
            >
              Sign In
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
  </v-container>
</template>

<script>
import {db, auth} from '../firebase'
import { RSA } from 'hybrid-crypto-js';
import CryptoJS from "crypto-js";
export default {
  name: "logIn",
  components: {},
  data: function(){
    return{
      errors: '',
      signInEmail: '',
      signInUsername: '',
      signInPassword: '',
      signUpEmail: '',
      signUpUsername: '',
      signUpPassword: '',
      password: '',
      showSignInForm: false,
      showSignUpForm: false,
      showPass: true,
      publicKey: null,
      privateKey: null
    };
  },
  methods:{
    register: function(e){
        auth.createUserWithEmailAndPassword(this.signUpEmail,this.signUpPassword)
            .then(user => {
              alert('Account created for '+this.signUpEmail);
              sessionStorage.setItem("pass", this.signInPassword)
              console.log(user)
              var rsa = new RSA();
              rsa.generateKeyPair(this.newUser)
              },
              err => {
                  alert(err.message)
            })
        e.preventDefault();
    },
    newUser(keyPair) {
      var pubKey = keyPair.publicKey
      var privKey = keyPair.privateKey
      this.publicKey = pubKey
      this.privateKey = privKey
      console.log(this.signUpPassword)
      var encrypted = CryptoJS.AES.encrypt(String(this.privateKey), this.signUpPassword).toString();
      db.collection("users").doc(this.signUpEmail).set({
        userName: this.signUpUsername,
        email: this.signUpEmail,
        publicKey: this.publicKey,
        encryptedKey: encrypted
      })
    },
      login: function(e){
        auth.signInWithEmailAndPassword(this.signInEmail,this.signInPassword)
            .then(user => {
              alert('You are logged in as '+this.signInEmail);
              sessionStorage.setItem("pass", this.signInPassword)
              this.$root.loggedIn = true;
              this.$router.push('/myGroups');
              console.log(user)
              },
              err => {
                  alert(err.message)
            })
        e.preventDefault();
    }
  }
};
</script>

<style scoped>
</style>