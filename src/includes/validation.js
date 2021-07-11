import {
    Form as VeeForm,
    Field as VeeField,
    defineRule,
    ErrorMessage,
    configure,
} from "vee-validate";
import {
    required,
    min,
    max,
    email,
    confirmed,
    alpha_spaces as alphaSpaces,
} from "@vee-validate/rules";

export default {
    install(app) {
        app.component("VeeForm", VeeForm);
        app.component("VeeField", VeeField);
        app.component("ErrorMessage", ErrorMessage);

        defineRule("required", required);
        defineRule("min", min);
        defineRule("max", max);
        defineRule("email", email);
        defineRule("passwords_mismatch", confirmed);
        defineRule("alpha_spaces", alphaSpaces);

        configure({
            generateMessage: (ctx) => {
                const messages = {
                    required: `The ${ctx.field} field is required.`,
                    min: `The ${ctx.field} field is too short.`,
                    max: `The ${ctx.field} field is too long.`,
                    alpha_spaces: `The ${ctx.field} field may only contain alphabetical characters and spaces.`,
                    email: `The ${ctx.field} field must be a valid email.`,
                    passwords_mismatch: "The passwords need to match.",
                };

                const message = messages[ctx.rule.name]
                    ? messages[ctx.rule.name]
                    : `The ${ctx.field} field is invalid.`;

                return message;
            },
            validateOnBlur: true,
            validateOnChange: true,
            validateOnInput: false,
            validateOnModelUpdate: true,
        });
    },
};
