import { createStore } from "vuex";
import auth from "@/store/modules/auth";
import { cloneDeep } from "lodash";

jest.mock("@/includes/firebase", () => ({
    auth: {
        signInWithEmailAndPassword: () => Promise.resolve(),
    }
}));

describe("Vuex Store", () => {
    it("TOGGLE_LOGGED_IN_STATUS mutation sets userLoggedIn to true", () => {
        const clonedAuth = cloneDeep(auth);

        const store = createStore({
            modules: {
                auth: clonedAuth,
            },
        });

        expect(store.state.auth.userLoggedIn).toBe(false);
        store.commit("TOGGLE_LOGGED_IN_STATUS");
        expect(store.state.auth.userLoggedIn).toBe(true);
    });

    it("logInUser action sets userLoggedIn to true", async () => {
        expect.assertions(2);

        const clonedAuth = cloneDeep(auth);

        const store = createStore({
            modules: {
                auth: clonedAuth,
            },
        });

        expect(store.state.auth.userLoggedIn).toBe(false);
        await store.dispatch("logInUser", { email: "", password: "" });
        expect(store.state.auth.userLoggedIn).toBe(true);
    });
});
