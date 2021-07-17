<template>
    <div class="border border-gray-200 p-3 mb-4 rounded">
        <!-- Song Name -->
        <div v-show="!showForm">
            <h4 class="inline-block text-2xl font-bold">
                {{ song.modifiedName }}
            </h4>
            <button
                type="button"
                class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
                @click.prevent="deleteSong"
            >
                <i class="fa fa-times"></i>
            </button>
            <button
                type="button"
                class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
                @click.prevent="showForm = !showForm"
            >
                <i class="fa fa-pencil-alt"></i>
            </button>
        </div>

        <!-- Edit Form -->
        <div v-show="showForm">
            <!-- Alert Message -->
            <div
                v-if="showAlert"
                class="text-white text-center font-bold p-4 mb-4"
                :class="alertVariant"
            >
                {{ alertMessage }}
            </div>

            <vee-form
                :validation-schema="schema"
                :initial-values="song"
                @submit="edit"
            >
                <!-- Title -->
                <div class="mb-3">
                    <label class="inline-block mb-2">Song Title</label>
                    <vee-field
                        type="text"
                        name="modifiedName"
                        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
                            transition duration-500 focus:outline-none focus:border-black rounded"
                        placeholder="Enter Song Title"
                        @input="updateUnsavedFlag(true)"
                    />
                    <ErrorMessage
                        class="text-red-600"
                        name="modifiedName"
                    />
                </div>

                <!-- Genre -->
                <div class="mb-3">
                    <label class="inline-block mb-2">Genre</label>
                    <vee-field
                        type="text"
                        name="genre"
                        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
                            transition duration-500 focus:outline-none focus:border-black rounded"
                        placeholder="Enter Genre"
                        @input="updateUnsavedFlag(true)"
                    />
                    <ErrorMessage
                        class="text-red-600"
                        name="genre"
                    />
                </div>

                <!-- Submit Form -->
                <button
                    type="submit"
                    class="py-1.5 px-3 rounded text-white bg-green-600"
                >
                    Submit
                </button>

                <!-- Go Back -->
                <button
                    type="button"
                    class="py-1.5 px-3 rounded text-white bg-gray-600"
                    :disabled="inSubmission"
                    @click.prevent="showForm = false"
                >
                    Go Back
                </button>
            </vee-form>
        </div>
    </div>
</template>

<script>
import { songsCollection, storage } from "@/includes/firebase";

export default {
    name: "CompositionItem",
    props: {
        song: {
            type: Object,
            required: true,
        },
        updateSong: {
            type: Function,
            required: true,
        },
        removeSong: {
            type: Function,
            required: true,
        },
        updateUnsavedFlag: {
            type: Function,
            required: true,
        },
        index: {
            type: Number,
            required: true,
        },
    },
    data() {
        return {
            showForm: false,
            schema: {
                modifiedName: "required",
                genre: "alpha_spaces",
            },
            inSubmission: false,
            showAlert: false,
            alertVariant: "bg-blue-500",
            alertMessage: "Please wait while the song info is updated...",
        };
    },
    methods: {
        async edit(values) {
            this.inSubmission = true;
            this.showAlert = true;
            this.alertVariant = "bg-blue-500";
            this.alertMessage = "Please wait while the song info is updated...";

            try {
                await songsCollection.doc(this.song.docID).update(values);
            } catch (error) {
                this.inSubmission = false;
                this.alertVariant = "bg-red-500";
                this.alertMessage =
                    "Something went wrong! Please try again later.";
            }

            this.updateSong(this.index, values);
            this.updateUnsavedFlag(false)

            this.inSubmission = false;
            this.alertVariant = "bg-green-500";
            this.alertMessage = "Song successfully updated!";
        },
        async deleteSong() {
            const storageRef = storage.ref();
            const songRef = storageRef.child(`songs/${this.song.originalName}`);

            await songRef.delete();

            await songsCollection.doc(this.song.docID).delete();

            this.removeSong(this.index);
        }
    },
};
</script>