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

pimcore.registerNS("pimcore.object.classes.data.editorType");
pimcore.object.classes.data.editorType = Class.create(pimcore.object.classes.data.data, {

    type: "editorType",
    /**
     * define where this datatype is allowed
     */
    allowIn: {
        object: true,
        objectbrick: true,
        fieldcollection: true,
        localizedfield: true,
        classificationstore : true,
        block: true,
        encryptedField: true
    },

    initialize: function (treeNode, initData) {
        this.type = "editorType";
        //console.log("editorType");

        this.initData(initData);

        // overwrite default settings
        this.availableSettingsFields = ["name","title","tooltip","mandatory","noteditable","invisible",
            "visibleGridView","visibleSearch","style"];

        this.treeNode = treeNode;
    },

    getTypeName: function () {
        return t("editorType");
    },

    getGroup: function () {
        return "text";
    },

    getIconClass: function () {
        return "pimcore_icon_wysiwyg"; // TODO change Icon
    },

    getLayout: function ($super) {

        $super();

        this.specificPanel.removeAll();
        var specificItems = this.getSpecificPanelItems(this.datax);
        this.specificPanel.add(specificItems);

        return this.layout;
    },

    getSpecificPanelItems: function (datax, inEncryptedField) {
        return [
            {
                xtype: "numberfield",
                fieldLabel: t("width"),
                name: "width",
                value: datax.width
            },
            {
                xtype: "numberfield",
                fieldLabel: t("height"),
                name: "height",
                value: datax.height
            },
            {
                xtype: "combo",
                fieldLabel: t("Editor Language"),
                name: "editorLanguage",
                value: datax.editorLanguage ? datax.editorLanguage : 'markdown',
                store: Ext.create('Ext.data.Store', {
                    data : [
                        {
                            text:'html',
                            value:'html'
                        },
                        {
                            text:'css',
                            value:'css'
                        },
                        {
                            text:'ini',
                            value:'ini'
                        },
                        {
                            text:'javascript',
                            value:'javascript'
                        },
                        {
                            text:'markdown',
                            value:'markdown'
                        },
                        {
                            text:'mysql',
                            value:'mysql'
                        },
                        {
                            text:'php',
                            value:'php'
                        },
                        {
                            text:'twig',
                            value:'twig'
                        },
                        {
                            text:'xml',
                            value:'xml'
                        },
                        {
                            text:'yaml',
                            value:'yaml'
                        },
                        { text: '------------------------------', value: '', disabled: true },
                        { text: 'abap', value: 'abap' },
                        { text: 'apex', value: 'apex' },
                        { text: 'azcli', value: 'azcli' },
                        { text: 'bat', value: 'bat' },
                        { text: 'clojure', value: 'clojure' },
                        { text: 'coffee script', value: 'coffee script' },
                        { text: 'cpp', value: 'cpp' },
                        { text: 'csharp', value: 'csharp' },
                        { text: 'csp', value: 'csp' },
                        { text: 'css', value: 'css' },
                        { text: 'dockerfile', value: 'dockerfile' },
                        { text: 'fsharp', value: 'fsharp' },
                        { text: 'go', value: 'go' },
                        { text: 'graphql', value: 'graphql' },
                        { text: 'handlebars', value: 'handlebars' },
                        { text: 'java', value: 'java' },
                        { text: 'less', value: 'less' },
                        { text: 'lua', value: 'lua' },
                        { text: 'msdax', value: 'msdax' },
                        { text: 'objective-c', value: 'objective-c' },
                        { text: 'pascal', value: 'pascal' },
                        { text: 'pascaligo', value: 'pascaligo' },
                        { text: 'pgsql', value: 'pgsql' },
                        { text: 'postiats', value: 'postiats' },
                        { text: 'powershell', value: 'powershell' },
                        { text: 'pug', value: 'pug' },
                        { text: 'python', value: 'python' },
                        { text: 'r', value: 'r' },
                        { text: 'razor', value: 'razor' },
                        { text: 'ruby', value: 'ruby' },
                        { text: 'rust', value: 'rust' },
                        { text: 'small basic', value: 'small basic' },
                        { text: 'scheme', value: 'scheme' },
                        { text: 'scss', value: 'scss' },
                        { text: 'solidity', value: 'solidity' },
                        { text: 'sql', value: 'sql' },
                        { text: 'st', value: 'st' },
                        { text: 'swift', value: 'swift' },
                        { text: 'typescript', value: 'typescript' },
                        { text: 'vb', value: 'vb' }
                    ]
                })
            },
            {
                xtype: "combo",
                fieldLabel: t("Editor Theme"),
                name: "editorTheme",
                value: datax.editorTheme ? datax.editorTheme : 'vs',
                store: Ext.create('Ext.data.Store', {
                    data : [
                        {
                            text:'vs',
                            value:'vs'
                        },
                        {
                            text:'vs-dark',
                            value:'vs-dark'
                        },
                        {
                            text:'hc-black',
                            value:'hc-black'
                        }
                    ]
                })
            },
            {
                xtype: "textarea",
                fieldLabel: t("editor_configuration"),
                name: "editorConfig",
                value: datax.editorConfig,
                width:400,
                height:150
            },
            {
                xtype: "checkbox",
                fieldLabel: t("exclude_from_search_index"),
                name: "excludeFromSearchIndex",
                checked: datax.excludeFromSearchIndex
            }
        ];
    },

    applySpecialData: function(source) {
        if (source.datax) {
            if (!this.datax) {
                this.datax =  {};
            }
            Ext.apply(this.datax,
                {
                    width: source.datax.width,
                    height: source.datax.height,
                    editorLanguage: source.datax.editorLanguage,
                    editorConfig: source.datax.editorConfig,
                    editorTheme: source.datax.editorTheme
                });
        }
    }
});