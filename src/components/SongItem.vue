<template>
    <li
        :id="`song-id-${song.docID}`"
        class="flex justify-between items-center p-3 pl-6 cursor-pointer transition
            duration-300 hover:bg-gray-50 example"
        :class="`song-id-${song.docID}`"
    >
        <div>
            <router-link
                :to="{ name: 'song', params: { id: song.docID } }"
                class="font-bold block text-gray-600 composition-name"
            >
                {{ song.modifiedName }}
            </router-link>
            <span class="text-gray-500 text-sm">{{ song.displayName }}</span>
        </div>

        <div class="text-gray-600 text-lg">
            <router-link
                v-slot="{ navigate }"
                custom
                :to="{ name: 'song', params: { id: song.docID }, hash: '#comments' }"
            >
                <span class="comments" @click="navigate">
                    <i class="fa fa-comments text-gray-600"></i>
                    {{ song.commentCount }}
                </span>
            </router-link>
        </div>
    </li>
</template>

<script>
export default {
    name: "SongItem",
    props: {
        song: {
            type: Object,
            required: true,
        },
    },
};
</script>