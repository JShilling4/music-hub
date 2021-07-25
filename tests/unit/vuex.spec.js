import { createStore } from "vuex";
import auth from "@/store/modules/auth";

jest.mock("@/includes/firebase", () => {});

describe("Vuex Store", () => {
    it("TOGGLE_LOGGED_IN_STATUS mutation sets userLoggedIn to true", () => {
        const store = createStore({
            modules: {
                auth,
            },
        });

        expect(store.state.auth.userLoggedIn).not.toBe(true);
        store.commit("TOGGLE_LOGGED_IN_STATUS");
        expect(store.state.auth.userLoggedIn).toBe(true);
    });
});
