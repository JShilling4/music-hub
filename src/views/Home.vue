<template>
    <main>
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
                <div
                    v-icon-secondary="{ icon: 'headphones-alt', right: true }"
                    class="px-6 pt-6 pb-5 font-bold border-b border-gray-200"
                >
                    <span class="card-title">Songs</span>
                    <!-- Icon -->
                </div>
                <ol
                    v-for="song in songs"
                    :key="song.docID"
                >
                    <song-item :song="song" />
                </ol>
            </div>
        </section>

        <music-player />
    </main>
</template>

<script>
import { songsCollection } from "@/includes/firebase";
import MusicPlayer from "@/components/MusicPlayer.vue";
import SongItem from "@/components/SongItem.vue";
import IconSecondary from "@/directives/icon-secondary";

export default {
    name: "HomePage",
    components: {
        "music-player": MusicPlayer,
        "song-item": SongItem,
    },
    directives: {
        "icon-secondary": IconSecondary,
    },
    data() {
        return {
            songs: [],
            maxPerPage: 25,
            pendingRequests: false,
        };
    },
    methods: {
        handleScroll() {
            const { scrollTop, offsetHeight } = document.documentElement;
            const { innerHeight } = window;
            const bottomOfWindow =
                Math.round(scrollTop) + innerHeight === offsetHeight;

            if (bottomOfWindow) {
                this.getSongs();
            }
        },
        async getSongs() {
            if (this.pendingRequest) {
                return;
            }

            this.pendingRequest = true;

            let snapshots;

            if (this.songs.length > 0) {
                const lastDoc = await songsCollection
                    .doc(this.songs[this.songs.length - 1].docID)
                    .get();
                snapshots = await songsCollection
                    .orderBy("modifiedName")
                    .startAfter(lastDoc)
                    .limit(this.maxPerPage)
                    .get();
            } else {
                snapshots = await songsCollection
                    .orderBy("modifiedName")
                    .limit(this.maxPerPage)
                    .get();
            }

            snapshots.forEach((document) => {
                this.songs.push({
                    docID: document.id,
                    ...document.data(),
                });
            });

            this.pendingRequest = false;
        },
    },
    async created() {
        this.getSongs();

        window.addEventListener("scroll", this.handleScroll);
    },
    beforeUnmount() {
        window.removeEventListener("scroll", this.handleScroll);
    },
};
</script>