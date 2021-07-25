import SongItem from "@/components/SongItem.vue";
import { shallowMount, RouterLinkStub } from "@vue/test-utils";

describe("Snapshots SongItem.vue", () => {
    it("renders correctly", () => {
        const song = {
            docID: "abc",
            modifiedName: "test",
            displayName: "test",
            commentCount: 5,
        };

        const wrapper = shallowMount(SongItem, {
            propsData: { song },
            global: {
                components: {
                    "router-link": RouterLinkStub,
                },
            },
        });

        expect(wrapper.element).toMatchSnapshot();
    });
});
