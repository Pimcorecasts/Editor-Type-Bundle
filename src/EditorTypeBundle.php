<?php

namespace MercuryKojo\Bundle\EditorTypeBundle;

use Pimcore\Extension\Bundle\AbstractPimcoreBundle;

class EditorTypeBundle extends AbstractPimcoreBundle
{
    public function getJsPaths(): array
    {
        return [
            '/bundles/editortype/script.js',
            '/bundles/editortype/vs/loader.js',
            '/bundles/editortype/vs/editor/editor.main.nls.js',
            '/bundles/editortype/vs/editor/editor.main.js',
            '/bundles/editortype/pimcore/object/classes/data/editorType.js',
            '/bundles/editortype/pimcore/object/tags/editorType.js'
        ];
    }

    public function getEditmodeJsPaths(): array
    {
        return [
            '/bundles/editortype/script.js',
            '/bundles/editortype/vs/loader.js',
            '/bundles/editortype/vs/editor/editor.main.nls.js',
            '/bundles/editortype/vs/editor/editor.main.js',
            '/bundles/editortype/pimcore/document/editables/editortype.js',
        ];
    }

    public function getCssPaths(): array
    {
        return [
            '/bundles/editortype/vs/editor/editor.main.css',
        ];
    }

    public function getEditmodeCssPaths(): array
    {
        return [
            '/bundles/editortype/vs/editor/editor.main.css',
        ];
    }
}
