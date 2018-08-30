import React from 'react';
import Prism from 'prismjs';
import PrismJsx from 'prismjs/components/prism-jsx.min';
import PrismBash from 'prismjs/components/prism-bash.min';
import FetchHandler from '../Request';
import Iframe from './Iframe';
import LinkRenderer from '../LinkRenderer';
import Markdown from 'react-markdown';
import './index.less';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import LangContext from '../ContextProvider';

const { Request } = FetchHandler;

let CodeMirror = null;
if (typeof window !== 'undefined' && typeof window.navigator !== 'undefined') {
  const { Controlled } = require('react-codemirror2');
  CodeMirror = Controlled;
  require('codemirror/mode/javascript/javascript');
}

const langMap = {
    js: 'javascript',
    jsx: 'jsx',
    shell: 'shell'
};

class CodeRenderer extends React.Component {
    constructor(props, context) {
        super(props, context);

        const { value } = props;
        this.state = {
            parseCode: null,
            rawCode: value || ''
        };

        this.timer = null;
    }

    componentDidMount = () => {

    }

    getCodeIframe = (parseCode) => {
        let content = null;
        
        const uniqueFrameKey = this.generateRandomRef();
        content = <Iframe uniqueKey={uniqueFrameKey} key={uniqueFrameKey} code={parseCode} />

        return content;
    }

    generateRandomRef = () => {
        const words = 'abcdefghijklmnopqrstuvwxyz';
        
        let name = '';
        for (var i = 0; i< 10; i ++) {
            const randomIdx = parseInt(Math.random()*26);
            name += words[randomIdx];
        }

        return name;
    }

    handleBeforeCodeChange = (editor, data, value) => {
        this.setState({ rawCode: value });
    }

    handleCodeChange = (editor, value) => {
        if (this.timer) {
            clearTimeout(this.timer);
        }

        this.timer = setTimeout(() => {
            this.runCode();
        }, 300);
    }

    queryIsEn = () => {
        return window.location.href.indexOf('en-US') !== -1;
    }

    render() {
        const { language, inline = false, value, lang: globalLang } = this.props;
        const isEn = this.queryIsEn();

        let mdValue = value;
        let enableDemo = false;
        let enableCode = true;

        let lang = language;
        if (language === 'onlydemo') {
            enableCode = false;
            enableDemo = true;
        } if (typeof language === 'string' && language.indexOf('demo') !== -1) {
            lang = language.replace(/demo/g, '');
            enableDemo = true;
        } else if (!language) {
            enableCode = false;
        } else if (language === 'iframe') {
            return <div className="demo-code-wrapper" dangerouslySetInnerHTML={{ __html: value }}></div>
        } else if (language.startsWith('i18n')) {
            const [cnVal, enVal] = value.split('@sep');
            const i18nVal = isEn ? enVal : cnVal;

            mdValue = i18nVal;
            lang = language.split('/')[1];
            if (!lang) {
                return <Markdown source={i18nVal} renderers={{
                    link: (props) => {
                        return <LinkRenderer {...props} lang={globalLang} />
                    }
                }} />
            }
        }

        let parsedDemo = null;
        if (enableDemo) {
            parsedDemo = <div className="demo-parsed-content">{this.getCodeIframe(mdValue)}</div>
        }

        let prettyCode = null;
        if (enableCode) {
            const html = Prism.highlight(mdValue, Prism.languages[langMap[lang] || lang]);
            const cls = 'language-' + lang;
            prettyCode = <div className="demo-raw-content">
                <pre className={cls}>
                    <code className={cls} dangerouslySetInnerHTML={{ __html: html}} />
                </pre>
            </div>
        }

        return (<div className="demo-code-wrapper">
            {prettyCode}
            {parsedDemo}
        </div>)
    }
}

export default CodeRenderer;