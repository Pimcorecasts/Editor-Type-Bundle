# EditorTypeBundle

Pimcore Bundle that adds a new Object Fieldtype and Document Editable. It uses micorsoft's monaco editor and you can set the theme and the language via options (theme must be set in last editor - can only be set once)

```twig
{{ pimcore_editortype('editor', {
    'editorTheme': 'vs',
    'editorLanguage': 'markdown'
} }}
```

## defaults and possible options

### editorTheme

Default: vs

Options:
- vs
- vs-dark
- hc-black

### editorLanguage

Default: markdown

Options: [https://github.com/microsoft/monaco-languages/blob/master/README.md](https://github.com/microsoft/monaco-languages/blob/master/README.md)

