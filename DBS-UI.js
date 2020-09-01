// ==UserScript==
// @name         DBS UI
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Summarise T&C and Privacy Policies into easily digestable summary.
// @author       You
// @include      http://*/*
// @include      https://*/*
// @grant        GM_addStyle
// @require      http://code.jquery.com/jquery-latest.js
// ==/UserScript==

const $ = window.jQuery;

(function () {
    'use strict';

    // Your code here...
    $(document).ready(() => {
        if (window.self === window.top) {

            const createPopup = () => {
                let popup = document.createElement('div');

                let expenditureTitle = "<div id='expenditureTitle' class='barTitle'>This month's epxenditures:</div><div id='expenditureAmt' class='barAmt'>0/0</div>"
                let expenditureBar = '<div><progress id="expenditureBar" value="0" max="100" /></div>'

                let welcomeText = '<div id="welcomeText">Welcome Jane Pearson</div>';
                let contentBox = '<div id="contentBox">' + expenditureTitle + expenditureBar + '</div>';
                popup.setAttribute('id', 'popup');
                popup.innerHTML = welcomeText + '<br/>' + contentBox;
                document.body.appendChild(popup);
                $('#popup').toggle();

                return popup;
            }

            const updateExpenditureBar = (value, max) => {
                document.getElementById('expenditureAmt').innerHTML = `${value}/${max}`;
                document.getElementById('expenditureBar').value = value;
                document.getElementById('expenditureBar').max = max;
            }

            const findPrice = () => {
                let contentBox = document.getElementById('contentBox');
                let elements = document.querySelectorAll('[id^="price"]');

                let totalPrice = 0;
                for (let elem of elements) {
                    let price = elem.textContent.replace(/[^\d.]/g, '');
                    console.log(price);

                    if (price.length > 0) {
                        let count = (price.match(/\d[.]\d/g) || []).length;
                        console.log(count);
                        if (count < 2) {
                            totalPrice += parseFloat(price);
                            console.log("Total price: " + totalPrice.toFixed(2));
                        }
                    }
                }

                if (totalPrice > 0) {
                    contentBox.innerHTML += '<br/>' + generatePriceBar(totalPrice);
                }
            }

            const generatePriceBar = (addition) => {

                let value = document.getElementById('expenditureBar').value;
                let max = document.getElementById('expenditureBar').max;

                let priceTitle = '<div id="priceTitle" class="barTitle">Potential expenditure:</div><div id="priceAmt" class="barAmt">' + (addition + value) + '/' + max + '</div>'
                let priceBar = '<div><progress id="priceBar" value="' + (addition + value) + '" max="' + max + '" /></div>'

                let priceContent = priceTitle + priceBar;
                return priceContent;
            }

            //creates icon box for button
            let imgBox = '<img id="iconBox" src="https://imgur.com/LSfNI8l.png"/>';

            //create button to click to start chosen function;
            let zNode = document.createElement('div');
            zNode.innerHTML = '<button id="iconBtn" type="button">' + imgBox + '</button>';
            zNode.setAttribute('id', 'btnContainer');
            document.body.appendChild(zNode);
            createPopup();
            updateExpenditureBar(500,1000);
            findPrice();

            $('#iconBtn').on('click', () => $("#popup").toggle());

            GM_addStyle(`
                #btnContainer {
                    position:               fixed;
                    top:                    2px;
                    right:                  10px;
                    background:             transparent;
                    border:                 0;
                    margin:                 0;
                    opacity:                0.9;
                    z-index:                9999;
                    padding:                0;
                }
                #iconBtn {
                    height:                 2em;
                    width:                  2em;
                    cursor:                 pointer;
                    background:             white;
                    border-radius:          4px;
                }
                #iconBtn:hover {
                    background:             #f7f7f7;
                }
                #popup {
                    position:               fixed;
                    top:                    40px;
                    right:                  10px;
                    z-index:                9999;
                    border:                 1px outset black;
                    background:             #f7f7f7;
                    padding:                1em;
                    align-items:            center;
                    border-radius:          10px;
                    width:                  16em;
                    max-height:             80%;
                    box-shadow:             1px 2px 4px rgba(0, 0, 0, 0.3);
                    display:                flex;
                    flex-direction:         column;
                }
                #iconBox {
                    width:                  100%;
                }
                #logoBox {
                    background:             transparent;
                    width:                  auto;
                    max-height:             1.5em;
                    border:                 0;
                    margin-bottom:          0.1em;
                }
                #contentBox {
                    border:                 0;
                    font-family:            'Karla';
                    font-size:              12px;
                    text-align:             center;
                }
                progress {
                    border-radius:          4px;
                    width:                  80%;
                    height:                 8px;
                    box-shadow:             1px 1px 1px rgba( 0, 0, 0, 0.1 );
                }
                progress::-webkit-progress-bar {
                    background-color:       #cfcfcf;
                    border-radius:          7px;
                }
                progress::-webkit-progress-value {
                    background-color:       #ff8f8f;
                    border-radius:          7px;
                    box-shadow:             1px 1px 1px 1px rgba( 0, 0, 0, 0.2 );
                }
                #welcomeText {
                    text-align:             center;
                    font-family:            'Karla';
                    font-size:              14px;
                }
                .barTitle {
                    text-align:             center;
                    font-family:            'Karla';
                    font-size:              12px;
                    color:                  #4f4f4f;
                }
                .barAmt {
                    text-align:             center;
                    font-family:            'Karla';
                    font-size:              16px;
                    margin-top:             0.3em;
                    margin-bottom:          0.1em;
                }
                #summaryTable{
                    background:             #f7f7f7;
                    border:                 0;
                }
                .sentenceCol{
                    width:                  95%;
                    vertical-align:         middle;
                }
                .sentenceBox{
                    border:                 1px #999999;
                    border-style:           solid;
                    background:             #fafafa;
                    padding:                0.5em 1em;
                    margin:                 0.5em 0.1em;
                    border-radius:          6px;
                    font-family:            'Karla';
                    font-size:              12px;
                }
                .summaryRows{
                    background:             #f7f7f7;
                }
                .ratingIconCol{
                    vertical-align:         middle;
                }
                .ratingIconBox{
                    max-height:             2em;
                    margin-top:             1em;
                    width:                  auto;
                }
                .statsTextCol{
                    vertical-align:         middle;
                }
                .statsIconCol{
                    flex:                   1;
                    display:                flex;
                    align-items:            center;
                    flex-direction:         column;
                }
                ` );
        }
    });
})();