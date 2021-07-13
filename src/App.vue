<template>
    <app-header />

    <router-view></router-view>

    <auth-modal v-show="authModalShow" />
</template>

<script>
import { mapState, mapActions } from "vuex";

import AppHeader from "@/components/AppHeader.vue";
import AuthModal from "@/components/AuthModal.vue";

export default {
    name: 'App',
    components: {
        "app-header": AppHeader,
        "auth-modal": AuthModal,

    },
    computed: {
        ...mapState(["authModalShow"])
    },
    methods: {
        ...mapActions(["initLogin"]),
    },
    created() {
        this.initLogin();
    }
}
</script>
