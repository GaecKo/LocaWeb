
var elements = document.getElementsByTagName("*");

for (var i = 0; i < elements.length; i++) {
  elements[i].style.backgroundColor = "<%- customs.bg_color %>";
}
