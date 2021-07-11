import { createStore } from "vuex";
import { auth, usersCollection } from "@/includes/firebase";

export default createStore({
    state: {
        authModalShow: false,
        userLoggedIn: false,
    },
    mutations: {
        TOGGLE_AUTH_MODAL: (state, value) => {
            state.authModalShow = value;
        },
        TOGGLE_LOGGED_IN: (state, value) => {
            state.userLoggedIn = value;
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
            })
        },

        initLogin({commit}) {
            const user = auth.currentUser;

            if (user) {
                commit("TOGGLE_LOGGED_IN", true);
            }
        },
        logUserIn: ({ commit }) => {
            commit("TOGGLE_LOGGED_IN", true);
        },
        logUserOut: ({ commit }) => {
            commit("TOGGLE_LOGGED_IN", false);
        },
    },
});
