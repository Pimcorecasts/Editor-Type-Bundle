/**
 * Pimcore
 *
 * This source file is available under two different licenses:
 * - GNU General Public License version 3 (GPLv3)
 * - Pimcore Enterprise License (PEL)
 * Full copyright and license information is available in
 * LICENSE.md which is distributed with this source code.
 *
 * @copyright  Copyright (c) Pimcore GmbH (http://www.pimcore.org)
 * @license    http://www.pimcore.org/license     GPLv3 and PEL
 */
pimcore.registerNS("pimcore.document.editables.editortype");
pimcore.document.editables.editortype = Class.create(pimcore.document.editable, {

    type: "editortype",

    initialize: function(id, name, options, data, inherited) {

        this.id = id;
        this.name = name;
        this.setupWrapper();
        options = this.parseOptions(options);

        if (!data) {
            data = "";
        }
        this.data = data;
        this.options = options;
        this.inherited = inherited;

        var editorDivId = id + "_textarea";
        this.divContainer = document.createElement("div");
        this.divContainer.setAttribute("contenteditable","true");

        Ext.get(id).appendChild(this.divContainer);

        Ext.get(id).insertHtml("beforeEnd",'<div class="pimcore_tag_droptarget"></div>');

        this.divContainer.id = editorDivId;

        var divContainerHeight = 300;
        if (options.height) {
            divContainerHeight = options.height;
        }
        if (options.placeholder) {
            this.divContainer.setAttribute('data-placeholder', options["placeholder"]);
        }

        var inactiveContainerWidth = options.width + "px";
        if (typeof options.width == "string" && options.width.indexOf("%") >= 0) {
            inactiveContainerWidth = options.width;
        }

        Ext.get(this.divContainer).addCls("pimcore_editortype");
        Ext.get(this.divContainer).applyStyles("width: " + inactiveContainerWidth  + "; min-height: " + divContainerHeight
            + "px;");

        // register at global DnD manager
        if (typeof dndManager !== 'undefined') {
            dndManager.addDropTarget(Ext.get(id), this.onNodeOver.bind(this), this.onNodeDrop.bind(this));
        }

        this.startEditor( editorDivId );

        this.checkValue();
    },

    startEditor: function( editorDivId ){
        if( this.editor ){
            return;
        }
        try{
            this.editor = monaco.editor.create(document.getElementById( editorDivId ), {
                value: this.data,
                language: this.options.editorLanguage ? this.options.editorLanguage : 'markdown',
                theme: this.options.editorTheme ? this.options.editorTheme : 'vs',
                automaticLayout: true
            });

            this.dirtyDetection = this.dirtyDetection || {};

            this.dirtyDetection.initialVersion = this.editor.getModel().getAlternativeVersionId();
            this.dirtyDetection.currentVersion = this.dirtyDetection.initialVersion;
            this.dirtyDetection.lastVersion = this.dirtyDetection.initialVersion;
        }catch (e) {
            console.log(e);
        }
    },

    onNodeDrop: function (target, dd, e, data) {
        /*var record = data.records[0];
        data = record.data;

        var textIsSelected = false;
        var wrappedText = data.text;
        var selectedText = this.editor.codemirror.getSelection();
        if (selectedText.length > 0) {
            wrappedText = selectedText;
            textIsSelected = true;
        }

        var insertEl = null;
        var id = data.id;
        var uri = data.path;
        var browserPossibleExtensions = ["jpg","jpeg","gif","png"];

        // remove existing links out of the wrapped text
        wrappedText = wrappedText.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, function ($0, $1) {
            if($1.toLowerCase() == "a") {
                return "";
            }
            return $0;
        });




        // Modal
        var modalLink = document.getElementById('simple-mde-modal-link');
        var isLinkModal = (modalLink && modalLink.style.display != 'none');

        // Is this a Link Modal Window
        if( isLinkModal ){

            // When Name is empty then add the Document Name
            var nameInput = document.getElementById('simple-mde-modal-link-name-input');
            if( nameInput.value == '' ){
                nameInput.value = data.text
            }

            var hrefInput = document.getElementById('simple-mde-modal-link-href-input');
            hrefInput.value = data.path;

        }

        if (data.elementType == "asset") {
            if (data.type == "image" && textIsSelected == false) {
                // images bigger than 600px or formats which cannot be displayed by the browser directly will be
                // converted by the pimcore thumbnailing service so that they can be displayed in the editor
                var defaultWidth = 600;
                var additionalAttributes = "";

                if(typeof data.imageWidth != "undefined") {
                    uri = "/admin/asset/get-image-thumbnail?id=" + id + "&width=" + defaultWidth + "&aspectratio=true";
                    if(data.imageWidth < defaultWidth
                        && in_arrayi(pimcore.helpers.getFileExtension(data.text),
                            browserPossibleExtensions)) {
                        uri = data.path;
                        additionalAttributes += ' data-pimcore-disable-thumbnail="true"';
                    }

                    if(data.imageWidth < defaultWidth) {
                        defaultWidth = data.imageWidth;
                    }

                    additionalAttributes += ' style="width:' + defaultWidth + 'px;"';
                }
                var startPoint = this.editor.codemirror.getCursor("start");
                var endPoint = this.editor.codemirror.getCursor("end");
                this.editor.codemirror.replaceSelection('![]('
                    + uri + '){data-pimcore-type="asset" data-pimcore-id="' + id + '"' + additionalAttributes + '}', false,[ startPoint, endPoint ]);
                return true;
            }
            else {
                this.editor.insertText('[' + wrappedText + '](' + encodeURI(uri)
                    + '){target="_blank" data-pimcore-type="asset" data-pimcore-id="' + id + '"}');
                return true;
            }
        }


        if ( !isLinkModal && data.elementType == "document" && (data.type=="page" || data.type=="hardlink" || data.type=="link")){
            //insertEl = CKEDITOR.dom.element.createFromHtml('<a href="' + uri + '" pimcore_type="document" pimcore_id="' + id + '">' + wrappedText + '</a>');
            this.editor.codemirror.replaceSelection('[' + wrappedText + '](' + uri + '){pimcore_type="document" pimcore_id="' + id + '"}');
            //this.ckeditor.insertElement(insertEl);
            return true;
        }*/

        /*
                if (!this.ckeditor || !this.dndAllowed(data) || this.inherited) {
                    return;
                }

                // we have to focus the editor otherwise an error is thrown in the case the editor wasn't opend before a drop element
                this.ckeditor.focus();

                var wrappedText = data.text;
                var textIsSelected = false;

                try {
                    var selection = this.ckeditor.getSelection();
                    var bookmarks = selection.createBookmarks();
                    var range = selection.getRanges()[ 0 ];
                    var fragment = range.clone().cloneContents();

                    selection.selectBookmarks(bookmarks);
                    var retval = "";
                    var childList = fragment.getChildren();
                    var childCount = childList.count();

                    for (var i = 0; i < childCount; i++) {
                        var child = childList.getItem(i);
                        retval += ( child.getOuterHtml ?
                            child.getOuterHtml() : child.getText() );
                    }

                    if (retval.length > 0) {
                        wrappedText = retval;
                        textIsSelected = true;
                    }
                }
                catch (e2) {
                }

                // remove existing links out of the wrapped text
                wrappedText = wrappedText.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, function ($0, $1) {
                    if($1.toLowerCase() == "a") {
                        return "";
                    }
                    return $0;
                });

                var insertEl = null;
                var id = data.id;
                var uri = data.path;
                var browserPossibleExtensions = ["jpg","jpeg","gif","png"];

                if (data.elementType == "asset") {
                    if (data.type == "image" && textIsSelected == false) {
                        // images bigger than 600px or formats which cannot be displayed by the browser directly will be
                        // converted by the pimcore thumbnailing service so that they can be displayed in the editor
                        var defaultWidth = 600;
                        var additionalAttributes = "";

                        if(typeof data.imageWidth != "undefined") {
                            uri = "/admin/asset/get-image-thumbnail?id=" + id + "&width=" + defaultWidth + "&aspectratio=true";
                            if(data.imageWidth < defaultWidth
                                && in_arrayi(pimcore.helpers.getFileExtension(data.text),
                                    browserPossibleExtensions)) {
                                uri = data.path;
                                additionalAttributes += ' pimcore_disable_thumbnail="true"';
                            }

                            if(data.imageWidth < defaultWidth) {
                                defaultWidth = data.imageWidth;
                            }

                            additionalAttributes += ' style="width:' + defaultWidth + 'px;"';
                        }

                        insertEl = CKEDITOR.dom.element.createFromHtml('<img src="'
                            + uri + '" pimcore_type="asset" pimcore_id="' + id + '" ' + additionalAttributes + ' />');
                        this.ckeditor.insertElement(insertEl);
                        return true;
                    }
                    else {
                        insertEl = CKEDITOR.dom.element.createFromHtml('<a href="' + uri
                            + '" target="_blank" pimcore_type="asset" pimcore_id="' + id + '">' + wrappedText + '</a>');
                        this.ckeditor.insertElement(insertEl);
                        return true;
                    }
                }

                if (data.elementType == "document" && (data.type=="page"
                    || data.type=="hardlink" || data.type=="link")){
                    insertEl = CKEDITOR.dom.element.createFromHtml('<a href="' + uri + '" pimcore_type="document" pimcore_id="'
                        + id + '">' + wrappedText + '</a>');
                    this.ckeditor.insertElement(insertEl);
                    return true;
                }

                if (data.elementType == "object"){
                    insertEl = CKEDITOR.dom.element.createFromHtml('<a href="' + uri + '" pimcore_type="object" pimcore_id="'
                        + id + '">' + wrappedText + '</a>');
                    this.ckeditor.insertElement(insertEl);
                    return true;
                }

                */
    },

    checkValue: function () {

        var value = this.getValue();

        if(trim(strip_tags(value)).length < 1) {
            Ext.get(this.divContainer).addCls("empty");
        } else {
            Ext.get(this.divContainer).removeCls("empty");
        }
    },

    onNodeOver: function(target, dd, e, data) {
        var record = data.records[0];
        data = record.data;
        if (this.dndAllowed(data) && !this.inherited) {
            return Ext.dd.DropZone.prototype.dropAllowed;
        }
        else {
            return Ext.dd.DropZone.prototype.dropNotAllowed;
        }
    },


    dndAllowed: function(data) {

        return false;
        if (data.elementType == "document" && (data.type=="page"
            || data.type=="hardlink" || data.type=="link")){
            return true;
        } else if (data.elementType=="asset" && data.type != "folder"){
            return true;
        } else if (data.elementType=="object" && data.type != "folder"){
            return true;
        }

    },


    getValue: function () {

        var value = this.data;

        if (this.editor) {
            value = this.editor.getValue();
        }

        this.data = value;

        return value;
    },

    getType: function () {
        return "editortype";
    }
});