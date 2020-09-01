// ==UserScript==
// @name         🔎 DBS Search
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Browser extension for DBS investment report search
// @author       You
// @include      *
// @grant        none
// @run-at       context-menu
// ==/UserScript==

(function() {
    'use strict';

    const headers = document.querySelectorAll("h1");

    var headline = "";

    for (let header of headers) {
        if (headline.length < header.textContent.length) {
            headline = header.textContent;
        }
    }

    console.log(headline);
    openReport(headline);

    function openReport(headline) {
        window.open("https://www.google.com");
    }

})();