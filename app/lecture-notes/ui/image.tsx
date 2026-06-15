import NextImage from 'next/image'

export default async function Image({ src, alt }: { src: any, alt: string }) {
  return (
    <NextImage src={src} alt={alt} className={`ml-auto mr-auto max-w-[100%] mb-7`}/>
  )
}
