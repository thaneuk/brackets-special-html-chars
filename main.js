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
/*global define, $, brackets, event, showFullListDialog */

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
        FULLCOMMAND_ID = 'full.specialhtmlchar.insert',
        iChars,
        iCharsLen = specialChars.quickLinks.length,
        menu, editMenu, keyCommands,
        $specialCharsDialog = $('<div>', { 'class': 'specialHTMLChar' }),
        $fullSpecialCharsDialog = $('<div>', { 'class': 'specialHTMLChar full' }),
        dialogDimensions,
        Strings = require('strings');
    
    ExtensionUtils.loadStyleSheet(module, 'style.css');
    
    /* Construction of popup dialog and events */
    $specialCharsDialog.append(
        function () {
            var $ULElement = $('<ul>', { 'class': 'quick' });
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
    ).append(
        $('<div>', { 'class': 'divider' }),
        $('<a>', { 'href': '#', 'class': 'more', 'text': Strings.MORE}).on('click', function () {
            showFullListDialog();
            $specialCharsDialog.hide();
        })
    ).hide().appendTo('body').on('mouseleave', function () {
        $specialCharsDialog.hide();
    }).find('ul a').on('click', function () {
        var
            cCode = $(this).attr('htmlcode'),
            doc = DocumentManager.getCurrentDocument(),
            editor = EditorManager.getCurrentFullEditor(),
            pos = editor.getCursorPos();
        doc.replaceRange(cCode, pos);
        $specialCharsDialog.hide();
        editor.focus();
    });

    iCharsLen = specialChars.full.length;
    $fullSpecialCharsDialog.append(
        function () {
            var $ULElement = $('<ul>', { 'class': 'full' });
            for (iChars = 0; iChars < iCharsLen; iChars++) {
                $ULElement.append(
                    $('<li>', { 'title': specialChars.full[iChars].title }).append(
                        $('<a>', { 'href': '#', 'htmlcode': specialChars.full[iChars].code, 'html': specialChars.full[iChars].code })
                    )
                );
            }
            return $ULElement;
        }
    ).append(
        $('<div>', { 'class': 'control' }).append(
            $('<p>', { 'text': Strings.CLICK_THE_CHARACTER_YOU_WISH_TO_INSERT }),
            $('<input>', { 'type': 'text', 'class': 'codepreview', 'name': 'fullSpecialCharsDialogCodeDisplay', 'value': '' }),
            $('<a>', { 'href': '#', 'class': 'btn', 'text': Strings.CANCEL }).on('click', function () {
                $fullSpecialCharsDialog.hide();
            })
        )
    ).hide().appendTo('body').find('ul a').on('click', function () {
        var
            cCode = $(this).attr('htmlcode'),
            doc = DocumentManager.getCurrentDocument(),
            editor = EditorManager.getCurrentFullEditor(),
            pos = editor.getCursorPos();
        doc.replaceRange(cCode, pos);
        $fullSpecialCharsDialog.hide();
        editor.focus();
    }).on('mouseenter', function () {
        $('[name=fullSpecialCharsDialogCodeDisplay]').val($(this).attr('htmlcode'));
    }).on('mouseleave', function () {
        $('[name=fullSpecialCharsDialogCodeDisplay]').val('');
    });

    dialogDimensions = {
        height: $specialCharsDialog.outerHeight(),
        width: $specialCharsDialog.outerWidth(),
        offset: 16
    };

    function showDialog() {
        $specialCharsDialog.css({
            'left': ((event.pageX + dialogDimensions.offset) > (event.view.innerWidth - dialogDimensions.width)) ? (event.view.innerWidth - dialogDimensions.width) - 31 : event.pageX - dialogDimensions.offset,
            'top': ((event.pageY + dialogDimensions.offset) > (event.view.innerHeight - dialogDimensions.height)) ? (event.view.innerHeight - dialogDimensions.height) - 68  : event.pageY - dialogDimensions.offset
        }).show();
    }

    function showFullListDialog() {
        var currentDoc = DocumentManager.getCurrentDocument();
        if (currentDoc) {
            $fullSpecialCharsDialog.css({
                'margin-left': -(622 / 2),
                'margin-top': -(520 / 2),
                'width': 620
            }).show();
        }
    }

    CommandManager.register(Strings.SPECIAL_HTML_CHARACTER, COMMAND_ID, showDialog);

    menu = Menus.getContextMenu(Menus.ContextMenuIds.EDITOR_MENU);
    if (menu) {
        menu.addMenuDivider();
        menu.addMenuItem(COMMAND_ID);
    }

    CommandManager.register(Strings.SPECIAL_HTML_CHARACTER, FULLCOMMAND_ID, showFullListDialog);

    editMenu = Menus.getMenu(Menus.AppMenuBar.EDIT_MENU);
    if (editMenu) {
        editMenu.addMenuDivider();
        editMenu.addMenuItem(FULLCOMMAND_ID, 'Alt-C');
    }

});
