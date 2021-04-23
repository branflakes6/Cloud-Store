import Vue from "vue";
import Router from "vue-router";
import homePage from "@/components/homePage";
import firebase from "firebase";

Vue.use(Router);
let router = new Router({
    mode: "history",
    routes: [
        {
            path:"/",
            name: "homepage",
            component: homePage,
            meta: {},
        },
        {
            path:"/groupManagment",
            name:"groupsPage",
            component: () =>
            import(
               /*webpackChunkName: "groupManagment"*/ "..//components//groupsPage.vue" 
            ),
            meta:{
                requiresAuth: true
            }
        },
        {
            path:"/myGroups",
            name:"myGroups",
            component: () =>
            import(
               /*webpackChunkName: "myGroups"*/ "..//components//myGroups.vue" 
            ),
            meta:{
                requiresAuth: true
            }
        },
        {
            path:"/group/:groupId",
            name:"group",
            component: () =>
            import(
               /*webpackChunkName: "group"*/ "..//components//group.vue" 
            ),
            meta:{
                requiresAuth: true
            }
        }
        
    ]
})
router.beforeEach((to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
      if (!firebase.auth().currentUser) {
        next({
          path: "/",
          query: {
            redirect: to.fullPath,
          },
        });
      } else {
        next();
      }
    } else if (to.matched.some((record) => record.meta.requiresGuest)) {
      if (firebase.auth().currentUser) {
        next({
          path: "/dash",
          query: {
            redirect: to.fullPath,
          },
        });
      } else {
        next();
      }
    } else {
      next();
    }
  });

export default router;
