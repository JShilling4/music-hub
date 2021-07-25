import Home from "@/views/Home.vue";
import SongItem from "@/components/SongItem.vue";
import { shallowMount } from "@vue/test-utils";

jest.mock("@/includes/firebase", () => {});

describe("Home.vue", () => {
    test("renders list of songs", () => {
        const songs = [
            {}, {}, {},
        ];

        const component = shallowMount(Home,  {
            data() {
                return {
                    songs,
                };
            },
        });

        const items = component.findAllComponents(SongItem);

        expect(items).toHaveLength(songs.length);
    });
});
