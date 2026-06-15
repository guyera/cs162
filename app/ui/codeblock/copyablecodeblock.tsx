"use client"

import { useState } from 'react'

import ClipboardButton from '@/app/ui/codeblock/clipboardbutton'

function CopyableCodeBlock({ code, fileName, children }: { code?: string, fileName?: string, children?: any }) {
  const [mouseOver, setMouseOver] = useState(false)
  const onMouseOver = async () => {
    setMouseOver(true)
  }
  const onMouseOut = async () => {
    setMouseOver(false)
  }
  return (
    <div onMouseOver={onMouseOver} onMouseOut={onMouseOut}>
      {fileName ? <pre className="language-filename"><code>{fileName}</code></pre> : <></>}
      <div className="relative m-0">
        <div className="z-0">
          {children}
        </div>
        <ClipboardButton textToCopy={code} mouseOver={mouseOver} />
      </div>
    </div>
  )
}

export default CopyableCodeBlock
