const purgecss = require('@fullhuman/postcss-purgecss');

module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        loader: 'postcss-loader',
        options: {
          postcssOptions: {
            ident: 'postcss',
            syntax: 'postcss-scss',
            plugins: [
              require('postcss-import'),
              require('tailwindcss')('./tailwind.config.js'),
              require('autoprefixer'),
              purgecss({
                content: ['**/*.html', '**/*.ts'],
                whitelistPatterns: [/^cdk-|mat-/],
                defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
              }),
            ],
          },
        },
      },
    ],
  },
};
