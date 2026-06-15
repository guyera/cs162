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
      <P>This lecture is about <Bold>file I/O</Bold> (file input / output). We'll cover the following:</P>

      <Itemize>
        <Item><Link href="#file-input">File input</Link></Item>
        <Item><Link href="#string-parsing">String parsing</Link></Item>
        <Item><Link href="#file-output">File output</Link></Item>
        <Item><Link href="#join">The <Code>join()</Code> method</Link></Item>
      </Itemize>

      <SectionHeading id="file-input">File input</SectionHeading>
      
      <P>Suppose you want to write a program that reads data not just from the user via the terminal, but from the contents of an existing file, perhaps for some sort of "loading" or "importing" feature. Reading data from the terminal is often referred to as <Bold>standard input</Bold> (the exact meaning of this term will make more sense if you take a systems programming or operating systems course). In contrast, reading data from a file is often referred to as <Bold>file input</Bold>.</P>

      <P>To read data from a file, you first have to <Bold>open</Bold> the file for reading. The syntax is as follows:</P>

      <SyntaxBlock>{
`with open(<file path>, 'r') as <file variable name>:
    <context manager body>`
      }</SyntaxBlock>

      <P>Replace <Code>{'<file path>'}</Code> with a string containing the path to the file (relative to your working directory at the time of running the program, or an absolute path), replace <Code>{'<file variable name>'}</Code> with the name that you want to give to the variable that will represent the opened file, and replace <Code>{'<context manager body>'}</Code> with the block of code that will read from the opened file.</P>

      <P>To understand this syntax, you have to understand what a <Bold>context manager</Bold> is. In Python, a context manager allows you to create a block of code that automatically performs some last-minute "cleanup" operations the moment it finishes executing (and / or some entry operations the moment it starts). For example, whenever you open a file, that file must eventually be closed. A context manager can be used to make the closing of the file (the "cleanup" operations) automatic so that you don't have to remember to do it (and, indeed, the above syntax does exactly that).</P>

      <P>Context managers are used alongside the <Code>with</Code> keyword, as in the above syntax, and the <Code>open()</Code> function is a built-in context manager for opening and managing files. For example, <Code>{"with open('my-file.txt', 'r') as f:"}</Code> would 1) open the file named <Code>my-file.txt</Code> for reading (the <Code>'r'</Code> stands for "reading"); 2) create a context manager to represent the opened file; and 3) create a variable named <Code>f</Code> to represent the file itself. The block of code below that<Emdash/>the context manager body<Emdash/>would then execute. The context manager body has access to the file variable (<Code>f</Code>, in this example). The moment the context manager body ends, the context manager's cleanup code (which is built into the context manager itself) is automatically executed, closing the file.</P>

      <P>There are other ways to open and close files in Python, but this is the most idiomatic.</P>

      <P>We haven't covered enough details to make a very useful program yet, but let's start building one up:</P>

      <PythonBlock fileName="file_input.py">{
`def main() -> None:
    with open('data.txt', 'r') as data_file:
        # TODO Read the data from the file, which is represented
        # by the data_file variable.

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>The above program opens up a file named <Code>data.txt</Code> for reading (<Code>.txt</Code> stands for "text", which implies that the file just has textual data inside it).</P>

      <P>Now that we've opened the file, let's read some data from it. There are a few ways to read data from a file. In this course, we'll only work with text files, and we'll always read them one line of text at a time. This is such a common task that Python makes it incredibly easy to do: a file variable, such as <Code>data_file</Code> in the above code, can be iterated using a for loop, which will automatically iterate over the lines of text from the file one line at a time. For example:</P>

      <PythonBlock fileName="file_input.py">{
`def main() -> None:
    with open('data.txt', 'r') as data_file:
        # Keep track of the line number
        line_number = 1

        # For each line in the file
        for current_line in data_file:
            # Print the line number, followed by the line itself
            print(f'Line {line_number}: {current_line}')

            # Increment the line number
            line_number = line_number + 1

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Before we can run the above program, we have to make sure that <Code>data.txt</Code> is present in our working directory so that our program can open it and read from it. Suppose that it is, and suppose that it contains the following contents:</P>

      <TerminalBlock fileName="data.txt">{
`Corvallis
Eugene
Salem
Portland`
      }</TerminalBlock>

      <P>Then running the above program produces the following output:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python file_input.py 
Line 1: Corvallis

Line 2: Eugene

Line 3: Salem

Line 4: Portland

`
      }</TerminalBlock>

      <P>Indeed, the <Code>current_line</Code> variable is a string, and it iterates over each of the lines in the file in top-down order. Since we print <Code>current_line</Code> in each iteration (prefixed with its line number), it prints all of the lines from the file.</P>

      <P>You might have noticed that each line in the above printout is separated by an extra newline character sequence. For example, there's a line of spacing between <Code>Line 1: Corvallis</Code> and <Code>Line 2: Eugene</Code>. There's a simple reason for that: in a given iteration of the for loop, the <Code>current_line</Code> variable represents a string containing all of the text from the corresponding line in the file (e.g., in the first iteration, <Code>current_line</Code> is a string containing the first line of text from the file). Each line in the file inherently ends with a newline character sequence (that's by definition<Emdash/>a line of text would not be a line of text if it wasn't, in fact, on its own line, which requires there to be an "enter character", meaning a newline character sequence, at the end of it). So when we print <Code>current_line</Code>, it prints that entire line of text that was read from the file, <It>including</It> the newline character sequence (the "enter character") at the end of it. On top of that, the <Code>print()</Code> function automatically embeds a newline character sequence at the end of whatever is printed. Hence, <It>two</It> newline character sequences appear between each line in the printout (instead of the usual one). This is the reason for the extra spacing.</P>

      <P>There are a few ways to fix this, but perhaps the best way is to "strip" the newline character sequence (the "enter character") from the end of the <Code>current_line</Code> variable. As it turns out, every string has a method named <Code>.strip()</Code>, which produces a new string that's identical to the original but without any whitespace at the beginning or end of it. Newline character sequences are considered whitespace, so we can use the <Code>.strip()</Code> method to remove it:</P>

      <PythonBlock fileName="file_input.py" highlightLines="{8-14}">{
`def main() -> None:
    with open('data.txt', 'r') as data_file:
        # Keep track of the line number
        line_number = 1

        # For each line in the file
        for current_line in data_file:
            # current_line contains an entire line of text from the
            # file, including the newline character sequence at the
            # end of it. Let's use the .strip() method to create a
            # new version of current_line that doesn't have that
            # whitespace, and then update current_line by assigning
            # it that new string
            current_line = current_line.strip()

            # Print the line number, followed by the line itself
            print(f'Line {line_number}: {current_line}')

            # Increment the line number
            line_number = line_number + 1

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Running the above program produces the following output:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python file_input.py 
Line 1: Corvallis
Line 2: Eugene
Line 3: Salem
Line 4: Portland
`
      }</TerminalBlock>

      <P>Lastly, let's talk type annotations. First, understand that returning a file from a function is often a bad idea. This is because the moment the context manager body ends (the block of code below the <Code>with</Code> statement), the file is automatically closed<Emdash/>rendering it useless<Emdash/>and that would automatically happen if you tried to use a <Code>return</Code> statement <It>within</It> the context manager body (it would end the entire function, which would of course mean ending the context manager body). However, it might be reasonable to pass a file as an <It>argument</It> into a function. And in such a case, you need to know how to type-annotate a file variable.</P>

      <P>File variables, such as <Code>data_file</Code>, are not primitive variables. Rather, they're of a more complex type. In order to type-annotate them, you must first import the <Code>TextIO</Code> type from the <Code>typing</Code> package:</P>

      <PythonBlock copyable={false} showLineNumbers={false}>{
`from typing import TextIO`
      }</PythonBlock>

      <P>You may then use <Code>TextIO</Code> as the annotation for the type of a file variable. Technically, this is only meant for text files, but that's all that we'll deal with in this course (there are other type annotations for other kinds of files, and even the more general <Code>IO</Code> annotation for arbitrary kinds of files).</P>

      <P>Let's update our example, moving the for loop that processes the file into its own function and passing <Code>data_file</Code> to it as an argument:</P>

      <PythonBlock fileName="file_input.py" highlightLines="{1,3}">{
`from typing import TextIO

def process_file(data_file: TextIO) -> None:
    # Keep track of the line number
    line_number = 1

    # For each line in the file
    for current_line in data_file:
        # current_line contains an entire line of text from the
        # file, including the newline character sequence at the
        # end of it. Let's use the .strip() method to create a
        # new version of current_line that doesn't have that
        # whitespace, and then update current_line by assigning
        # it that new string
        current_line = current_line.strip()

        # Print the line number, followed by the line itself
        print(f'Line {line_number}: {current_line}')

        # Increment the line number
        line_number = line_number + 1
    

def main() -> None:
    with open('data.txt', 'r') as data_file:
        process_file(data_file)

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>When opening a file, the <Code>open()</Code> function can fail for various reasons. For example, if you're opening a file for reading (as indicated by an <Code>'r'</Code> as the second argument), then the file must already exist, and you must have the necessary file permissions to open it. If that's not the case, <Code>open()</Code> will fail.</P>

      <P>When the <Code>open()</Code> function fails, it throws one of various kinds of exceptions depending on exactly what error occurred. However, all of these exceptions are subtypes of the <Code>OSError</Code> exception class, meaning that they can all be caught using an <Code>except</Code> block that's set up to handle <Code>OSError</Code> exceptions. For example:</P>

      <PythonBlock fileName="user_chooses_file.py" highlightLines="{25-28,30-32}">{
`from typing import TextIO

def process_file(data_file: TextIO) -> None:
    # Keep track of the line number
    line_number = 1

    # For each line in the file
    for current_line in data_file:
        # current_line contains an entire line of text from the
        # file, including the newline character sequence at the
        # end of it. Let's use the .strip() method to create a
        # new version of current_line that doesn't have that
        # whitespace, and then update current_line by assigning
        # it that new string
        current_line = current_line.strip()

        # Print the line number, followed by the line itself
        print(f'Line {line_number}: {current_line}')

        # Increment the line number
        line_number = line_number + 1
    

def main() -> None:
    # Ask the user for the name of the file
    file_path = input('What is the name of the file?: ')
    try:
        with open(file_path, 'r') as data_file:
            process_file(data_file)
    except OSError as e:
        print("Error: The file could not be opened. Perhaps it "
            "doesn't exist?")

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Here's an example run wherein I type the name of a file that doesn't exist:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python user_chooses_file.py 
What is the name of the file?: file-that-doesnt-exist.txt
Error: The file could not be opened. Perhaps it doesn't exist?
`
      }</TerminalBlock>

      <P>And here's an example run where I type <Code>data.txt</Code>:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python user_chooses_file.py 
What is the name of the file?: data.txt
Line 1: Corvallis
Line 2: Eugene
Line 3: Salem
Line 4: Portland
`
      }</TerminalBlock>

      <P>Of course, if you wanted to reprompt the user for the name of the file rather than simply ending the program when they type in an invalid file name, you could wrap the code in a while loop of some sort.</P>

      <P><Code>OSError</Code> is a very generic error type. It catches all sorts of errors that might be thrown by <Code>open()</Code>. If you only want to catch certain kinds of errors, you can use more specific error types. For example, the <Code>FileNotFoundError</Code> type can be used to only catch errors that specifically occur when trying to open a file for reading that does not exist (which is perhaps the most common reason that <Code>open()</Code> can fail, but not the only reason).</P>
      
      <SectionHeading id="string-parsing">String parsing</SectionHeading>
      
      <P>File input is not very useful if you don't have the tools to parse and process the data within the file. After all, simply printing out each of the lines in the file prefixed with a line number is not very interesting.</P>

      <P>For example, suppose that <Code>data.txt</Code> is a bit more structured and contained more interesting data, such as the following:</P>

      <TerminalBlock fileName="data.txt">{
`City,Population
Corvallis,61993
Eugene,178786
Salem,180406
Portland,635749
`
      }</TerminalBlock>

      <P>The above file contents now represent a table of data. The first column specifies a city's name, and the second column specifies its population. Each row represents a separate city, except for the first row, which is the "header" row (it only specifies the names of the columns; it doesn't actually contain any data). This is actually a very common data format referred to as a comma-separated values (it would technically be more appropriate to name the file <Code>data.csv</Code> instead of <Code>data.txt</Code> since <Code>.csv</Code> stands for comma-separated values, but we'll leave it as-is).</P>

      <P>Now, suppose we want to write a program that analyzes <Code>data.txt</Code> and prints out the name and population of the city with the greatest population. To accomplish that, our program will need to somehow extract each city's name and population from its corresponding line. For example, if we iterate through the lines of the file as before using something like <Code>for current_line in data_file:</Code>, then in any given iteration of the for loop, <Code>current_line</Code> will represent an entire line of text from the file, and we need some way of extracting the city name and population from that line of text.</P>

      <P>Some terminology: The process of analyzing and extracting data from a string is referred to as <Bold>string parsing</Bold> (to "parse" means to analyze into parts and describe those parts). An important part of string parsing is <Bold>tokenizing</Bold>, which means to split a string into smaller individual pieces of data called <Bold>tokens</Bold>. For example, the line of text <Code>'Corvallis,61993'</Code> has two tokens in it: <Code>'Corvallis'</Code>, and <Code>'61993'</Code>. Those tokens are separated by a <Bold>separator</Bold>, which in this case is a comma.</P>

      <P>Strings have a <Code>.split()</Code> method that makes tokenization easy. The <Code>.split()</Code> method accepts a single argument, which is another string specifying the separator (in this case, it should be a comma since the tokens are separated by commas in a given line of <Code>data.txt</Code>). The string is then split into a list of smaller substrings, broken up by each occurrence of the specified separator. For example, suppose <Code>current_line</Code> contains the text <Code>'Corvallis,61993'</Code>. Then <Code>current_line.split(',')</Code> will return a list containing two strings: <Code>['Corvallis', '61993']</Code>. Again, we use a comma (<Code>','</Code>) as the separator in this case because, in the data file, each column is separated by a comma. If each column was separated by, say, a hashtag (e.g., <Code>'Corvallis#61993'</Code>), then we would instead do <Code>current_line.split('#')</Code> to split it up.</P>

      <P>Let's put that together with our existing knowledge and write a program that finds and prints out information about the city with the greatest population from within <Code>data.txt</Code>:</P>

      <PythonBlock fileName="find_most_populated_city.py">{
`from typing import TextIO

def process_file(data_file: TextIO) -> None:
    max_population_so_far = 0

    # Keep track of the line number. This will help us skip the
    # header row
    line_number = 1
    for current_line in data_file:
        # We need to skip the header row since it doesn't actually
        # have any data in it. That is, only process lines 2 and on
        if line_number >= 2:
            # Strip the newline character from the end of the line
            current_line = current_line.strip()

            # Split the line into two smaller strings (tokens): one
            # containing the city name, and one containing the
            # population.
            tokens = current_line.split(',')

            # 'tokens' is a list containing two strings: the city name,
            # and the city population. Let's store these in two 
            # separate variables to make things easy. While we're at
            # it, let's convert the population to an integer variable
            # instead of a string (which would throw a ValueError if
            # the city's population is not specified as a whole number
            # in data.txt).
            current_city_name = tokens[0]
            current_city_population = int(tokens[1])

            # Check if the population is greater than any we have seen
            # so far (this would not have been possible if we hadn't
            # converted the second token to an integer via
            # type-casting)
            if current_city_population > max_population_so_far:
                # We found a new largest city in the file. Let's record
                # that
                max_population_so_far = current_city_population
                
                # We also need to keep track of the name of the largest
                # city so that we can print it at the end.
                name_of_largest_city = current_city_name

        # Increment line_number for the next iteration
        line_number += 1

    # The for loop is over. max_population_so_far should store the
    # population of the largest city, and name_of_largest_city
    # should store its name.
    print(f'Largest city: {name_of_largest_city}')
    print(f'Population: {max_population_so_far}')
        

def main() -> None:
    with open('data.txt', 'r') as data_file:
        process_file(data_file)

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Running the above program produces the following output, assuming <Code>data.txt</Code> is present in the working directory and contains the previously specified contents:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python find_most_populated_city.py 
Largest city: Portland
Population: 635749
`
      }</TerminalBlock>

      <SectionHeading id="file-output">File output</SectionHeading>
      
      <P>Just as data can be read from a file, data can also be written to a file. This is referred to as <Bold>file output</Bold>. If file input is akin to the concept of "loading" or "importing" a file, then file output is akin to the concept of "saving" or "exporting" a file.</P>

      <P>To write data to a file, you must first open it for writing. I've already shown you how to open a file for reading. You can open a file for writing in the exact same way, except you must pass <Code>'w'</Code> instead of <Code>'r'</Code> as the second argument to the <Code>open()</Code> function:</P>

      <PythonBlock fileName="file_output.py">{
`def main() -> None:
    with open('hello-world.txt', 'w') as cool_file:
        # TODO Write some interesting information into cool_file

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Once you have opened a file for writing, you can proceed to write data into it. Text file variables (e.g., <Code>TextIO</Code> variables, such as <Code>cool_file</Code> in the above program) have a <Code>.write()</Code> method that accepts a single string as an argument and writes that string into the file. You can think of the <Code>.write()</Code> method as being extremely similar to the <Code>print()</Code> function, but rather than the specified text being printed to the <It>terminal</It> (standard output), it's printed (written) into the <It>file</It> (file output). Let's update our example:</P>

      <PythonBlock fileName="file_output.py">{
`def main() -> None:
    with open('hello-world.txt', 'w') as cool_file:
        # Write the text "Hello, World!" into hello-world.txt
        cool_file.write('Hello, World!')

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Running the above program does not print anything to the terminal. However, it does automatically create a file named <Code>hello-world.txt</Code> (if it doesn't already exist) and populates it with the text <Code>Hello, World!</Code>:</P>

      <TerminalBlock copyable={false}>{
`(env) $ ls
data.txt       file_output.py               user_chooses_file.py
file_input.py  find_most_populated_city.py
(env) $ python file_output.py 
(env) $ ls
data.txt       file_output.py               hello-world.txt
file_input.py  find_most_populated_city.py  user_chooses_file.py
(env) $ cat hello-world.txt 
Hello, World!`
      }</TerminalBlock>

      <P>(Recall that the <Code>cat</Code> shell command can be used to display the contents of a file in the terminal)</P>

      <P>Besides the fact that the <Code>.write()</Code> method writes into a file rather than the terminal, there's one other very important difference: the <Code>.write()</Code> method does <Ul>not</Ul> automatically append a newline character sequence to the end of the written text. If you were to examine the contents of <Code>hello-world.txt</Code> very closely (e.g., with a text editor that can show hidden characters), you'd find that there's no newline character sequence ("enter character") at the end of the line of text.</P>

      <P>As a more concrete example, suppose our program used the <Code>.write()</Code> method twice in a row instead of just once:</P>

      <PythonBlock fileName="file_output.py">{
`def main() -> None:
    with open('hello-world.txt', 'w') as cool_file:
        # Write the text "Hello, World!" into hello-world.txt
        cool_file.write('Hello, ')
        cool_file.write('World!')

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Running the above program does the same thing as before<Emdash/>it produces a file named <Code>hello-world.txt</Code> (if it doesn't already exist) and populates it with a <Ul>single</Ul> line of text: <Code>Hello, World!</Code>. It does <Ul>not</Ul> put <Code>Hello, </Code> and <Code>World!</Code> on their own separate lines in the text file.</P>

      <P>That's fine, but that means that if you <It>want</It> to write two or more lines of text into the file (or even if you just want the file to have a single line of text that ends in a newline character sequence), you must manually embed each newline character sequence into the string arguments of the <Code>.write()</Code> method. Recall that a newline character sequence can be embedded into a string by using the <Code>{'\\n'}</Code> escape sequence:</P>

      <PythonBlock fileName="file_output.py">{
`def main() -> None:
    with open('hello-world.txt', 'w') as cool_file:
        # Write the following content into hello-world.txt:

        # Hello,
        # World

        cool_file.write('Hello,\\n')
        cool_file.write('World!\\n')

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Running the above program produces a file named <Code>hello-world.txt</Code> (if it doesn't already exist) and populates it with the following contents:</P>

      <TerminalBlock copyable={false}>{
`Hello,
World!
`
      }</TerminalBlock>

      <P>As you've seen, when the <Code>open()</Code> function is used to open a file for writing, it is <Ul>not</Ul> necessary for the file to already exist. If the file does not already exist, the <Code>open()</Code> function will simply create it (assuming it has the permissions to do so<Emdash/>if it doesn't, or if some other error occurs, it will fail and throw an <Code>OSError</Code>).</P>

      <P>Importantly, when the <Code>open()</Code> function is used to open a file for writing, but that file <It>does</It> already exist, <Ul>the entire contents of the existing file are automatically deleted</Ul>. Indeed, opening a file for writing always starts the file over from a clean slate (i.e., it "overwrites" the file's contents with new data).</P>
      
        <P>To prove it, let's first run the previous program several times in a row and then examine the contents of <Code>hello-world.txt</Code>:</P>

      <TerminalBlock copyable={false}>{
`(env) $ ls
data.txt       file_output.py               user_chooses_file.py
file_input.py  find_most_populated_city.py
(env) $ python file_output.py 
(env) $ python file_output.py 
(env) $ python file_output.py 
(env) $ python file_output.py 
(env) $ python file_output.py 
(env) $ cat hello-world.txt 
Hello,
World!
`
      }</TerminalBlock>

      <P>Notice: Even after running the program five times, <Code>hello-world.txt</Code> still only contains a single instance of the written text. This is because each run of the program overwrites the contents written by the previous run.</P>

      <P>This overwriting behavior occurs because, by default, files opened for writing are specifically opened in <Bold>truncate mode</Bold>. To avoid this behavior, you can instead open the file in <Bold>append mode</Bold>. This is done by passing <Code>'a'</Code> as the second argument to the <Code>open()</Code> function instead of <Code>'w'</Code>. Subsequent calls to the <Code>.write()</Code> method will then append text to the existing file rather than overwriting its contents from scratch.</P>

      <P>Let's create an alternative version of our program that opens the file in append mode instead of truncate mode:</P>

      <PythonBlock fileName="append.py" highlightLines="{2}">{
`def main() -> None:
    with open('hello-world.txt', 'a') as cool_file:
        # Write the following content into hello-world.txt:

        # Hello,
        # World

        cool_file.write('Hello,\\n')
        cool_file.write('World!\\n')

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Now let's see what happens when we run <It>this</It> program five times in a row:</P>

      <TerminalBlock copyable={false}>{
`(env) $ ls
append.py  file_input.py   find_most_populated_city.py
data.txt   file_output.py  user_chooses_file.py
(env) $ python append.py 
(env) $ python append.py 
(env) $ python append.py 
(env) $ python append.py 
(env) $ python append.py 
(env) $ cat hello-world.txt 
Hello,
World!
Hello,
World!
Hello,
World!
Hello,
World!
Hello,
World!
`
      }</TerminalBlock>

      <P>Notice: Each run of the program appends new data onto the end of the existing file's contents as left by the previous run of the program.</P>

      <P>And that's the gist of file I/O in Python as we'll use it in this course. There are many details to file I/O that I skipped over, but this should be good enough for our purposes.</P>

      <SectionHeading id="join">The <Code>join()</Code> method</SectionHeading>

      <P>(This isn't very closely related to file I/O, but you might find it to be helpful when formatting data into a string for file output).</P>

      <P>A string can be split into a list of smaller strings based on a specified token separator using the <Code>split()</Code> method, but a list of strings can also be joined back into a single large string separated by a specified token separator using the <Code>join()</Code> method. That is, the <Code>join()</Code> method is sort-of the inverse of the <Code>split()</Code> method.</P>

      <P>To use the <Code>join()</Code> method, first create a string containing the desired token separator. Then call the <Code>.join()</Code> method on it. As an argument to this method, pass a list of strings. It then returns a single large string containing all the smaller strings in the list concatenated together, separated by the token separator string.</P>
      
      <P>Here's an example:</P>

      <PythonBlock fileName="join.py">{
`def main() -> None:
    list_of_strings = ['the', 'quick', 'brown', 'fox']
    joined_string = ','.join(list_of_strings)
    print(joined_string) # Prints the,quick,brown,fox

    joined_string = '+-+'.join(list_of_strings)
    print(joined_string) # Prints the+-+quick+-+brown+-+fox

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Running the above program produces the following output:</P>

      <TerminalBlock copyable={false}>{
`$ python join.py 
the,quick,brown,fox
the+-+quick+-+brown+-+fox
`
      }</TerminalBlock>

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
