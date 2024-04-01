import Prism from 'prismjs';


class DotAndBoxEditor extends HTMLElement {
    static observedAttributes = ["code", "readonly"]
    dotAndBox: any
    code: string = ''
    readonly = false

    // noinspection JSUnusedGlobalSymbols
    connectedCallback() {
        const shadow = this.attachShadow({mode: "open"})
        shadow.innerHTML = `
      <link href="./lib/prism.js" rel="stylesheet" type="text/css">  
      <link href="./lib/prism.css" rel="stylesheet" type="text/css">  
      <link href="https://dot-and-box.github.io/dot-and-box/dot-and-box.js" rel="stylesheet" type="text/css">  

      <style>
        :host { display: block;  padding: 0; }
        .content-wrapper {
          overflow: hidden;
          display: flex;
          flex-wrap: wrap;
          
        }
        .editor {
          line-height:1.2em;
          background-size:2.4em 2.4em;
          background-origin:content-box;
          counter-reset: line;
          text-align:justify;
          font-family: monospace;
          overflow: auto;
          width: max-content;
          flex-grow: 1;
        }        
        [contenteditable]:focus { 
          outline: 0 solid transparent; 
        }   
        .menu-wrapper {
          margin-top: 0;
          margin-left: 0;
          position: relative;
          display: flex;
          gap: 5px;
          flex-wrap: wrap;
          justify-items: center;
          align-items: center;
          padding-left: 5px;
          padding-right: 5px;
        }     
       
        .separator {
          flex-grow:1;
        }
        .right-menu {
          flex-grow: ;
          display: flex;          
          width: max-content            
        }
        .menu-wrapper button.rounded {
          width: 36px;
          height: 36px;
          padding: 0;
          border-radius: 50%;
          border: 1px solid lightgray;
          background-color: transparent;
        }
        
        .button-icon {
          width: 36px;
          fill: rgba(23,23,23,0.7);       
        }
        .menu-wrapper button:hover {
          border: 1px solid gray ;
        }
        .editor.token {
            font-weight: bold;
        }
        code[class*="language-"],pre[class*="language-"] {
            color: black;
            background: none;
            text-shadow: 0 1px white;
            font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
            font-size: 1em;
            text-align: left;
            white-space: pre;
            word-spacing: normal;
            word-break: normal;
            word-wrap: normal;
            line-height: 1.5;
            -moz-tab-size: 4;
            -o-tab-size: 4;
            tab-size: 4;
            -webkit-hyphens: none;
            -moz-hyphens: none;
            -ms-hyphens: none;
            hyphens: none;
        }

        pre[class*="language-"]::-moz-selection, pre[class*="language-"] ::-moz-selection,
        code[class*="language-"]::-moz-selection, code[class*="language-"] ::-moz-selection {
            text-shadow: none;
            background: #b3d4fc;
        }
        
        pre[class*="language-"]::selection, pre[class*="language-"] ::selection,
        code[class*="language-"]::selection, code[class*="language-"] ::selection {
            text-shadow: none;
            background: #b3d4fc;
        }
        
        @media print {
            code[class*="language-"],
            pre[class*="language-"] {
                text-shadow: none;
            }
        }
        
        /* Code blocks */
        pre[class*="language-"] {
        padding: 1em;
        margin: .5em 0;
        overflow: auto;
        }
        
        :not(pre) > code[class*="language-"],
        pre[class*="language-"] {
        background: #f5f2f0;
        }
        
        /* Inline code */
        :not(pre) > code[class*="language-"] {
        padding: .1em;
        border-radius: .3em;
        white-space: normal;
        }
        
        .token.comment,
        .token.prolog,
        .token.doctype,
        .token.cdata {
        color: slategray;
        }
        
        .token.punctuation {
        color: #999;
        }
        
        .token.namespace {
        opacity: .7;
        }
        
        .token.property,
        .token.tag,
        .token.boolean,
        .token.number,
        .token.constant,
        .token.symbol,
        .token.deleted {
        color: #905;
        }
        
        .token.selector,
        .token.attr-name,
        .token.string,
        .token.char,
        .token.builtin,
        .token.inserted {
        color: #690;
        }
        
        .token.operator,
        .token.entity,
        .token.url,
        .language-css .token.string,
        .style .token.string {
        color: #9a6e3a;
        
        background: hsla(0, 0%, 100%, .5);
        }
        
        .token.atrule,
        .token.attr-value,
        .token.keyword {
        color: #07a;
        }
        
        .token.function,
        .token.class-name {
        color: #DD4A68;
        }
        
        .token.regex,
        .token.important,
        .token.variable {
        color: #e90;
        }
        
        .token.important,
        .token.bold {
        font-weight: bold;
        }
        .token.italic {
        font-style: italic;
        }
        
        .token.entity {
        cursor: help;
        }

       
      </style>
      <script src="prism.js"></script>
      <div class="menu-wrapper"> 
        <button id="run-code" class="rounded" title="run code">  
        <svg class="button-icon rounded" viewBox="0 0 36 36">       
           <path d="M 12 10 L 27 17 L 12 24 Z"/>           
        </svg></button>
          <div><input type="checkbox" id="autoplay" title="show controls" checked>autoplay</div>
          <span class="separator"></span>
          <div><input type="checkbox" id="show-grid" title="show grid">grid</div>
          <div><input type="checkbox" id="show-controls" title="show controls" checked>controls</div>
          <div><input type="checkbox" id="show-experimental" title="show controls">experimental</div>
          <div><input type="checkbox" id="toggle-editor" checked title="show/hide editor">editor</div>
          <div><button id="reformat" title="reformat">reformat</div>
          <div><button id="clear" title="clear">✖</div>
          <div class="right-menu"><button id="copy-clipboard" title="copy to clipboard">📋</button></div>           
        </div>
      <div class="content-wrapper">        
        <pre class="editor" spellcheck=false contenteditable></pre>
        <div style="flex-grow: 1">
          <slot name="player"><dot-and-box controls style="margin:5px; height: 400px"></dot-and-box></slot>
        </div>
              

      </div>
     `
        this.dotAndBox = shadow.querySelector('dot-and-box')
        const clipBoardButton: HTMLElement = this.getControl('#copy-clipboard')
        clipBoardButton.onclick = (_: any) => this.copyToClipBoard(this.code)

        const reformatButton: HTMLElement = this.getControl('#reformat')
        reformatButton.onclick = (_: any) => this.reformat()
        const clearButton: HTMLElement = this.getControl('#clear')
        clearButton.onclick = (_: any) => this.updateEditorCode('title: new ')

        const runCodeButton: HTMLElement = this.getControl('#run-code')
        runCodeButton.onclick = (_: any) => this.runCode()


        const showGridCheckBox: HTMLElement = this.getControl('#show-grid')
        showGridCheckBox.oninput = (v: any) => {
            if (v.target.checked) {
                this.dotAndBox.setAttribute('grid', true)
            } else {
                this.dotAndBox.removeAttribute('grid')
            }
        }

        const toggleEditor: HTMLElement = this.getControl('#toggle-editor')
        toggleEditor.oninput = (v: any) => {
            if (v.target.checked) {
                this.getEditor().style.display = 'block'
            } else {
                this.getEditor().style.display = 'none'
            }
        }

        const showControlsCheckBox = this.getControl('#show-controls')
        showControlsCheckBox.oninput = (v: any) => {
            if (v.target.checked) {
                this.dotAndBox.setAttribute('controls', true)
            } else {
                this.dotAndBox.removeAttribute('controls')
            }
        }

        const experimentalCheckBox = this.getControl('#show-experimental')
        experimentalCheckBox.oninput = (v: any) => {
            if (v.target.checked) {
                this.dotAndBox.setAttribute('experimental', true)
            } else {
                this.dotAndBox.removeAttribute('experimental')
            }
        }
        this.extendDABLang()
        this.updateAttachedControl()
        this.updateCode()
        this.updateReadonly()
    }

    extendDABLang() {
        // Prism.languages['dabl'] = Prism.languages.extend('clike', {
        //     'keyword': /\b(?:id|ids|at|text|step|title|box|dot|line|dots|boxes|layout|duration|size|color|selected|camera|visible|span|colors)\b/,
        // });

        Prism.languages.dabl = {
            'comment': [
                {
                    pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
                    lookbehind: true,
                    greedy: true
                },
                {
                    pattern: /(^|[^\\:])\/\/.*/,
                    lookbehind: true,
                    greedy: true
                }
            ],
            'string': {
                pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
                greedy: true
            },
            'class-name': {
                pattern: /(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,
                lookbehind: true,
                inside: {
                    'punctuation': /[.\\]/
                }
            },
            'keyword': /\b(?:id|ids|at|text|step|title|box|dot|line|dots|boxes|layout|duration|size|color|selected|camera|visible|span|colors)\b/,
            'boolean': /\b(?:false|true)\b/,
            'function': /\b\w+(?=\()/,
            'number': /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
            'operator': /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
            'punctuation': /[{}[\];(),.:]/
        };

    }

    runCode() {
        const newCode = this.updateCodeFromEditor()
        this.updateCode()
        const autoplayCheckBox = this.getControl('#autoplay') as HTMLInputElement
        this.dotAndBox.code = newCode
        if (autoplayCheckBox.checked) {
            setTimeout(() => this.dotAndBox.fastForward(), 10); //workaround - check out why
        }
    }

    reformat() {
        let codeToFormat = this.getCodeFromEditor()
        let lines = codeToFormat.split(/\r?\n/)
        let result: string[] = [];
        lines.forEach(line => {
            let l = line.trim()
            if (l !== '') {
                result.push(l + '\n')
            }
        })
        const newCode = result.join('')
        this.updateEditorCode(newCode)
    }

    copyToClipBoard(txt: any) {
        this.updateCodeFromEditor()
        navigator.clipboard.writeText(txt);
    }

    getCodeFromEditor() {
        const editor = this.getEditor()
        return editor.innerText
    }

    updateEditorCode(code: string) {
        const editor = this.getEditor()
        editor.innerHTML = Prism.highlight(code, window.Prism.languages.dabl, 'dabl')
    }

    updateCodeFromEditor() {
        this.code = this.getCodeFromEditor()
        return this.code
    }

    getEditor() {
        return this.getControl('.editor')
    }

    getControl(querySelector: string): HTMLElement {
        const el: HTMLElement | null = this.shadowRoot!.querySelector(querySelector)
        if (el) {
            return el as HTMLElement
        } else {
            return new HTMLElement()
        }
    }

    updateCode() {
        if (this.shadowRoot) {
            this.updateEditorCode(this.code)
        }
    }

    updateReadonly() {
        if (this.shadowRoot && this.readonly) {
            const editor = this.getControl('.editor')
            editor.removeAttribute("contenteditable")
        }
    }

    updateAttachedControl() {
        if (this.shadowRoot) {
            if (this.dotAndBox && this.dotAndBox.initialized) {
                this.updateCode()
            }
        }
    }

    // noinspection JSUnusedGlobalSymbols
    attributeChangedCallback(name: any, _: any, newValue: any) {
        if (name === 'code') {
            this.code = newValue
            this.updateCode()
        }
        if (name === 'readonly') {
            this.readonly = newValue != null
            this.updateReadonly()
        }

    }

}

customElements.define('dot-and-box-editor', DotAndBoxEditor)