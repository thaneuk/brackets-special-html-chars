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
/*global define, $, brackets */

/* Special HTML Characters Extension 
    to insert special HTML character codes
*/
define(function (require, exports, module) {
    'use strict';

    // Menu: Edit - Insert Special HTML Character

    var
        CommandManager = brackets.getModule('command/CommandManager'),
        Menus = brackets.getModule('command/Menus'),
        EditorManager = brackets.getModule('editor/EditorManager'),
        ExtensionUtils = brackets.getModule('utils/ExtensionUtils'),
        DocumentManager = brackets.getModule('document/DocumentManager');
    //var ProjectManager = brackets.getModule('project/ProjectManager');
    //var FileUtils = brackets.getModule('file/FileUtils');    
    //var 
    //var NativeApp = brackets.getModule('utils/NativeApp');
    //var Commands = brackets.getModule('command/Commands');

    var
        COMMAND_ID  = 'specialhtmlchar.insert',
        MENU_NAME   = 'Special HTML Character',
        specialChars = [
            {
                'name': 'Non-breaking Space',
                'code': '&nbsp;'
            }, {
                'name': 'Copyright',
                'code': '&copy;'
            }, {
                'name': 'Registered',
                'code': '&reg;'
            }, {
                'name': 'Trademark',
                'code': '&#8482;'
            }, {
                'name': 'Pound',
                'code': '&pound;'
            }, {
                'name': 'Euro',
                'code': '&#8364;'
            }, {
                'name': 'Yen',
                'code': '&yen;'
            }, {
                'name': 'Left Quote',
                'code': '&#8220;'
            }, {
                'name': 'Right Quote',
                'code': '&#8221;'
            }, {
                'name': 'Em-Dash',
                'code': '&#8212;'
            }, {
                'name': 'En-Dash',
                'code': '&#8211;'
            }
        ],
        showing = false,
        iChars,
        iCharsLen = specialChars.length,
        $specialCharsDialog = $('<div>', { 'class': 'specialHTMLChar' });
    
    // Construction of popup dialog
    $specialCharsDialog.append(
        function () {
            var $ULElement = $('<ul>');
            for ( iChars = 0; iChars < iCharsLen; iChars++ ) {
                $ULElement.append(
                    $('<li>').append(
                        $('<a>', { 'href': '#', 'htmlcode': specialChars[ iChars ].code, 'text': specialChars[ iChars ].name })
                    )
                );
            }
            return $ULElement;
        }
    );
    
    ExtensionUtils.loadStyleSheet(module, 'style.css');
    
    function showDialog() {
        if ( showing ) {
            $specialCharsDialog.remove();
            showing = false;
        } else {
            $specialCharsDialog.css( { 'left': event.pageX - 8, 'top': event.pageY - 8 } ).show().appendTo( $( 'body' ) );
            $specialCharsDialog.on( 'mouseleave', function () {
                $specialCharsDialog.remove();
                showing = false;
            }).find( 'a' ).on( 'click', function ( e ) {
                var
                    cCode = $(this).attr( 'htmlcode' ),
                    doc = DocumentManager.getCurrentDocument(),
                    editor = EditorManager.getCurrentFullEditor(),
                    pos = editor.getCursorPos();
                doc.replaceRange( cCode, pos );
                $specialCharsDialog.remove();
                showing = false;
                editor.focus();
            });
            showing = true;
        }
    }


    CommandManager.register(MENU_NAME, COMMAND_ID, showDialog);
    
    var
        menu = Menus.getContextMenu(Menus.ContextMenuIds.EDITOR_MENU);
    menu.addMenuDivider();
    menu.addMenuItem(COMMAND_ID);

});
