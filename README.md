jQless-animate
==============

A JavaScript animate library with 4KB size

I come up with the idea of jQless.js when I was reading jQuery's source code. Sometimes we just need part of function of jQuery. For example we just need some DOM function, so we don't need to load the AJAX part. At this situation, a whole jQuery seems big and heavy. Here comes the jQless.js.

Use it just like use jQuery

Code Example

//Method chaining

$(function (){

$('#div1').css('background', 'red').css('width', '200px').css('height', '200px').css('margin', '10px');

});

//Animate

$(function (){

$('input').toggle(function (){

$('#div1').animate({width: 200, height: 200, opacity: 100});

});
