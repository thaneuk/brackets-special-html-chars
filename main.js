/*
 * Copyright (c) 2012-2017 Gregory Jackson. All rights reserved.
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

/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50, esversion:6 */
/*global define, $, brackets, event, showFullListDialog */

/* Special HTML Characters Extension
 to insert special HTML character codes
 */
define(function (require, exports, module) {
    'use strict';

    const
        CommandManager = brackets.getModule('command/CommandManager'),
        Menus = brackets.getModule('command/Menus'),
        EditorManager = brackets.getModule('editor/EditorManager'),
        ExtensionUtils = brackets.getModule('utils/ExtensionUtils'),
        DocumentManager = brackets.getModule('document/DocumentManager'),
        SpecialChars = require('text!specialHTMLChars.json'),
        specialChars = JSON.parse(SpecialChars),
        COMMAND_ID = 'specialhtmlchar.insert',
        FULLCOMMAND_ID = 'full.specialhtmlchar.insert',
        $specialCharsDialog = $('<div>', {class: 'specialHTMLChar'}),
        $fullSpecialCharsDialog = $('<div>', {class: 'specialHTMLChar full'}),
        Strings = require('strings');

    let menu, editMenu, dialogDimensions, fullSpecialCharsDialogCodeDisplay;

    ExtensionUtils.loadStyleSheet(module, 'style.css');

    /* Construction of popup dialog and events */
    $specialCharsDialog.append(
        $('<ul>', {class: 'quick'}).append(
            specialChars.quickLinks.map(char => {
                return $('<li>').append(
                    $('<a>', {
                        href: '#',
                        htmlCode: char.code,
                        text: char.name
                    }).prepend(
                        $('<span>', {class: 'quickChar', 'html': char.code})
                    )
                );
            })
        ),
        $('<div>', {class: 'divider'}),
        $('<a>', {href: '#', class: 'more', text: Strings.MORE}).on('click', function () {
            showFullListDialog();
            $specialCharsDialog.hide();
        })
    ).hide().appendTo('body').on('mouseleave', function () {
        $specialCharsDialog.hide();
    }).find('ul a').on('click', writeThisChar);

    $fullSpecialCharsDialog.append(
        $('<ul>', {class: 'full'}).append(
            specialChars.full.map(char => {
                return $('<li>', {'title': char.title}).append(
                    $('<a>', {
                        href: '#',
                        htmlCode: char.code,
                        html: char.code
                    })
                );
            })
        ),
        $('<div>', {class: 'control'}).append(
            $('<p>', {text: Strings.CLICK_THE_CHARACTER_YOU_WISH_TO_INSERT}),
            fullSpecialCharsDialogCodeDisplay = $('<input>', {
                type: 'text',
                class: 'codepreview',
                name: 'fullSpecialCharsDialogCodeDisplay',
                value: ''
            }),
            $('<a>', {href: '#', class: 'btn', text: Strings.CANCEL}).on('click', function () {
                $fullSpecialCharsDialog.hide();
            })
        )
    ).hide().appendTo('body').find('ul a').on('click', writeThisChar).on('mouseenter', function () {
        fullSpecialCharsDialogCodeDisplay.val(this.attributes.htmlCode.value);
    }).on('mouseleave', function () {
        fullSpecialCharsDialogCodeDisplay.val('');
    });

    dialogDimensions = {
        height: $specialCharsDialog.outerHeight(),
        width: $specialCharsDialog.outerWidth(),
        offset: 16
    };

    function showDialog() {
        $specialCharsDialog.css({
            left: ((event.pageX + dialogDimensions.offset) > (event.view.innerWidth - dialogDimensions.width)) ? (event.view.innerWidth - dialogDimensions.width) - 31 : event.pageX - dialogDimensions.offset,
            top: ((event.pageY + dialogDimensions.offset) > (event.view.innerHeight - dialogDimensions.height)) ? (event.view.innerHeight - dialogDimensions.height) - 68 : event.pageY - dialogDimensions.offset
        }).show();
    }

    function showFullListDialog() {
        const currentDoc = DocumentManager.getCurrentDocument();

        if (currentDoc) {
            $fullSpecialCharsDialog.css({
                'margin-left': -(622 / 2),
                'margin-top': -(520 / 2),
                width: 620
            }).show();
        }
    }

    /* this function is called within the scope of the click event target */
    function writeThisChar() {
        const
            doc = DocumentManager.getCurrentDocument(),
            editor = EditorManager.getCurrentFullEditor(),
            pos = editor.getCursorPos();

        doc.replaceRange(this.attributes.htmlCode.value, pos);

        $fullSpecialCharsDialog.hide();
        editor.focus();
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
