<template>
    <!-- Notifications -->
    <div
        v-if="registerShowAlert"
        class="text-white text-center font-bold p-5 mb-4"
        :class="registerAlertVariant"
    >
        {{ registerAlertMessage }}
    </div>

    <!-- Form -->
    <vee-form
        :validation-schema="registerValidationSchema"
        @submit="register"
    >
        <!-- Name -->
        <div class="mb-3">
            <label class="inline-block mb-2">Name</label>
            <vee-field
                type="text"
                name="name"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                    duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Enter Name"
            />
            <ErrorMessage
                class="text-red-600"
                name="name"
            />
        </div>

        <!-- Email -->
        <div class="mb-3">
            <label class="inline-block mb-2">Email</label>
            <vee-field
                name="email"
                type="email"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                    duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Enter Email"
            />
            <ErrorMessage
                class="text-red-600"
                name="email"
            />
        </div>

        <!-- Password -->
        <div class="mb-3">
            <label class="inline-block mb-2">Password</label>
            <vee-field
                v-slot="{ field, errors }"
                name="password"
                :bails="false"
            >
                <input
                    class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                        duration-500 focus:outline-none focus:border-black rounded"
                    type="password"
                    placeholder="Password"
                    v-bind="field"
                >
                <div
                    v-for="error in errors"
                    :key="error"
                    class="text-red-600"
                >
                    {{ error }}
                </div>
            </vee-field>
        </div>

        <!-- Confirm Password -->
        <div class="mb-3">
            <label class="inline-block mb-2">Confirm Password</label>
            <vee-field
                type="password"
                name="confirm_password"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                    duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Confirm Password"
            />
            <ErrorMessage
                class="text-red-600"
                name="confirm_password"
            />
        </div>

        <!-- Submit Form -->
        <button
            type="submit"
            :disabled="registerInSubmission"
            class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition
                hover:bg-purple-700"
        >
            Submit
        </button>
    </vee-form>
</template>

<script>
import { mapActions } from "vuex";

export default {
    name: "RegisterForm",
    data() {
        return {
            registerValidationSchema: {
                name: "required|min:3|max:100|alpha_spaces",
                email: "required|min:3|max:100|email",
                password: "required|min:3|max:32",
                confirm_password: "passwords_mismatch:@password",
            },
            registerInSubmission: false,
            registerShowAlert: false,
            registerAlertVariant: "bg-blue-500",
            registerAlertMessage: "Please wait while your account is created.",
        };
    },
    methods: {
        ...mapActions(["toggleLoggedInStatus", "registerUser"]),

        async register(values) {
            this.registerShowAlert = true;
            this.registerInSubmission = true;
            this.registerAlertVariant = "bg-blue-500";
            this.registerAlertMessage =
                "Please wait while your account is created.";

            // attempt to create the user account
            try {
                await this.registerUser(values);
            } catch (error) {
                this.registerInSubmission = false;
                this.registerAlertVariant = "bg-red-500";
                this.registerAlertMessage =
                    "An error occurred. Please try again.";
                console.log(error);
                return;
            }

            // successful login actions
            this.toggleLoggedInStatus(true);
            this.registerAlertVariant = "bg-green-500";
            this.registerAlertMessage = "Your account has been created.";
            window.location.reload();
        },
    },
};
</script>
