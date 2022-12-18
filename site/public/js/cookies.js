// This file is used to show a cookie banner to the user

// This code should go in your JavaScript file
const cookieBanner = document.getElementById('cookie-banner');
const acceptCookiesButton = document.getElementById('accept-cookies');

acceptCookiesButton.addEventListener('click', function() {
  // Set a cookie to indicate that the user has accepted cookies
  document.cookie = "cookies_accepted=true; expires=Fri, 31 Dec 9999 23:59:59 GMT";
  // Hide the cookie banner
  cookieBanner.style.display = 'none';
});

// Check if the user has already accepted cookies
if (document.cookie.indexOf('cookies_accepted=true') === -1) {
  // Show the cookie banner if the user has not accepted cookies
  cookieBanner.style.display = 'block';
} else {
  // Hide the cookie banner if the user has already accepted cookies
  cookieBanner.style.display = 'none';
}
