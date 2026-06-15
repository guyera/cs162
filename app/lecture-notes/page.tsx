import PythonBlock from './ui/pythonblock'
import SyntaxBlock from './ui/syntaxblock'
import TerminalBlock from './ui/terminalblock'
import ShellBlock from './ui/shellblock'
import Image from './ui/image'
import Code from './ui/code'
import It from './ui/italic'
import Bold from './ui/bold'
import Ul from './ui/underline'
import Term from './ui/term'
import Link from './ui/link'
import SectionHeading from './ui/sectionheading'
import P from './ui/paragraph'
import Emdash from './ui/emdash'
import Itemize from './ui/itemize'
import Enumerate from './ui/enumerate'
import Item from './ui/item'

import { inter } from '@/app/ui/fonts'
import { lusitana } from '@/app/ui/fonts'
import { garamond } from '@/app/ui/fonts'

import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'

// @ts-ignore
import sourcesConfig from './sources.yaml'
import TitleBlock from './ui/titleblock'

let orderedSourcePathNames: string[] = []
let sourcesByPathName: {[key: string]: { pageTitle: string, namedIdentifier: string }} = {}
let sourcesByNamedIdentifier: {[key: string]: { pathName: string, pageTitle: string }} = {}
for (let page of sourcesConfig.pages) {
  orderedSourcePathNames.push(page.pathName)
  sourcesByPathName[page.pathName] = {
    pageTitle: page.pageTitle,
    namedIdentifier: page.namedIdentifier
  }
  sourcesByNamedIdentifier[page.namedIdentifier] = {
    pathName: page.pathName,
    pageTitle: page.pageTitle
  }
}

let LECTURE_NOTES_ROOT_PATH = (() => {
  const filename = fileURLToPath(import.meta.url);
  return `/${path.dirname(filename).split("app/")[1]}`
})()

export const dynamic = 'force-static'
export const dynamicParams = false

export async function generateMetadata({ params } : { params: Promise<any> }) {
  return {
    title: "Lecture Notes"
  }
}

export default async function Page({ params }: any) {
  return (
    <>
      <div className={`w-[55rem] max-w-[100%] mx-auto pt-20 pb-20 px-4 ${inter.className} text-[1.25rem] leading-9`}>
        <TitleBlock title="CS 162 Lecture Notes" author="Alex Guyer" email="guyera@oregonstate.edu"/>
        
        <Enumerate listStyleType="decimal">
          {orderedSourcePathNames.map((pathName) => (<Item key={pathName}><Link href={`${LECTURE_NOTES_ROOT_PATH}/${pathName}`}>{sourcesByPathName[pathName].pageTitle}</Link></Item>))}
        </Enumerate>
      </div>
    </>
  )
}
