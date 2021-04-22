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
            path:"/groups",
            name:"groupsPage",
            component: () =>
            import(
               /*webpackChunkName: "groups"*/ "..//components//groupsPage.vue" 
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
