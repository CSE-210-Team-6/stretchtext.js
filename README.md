stretchtext.js
==============

An implementation of StretchText for JavaScript, which makes it possible to show and hide nested information on web pages. For details, demos, and instructions on using the library [read this blog post](http://codinginparadise.org/ebooks/html/blog/stretchtext.html). The original repo can be seen here: [BradNeuberg/stretchtext.js](https://github.com/BradNeuberg/stretchtext.js)

Our docs can be seen here: [docs](https://cse210-team6-stretchtest.netlify.app/out/global)

# Changelog

## Javascript

The overarching goal was to convert the code from [ES5](https://www.w3schools.com/js/js_es5.asp) to [ES6](https://www.w3schools.com/js/js_es6.asp).

For this, we majorly changed the following.

1. Converted variable declations which used `var` or `let` to `const`.
2. Using `arrow functions`.
3. Using `forEach()` instead of `Array.prototype.forEach()` for iterating.
4. Using `module.exports`
5. All the functions were initially declared inside the IIFE function. We declared a majority of them in the global scope.


## HTML
  
The following are the changes made to HTML:  
  
1. Added lang attribute
2. Changed user-scalable=no to initial-scale=1 to enable user to zoom (enhances accesibility)
3. Added title tag, which is considered good practice.
  
  
## CSS

1) Changed all the color names to hsl which is more understandable to humans.
2) Removed duplicate transition declarations. Redundant with modern browsers.
3) Made the padding left and right into a single tag making the code concise and easy to read.

## Testing

We used Jest, which is a JavaScript testing framework. It requires `npm`.

Run `jest` to run the tests.

# Changes
 

