import { rehype } from 'rehype'
import { rehypePrismGenerator} from 'rehype-prism-plus'
import { refractor } from './refractor'
import parse from 'html-react-parser'
import { visit } from 'unist-util-visit'

import './prism-themes/prism-night-owl.css'
import './prism-themes/prism-one-light.css'
import './styles.css'

import CopyableCodeBlock from './copyablecodeblock'

const convert = (str: string) => {
  str = str.replace(/&/g, "&amp;");
  str = str.replace(/>/g, "&gt;");
  str = str.replace(/</g, "&lt;");
  str = str.replace(/"/g, "&quot;");
  str = str.replace(/'/g, "&#039;");
  return str;
}

const addMeta = (meta: String) => {
  if (!meta) return
  // @ts-ignore
  return (tree) => {
    // @ts-ignore
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName === 'code') {
        node.data = { meta: meta }
      }
    })
  }
}

async function RehypeCopyableCodeBlock({ code, language, fileName, highlightLines='', showLineNumbers=false, diff=false }: { code: string, language: string, fileName?: string, highlightLines?: string, showLineNumbers?: boolean, diff?: boolean }) {
  const rawHtml = `<pre class="${fileName ? 'has-filename' : ''}"><code class="language-${diff ? 'diff-' : ''}${language}">${convert(code)}</code></pre>`
  const processedHtml = await rehype()
    .data('settings', { fragment: true })
    .use(addMeta, highlightLines)
    .use(rehypePrismGenerator(refractor), { showLineNumbers: showLineNumbers })
    .process(rawHtml)
  const processedHtmlString = processedHtml.toString()
  return (
    <>
      <CopyableCodeBlock code={code} fileName={fileName}>
        {parse(processedHtmlString)}
      </CopyableCodeBlock>
    </>
  )
}

export default RehypeCopyableCodeBlock
