module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'plugin:react/recommended',
        'airbnb',
    ],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 12,
        sourceType: 'module',
    },
    plugins: [
        'react',
    ],
    rules: {
        'linebreak-style': 0,
        'no-underscore-dangle': 0,
        'react/no-unstable-nested-components': [
            'error',
            { allowAsProps: true },
        ],
        indent: 'off',
        'react/jsx-indent': 'off',
        'react/jsx-indent-props': 'off',
        'react/jsx-filename-extension': 'off',
        'react/jsx-one-expression-per-line': 'off',
        'react/jsx-props-no-spreading': 'off',
        'no-alert': 'off',
        'no-restricted-globals': 'off',
        'eol-last': 'off',
    },
};