<template>
    <app-header />

    <!-- Introduction -->
    <section class="mb-8 py-20 text-white text-center relative">
        <div
            class="absolute inset-0 w-full h-full bg-contain introduction-bg"
            style="background-image: url(assets/img/header.png)"
        ></div>
        <div class="container mx-auto">
            <div class="text-white main-header-content">
                <h1 class="font-bold text-5xl mb-5">
                    Listen to Great Music!
                </h1>
                <p class="w-full md:w-8/12 mx-auto">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus et dolor
                    mollis, congue augue non, venenatis elit. Nunc justo eros, suscipit ac
                    aliquet imperdiet, venenatis et sapien. Duis sed magna pulvinar, fringilla
                    lorem eget, ullamcorper urna.
                </p>
            </div>
        </div>

        <img
            class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full"
            src="assets/img/introduction-music.png"
        />
    </section>

    <!-- Main Content -->
    <section class="container mx-auto">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
            <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
                <span class="card-title">Songs</span>
                <!-- Icon -->
                <i class="fa fa-headphones-alt float-right text-green-400 text-xl"></i>
            </div>
            <play-list />
        </div>
    </section>

    <music-player />

    <auth-modal v-show="authModalShow" />
</template>

<script>
import { mapState, mapActions } from "vuex";

import AppHeader from "@/components/AppHeader.vue";
import AuthModal from "@/components/AuthModal.vue";
import MusicPlayer from "@/components/MusicPlayer.vue";
import PlayList from "@/components/PlayList.vue";

export default {
    name: 'App',
    components: {
        "app-header": AppHeader,
        "auth-modal": AuthModal,
        "music-player": MusicPlayer,
        "play-list": PlayList
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
