// ==UserScript==
// @name         Kanban Policies
// @namespace    http://assecobs.pl/
// @version      2024-01-19
// @description  Kanban Policies
// @author       Radosław Tandecki
// @match        https://*/secure/RapidBoard.jspa*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=assecobs.pl
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// ==/UserScript==

(function($) {
    'use strict';

    function createPolicyDiv(i, columnWidth, items) {
        var policyDiv = $('<div class="policy"></div>');
        var policyList = $('<ul class="policy-list"></ul>');

        items.forEach(function(item) {
            var listItem = $('<li>' + item + '</li>');
            listItem.css({
                'line-height': '12px',
                'word-wrap': 'break-word',
                'text-align': 'left',
                'font-size': '10px'
            });
            policyList.append(listItem);
        });

        policyList.css({
            'padding-left': '15px',
        });

        policyDiv.append(policyList);

        policyDiv.css({
            'width': columnWidth,
            'background-color': '#FFFF99',
            'color': 'black',
            'text-align': 'left', // align the text to the left
            'line-height': '30px',
            'margin-top': '5px',
            'padding': '2px',
            'display': 'flex',
            'justify-content': 'flex-start',
            'position': 'absolute',
            'box-shadow': '3px 3px 5px rgba(0, 0, 0, 0.3)',
            'display': items.length > 0 ? 'flex' : 'none'
        });

        return policyDiv;
    }

    function addPolicyArea(columns, policyLists, height) {
        var numberOfColumns = columns.length;
        var firstColumn = columns.first();
        var columnWidth = firstColumn.width();
        var backgroundColor = firstColumn.css('background-color');
        var policyArea = $('<div id="policy-area"></div>');
        policyArea.css({
            'width': '100%',
            'height': height,
            'background-color': backgroundColor,
            'color': 'black',
            'text-align': 'center',
            'line-height': '50px',
            'font-weight': 'bold',
            'position': 'relative',
            'display': 'flex',
            'flex-wrap': 'wrap',
            'justify-content': 'space-between',
            'margin-left': columnWidth / 2
        });

        $('#ghx-column-header-group').prepend(policyArea);

        for (var i = 1; i < numberOfColumns; i++) {
            var items = policyLists[i];
            var policyDiv = createPolicyDiv(i, columnWidth, items);
            policyArea.append(policyDiv);
        }
    }

    function adjustPolicyPositions(columns) {
        var columnPositions = [];
        columns.each(function() {
            var leftPosition = $(this).position().left;
            columnPositions.push(leftPosition);
        });

        var policies = $(".policy")
        policies.each(function(index) {
            if (index < columnPositions.length - 1) {
                var middlePosition = (columnPositions[index] + columnPositions[index + 1]) / 2;
                $(this).css("left", middlePosition - $(this).width() / 2);
            }
        });
    }

    $(document).ready(function() {
        setTimeout(function() {

            var url = new URL(window.location.href);
            var rapidView = url.searchParams.get("rapidView");

            var header = $("#ghx-column-headers");
            var columns = header.find('.ghx-column');
            var numberOfColumns = columns.length;
            var height = '150px'

            var policyLists = {}
            for (var i = 1; i <= numberOfColumns; i++) {
                if (!policyLists[i]) {
                    policyLists[i] = [];
                }
            }

            policyLists[1] = ['Zdefiniowany cel', 'Zdefiniowane kryteria akceptacji', 'Określony koszt opóźnienia', 'Zweryfikowane alternatywne rozwiązania', 'Określone czy wymagania wpisuje się w roadmapę', 'Ustalony projekt komercyjny', 'Ustalona lista Interesariuszy'];

            addPolicyArea(columns, policyLists, height);
            adjustPolicyPositions(columns);
        }, 1500);
    });

})(jQuery);
