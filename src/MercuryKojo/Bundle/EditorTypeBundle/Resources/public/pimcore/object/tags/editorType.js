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

pimcore.registerNS("pimcore.object.tags.editorType");
pimcore.object.tags.editorType = Class.create(pimcore.object.tags.abstract, {

    type: "editorType",

    initialize: function (data, fieldConfig) {
        this.data = "";
        if (data) {
            this.data = data;
        }
        this.fieldConfig = fieldConfig;
        this.editableDivId = "object_editorType_" + uniqid();
    },

    /**
     * @extjs since HTMLEditor seems not working properly in grid, this feature is deactivated for now
     */

    getGridColumnConfig: function (field) {
        var renderer = function (key, value, metaData, record) {
            this.applyPermissionStyle(key, value, metaData, record);

            try {
                if (record.data.inheritedFields && record.data.inheritedFields[key] && record.data.inheritedFields[key].inherited == true) {
                    metaData.tdCls += " grid_value_inherited";
                }
            } catch (e) {
                console.log(e);
            }
            return value;

        }.bind(this, field.key);

        return {
            text: ts(field.label), sortable: true, dataIndex: field.key, renderer: renderer,
            getEditor: this.getWindowCellEditor.bind(this, field)
        };
    },


    getGridColumnFilter: function (field) {
        return {type: 'string', dataIndex: field.key};
    },

    getLayout: function () {

        var iconCls = null;
        if(this.fieldConfig.noteditable == false) {
            iconCls = "pimcore_icon_droptarget";
        }

        var html = '<div class="pimcore_tag_editorType" style="min-height: 100%" id="' + this.editableDivId + '" contenteditable="true"></div>';

        var pConf = {
            iconCls: iconCls,
            title: this.fieldConfig.title,
            html: html,
            border: true,
            style: "margin-bottom: 10px",
            manageHeight: false,
            cls: "object_field"
        };

        if(this.fieldConfig.width) {
            pConf["width"] = this.fieldConfig.width;
        }

        if(this.fieldConfig.height) {
            pConf["height"] = this.fieldConfig.height;
            pConf["autoScroll"] = true;
        } else {
            pConf["autoHeight"] = true;
            pConf["autoScroll"] = true;
        }

        this.component = new Ext.Panel(pConf);
    },

    getLayoutShow: function () {
        this.getLayout();
        this.component.on("afterrender", function() {
            Ext.get(this.editableDivId).dom.setAttribute("contenteditable", "false");
        }.bind(this));
        this.component.disable();
        return this.component;
    },

    getLayoutEdit: function () {
        this.getLayout();
        this.component.on("afterlayout", this.startEditor.bind(this));
        this.component.on("beforedestroy", function() {
            if(this.editor) {
                this.editor.getModel().dispose();
                this.editor.dispose();
                this.editor = null;
            }
        }.bind(this));
        return this.component;
    },

    startEditor: function(){
        if( this.editor ){
            return;
        }

        // add drop zone, use the parent panel here (container), otherwise this can cause problems when specifying a fixed height on the editorType
        // var dd = new Ext.dd.DropZone(Ext.get(this.editableDivId).parent(), {
        //     ddGroup: "element",
        //
        //     getTargetFromEvent: function(e) {
        //         return this.getEl();
        //     },
        //
        //     onNodeOver : function(target, dd, e, data) {
        //         var record = data.records[0];
        //         data = record.data;
        //         if (this.dndAllowed(data)) {
        //             return Ext.dd.DropZone.prototype.dropAllowed;
        //         }
        //         else {
        //             return Ext.dd.DropZone.prototype.dropNotAllowed;
        //         }
        //
        //     }.bind(this),
        //
        //     onNodeDrop : this.onNodeDrop.bind(this)
        // });

        try{
            this.editor = monaco.editor.create(document.getElementById( this.editableDivId ), {
                value: this.data,
                language: this.fieldConfig.editorLanguage ? this.fieldConfig.editorLanguage : 'markdown',
                theme: this.fieldConfig.editorTheme ? this.fieldConfig.editorTheme : 'vs',
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

        if (!this.editor) {
            return;
        }

        this.editor.focus();

        var node = data.records[0];
        var data = node.data;

        if (!this.editor ||!this.dndAllowed(node.data)) {
            return;
        }

        var wrappedText = node.data.text;
        var textIsSelected = false;
        var selectedText = this.editor.codemirror.getSelection();
        if (selectedText.length > 0) {
            wrappedText = selectedText;
            textIsSelected = true;
        }

        // remove existing links out of the wrapped text
        wrappedText = wrappedText.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, function ($0, $1) {
            if($1.toLowerCase() == "a") {
                return "";
            }
            return $0;
        });

        var id = node.data.id;
        var uri = node.data.path;
        var browserPossibleExtensions = ["jpg","jpeg","gif","png"];

        // MOdal
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
        }
        /*
        if (node.data.elementType == "asset") {
            if (node.data.type == "image" && textIsSelected == false) {
                // images bigger than 600px or formats which cannot be displayed by the browser directly will be
                // converted by the pimcore thumbnailing service so that they can be displayed in the editor
                var defaultWidth = 600;
                var additionalAttributes = "";
                uri = "/admin/asset/get-image-thumbnail?id=" + id + "&width=" + defaultWidth + "&aspectratio=true";

                if(typeof node.data.imageWidth != "undefined") {
                    if(node.data.imageWidth < defaultWidth
                                && in_arrayi(pimcore.helpers.getFileExtension(node.data.text),
                                                                        browserPossibleExtensions)) {
                        uri = node.data.path;
                        additionalAttributes += ' pimcore_disable_thumbnail="true"';
                    }

                    if(node.data.imageWidth < defaultWidth) {
                        defaultWidth = node.data.imageWidth;
                    }
                }

                this.ckeditor.insertHtml('<img src="' + uri + '" pimcore_type="asset" pimcore_id="' + id
                                + '" style="width:' + defaultWidth + 'px;"' + additionalAttributes + ' />');
                return true;
            }
            else {
                this.ckeditor.insertHtml('<a href="' + uri + '" pimcore_type="asset" pimcore_id="'
                                + id + '">' + wrappedText + '</a>');
                return true;
            }
        }

        if (node.data.elementType == "document" && (node.data.type=="page"
                                || node.data.type=="hardlink" || node.data.type=="link")){
            this.ckeditor.insertHtml('<a href="' + uri + '" pimcore_type="document" pimcore_id="'
                                + id + '">' + wrappedText + '</a>');
            return true;
        }

        if (node.data.elementType == "object"){
            this.ckeditor.insertHtml('<a href="' + uri + '" pimcore_type="object" pimcore_id="'
                + id + '">' + wrappedText + '</a>');
            return true;
        }
        */

    },

    dndAllowed: function(data) {

        return false; // no DND for now

        if (data.elementType == "document" && (data.type=="page"
            || data.type=="hardlink" || data.type=="link")){
            return true;
        } else if (data.elementType=="asset" && data.type != "folder"){
            return true;
        } else if (data.elementType=="object" && data.type != "folder"){
            return true;
        }

        return false;
    },

    getValue: function () {

        var data = this.data;
        try {
            if (this.editor) {
                data = this.editor.getValue();
            }
        }
        catch (e) {
        }

        this.data = data;

        return this.data;
    },

    getName: function () {
        return this.fieldConfig.name;
    },

    isDirty: function() {
        if(!this.isRendered()) {
            return false;
        }

        if(this.dirty) {
            return this.dirty;
        }

        if(this.editor) {

            if(this.dirtyDetection) {
                const versionId = this.editor.getModel().getAlternativeVersionId();
                if (versionId != this.dirtyDetection.initialVersion) {
                    this.dirty = true;
                }
            }
            return this.dirty;

        }

        return false;
    },

    getWindowCellEditor: function (field, record) {
        return new pimcore.element.helpers.gridCellEditor({
                fieldInfo: field,
                elementType: "object"
            }
        );
    },

    getCellEditValue: function () {
        return this.getValue();
    }
});