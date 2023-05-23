<?php


namespace MercuryKojo\Bundle\EditorTypeBundle\Model\DataObject\ClassDefinition\Data;

use Pimcore\Model\DataObject\ClassDefinition\Data\QueryResourcePersistenceAwareInterface;
use Pimcore\Model\DataObject\ClassDefinition\Data\ResourcePersistenceAwareInterface;
use Pimcore\Model;
use Pimcore\Model\DataObject\ClassDefinition\Data\Extension;
use Pimcore\Model\Element;

class EditorType extends \Pimcore\Model\DataObject\ClassDefinition\Data implements ResourcePersistenceAwareInterface, QueryResourcePersistenceAwareInterface {

    use Model\DataObject\ClassDefinition\Data\Extension\Text;
    use Model\DataObject\Traits\SimpleComparisonTrait;
    use Extension\ColumnType;
    use Extension\QueryColumnType;

    /**
     * @var string
     */
    public $fieldtype = 'editorType';

    /**
     * @var int
     */
    public $width;

    /**
     * @var int
     */
    public $height;

    /**
     * Type for the column to query
     *
     * @var string
     */
    public $queryColumnType = 'longtext';

    /**
     * Type for the column
     *
     * @var string
     */
    public $columnType = 'longtext';

    /**
     * Type for the generated phpdoc
     *
     * @var string
     */
    public $phpdocType = 'string';

    /**
     * @var string
     */
    public $editorConfig = '';

    /**
     * @var string
     */
    public $editorLanguage = '';

    /**
     * @var string
     */
    public $editorTheme = '';

    /**
     * @var bool
     */
    public $excludeFromSearchIndex = false;

    /**
     * @return int
     */
    public function getWidth()
    {
        return $this->width;
    }

    /**
     * @return int
     */
    public function getHeight()
    {
        return $this->height;
    }

    /**
     * @param int $width
     *
     * @return $this
     */
    public function setWidth($width)
    {
        $this->width = $this->getAsIntegerCast($width);

        return $this;
    }

    /**
     * @param int $height
     *
     * @return $this
     */
    public function setHeight($height)
    {
        $this->height = $this->getAsIntegerCast($height);

        return $this;
    }

    /**
     * @param string $editorConfig
     */
    public function setEditorConfig($editorConfig)
    {
        if (is_string($editorConfig)) {
            $this->editorConfig = $editorConfig;
        } else {
            $this->editorConfig = '';
        }
    }

    /**
     * @return string
     */
    public function getEditorConfig() {
        return $this->editorConfig;
    }

    /**
     * @param string $editorLanguage
     */
    public function setEditorLanguage($editorLanguage) {
        if (is_string($editorLanguage)) {
            $this->editorLanguage = $editorLanguage;
        } else {
            $this->editorLanguage = '';
        }
    }

    /**
     * @return string
     */
    public function getEditorLanguage() {
        return $this->editorLanguage;
    }

    /**
     * @param string $editorTheme
     */
    public function setEditorTheme($editorTheme) {
        if (is_string($editorTheme)) {
            $this->editorTheme = $editorTheme;
        } else {
            $this->editorTheme = '';
        }
    }

    /**
     * @return string
     */
    public function getEditorTheme() {
        return $this->editorTheme;
    }

    /**
     * @return bool
     */
    public function isExcludeFromSearchIndex(): bool
    {
        return $this->excludeFromSearchIndex;
    }

    /**
     * @param bool $excludeFromSearchIndex
     */
    public function setExcludeFromSearchIndex(bool $excludeFromSearchIndex)
    {
        $this->excludeFromSearchIndex = $excludeFromSearchIndex;

        return $this;
    }

    /**
     * @see ResourcePersistenceAwareInterface::getDataForResource
     *
     * @param string $data
     * @param null|Model\DataObject\AbstractObject $object
     * @param mixed $params
     *
     * @return string
     */
    public function getDataForResource($data, $object = null, $params = [])
    {
        return $data;
    }

    /**
     * @see ResourcePersistenceAwareInterface::getDataFromResource
     *
     * @param string $data
     * @param null|Model\DataObject\AbstractObject $object
     * @param mixed $params
     *
     * @return string
     */
    public function getDataFromResource($data, $object = null, $params = [])
    {
        return $data;
    }

    /**
     * @see QueryResourcePersistenceAwareInterface::getDataForQueryResource
     *
     * @param string $data
     * @param null|Model\DataObject\AbstractObject $object
     * @param mixed $params
     *
     * @return string
     */
    public function getDataForQueryResource($data, $object = null, $params = [])
    {
        $data = $this->getDataForResource($data, $object, $params);

        $data = strip_tags($data, '<a><img>');
        $data = str_replace("\r\n", ' ', $data);
        $data = str_replace("\n", ' ', $data);
        $data = str_replace("\r", ' ', $data);
        $data = str_replace("\t", '', $data);
        $data = preg_replace('#[ ]+#', ' ', $data);

        return $data;
    }

    /**
     * @see Model\DataObject\ClassDefinition\Data::getDataForSearchIndex
     *
     * @param null|Model\DataObject\AbstractObject $object
     * @param mixed $params
     *
     * @return string
     */
    public function getDataForSearchIndex($object, $params = [])
    {
        if ($this->isExcludeFromSearchIndex()) {
            return '';
        } else {
            return parent::getDataForSearchIndex($object, $params);
        }
    }

    /**
     * @see Data::getDataForEditmode
     *
     * @param string $data
     * @param null|Model\DataObject\AbstractObject $object
     * @param mixed $params
     *
     * @return string
     */
    public function getDataForEditmode($data, $object = null, $params = [])
    {
        return $this->getDataForResource($data, $object, $params);
    }

    /**
     * @see Data::getDataFromEditmode
     *
     * @param string $data
     * @param null|Model\DataObject\AbstractObject $object
     * @param mixed $params
     *
     * @return string
     */
    public function getDataFromEditmode($data, $object = null, $params = [])
    {
        return $data;
    }

    /** Generates a pretty version preview (similar to getVersionPreview) can be either html or
     * a image URL. See the ObjectMerger plugin documentation for details
     *
     * @param $data
     * @param null $object
     * @param mixed $params
     *
     * @return array|string
     */
    public function getDiffVersionPreview($data, $object = null, $params = [])
    {
        if ($data) {
            $value = [];
            $value['html'] = $data;
            $value['type'] = 'html';

            return $value;
        } else {
            return '';
        }
    }

    /**
     * Rewrites id from source to target, $idMapping contains
     * array(
     *  "document" => array(
     *      SOURCE_ID => TARGET_ID,
     *      SOURCE_ID => TARGET_ID
     *  ),
     *  "object" => array(...),
     *  "asset" => array(...)
     * )
     *
     * @param mixed $object
     * @param array $idMapping
     * @param array $params
     *
     * @return Element\ElementInterface
     */
    public function rewriteIds($object, $idMapping, $params = [])
    {
        $data = $this->getDataFromObjectParam($object, $params);
        $html = str_get_html($data);
        if ($html) {
            $s = $html->find('a[pimcore_id],img[pimcore_id]');

            if ($s) {
                foreach ($s as $el) {
                    if ($el->href || $el->src) {
                        $type = $el->pimcore_type;
                        $id = (int) $el->pimcore_id;

                        if (array_key_exists($type, $idMapping)) {
                            if (array_key_exists($id, $idMapping[$type])) {
                                $el->outertext = str_replace('="' . $el->pimcore_id . '"', '="' . $idMapping[$type][$id] . '"', $el->outertext);
                            }
                        }
                    }
                }
            }

            $data = $html->save();

            $html->clear();
            unset($html);
        }

        return $data;
    }

    /**
     * {@inheritdoc}
     */
    public function getParameterTypeDeclaration(): ?string
    {
        return '?string';
    }

    /**
     * {@inheritdoc}
     */
    public function getReturnTypeDeclaration(): ?string
    {
        return '?string';
    }

    /**
     * {@inheritdoc}
     */
    public function getPhpdocInputType(): ?string
    {
        return 'string|null';
    }

    /**
     * {@inheritdoc}
     */
    public function getPhpdocReturnType(): ?string
    {
        return 'string|null';
    }
}
