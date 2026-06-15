import { inter } from '@/app/ui/fonts';

export default async function SectionHeading({ children, id }: { children?: any, id?: string }) {
  return (
    <h2 id={id} className={`text-4xl mt-10 mb-10 font-bold ${inter.className}`}>{children}</h2>
  )
}
