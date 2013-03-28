/*
 * Copyright (c) 2012 Gregory Jackson. All rights reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 */

/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, event */

/* Special HTML Characters Extension 
    to insert special HTML character codes
*/
define(function (require, exports, module) {
    'use strict';

    var
        CommandManager = brackets.getModule('command/CommandManager'),
        Menus = brackets.getModule('command/Menus'),
        EditorManager = brackets.getModule('editor/EditorManager'),
        ExtensionUtils = brackets.getModule('utils/ExtensionUtils'),
        DocumentManager = brackets.getModule('document/DocumentManager'),
        SpecialChars = require('text!specialHTMLChars.json'),
        specialChars = JSON.parse(SpecialChars),
        COMMAND_ID = 'specialhtmlchar.insert',
        MENU_NAME = 'Special HTML Character',
        iChars,
        iCharsLen = specialChars.quickLinks.length,
        menu,
        $specialCharsDialog = $('<div>', { 'class': 'specialHTMLChar' });

    ExtensionUtils.loadStyleSheet(module, 'style.css');

    /* Construction of popup dialog */
    $specialCharsDialog.append(
        function () {
            var $ULElement = $('<ul>');
            for (iChars = 0; iChars < iCharsLen; iChars++) {
                $ULElement.append(
                    $('<li>').append(
                        $('<a>', { 'href': '#', 'htmlcode': specialChars.quickLinks[iChars].code, 'text': specialChars.quickLinks[iChars].name }).prepend(
                            $('<span>', { 'class': 'quickChar', 'html': specialChars.quickLinks[iChars].code })
                        )
                    )
                );
            }
            return $ULElement;
        }
    ).hide();

    function showDialog() {
        $specialCharsDialog.css({ 'left': event.pageX - 16, 'top': event.pageY - 16 }).show().appendTo($('body'));
        $specialCharsDialog.on('mouseleave', function () {
            $specialCharsDialog.remove();
        }).find('ul').find('a').on('click', function (e) {
            var
                cCode = $(this).attr('htmlcode'),
                doc = DocumentManager.getCurrentDocument(),
                editor = EditorManager.getCurrentFullEditor(),
                pos = editor.getCursorPos();
            doc.replaceRange(cCode, pos);
            $specialCharsDialog.remove();
            editor.focus();
        });
    }

    CommandManager.register(MENU_NAME, COMMAND_ID, showDialog);
    
    menu = Menus.getContextMenu(Menus.ContextMenuIds.EDITOR_MENU);
    menu.addMenuDivider();
    menu.addMenuItem(COMMAND_ID);

});
