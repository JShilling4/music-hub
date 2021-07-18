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
        TOGGLE_LOGGED_IN_STATUS: (state, value) => {
            state.userLoggedIn = value;
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
        openAuthModal: ({ commit }) => {
            commit("TOGGLE_AUTH_MODAL", true);
        },
        closeAuthModal: ({ commit }) => {
            commit("TOGGLE_AUTH_MODAL", false);
        },
        toggleLoggedInStatus: ({ commit }, value) => {
            commit("TOGGLE_LOGGED_IN_STATUS", value);
        },
    },
};
