<template>
    <app-header />

    <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
            <component :is="Component"></component>
        </transition>
    </router-view>

    <music-player />

    <auth-modal v-show="authModalShow" />
</template>

<script>
import { mapState, mapActions } from "vuex";

import AppHeader from "@/components/AppHeader.vue";
import AuthModal from "@/components/AuthModal.vue";
import MusicPlayer from "@/components/MusicPlayer.vue";

export default {
    name: "App",
    components: {
        "app-header": AppHeader,
        "auth-modal": AuthModal,
        "music-player": MusicPlayer,
    },
    computed: {
        ...mapState(["authModalShow"]),
    },
    methods: {
        ...mapActions(["initLogin"]),
    },
    created() {
        this.initLogin();
    },
};
</script>

<style>
.fade-enter-from {
    opacity: 0;
}

.fade-enter-active {
    transition: all 0.3s linear;
}

.fade-leave-to {
    transition: all .3s linear;
    opacity: 0;
}
</style>
