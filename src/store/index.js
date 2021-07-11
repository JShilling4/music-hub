import { createStore } from "vuex";

export default createStore({
    state: {
        authModalShow: false,
    },
    mutations: {
        SHOW_AUTH_MODAL: (state, value) => {
            state.authModalShow = value;
        }
    },
    actions: {
        openAuthModal: ({commit}) => {
            commit("SHOW_AUTH_MODAL", true);
        },
        closeAuthModal: ({commit}) => {
            commit("SHOW_AUTH_MODAL", false);
        }
    }
});
