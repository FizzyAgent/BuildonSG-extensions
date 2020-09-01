// ==UserScript==
// @name         🔎 DBS Search
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Browser extension for DBS investment report search
// @author       You
// @include      *
// @grant        GM.xmlHttpRequest
// @run-at       context-menu
// ==/UserScript==

(function() {
    'use strict';

    const headers = document.querySelectorAll("h1");

    let headline = "";

    for (let header of headers) {
        if (headline.length < header.textContent.length) {
            headline = header.textContent;
        }
    }

    console.log(headline);
    openReport(headline);

    function openReport(headline) {

        const search_url = 'http://ec2-18-234-178-141.compute-1.amazonaws.com/recommendreport?headline='
        const para = headline.replace(" ", "_");

        // let jsonString = '{"headline" :' + headline + '}';
        // console.log(jsonString);

        GM.xmlHttpRequest({
            method: "GET",
            url: search_url + para,
            // data: jsonString,
            headers: {
                'Content-type':'application/x-www-form-urlencoded',
                // 'Content-type':'application/json',
            },
            onload: function(response) {
                let results = JSON.parse(response.responseText);
                window.open(results.url);
            }
        });
    }
})();