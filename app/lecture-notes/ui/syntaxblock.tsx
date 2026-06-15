import RehypeCopyableCodeBlock from '@/app/ui/codeblock/rehypecopyablecodeblock'
import RehypeCodeBlock from '@/app/ui/codeblock/rehypecodeblock'

export default async function SyntaxBlock({ children }: { children?: any }) {
  return (
    <div className="mb-7 mx-3 text-base">
      <RehypeCodeBlock code={children} language="none"/>
    </div>
  )
}
