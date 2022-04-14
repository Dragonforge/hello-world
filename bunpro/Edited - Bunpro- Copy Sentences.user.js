// ==UserScript==
// @name         Bunpro: Copy Sentences
// @namespace    http://tampermonkey.net/
// @version      0.4.11
// @description  Adds buttons to copy the Japanese and English sentences in review.
// @author       Kumirei

// @include      *bunpro.jp/study*
// @exclude      *community.bunpro.jp*
// @require      https://greasyfork.org/scripts/370623-bunpro-helpful-events/code/Bunpro:%20Helpful%20Events.js?version=974369
// @require      https://greasyfork.org/scripts/370219-bunpro-buttons-bar/code/Bunpro:%20Buttons%20Bar.js?version=654288
// @grant        none
// ==/UserScript==
(function() {

    var jpInnerHTML = "$(\'.study-question-japanese > div\')[0]";
    var jp = "copyText(parseSentence2("+jpInnerHTML+"));";

    //add buttons
    $('HTML')[0].addEventListener('quiz-page', function() {
        buttonsBar.addButton('copyJP', 'Copy JP', jp);
        buttonsBar.addButton('copyEN', 'Copy EN', 'copyText($(\'.study-question-english-hint > span\')[0].innerText);');
    });
})();

parseSentence2 = function(sentenceElem) {

    var sentence = "";

    var list = sentenceElem.childNodes;

    list.forEach(
        function(currentValue, currentIndex, listObj) {

            var elem = currentValue;
            var name = currentValue.tagName;
            var classname = currentValue.className;

            if (name == "SPAN") {
                if(["study-area-input"].includes(classname)){
                    sentence += "____";
                } else if (["vocab-popout", "gp-popout"].includes(classname)) {
                    const items = elem.childNodes;
                    items.forEach(function (item) {
                        if (item.tagName == "RUBY"){
                            sentence += item.childNodes[0].data;
                        } else {
                            sentence += item.textContent;
                        }
                    });
                }
            } else if (name == "RUBY") {
                sentence += elem.childNodes[0].data;
            } else {
                if (elem instanceof HTMLElement){
                    sentence += elem.textContent;
                } else if (elem instanceof Text){
                    sentence += elem.textContent;
                }
            }
        }
    );

    return sentence;
};


//copies the text
copyText = function(text) {
    var textArea = document.createElement("textarea");
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = 0;
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Copied Sentence:', text);
    } catch (err) {
        console.log('Oops, unable to copy');
    }

    document.body.removeChild(textArea);
};