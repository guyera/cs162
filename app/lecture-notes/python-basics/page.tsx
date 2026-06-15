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
      <P>This lecture will teach you the basics of Python. We'll cover the following:</P>

      <Itemize>
        <Item><Link href="#program-boilerplate">Program boilerplate</Link></Item>
        <Item><Link href="#standard-output">Standard output</Link></Item>
        <Item><Link href="#types-expressions-and-operators">Types, Expressions, and operators</Link></Item>
        <Item><Link href="#variables">Variables</Link></Item>
        <Item><Link href="#f-strings">F-strings</Link></Item>
        <Item><Link href="#type-casting">Type Casting</Link></Item>
        <Item><Link href="#functions">Functions</Link></Item>
        <Item><Link href="#scope">Scope</Link></Item>
        <Item><Link href="#standard-input">Standard input</Link></Item>
        <Item><Link href="#if-statements">If statements</Link></Item>
        <Item><Link href="#loops">Loops</Link></Item>
        <Item><Link href="#imports">Imports</Link></Item>
        <Item><Link href="#lists">Lists</Link></Item>
        <Item><Link href="#tracebacks">Tracebacks</Link></Item>
        <Item><Link href="#code-style">Code style</Link></Item>
        <Item><Link href="#explicit-type-annotations-of-local-variables">Explicit type annotations of local variables</Link></Item>
      </Itemize>

      <SectionHeading id="program-boilerplate">Program boilerplate</SectionHeading>

      <P>By default, whenever a Python file is loaded in any way, be it directly into the <Code>python</Code> interpreter (e.g., <Code>python hello.py</Code>) or indirectly imported from within another Python file (e.g., <Code>import hello.py</Code>), all the code contained within the loaded file will be executed immediately in top-down order. But in many cases (specifically when creating a standalone Python program), you have a block of code that you <It>only</It> want to be executed when the file containing that code is loaded specifically into the Python interpreter<Emdash/>not when imported from another Python file.</P>

      <P>This can be achieved by wrapping that block of code in an if statement that looks like this:</P>

      <PythonBlock>{
`if __name__ == '__main__':
    # YOUR CODE GOES HERE
    # BY THE WAY, EVERYTHING AFTER A # SYMBOL WITHIN A LINE OF
    # CODE IS CONSIDERED A COMMENT. COMMENTS ARE MEANT TO
    # EXPLAIN ADJACENT CODE AND ARE IGNORED BY THE
    # INTERPRETER.`
      }</PythonBlock>

      <P>We'll talk more about <Link href="#variables">variables</Link> and <Link href="#if-statements">if statements</Link> later. For now, all you need to understand is that whenever a Python file is loaded, a special builtin variable called <Code>__name__</Code> is automatically defined, and it stores the name of the currently loaded module. When a Python file is loaded via the <Code>python</Code> interpreter from the shell (and only in such a case), this <Code>__name__</Code> variable is automatically populated with the value <Code>'__main__'</Code>. The if statement condition, then, ensures that whatever code you write inside the if statement body will only be executed when the Python file is loaded via the <Code>python</Code> interpreter. When the Python file is loaded in some other way, the code in this if statement will not be executed.</P>

      <P>Moreover, it's somewhat common practice to define a function named <Code>main()</Code> that starts off the program, and then call (execute) this function within the above if statement body. In fact, calling the <Code>main()</Code> function is usually the only thing that's done within the above if statement body. The <Code>main()</Code> function does the rest, executing the entire program (usually by calling other functions, which call other functions, and so on). Putting it all together, here's the complete boilerplate code for most if not all Python programs that we'll create in this class:</P>

      <PythonBlock>{
`def main() -> None:
    # YOUR CODE GOES HERE

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <SectionHeading id="standard-output">Standard output</SectionHeading>

      <P>Let's learn some terminology. A <Term>computer program</Term>, or simply program, is a set of instructions that can be carried out by a computer in some way or another. A <Term>programming language</Term>, such as Python, is a language in which programs can be written. The moment you load a program and begin executing it (e.g., in your terminal and shell), a <Term>process</Term> is created to represent that running instance of the program (a process and a program are not the same thing<Emdash/>a single program can be running in multiple processes simultaneously, like when you have multiple browser windows open at the same time).</P>

      <P>Every process has three special files associated with it known as <Term>standard input</Term>, <Term>standard output</Term>, and <Term>standard error</Term>. Standard input is a file from which the process can read data. Standard output and standard error are files to which the process can write data (standard output is for reporting "normal" data, and standard error is for reporting errors).</P>

        <P>Typically, all three of these standard files are hooked up to the terminal. In other words, a process can read data from the terminal (as typed in by the user during the process's execution) by reading from standard input, and a process can write data to the terminal (to be displayed to the user during the process's execution) by writing to standard output or standard error.</P>

      <P>To write data to standard output in a Python program, simply use the builtin <Code>print()</Code> function. There are various kinds of expressions that you can put between the parentheses. For now, let's just get the hang of writing strings, meaning textual data, to standard output. Here's how we would write the text "Hello, World!" to standard output to be displayed in the terminal:</P>

      <PythonBlock fileName="hello.py">{
`def main() -> None:
    print('Hello, World!')

if __name__ == '__main__':
    main()`
      }</PythonBlock>

      <P>This is a "Hello, World!" program, meaning that when you run it through the <Code>python</Code> interpreter (e.g., via <Code>python hello.py</Code>, assuming the file is named <Code>hello.py</Code> and is present in your working directory), it simply prints "Hello, World!" to the terminal:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python hello.py 
Hello, World!
`
      }</TerminalBlock>

      <P>You can also write data to standard error in a similar manner. In practice, most error messages should be printed via standard error instead of standard output. But we won't discuss standard error in this course; you may simply use standard output for all message printing.</P>

      <P>Before we move on, I should remind you of something very important: in this course, we will be using Mypy religiously. Whenever you make <Ul>any</Ul> changes to your code, you should always run it through Mypy again to make sure that there are no errors detectable via static analysis. Some errors reported by Mypy will cause the program to crash when you try to run it anyways, but some are more subtle<Emdash/>some errors reported by Mypy reflect mistakes in your code (or simply bad practices) that may or may not result in obvious problems when the program is actually executed. Mypy is critical for finding these mistakes quickly and easily. You <Ul>must</Ul> heed Mypy's warnings and errors. If you submit code for a lab or assignment for which Mypy reports warnings or errors, you will be penalized for it. Also, heed my advice: do not write hundreds of lines of code and <It>then</It> try to go back and fix all the errors. That just gives you a false sense of progress. Instead, follow the principles of regression testing: 1) make a tiny change to the code, 2) run the code through Mypy, addressing reported warnings and errors until no more are reported, 3) execute the program to make sure that it behaves as expected (i.e., to make sure that your changes didn't break any of the existing features of the program), and 4) repeat from step 1) until the program is complete.</P>

      <P>As a reminder, you can run the above program through Mypy like so:</P>

      <TerminalBlock copyable={false}>{
`(env) $ mypy hello.py
Success: no issues found in 1 source file
`
      }</TerminalBlock>

      <P>For the sake of brevity, I will not be explicitly showing you every time I run a program through Mypy (though I may show you occasional Mypy example runs just to demonstrate common errors). But rest assured that I do, indeed, run every single program written for these lecture notes through Mypy. This is one instance where I actually follow my own advice, and you should, too.</P>

      <P>You might've noticed that the <Code>print()</Code> function automatically appends an endline character sequence to the end of the printed message. For example, if a program used the <Code>print()</Code> function twice in a row to print two separate messages, those messages would appear on separate lines in the terminal. In some cases, you might not want that; you might instead want several printed messages to appear on the same line. To achieve this, you can pass a second argument to the <Code>print()</Code> function. This second argument is a keyword argument, meaning it's typically specified by name. Its name is <Code>end</Code>, and it's a string argument that specifies the characters that should be automatically appended to the printed message. By default, the <Code>end</Code> argument has the value <Code>'\n'</Code>, which is a special character sequence representing the end of a line. Hence, by default, the <Code>print()</Code> function automatically appends a new line at the end of each printed message, as if simulating pressing the enter key. To disable this behavior, simply specify <Code>end=''</Code> as the second argument to the <Code>print()</Code> function. <Code>''</Code> is an empty string, meaning a string consisting of no characters whatsoever. Hence, nothing will be appended to the printed message.</P>

      <P>Here's an example:</P>

      <PythonBlock fileName="disable_endline.py">{
`def main() -> None:
    print('Hello, ') # The next message will be on a new line
    
    print('World!') # The next message will be on a new line

    print('Hello, ', end='') # The next message will be on the
                             # same line

    print('World!') # The next message will be on a new line

    print('I', end=' ') # There's a space between this message
                        # and the next

    print('like', end=' ') # There's a space between this message
                           # and the next

    print('pie', end=' ') # There's a space between this message
                          # and the next

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Running the above program produces the following output:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python disable_endline.py 
Hello, 
World!
Hello, World!
I like pie (env) $`
      }</TerminalBlock>

      <P>Notice that the the first "World!" appears on a separate line in the terminal from the preceding "Hello, ". This is because the first <Code>print()</Code> function call prints "Hello, " with a terminating endline character sequence (this is the default behavior of the <Code>print()</Code> function). Similarly, the second "Hello, " appears on a separate line in the terminal from the preceding "World!" for the same reason. However, the second "World!" appears on the same line as the preceding "Hello, " because <Code>end=''</Code> specifies that no endline character sequence (nor any other characters) should be appended to the "Hello, " message. "I", "like", "pie", and the subsequent terminal prompt (<Code>(env) $</Code>) are all separated by spaces as specified by <Code>end=' '</Code>.</P>

      <P>So, by specifying the value of the <Code>end</Code> keyword argument in the <Code>print()</Code> function, you can prevent extra endline sequences from being printed. But what of the opposite? Is it possible to intentionally print <It>extra</It> endline sequences? Of course, the answer is yes. An endline sequence can be represented within any string via a backslash followed by the letter n (<Code>\n</Code>). This is known as an escape sequence. Escape sequences always start with a backslash, and they're used to represent special characters that couldn't otherwise be embedded into strings. Here's an example program that uses various escape sequences to print all sorts of special characters to the terminal:</P>

      <PythonBlock fileName="escape_sequences.py">{
`def main() -> None:
    # Print "Hello," followed by an endline sequence, followed
    # by "World!" (i.e., print "Hello," and "World!" each on
    # their own lines in the terminal, all with a single
    # print() statement).
    print('Hello,\\nWorld!')

    # Print the numbers 7-15. The first three numbers (7-9)
    # are printed on the first line, separated by TABs (\\t).
    # The next three numbers (10-12) are printed on the second
    # line, also separated by TABs. The last three numbers (13-15)
    # are printed on the third line, also separated by TABs.
    print('7\\t8\\t9\\n10\\t11\\t12\\n13\\t14\\t15')

    # Print an apostrophe in a string literal that uses
    # apostrophes as the enclosing symbol (\\' is an escape
    # sequence for an apostrophe)
    print('Shepherd\\'s Pie')

    # Print a quotation mark in a string literal that uses
    # quotation marks as the enclosing symbol
    print("\\"Four score and seven years ago\\"")

    # Print a backslash character (\\\\ is the escape sequence
    # for a backslash)
    print('\\\\')

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Running the above program produces the following output:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python escape_sequences.py 
Hello,
World!
7       8       9
10      11      12
13      14      15
Shepherd's Pie
"Four score and seven years ago"
\\
`
      }</TerminalBlock>

      <SectionHeading id="types-expressions-and-operators">Types, Expressions, and Operators</SectionHeading>

      <P>An <Term>expression</Term> is a piece of code with a <Term>type</Term> and a <Term>value</Term>. The simplest kind of expression is a <Term>literal</Term>, meaning a hard-coded value. We used a literal just a moment ago: <Code>'Hello, World!'</Code>. It's a string literal, meaning its type is <Code>str</Code> (which stands for "string" and is used to represent textual data), and its value is the text "Hello, World!".</P>

      <P>In Python, string literals are enclosed in either single quotes (e.g., <Code>'hello'</Code>) or double quotes (e.g., <Code>"hello"</Code>). I prefer to use single quotes except in cases where the text needs to have a single quote <It>inside</It> it, in which case I use double quotes instead (e.g., <Code>"Shepherd's pie"</Code>). Whether you use single quotes or double quotes in this class is up to you, but please be consistent.</P>

      <P>Strings are just one builtin data type in Python. Here are some others:</P>

      <Itemize>
        <Item><P><Code>int</Code>: Integer, meaning a whole number. An <Code>int</Code> literal is simply a hardcoded number without any decimal points, such as <Code>-12</Code>, or <Code>1</Code>, or <Code>1000000</Code>.</P></Item>
        <Item><P><Code>float</Code>: Floating point number, meaning a number that may or may not be a whole number. A <Code>float</Code> literal is simply a hardcoded number with a decimal point in it, such as <Code>-12.3</Code>, or <Code>1.5</Code>, or <Code>1000000.7182</Code>, or, yes, even <Code>1.0</Code> (although <Code>1.0</Code> is a whole number, it's written with a decimal point in it, so Python treats it as a <Code>float</Code> expression rather than an <Code>int</Code> expression; this distinction matters).</P></Item>
        <Item><P><Code>bool</Code>: Boolean, meaning a true or false value. There are exactly two valid <Code>bool</Code> literals in Python: <Code>True</Code> and <Code>False</Code> (they <Ul>must</Ul> be capitalized).</P></Item>
      </Itemize>

      <P><Code>str</Code>, <Code>int</Code>, <Code>float</Code>, and <Code>bool</Code> are all the builtin types you need to know about for now.</P>

      <P>Literals are the simplest kind of expression, but they're not the only kind. Expressions can be transformed and combined via functions and operators to form more complex expressions. For example, <Code>1</Code> is an expression, as is <Code>2</Code>, but <Code>1 + 2</Code> is <It>also</It> an expression. <Code>1</Code> and <Code>2</Code> are literals, but <Code>1 + 2</Code> is not<Emdash/>it's a more complex expression formed by combining two simpler expressions with a plus operator. Being an expression, it has both a type and a value. Since <Code>1</Code> and <Code>2</Code> are both <Code>int</Code>-typed expressions, so too is <Code>1 + 2</Code>. Its value, of course, is <Code>3</Code>.</P>

      <P>The addition operator (<Code>+</Code>) is just one of many arithmetic operators available in Python. Here are the ones that you should know:</P>

      <Itemize>
        <Item><P><Code>+</Code>: Addition</P></Item>
        <Item><P><Code>-</Code>: Subtraction</P></Item>
        <Item><P><Code>*</Code>: Multiplication</P></Item>
        <Item><P><Code>/</Code>: Division</P></Item>
        <Item><P><Code>%</Code>: Modulo, meaning remainder after division of integers. For example, <Code>6 % 3</Code> is 0 because 6 is perfectly divisible by 3, so there's no remainder after division. <Code>7 % 3</Code> is 1 (since 7 divided by 3 is 2 with a remainder of 1), <Code>8 % 3</Code> is 2, <Code>9 % 3</Code> is 0 again, and so on. Notice: as you increase the value on the left of the modulo operator, the value of the whole expression cycles from 0 through N - 1, where N is the value on the right of the modulo operator. Indeed, the modulo operator is useful for creating cyclical behavior in a computer program.</P></Item>
        <Item><P><Code>**</Code>: Exponentiation. For example, the Python expression <Code>5 ** 2</Code> evaluates to 25 (since 5 squared is 25).</P></Item>
      </Itemize>
      
      <P>The division operator (<Code>/</Code>) is unique in that it's the only arithmetic operator that always produces a <Code>float</Code> value. For example, <Code>1 / 2</Code> is 0.5, a value of type <Code>float</Code>. Moreover, <Code>1 / 1</Code> is 1.0, also of type <Code>float</Code>. In contrast, the other arithmetic operators produce a value whose type depends on the types of the operands (e.g., multiplying an <Code>int</Code> by another <Code>int</Code> will produce an <Code>int</Code>, but multiplying an <Code>int</Code> by a <Code>float</Code> will produce a <Code>float</Code>).</P>

      <P>The Python division operator also behaves differently from the division operator in some other programming languages. For example, in C and C++, dividing an <Code>int</Code> by another <Code>int</Code> produces an <Code>int</Code> value through truncation. This used to be the case in Python as well, but ever since Python3 (the version we're using in this class), it's no longer the case (e.g., <Code>print(1 / 2)</Code> will indeed print 0.5 to the terminal).</P>

      <P>Python follows the standard mathematical order of operations: PEMDAS (parentheses, exponentiation, multiplication and division, addition and subtraction). The P in PEMDAS implies that you can use parentheses to group and prioritize arithmetic operations in Python, and indeed you can. For example, <Code>3 * 5 + 2</Code> would evaluate to <Code>17</Code>, but <Code>3 * (5 + 2)</Code> would evaluate to 21 (the addition operation is evaluated first since it's nested inside parentheses).</P>

      <SectionHeading id="variables">Variables</SectionHeading>

      <P>You often need to store values somewhere so that you can refer to them again later. This is the purpose of <Term>variables</Term>. A variable is simply a named location where a value can be stored.</P>

      <P>To create a variable in Python, just type the name that you want the variable to have, followed by the assignment operator (a single equal symbol: <Code>=</Code>), followed by an expression whose value you'd like to store in the variable. When your computer encounters this assignment operation, it will fully compute the value of the expression on the right and store it in the variable on the left. The exact same syntax is used to modify the value stored within an existing variable. Here are some examples:</P>

      <PythonBlock fileName="variables.py">{
`def main() -> None:
    # Compute 2 + 3 and store the result in a new variable
    # called x
    x = 2 + 3
    
    # Compute 12 - 2 and store the result in the existing
    # variable called x
    x = 12 - 2

    # Store the string literal 'Hello' in a new variable
    # called sentence
    sentence = 'Hello'

    # Store the boolean literal True in a new variable
    # called i_like_spaghetti
    i_like_spaghetti = True

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>When a variable is first created and given a value via the assignment operator, the variable's name is said to be <Term>bound</Term> to the location in the computer's memory where its value is stored. A variable may be referenced (i.e., used) in any lines of code that are <Ul>below</Ul> the line in which it was bound but still within the same scope (i.e., the same function, class, or module, depending on where the variable was created; <Link href="#scope">more on this later</Link>). To reference (use) a variable, simply type out its name. Whenever your computer encounters a reference to a variable (i.e., the name of a variable, except when assigning that variable a value via the assignment operator), your computer essentially substitutes the value of the variable for the variable itself.</P>

      <P>In our above example, we create a variable called <Code>sentence</Code> in our <Code>main()</Code> function on line 12. Hence, if we so choose, we can reference that variable anywhere below line 12 while still within the <Code>main()</Code> function:</P>

      <PythonBlock fileName="variables.py" highlightLines="{5,10,15}">{
`def main() -> None:
    # Compute 2 + 3 and store the result in a new variable
    # called x
    x = 2 + 3
    print(x) # Prints 5 to the terminal
    
    # Compute 12 - 2 and store the result in the existing
    # variable called x
    x = 12 - 2
    print(x) # Prints 10 to the terminal

    # Store the string literal 'Hello' in a new variable
    # called sentence
    sentence = 'Hello'
    print(sentence) # Prints Hello to the terminal

    # Store the boolean literal True in a new variable
    # called i_like_spaghetti
    i_like_spaghetti = True

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Running the above program produces the following output:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python variables.py 
5
10
Hello
`
      }</TerminalBlock>

      <P>Variables can also be referenced in expressions whose values are assigned to other variables. For example:</P>

      <PythonBlock fileName="area_of_circle.py">{
`def main() -> None:
    radius = 10
    pi = 3.141592

    # Compute area as pi r^2
    area = pi * radius * radius
    print(area) # Prints 314.1592

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>A variable can even be referenced in an expression whose value is assigned to the very same variable in question. For example, an integer variable's value can be increased by 1 like so:</P>

      <PythonBlock fileName="inc_x.py" highlightLines="{5,10}">{
`def main() -> None:
    x = 14

    # Increase x by 1, to 15
    x = x + 1
    print(x) # Prints 15

    # This is shorthand for the same idea---it increases x
    # by 1
    x += 1
    print(x) # Prints 16

    # Importantly, this does NOT increase x by 1. It simply
    # computes the value of x + 1, and then does NOTHING
    # with that value (this is a valid line of code, but
    # it's essentially useless)
    x + 1

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Indeed, <Code>x = x + 1</Code> is perfectly legal, and it increases the value of <Code>x</Code> by 1. <Code>x += 1</Code> is shorthand notation for the same thing.</P>

      <P>Of course, if this were typical mathematical notation, the equation <Code>x = x + 1</Code> would not make any sense<Emdash/>nothing can be equal to itself plus 1. But in Python, the <Code>=</Code> symbol is not a declarative equality operator<Emdash/>it's an imperative assignment operator. It tells your computer to compute the value of the expression on the right, and <It>then</It> store that value in the variable on the left. With this understanding, there's no reason that <Code>x = x + 1</Code> shouldn't be considered a perfectly legal statement. It computes the value that's 1 greater than the current value of <Code>x</Code>, and then it stores that value in <Code>x</Code> (i.e., it increases <Code>x</Code> by 1).</P>

      <P>Similar to the <Code>+=</Code> shorthand operator, there's also <Code>-=</Code>, <Code>*=</Code>, <Code>/=</Code>, and even <Code>%=</Code>. They each work how you'd expect; they apply the corresponding mathematical operator between the variable on the left and the value of the expression on the right, and then they store the result in the variable on the left. For example, <Code>x *= 3</Code> is equivalent to <Code>x = x * 3</Code> (it triples the value of <Code>x</Code>); <Code>x %= 7</Code> is equivalent to <Code>x = x % 7</Code>, and so on.</P>

      <P>Recall that we're going to be using Mypy extensively in this course to verify that our code is rigorously type-safe. If you haven't already, please follow the steps in my <Link href={`${PARENT_PATH}/${allPathData["python-hello-world"].pathName}`}>"Hello, World!" lecture notes</Link> to install Mypy and configure it to run in strict mode by default.</P>

      <P>There are various things that you can technically do with variables and types in Python but which are forbidden by Mypy (especially when running it in strict mode). For one, Mypy forbids changing a variable's (static) type mid-execution. For example, the following is technically legal Python code, but it's <It>illegal</It> under Mypy's strict static analysis:</P>

      <PythonBlock fileName="change_type.py">{
`def main() -> None:
    x = 12 # x's type is int

    # Changes x's type from int to float. Mypy forbids this.
    x = 3.14

if __name__ == '__main__':
    main()`
      }</PythonBlock>

      <P>Although the above program technically runs just fine, passing it through Mypy will raise a type error:</P>

      <TerminalBlock copyable={false}>{
`(env) python-hello-world $ mypy change_type.py 
change_type.py:5: error: Incompatible types in assignment (expression has type "float", variable has type "int")  [assignment]
Found 1 error in 1 file (checked 1 source file)
`
      }</TerminalBlock>

      <P>Indeed, when a variable is first created within a given scope, Mypy evaluates the static type of the expression whose value is assigned to the variable (i.e., the type of the expression on the right side of the assignment operator) and "associates" the variable with that type. From that point on, that variable may only be assigned other values of the same type (or rather, other values that are "compatible" with that static type, but don't worry about the nuances for now). That is, if <Code>x</Code> is first created by assigning <Code>x = 12</Code>, then Mypy determines <Code>x</Code> to be an <Code>int</Code>-typed variable, and all subsequent assignments to <Code>x</Code> must also be <Code>int</Code>-typed values. Similarly, if <Code>x</Code> is first created by assigning <Code>x = 'Hello'</Code>, then Mypy determines <Code>x</Code> to be a <Code>str</Code>-typed variable, and all subsesquent assignments to <Code>x</Code> must also be <Code>str</Code>-typed values.</P>

      <P>We'll discuss other restrictions imposed by Mypy as they become relevant. But remember: always run your source code through Mypy to verify that it's type-safe. Even if your program technically runs properly and does what it's supposed to do, your grade will still be penalized for any errors reported by Mypy when run in strict mode.</P>

      <SectionHeading id="f-strings">F-strings</SectionHeading>

      <P>Suppose you wish to embed data within a string, perhaps to be printed to the terminal. The idiomatic way of doing this is with so-called <Term>F-strings</Term>, also known as <Term>formatted string literals</Term>. When typing out a string literal, you can put the letter <Code>f</Code> just before the opening apostrophe or quotation mark (whichever you choose to use), which marks the string literal as an F-string. Within an F-string, you can embed arbitrary Python expressions within curly braces (<Code>{'{}'}</Code>). When the Python interpreter encounters the F-string, it will evaluate the embedded expressions, convert their respective values into strings of text, and then embed said text within the larger string literal. Here are some examples:</P>

      <PythonBlock fileName="f_strings.py">{
`def area_of_circle(radius: float) -> float:
    return 3.141592 * radius * radius

def main() -> None:
    # The interpreter will evaluate area_of_circle(5) by calling
    # the area_of_circle function, passing in 5 as the argument.
    # It will then replace {area_of_circle(5)} with the return
    # value.
    print(f'The area of a circle with radius 5 is {area_of_circle(5)}')

    # This will print "x is 10, and y is 7.5"
    x = 10
    y = 7.5
    print(f'x is {x}, and y is {y}')

    # Notice: the below string literal is missing the letter
    # f before the opening apostrophe. Hence, it is NOT an
    # F-string. It's just a regular string literal. This will
    # print "x is {x}, and y is {y}" (the braced expressions
    # are not evaluated; they're just treated as text to be
    # printed)
    print('x is {x}, and y is {y}')

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Running the above program produces the following output:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python f_strings.py 
The area of a circle with radius 5 is 78.5398
x is 10, and y is 7.5
x is {x}, and y is {y}
`
      }</TerminalBlock>

      <SectionHeading id="type-casting">Type Casting</SectionHeading>
      
      <P>It's possible to transform an expression of one type into an expression of another type, given that the two types are compatible. This is referred to as <Term>type casting</Term>. In some cases, type casting can be done implicitly. In other cases, it must be done explicitly.</P>

      <P>F-strings are a classic example of implicit type casting. In the previous section, <Code>{`print(f'x is {x}, and y is {y}')`}</Code> causes the values of <Code>x</Code> and <Code>y</Code> to be type-casted into strings (text) so that they can be embedded into the larger string literal and printed to the terminal.</P>

      <P>But in some cases, type casting must be done <It>explicitly</It>. To explicitly type cast an expression into a new type, simply write out the type that you want to cast the expression into, followed by the expression itself enclosed in parentheses. For example, a string containing a decimal number can be type-casted into a float like so:</P>

      <PythonBlock fileName="type_casting.py">{
`def main() -> None:
    # Convert the string '3.14' into the float 3.14, and store
    # it in x
    x = float('3.14')

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>To prove that it works, let's print out the type of <Code>x</Code> in the above program. You can retrieve the type of an expression in Python by using the <Code>type()</Code> operator:</P>

      <PythonBlock fileName="type_casting.py">{
`def main() -> None:
    # Convert the string '3.14' into the float 3.14, and store
    # it in x
    x = float('3.14')
    print(type(x))

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Running the above program produces the following output:</P>

      <TerminalBlock copyable={false}>{
`(env) python-hello-world $ python type_casting.py 
<class 'float'>`
      }</TerminalBlock>

      <P>Indeed, the type of <Code>x</Code> is printed as <Code>{`<class 'float'>`}</Code>, which proves that <Code>x</Code> is a float rather than a string.</P>

      <P>Type casting will be more useful later on <Link href="#standard-input">when we discuss standard input</Link>.</P>

      <SectionHeading id="functions">Functions</SectionHeading>

      <P>As you should know, a <Term>function</Term> is essentially a reusable block of code. To define a function in Python, use the <Code>def</Code> keyword, followed by the name of the function that you wish to define, followed by a parameter list enclosed in parentheses, followed by an arrow (<Code>{'->'}</Code>), followed by the function's return type (or <Code>None</Code> if the function doesn't return anything), followed by a colon. All of these things together are referred to as the <Term>function header</Term>. The <Term>function body</Term> (i.e., the block of code that the function executes) then goes immediately below the header. The function body must be indented over by one additional "level" of indentation relative to the header. How exactly you define a "level" of indentation is up to you, but Python requires that you must be consistent. It's common practice in Python to use four spaces as a level of indentation. If you followed the <Link href={`${PARENT_PATH}/${allPathData["terminal-based-text-editing"].pathName}`}>Vim lecture</Link> closely, then you should have already configured Vim to insert four spaces whenever you press the tab key.</P>

      <P>You've already seen one example several times<Emdash/>the <Code>main()</Code> function that we've been creating in all our programs so far. The syntax for creating a function is as follows:</P>

      <SyntaxBlock>{
`def <name>(<parameter1>, <parameter2>, ..., <parameterN>) -> <return type>:
    <function body>`
      }</SyntaxBlock>

      <P>Replace <Code>{'<name>'}</Code> with the name of the function, replace each <Code>{'<parameterX>'}</Code> with a parameter declaration (more on this in a moment), replace <Code>{'<return type>'}</Code> with the function's return type, and replace <Code>{'<function body>'}</Code> with the function's body (i.e., the block of code that you want the function to execute).</P>

      <P>The syntax for a single parameter declaration is as follows:</P>

      <SyntaxBlock>{
`<name>: <type>`
      }</SyntaxBlock>

      <P>Replace <Code>{'<name>'}</Code> with the parameter's name (parameters are just variables, so they must be given names like all other variables), and replace <Code>{'<type>'}</Code> with the parameter's type. Python does not technically require you to annotate the types of parameters, but Mypy often does (and it always does when run with <Code>--strict</Code>, as we do in this course).</P>

      <P>Within the function body, a value can be returned via <Code>{'return <value>'}</Code> (replace <Code>{'<value>'}</Code> with the value that you'd like the function to return).</P>

      <P>That's a lot of syntax, so here's an example to illustrate:</P>

      <PythonBlock fileName="volume_of_sphere.py">{
`# The name of the function is volume_of_sphere
# The function has a single input (parameter), which is
#   a float called \`radius\`
# The function returns a float as well
def volume_of_sphere(radius: float) -> float:
    # Compute the volume of a sphere with the given radius
    # and return it (the equation for the volume of a 
    # sphere is 4/3 pi r^3)
    volume = 4 / 3 * 3.141592 * radius * radius * radius
    return volume
`
      }</PythonBlock>

      <P>Students are often confused by arguments, parameters, and return values, so pay close attention here. Functions are generally isolated from each other. In most cases, a given function is not allowed to access the variables that are created within other functions. Indeed, a function is only allowed to access its own variables (see <Link href="#scope">the section on scope</Link> for more details about this). However, functions would not be very useful if they couldn't communicate with each other. In other words, there must be <It>some</It> way of passing data (e.g., the value of a variable) from one function to another.</P>

      <P>Actually, there are at least two such ways. The first way is via <Term>arguments</Term> and <Term>parameters</Term>. When one function A calls (uses / executes) another function B, A can supply <Term>inputs</Term> to B in the form of arguments. These arguments are, in some sense, copied into the corresponding parameters of B (that's not exactly how it works, but that's a good enough understanding for now). In other words, parameters are placeholders for a function's inputs, and arguments are the actual input values that are supplied when calling the function.</P>

      <P>The other way of communicating data from one function to another is via <Term>return values</Term>. While arguments and parameters are used to communicate inputs to a function, return values are used to communicate outputs from a function. When a function call terminates (i.e., when the function finishes executing), the function call itself is substituted with the value that was returned by the function. Indeed, this means that function calls are expressions<Emdash/>they have types and values.</P>

      <P>That will all make more sense once you've seen an example of a function call. To call a function, simply type out its name followed by a comma-separated argument list enclosed in parentheses. If the function returns a value and you wish to store that value in a variable, then the function call should be used as the expression on the right side of an assignment operator (the return value will then be stored in the variable on the left side of the assignment operator). Putting that all together, let's call our <Code>volume_of_sphere()</Code> function to compute the volume of a sphere with radius <Code>5</Code>:</P>

      <PythonBlock fileName="volume_of_sphere.py" highlightLines="{16}">{
`# The name of the function is volume_of_sphere
# The function has a single input (parameter), which is
#   a float called \`radius\`
# The function returns a float as well
def volume_of_sphere(radius: float) -> float:
    # Compute the volume of a sphere with the given radius
    # and return it (the equation for the volume of a 
    # sphere is 4/3 pi r^3)
    volume = 4 / 3 * 3.141592 * radius * radius * radius
    return volume

def main() -> None:
    # Bind variable called \`volume_of_radius_5_sphere\`, and
    # store the return value of volume_of_sphere(5.0) inside
    # it.
    volume_of_radius_5_sphere = volume_of_sphere(5.0)
    print(volume_of_radius_5_sphere)

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Running the above program produces the following output:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python volume_of_sphere.py 
523.5986666666666
`
      }</TerminalBlock>
      
      <P>When the Python interpreter encounters the function call in line 16, it jumps up to the <Code>volume_of_sphere</Code> function. The argument, <Code>5.0</Code>, is (sort of) copied into the parameter, <Code>radius</Code>, and then the function body begins. The function computes <Code>4 / 3 * 3.141592 * radius * radius * radius</Code>. In this context, <Code>radius</Code> is <Code>5.0</Code>, because that's the value that was copied from the argument in the function call. This expression is evaluated as <Code>523.5986666666666</Code>. This value is stored inside the function's local variable, <Code>volume</Code>. Finally, the function returns the value of <Code>volume</Code> back to the function caller. Now that the function is over, the interpreter jumps <It>back</It> to where the function was called from<Emdash/>line 16. The function call itself, <Code>volume_of_sphere(5.0)</Code>, is replaced with the return value, <Code>523.5986666666666</Code>. This is precisely how return values work<Emdash/>they serve as the value of the corresponding function call. This value is then stored inside the <Code>main()</Code> function's local variable, <Code>volume_of_radius_5_sphere</Code>, which is finally printed to the terminal. (There are some nuances surrounding all of this, particularly involving objects and references, that we won't cover for a few more lectures).</P>

      <P>It's absolutely critical that you understand the following: arguments, parameters, return values, and function call values do not serve to pass <It>variables</It> between functions<Emdash/>they serve to pass <It>values</It> between functions. In fact, a given function B may <Ul>never</Ul> access the variables scoped to another function A. However, A may pass the <It>values</It> of one or more of its variables to B in the form of arguments, which are then (sort of) copied into B's corresponding parameters. And, going in the other direction, B may pass the <It>value</It> of one of its variables back to A in the form of a return value, when is then (sort of) copied into the call site, replacing the function call itself. Do not move on until you're certain that you understand this concept. If you don't understand how arguments, parameters, return values, and function calls work, then you will struggle with the entire rest of this course.</P>

      <P>Here's another example program to illustrate this concept:</P>

      <PythonBlock fileName="function_communication.py">{
`def cool_function(x: int) -> int:
    print(x)
    x = 5
    return x

def main() -> None:
    x = 1
    
    # The below function call prints 1 and returns 5, but the return
    # value is discarded
    cool_function(x)
    
    # Prints 1 (NOT 5---the main() function's x variable is separate
    # from cool_function()'s x variable / parameter)
    print(x)

    # The below function call prints 1 and returns 5. We then store the
    # return value (5) in this function's x variable, changing it from
    # 1 to 5.
    x = cool_function(x)

    print(x) # Prints 5

    # Change this function's x variable back to 1
    x = 1

    # The below function call prints 1 and returns 5. We then store the
    # return value (5) in a new variable named y. This function's
    # x variable remains 1.
    y = cool_function(x)

    print(x) # Prints 1
    print(y) # Prints 5


if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>The above example illustrates that parameters and arguments are not the same thing. Rather, a function's parameter is essentially initialized to (assigned) a copy of the value of the corresponding argument that's supplied in the function call. As such, even if an argument is a variable named <Code>x</Code>, <It>and</It> the corresponding parameter is a variable named <Code>x</Code>, those are still two completely separate variables. The fact that they have the same name is completely irrelevant; every function gets its own variables. Additionally, the above example illustrates that <Code>return x</Code> does return <Code>x</Code> itself, but rather the <It>value</It> of <Code>x</Code>. Again, each function gets its own variables<Emdash/>variables cannot be passed from one function to another. <Code>return x</Code> simply takes the value of the function's variable named <Code>x</Code> and substitutes that value into the the call site. The function caller can then do whatever they would like with that return value<Emdash/>they can discard it, store it in <It>another</It> (completely separate) variable named <Code>x</Code>, store it in another variable named <Code>y</Code>, or literally anything else that you could do with a value.</P>

      <P>If you're absolutely certain that you understand the above concept, then we can move on.</P>

      <P>As in most other programming languages, a <Code>return</Code> statement marks the end of a function<Emdash/>the moment the interpreter encounters a return statement, the function ends, even if there's still more code below said return statement.</P>

      <P>It is permissible for a function to not return anything. This is particularly common when writing functions that simply print some formatted data to standard output. Such functions do not need to communicate outputs back to the function caller<Emdash/>they only need to communciate outputs to the terminal for the user to see. Such functions should have a return type of <Code>None</Code> (see the <Code>main()</Code> function, for example<Emdash/>its return type is <Code>None</Code> because it doesn't return anything). When calling a function whose return type is <Code>None</Code> (i.e., a function that doesn't return anything), the function call should <Ul>not</Ul> be used as the right-hand side of an assignment operation. For example, if a function named <Code>foo()</Code> does not return anything, it might be sensible to call it via <Code>foo()</Code>, but not <Code>x = foo()</Code>. After all, if <Code>foo()</Code> does not return anything, then the function call does not have a value, so you shouldn't try to store it in a variable (such as <Code>x</Code>) as if it does have a value (technically, <Code>None</Code> <It>is</It> a value in Python, but in this case, there'd be no point in storing it in a variable). Here's an example program that defines and calls a function with no return value:</P>

      <PythonBlock fileName="none_return_type.py">{
`def print_multiplication_table(width: int, height: int) -> None:
    for row_idx in range(height):
        for col_idx in range(width):
            print((row_idx + 1) * (col_idx + 1), end="\\t")
        print()

def main() -> None:
    print_multiplication_table(7, 5)
    print()
    print_multiplication_table(3, 4)

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>The <Code>print_multiplication_table()</Code> function prints a multiplication table to the terminal with the given width and height as specified by the parameters (which are essentially copied from the arguments). Don't worry about how it works for now; we'll discuss loops momentarily. In any case, running the above program produces the following output:</P>

      <TerminalBlock copyable={false}>{
`(env) python-hello-world $ python none_return_type.py 
1       2       3       4       5       6       7
2       4       6       8       10      12      14
3       6       9       12      15      18      21
4       8       12      16      20      24      28
5       10      15      20      25      30      35

1       2       3
2       4       6
3       6       9
4       8       12`
      }</TerminalBlock>

      <P>Notice that we called the <Code>print_multiplication_table()</Code> function twice within the <Code>main()</Code> function, but we did <Ul>not</Ul> try to store its return value inside a variable at any point. Again, this is a function that doesn't return anything, so it wouldn't make sense to attempt to store the values of the function calls anywhere (their values are <Code>None</Code>, which aren't useful in this case).</P>

      <P>A function's return value should always match its return type. If a function's return type is <Code>float</Code>, but it returns something other than a float (or it doesn't return anything at all), Mypy will raise errors when run in strict mode. Similarly, if a function's return type is <Code>None</Code>, but it indeed tries to return a value in some cases, Mypy will raise errors. To avoid these kinds of errors, always decide up front what kind of data your functions will return. Declare that as its return type, and then make sure that the function always returns a value of that type.</P>

      <P>Although a function ends the moment a return statement is encountered, it's permissible for a function to have multiple return statements. For example, it might be sensible to have several return statements each inside a separate <Link href="#if-statements">if statement</Link> body. Then, depending on the conditions of the if statement(s), the function could return one of several values. Regardless, the function ends the moment any one of those return statements is encountered. Here's an example:</P>

      <PythonBlock fileName="multireturn.py">{
`def age(person_name: str) -> int:
    if person_name == 'Taylor Swift':
        # Taylor Swift is 35. Return 35, ending the function
        return 35
    elif person_name == 'Chappell Roan':
        # Chappell Roan is 27. Return 27, ending the function
        return 27

    # If we made it this far, then person_name must not be
    # 'Taylor Swift' nor 'Chappell Roan', or else the
    # function would have already ended.
    
    # In all other cases, return 0.
    return 0

def main() -> None:
    print(age("Taylor Swift")) # Prints 35
    print(age("Chappell Roan")) # Prints 27
    print(age("Jane Plane")) # Prints 0

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Again, don't worry too much about how the <Code>age()</Code> function works; <Link href="#if-statements">we'll cover if statements momentarily</Link>. The point is that there are situations where it's reasonable for a function to have multiple return statements.</P>

      <P>It's also permissible to use return statements inside a function with a <Code>None</Code> return type (i.e., a function that doesn't return anything). However, in such cases, the <Code>return</Code> keyword must be used in isolation<Emdash/>it cannot be accompanied by a value (e.g., simply <Code>return</Code>, as opposed to, say, <Code>return 5</Code>). The purpose of this is to end the function early under certain conditions. Here's a (slightly contrived) example:</P>

      <PythonBlock fileName="find_prime.py" highlightLines="{24}">{
`# Finds the smallest prime number that's greater than the
# given argument, and prints the prime number to the
# terminal
def print_first_prime_greater_than(lower_bound: int) -> None:
    current_value = lower_bound + 1
    while True:
        # Check if current_value is a prime number
        is_prime = True
        for i in range(2, current_value):
            if current_value % i == 0:
                # current_value is divisible by an integer
                # that's smalller than it (other than 1),
                # so it must not be prime.
                is_prime = False
                break # End this for loop immediately
        
        if is_prime:
            # If is_prime is still True, then that means
            # we failed to find any numbers by which
            # current_value is divisible. It must be prime.
            # Print it and return, ending the entire function
            # immediately.
            print(current_value)
            return
        
        # Otherwise, increase current_value by 1 and go back
        # to the top of the loop
        current_value += 1
    

def main() -> None:
    print_first_prime_greater_than(11) # Prints 13

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>The goal of the function in the above example is to find and print the smallest prime number that's greater than the specified argument. It does so by counting upwards in a loop, starting at the value of the argument plus 1, and checking each counted value to see if it's a prime number. The moment it discovers a prime number, it prints it to the terminal and uses a standalone <Code>return</Code> statement to immediately end the entire function. Again, don't worry about the extra details involving loops, if statements, and so on; we'll cover it all shortly.</P>

      <SectionHeading id="scope">Scope</SectionHeading>
      
      <P>A <Term>scope</Term> is a region of code in which a <Term>symbol</Term> is accessible. A symbol is simply something with a name, be it a variable, a constant, a function, etc.</P>

      <P>When a symbol (such as a variable) is created within a scope, it's only bound, and therefore accessible, within that scope, specifically after it has been created. That's to say, symbols created in one scope are not accessible within other scopes, nor are symbols ever accessible before they're created.</P>

      <P>In Python, scopes are largely organized around functions<Emdash/>every function has its own scope. I said earlier that functions cannot access each others' variables. Scope is the reason for that. When a variable or other symbol is created inside a function, it's only bound within that function's scope. Other functions have their own scopes and hence cannot access each others' symbols. This is why data must be passed to and from functions via arguments, parameters, and return values. </P>

      <P>Function scopes are not the only kinds of scopes in Python. There is also a notion of module scope (i.e., global scope) as well as class scope. We'll talk about class scope later on in the term. As for module scope, it's simply the implied scope that exists outside of all functions. For example, take a look back at the last program that we wrote in the previous section. Here it is again for your convenience:</P>

      <PythonBlock fileName="find_prime.py">{
`# Finds the smallest prime number that's greater than the
# given argument, and prints the prime number to the
# terminal
def print_first_prime_greater_than(lower_bound: int) -> None:
    current_value = lower_bound + 1
    while True:
        # Check if current_value is a prime number
        is_prime = True
        for i in range(2, current_value):
            if current_value % i == 0:
                # current_value is divisible by an integer
                # that's smalller than it (other than 1),
                # so it must not be prime.
                is_prime = False
                break # End this for loop immediately
        
        if is_prime:
            # If is_prime is still True, then that means
            # we failed to find any numbers by which
            # current_value is divisible. It must be prime.
            # Print it and return, ending the entire function
            # immediately.
            print(current_value)
            return
        
        # Otherwise, increase current_value by 1 and go back
        # to the top of the loop
        current_value += 1
    

def main() -> None:
    print_first_prime_greater_than(11) # Prints 13

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

        <P>The symbol <Code>current_value</Code> is bound within the scope of <Code>print_first_prime_greater_than()</Code>, so it's only accessible within said function. However, the function itself is <It>also</It> a symbol (it has a name, and anything with a name is also a symbol), and it's bound within the module (global) scope. Indeed, any symbols (including functions) that are created outside of all other explicit scopes are said to be bound within the module scope.</P>

      <P>For the most part, the module scope works just like any other scope. Any symbols that are created within the module scope can also be accessed within the module scope at any point after they're created. For example, our <Code>main()</Code> function is defined in the module scope, which is why we're able to call it from within the if statement at the bottom of our program (which is also a part of the module scope).</P>

      <P>Moreover, scopes can be nested inside each other. In fact, it's axiomatic that all function scopes are necessarily nested inside the module scope. For example, line 32 in the above program is a part of the <Code>main()</Code> function's scope, but it's technically <It>also</It> part of the module scope because the <Code>main()</Code> function scope is <It>inside</It> the module scope. Hence, line 32 has access to all symbols that were created in the module scope prior to its execution. This is why line 32 is able to call <Code>print_first_prime_greater_than()</Code><Emdash/>that function was defined in the module scope, and line 32 is technically also part of the module scope.</P>

      <P>Although the module scope works mostly the same as any other scope, there is an exception: variables that are created in the module scope can only be accessed within functions by first explicitly binding the variable's name to the global variable via the <Code>global</Code> keyword. For example, if there's a global variable called <Code>pi</Code>, and a function wants to access it, the function must bind the name <Code>pi</Code> to the global variable via <Code>global pi</Code> before it's able to access it:</P>

      <PythonBlock fileName="global_variable.py" highlightLines="{5}">{
`pi = 3.141592

def area_of_circle(radius: float) -> float:
    # Bind 'pi' to the global variable created on line 1 above
    global pi

    # Now we can use it to compute the area of the circle
    return pi * radius * radius

def main() -> None:
    # Print the area of a circle with radius 10
    print(area_of_circle(10))

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>There's a reason that global variables can only be accessed with a special, explicit syntax: in most cases, global variables are more trouble than they're worth. In particular, mutable global variables, meaning global variables that are modified throughout the duration of the program, are an especially Bad Idea (with rare exceptions).</P>

      <P>As a simple example, imagine that your coworker creates a new function in the above program that, for some reason, modifies the value of <Code>pi</Code>. That would obviously be a mistake; there's no reason to change the value of <Code>pi</Code>. However, consider the consequences of that mistake. Their code, which modifies the value of <Code>pi</Code>, might seemingly work just fine. Meanwhile, the <Code>area_of_circle()</Code> function is now broken since it assumes <Code>pi</Code> to have the correct value, which it doesn't. When you discover that the <Code>area_of_circle()</Code> function isn't producing the correct outputs, the rational conclusion is that there's something wrong with the <Code>area_of_circle()</Code> function's implementation. But, of course, there's nothing wrong with it; the mistake is in some other, completely unrelated function that just happens to modify the value of the global variable <Code>pi</Code>, breaking other functions in the process. This is a surefire way to end up on a wild goose chase, spending hours looking for bugs where there aren't any.</P>

      <P>Indeed, mutable global variables essentially create an extremely messy web of communication and interdependence between all functions in the entire program. This can lead to situations where one function breaks the assumptions of another function (as in the example I just described), or where functions behave differently depending on the order in which they're called, etc. Trying to navigate such a complex dependency graph is a bad idea; you're basically guaranteed to make a mistake at some point (if not several), and those mistakes can be incredibly difficult to locate.</P>

      <P>It's a better idea to just avoid that situation entirely, and there's a simple convention to help you achieve that: don't modify global variables. To be clear, it's okay to create global variables and assign them values when doing so, but don't <It>change</It> their values after the fact.</P>

      <P>In some programming languages, a variable can be declared as a "constant", which prevents it from being modified altogether. In general, Python provides no such guard rails<Emdash/>only conventions. In Python, if you'd like to create a variable and indicate that it <It>shouldn't</It> be modified, the convention is to name the variable in all uppercase letters. This doesn't <It>prevent</It> it from being modified, but experienced Python programmers know better than to modify such variables. Hence, if you're going to create a global variable for some reason, then not only should you not modify it, but you should also name it in all uppercase letters to indicate to other programmers that it shouldn't be modified:</P>

      <PythonBlock fileName="global_variable.py" highlightLines="{1}">{
`PI = 3.141592 # All caps implies that it shouldn't be modified

def area_of_circle(radius: float) -> float:
    # Bind 'PI' to the global variable created on line 1 above
    global PI

    # Now we can use it to compute the area of the circle
    return PI * radius * radius

def main() -> None:
    # Print the area of a circle with radius 10
    print(area_of_circle(10))

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <SectionHeading id="standard-input">Standard input</SectionHeading>

      <P>As you know, any text written to a process's standard output file is printed to the terminal for the user to see (this is precisely want the <Code>print()</Code> function does by default). But conversely, whenever the user types text into the terminal, that text gets written into the process's standard input file. The process can then read that text from the file via the <Code>input()</Code> function. This allows terminal-based programs to be interactive; the process can present information to the user via <Code>print()</Code>, but the process can also receive information from the user via <Code>input()</Code>.</P>

      <P>The <Code>input()</Code> function requires a single string argument. It then prints that string to the terminal via standard output (indeed, <Code>input()</Code> interacts with both standard output and standard input). It then pauses, waiting for the user to type something into the terminal and press enter. When the user does so, the <Code>input()</Code> function returns the string entered by the user (which it reads from standard input), and the program continues. Typically, you'd want to store the return value of the <Code>input()</Code> function in a variable so that you can access it later on.</P>

      <P>Here's a simple example:</P>

      <PythonBlock fileName="prompt_favorite_fruit.py">{
`def main() -> None:
    # Ask the user for their favorite fruit, and wait for their
    # response. Store their response in the 'favorite_fruit'
    # variable
    favorite_fruit = input('What is your favorite fruit?\\n')

    # Just to prove that it worked, let's print their favorite
    # fruit right back to the terminal
    print(favorite_fruit)

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Suppose you run the above program and enter "Banana" as your favorite fruit. The output would look like this:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python prompt_favorite_fruit.py 
What is your favorite fruit?
Banana
Banana
`
      }</TerminalBlock>

      <P>Notice that the word "Banana" appears twice. The first "Banana" was not actually printed by the program<Emdash/>it's what I (the user) typed into the terminal. After I typed it and pressed the enter key, the string <Code>'Banana'</Code> was stored inside the <Code>favorite_fruit</Code> variable. The program then resumed and printed the value of that variable back to the terminal, hence the second "Banana".</P>

      <P>Importantly, the <Code>input()</Code> function always returns the text entered by the user as a <Ul>string</Ul> value. Hence, the variable <Code>favorite_fruit</Code> is of type <Code>str</Code>. In some cases, that can be problematic. For example, suppose you want to write a program that asks the user for their birth year and prints out their age. Clearly, the program will need to conduct some arithmetic, perhaps subtracting their birth year from the current year (there are more robust solutions than this, but let's keep it simple). But if their birth year is stored and represented as a string variable, then it's not possible to use it in mathematical operations. For example:</P>

      <PythonBlock fileName="compute_age.py">{
`def main() -> None:
    birth_year = input('What year were you born?\\n')
    
    print(f'Your age is (roughly) {2025 - birth_year}')

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Running the above program through Mypy raises an error message:</P>

      <TerminalBlock copyable={false}>{
`(env) $ mypy compute_age.py 
compute_age.py:4: error: Unsupported operand types for - ("int" and "str")  [operator]
Found 1 error in 1 file (checked 1 source file)
`
      }</TerminalBlock>

      <P>Mypy is trying to tell us that the subtraction operator (<Code>-</Code>) cannot be used to subtract a string from an integer (i.e., we have a type error). And indeed, attempting to run the program itself results in an error at runtime after the user types in their birth year:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python compute_age.py 
What year were you born?
1999
Traceback (most recent call last):
  File "/home/alex/instructor/static-content/cs162/Lecture-Notes/code-samples/python-basics/compute_age.py", line 7, in <module>
    main()
    ~~~~^^
  File "/home/alex/instructor/static-content/cs162/Lecture-Notes/code-samples/python-basics/compute_age.py", line 4, in main
    print(f'Your age is (roughly) {2025 - birth_year}')
                                   ~~~~~^~~~~~~~~~~~
TypeError: unsupported operand type(s) for -: 'int' and 'str'
`
      }</TerminalBlock>

      <P>So, how do we fix this? Well, recall <Link href="#type-casting">our discussion about type casting</Link>. I said that, in some cases, expressions must be <It>explicitly</It> type casted to convert them to the desired type (that's to say, in some cases, the interpreter will not automatically convert expressions into other types just to make them valid<Emdash/>it's your responsibility to do the type casting in such cases). In order to subtract <Code>birth_year</Code> from <Code>2025</Code>, we must first explicitly type-cast <Code>birth_year</Code> into an integer (or some other numeric type that can be subtracted from an integer):</P>

      <PythonBlock fileName="compute_age.py">{
`def main() -> None:
    # Type-cast the user's input to an int before storing it
    # in birth_year. An alternative solution would be to type-cast
    # birth_year into an int when embedding it into the F-string,
    # but this solution allows us to treat birth_year as an int
    # from this point on without having to repeatedly type-cast it
    # every time we reference it.
    birth_year = int(input('What year were you born?\\n'))
    
    print(f'Your age is (roughly) {2025 - birth_year}')

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Running the above program through Mypy prints no error messages:</P>

      <TerminalBlock copyable={false}>{
`(env) $ mypy compute_age.py 
Success: no issues found in 1 source file
`
      }</TerminalBlock>

      <P>And running the program itself produces the following output (assuming the user enters 1999 as their birth year):</P>

      <TerminalBlock copyable={false}>{
`(env) $ python compute_age.py 
What year were you born?
1999
Your age is (roughly) 26
`
      }</TerminalBlock>

      <P>Note: This isn't the point of the lecture, but the proper way of computing someone's age from their birthdate would be to use <Link href="https://docs.python.org/3/library/datetime.html">a complete and robust datetime library</Link>. Conducting arithmetic on dates and times is infamously difficult due to daylight savings time, discrepancies between time zones, time zone adjustments, leap years, and so on, so you should probably rely on an existing complete solution rather than trying to implement your own.</P>

      <SectionHeading id="if-statements">If statements</SectionHeading>

      <P>The term <Term>control flow</Term> describes the flow of code execution throughout a program. In an imperative programming paradigm, control flow typically follows a top-down order by default, executing one statement at a time. However, various mechanisms can be used to manipulate control flow. Function calls, for instance, force the control flow to jump from the function call to the beginning of the function definition. A return statement (and / or the natural termination of a function) forces the control flow to jump back to the call site (i.e., the place where the function was called).</P>

      <P><Term>If statements</Term> are another imperative mechanism that manipulate the control flow of a program. Hopefully you already know what they are, even if you haven't heard them described in this manner. But in case you don't, an if statement is a block of code that executes if and only if a certain condition is satisfied. If said condition isn't satisfied, the control flow skips the entire if statement body and picks up from there (though "else if" and "else" blocks complicate matters slightly).</P>

      <P>Before we can create if statements, we have to understand boolean expressions, particularly <Code>relational operators</Code>. Relational operators compare two values to produce a boolean based on an analysis of a relationship between them. For example, the equality operator, <Code>==</Code>, will produce a <Code>True</Code> value if the operands (i.e., the expressions on both sides of it) are equal to each other (in some sense or another), and it will produce a <Code>False</Code> value otherwise. Here are the relational operators that you should know about:</P>

      <Itemize>
        <Item><P><Code>==</Code> (equality): Produces <Code>True</Code> if and only if the two operands are equal (and <Code>False</Code> otherwise). Notice that it uses <Ul>two</Ul> equal signs. If you only used one equal sign, that would be an assignment operator, which is a completely different thing. Accidentally using an assignment operator instead of an equality operator is an incredibly common mistake among beginner programmers.</P></Item>
        <Item><P><Code>!=</Code> (inequality): Produces <Code>True</Code> if and only if the two operands are <Ul>not</Ul> equal (and <Code>False</Code> otherwise).</P></Item>
        <Item><P><Code>{`<`}</Code> (less than): Produces <Code>True</Code> if and only if the operand on the left is smaller than the operand on the right (and <Code>False</Code> otherwise).</P></Item>
        <Item><P><Code>{`>`}</Code> (greater than): Produces <Code>True</Code> if and only if the operand on the left is greater than the operand on the right (and <Code>False</Code> otherwise).</P></Item>
        <Item><P><Code>{`<=`}</Code> (less than or equal to): Produces <Code>True</Code> if and only if the operand on the left is smaller than or equal to the operand on the right (and <Code>False</Code> otherwise).</P></Item>
        <Item><P><Code>{`>=`}</Code> (greater than or equal to): Produces <Code>True</Code> if and only if the operands on the left is greater than or equal to the operand on the right (and <Code>False</Code> otherwise).</P></Item>
      </Itemize>

      <P>Here's an example program to demonstrate relational operators:</P>

      <PythonBlock fileName="relational_operators.py">{
`def main() -> None:
    x = 1
    print(x == 1) # Prints True
    
    print(x < 4) # Prints True
    
    print(x > 4) # Prints False

    x = 3
    y = 7
    print(x + y <= 10) # Prints True

    print(x + y >= 11) # Prints False

    print(x != 4) # Prints True

    # Some relational operators, such as ==, work on more than
    # just numeric expressions:

    my_string = 'Hello'
    print(my_string == 'Hello') # Prints True

    print(my_string != 'Hello') # Prints False

    # Of course, you can store the value of a relational
    # operation in a boolean variable:

    my_string_is_equal_to_goodbye = my_string == 'Goodbye'
    print(my_string_is_equal_to_goodbye) # Prints False

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Running the above program produces the following output:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python relational_operators.py 
True
True
False
True
False
True
True
False
False
`
      }</TerminalBlock>

      <P>Let's talk if statements. To create an if statement in Python, start with the header: type the keyword <Code>if</Code>, followed by an expression whose type is <Code>bool</Code> (i.e., a condition), followed by a colon. Then, write the body of the if statement below the header. The body is the block of code that will execute if and only if the condition is satisfied. If statement bodies must be indented by one additional "level" of indentation, just like function bodies (again, you must be consistent about how you indent your code). Here's an example:</P>

      <PythonBlock fileName="if_statement.py">{
`def main() -> None:
    password = input("What's the password?\\n")
    
    if password == '1234':
        print('Correct. Come on in.')

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Here are some example runs of the above program:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python if_statement.py 
What's the password?
4321
(env) $ python if_statement.py 
What's the password?
1234
Correct. Come on in.
`
      }</TerminalBlock>

      <P>Notice: When I type "4321" as the password, the if statement body does <Ul>not</Ul> execute, so the program prints nothing. But when I type "1234", the if statement body <Ul>does</Ul> execute, so the program prints "Correct. Come on in."</P>

      <P>Rather than simply printing nothing when the user types in an incorrect password, it'd be more interesting if the program printed some sort of error message (e.g., "Wrong password!"). There are a few ways to accomplish this, but the simplest way is an <Term>else statement</Term>, which may optionally follow a preceding if statement. If the if statement's condition is true, then the if statement's body is executed. But if the if statement's condition is false, then the else statement's body is executed instead. An if statement body and an else statement body are mutually exclusive<Emdash/>they will never <It>both</It> be executed.</P>

      <P>To create an else statement in Python, type the keyword <Code>else</Code> followed by a colon. Then write the else statement body immediately below that, again indented by one level of indentation. Importantly, the indentation of the else statement header must match that of the if statement header, and the indentation of the else statement body must match that of the if statement body. Let's update our example:</P>

      <PythonBlock fileName="if_statement.py">{
`def main() -> None:
    password = input("What's the password?\\n")
    
    # Notice that "if" and "else" headers are at the same level of
    # indentation, and their bodies are at the same level of
    # indentation (indented by one level relative to the headers).
    if password == '1234':
        print('Correct. Come on in.')
    else:
        print('Wrong password!')

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Here are some new example runs of the updated program:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python if_statement.py 
What's the password?
4321
Wrong password!
(env) $ python if_statement.py 
What's the password?
1234
Correct. Come on in.
`
      }</TerminalBlock>

      <P>Using an if statement together with an else statement creates two blocks of code, exactly one of which will be executed. But suppose you want more than just two such blocks of code. Suppose you want, say, 10 blocks of code, and exactly which one should be executed depends on several complex conditions. As a simple example, suppose we want to update the above program to print a special message when the user types in "password" as the password. In such a case, there are three possible outputs that the program might produce, depending on what the user entered. A common way to accomplish something like this is with <Term>elif statements</Term>. "Elif" stands for "else if". An elif statement may only follow a preceding if statement or other elif statement. An elif statement's body will be executed if and only if 1) all the preceding if and elif statements' conditions were evaluated to be <Code>False</Code>, and 2) the elif statement's condition is evaluated to be <Code>True</Code>.</P>

      <P>To create an elif statement in Python, type the keyword <Code>elif</Code>, followed by an expression whose type is <Code>bool</Code> (i.e., a condition), followed by a colon. Then write the elif statement body immediately below that, again indented by one level of indentation. Let's update our example again:</P>

      <PythonBlock fileName="if_statement.py">{
`def main() -> None:
    password = input("What's the password?\\n")
    
    if password == '1234':
        print('Correct. Come on in.')
    elif password == 'password':
        print('Very funny.')
    else:
        print('Wrong password!')

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>And here are some updated example runs:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python if_statement.py 
What's the password?
4321
Wrong password!
(env) $ python if_statement.py 
What's the password?
1234
Correct. Come on in.
(env) $ python if_statement.py
What's the password?
password
Very funny.
`
      }</TerminalBlock>

      <P>I've left out some details. For one, you can chain an arbitrary number of elif statements together, but such a chain must start with an if statement and may only have at most one else statement. Moreover, if a such a chain does have an else statement, it must appear at the very end of the chain.</P>

      <P>When the Python interpreter encounters such a chain of if, elif, and else statements, it starts by evaluating the condition of the first if statement. If it's true, it executes the if statement's body, and that's the end of it. It then jumps past all the rest of the elif and else statements in the entire chain. However, if the if statement's condition is false, it proceeds to evaluate the condition of the next elif statement. If <It>that</It> condition is true, it executes the corresponding elif statement body. Otherwise, it proceeds to evaluate the condition of the <It>next</It> elif statement, and so on. If all the if and elif statements' conditions evaluate to false, then it will instantly execute the else statement body, assuming there <It>is</It> an else statement (indeed, else statements do not have conditions; their bodies simply execute whenever all the preceding if and elif statements' conditions evaluate to false).</P>

      <P>Students are often confused about the difference between an if statement and an elif statement. I think the difference is illustrated well by the following example:</P>

      <PythonBlock fileName="if_vs_elif.py">{
`def main() -> None:
    # The following if / elif chain prints "ABC", but it does NOT
    # print "123", even though 3 + 3 is indeed equal to 6. That's
    # because the second block is an elif statement---not just
    # another if statement. Hence, it will execute if and only if
    # 1) its condition (3 + 3 == 6) is true, AND 2) the preceding
    # if statement's condition was false. But the preceding if
    # statement's condition (2 + 2 == 4) was true, so the else if
    # statement body does NOT execute, even though its condition
    # is true.
    if 2 + 2 == 4:
        print('ABC')
    elif 3 + 3 == 6:
        print('123')

    # In contrast, the following if statements operate completely
    # independently of one another; the second if statement knows
    # nothing about the first if statement, and vice-versa. Each
    # if statement's condition is evaluated to true, so both if
    # statement bodies execute. Hence, XYZ is printed, followed by
    # 987.
    if 2 + 2 == 4:
        print('XYZ')
    if 3 + 3 == 6:
        print('987')


if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Running the above program produces the following output:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python if_vs_elif.py 
ABC
XYZ
987
`
      }</TerminalBlock>

      <P>Now let's talk <Term>logical operators</Term>. Logical operators operate on booleans and produce booleans. There are three main logical operators that you should know about:</P>

      <Itemize>
        <Item><P><Code>and</Code>: The logical "and" operator. The operation will evaluate to true if and only if the boolean expressions on both sides of it are true. Otherwise, it evaluates to false.</P></Item>
        <Item><P><Code>or</Code>: The logical "or" operator. The operation will evaluate to true if and only if at least one of the boolean expressions on either side of it is true. Otherwise, it evaluates to false.</P></Item>
        <Item><P><Code>not</Code>: The logical "not" operator. This is a unary operator, meaning you put a boolean expression on its right, but nothing on its left. It simply negates the value of the boolean expression on its right (if the boolean expression is true, it evaluates to false; if the boolean expression is false, it evaluates to true).</P></Item>
      </Itemize>

      <P>Here's an example program that demonstrates logical operators:</P>

      <PythonBlock fileName="logical_operators.py">{
`def main() -> None:
    age = int(input('How old are you?\\n'))
    country = input('What country do you live in?\\n')

    # Many (e.g., European) countries require you to be 18 or
    # older to get a driver's license, but the USA only requires
    # you to be 16 or older. Notice the use of parentheses to
    # control the order of logical operations.
    if (age > 18 and not country == 'USA') or (age > 16 and country == 'USA'):
        print('You can get a drivers license!')
    else:
        print("Sorry! You're not old enough to get a driver's license.")
    
    # Note: \`not country == 'USA'\` could instead be written as
    # \`country != 'USA'\`. In fact, the latter would be preferred.
    # But either way works, and this is just a demonstration.


if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>One more detail about if statements. If a function's return type is not <Code>None</Code>, then that function must <Ul>always</Ul> return a value of its specified return type. In other words, it should never be possible for a function with a non-<Code>None</Code> return type to reach the bottom of its body. Instead, such functions should always terminate by encountering a <Code>return</Code> statement that returns a value whose type matches the function's return type. The reason this matters in our discussion of if statements is that it's common to put <Code>return</Code> statements inside of if statement bodies. That's fine, but just make sure that, even if the if statement condition is evaluated as false, the function still <It>eventually</It> encounters some <Code>return</Code> statement or another that returns a value of the correct type. Otherwise, Mypy will raise errors, and your program may behave in unexpected ways.</P>

      <P>For example, Mypy raises errors about the following function since it fails to return an <Code>int</Code> value if the if statement's condition is false, despite the function's return type being annotated as <Code>int</Code>:</P>

      <PythonBlock fileName="if_in_function.py">{
`def foo() -> int:
    number = int(input("What's your favorite number?\\n"))
    if number > 10:
        return 1
`
      }</PythonBlock>

      <P>Here's the error reported by Mypy:</P>

      <TerminalBlock copyable={false}>{
`(env) $ mypy if_in_function.py 
if_in_function.py:1: error: Missing return statement  [return]
Found 1 error in 1 file (checked 1 source file)
`
      }</TerminalBlock>

      <P>In fact, even <It>this</It> is illegal, even though, objectively, the if statement condition should never be false:</P>

      <PythonBlock fileName="if_in_function.py">{
`def foo() -> int:
    if 2 > 1:
        return 1
`
      }</PythonBlock>

      <P>Mypy raises the same error in this case.</P>

      <P>The simplest way to avoid these errors is to always have a <Code>return</Code> statement (that returns a reasonable value) at the very bottom of your function definitions, specifically for all functions with non-<Code>None</Code> return types. For example, the following function is perfectly legal, and Mypy raises no errors:</P>

      <PythonBlock fileName="if_in_function.py">{
`def foo() -> int:
    number = int(input("What's your favorite number?\\n"))
    # If their favorite number is greater than 10, return 1
    if number > 10:
        return 1

    # In all other cases, return 0. This is a "catch all".
    # Mypy can easily prove that this function will never
    # terminate without returning an int (which is the function's
    # return type). That makes Mypy happy, so it doesn't raise
    # any errors.
    return 0
`
      }</PythonBlock>

      <SectionHeading id="loops">Loops</SectionHeading>

      <P>As you hopefully know, <Term>loops</Term> are programming language mechanisms that manipulate a program's control flow so as to execute a certain block of code repeatedly until some condition is satisfied (or while some condition is satisfied). There are two main kinds of loops in Python: <Term>while loops</Term>, and <Term>for loops</Term>.</P>

      <P>A while loop works exactly like an if statement, except 1) you use the <Code>while</Code> keyword instead of the <Code>if</Code> keyword; 2) you cannot place elif nor else statements after a while loop; and 3) whenever the interpreter reaches the end of a while loop body, it jumps back up to the top of the while loop, re-evaluating the condition and executing the body <It>again</It> if the condition is still satisfied (in contrast, when the interpreter reaches the end of an if statement body, it proceeds to execute whatever code comes after the if statement and attached elif / else statements). The while loop will continue executing over and over again until, eventually, the interpreter evaluates the loop condition and finds it to be false.</P>

      <P>Here's an example program that 1) asks the user to repeatedly enter numbers until they choose to quit, and then 2) prints the sum of all the numbers that they entered:</P>

      <PythonBlock fileName="while_loop.py">{
`def main() -> None:
    value_sum = 0
    user_wants_to_quit = False
    while not user_wants_to_quit:
        next_value = int(input('Enter a number: '))
        value_sum += next_value

        quit_input = input("Type q if you'd like to quit. "
                           "Otherwise, type anything else: ")

        if quit_input == 'q':
            user_wants_to_quit = True
        # Alternatively: user_wants_to_quit = quit_input == 'q'
    
    # The control flow will only reach this point once the user
    # types 'q' to quit. That means that they're done entering
    # numbers. Let's print the sum of all the numbers that
    # they entered:
    print(f'The sum of all the numbers you entered is {value_sum}')

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Here's an example run:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python while_loop.py 
Enter a number: 1
Type q if you'd like to quit. Otherwise, type anything else: j
Enter a number: 12
Type q if you'd like to quit. Otherwise, type anything else: jfdsajfd
Enter a number: 4
Type q if you'd like to quit. Otherwise, type anything else: q
The sum of all the numbers you entered is 17
`
      }</TerminalBlock>

      <P>Importantly, a while loop does not necessarily end the <It>moment</It> that its condition becomes false. Rather, a while loops ends when the interpreter <It>evaluates</It> the while loop condition and, in doing so, determines it to be false. The interpreter evaluates the while loop condition once when the loop is first encountered, and then again every time it reaches the end of the while loop body. Hence, if the condition becomes false in the <It>middle</It> of the while loop body, the rest of the loop body will still execute as normal, and then the condition will be re-evaluated as false, and <It>then</It> the loop will terminate.</P>

      <P>If you want to terminate a while loop body in the middle of its execution, there's a special keyword that does just that: <Code>break</Code>. When the interpreter encounters a <Code>break</Code> statement inside a loop body, the loop terminates immediately, and the control flow picks up below the loop, proceeding to execute the rest of the program. In general, it usually only makes sense to use <Code>break</Code> statements inside of if statement bodies (which in turn must be nested inside of a loop since the <Code>break</Code> statement is only allowed within loops). For example, we could rewrite the above program like so:</P>

      <PythonBlock fileName="break.py">{
`def main() -> None:
    value_sum = 0

    # The condition "True" is ALWAYS true. Ordinarily, that would
    # make this an infinite loop (a loop that runs repeatedly
    # forever). However, the break statement in the loop body
    # provides a way for the loop to terminate.
    while True:
        next_value = int(input('Enter a number: '))
        value_sum += next_value

        quit_input = input("Type q if you'd like to quit. "
                           "Otherwise, type anything else: ")

        if quit_input == 'q':
            # The user wants to quit. Terminate the loop.
            break
    
    # The control flow will only reach this point once the user
    # types 'q' to quit. That means that they're done entering
    # numbers. Let's print the sum of all the numbers that
    # they entered:
    print(f'The sum of all the numbers you entered is {value_sum}')

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>As it turns out, the <Code>while True: ... break</Code> pattern is particularly common in Python. Its purpose is to simulate something known as a <Term>do-while</Term> loop, which many other programming languages offer, but Python does not.</P>

      <P>Side note: If you ever accidentally create a truly infinite loop (i.e., a loop whose condition never becomes false) and then run your program, your shell will get stuck running the process forever and ever. Luckily, there's an easy way out: pressing Ctrl+C in the terminal sends a special signal to the process, terminating it immediately (this is why copying text from the terminal requires pressing Ctrl+Shift+C<Emdash/>Ctrl+C is instead reserved for this special signal).</P>

      <P>There's another keyword that's somewhat similar to the <Code>break</Code> keyword: the <Code>continue</Code> keyword. Whereas the <Code>break</Code> keyword terminates the entire loop, the <Code>continue</Code> keyword simply terminates the current <It>iteration</It> of the loop. In other words, it essentially causes the interpreter to jump to the end of the loop body. The interpreter then re-evaluates the loop condition as it normally would when reaching the end of the loop body, and so on.</P>

      <P>That's enough about while loops. Let's talk about for loops. A for loop is used to iterate over the items in an iterable container. In the simplest case, a for loop can be used to iterate over the elements of a list or <Term>range</Term>. <Link href="#lists">We'll talk about lists in a moment</Link>. Let's focus on ranges for now.</P>

      <P>A range is essentially just an ordered list of numbers defined by the first value, the last value, and the step size. For example, a range with a first value of 1, a last value of 7, and a step size of 2 would consist of the numbers 1, 3, 5, and 7 (the list starts at 1, ends at 7, and increments by the step size of 2 between each pair of elements).</P>

      <P>To create a range in Python, use the <Code>range()</Code> function. There are multiple ways to use it. In the simplest case, provide a single integer argument N. It will then construct a range with the first value being 0, the last value being N - 1, and the step size being 1. For example:</P>

      <PythonBlock fileName="range.py">{
`def main() -> None:
    my_range = range(5)

    print(my_range)

    # Printing a range directly isn't very illustrative. Let's
    # try printing it again, but this time we'll type-cast it to
    # a list first (more on lists shortly).
    print(list(range(5)))

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Running the above program produces the following output:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python range.py 
range(0, 5)
[0, 1, 2, 3, 4]
`
      }</TerminalBlock>
      
      <P>Another way of using the <Code>range()</Code> function is to provide two integer arguments instead of one. In such a case, the first argument specifies the first value in the range, and the second argument specifies the last value in the range plus 1 (just as in the previous example). Finally, you can call the <Code>range()</Code> function and pass in three arguments. In such a case, the first argument specifies the first value in the range, the second argument specifies the last value in the range plus 1, and the third argument specifies the step size.</P>

      <P>Anyways, ranges are iterable, meaning you can use a for loop to iterate over the elements within a range. The syntax of a for loop in Python is as follows:</P>

      <SyntaxBlock>{
`for <variable name> in <iterable>:
    <body>`
      }</SyntaxBlock>

      <P>When the interpreter encounters a for loop, it immediately creates a variable with the specified name (<Code>{`<variable name>`}</Code>) and assigns it the value of the first element in the iterable container (<Code>{`<iterable>`}</Code>). It then executes the for loop body. Every time it finishes executing the for loop body, it updates the variable by assigning it the value of the <It>next</It> element in the iterable container, and then it executes the for loop body again. It continues in this manner until the variable has iterated over all the elements in the iterable container, at which point the for loop terminates.</P>

      <P>As a simple example, let's create a for loop that iterates over all the integers from 0 through 9 and computes their sum:</P>

      <PythonBlock fileName="for_loop.py">{
`def main() -> None:
    value_sum = 0

    # range(10) consists of the integers 0 through 9
    for value in range(10):
        # This for loop body will execute once for each of the
        # values in range(10). In the first iteration, value
        # will be equal to 0. In the second iteration, it will
        # be equal to 1. And so on. In the final iteration,
        # it'll be equal to 9.

        # Hence, if we simply add the current value to the running
        # sum, this for loop will compute 0 + 1 + 2 + ... + 9:
        value_sum += value
    
    # The for loop is done. Print the computed sum:
    print(value_sum)

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Running the above program produces the following output:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python for_loop.py 
45
`
      }</TerminalBlock>

      <P>Indeed, 0 + 1 + 2 + ... + 9 = 45, so the for loop works correctly.</P>

      <P>Sometimes, you just want to create a loop that runs for a certain number of iterations, doing the same thing over and over again. For loops are perfect for that:</P>

      <PythonBlock fileName="repeated_for_loop.py">{
`def main() -> None:
    # This for loop will run 5 times (i will take on the values
    # 0, 1, 2, 3, and 4).
    for i in range(5):
        print('Hello, World!')

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Running the above program produces the following output:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python repeated_for_loop.py 
Hello, World!
Hello, World!
Hello, World!
Hello, World!
Hello, World!`
      }</TerminalBlock>

      <P>This works fine, but notice that it creates a completely unecessary variable, <Code>i</Code>. Indeed, <Code>i</Code> iterates over the values of the range, but we don't actually <It>care</It> about the values themselves<Emdash/>we only care about creating a loop that runs for 5 iterations. There's unfortunately no way around that; every for loop must create an iterating variable, even if the loop body doesn't explicitly reference that variable. However, there's a convention: if your for loop body doesn't explicitly reference the for loop variable at any point, and the goal is simply to run the for loop for a certain number of iterations, then you should name the for loop variable <Code>_</Code>:</P>
      
      <PythonBlock fileName="repeated_for_loop.py">{
`def main() -> None:
    # This for loop will run 5 times (i will take on the values
    # 0, 1, 2, 3, and 4).
    for _ in range(5):
        print('Hello, World!')

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>To be clear, you should <Ul>only</Ul> do this when the for loop body does not explicitly reference the for loop variable. If the for loop body <It>does</It> explicitly reference the for loop variable (e.g., in our previous example when we computed the sum of all the values in <Code>range(10)</Code>), then you should <Ul>not</Ul> name your for loop variable <Code>_</Code>.</P>

      <P>As mentioned earlier, for loops can be used to iterate over any kind of iterable container. Ranges are just one kind of iterable container. Lists are another kind, as are dictionaries, etc. You can even create your own types of iterable containers; we may learn how to do this later on in the term, time permitting.</P>

      <SectionHeading id="imports">Imports</SectionHeading>

      <P>Sometimes you need access to functions, variables, types, or other code constructs that have already been created by someone else but aren't built directly into the Python language itself. To get access to those constructs, you usually have to import them from the Python module or package that defines them.</P>

      <P>In order to import from a module or package, that module or package must be accessible to your program. This means that it must either be installed in your system / development environment (e.g., via <Code>pip</Code>, like how you installed Mypy), or it must be a local module or package that's directly present in your Python path (e.g., in your working directory). We'll discuss the process of creating local Python modules and packages in a future lecture. For now, let's focus on importing packages and modules that are already installed in your development environment.</P>

      <P>There are many "standard" packages and modules that come installed with Python itself. These packages and modules make up <Link href="https://docs.python.org/3/library/index.html">the Python Standard Library</Link>. Since these packages and modules are standard, you don't need to do anything special to install them<Emdash/>any Python program can import from them.</P>

      <P>Once a module or package is available, there are a few ways of importing things from it. One way is to import the entire module or package by simply writing <Code>import</Code> followed by the name of the module or package that you want to import. For example, the <Code>math</Code> package is part of the Python standard library, so you could import it like so:</P>

      <PythonBlock showLineNumbers={false}>{
`import math`
      }</PythonBlock>

      <P>Typically, most or all of your import statements (such as the above line) should appear at the very top of your Python file (there are use cases for function-local imports and such, but we won't discuss them in this course).</P>

      <P>In order to access something within an imported module or package, use the dot operator<Emdash/>simply type the name of the module or package, followed by a dot (<Code>.</Code>), followed by the name of the thing that you want to access that's defined within the module or package. For example, the <Code>math</Code> package defines a function named <Code>sqrt</Code>, which can be used to compute the square root of a float value (you pass it the value whose square root you want to compute, and it returns the computed square root). You could use it like so:</P>

      <PythonBlock fileName={'imports.py'}>{
`import math

def main() -> None:
    x = 100
    y = math.sqrt(x) # compute y as the square root of x

    # Prints The square root of 100 is 10
    print(f'The square root of {x} is {y}')

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Running the above program produces the following output:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python imports.py 
The square root of 100 is 10.0
`
      }</TerminalBlock>

      <P>(In order to know which things are defined by a given module or package, you have to read the documentation for said module or package. <Link href="https://docs.python.org/3/library/index.html">The standard library's documentation</Link> will be extremely helpful to you. As an exercise in navigating it, I encourage you to find the documentation for <Code>math.sqrt()</Code>.)</P>

      <P>Alternatively, you can import individual things from a module or package rather than importing the <It>entire</It> module or package itself. Here's the syntax:</P>

      <SyntaxBlock>{
`from <module or package> import <thing you want to import>`
      }</SyntaxBlock>

      <P>Replace <Code>{'<module or package>'}</Code> with the name of the module or package, and replace <Code>{'<thing you want to import>'}</Code> with the name of the thing that you want to import. For example, you could import the <Code>sqrt</Code> function from the <Code>math</Code> package like so:</P>

      <PythonBlock showLineNumbers={false}>{
`from math import sqrt`
      }</PythonBlock>

      <P>Once you've imported something from a module or package as above, you can use directly (i.e., <It>without</It> needing to prefix it with the name of the module or package followed by the dot operator). Here's a rewrite of our previous example using this new syntax:</P>

      <PythonBlock fileName={'imports.py'} highlightLines={'{1, 7}'}>{
`from math import sqrt

def main() -> None:
    x = 100

    # Notice: just sqrt(x), as opposed to math.sqrt(x)
    y = sqrt(x) # compute y as the square root of x

    # Prints The square root of 100 is 10
    print(f'The square root of {x} is {y}')

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>There are a few other ways to import things from modules and packages, but we won't discuss them right now.</P>


      <SectionHeading id="lists">Lists</SectionHeading>

      <P>The word "list" has different meanings depending on the context. Formally, it's an <Term>abstract data type</Term> that represents a homogeneous, positional, sequential ("linear") collection of values. That's to say, a list is a container that contains other things; those other things have a sequential ordering to them (there's a "first" thing, a "second" thing, a "third" thing, and so on); and the things in the list are all of the same type. (This is in contrast to various other abstract data types, like graphs, trees, sets, maps, tuples, etc, which are non-positional, non-sequential, and / or heterogeneous).</P>

      <P>But in Python, "list" actually has a slightly different meaning. In Python, <Term>list</Term> is actually a data type. That's to say, you can create <Code>int</Code> variables, you can create <Code>bool</Code> variables, and so on, but you can also create <Code>list</Code> variables.</P>

      <P>A <Code>list</Code> literal is denoted by a pair of square brackets with zero or more comma-separated values inside it. If no values are placed inside the square brackets, then an empty <Code>list</Code> is created. Otherwise, a <Code>list</Code> is created and immediately populated with the specified values. Here's an example:</P>

      <PythonBlock fileName="lists.py">{
`def main() -> None:
    # Create a list with 3 strings in it
    some_cool_words = ['Anomaly', 'Calamity', 'Anachronism']

    # Print the list to the terminal
    print(some_cool_words)

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Running the above program produces the following output:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python lists.py 
['Anomaly', 'Calamity', 'Anachronism']
`
      }</TerminalBlock>

      <P>Note: If the list is large, the Python interpreter may choose to only print <It>some</It> of its values to the terminal. If you want to ensure that all values are printed, you should iterate through the list using a for loop and print them one at a time (or do something fancier, like unpacking the list and passing its elements to <Code>print()</Code> along with a separator).</P>

      <P>To access a specific element within a list, type out the name of the list variable followed by square brackets. Inside the square brackets, specify an <Term>index</Term>. An index is an integer that specifies a position within a sequential container (such as a list). In Python, lists are indexed by 0, meaning 0 is the index of the first element, 1 is the index of the second element, and so on. Here's an updated example:</P>

      <PythonBlock fileName="lists.py">{
`def main() -> None:
    # Create a list with 3 strings in it
    some_cool_words = ['Anomaly', 'Calamity', 'Anachronism']

    # Print the second element in the list (lists are indexed
    # by 0, so the first element has index 0, the second
    # element has index 1, and so on. We want to print the
    # second element, so we use 1 as our index).
    print(some_cool_words[1])

    # Print the list to the terminal
    print(some_cool_words)

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>And here's the output:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python lists.py 
Calamity
['Anomaly', 'Calamity', 'Anachronism']
`
      }</TerminalBlock>

      <P>Attempting to access an element that does not exist by specifying an out-of-bounds index in between the square brackets results in an exception being thrown (specifically an <Code>IndexError</Code>). This causes the program to immediately crash, assuming you don't catch the exception (we may discuss exceptions and how they're thrown and caught later on in the course, time permitting):</P>

      <PythonBlock fileName='out_of_bounds.py'>{
`def main() -> None:
    # Create a list with 3 strings in it
    some_cool_words = ['Anomaly', 'Calamity', 'Anachronism']

    # The list has 3 elements, so the valid indices are 0, 1, and 2. An
    # index of 3 would be out-of-bounds. This throws an exception:
    print(some_cool_words[3])

    # Print the list to the terminal
    print(some_cool_words)

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Running the above program produces the following output (it crashes immediately):</P>

<TerminalBlock copyable={false}>{
`(env) $ python out_of_bounds.py 
Traceback (most recent call last):
  File "/home/alex/instructor/static-content/guyera.github.io/code-samples/python-basics/out_of_bounds.py", line 13, in <module>
    main()
    ~~~~^^
  File "/home/alex/instructor/static-content/guyera.github.io/code-samples/python-basics/out_of_bounds.py", line 7, in main
    print(some_cool_words[3])
          ~~~~~~~~~~~~~~~^^^
IndexError: list index out of range
`
}</TerminalBlock>

      <P>There are some other ways to index a list in Python as well. For example, Python supports negative indices, list slicing, and more. We won't discuss them formally, but for the curious reader, the top answer on <Link href="https://stackoverflow.com/questions/509211/how-slicing-in-python-works">this StackOverflow question</Link> explains these things quite well.</P>

      <P>Once a list is created, you can add elements to it and remove elements from it whenever you'd like. To append an element to a list (i.e., to add a new element to the end), use the <Code>.append()</Code> method on the list, passing in the value that you want to append as the argument:</P>

      <PythonBlock fileName="lists.py">{
`def main() -> None:
    # Create a list with 3 strings in it
    some_cool_words = ['Anomaly', 'Calamity', 'Anachronism']

    # Print the second element in the list (lists are indexed
    # by 0, so the first element has index 0, the second
    # element has index 1, and so on. We want to print the
    # second element, so we use 1 as our index).
    print(some_cool_words[1])

    # Add a fourth cool word to the end of the list
    some_cool_words.append('Amok')

    # Print the list to the terminal
    print(some_cool_words)

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Here's the output:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python lists.py 
Calamity
['Anomaly', 'Calamity', 'Anachronism', 'Amok']
`
      }</TerminalBlock>

      <P>Note: Methods, like <Code>.append()</Code>, are special functions that exist <It>within</It> certain objects (i.e., within certain complex values, such as lists). We'll discuss methods in greater detail later on in the term.</P>

      <P>To remove an element from a list, type out the <Code>del</Code> keyword followed by the element that you want to remove. For example:</P>

      <PythonBlock fileName="lists.py">{
`def main() -> None:
    # Create a list with 3 strings in it
    some_cool_words = ['Anomaly', 'Calamity', 'Anachronism']

    # Print the second element in the list (lists are indexed
    # by 0, so the first element has index 0, the second
    # element has index 1, and so on. We want to print the
    # second element, so we use 1 as our index).
    print(some_cool_words[1])

    # Add a fourth cool word to the end of the list
    some_cool_words.append('Amok')

    # Delete the 3rd element from the list
    del some_cool_words[2]

    # Print the list to the terminal
    print(some_cool_words)

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Here's the output:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python lists.py 
Calamity
['Anomaly', 'Calamity', 'Amok']
`
      }</TerminalBlock>

      <P>Notice that the third element, "Anachronism", is deleted from the list. There are other ways to remove elements from a list as well, such as the <Code>.remove()</Code> and <Code>.pop()</Code> functions. We won't discuss them, but feel free to look them up if you're curious.</P>

      <P>To insert a new element into the middle of the list (rather than at the end of the list, as <Code>.append()</Code> does), you can use the <Code>.insert()</Code> method. It accepts two arguments: 1) the index at which to insert the new element, and 2) the new element to insert. Let's update our example again:</P>

      <PythonBlock fileName="lists.py">{
`def main() -> None:
    # Create a list with 3 strings in it
    some_cool_words = ['Anomaly', 'Calamity', 'Anachronism']

    # Print the second element in the list (lists are indexed
    # by 0, so the first element has index 0, the second
    # element has index 1, and so on. We want to print the
    # second element, so we use 1 as our index).
    print(some_cool_words[1])

    # Add a fourth cool word to the end of the list
    some_cool_words.append('Amok')

    # Delete the 3rd element from the list
    del some_cool_words[2]

    # Insert another word at index 1, meaning between the current
    # first and second elements
    some_cool_words.insert(1, 'Clandestine')

    # Print the list to the terminal
    print(some_cool_words)

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>And here's the output:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python lists.py 
Calamity
['Anomaly', 'Clandestine', 'Calamity', 'Amok']
`
      }</TerminalBlock>

      <P>As mentioned earlier, you can iterate over the elements of a list using a for loop, just as you can iterate over a range:</P>

      <PythonBlock fileName="iterate_list.py" highlightLines="{4}">{
`def main() -> None:
    my_list = [9.81, 3.14, -1.5]
    sum_of_values = 0.0
    for number in my_list:
        sum_of_values += number
    print(f'The sum of the values in the list is: {sum_of_values}')

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Running the above program produces the following output:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python iterate_list.py 
The sum of the values in the list is: 11.450000000000001
`
      }</TerminalBlock>

      <P>To retrieve the length of a list (i.e., the number of elements in a list), use the built-in <Code>len()</Code> function, passing in the list itself as an argument. It returns the list's length as an integer:</P>

      <PythonBlock fileName="lists.py" highlightLines="{25}">{
`def main() -> None:
    # Create a list with 3 strings in it
    some_cool_words = ['Anomaly', 'Calamity', 'Anachronism']

    # Print the second element in the list (lists are indexed
    # by 0, so the first element has index 0, the second
    # element has index 1, and so on. We want to print the
    # second element, so we use 1 as our index).
    print(some_cool_words[1])

    # Add a fourth cool word to the end of the list
    some_cool_words.append('Amok')

    # Delete the 3rd element from the list
    del some_cool_words[2]

    # Insert another word at index 1, meaning between the current
    # first and second elements
    some_cool_words.insert(1, 'Clandestine')

    # Print the list to the terminal
    print(some_cool_words)

    # Print the length of the list to the terminal (prints 4)
    print(len(some_cool_words))

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Running the above program produces the following output:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python lists.py 
Calamity
['Anomaly', 'Clandestine', 'Calamity', 'Amok']
4
`
      }</TerminalBlock>

      <P>(A somewhat common use case for <Code>len()</Code> is to retrieve the length of a list so that it can be used as an argument to the <Code>range()</Code> function. For example, <Code>range(len(my_list))</Code> would create a range of integers from 0 to N-1, where N is the length of <Code>my_list</Code>. You could then iterate over that range using a for loop, such as <Code>for i in range(len(my_list)):</Code>. Within the for loop, <Code>my_list[i]</Code> would access the current list element. That might sound like a roundabout way of iterating over a list, but it has its use cases. There are better ways to do something like this, though. For the curious reader, look up the <Code>enumerate()</Code> function.)</P>

      <P>Suppose you want to create a function that accepts a list as an argument or returns a list as a return value. Then you'll need to know how to type-annotate a list in order to get your code to pass Mypy's type checking. The syntax for a list type annotation is as follows:</P>

      <SyntaxBlock>{
`list[<element type>]`
      }</SyntaxBlock>

      <P>Replace <Code>{`<element type>`}</Code> with the type of element that the list will contain.</P>

      <P>Here's an example program that defines and calls a function that accepts a list of integers as a parameter:</P>

      <PythonBlock fileName="lists_in_functions.py" highlightLines={'{3}'}>{
`# The list_of_values parameter is a list of integers. Hence,
# we annotate its type as list[int].
def compute_sum_of_values(list_of_values: list[int]) -> int:
    value_sum = 0
    for value in list_of_values:
        value_sum += value
    return value_sum

def main() -> None:
    my_list = [1, 4, 7]

    # Compute the sum of the values in my_list and print it
    print(compute_sum_of_values(my_list))

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Running the above program produces the following output:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python lists_in_functions.py 
12
`
      }</TerminalBlock>

      <P>You could create a function that returns a list similarly. For example, the following code snippet defines a function named <Code>some_function()</Code> that returns a list of floats:</P>

      <PythonBlock>{
`def some_function() -> list[float]:
    return [3.14, 9.81, -1.5]`
      }</PythonBlock>

      <P>Lists seemingly behave a bit differently from other, more primitive types of data when used as arguments and parameters. In particular, if a function has a list as a parameter and modifies one or more of the elements within said list (or adds an element, or removes an element), the list that's passed into the function as the corresponding <It>argument</It> is also modified in the same way. It's sort of as if a list that's passed as an argument to a function is "linked" to the corresponding parameter (and, in some sense, it <It>is</It>; we'll cover the details in a future lecture). However, if the parameter is assigned an entirely new list in the middle of the function via the assignment operator, the argument is <It>not</It> reassigned that new list (i.e., the assignment operator used on a list parameter works in the same way as it does when used on a primitive-type parameter<Emdash/>it modifies the parameter, but not the argument). Here's an example to illustrate:</P>

      <PythonBlock fileName="modify_list_parameter.py">{
`def modify_list(list_of_names: list[str]) -> None:
    list_of_names.append('Liang') # This also modifies the argument
    del list_of_names[0] # This also modifies the argument
    list_of_names.insert(0, 'Joe') # This also modifies the argument
    
    # This does NOT modify the argument.
    list_of_names = ['John', 'Jacob', 'Jingleheimer', 'Schmidt']

def main() -> None:
    some_names = ['Mohammad', 'Mahatma', 'Aditya', 'Zhi']

    modify_list(some_names)

    # Prints ['Joe', 'Mahatma', 'Aditya', 'Zhi', 'Liang']
    print(some_names)
    

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Running the above program produces the following output:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python modify_list_parameter.py 
['Joe', 'Mahatma', 'Aditya', 'Zhi', 'Liang']
`
      }</TerminalBlock>
      
      <P>In Python, lists are technically allowed to be <Bold>heterogeneous</Bold>, meaning that a single list can contain elements of multiple different types. In contrast, all the above examples have been for homogeneous lists<Emdash/>lists that only contain elements of a single type. If you want to create a heterogeneous list, the type annotation syntax is more complicated. In fact, getting Mypy to accept a heterogeneous list usually requires disabling most of Mypy's static type checking capabilities for that particular list altogether, which is generally frowned upon. Moreover, heterogeneous lists are <It>usually</It> a sign of poor code design (though not necessarily<Emdash/>there are valid use cases for them). For these reasons, I won't show you how to create nor type-annotate a heterogeneous list, and I won't quiz you on how to do it. If you'd like to know how to do it, I encourage you to look into the <Code>Any</Code> and <Code>Union</Code> type annotations, but understand that the proper use cases for heterogeneous lists are somewhat few and far between, and you probably shouldn't use them unless you really know what you're doing.</P>

      <P>Suppose you want to check whether a certain value exists within a given list. You can do this with the <Code>in</Code> operator: <Code>some_value in some_list</Code> will evaluate to <Code>True</Code> if and only if <Code>some_value</Code> is indeed present within <Code>some_list</Code>. For example:</P>

      <PythonBlock fileName="search_in_list.py">{
`def main() -> None:
    list_of_users = ['Roger', 'Jennifer', 'Rob']
    
    user_input = input('What user would you like to search for?\\n')
    
    # Check whether the specified user is in the list
    if user_input in list_of_users:
        print('That user is in the list!')
    else:
        print('That user is not in the list!')

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Here are some example runs:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python search_in_list.py 
What user would you like to search for?
Alex
That user is not in the list!
(env) $ python search_in_list.py 
What user would you like to search for?
Rob
That user is in the list!
`
      }</TerminalBlock>

      <P>(If you want to check whether a given value is <It>not</It> in a given iterable, you can either use the <Code>not</Code> logical operator to simply negate the rest of the <Code>in</Code> operation, or you can use the dedicated <Code>not in</Code> operator. I won't quiz you on that, though.)</P>

      <P>Sometimes, searching within a list requires a bit more effort than simply using the <Code>in</Code> operator. For example, you might find yourself trying to search through a list of complicated objects based on one of their properties. In such a case, you could either combine the <Code>in</Code> operator with some higher-order functions (e.g., <Code>map</Code>, <Code>filter</Code>, list comprehensions, etc), or you could just use a for loop to search through the list one element at a time.</P>

      <P>We won't cover higher order functions in this course, but we will cover <Term>list comprehensions</Term>. A list comprehension is a shorthand way of creating a list from another iterable. These are a bit complicated, so let's consider this to be optional content (i.e., I won't quiz you on list comprehensions). However, they're quite powerful and generally more performant than a for loop alternative due to their optimization potential, so I strongly recommend learning how they work. Here's the syntax in the simplest case (there are other more complex ways to use them as well, but let's keep it as simple as possible for now):</P>

      <SyntaxBlock>{
`[<expression> for <variable name> in <iterable>]`
      }</SyntaxBlock>
      
      <P>When the interpreter encounters a list comprehension as above, it iterates through each of the elements in the specified iterable (<Code>{`<iterable>`}</Code>), assigning each element to the variable (<Code>{`<variable name>`}</Code>) one at a time. For each value assigned to the variable (i.e., for each value in the iterable), it evaluates the expression (<Code>{`<expression>`}</Code>). The values of all the expressions are collected into a single, new list object.</P>

      <P>That will probably make more sense with an example:</P>

      <PythonBlock fileName="list_comprehension.py">{
`def main() -> None:
    my_list = [3.14, 9.81, 12.6, -1.5]

    # For each value in my_list, which we'll refer to generally
    # as x, double it (i.e., compute 2 * x). Store all those
    # doubled values in a new list object, which we then store
    # inside the \`doubled_list\` variable.
    doubled_list = [2 * x for x in my_list]

    print(doubled_list)

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Here's the output of the above program:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python list_comprehension.py 
[6.28, 19.62, 25.2, -3.0]
`
      }</TerminalBlock>

      <SectionHeading id="tracebacks">Tracebacks</SectionHeading>

      <P>A <Term>stack trace</Term> is the list of function calls on the call stack at a given point in time during a program's execution, typically listed in the reverse order in which they were called (i.e., with the most recent called function at the top). For example, if a program is currently inside the <Code>bar()</Code> function, which was called from within the <Code>foo()</Code> function, which was called from within the <Code>main()</Code> function, then the stack trace would be the list <Code>bar(), foo(), main()</Code> (in that order).</P>

      <P>In Python, whenever a runtime error occurs that causes the program to crash (such as an <Code>IndexError</Code> as a result of indexing a list with an out-of-bounds index), the interpreter prints out a so-called <Bold>traceback</Bold> the moment the program crashes. Tracebacks are a Python-specific term, but they're basically backward stack traces. That is, they're stack traces, except the functions are listed in the order in which they were called rather than the reverse.</P>

      <P>Stack traces and tracebacks are extremely helpful for debugging runtime errors. They typically contain enough information to point the programmer directly to the exact line of code at which the error occurred. Let's take a look at the traceback from our earlier <Code>IndexError</Code> example:</P>

<TerminalBlock copyable={false}>{
`(env) $ python out_of_bounds.py 
Traceback (most recent call last):
  File "/home/alex/instructor/static-content/guyera.github.io/code-samples/python-basics/out_of_bounds.py", line 13, in <module>
    main()
    ~~~~^^
  File "/home/alex/instructor/static-content/guyera.github.io/code-samples/python-basics/out_of_bounds.py", line 7, in main
    print(some_cool_words[3])
          ~~~~~~~~~~~~~~~^^^
IndexError: list index out of range
`
}</TerminalBlock>

      <P>Tracebacks are typically read from the bottom up (and, unsurprisingly, stack traces are typically read top-down). Starting at the bottom of the above traceback, we see that the program crashed due to an <Code>IndexError</Code>. The error is accompanied by a message: <Code>list index out of range</Code>. This tells us that we tried to index a list with an out-of-range (out-of-bounds) index. Looking at the first entry above that error message, we see that the program was executing line 7 of <Code>out_of_bounds.py</Code>, which is a part of the <Code>main</Code> function, at the time that it crashed. It even shows us exactly what that line of code looks like: <Code>print(some_cool_words[3])</Code>. We can immediately surmise that <Code>3</Code> is an out-of-bounds index for the <Code>some_cool_words</Code> list. If we needed more context, we could continue up the traceback; looking at the next entry up, we can see that the <Code>main()</Code> function (where the program crashed) was <It>in turn</It> called from line 13, which is part of the module (global) scope. And, again, it shows us what that line of code looks like: <Code>main()</Code>. This context can be useful if a given function is called from many places throughout the program<Emdash/>it tells you <It>which</It> exact function call led to the crash. Of course, in this case, the crash was in <Code>main()</Code>, which is typically only called once in each program. But you can imagine complex debugging scenarios where tracing function calls several entries up the traceback can provide important diagnostic information.</P>

      <P>Do not be afraid of tracebacks. You're going to create a lot of bugs throughout this course, and some of those bugs will cause the program to crash. Tracebacks are invaluable for diagnosing those sorts of issues.</P>

      <SectionHeading id="code-style">Code style</SectionHeading>

      <P><Term>Code style</Term> refers to the formatting and organization of source code that influences how it <It>looks</It> rather than how it <It>works</It>. Beginner programmers often neglect the importance of code style. In industry, if your code style does not adhere to your team's style guidelines, it will be rejected during code review, and you'll have to correct it. This is a waste of your time, but it's also a waste of the reviewers' time. To avoid that situation, pay close attention to the style guidelines <It>as</It> you write the code rather than after the fact.</P>

      <P>And, indeed, there's a style guide for our course. You can find it in Canvas. Most of it is fairly intuitive, but one aspect that can trip students up is the line length limit. Specifically, our style guide requires that your lines of code are no longer than 80 characters each. If you have a line of code that's longer than that, you must find a way to break it up into smaller lines.</P>

      <P>How you break up a line of code into multiple smaller lines depends on the content of that line of code. A long if statement header can be broken up into multiple smaller lines at logical operators, but you have to type a backslash character (<Code>{'\\'}</Code>) at the end of each broken-up line except for the last. In such a case, it's also a good idea to adjust the indentation of the subsequent broken-up lines to clearly delineate the end of the if statement header from the start of the if statement body. For example:</P>

      <PythonBlock fileName="logical_operators.py">{
`def main() -> None:
    ...

    # Notice: The if statement header is broken up into
    # two lines. Also, notice that the second line is indented
    # over by TWO levels. This makes it easy to distinguish
    # the broken-up header from the start of the if statement
    # body.
    if (age > 18 and not country == 'USA') or \\
            (age > 16 and country == 'USA'):
        print('You can get a drivers license!')

    ...
`
      }</PythonBlock>

      <P>Importantly, nothing should appear after the trailing backslash character at the end of each broken-up line<Emdash/>not even whitespace (spaces, tabs, etc).</P>

      <P>Another common reason for a long line of code is a long string literal. For example, suppose you want to print a very long string to the terminal:</P>

      <PythonBlock fileName="print_long_string.py">{
`def main() -> None:
    print("This is a very, very, very long string. It's much longer than 80 characters, which is the limit to how long your lines of code are allowed to be.")

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>A string literal can be broken up into multiple smaller lines of code by 1) enclosing it in parentheses (assuming it isn't already enclosed in parentheses), and 2) segmenting it into smaller string literals within said parentheses. For example, the below program is identical to the above one, but the string literal is broken up into three small lines of code instead of one very large line of code:</P>

      <PythonBlock fileName="print_long_string.py">{
`def main() -> None:
    print("This is a very, very, very long string. It's much "
           "longer than 80 characters, which is the limit to how "
           "long your lines of code are allowed to be.")

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Finally, function headers with many parameters, as well as function calls with many arguments, are another reason for having a long line of code. To break up long function headers, declare each parameter on its own line of code (and, like with the if statement header example, I recommend adjusting indentation to clearly distinguish the header from the body). Similarly, to break up long function calls, list each argument on its own line of code. For example:</P>

      <PythonBlock fileName="long_function_call.py">{
`# Each parameter is declared on a separate line of code to keep the
# lines short. They're also indented by TWO levels of indentation
# to distinguish the end of the function header from the start
# of the function body.
def cool_function(
        a: float,
        b: int,
        c: str,
        d: bool,
        e: float,
        f: int) -> None:
    print('Hello, World!')

def main() -> None:
    # Each argument is listed on a separate line of code to keep
    # the lines short.
    cool_function(
        3.14,
        5,
        'Hello',
        True,
        9.81,
        10
    )

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>There are many other aspects to the style guidelines in this course. Please review them on your own time. Again, failure to obey the style guidelines may result in a grade penalty.</P>

      <SectionHeading id="explicit-type-annotations-of-local-variables">Explicit type annotations of local variables</SectionHeading>

      <P>A <Bold>local variable</Bold> is a regular variable that's created within a function (not a parameter, and not a global variable). In most cases, Mypy can infer the type of each local variable based on how it's used. For example, if you create a variable <Code>x</Code> via the statement <Code>x = 5</Code>, Mypy can infer that <Code>x</Code> is of type <Code>int</Code>. Subsequent attempts to assign it a different type of value (e.g., <Code>x = 'Hello'</Code>) will result in Mypy raising a type error, as we've discussed.</P>

      <P>However, in some rare cases, Mypy is unable to determine the type of a variable. Here's a somewhat contrived example:</P>

      <PythonBlock fileName="ambiguous_type.py">{
`def main() -> None:
    # An empty list. But is it a list of ints? Strings? What is it???
    my_list = []

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Running the above program through Mypy produces the following error:</P>

      <TerminalBlock copyable={false}>{
`(env) $ mypy ambiguous_type.py 
ambiguous_type.py:3: error: Need type annotation for "my_list" (hint: "my_list: list[<type>] = ...")  [var-annotated]
Found 1 error in 1 file (checked 1 source file)
`
      }</TerminalBlock>

      <P>Mypy is telling us that, based on the context, it's not able to figure what type of list <Code>my_list</Code> is. After all, nowhere in the entire program do we ever store any actual values in <Code>my_list</Code>, so Mypy isn't able to figure out what type of values <Code>my_list</Code> is meant to store. This is problematic; Mypy is a static type checker, so if it can't figure out the static type of a variable, it's not able to conduct a complete static analysis. Hence, the error.</P>

      <P>In this contrived example, <Code>my_list</Code> is a pointless variable, so we could just get rid of it, and that would resolve the error. But in some niche cases, that's not an option. In those cases, you simply have to tell Mypy what type the variable is. As stated by the hint in the above error message, you do this in the exact same way that you annotate types of function parameters<Emdash/>immediately after the variable's name, write a colon followed by the variable's type:</P>

      <PythonBlock fileName="unambiguous_type.py" highlightLines="{2-5}">{
`def main() -> None:
    # Mypy can't figure out what type of list this is by itself,
    # so we have to explicitly tell it. In this case, I want it to be
    # a list of strings, so the type annotation is list[str]
    my_list: list[str] = []

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>The above program passes through Mypy with no errors.</P>
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
