export default async function Item({ children }: { children?: any }) {
  return (
    <li className={`mb-4`}>
      {children}
    </li>
  )
}
