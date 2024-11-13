import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.tsx",
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ["Figtree", ...defaultTheme.fontFamily.sans],
            },
        },
        animation: {
            scaleIn: "scaleIn 0.3s",
            scaleOut: "scaleOut 0.3s",
            pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            spin: "spin 1s linear infinite;",
            ping: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;",
            accordion: "accordion 1s cubic-bezier(0, 0, 0.2, 1) infinite;",
            ring: "ring 4s .7s ease-in-out infinite",
        },
        keyframes: {
            scaleIn: {
                "0%": {
                    transform: "scale(0)",
                },
                "100%": {
                    transform: "scale(1)",
                },
            },
            scaleOut: {
                "0%": {
                    transform: "scale(1)",
                },
                "100%": {
                    transform: "scale(0)",
                },
            },
            pulse: {
                "50%": {
                    opacity: "0.5",
                },
            },
            spin: {
                from: {
                    transform: "rotate(0deg)",
                },
                to: {
                    transform: "rotate(360deg)",
                },
            },
            accordion: {
                "0%": {
                    transform: "scale(1.01)",
                },
                "50%": {
                    transform: "scale(1)",
                },
                "100%": {
                    transform: "scale(1.01)",
                },
            },
            ping: {
                "100%": {
                    transform: "scale(1.5)",
                    opacity: 0,
                },
            },
            ring: {
                "0%": { transform: "rotateZ(0)" },
                "1%": { transform: "rotateZ(30deg)" },
                "3%": { transform: "rotateZ(-28deg)" },
                "5%": { transform: "rotateZ(34deg)" },
                "7%": { transform: "rotateZ(-32deg)" },
                "9%": { transform: "rotateZ(30deg)" },
                "11%": { transform: "rotateZ(-28deg)" },
                "13%": { transform: "rotateZ(26deg)" },
                "15%": { transform: "rotateZ(-24deg)" },
                "17%": { transform: "rotateZ(22deg)" },
                "19%": { transform: "rotateZ(-20deg)" },
                "21%": { transform: "rotateZ(18deg)" },
                "23%": { transform: "rotateZ(-16deg)" },
                "25%": { transform: "rotateZ(14deg)" },
                "27%": { transform: "rotateZ(-12deg)" },
                "29%": { transform: "rotateZ(10deg)" },
                "31%": { transform: "rotateZ(-8deg)" },
                "33%": { transform: "rotateZ(6deg)" },
                "35%": { transform: "rotateZ(-4deg)" },
                "37%": { transform: "rotateZ(2deg)" },
                "39%": { transform: "rotateZ(-1deg)" },
                "41%": { transform: "rotateZ(1deg)" },
                "43%": { transform: "rotateZ(0)" },
                "100%": { transform: "rotateZ(0)" },
            },
        },
    },

    plugins: [forms, require("tailwind-scrollbar")({ nocompatible: true })],
};
