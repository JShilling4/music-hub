<template>
    <main>
        <!-- Music Header -->
        <section class="w-full mb-8 py-14 text-center text-white relative">
            <div
                class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
                style="background-image: url(/assets/img/song-header.png)"
            >
            </div>
            <div class="container mx-auto flex items-center">
                <!-- Play/Pause Button -->
                <button
                    type="button"
                    class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full
                        focus:outline-none"
                    @click.prevent="newSong(song)"
                >
                    <i class="fas fa-play"></i>
                </button>

                <!-- Song Info -->
                <div class="z-50 text-left ml-8">
                    <div class="text-3xl font-bold">
                        {{ song.modifiedName }}
                    </div>
                    <div>{{ song.genre }}</div>
                </div>
            </div>
        </section>

        <!-- Form -->
        <section
            id="comments"
            class="container mx-auto mt-6"
        >
            <div class="bg-white rounded border border-gray-200 relative flex flex-col">
                <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
                    <!-- Comment Count -->
                    <span class="card-title">
                        {{ $tc("song.commentCount", song.commentCount, { count: song.commentCount }) }}
                    </span>
                    <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
                </div>
                <div class="p-6">
                    <!-- Notification -->
                    <div
                        v-if="commentShowAlert"
                        class="text-white text-center font-bold p-4 mb-4"
                        :class="commentAlertVariant"
                    >
                        {{ commentAlertMessage }}
                    </div>

                    <!-- Comment Form -->
                    <vee-form
                        v-if="userLoggedIn"
                        :validation-schema="schema"
                        @submit="addComment"
                    >
                        <!-- Comment -->
                        <vee-field
                            as="textarea"
                            name="comment"
                            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                                duration-500 focus:outline-none focus:border-black rounded mb-4"
                            placeholder="Your comment here..."
                        ></vee-field>
                        <ErrorMessage
                            class="text-red-600"
                            name="comment"
                        />

                        <!-- Submit Comment -->
                        <button
                            type="submit"
                            class="py-1.5 px-3 rounded text-white bg-green-600 block"
                            :disabled="commentInSubmission"
                        >
                            Submit
                        </button>
                    </vee-form>

                    <!-- Sort Comments -->
                    <select
                        v-model="sort"
                        class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition
                            duration-500 focus:outline-none focus:border-black rounded"
                    >
                        <option value="descending">
                            Latest
                        </option>
                        <option value="ascending">
                            Oldest
                        </option>
                    </select>
                </div>
            </div>
        </section>

        <!-- Comments -->
        <ul class="container mx-auto">
            <li
                v-for="comment in sortedComments"
                :key="comment.docID"
                class="p-6 bg-gray-50 border border-gray-200"
            >
                <!-- Comment Author -->
                <div class="mb-5">
                    <div class="font-bold">
                        {{ comment.name }}
                    </div>
                    <time>{{ comment.datePosted }}</time>
                </div>

                <p>
                    {{ comment.content }}
                </p>
            </li>
        </ul>
    </main>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { songsCollection, auth, commentsCollection } from "@/includes/firebase";

export default {
    name: "Song",

    data() {
        return {
            song: {},
            schema: {
                comment: "required|min:3",
            },
            commentInSubmission: false,
            commentShowAlert: false,
            commentAlertVariant: "bg-blue-500",
            commentAlertMessage:
                "Please wait while your comment is submitted...",
            comments: [],
            sort: "descending",
        };
    },

    computed: {
        ...mapState({ userLoggedIn: (state) => state.auth.userLoggedIn }),

        sortedComments() {
            return this.comments.slice().sort((a, b) => {
                if (this.sort === "descending") {
                    return new Date(b.datePosted) - new Date(a.datePosted);
                }
                return new Date(a.datePosted) - new Date(b.datePosted);
            });
        },
    },

    watch: {
        sort(newVal) {
            if (newVal === this.$route.query.sort) {
                return;
            }

            this.$router.push({
                query: {
                    sort: newVal,
                },
            });
        },
    },

    methods: {
        ...mapActions(["newSong"]),

        async addComment(values, { resetForm }) {
            this.commentInSubmission = true;
            this.commentShowAlert = true;
            this.commentAlertVariant = "bg-blue-500";
            this.commentAlertMessage =
                "Please wait while your comment is submitted...";

            const comment = {
                content: values.comment,
                datePosted: new Date().toString(),
                sid: this.$route.params.id,
                name: auth.currentUser.displayName,
                uid: auth.currentUser.uid,
            };

            await commentsCollection.add(comment);

            this.song.commentCount += 1;
            await songsCollection.doc(this.$route.params.id).update({
                commentCount: this.song.commentCount,
            });

            this.getComments();

            this.commentInSubmission = false;
            this.commentAlertVariant = "bg-green-500";
            this.commentAlertMessage = "Comment added!";

            resetForm();
        },
        async getComments() {
            const snapshots = await commentsCollection
                .where("sid", "==", this.$route.params.id)
                .get();

            this.comments = [];

            snapshots.forEach((document) => {
                this.comments.push({
                    docID: document.id,
                    ...document.data(),
                });
            });
        },
    },

    async beforeRouteEnter(to, from, next) {
        const docSnapshot = await songsCollection.doc(to.params.id).get();

        next((vm) => {
            if (!docSnapshot.exists) {
                vm.$router.push({ name: "home" });
                return;
            }

            const { sort } = vm.$route.query;

            vm.sort =
                sort === "descending" || sort === "ascending"
                    ? sort
                    : "descending";

            vm.song = docSnapshot.data();
            vm.getComments();
        });
    },
};
</script>
