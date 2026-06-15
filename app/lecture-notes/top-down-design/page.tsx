import PythonBlock from '../ui/pythonblock'
import SyntaxBlock from '../ui/syntaxblock'
import TerminalBlock from '../ui/terminalblock'
import ShellBlock from '../ui/shellblock'
import Image from '../ui/image'
import Code from '../ui/code'
import It from '../ui/italic'
import Bold from '../ui/bold'
import Ul from '../ui/underline'
import Term from '../ui/term'
import Link from '../ui/link'
import SectionHeading from '../ui/sectionheading'
import P from '../ui/paragraph'
import Emdash from '../ui/emdash'
import Itemize from '../ui/itemize'
import Enumerate from '../ui/enumerate'
import Item from '../ui/item'

import { inter } from '@/app/ui/fonts'
import { lusitana } from '@/app/ui/fonts'
import { garamond } from '@/app/ui/fonts'

import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'

// @ts-ignore
import sourcesConfig from '../sources.yaml'
import TitleBlock from '../ui/titleblock'

let sourcesByPathName: {[key: string]: { pageTitle: string, namedIdentifier: string }} = {}
let sourcesByNamedIdentifier: {[key: string]: { pathName: string, pageTitle: string }} = {}
for (let page of sourcesConfig.pages) {
  sourcesByPathName[page.pathName] = {
    pageTitle: page.pageTitle,
    namedIdentifier: page.namedIdentifier
  }
  sourcesByNamedIdentifier[page.namedIdentifier] = {
    pathName: page.pathName,
    pageTitle: page.pageTitle
  }
}

let PATH_NAME = (() => {
  const filename = fileURLToPath(import.meta.url);
  return path.basename(path.dirname(filename))
})()

let PARENT_PATH = (() => {
  const filename = fileURLToPath(import.meta.url);
  return `/${path.dirname(path.dirname(filename)).split("app/")[1]}`
})()

export const dynamic = 'force-static'
export const dynamicParams = false

export async function generateMetadata({ params } : { params: Promise<any> }) {
  return {
    title: sourcesByPathName[PATH_NAME].pageTitle
  }
}

async function LectureNotes({ allPathData }: { allPathData: any }) {
  return (
    <>
      <P>Here's the outline for this lecture:</P>

      <Itemize>
        <Item><Link href="#top-down-design">Top-down design</Link></Item>
        <Item><Link href="#example">Example</Link></Item>
      </Itemize>

      <SectionHeading id="top-down-design">Top-down design</SectionHeading>

      <P>As you begin to engineer larger and more complex software products, it eventually becomes impractical to simply jump into the codebase and start writing code. At a certain point, you have to start spending some time thinking about the code components that you're going to create and how they're going to interface with one another <It>before</It> you actually implement them. This process of designing a codebase prior to implementation is referred to as <Bold>software design</Bold>.</P>

      <P>The practice of software design is its own field of study. We don't have time to cover it in detail. This lecture will focus on some of the basics. You may learn about some more formal software design principles if you take a software engineering course.</P>

      <P>The goal of software design is to produce a <Bold>model</Bold>, or representation, of the codebase up front without having to go through all the effort of actually writing the code. This model might be written in the form of a design document, for example, perhaps shared amongst and updated by the members of the software team.</P>

      <P>Software design models (e.g., design documents) are useful because analyzing them often reveals large, high-level mistakes. These mistakes are much easier to fix if they're discovered early on in the software development lifecycle, such as by analyzing the software design model rather than by encountering them after implementing thousands of lines of actual code.</P>

      <P>For example, perhaps you've found yourself deep into implementing a class or function when you suddenly realized that, in order to get it to fit into the rest of the application, you have to scrap the whole thing and start over. One of the main goals of software design is to work out these sorts of high-level issues before investing too much time into implementation.</P>

      <P>There are lot of different strategies surrounding software design, but we'll focus on <Bold>top-down</Bold> design. Top-down design means to start with a very zoomed-out, "high-level" view of the software product and its objectives, and, as you work on the design, slowly work your way downward toward the "lower-level" details. Once you get to a "low enough" level that you can reason about the solutions easily, you might feel comfortable terminating the design process and jumping into the code.</P>

      <P>(There also exist bottom-up design strategies, but they're beyond the scope of this lecture. We will, however, cover bottom-up <It>implementation</It> strategies in the <Link href={`${PARENT_PATH}/${allPathData["bottom-up-implementation-and-testing"].pathName}`}>next lecture</Link>.)</P>

      <SectionHeading id="example">Example</SectionHeading>

      <P>Discussion of software design can often seem very abstract, so let's make it concrete with an example.</P>

      <P>Suppose you're tasked with creating a program that computes the number of days between two dates (i.e., a program that "subtracts" one date from another date). This is a fairly complicated task given that different months have different numbers of days, and February in particular has a different number of days depending on whether it's a leap year (and leap year conditions are more complicated than you probably think they are). Because this task is complicated, it probably wouldn't be a good idea to just jump in and start writing code. It'd be a better idea to think about things and design a solution carefully up front, allowing you to work out the high-level logic before investing a ton of effort into implementation.</P>

      <P>The top-down design philosophy suggests that we should start by analyzing the problem at an extremely high level. Basically, this means breaking down the problem into just a couple <It>slightly</It> simpler problems. One possible design might start out like this:</P>

      <SyntaxBlock>{
`# Computes the distance in days between two given Dates,
# date1 and date2. Assumes that date1 comes before date2.
days_between_dates(date1, date2):
    if date1 is in the same year as date2:
        return days_between_dates_in_year(date1, date2)
    
    otherwise:
        answer = days_between_dates_in_year(date1, December 31 of same year as date1)
        answer = answer + 1 # To get to January 1 of the next year
        for each year y between date1 and date2 (exclusive):
            answer = answer + number_of_days_in_year(y)
        answer = answer + days_between_dates_in_year(January 1 of same year as date2, date2)
        return answer`
      }</SyntaxBlock>

      <P>The above represents a <Bold>design component</Bold>, meaning that it's a component of a complete software design model, but it isn't, itself, a complete software design model. More on this in a moment.</P>

      <P>It might look a bit like code to you. That's because I've chosen to model my software components using <Bold>pseudocode</Bold>. Pseudocode is exactly what it sounds like<Emdash/>a sort of low-effort, informal code-like description of a computational process. Importantly, pseudocode is <Ul>not</Ul> "real code". Software design models should usually be <Bold>language-agnostic</Bold>, meaning that they shouldn't be expressed in a specific programming language. Assuming your design is written in English, it should readable to any English-speaking programmer, regardless of what programming languages they're familiar with. This allows treating the programming language of choice as less of a design decision and more of an implementation decision (as it often should be... though there are cases where it shouldn't be, and in those cases it's usually okay for your design to conform more closely with some particular programming language).</P>

      <P>Pseudocode does not have a strict, universally agreed-upon syntax. It's simply a "code-like" written description of a computational process, and it shouldn't have the hallmarks of a particular programming language. For example, notice that I write "January 1 of same year as date2" to express a certain date without relying on language-specific syntax. In Python, this expression might look something like <Code>Date('Jan', 1, date2.year)</Code>, or similar, depending on how the <Code>Date</Code> type is represented. But that's not how I expressed it<Emdash/>I used English. It can be easily understood regardless of what programming languages the reader is familiar with. Moreover, I didn't have to think carefully about the strict syntax of a particular programming language when writing it; I only had to think about the high-level logic.</P>

      <P>Pseudocode is not the only way to describe a software design model. In many cases, a visual model consisting of diagrams and charts (e.g., flowcharts, etc) may be preferred. In fact, there's an entire family of visual diagrams that's collectively referred to as the <Bold><Link href="https://en.wikipedia.org/wiki/Unified_Modeling_Language">Unified Modeling Language (UML)</Link></Bold>. UML diagrams are more formalized than pseudocode, and they're generally understood among the software engineering community, so they're a common way of modeling software systems. There are many different kinds of UML diagrams, and they're far beyond the scope of this course. For this course, we'll just stick with pseudocode (this will make the TAs' lives easier).</P>

      <P>Before moving on, we should probably describe what a "date" consists of in the context of our system. After all, the above component receives two dates (<Code>date1</Code> and <Code>date2</Code>) as inputs, and it <It>implies</It> that dates somehow contain days, months, and years. Let's formalize that:</P>

      <SyntaxBlock>{
`type Date:
    day (integer)
    month (string)
    year (integer)`
      }</SyntaxBlock>

      <P>Again, the exact syntax is not strict. I've chosen to write it as I did because I think it clearly communicates that 1) a "Date" is some sort of data type in our system, and 2) Date instances contain (public-facing) day, month, and year attributes. It also explains the types of those attributes.</P>

      <P>Moving on. As I said, top-down design refers to a design philosophy wherein the design process starts at a zoomed-out, "high-level" view of the system and, as the design process goes on, slowly works down toward a zoomed-in, "lower-level" view. Take a look back at the <Code>days_between_dates</Code> component. In theory, that one component solves the <It>entire</It> problem. After all, the two dates must either be in the same year or different years. The <Code>days_between_dates</Code> component checks which of those two scenarios is the case, and then it handles the case accordingly.</P>

      <P>However, even though that single component theoretically <It>solves the entire problem</It>, it does not <It>describe the entire solution</It>. Indeed, many important details are left out. For one, it seems to rely on another component referred to as <Code>days_between_dates_in_year</Code>. Presumably, this component somehow computes the number of days between two dates that take place in the same year. However, it does not explain how that component works. Second, it seems to rely on another component referred to as <Code>number_of_days_in_year</Code>. Presumably, this component somehow computes the number of days in a given year. But again, it does not explain how that value will be computed (some years have 365 days, but others have 366).</P>

      <P>This is what I meant by "high-level". The <Code>days_between_dates</Code> component solves the entire problem, but it does not describe all the low-level details about the solution. It's only a "zoomed-out" view of a few high-level steps that, <It>if</It> implemented correctly, will indeed solve the problem. That is, it describes <It>what</It> some of the high-level steps are, but it does not describe <It>how</It> those high-level steps will be completed.</P>

      <P>Practicing proper top-down design requires a strong understanding of <Bold>abstraction</Bold>. Recall that abstraction refers to the concept of substituting complicated low-level details with simpler high-level <It>ideas</It>. In programming, functions and classes are common kinds of abstractions. For example, if you want to compute the square root of a value <Code>x</Code> in Python, you simply write <Code>math.sqrt(x)</Code>. You don't have to think about all the messy low-level details involved in actually computing that square root (the "implementation", or the "how")<Emdash/>you just have to think about the function's name, arguments, and return value (the "interface", or the "what"). </P>
      
      <P>Top-down design is all about abstraction, especially in the earlier stages. When you're working at a zoomed-out, high-level view, the components that you design will need to refer to some other components that will, eventually, describe some lower-level details (e.g., like how <Code>days_between_dates</Code> refers to <Code>days_between_dates_in_year</Code> and <Code>number_of_days_in_year</Code>). But the higher-level components themselves should not describe those lower-level details<Emdash/>they should <It>abstract away</It> those details.</P>

      <P>Now that we've implemented our highest-level component that describes the entire system at an extremely zoomed-out level, we can start working our way down closer to the lower-level details. Let's proceed with the <Code>number_of_days_in_year</Code> component:</P>

      <SyntaxBlock>{
`# Computes the number of days in the given year y
number_of_days_in_year(y):
    if is_leap_year(y):
        return 366
    otherwise:
        return 365`
      }</SyntaxBlock>

      <P>Again, this component is still <It>fairly</It> high-level. It makes it very clear that all leap years have 366 days, and all non-leap years have 365 days. It checks whether <Code>y</Code> is a leap year and returns the correct value. However, it does not explain <It>how</It> it will be determined whether <Code>y</Code> is a leap year or not. Instead, it delegates that responsibility to another component through an abstraction: <Code>is_leap_year</Code>.</P>

      <P>The idea is to continue in this manner, working our way closer and closer to the low-level details one component at a time.</P>

      <P>A natural question is: at what point do you stop designing and start coding? Well, a truly "complete" design should work out all the "logic" involved in the solution, leaving only trivial implementation details. That's to say, a truly complete design should be easy to convert to actual code because doing so should just be a menial translation effort, rewriting the psuedocode in a specific programming language.</P>

      <P>However, truly complete designs are extremely uncommon in practice. Rather, most software engineers will pause the design process (perhaps returning to it later<Emdash/>design documents are living documents) and move onto implementation once they feel confident that the remaining logic is sufficiently simple that they can figure it out during the implementation process without making large, high-level mistakes (e.g., the kinds of mistakes that would require scrapping large system components and rewriting them from scratch).</P>

      <P>For software designs that you write in this class, the rubric(s) will explain the expected degree of specificity / "completeness" in your submission.</P>

      <P>Let's finish up our design. First, the <Code>is_leap_year</Code> component:</P>

      <SyntaxBlock>{
`# Determines whether a given year is a leap year
is_leap_year(y):
    # A leap year occurs every year that's a multiple of 4,
    # except for years that are divisible by 100 but not 400.
    # (Yes, this is a true fact. See the below reference.)
    # https://en.wikipedia.org/wiki/Leap_year

    if y is divisible by 4:
        if y is divisible by 100 and y is not divisible by 400:
            return false
        otherwise:
            return true
    otherwise:
        return false # Not divisible by 4
`
      }</SyntaxBlock>

      <P>My design could go a <It>little</It> further into detail (e.g., replacing <Code>y is divisible by 4</Code> with <Code>y modulo 4 is 0</Code>), but I think this is good enough. Any reasonably decent programmer should know how to write an expression that determines whether one number is divisible by another<Emdash/>I don't think I need to spell that out.</P>

      <P>Next, the <Code>days_between_dates_in_year</Code> component:</P>

      <SyntaxBlock>{
`# Computes the number of days between two Dates that take place
# in the same year as each other.
days_between_dates_in_year(date1, date2):
    if date1's month is the same as date2's month:
        return date2's day - date1's day
    otherwise:
        answer = days_in_month(date1's month) - date1's day # To get to the end of date1's month
        answer = answer + 1 # To get to the first of the NEXT month
        for each month m between date1 and date2 (exclusive):
            answer = answer + days_in_month(m, date1's year) # To get past month m
        answer = answer + date2's day - 1 # To get to date2's day
`
      }</SyntaxBlock>

      <P>Here we refer to another new component: <Code>days_in_month</Code>. This component will compute the number of days in the given month (for the given year). It accepts the year as an input because the number of days in a given month might vary by year (as is the case with February, in particular). Indeed, this means that, while designing one high-level component, you may need to think about <It>some</It> of the lower-level details of its dependencies (lower-level components) insofar as you need to determine what information will need to be <It>passed</It> to those components (i.e., you need to at least figure out what their interfaces will look like).</P>

      <P>Finally, here's the <Code>days_in_month</Code> component:</P>

      <SyntaxBlock>{
`# Computes the number of days in the given month m, for the given year y
days_in_month(m, y):
    if m is in ['Sep', 'Apr', 'June', 'Nov']:
        return 30 # These months all have 30 days
    otherwise if m is NOT 'Feb':
        return 31 # These months all have 31 days
    otherwise:
        # m must be February. If it's a leap year, it has 29 days.
        # Otherwise, it has 28 days.
        if is_leap_year(y):
            return 29
        otherwise:
            return 28
`
      }</SyntaxBlock>
      
      <P>And at this point, all our components are fleshed out. Again, we could go into <It>slightly</It> more detail here and there, but the level of detail at this point is sufficient that most reasonably decent programmers (including every student this class, hopefully!) should be able to translate this design to actual code without too much effort (we'll actually do <It>some</It> of the implementation in the <Link href={`${PARENT_PATH}/${allPathData["bottom-up-implementation-and-testing"].pathName}`}>next lecture</Link>). So I'll stop here.</P>
    </>
  )
}

export default async function Page({ params }: any) {
  return (
    <>
      <div className={`w-[55rem] max-w-[100%] mx-auto pt-20 pb-20 px-4 ${inter.className} text-[1.25rem] leading-9`}>
        <TitleBlock title={sourcesByPathName[PATH_NAME].pageTitle} author="Alex Guyer" email="guyera@oregonstate.edu"/>
        <LectureNotes allPathData={sourcesByNamedIdentifier}/>
      </div>
    </>
  )
}
