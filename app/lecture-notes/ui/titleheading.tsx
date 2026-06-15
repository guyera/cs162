import { inter } from '@/app/ui/fonts';

export default async function TitleHeading({ children }: { children?: any }) {
  return (
    <h1 className={`text-5xl mb-3 font-bold ${inter.className}`}>{children}</h1>
  )
}
