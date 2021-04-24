import Vue from "vue";
import Router from "vue-router";
import homePage from "@/views/homePage";
import {auth} from "../firebase";

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
          path:"/login",
          name: "login",
          component: () =>
            import(
               /*webpackChunkName: "login"*/ "..//views//logIn.vue" 
            ),
        },
        {
            path:"/myGroups",
            name:"myGroups",
            component: () =>
            import(
               /*webpackChunkName: "myGroups"*/ "..//views//myGroups.vue" 
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
               /*webpackChunkName: "group"*/ "..//views//group.vue" 
            ),
            meta:{
                requiresAuth: true
            }
        }
        
    ]
})
router.beforeEach((to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
      if (!auth.currentUser) {
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
      if (auth.currentUser) {
        next({
          path: "/",
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