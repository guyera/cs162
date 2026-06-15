import RehypeCopyableCodeBlock from '@/app/ui/codeblock/rehypecopyablecodeblock'
import RehypeCodeBlock from '@/app/ui/codeblock/rehypecodeblock'

export default async function ShellBlock({ children, fileName, copyable=true } : { children?: any, copyable?: boolean, fileName?: string }) {
  return (
    <div className="mb-7 mx-3 text-base">
      {copyable ? <RehypeCopyableCodeBlock code={children} language="bash" fileName={fileName}/> : <RehypeCodeBlock code={children} language="bash" fileName={fileName}/>}
    </div>
  )
}
