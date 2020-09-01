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

            const WARNING_COLOR = '#ff0000';
            const NORMAL_COLOR = '#000000'

            const createPopup = () => {
                let popup = document.createElement('div');

                let expenditureTitle = "<div id='expenditureTitle' class='barTitle'>This month's epxenditures:</div><div id='expenditureAmt' class='barAmt'>0/0</div>"
                
                let expenditureValue = '<div id="expenditureValue" class="bar barValue"></div>';
                let expenditureBg = '<div id="expenditureBg" class="bar barBg"></div>';
                let expenditureBar = '<div id="expenditureBar" class="bar barHolder">' + expenditureValue + expenditureBg +'</div>'

                let welcomeText = '<div id="welcomeText">Welcome Jane Pearson</div>';
                let contentBox = '<div id="contentBox">' + expenditureTitle + expenditureBar + '</div>';
                popup.setAttribute('id', 'popup');
                popup.innerHTML = welcomeText + '<br/>' + contentBox;
                document.body.appendChild(popup);
                $('#popup').toggle();

                return popup;
            }

            const updateExpenditureBar = (value, max) => {

                if (value > max) {
                    document.getElementById('expenditureAmt').style.color = WARNING_COLOR;
                }

                document.getElementById('expenditureAmt').innerHTML = `${value}/${max}`;
                let valueWidth = 100 * Math.min(value, max) / max + "%";
                let bgWidth = 100 * (max - Math.min(value, max)) / max + "%";
                document.getElementById('expenditureValue').style.width = valueWidth;
                document.getElementById('expenditureBg').style.width = bgWidth;
            }

            const findPrice = (value, max) => {
                let contentBox = document.getElementById('contentBox');
                let elements = document.querySelectorAll('[id^="price"]');

                let totalPrice = 0;
                let added = [];

                for (let elem of elements) {
                    let price = elem.textContent.replace(/[^\d.]/g, '').replace(/[.]$/g, '');
                    console.log(price);

                    if (price.length > 0 && !added.includes(price)) {
                        let count = (price.match(/\d[.]\d/g) || []).length;
                        console.log(count);
                        if (count < 2) {
                            added.push(price);
                            totalPrice += parseFloat(price);
                        }
                    }
                }

                console.log("Total price: " + totalPrice.toFixed(2))

                if (totalPrice > 0) {
                    contentBox.innerHTML += '<br/>' + generatePriceBar(value, max, totalPrice.toFixed(2));
                }
            }

            const generatePriceBar = (value, max, addition) => {

                let valueWidth = 100 * Math.min(value, max) / max + "%";
                let additonWidth = 100 * + Math.min(addition, max - Math.min(value, max)) / max + "%"
                let bgWidth = 100 * + Math.max(max - value - addition, 0) / max + "%"

                let priceValue = `<div id="priceValue" class="bar barValue" style="width:${valueWidth}"></div>`;
                let priceAddition = `<div id="priceAddition" class="bar barAddition" style="width:${additonWidth}; left:${valueWidth}"></div>`;
                let priceBg = `<div id="priceBg" class="bar barBg" style="width:${bgWidth}"></div>`;
                let priceBar = '<div id="priceBar" class="bar barHolder">' + priceValue + priceAddition + priceBg +'</div>'

                let newExpense = parseFloat(addition) + parseFloat(value);
                let color = NORMAL_COLOR;
                if (newExpense > max) {
                    color = WARNING_COLOR;
                }

                let priceTitle = `<div id="priceTitle" class="barTitle">Potential expenditure:</div><div id="priceAmt" class="barAmt" style="color:${color}">` + newExpense.toFixed(2) + '/' + max + '</div>'

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

            let current = 700, limit = 1000;

            updateExpenditureBar(current, limit);
            findPrice(current, limit);

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
                    padding:                2em;
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
                    align-items:            center;
                }
                .bar {
                    height:                 8px;
                    position:               absolute;
                }
                .barHolder {
                    width:                  80%;
                    left:                   10%;
                    box-shadow:             1px 1px 1px rgba( 0, 0, 0, 0.2 );
                }
                .barBg {
                    background-color:       #cfcfcf;
                    right:                  0%;
                }
                .barAddition {
                    background-color:       #ff2f2f;
                }
                .barValue {
                    background-color:       #ff8f8f;
                    left:                   0%
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