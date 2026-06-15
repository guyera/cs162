import { garamond } from '@/app/ui/fonts';

export default async function Itemize({ children, listStyleType="dash" }: { children?: any, listStyleType?: string }) {
  let listStyleClass: string
  switch (listStyleType) {
    case "dash":
      listStyleClass = "list-['-_']"
      break
    case "lower-alpha":
      listStyleClass = "list-[lower-alpha]"
      break
    default:
      throw new Error(`Expected listStyleType to be one of ['dash', 'lower-alpha'], but got ${listStyleType}`)
  }
  return (
    <ul className={`${listStyleClass} list-outside pl-16 mb-7`}>
      {children}
    </ul>
  )
}
