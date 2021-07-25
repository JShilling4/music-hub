/* eslint-disable no-useless-escape */
module.exports = {
    preset: "@vue/cli-plugin-unit-jest",
    moduleNameMapper: {
        "/^@/(.*)$/": "C:\Users\LoveO\Desktop\Code\music-hub\src\$1",
    },
    resolver: null,
    transform: {
        "^.+\\.vue$": "vue-jest",
    },
};
