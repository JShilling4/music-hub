import { createStore } from "vuex";
import { auth, usersCollection } from "@/includes/firebase";
import { Howl } from "howler";
import helper from "@/includes/helper";

export default createStore({
    state: {
        authModalShow: false,
        userLoggedIn: false,
        currentSong: {},
        sound: {},
        seek: "00:00",
        duration: "00:00",
        playerProgress: "0%",
    },

    mutations: {
        TOGGLE_AUTH_MODAL: (state, value) => {
            state.authModalShow = value;
        },
        TOGGLE_LOGGED_IN_STATUS: (state, value) => {
            state.userLoggedIn = value;
        },
        NEW_SONG: (state, payload) => {
            state.currentSong = payload;
            state.sound = new Howl({
                src: [payload.url],
                html5: true,
            });
        },
        UPDATE_POSITION(state) {
            state.seek = helper.formatTime(state.sound.seek());
            state.duration = helper.formatTime(state.sound.duration());
            state.playerProgress = `${(state.sound.seek() / state.sound.duration()) * 100}%`;
        },
    },

    actions: {
        openAuthModal: ({ commit }) => {
            commit("TOGGLE_AUTH_MODAL", true);
        },
        closeAuthModal: ({ commit }) => {
            commit("TOGGLE_AUTH_MODAL", false);
        },
        async registerUser(context, payload) {
            const userCredentials = await auth.createUserWithEmailAndPassword(
                payload.email,
                payload.password
            );

            await usersCollection.doc(userCredentials.user.uid).set({
                name: payload.name,
                email: payload.email,
            });

            await userCredentials.user.updateProfile({
                displayName: payload.name,
            });
        },
        initLogin({ commit }) {
            const user = auth.currentUser;

            if (user) {
                commit("TOGGLE_LOGGED_IN_STATUS", true);
            }
        },
        logInUser({ commit }, payload) {
            return auth
                .signInWithEmailAndPassword(payload.email, payload.password)
                .then(() => {
                    commit("TOGGLE_LOGGED_IN_STATUS", true);
                })
                .catch((error) => console.log(error));
        },
        logOutUser({ commit }) {
            return auth
                .signOut()
                .then(() => {
                    commit("TOGGLE_LOGGED_IN_STATUS", false);
                })
                .catch((error) => console.log(error));
        },
        toggleLoggedInStatus: ({ commit }, value) => {
            commit("TOGGLE_LOGGED_IN_STATUS", value);
        },
        async newSong({ commit, state, dispatch }, payload) {
            if (state.sound instanceof Howl) {
                state.sound.unload();
            }

            commit("NEW_SONG", payload);

            state.sound.play();

            state.sound.on("play", () => {
                requestAnimationFrame(() => {
                    dispatch("progress");
                });
            });
        },
        async toggleAudio({ state }) {
            if (!state.sound.playing) {
                return;
            }

            if (state.sound.playing()) {
                state.sound.pause();
            } else {
                state.sound.play();
            }
        },
        progress({ commit, state, dispatch }) {
            commit("UPDATE_POSITION");

            if (state.sound.playing()) {
                requestAnimationFrame(() => {
                    dispatch("progress");
                });
            }
        },
        updateSeek({ state, dispatch }, payload) {
            if (!state.sound.playing()) {
                return;
            }
            const { x, width } = payload.currentTarget.getBoundingClientRect();
            const clickX = payload.clientX - x;
            const percentage = clickX / width;
            const seconds = state.sound.duration() * percentage;

            state.sound.seek(seconds);
            state.sound.once("seek", () => {
                dispatch("progress");
            });
        },
    },

    getters: {
        playing: (state) => {
            if (state.sound.playing) {
                return state.sound.playing();
            }
            return false;
        },
    },
});
