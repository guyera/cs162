export default async function Bold({ children }: { children?: any }) {
  return (
    <span className={`font-bold`}>{children}</span>
  )
}
