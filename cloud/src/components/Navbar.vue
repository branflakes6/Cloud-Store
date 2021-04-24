<template>
<nav>
<v-app-bar>
  <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
</v-app-bar>
<v-navigation-drawer
      app
      fixed
      temporary
      v-model="drawer"
    >
      <v-list>
        <v-list-item v-for="item in items" :key="item.title" :to="item.to" link>
          <v-list-item-content>
            <v-list-item-title class="title">
              {{ item.title }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
</v-navigation-drawer>
</nav>


</template>

<script>
export default {
data: () => ({
    drawer: false,
    items: [
      {
        title: "Home",
        to: "/",
      },
      {
        title: "groups Page",
        to: "/groupManagment"
      },
      {
        title: "Login",
        to: "/login",
      },
      {
        title: "My Groups",
        to: "/myGroups",
      },  
    ],
})
}

</script>