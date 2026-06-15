import Link from './link'

export default async function AuthorHeading({ author, email }: { author: string, email: string }) {
  return (
    <div className={`mb-10`}>Written by {author} | <Link href="mailto:guyera@oregonstate.edu">guyera@oregonstate.edu</Link></div>
  )
}
