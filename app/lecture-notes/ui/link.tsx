import NextLink from 'next/link'

export default async function Link({ children, href }: { children?: any, href: string }) {
  return (
    <NextLink href={href} className={`underline text-blue-600 hover:text-blue-800 visited:text-purple-600`}>{children}</NextLink>
  )
}
