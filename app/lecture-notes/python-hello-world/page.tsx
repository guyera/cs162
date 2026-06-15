import PythonBlock from '../ui/pythonblock'
import SyntaxBlock from '../ui/syntaxblock'
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
      <P>We're going to start writing some Python code soon, but first we need to set up our development environment.</P>

      <SectionHeading id="venv">Python 3.12</SectionHeading>
      <P>Python is such a widely-used language that it is installed by default on many operating systems, including Linux. This class will use Python 3.12 (or above), which includes some nice language features that aren't present on older versions. While we could just upgrade our system's Python interpreter version, it's not usually the best approach because the OS needs Python and we might create some side effects.</P>

      <ShellBlock>{
`module load python/3.12`
      }</ShellBlock>

      <P>Now when you run <Code>python --version</Code>, you should see it print something like <Code>3.12.12</Code>. Any version above 3.12 is the right version for this class! If you want to install this version on your local machine, you probably don't have the <Code>module</Code> command available, but you can install Python 3.12 with <Code>pyenv</Code> (on Windows), <Code>apt|yum|dnf</Code> on Linux, or Homebrew on a Mac.</P>

      <SectionHeading id="venv">venv</SectionHeading>

      <P>We're going to install some Python development packages (specifically <Link href="#mypy">Mypy</Link>, and perhaps some others throughout the term). Trouble is, we don't have the necessary permissions to install software packages on the engineering servers.</P>

      <P>But there's a simple workaround. Python ships with a module called <Code>venv</Code>, which stands for <Term>Virtual Environment</Term>. Packages installed in a Python virtual environment are isolated from the rest of the system, and you have full access to every Python virtual environment that you create. Hence, Python virtual environments will allow us to install and use whatever software packages we need throughout the term. (See <Link href="https://docs.python.org/3/library/venv.html">the official docs about Python virtual environments</Link> for more info).</P>

      <P>Login to the engineering servers in a terminal via an SSH session. Use <Code>cd</Code> to navigate to your <Code>cs-162</Code> directory (if you don't already have one, you should create one via <Code>mkdir</Code>). Then execute the following shell command:</P>

      <ShellBlock>{
`python -m venv env`
      }</ShellBlock>

      <P>After a few minutes, the command will complete, and you'll have a new directory named <Code>env</Code> inside your <Code>cs-162</Code> directory (you can see it with <Code>ls</Code>). That directory contains the Python virtual environment that you'll use for all your work in this course.</P>

      <P>But you're not done yet. Next, you need to activate your Python virtual environment. The simplest way to do this is by sourcing the activation script, but that will only activate it until you log out of the engineering servers<Emdash/>next time you log in, it will be deactivated again. To make your life easier, I strongly suggest configuring Bash to automatically activate it immediately whenever you log into the engineering servers. To do this, use Vim to open up the <Code>.bashrc</Code> file in your home directory:</P>

      <ShellBlock>{
`vim ~/.bashrc`
      }</ShellBlock>

      <P>(You should already have a <Code>.bashrc</Code> file, and it should already have some important stuff in it. If it looks empty, then you probably typed its name wrong. It should be exactly <Code>~/.bashrc</Code>). Scroll to the bottom of the file. Enter insert mode (press the i key) and paste the following command into its own line:</P>

      <ShellBlock>{
`source ~/cs-162/env/bin/activate`
      }</ShellBlock>

      <P>If your <Code>cs-162</Code> directory is not stored directly inside your home directory (represented by the tilde, <Code>~</Code>), that's fine<Emdash/>just replace <Code>~/cs-162/env</Code> with the path to the <Code>env</Code> directory created in the previous step (recall that you can use <Code>pwd</Code> to see the path of your current working directory). Save and quit Vim (press escape to enter Normal Mode, and then type <Code>:wq</Code> and press enter).</P>

      <P>Finally, you need to get Bash to run the updated <Code>.bashrc</Code> script. It automatically runs this script every time you log into the engineering servers, so simply logging out (e.g., via the <Code>exit</Code> command, or by exiting out of your terminal) and logging back in will do the trick. Alternatively, you can just source the <Code>.bashrc</Code> file by running the following shell command in your terminal: <Code>source ~/.bashrc</Code>.</P>

      <P>The text <Code>(env)</Code> should now appear at the very left of your terminal prompt. For example, it might look something like this:</P>

      <ShellBlock copyable={false}>{
`(env) guyera@flip2:cs-162$`
      }</ShellBlock>
      
      <P>(You might see double parenthesis around your venv, which is okay.) This means that your virtual environment has been activated. You can now install Python packages.</P>

      <P>(If you'd ever like to undo this configuration, simply remove the line from <Code>~/.bashrc</Code> that you just added). You can also deactivate an active virtual environment by running:</P>

      <ShellBlock copyable={false}>{
`(env) guyera@flip2:cs-162$ deactivate
guyera@flip2:cs-162$`
      }</ShellBlock>

      <SectionHeading id="mypy">Mypy</SectionHeading>

      <P>The first thing you need to know about Python is that it's (sometimes infamously) known for its "duck typing" type system. This means that an object can be used in an expression so long as the object has all the methods and attributes referenced by that expression. For example, <Code>someVariable.print()</Code> is a valid Python expression so long as <Code>someVariable</Code> is an object with a method (member function) named <Code>print</Code> that has no required arguments (this will make more sense when we've covered classes, objects, and methods later on in the course). It's called "duck typing" because of the common idiom, "if it <Code>quack()</Code>'s like a <Code>Duck</Code>, then it must be a <Code>Duck</Code>". Moreover, in Python, the type of object referenced by a variable can change throughout the duration of the scope. For example, one line of code can assign <Code>x = 5</Code>, and then the next line of code can reassign <Code>x = 'Hello'</Code>, thereby changing the type of <Code>x</Code> from <Code>int</Code> to <Code>str</Code>.</P>

      <P>This is in stark contrast to many other programming languages that have strict static type systems. For example, in C++, every object (variable, constant, etc) must be (explicitly or implicitly) given a static type at declaration, and its static type cannot be changed from that point on<Emdash/>it may not be assigned a value of an incompatible type, and it may only be used in expressions that are specifically crafted to accept its static type.</P>

      <P>Although Python's duck typing might <It>sound</It> convenient, it's often really a nightmare <It>disguised</It> as convenience. Because variables' types can change at any time, knowing what type a variable is requires analyzing every single line of code in the entire scope since its type might change several times throughout that scope. In contrast, in C++, an object's (static) type cannot change once declared, so to know its (static) type, you only need to look at its declaration (C++ objects can also have dynamic types, which <It>can</It> change at runtime, but you should never need to know an object's dynamic type anyways).</P>

      <P>Static type systems also support powerful static analysis of type-related errors. That's to say, in C++, your compiler can catch type errors before you even <It>run</It> the program. In Python, type errors are inherently <It>runtime</It> errors because of its duck typing type system. Runtime errors are the worst kind of errors because 1) they aren't detected until you actually run the program, 2) even when you <It>do</It> run the program, depending on the nature of the error, it may or may not occur (e.g., if the type error is in an if statement body, it will only occur if that if statement body is <It>actually triggered</It> during the execution of the program), and 3) in the worst case, runtime errors can propagate to other runtime errors, which propagate further, and further, until a fault eventually occurs (e.g., the program crashes, or it produces nonsensical outputs) somewhere far away from the root cause of the problem. That's all to say, runtime errors can be hard to detect and diagnose. Hence, Python's duck typing makes type errors, which are one of the most common kinds of errors, hard to detect and diagnose.</P>

      <P>In case you still aren't sold, static types also serve as a clear form of documentation. For example, imagine a function named <Code>areaOfCircle()</Code> that accepts a parameter <Code>radius</Code> of type <Code>Meters</Code> and returns a value of type <Code>SquareMeters</Code>. You don't even need to look at the function's documentation to know exactly what this function does: you give it the radius of a circle in meters, and it returns the circle's area in square meters. In a duck typing type system with no static type hints, all you'd know is that the function accepts a radius <It>of some sort</It> and <It>maybe</It> returns <It>something</It>; you'd have to read the function's documentation or, worse, its implementation, if you want to know more. (A static type system would also prevent you from accidentally messing up your units here, like passing in a radius expressed in millimeters).</P>

      <P>So, there are lots of disadvantages to Python's duck typing, and lots of advantages of a static type system. The only real advantage of duck typing is that you never have to explicitly write out the names and definitions of types (i.e., it saves you keystrokes). Perhaps that tradeoff is worth it for extremely small, internal projects (e.g., when using Python as a <Link href="https://en.wikipedia.org/wiki/Scripting_language">scripting language</Link>), but it's often not worth it for larger codebases.</P>

      <P>Luckily, there is a way to leverage the power of static typing in a Python codebase. Although Python has a duck typing type system, it supports optional static type hints, and it can be supplemented with certain static analysis tools that get you pretty close to a C++-like static type system. <Link href="https://mypy-lang.org/index.html"><Term>Mypy</Term></Link> is one such tool, and it's essentially industry-standard at this point.</P>
      
      <P>So, we're going to install Mypy in our Python virtual environment. Every virtual environment comes with a copy of pip, which is a recursive acronym that stands for "pip installs packages". pip is the standard Python package manager, meaning it's used to install Python packages. We will use pip to intall Mypy. Make sure your virtual environment is activated, and then execute the following shell command:</P>

      <ShellBlock>{
`pip install mypy`
      }</ShellBlock>

      <P>Mypy is not very strict by default. However, it can be configured to be strict, and when the TAs use Mypy to verify that your code has no type errors, they will, indeed, configure it to be strict. Hence, you should do so as well so that it works the same way for you as it does for the TAs when they grade your work. Use <Code>vim</Code> to open your <Code>.bashrc</Code> file again:</P>

      <ShellBlock>{
`vim ~/.bashrc`
      }</ShellBlock>

      <P>Copy and paste the following command in its own line at the bottom of your <Code>.bashrc</Code> file:</P>

      <ShellBlock>{
`alias mypy='mypy --strict'`
      }</ShellBlock>

      <P>Save and quit vim. Log out of the engineering servers and log back in (or simply execute <Code>source ~/.bashrc</Code>). From now on, whenever you run <Code>mypy</Code> in your shell on the engineering servers, it will automatically run it under a stricter configuration.</P>

      <SectionHeading id="hello-world">Hello, World!</SectionHeading>

      <P>Our development environment is now configured, so we're ready to start writing code.</P>

      <P>Use <Code>vim</Code> to create and open a file called <Code>hello.py</Code>. You can create this file wherever you'd like, but I recommend creating it in a directory where you plan to follow along with my lecture demonstrations.</P>

      <P>Enter insert mode (by pressing the i key) and paste the following code into the file (e.g., via Ctrl+Shift+V):</P>

      <PythonBlock fileName="hello.py">{
`def main() -> None:
    print('Hello, World!')

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Whenever you make changes to a Python program in this course, you should <Ul>always</Ul> use <Code>mypy</Code> to verify that there are no type errors in your code. Let's do that now. Save and quit vim (enter Normal Mode via the escape key, and then save and quit by typing <Code>:wq</Code> and pressing the enter key). Then run the following shell command:</P>

      <ShellBlock>{
`mypy hello.py`
      }</ShellBlock>

      <P>This will run <Code>mypy</Code> over the code in <Code>hello.py</Code>, notifying you of any type errors (or other Mypy-discoverable errors) present in your source code. In this case, there's nothing wrong with the code, and a message should be printed to your terminal indicating as such. The very first time you run mypy, you may find it takes a while, but it will be faster in subsequent runs.</P>

      <P>Gradescope will always run <Code>mypy</Code> over your code when grading your programming submissions, so if you forget to do it yourself you might be surprised when you see test failures after submitting your code. Even if the program <It>works</It>, you'll still be penalized for having type errors.</P>

      <P>Now let's run the program itself. The standard way of running Python programs is through the <Code>python</Code> interpreter; simply execute the following shell command:</P>

      <ShellBlock>{
`python hello.py`
      }</ShellBlock>
      
        The text, "Hello, World!",should be printed to your terminal. Refer to my <Link href={`${PARENT_PATH}/${allPathData["python-basics"].pathName}`}>Python Basics lecture notes</Link> to learn why this program does what it does.
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
