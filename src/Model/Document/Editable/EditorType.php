<?php


namespace MercuryKojo\Bundle\EditorTypeBundle\Model\Document\Editable;


use Pimcore\Model\Document\Editable;

/**
 * @method \Pimcore\Model\Document\Editable\Dao getDao()
 */
class EditorType extends Editable
{
    /**
     * Contains the text
     *
     * @var string
     */
    public $text;

    /**
     * @see TagInterface::getType
     *
     * @return string
     */
    public function getType()
    {
        return 'editortype';
    }

    /**
     * @see TagInterface::getData
     *
     * @return mixed
     */
    public function getData()
    {
        return $this->text;
    }

    /**
     * Converts the data so it's suitable for the editmode
     *
     * @return mixed
     */
    public function getDataEditmode()
    {
        /*
        $document = Model\Document::getById($this->getDocumentId());

        return Text::wysiwygText($this->text, [
            'document' => $document,
            'context' => $this
        ]);
        */
        return $this->text;
    }

    /**
     * @see TagInterface::frontend
     *
     * @return string
     */
    public function frontend()
    {
        return $this->text; // TODO (pre?)
    }

    /**
     * @see TagInterface::setDataFromResource
     *
     * @param mixed $data
     *
     * @return $this
     */
    public function setDataFromResource($data)
    {
        $this->text = $data;

        return $this;
    }

    /**
     * @see TagInterface::setDataFromEditmode
     *
     * @param mixed $data
     *
     * @return $this
     */
    public function setDataFromEditmode($data)
    {
        $this->text = $data;

        return $this;
    }

    /**
     * @return bool
     */
    public function isEmpty()
    {
        return empty($this->text);
    }

    /**
     * @param Model\Webservice\Data\Document\Element $wsElement
     * @param $document
     * @param mixed $params
     * @param null $idMapper
     *
     * @throws \Exception
     */
    public function getFromWebserviceImport($wsElement, $document = null, $params = [], $idMapper = null)
    {
        $data = $this->sanitizeWebserviceData($wsElement->value);

        if ($data->text === null or is_string($data->text)) {
            $this->text = $data->text;
        } else {
            throw new \Exception('cannot get values from web service import - invalid data');
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
     * @param array $idMapping
     *
     * @return string|null
     *
     * @todo: no rewriteIds method ever returns anything, why this one?
     */
    public function rewriteIds($idMapping)
    {
        $html = str_get_html($this->text);
        if (!$html) {
            return $this->text;
        }

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

        $this->text = $html->save();

        $html->clear();
        unset($html);
    }

}
