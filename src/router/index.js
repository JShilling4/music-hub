import { createRouter, createWebHistory } from "vue-router";
import store from "@/store";

const routes = [
    {
        name: "home",
        path: "/",
        component: () => import(/* webpackChunkName: "HomePage" */ "@/views/Home.vue"),
    },
    {
        name: "manage",
        path: "/manage-music",
        meta: {
            requiresAuth: true,
        },
        component: () => import(/* webpackChunkName: "ManagePage" */ "@/views/Manage.vue"),
    },
    {
        path: "/manage",
        redirect: { name: "manage" },
    },
    {
        name: "song",
        path: "/song/:id",
        component: () => import(/* webpackChunkName: "SongPage" */ "@/views/Song.vue"),
    },
    {
        name: "404",
        path: "/:catchAll(.*)*",
        redirect: { name: "home" },
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
    linkExactActiveClass: "text-yellow-500",
});

router.beforeEach((to, from, next) => {
    if (!to.matched.some((record) => record.meta.requiresAuth)) {
        next();
        return;
    }

    if (store.state.auth.userLoggedIn) {
        next();
    } else {
        next({ name: "home" });
    }
});

export default router;
