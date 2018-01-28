module.exports = {
  "plugins": [
    "react"
  ],
  "extends": ["eslint:recommended", "plugin:react/recommended"],
  "env": {
    "browser": 1,
    "node": 1,
    "mocha": 1,
    "es6": 1
  },
  "rules": {
    "react/display-name": 0,

    // Separate the rules into blocks based on what plugin they come from.
    // Default rules are split up based on sections found on the eslint rules page.
    // Rules should be sorted alphabetically inside each section.

    "strict": 0,

    // Possible Errors
    "comma-dangle": [2, "always-multiline"], // disallow or enforce trailing commas
    "no-cond-assign": 2, // disallow assignment in conditional expressions
    "no-console": 0, // disallow use of console in the node environment
    "no-constant-condition": 2, // disallow use of constant expressions in conditions
    "no-control-regex": 0, // disallow control characters in regular expressions
    "no-debugger": 0, // disallow use of debugger
    "no-dupe-args": 2, // disallow duplicate arguments in functions
    "no-dupe-keys": 2, // disallow duplicate keys when creating object literals
    "no-duplicate-case": 2, // disallow a duplicate case label
    "no-empty": 2, // disallow empty statements
    "no-empty-character-class": 0, // disallow the use of empty character classes in regular expressions
    "no-ex-assign": 2, // disallow assigning to the exception in a catch block
    "no-extra-boolean-cast": 2, // disallow double-negation boolean casts in a boolean context
    "no-extra-parens": [2, "functions"], // disallow unnecessary parentheses
    "no-extra-semi": 2, // disallow unnecessary semicolons
    "no-func-assign": 2, // disallow overwriting functions written as function declarations
    "no-inner-declarations": [2, "functions"], // disallow function or variable declarations in nested blocks
    "no-invalid-regexp": 0, // disallow invalid regular expression strings in the RegExp constructor
    "no-irregular-whitespace": 2, // disallow irregular whitespace outside of strings and comments
    "no-negated-in-lhs": 0, // disallow negation of the left operand of an in expression
    "no-obj-calls": 2, // disallow the use of object properties of the global object (Math and JSON) as functions
    "no-regex-spaces": 0, // disallow multiple spaces in a regular expression literal
    "no-sparse-arrays": 0, // disallow sparse arrays
    "no-undef": 2, // disallow use of undeclared variables unless mentioned in a /*global */ block
    "no-unexpected-multiline": 2, // avoid code that looks like two expressions but is actually one
    "no-unreachable": 2, // disallow unreachable statements after a return, throw, continue, or break statement
    "no-unused-vars": 2, // disallow declaration of variables that are not used in the code
    "no-use-before-define": [2, "nofunc"], // disallow use of variables before they are defined
    "use-isnan": 2, // disallow comparisons with the value NaN
    "valid-jsdoc": [1, {
      "requireReturn": false,
      "requireReturnDescription": false,
      "requireReturnType": false
    }], // Ensure JSDoc comments are valid
    "valid-typeof": 2, // Ensure that the results of typeof are compared against a valid string

    // Best Practices
    "accessor-pairs": 2, // Enforces getter/setter pairs in objects
    "block-scoped-var": 0, // treat var statements as if they were block scoped
    "complexity": 2, // specify the maximum cyclomatic complexity allowed in a program
    "consistent-return": 2, // require return statements to either always or never specify values
    "curly": 0, // specify curly brace conventions for all control statements
    "default-case": 0, // require default case in switch statements
    "dot-location": 0, // enforces consistent newlines before or after dots
    "dot-notation": 2, // encourages use of dot notation whenever possible
    "eqeqeq": [2, "smart"], // require the use of === and !==
    "guard-for-in": 0, // make sure for-in loops have an if statement
    "no-alert": 0, // disallow the use of alert, confirm, and prompt
    "no-caller": 0, // disallow use of arguments.caller or arguments.callee
    "no-case-declarations": 0, // disallow lexical declarations in case clauses
    "no-div-regex": 0, // disallow division operators explicitly at beginning of regular expression
    "no-else-return": 2, // disallow else after a return in an if
    "no-empty-label": 0, // disallow use of labels for anything other than loops and switches
    "no-empty-pattern": 0, // disallow use of empty destructuring patterns
    "no-eq-null": 0, // disallow comparisons to null without a type-checking operator
    "no-eval": 0, // disallow use of eval()
    "no-extend-native": 0, // disallow adding to native types
    "no-extra-bind": 2, // disallow unnecessary function binding
    "no-fallthrough": 0, // disallow fallthrough of case statements
    "no-floating-decimal": 0, // disallow the use of leading or trailing decimal points in numeric literals
    "no-implicit-coercion": 0, // disallow the type conversions with shorter notations
    "no-implied-eval": 0, // disallow use of eval()-like methods
    "no-invalid-this": 0, // disallow this keywords outside of classes or class-like objects
    "no-iterator": 0, // disallow usage of __iterator__ property
    "no-labels": 0, // disallow use of labeled statements
    "no-lone-blocks": 2, // disallow unnecessary nested blocks
    "no-loop-func": 0, // disallow creation of functions within loops
    "no-magic-numbers ": 0, // isallow the use of magic numbers
    "no-multi-spaces": 0, // disallow use of multiple spaces
    "no-multi-str": 0, // disallow use of multiline strings
    "no-native-reassign": 0, // disallow reassignments of native objects
    "no-new": 0, // disallow use of the new operator when not part of an assignment or comparison
    "no-new-func": 0, // disallow use of new operator for Function object
    "no-new-wrappers": 0, // disallows creating new instances of String,Number, and Boolean
    "no-octal": 0, // disallow use of octal literals
    "no-octal-escape": 0, // disallow use of octal escape sequences in string literals, such as var foo = "Copyright \251";
    "no-param-reassign": 0, // disallow reassignment of function parameters
    "no-process-env": 0, // disallow use of process.env
    "no-proto": 0, // disallow usage of __proto__ property
    "no-redeclare": 2, // disallow declaring the same variable more than once
    "no-return-assign": 0, // disallow use of assignment in return statement
    "no-script-url": 0, // disallow use of javascript: urls.
    "no-self-compare": 0, // disallow comparisons where both sides are exactly the same
    "no-sequences": 0, // disallow use of the comma operator
    "no-throw-literal": 0, // restrict what can be thrown as an exception
    "no-unused-expressions": 0, // disallow usage of expressions in statement position
    "no-useless-call": 0, // disallow unnecessary .call() and .apply()
    "no-useless-concat": 0, // disallow unnecessary concatenation of literals or template literals
    "no-void": 0, // disallow use of the void operator
    "no-warning-comments": 0, // disallow usage of configurable warning terms in comments - e.g. TODO or FIXME
    "no-with": 0, // disallow use of the with statement
    "radix": 0, // require use of the second argument for parseInt()
    "vars-on-top": 0, // require declaration of all vars at the top of their containing scope
    "wrap-iife": 0, // require immediate function invocation to be wrapped in parentheses
    "yoda": 0, // require or disallow Yoda conditions

    // Stylistic Issues
    "array-bracket-spacing": [2, "never"], // enforce spacing inside array brackets
    "block-spacing": 0, // disallow or enforce spaces inside of single line blocks
    "brace-style": [2, "1tbs"], // enforce one true brace style
    "camelcase": 2, // require camel case names
    "comma-spacing": 2, // enforce spacing before and after comma
    "comma-style": 2, // enforce one true comma style
    "computed-property-spacing": 0, // require or disallow padding inside computed properties
    "consistent-this": 0, // enforce consistent naming when capturing the current execution context
    "eol-last": 2, // enforce newline at the end of file, with no multiple empty lines
    "func-names": 0, // require function expressions to have a name
    "func-style": [2, "declaration",  {"allowArrowFunctions": true}], // enforce use of function declarations or expressions
    "id-length": 0, // this option enforces minimum and maximum identifier lengths (variable names, property names etc.)
    "id-match": 0, // require identifiers to match the provided regular expression
    "indent": [2, 2], // specify tab or space width for your code
    "jsx-quotes": [2, "prefer-double"], // specify whether double or single quotes should be used in JSX attributes
    "key-spacing": 2, // enforce spacing between keys and values in object literal properties
    "keyword-spacing": 2, // require a space after certain keywords
    "linebreak-style": [2, "unix"], // disallow mixed 'LF' and 'CRLF' as linebreaks
    "lines-around-comment": 2, // enforce empty lines around comments
    "max-depth": 0, // specify the maximum depth that blocks can be nested
    "max-len": 0, // specify the maximum length of a line in your program
    "max-nested-callbacks": 0, // specify the maximum depth callbacks can be nested
    "max-params": 0, // limits the number of parameters that can be used in the function declaration.
    "max-statements": 0, // specify the maximum number of statement allowed in a function
    "new-cap": [2, { "capIsNew": false }], // require a capital letter for constructors
    "new-parens": 2, // disallow the omission of parentheses when invoking a constructor with no arguments
    "newline-after-var": 0, // require or disallow an empty newline after variable declarations
    "no-array-constructor": 0, // disallow use of the Array constructor
    "no-bitwise": 0, // disallow use of bitwise operators
    "no-continue": 0, // disallow use of the continue statement
    "no-inline-comments": 0, // disallow comments inline after code
    "no-lonely-if": 0, // disallow if as the only statement in an else block
    "no-mixed-spaces-and-tabs": 2, // disallow mixed spaces and tabs for indentation
    "no-multiple-empty-lines": [1, { "max": 3 }], // disallow multiple empty lines
    "no-negated-condition": 0, // disallow negated conditions
    "no-nested-ternary": 2, // disallow nested ternary expressions
    "no-new-object": 0, // disallow the use of the Object constructor
    "no-plusplus": 0, // disallow use of unary operators, ++ and --
    "no-restricted-syntax": 0, // disallow use of certain syntax in code
    "no-spaced-func": 0, // disallow space between function identifier and application
    "no-ternary": 0, // disallow the use of ternary operators
    "no-trailing-spaces": 2, // disallow trailing whitespace at the end of lines
    "no-underscore-dangle": 0, // disallow dangling underscores in identifiers
    "no-unneeded-ternary": 2, // disallow the use of ternary operators when a simpler alternative exists
    "object-curly-spacing": [2, "never"], // require or disallow padding inside curly braces
    "one-var": 0, // require or disallow one variable declaration per function
    "operator-assignment": 0, // require assignment operator shorthand where possible or prohibit it entirely
    "operator-linebreak": 0, // enforce operators to be placed before or after line breaks
    "padded-blocks": 0, // enforce padding within blocks
    "quote-props": 0, // require quotes around object literal property names
    "quotes": [2, "double"], // specify whether backticks, double or single quotes should be used
    "require-jsdoc": 0, // Require JSDoc comment
    "semi": [2, "never"], // require or disallow use of semicolons instead of ASI
    "semi-spacing": 0, // enforce spacing before and after semicolons
    "sort-vars": 2, // sort variables within the same declaration block
    "space-before-blocks": 2, // space-before-blocks
    "space-before-function-paren": [2, "never"], // require or disallow a space before function opening parenthesis
    "space-before-keywords": 0, // require a space before certain keywords
    "space-in-parens": [2, "never"], // require or disallow spaces inside parentheses
    "space-infix-ops": 2, // require spaces around operators
    "space-return-throw-case": 0, // require a space after return, throw, and case
    "space-unary-ops": 0, // require or disallow spaces before/after unary operators
    "spaced-comment": 2, // require or disallow a space immediately following the // or /* in a comment
    "wrap-regex": 0, // require regex literals to be wrapped in parentheses

    // ECMAScript 6
    "arrow-body-style": 0, // require braces in arrow function body
    "arrow-parens": 2, // require parens in arrow function arguments
    "arrow-spacing": 2, // require space before/after arrow function's arrow
    "constructor-super": 2, // verify calls of super() in constructors
    "generator-star-spacing": 0, // enforce spacing around the * in generator functions
    "no-arrow-condition": 0, // disallow arrow functions where a condition is expected
    "no-class-assign": 0, // disallow modifying variables of class declarations
    "no-const-assign": 2, // disallow modifying variables that are declared using const
    "no-dupe-class-members": 2, // disallow duplicate name in class members
    "no-this-before-super": 2, // disallow use of this/super before calling super() in constructors.
    "no-var": 2, // require let or const instead of var
    "object-shorthand": 2, // require method and property shorthand syntax for object literals
    "prefer-arrow-callback": 0, // suggest using arrow functions as callbacks
    "prefer-const": 2, // suggest using const declaration for variables that are never modified after declared
    "prefer-reflect": 0, // suggest using Reflect methods where applicable
    "prefer-spread": 0, // suggest using the spread operator instead of .apply().
    "prefer-template": 2, // suggest using template literals instead of strings concatenation
    "require-yield": 0 // disallow generator functions that do not have yield
  }
}
