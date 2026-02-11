module.exports = {
 env: {
		browser: true,
		es6: true,
		node: true,
	},
	extends: [
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: 'tsconfig.eslint.json',
		sourceType: 'module',
	},
	plugins: [
		'eslint-plugin-import',
		'eslint-plugin-jsdoc',
		'eslint-plugin-prefer-arrow',
	],
	root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
	rules: {
		'@typescript-eslint/adjacent-overload-signatures': 'error',
		'@typescript-eslint/array-type': 'off',
		'@typescript-eslint/ban-types': [
			'error',
			{
				types: {
					Object: {
						message: 'Avoid using the `Object` type. Did you mean `object`?',
					},
					Function: {
						message: 'Avoid using the `Function` type. Prefer a specific function type, like `() => void`.',
					},
					Boolean: {
						message: 'Avoid using the `Boolean` type. Did you mean `boolean`?',
					},
					Number: {
						message: 'Avoid using the `Number` type. Did you mean `number`?',
					},
					String: {
						message: 'Avoid using the `String` type. Did you mean `string`?',
					},
					Symbol: {
						message: 'Avoid using the `Symbol` type. Did you mean `symbol`?',
					},
				},
			},
		],
		'@typescript-eslint/consistent-type-assertions': 'error',
		'@typescript-eslint/consistent-type-definitions': 'error',
		'@typescript-eslint/dot-notation': 'error',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/explicit-member-accessibility': [
			'off',
			{
				accessibility: 'explicit',
			},
		],
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/member-delimiter-style': [
			'error',
			{
				multiline: {
					delimiter: 'semi',
					requireLast: true,
				},
				singleline: {
					delimiter: 'semi',
					requireLast: false,
				},
			},
		],
		'@typescript-eslint/member-ordering': 'off',
		'@typescript-eslint/naming-convention': [
			'off',
			{
				selector: 'variable',
				format: [
					'camelCase',
					'UPPER_CASE',
					'PascalCase',
					'snake_case',
				],
				leadingUnderscore: 'allow',
				trailingUnderscore: 'forbid',
			},
		],
		'@typescript-eslint/no-empty-function': 'off',
		'@typescript-eslint/no-empty-interface': 'error',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-misused-new': 'error',
		'@typescript-eslint/no-namespace': 'error',
		'@typescript-eslint/no-parameter-properties': 'off',
		'@typescript-eslint/no-shadow': [
			'error',
			{
				hoist: 'all',
			},
		],
		'@typescript-eslint/space-before-blocks': 'error',
		'@typescript-eslint/no-unused-expressions': 'off',
		'@typescript-eslint/no-use-before-define': 'off',
		'@typescript-eslint/no-var-requires': 'error',
		'@typescript-eslint/prefer-for-of': 'error',
		'@typescript-eslint/prefer-function-type': 'error',
		'@typescript-eslint/prefer-namespace-keyword': 'error',
		'@typescript-eslint/quotes': [
			'error',
			'single',
		],
		'@typescript-eslint/semi': [
			'error',
			'always',
		],
		'@typescript-eslint/triple-slash-reference': [
			'error',
			{
				path: 'always',
				types: 'prefer-import',
				lib: 'always',
			},
		],
		'@typescript-eslint/type-annotation-spacing': 'error',
		'@typescript-eslint/typedef': 'off',
		'@typescript-eslint/unified-signatures': 'error',

		'@typescript-eslint/no-unsafe-assignment': 'off',
		'@typescript-eslint/no-unsafe-member-access': 'off',
		'@typescript-eslint/no-unsafe-argument': 'off',
		'@typescript-eslint/no-unsafe-return': 'off',
		'@typescript-eslint/restrict-template-expressions': 'off',
		'@typescript-eslint/restrict-plus-operands': 'off',
		'max-classes-per-file': 'off',

		/*
            no plans to implement yet
        */
		'@typescript-eslint/unbound-method': 'off',

		/*
            to be implemented in their own ticket
        */
		'@typescript-eslint/no-floating-promises': 'off',
		'@typescript-eslint/require-await': 'off',
		'@typescript-eslint/no-misused-promises': 'off',
		'@typescript-eslint/no-unsafe-call': 'off',
		'@typescript-eslint/no-unnecessary-type-assertion': 'off',

		// handled:
		'no-unused-vars': 'off',
		'@typescript-eslint/no-unused-vars': ['error', { args: 'none', ignoreRestSiblings: true }],
		'max-len': ['error', { code: 160, ignoreTrailingComments: true, ignoreTemplateLiterals: true, ignoreStrings: true }],

		'indent': 'off',
		'@typescript-eslint/indent': ['error', 'tab', { ignoredNodes: ['ConditionalExpression'], SwitchCase: 1 }],
		'arrow-body-style': 'error',
		'space-in-parens': ['error', 'never'],
		'arrow-parens': [
			'off',
			'always',
		],
		'brace-style': [
			'error',
			'1tbs',
		],
		'comma-dangle': [
			'error',
			'always-multiline',
		],
		'func-call-spacing': 'off',
		'@typescript-eslint/func-call-spacing': ['error', 'never'],
		'space-infix-ops': 'off',
		'@typescript-eslint/space-infix-ops': 'error',
		'complexity': 'off',
		'constructor-super': 'error',
		'curly': 'error',
		'dot-notation': 'off',
		'eol-last': 'error',
		'eqeqeq': [
			'error',
			'smart',
		],
		'guard-for-in': 'error',
		'id-denylist': [
			'error',
			'any',
			'Number',
			'number',
			'String',
			'string',
			'Boolean',
			'boolean',
			'Undefined',
			'undefined',
		],
		'id-match': 'error',
		'import/order': 'off',
		'jsdoc/check-alignment': 'error',
		'jsdoc/check-indentation': 'error',
		'jsdoc/tag-lines': [
			'error',
			'any',
			{
				startLines: 1,
			},
		],
		'new-parens': 'error',
		'no-bitwise': 'error',
		'no-caller': 'error',
		'no-cond-assign': 'error',
		'no-debugger': 'error',
		'no-empty': 'off',
		'no-empty-function': 'off',
		'no-eval': 'error',
		'no-fallthrough': 'off',
		'no-invalid-this': 'off',
		'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }],
		'no-new-wrappers': 'error',
		'no-redeclare': 'error',
		'no-shadow': 'off',
		'no-throw-literal': 'error',
		'no-trailing-spaces': 'error',
		'no-undef-init': 'error',
		'no-underscore-dangle': 'off',
		'no-unsafe-finally': 'error',
		'no-unused-expressions': 'off',
		'no-unused-labels': 'error',
		'no-use-before-define': 'off',
		'no-var': 'error',
		'object-shorthand': 'error',
		'key-spacing': 'off',
		'@typescript-eslint/key-spacing': ['error', { mode: 'strict', beforeColon: false, afterColon: true }],
		'one-var': [
			'error',
			'never',
		],
		'keyword-spacing': 'off',
		'@typescript-eslint/keyword-spacing': 'error',
		'prefer-arrow/prefer-arrow-functions': 'error',
		'prefer-const': ['error', {
			destructuring: 'all',
			ignoreReadBeforeAssign: false,
		}],
		'quote-props': [
			'error',
			'consistent-as-needed',
		],
		'quotes': 'off',
		'comma-spacing': 'off',
		'@typescript-eslint/comma-spacing': [
			'error',
			{
				before: false,
				after: true,
			},
		],
		'radix': 'error',
		'semi': 'off',
		'object-curly-spacing': 'off',
		'@typescript-eslint/object-curly-spacing': ['error', 'always'],
		'space-before-function-paren': [
			'error',
			{
				anonymous: 'never',
				asyncArrow: 'always',
				named: 'never',
			},
		],
		'spaced-comment': [
			'error',
			'always',
			{
				markers: [
					'/',
				],
			},
		],
		'use-isnan': 'error',
		'valid-typeof': 'off',
		'no-multi-spaces': ['error'],
	},
};
