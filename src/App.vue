<template>
    <app-header />

    <router-view></router-view>

    <music-player />

    <auth-modal v-show="authModalShow" />
</template>

<script>
import { mapState, mapActions } from "vuex";

import AppHeader from "@/components/AppHeader.vue";
import AuthModal from "@/components/AuthModal.vue";
import MusicPlayer from "@/components/MusicPlayer.vue";

export default {
    name: 'App',
    components: {
        "app-header": AppHeader,
        "auth-modal": AuthModal,
        "music-player": MusicPlayer,

    },
    computed: {
        ...mapState(["authModalShow"])
    },
    methods: {
        ...mapActions(["initLogin"]),
    },
    created() {
        this.initLogin();
    }
}
</script>
