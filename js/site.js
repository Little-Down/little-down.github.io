// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your Javascript code.

$("head").append("<link rel=\"shortcut icon\" href=\"/favicon.ico\" type=\"image/x-icon\" />")

$.get('/header.html', function (data) {
    $("#header").html(data)
})
$.get('/footer.html', function (data) {
    $("#footer").html(data)
})