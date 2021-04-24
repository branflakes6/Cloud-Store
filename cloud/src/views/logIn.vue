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
import {auth} from '../firebase'
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
      showPass: true
    };
  },
  methods:{
    register: function(e){
        auth.createUserWithEmailAndPassword(this.signUpEmail,this.signUpPassword)
            .then(user => {
              alert('Account created for '+this.signUpEmail);
              this.$router.push('/');
              console.log(user)
              },
              err => {
                  alert(err.message)
            })
        e.preventDefault();
    },
      login: function(e){
        auth.signInWithEmailAndPassword(this.signInEmail,this.signInPassword)
            .then(user => {
              alert('You are logged in as '+this.signInEmail);
              this.$root.loggedIn = true;
              this.$router.push('/groupManagment');
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