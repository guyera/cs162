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
      <P>This lecture is about <Bold>modules</Bold> and <Bold>packages</Bold>. We'll cover the following:</P>

      <Itemize>
        <Item><Link href="#defining-custom-modules">Defining custom modules</Link></Item>
        <Item><Link href="#defining-custom-packages">Defining custom packages</Link></Item>
        <Item><Link href="#pycache"><Code>__pycache__</Code></Link></Item>
      </Itemize>

      <SectionHeading id="defining-custom-modules">Defining custom modules</SectionHeading>

      <P>So far, all of the programs that we've written have been written in one gigantic Python file. As you start writing larger, more complex programs, it becomes important to organize your code into several smaller files rather than one giant file. Every programming language worth its salt provides some way of doing this. In Python, it's done through <Bold>packages</Bold> and <Bold>modules</Bold>. We'll start with modules.</P>

      <P>For the most part, every Python file (i.e., any file ending in <Code>.py</Code>) is a Python module. Python modules (and packages) can be <Bold>imported</Bold> into other Python modules via the <Code>import</Code> keyword. When one module A imports another module B, A gets access to the various things (functions, classes, module-scope variables, module-scope constants, etc) that are defined within B. You've actually already done this several times to import modules and packages that are provided by the Python standard library (e.g., <Code>import math</Code>, and <Code>from typing import TextIO</Code>). But yes, the <Code>import</Code> keyword can be used to import your own custom modules and packages as well.</P>

      <P>Wihin a Python module (i.e., within a file ending in <Code>.py</Code>), you can import another Python module via the following syntax:</P>

      <SyntaxBlock>{
`import <name of other module>`
      }</SyntaxBlock>

      <P>Replace <Code>{'<name of other module>'}</Code> with the name of the other Python module that you'd like to import. However, when writing out the name of the other module, leave out the <Code>.py</Code> extension (for example, it should be <Code>import math</Code>, <Ul>not</Ul> <Code>import math.py</Code>).</P>

      <P>When Mypy or the interpreter encounters an <Code>import</Code> statement, it searches for the specified module. If it (Mypy or the interpreter) fails to locate the specified module, errors will ensue.</P>

      <P>When Mypy or the interpreter is looking for a module to be imported, it will look in various directories. These directories are listed together in a special (somewhat configurable) directory list known as the <Bold>module search path</Bold>. By default, the first directory in the module search path, and therefore the first directory in which Python will look for imported modules, is the directory containing the Python script that's currently being executed. If the imported module cannot be found in that directory, then Mypy or the interpreter will move on to check other directories in the module search path, including system-level and environment-level directories (e.g., directories containing the Python standard library, such as the <Code>math</Code> package, the <Code>typing</Code> package, and so on).</P>

      <P>For example, suppose you have a Python module (file) named <Code>main.py</Code> that looks like this:</P>

      <PythonBlock fileName="main.py">{
`import hello

def main() -> None:
    # TODO Write some interesting code here...

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>When you run the above program through Mypy, or when you execute the above program through the Python interpreter, Mypy or the interpreter will encounter the <Code>import hello</Code> statement on line 1 and immediately look for a file named <Code>hello.py</Code> within the same directory that contains <Code>main.py</Code> (the above program itself). If there is no file named <Code>hello.py</Code> within that directory, it will move on and check other system-level directories (e.g., in case the <Code>hello</Code> module or package is provided by a system-installed / environment-installed library).</P>

      <P>Moving on. Suppose <Code>hello.py</Code> is, indeed, present in the same directory as the one containing <Code>main.py</Code>, and suppose that <Code>hello.py</Code> looks like this:</P>

      <PythonBlock fileName="hello.py">{
`class Dog:
    name: str
    birth_year: int

def print_dog(dog: Dog) -> None:
    print(f'{dog.name} was born in {dog.birth_year}')
`
      }</PythonBlock>

      <P>The <Code>hello.py</Code> module above defines a class, <Code>Dog</Code>, and a function, <Code>print_dog()</Code>. Suppose we want to use these things within some other Python module, such as <Code>main.py</Code>. First, we of course have to import the <Code>hello.py</Code> module via <Code>import hello</Code>, as I showed you just a moment ago. Once you've done that, you can access the things that are defined within the <Code>hello</Code> module via the dot operator, similar to how you can access attributes within a class instance via the dot operator. For example, within <Code>main.py</Code>, we could access the <Code>Dog</Code> class via <Code>hello.Dog</Code>, and we could access the <Code>print_dog</Code> function via <Code>hello.print_dog</Code>:</P>

      <PythonBlock fileName="main.py" highlightLines="{8,18}">{
`import hello

def main() -> None:
    # Rather than my_dog = Dog(), which is how we'd create a Dog
    # instance if the Dog class was defined within this module,
    # we instead use my_dog = hello.Dog() because the Dog class is
    # defined in the hello module (hello.py), imported above.
    spot = hello.Dog()

    # You can use the spot variable like normal
    spot.name = 'Spot'
    spot.birth_year = 2022
    
    # We have a neat function named print_dog() that prints a given
    # Dog instance, but it's defined in the hello module. So, to
    # access it, we have to write 'hello.print_dog' instead of
    # simply 'print_dog'
    hello.print_dog(spot)

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>To run the above program, simply type <Code>python main.py</Code> into the terminal. Yes, there are multiple Python modules involved now, but <Code>main.py</Code> is the one that contains the <Code>main()</Code> function and the code to execute it (i.e., the if statement at the very bottom of <Code>main.py</Code>), so it's the one that we should execute if our goal is to run the program. You can, technically, run <Code>python hello.py</Code>, but it wouldn't do anything interesting; it would define a class and a function, but it wouldn't actually <It>use</It> those things in any way. In contrast, <Code>main.py</Code> defines the <Code>main()</Code> function <It>and</It> calls it.</P>

      <P>Here's an example run:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python main.py
Spot was born in 2022
`
      }</TerminalBlock>

      <P>You might also be wondering how to run the above program through Mypy. If you just execute <Code>mypy main.py</Code>, that will <It>only</It> tell Mypy to analyze <Code>main.py</Code><Emdash/>it will largely ignore <Code>hello.py</Code>. You don't want that. In our case, the simplest way to tell Mypy to analyze every file in the entire program is to give it a directory rather than a specific file. When Mypy is given a directory, it will analyze every file in that directory, as well as every file within every directory within that directory, and so on.</P>

      <P>Suppose that <Code>main.py</Code> and <Code>hello.py</Code> are both in your working directory. Then, to get Mypy to analyze both of these files, simply specify your working directory as the argument to the <Code>mypy</Code> shell command. Now would be a good time to remind you that <Code>.</Code> (a single period) is an alias for a given directory (similar to how <Code>..</Code> is an alias for a given directory's parent), so when used as a relative path, it refers to the working directory.</P>

      <P>That's all to say, you can tell Mypy to analyze every file in your working direcory (and recursively) like so:</P>

      <TerminalBlock copyable={false}>{
`mypy .`
      }</TerminalBlock>

      <P>And here's what it looks like if we do that right now:</P>

      <TerminalBlock copyable={false}>{
`(env) $ mypy .
Success: no issues found in 2 source files
`
      }</TerminalBlock>

      <P>Notice that it says <Ul>2 source files</Ul>, indicating that it analyzed both <Code>main.py</Code> <Ul>and</Ul> <Code>hello.py</Code>.</P>

      <P>Now, the name <Code>hello.py</Code> is not very accurate. Given that I've put a <Code>Dog</Code> class and a <Code>print_dog</Code> function in it, I probably should rename it to something like <Code>dog.py</Code>. Let's do that, and let's update our <Code>main.py</Code> file accordingly:</P>

      <PythonBlock fileName="main.py" highlightLines="{1,8,18}">{
`import dog

def main() -> None:
    # Rather than my_dog = Dog(), which is how we'd create a Dog
    # instance if the Dog class was defined within this module,
    # we instead use my_dog = dog.Dog() because the Dog class is
    # defined in the dog module (dog.py), imported above.
    spot = dog.Dog()

    # You can use the spot variable like normal
    spot.name = 'Spot'
    spot.birth_year = 2022
    
    # We have a neat function named print_dog() that prints a given
    # Dog instance, but it's defined in the dog module. So, to
    # access it, we have to write 'dog.print_dog' instead of
    # simply 'print_dog'
    dog.print_dog(spot)

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Line 8 in particular might seem a bit confusing, but it's correct. We're instantiating the class named <Code>Dog</Code>, which is defined in a module named <Code>dog</Code>, which is imported on line 1 (and the module is named <Code>dog</Code> because it's provided by <Code>dog.py</Code>). That's a lot of dogs! (And that's why I initially named it <Code>hello.py</Code> instead of <Code>dog.py</Code><Emdash/>to avoid confusing you with the word "dog" being used in so many different places for different reasons. But you'll have to get used to it!)</P>

      <P>As you might recall, it's possible to import individual things from a module rather than importing the entire module itself. To do this, use the <Code>{'from <module> import <thing>'}</Code> syntax, where <Code>{'<module>'}</Code> is the name of the module from which you want to import something, and <Code>{'<thing>'}</Code> is the thing that you want to import. For example:</P>

      <PythonBlock showLineNumbers={false}>{
`from dog import Dog`
      }</PythonBlock>

      <P>Or:</P>

      <PythonBlock showLineNumbers={false}>{
`from dog import print_dog`
      }</PythonBlock>

      <P>You can also import multiple things from a single module at once by writing all of them out in a comma-separated list:</P>

      <PythonBlock showLineNumbers={false}>{
`from dog import Dog, print_dog`
      }</PythonBlock>

      <P>And if you need to import so many things that you can't write them all in one line of code without violating the style guidelines, you can separate each imported thing into its own line, provided that each line (except for the last one) ends in a backslash:</P>
      
        <PythonBlock showLineNumbers={false}>{
`from dog import Dog,\\
    print_dog`
      }</PythonBlock>

      <P>Whenever something is imported using the <Code>{'from <module> import <thing>'}</Code> syntax, you can use the imported thing without prefixing it with the name of the module and the dot operator. For example:</P>

      <PythonBlock fileName="main.py" highlightLines="{4-6,11-13}">{
`from dog import Dog, print_dog

def main() -> None:
    # Notice: It's now just Dog(), as opposed to dog.Dog(), because of
    # the way that we imported it
    spot = Dog()

    spot.name = 'Spot'
    spot.birth_year = 2022
    
    # Notice: It's now just print_dog, as opposed to dog.print_dog,
    # because of the way that we imported it
    print_dog(spot)

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Lastly, as you import things (or entire modules), you can essentially "rename" them as you do so. You do this using the <Code>as</Code> keyword. Consider the following example:</P>

      <PythonBlock>{
`import dog as d
from dog import print_dog as pd`
      }</PythonBlock>

      <P>Line 1 in the above example code imports the entire <Code>dog</Code> module (<Code>dog.py</Code>), but as it imports it, it essentially renames it to <Code>d</Code>. From that point on, to access something within the dog module, you would write <Code>d</Code> instead of <Code>dog</Code> (e.g., <Code>d.Dog</Code>, as opposed to <Code>dog.Dog</Code>). Line 2 in the above example code imports the <Code>print_dog</Code> function from the <Code>dog</Code> module, but as it imports it, it essentially renames it to <Code>pd</Code>. From that point on, to use the <Code>print_dog</Code> function, you would write <Code>pd</Code> instead of <Code>print_dog</Code> (e.g., <Code>pd(spot)</Code>, as opposed to <Code>print_dog(spot)</Code>).</P>

      <P>To be clear, the imported thing is only "renamed" in the context of the module that's doing the importing. If <Code>main.py</Code> has a line that says <Code>import dog as d</Code>, but some other file <Code>coolfile.py</Code> has a line that says <Code>import dog</Code>, then in the context of <Code>main.py</Code>, <Code>d</Code> should be used to access things defined in <Code>dog.py</Code>, but in the context of <Code>coolfile.py</Code>, <Code>dog</Code> should be used to access things defined in <Code>dog.py</Code>.</P>

      <P>(Some very popular Python libraries actually have conventions about how you should import them. For example, the <Code>numpy</Code> library is almost always imported via <Code>import numpy as np</Code>, renaming it to "np" as it's imported. Similarly, the <Code>pandas</Code> library is almost always imported via <Code>import pandas as pd</Code>)</P>


      <SectionHeading id="defining-custom-packages">Defining custom packages</SectionHeading>

      <P>You now know how to separate your code into multiple files, but what if you want to separate it into multiple <It>directories</It>? The simplest way to do this is via Python <Bold>packages</Bold>.</P>

      <P>The Python import system is somewhat complicated, and this isn't meant to be a Python course (Python is just the tool through which we're learning about the fundamentals of computer science), so I'll try to keep it simple. For our purposes, a Python package is basically just a directory that contains one or more importable Python modules, along with a special file named <Code>__init__.py</Code>. This file, <Code>__init__.py</Code> (and yes, it must have that exact name), can even be completely empty if you want it to be. Its mere presence tells Mypy and the Python interpreter that the directory is not merely a directory, but rather a package, and therefore the Python modules contained within it can be imported into other Python modules that are <It>not</It> within that same directory.</P>

      <P>For example, suppose we want to update our program and introduce a <Code>Cat</Code> class and a <Code>print_cat()</Code> function. We might put those definitions in <Code>cat.py</Code> (the exact contents of this file are irrelevant for this demonstration; just assume that it defines <Code>Cat</Code> and <Code>print_cat()</Code>, similar to how <Code>dog.py</Code> defines <Code>Dog</Code> and <Code>print_dog()</Code>). Since dogs and cats are both animals, it might make sense to put <Code>dog.py</Code> and <Code>cat.py</Code> together in, say, an <Code>animals/</Code> directory. Our updated directory structure will look like this:</P>

      <TerminalBlock copyable={false}>{
`animals/
    dog.py
    cat.py
main.py`
      }</TerminalBlock>

      <P>But, as I implied a moment ago, in order for <Code>main.py</Code> to still be able to import the <Code>dog</Code> and <Code>cat</Code> modules despite the fact that they're nested in a separate <Code>animals/</Code> directory, the <Code>animals/</Code> directory <Ul>must</Ul> be converted into a Python package (in general, Python modules cannot be imported from regular directories... unless you jump through some hoops to make use of so-called "implicit namespace packages", but those are beyond the scope of this course).</P>

      <P>To tell Mypy and the Python interpreter that <Code>animals/</Code> should be treated specifically as a package rather than a regular directory, we must provide a file named <Code>__init__.py</Code> within the <Code>animals/</Code> directory. For basic use cases, <Code>__init__.py</Code> can be left empty, and its entire purpose is to mark the directory as a package (but it must exist nonetheless). Our updated directory structure looks like this:</P>

      <TerminalBlock copyable={false}>{
`animals/
    __init__.py
    dog.py
    cat.py
main.py`
      }</TerminalBlock>

      <P>We can now import the <Code>dog</Code> and <Code>cat</Code> modules within <Code>main.py</Code> again. However, the syntax is slightly different. To import the <Code>dog</Code> module, rather than simply typing <Code>import dog</Code> as we did before, we now have to type <Code>import animals.dog</Code>. To clarify, this imports the module named <Code>dog</Code> (i.e., <Code>dog.py</Code>), which can be found in the package named <Code>animals</Code> (i.e., the <Code>animals/</Code> directory). Similarly, rather than writing <Code>from dog import Dog</Code>, we would now have to write <Code>from animals.dog import Dog</Code>. If we wanted to import the <Code>Cat</Code> class from <Code>animals/cat.py</Code>, we'd have to write <Code>from animals.cat import Cat</Code>. And so on.</P>

      <P>Let's update <Code>main.py</Code> accordingly:</P>

      <PythonBlock fileName="main.py">{
`from animals.dog import Dog, print_dog

def main() -> None:
    # Notice: It's now just Dog(), as opposed to dog.Dog(), because of
    # the way that we imported it
    spot = Dog()

    spot.name = 'Spot'
    spot.birth_year = 2022

    # Notice: It's now just print_dog, as opposed to dog.print_dog,
    # because of the way that we imported it
    print_dog(spot)

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Running <Code>python main.py</Code> does the same thing as before.</P>

      <P>It's also possible to import an entire module that's nested within a package. But from that point on, in order to use the module, you must write out its fully qualified name. For example:</P>

      <PythonBlock>{
`import animals.dog # Import the entire dog module from the animals package

# And then later, you can do this. Notice: it's animals.dog.Dog instead of
# simply dog.Dog
spot = animals.dog.Dog()`
      }</PythonBlock>

      <P>Suppose you want to import the <Code>Dog</Code> class and the <Code>Cat</Code> class all at once in a single line of code. As it stands, there's no way to do that<Emdash/>the <Code>Dog</Code> class is provided by <Code>animals.dog</Code>, and the <Code>Cat</Code> class is provided by <Code>animals.cat</Code>. Yes, they're in the same package, but separate modules, so they must be imported separately:</P>

      <PythonBlock showLineNumbers={false}>{
`from animals.dog import Dog
from animals.cat import Cat`
      }</PythonBlock>

      <P>However, there is technically a way to import them both in a single line of code: you can import them directly from the package rather than importing them from their respective modules. Although this is possible, it'd require more configuration. Currently, our <Code>__init__.py</Code> file is empty, but it doesn't have to be. The <Code>__init__.py</Code> file can be used to define package-level importables. That's to say, anything that is defined within a package's <Code>__init__.py</Code> file can then be imported from the package directly. For example, if <Code>main.py</Code> had a line of code written as <Code>from animals import xyz</Code>, that would import <Code>xyz</Code> directly from <Code>animals/__init__.py</Code>.</P>

      <P>Moreover, anything that's imported <It>within</It> a package's <Code>__init__.py</Code> file can then be imported <It>from</It> that package within another module. For example, it's possible to have <Code>animals/__init__.py</Code> import the <Code>Dog</Code> and <Code>Cat</Code> classes from <Code>animals.dog</Code> and <Code>animals.cat</Code> (respectively), and then have <Code>main.py</Code> import these classes directly from the <Code>animals</Code> package (e.g., <Code>from animals import Dog, Cat</Code>).</P>
      
      <P>However, getting this to work would require discussing several more details about Python's package import system, and that's really not the point of this class, so we'll stop here. If you're curious, I encourage you to research the purpose of <Code>__init__.py</Code>, including the <Code>__all__</Code> symbol.</P>


      <SectionHeading id="pycache"><Code>__pycache__</Code></SectionHeading>

      <P>Once your code is organized into several modules and packages, you might notice a <Code>__pycache__</Code> directory automatically appear inside your project directory and contained packages. This is normal. The <Code>__pycache__</Code> directory is autogenerated by the Python interpreter and contains cached bytecode for compiled Python modules and packages (indeed, CPython compiles Python code into bytecode before interpreting said bytecode<Emdash/>it's a sort of hybrid between a compiled and an interpreted language implementation).</P>

      <P>In general, you can ignore the <Code>__pycache__</Code> directory. In practice, it's best to avoid committing it to version control, meaning you shouldn't stage it via <Code>git add</Code> to be included in subsequent commits. If you'd like, you can create a <Code>.gitignore</Code> file and add the <Code>__pycache__</Code> directory to it. But that's beyond the scope of this course, and if you accidentally commit a <Code>__pycache__</Code> directory in a lab or homework assignment, that's okay<Emdash/>you won't be penalized for it.</P>
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
