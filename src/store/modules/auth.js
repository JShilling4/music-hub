import { auth, usersCollection } from "@/includes/firebase";

export default {
    state: {
        authModalShow: false,
        userLoggedIn: false,
    },
    mutations: {
        TOGGLE_AUTH_MODAL: (state, value) => {
            state.authModalShow = value;
        },
        TOGGLE_LOGGED_IN_STATUS: (state) => {
            state.userLoggedIn = !state.userLoggedIn;
        },
    },
    actions: {
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

        async logInUser({ commit }, payload) {
            await auth.signInWithEmailAndPassword(payload.email, payload.password);
            commit("TOGGLE_LOGGED_IN_STATUS", true);
        },

        async logOutUser({ commit }) {
            await auth.signOut();
            commit("TOGGLE_LOGGED_IN_STATUS", false);
        },

        openAuthModal: ({ commit }) => {
            commit("TOGGLE_AUTH_MODAL", true);
        },

        closeAuthModal: ({ commit }) => {
            commit("TOGGLE_AUTH_MODAL", false);
        },

        toggleLoggedInStatus: ({ commit }) => {
            commit("TOGGLE_LOGGED_IN_STATUS");
        },
    },
};
