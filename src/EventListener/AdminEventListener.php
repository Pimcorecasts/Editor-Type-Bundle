<?php
namespace Pimcorecasts\Bundle\EditorTypeBundle\EventListener;

use Pimcore\Event\BundleManager\PathsEvent;

class AdminEventListener
{
    public function addCSSFiles(PathsEvent $event): void
    {
        $event->setPaths(
            array_merge(
                $event->getPaths(),
                [
                    '/bundles/editortype/vs/editor/editor.main.css'
                ]
            )
        );
    }

    public function addJSFiles(PathsEvent $event): void
    {
        $event->setPaths(
            array_merge(
                $event->getPaths(),
                [
                    '/bundles/editortype/script.js',
                    '/bundles/editortype/vs/loader.js',
                    '/bundles/editortype/vs/editor/editor.main.nls.js',
                    '/bundles/editortype/vs/editor/editor.main.js',
                    '/bundles/editortype/pimcore/object/classes/data/editorType.js',
                    '/bundles/editortype/pimcore/object/tags/editorType.js'
                ]
            )
        );
    }
}
