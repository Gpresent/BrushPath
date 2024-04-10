import { configDefaults, defineConfig } from "vitest/config";


export default defineConfig({
    define: {
        "import.meta.vitest": "undefined"
    },

    test: {
        environment: "jsdom",
        setupFiles: ['./vitest.setup.js'],
        exclude: [...configDefaults.exclude,

            '**/__tests__/**'

        ],
        includeSource: ["src/**/*.{js, ts]"]
    }
});