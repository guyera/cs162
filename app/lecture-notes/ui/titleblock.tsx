import TitleHeading from './titleheading'
import AuthorHeading from './authorheading'

export default async function TitleBlock({ title, author, email }: { title: string, author: string, email: string }) {
  return (
    <div className="mb-10">
        <TitleHeading>{title}</TitleHeading>
        <AuthorHeading author={author} email={email}/>
    </div>
  )
}
