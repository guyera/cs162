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
      <P>This lecture will cover the following:</P>

      <Itemize>
        <Item><Link href="#exceptions">Exceptions</Link></Item>
        <Item><Link href="#catching-exceptions">Catching exceptions</Link></Item>
        <Item><Link href="#casting-strings-to-other-types">Casting strings to other types</Link></Item>
        <Item><Link href="#raising-exceptions">Raising exceptions</Link></Item>
        <Item><Link href="#throwing-vs-returning">Throwing vs returning</Link></Item>
        <Item><Link href="#debate-on-exceptions">(Optional content) Debate on exceptions</Link></Item>
      </Itemize>

      <SectionHeading id="exceptions">Exceptions</SectionHeading>
      
      <P>Suppose you want to write a function that can sometimes fail depending on what arguments are passed to it (or other context). For example, suppose you want to write a function <Code>log_base_10()</Code> that computes the base-10 logarithm of the given argument. The base-10 logarithm of 0 is undefined, so if 0 is passed as the argument, the function will fail.</P>

      <P>When a function fails (assuming it <It>can</It> fail), if the function itself can't handle the error, then it needs some way of communicating the error back to the call site (i.e., back to the function that called it) so that it can be handled elsewhere within the program. For example, <Code>log_base_10()</Code> probably can't handle the error in which zero is passed as an argument because the exact way that the error should be handled depends on the context in which it's called (e.g., should the error be logged to a file? Should a message printed to the terminal? Should a pop-up window appear indicating the error? Should the program crash? It all depends on the context, and the <Code>log_base_10()</Code> function isn't responsible for that context).</P>

      <P>So, how does a function communicate errors back to the call site? In some programming languages, the only idiomatic way of communicating errors is via return values or similar. For example, in the C programming language, it's common for a function to communicate errors by returning an integer representing an error code, such as 0 to represent success vs some nonzero value when an error occurs (the exact nonzero value would depend on the function and the kind of error that it encountered).</P>

      <P>This can be messy for various reasons. In the particular case of C (and most other statically typed languages), a function can only have one static return type, so when a function that can return an error <It>also</It> needs to be able to communicate <It>actual outputs</It> when they're successful, they either have to use some sort of "trick" to represent both of these things in a single return type (e.g., by wrapping the error code and the actual output as optionals in a structure, or by using a tagged union), or they have to use some other communication channel to communicate the non-error output (e.g., pointer parameters).</P>

      <P>The larger concern with communicating errors by returning error codes, though, is in representation and control flow. Return values, by nature, are ignorable<Emdash/>when you call a function that returns a value, you don't <It>have</It> to do anything with that value. By default, if the caller fails to acknowledge a return value of a function call, absolutely nothing happens; the program just moves on as if the function call didn't return anything to begin with:</P>

      <PythonBlock copyable={false}>{
`# Even if this function call returns something, we don't DO anything
# with its return value. But that's okay and even desired in some
# cases.
my_cool_function(1, 2, 3, 'Hello')

# The program just moves on as normal...`
      }</PythonBlock>

      <P>That's to say, return values are ignored by default. If you don't want a return value to be ignored, you must intentionally write the program in a way that <It>doesn't</It> ignore the return value. For example, you might store the return value in a variable for use later on (e.g., <Code>some_variable = my_cool_function(1, 2, 3, 'Hello')</Code>).</P>

      <P>But what about errors? If a function fails due to an error (e.g., <Code>log_base_10(0)</Code>), what do you want to happen by default? Do you really want <It>nothing</It> to happen by default? Perhaps in some cases, but in the vast majority of cases, you want your program to detect that an error has occurred and do something about it (e.g., correct the error if possible, print an error message / log the error for diagnostics, etc). But if your function uses return values (e.g., error codes) to communicate errors, then errors are ignored by default (since return values are ignored by default).</P>

      <P>To be clear, you <It>can</It> use return values to communicate errors, but it makes it easy to accidentally (or intentionally) ignore those errors when they occur, which leads to bugs. Many programming language developers were thinking about these issues as early as the 1960s, and some of their ideas culminated in a now-common language feature known as <Bold>exceptions</Bold>. Exceptions were first (?) introduced by Bjarne Stroustrup in the C++ programming language, though the idea built off of some other similar, earlier ideas (e.g., MacLisp's <Code>ERR</Code>, <Code>ERRSET</Code>, <Code>CATCH</Code>, and <Code>THROW</Code> mechanisms).</P>

      <P>An exception is an alternative to a return value. That's to say, a function can either a) return a value, or b) throw an exception. Doing either of these things ends the function immediately, jumping back to the call site (but what happens from there depends on which of those two things occurred). Return values are used to communicate normal, intended outputs, whereas exceptions are used to communicate that something went wrong (i.e., an exception occurred), preventing the function from computing and returning the normal / intended value (e.g., "I can't compute the logarithm of 0, so here's an exception instead").</P>

      <P>By default, when a return value is ignored, nothing happens. But by default, when an exception is ignored, the entire program crashes<Emdash/>usually printing a stack trace (or traceback) in the process, which makes diagnosing the error extremely easy. We've actually seen a few examples of this in past lectures (e.g., <Code>IndexError</Code> when indexing a list with an out-of-bounds index).</P>

      <P>But that's only what happens by default. As it turns out, it's possible to catch exceptions, handling them however you see fit. You can also throw your own exceptions. There's a lot of syntax surrounding exceptions, even in Python. Let's deal with the syntax one piece at a time.</P>

      <SectionHeading id="catching-exceptions">Catching exceptions</SectionHeading>
      
      <P>When a function call (or operator, etc) throws an exception, by default, the entire program crashes. To prevent this from happening, you can wrap the function call in a <Code>try</Code> block. The syntax is as follows:</P>

      <SyntaxBlock>{
`try:
    <try block body>
except <exception type> as <name>:
    <except block body>`
      }</SyntaxBlock>

      <P>Replace <Code>{'<try block body>'}</Code> with a block of code that you want your program to "try" to do (e.g., call some functions that might fail), acknowledging that an exception <It>might</It> be thrown in the process. Replace <Code>{'<exception type>'}</Code> with the type of exception that might be thrown during the try block body. Replace <Code>{'<name>'}</Code> with the name that you want to use to represent the exception variable (yes, exceptions are values and can be stored in variables). Finally, replace <Code>{'<except block body>'}</Code> with a block of code that you want your program to execute when an exception of the specified type is, indeed, thrown within the try block body (i.e., this is the block of code that "handles" the error after it has occurred).</P>

      <P>Here's an example to illustrate:</P>

      <PythonBlock fileName="try_except.py">{
`from traceback import print_exc

def main() -> None:
    best_numbers = [42, 7, 777, 24, 25]

    chosen_index = int(input('Which number would you like to see? '
        'For example, type "0" to see the first number, "1" to see '
        'the second number, and so on: '))

    try:
        # Try to do the following, knowing that an error might occur
        # in the process. NOTE: THIS EXAMPLE IS JUST TO DEMONSTRATE THE
        # SYNTAX OF EXCEPTIONS. I DO NOT ACTUALLY RECOMMEND THAT YOU
        # USE EXCEPTIONS FOR INDEX / BOUNDS CHECKING. READ THE REST
        # OF THIS SECTION CAREFULLY.
        print(f'The number you chose is: {best_numbers[chosen_index]}')

        # If chosen_index is not between 0 and 4,
        # best_numbers[chosen_index] will attempt to access an
        # element that doesn't exist, throwing an IndexError.
        # In such a case, this whole try block immediately ends, and
        # the program jumps to the except block down below.
    except IndexError as e:
        # If the try block above throws an IndexError at any point,
        # the program will jump to this except block. This is where
        # we "handle" the error (whatever that means, depending on
        # the context). In this case, we'll just tell the user that
        # that they entered an invalid index.
        print('Error: The index must be between 0 and 4, inclusive.')

        # The error (exception) itself is a value, and it's stored in
        # the variable e (that's what I named it on line 23 above---you
        # can name it whatever you want). e contains information about
        # the error that occurred. For example, you can print it to
        # the terminal, which prints a short message describing
        # the error:
        print()
        print(e)

        # You can also print its traceback via print_exc() (this can
        # only be done within an except block). print_exc is provided
        # by the traceback module (imported on line 1 above). This is
        # what would normally be printed if the program failed to catch
        # the exception and crashed as a result:
        print()
        print('Traceback:')
        print_exc()

    # Once the above try / except blocks are done executing, the
    # program continues normally from here. It does NOT simply crash /
    # end immediately.


if __name__ == '__main__':
    main()`
      }</PythonBlock>

      <P>Here's an example run wherein I supply a valid index:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python try_except.py 
Which number would you like to see? For example, type "0" to see the first number, "1" to see the second number, and so on: 1
The number you chose is: 7
`
      }</TerminalBlock>

      <P>And here's an example run wherein I supply an invalid index:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python try_except.py 
Which number would you like to see? For example, type "0" to see the first number, "1" to see the second number, and so on: 100
Error: The index must be between 0 and 4, inclusive.

list index out of range

Traceback:
Traceback (most recent call last):
  File "/home/alex/instructor/static-content/guyera.github.io/code-samples/exceptions/try_except.py", line 16, in main
    print(f'The number you chose is: {best_numbers[chosen_index]}')
`
      }</TerminalBlock>

      <P>If a single block of code is capable of throwing more than one kind of exception, you can have multiple <Code>except</Code> blocks, one for each kind of exception that might be thrown. The syntax looks like this:</P>

      <SyntaxBlock>{
`try:
    <try block body>
except <exception type 1> as <name 1>:
    <handle the exception>
except <exception type 2> as <name 2>:
    <handle the exception>`
      }</SyntaxBlock>

      <P>(And so on). Each of the exceptions can actually have the same name if you'd like (e.g., <Code>{'<name 1>'}</Code> and <Code>{'<name 2>'}</Code> can both be <Code>e</Code>, if that's what you want).</P>

      <P>To be clear, at most one of the above except blocks will be executed. If an exception of type <Code>{'<exception type 1>'}</Code> is thrown within the try block, then the first except block will be executed. If an exception of type <Code>{'<exception type 2>'}</Code> is thrown within the try block, then the second except block will be executed. If neither of these kinds of exceptions are thrown within the try block, then neither of the except blocks will be executed. This is why Mypy is okay with all of the exception variables having the same name.</P>

      <P>When the try block terminates normally (without throwing any exceptions), or when an except block is run to completion, the program then proceeds normally, continuing to execute whatever code appears after the last except block.</P>

      <P>Suppose you want to create a single except block that can catch any kind of exception. To do this, simply use <Code>Exception</Code> as the type of the exception that your except block catches:</P>

      <SyntaxBlock>{
`try:
    <try block body>
except Exception as e:
    <except block body>`
      }</SyntaxBlock>

      <P>In the above example, if the try block throws <It>any</It> kind of exception, the except block will be executed.</P>

      <P>Finally, suppose that a line of code throws an exception, but it's not capable of catching and handling that exception. For example, suppose that the line of code is inside a try block that has a single except block which is capable of catching an <Code>IndexError</Code>, but a <Code>ValueError</Code> is thrown instead. Or suppose that the line of code throwing the exception isn't inside a try block <It>at all</It>. I previously said that, by default, this causes the program to crash, printing a traceback to the terminal. But that's actually not <It>exactly</It> what happens. If an exception is thrown outside of a try block with an accompanying except block that's capable of catching the exception, the program doesn't <It>immediately</It> crash. Rather, it automatically <It>re-throws</It>, or <Bold>propagates</Bold>, the uncaught exception down the call stack. That's to say, the function in question re-throws the exception up to the function that called <It>it</It>. And if <It>that</It> function isn't capable of catching the exception, it will re-throw the exception up to the function that called <It>it</It>, and so on. This happens over and over again until, eventually the exception propagates all the way up to the module scope where call stack originated. If the module scope also isn't set up to catch the exception, <It>then</It> the program crashes.</P>

      <P>Here's an example:</P>

      <PythonBlock fileName="exceptions_propagate.py">{
`def c() -> None:
    the_list = ['hello']
    
    # Try to print the 100th element, which causes an IndexError
    # to be thrown. Since the below line of code isn't inside a
    # try block with an accompanying except block that's set up
    # to catch an IndexError, the exception will propagate to the
    # function that called THIS function.
    print(the_list[99])

def b() -> None:
    # Call c(), which will throw an IndexError. Since the below
    # line of code isn't inside a try block with an accompanying
    # except block that's set up to catch an IndexError, the
    # exception will propagate to the function that called THIS
    # function.
    c()

def a() -> None:
    # Call b(), which will throw an IndexError. Since the below
    # line of code isn't inside a try block with an accompanying
    # except block that's set up to catch an IndexError, the
    # exception will propagate to the function that called THIS
    # function.
    b()

def main() -> None:
    try:
        # Call a(), which will throw an IndexError. But here, we catch
        # it with the below except block.
        a()
    except IndexError as e:
        print('Exception caught!')

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Running the above program produces the following output:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python exceptions_propagate.py 
Exception caught!
`
      }</TerminalBlock>

      <P>If the <Code>main()</Code> function hadn't caught the exception, it would have propagated up one more time to the module scope (i.e., to the very last line of code in the program where the <Code>main()</Code> function was called). If <It>that</It> function call was wrapped in a try block with an accompanying except block that's set up to catch the index error, the program would catch it there instead. Only if the exception propagates all the way up to the module scope, and then <It>still</It> isn't caught within the module scope, does the program immediately crash (but if it was caught at the very end of the module scope, the program would immediately end after the except block is executed anyways).</P>

      <P>There is some other syntax surrounding try / except that you can use as well, but we won't discuss it. (For the curious reader, look up <Code>finally</Code> blocks and <Code>else</Code> blocks attached to try / except chains). </P>

      <P>In many cases, you can solve the same problem in two different ways: a) checking some condition before attempting an operation, or b) attempting the operation in a try block, catching an exception if the operation fails. In such cases, there's a simple rule of thumb: you should generally prefer option a). That is, if there's a simple way to check whether an operation will fail before attempting it, you should almost always prefer to simply put that operation in an if statement, attempting it only if you know that it will succeed, rather than putting it in a try block and catching the exception when it inevitably occurs. Indeed, this means that the above example violates this rule of thumb. Rather than using try and except, we could simply use an if statement to check whether the user's specified index is out of bounds. And, indeed, that's probably what we should have done. But in other cases where an exception is the only reasonable or idiomatic solution to the problem (e.g., when <Link href="#casting-strings-to-other-types">sanitizing user-input strings</Link> in Python), using exceptions is perfectly fine.</P>

      <P>For the curious reader, the reason for this rule of thumb will be discussed in <Link href="#debate-on-exceptions">an optional section shortly</Link>.</P>

      <SectionHeading id="casting-strings-to-other-types">Casting strings to other types</SectionHeading>

      <P>In Python, a very common use case for exceptions is sanitizing user input. For example, suppose you want to write a program that asks the user to enter an integer. But suppose that, when the user runs the program, they <It>don't</It> enter an integer<Emdash/>suppose that they enter something else entirely. As you know, the <Code>input()</Code> function returns the user's input as a string, which you can then type-cast into the desired type. But what you probably didn't know is that explicit type casts can throw exceptions. When you try to cast a string into an integer, it will throw a <Code>ValueError</Code> if the string does not actually contain text representing an integer. You can then catch that exception, scold the user, and reprompt (for example):</P>

      <PythonBlock fileName="sanitize_inputs.py">{
`def prompt_for_integer(prompt: str) -> int:
    supplied_valid_input = False
    while not supplied_valid_input:
        try:
            # If the user types in something other than an integer,
            # the int() type cast will fail and throw a ValueError,
            # jumping to the below except block. Otherwise, it will
            # continue on and set supplied_valid_input to True.
            chosen_integer = int(input(prompt))
            
            supplied_valid_input = True
        except ValueError as e:
            print('Error: You must enter an integer!')

            # Leave supplied_valid_input False, forcing the loop
            # to run again.

    # The while loop has ended, which must mean that the user supplied
    # an invalid input. Return it.
    return chosen_integer

def main() -> None:
    favorite_number = prompt_for_integer(
        'Enter your favorite whole number: '
    )

    if favorite_number == 42:
        print("You must be a fan of Hitchhiker's Guide to the Galaxy!")
    else:
        print('Ah, I see...')

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Here's an example run:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python sanitize_inputs.py 
Enter your favorite whole number: Hello, World!
Error: You must enter an integer!
Enter your favorite whole number: But what if I don't want to enter an integer?
Error: You must enter an integer!
Enter your favorite whole number: 1.5
Error: You must enter an integer!
Enter your favorite whole number: 42
You must be a fan of Hitchhiker's Guide to the Galaxy!
`
      }</TerminalBlock>

      <P>Notice that a <Code>ValueError</Code> is even thrown when the user types in <Code>1.5</Code>. This might surprise you. After all, it's perfectly okay to type-cast a <Code>float</Code> into an <Code>int</Code> (doing so truncates the value to produce a whole number, but it doesn't thrown an exception). While that's true, the exact rules vary by what type you're casting from and what type you're casting to. Although <Code>1.5</Code> (the float) can be type-casted into an <Code>int</Code> value, <Code>'1.5'</Code> (the string) cannot. Or, at least, not directly<Emdash/>you <It>could</It> type-cast it into a <Code>float</Code> and then type-cast <It>that</It> into an <Code>int</Code> (because <Code>'1.5'</Code> can be casted to a <Code>float</Code>, and <Code>float</Code> values can in general be type-casted into <Code>int</Code> values, truncating them in the process).</P>

      <P>And, although <Code>'1.5'</Code> cannot be directly type-casted into an <Code>int</Code> value, <Code>'42'</Code> (for example, or some other integer-containing string) <It>can</It> be directly type-casted into a float (or into an <Code>int</Code>, of course).</P>

      <P>I strongly recommend that you use the above <Code>prompt_for_integer()</Code> function (or similar) throughout all of your homework assignments and labs where you need to to prompt the user for a whole number. That's why I made the prompt itself a parameter<Emdash/>it can be reused for any assignment by simply switching the argument out for whatever message you want to be printed (feel free to use it as-is or modify it to your heart's content; you might also, for example, parameterize the error message rather than leaving it generic). I also recommend creating similar functions that prompt the user for other kinds of data.</P>

      <SectionHeading id="raising-exceptions">Raising exceptions</SectionHeading>
      
      <P>So, exceptions can be caught, but how are they <It>generated</It>? Where do they come from? For example, if you wanted to write your own function that explicitly throws an exception in a certain situation (i.e., without executing some <It>other</It> function that throws an exception, such as a bad type cast or out-of-bounds indexing operation), how can you accomplish that?</P>

      <P>Enter the <Code>raise</Code> keyword. To <Bold>raise</Bold> an exception means to be the first one to throw it (i.e., to throw an exception without it first being thrown and propagated from some deeper function call). Here's the syntax:</P>

      <SyntaxBlock>{
`raise <exception>`
      }</SyntaxBlock>

      <P>Replace <Code>{'<exception>'}</Code> with an exception value that you would like to raise.</P>

      <P>Of course, in order to do this, you need to know how to create exceptions. There are various kinds of built-in exceptions, such as <Code>IndexError</Code>, <Code>ValueError</Code>, and so on. You can also create your own kinds of exceptions, but you should prefer to use one of the built-in types if they're applicable to your situation (I'm also not going to show you how to create your own exception types, and it wouldn't make sense if I did until we've covered inheritance later on in the term; feel free to look it up if you're curious). To create an exception using one of the built-in exception types, simply write out the name of the type followed by a brief error message string enclosed in parentheses.</P>

      <P>Here's a somewhat contrived example:</P>

      <PythonBlock fileName="raise.py">{
`def base_10_log(value: float) -> float:
    if value == 0:
        # Cannot compute the log of 0. Raise a ValueError, immediately
        # throwing it back to the call site.
        raise ValueError('Cannot compute the log of 0!')

    # Otherwise, proceed to compute the log
    # (Computing the log of a value is actually not trivial. In
    # practice, you'd use the built-in math.log() function rather
    # than implementing this yourself. But just pretend that there's
    # some really cool, complicated code here that computes the
    # log of the given value, rather than the (wildly incorrect) return
    # statement below.)
    return 1000.0

def main() -> None:
    chosen_value = int(input('What value would you like to compute '
        'the log of?: '))
    
    try:
        # Try to compute the base-10 log, catching a ValueError
        # with the below except block if one is thrown
        answer = base_10_log(chosen_value)
    except ValueError as e:
        # A value error was thrown. Print its message to the terminal
        print(e)

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Here's an example run:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python raise.py 
What value would you like to compute the log of?: 0
Cannot compute the log of 0!
`
      }</TerminalBlock>

      <P>Notice that <Code>print(e)</Code> simply prints the exception's message, which is the very same message as the one that was provided between the parentheses when the <Code>ValueError</Code> was created within the <Code>base_10_log()</Code> function.</P>

      <P>Python has many types of built-in exceptions besides <Code>ValueError</Code>. <Link href="https://docs.python.org/3/library/exceptions.html#concrete-exceptions">Here's a complete list of built-in exception types and their purposes</Link>.</P>

      <SectionHeading id="throwing-vs-returning">Throwing vs returning</SectionHeading>

      <P>Throwing an exception out of a function (i.e., raising an exception, or calling another function that raises an exception, and not immediately catching it within the same function body) is an <Ul>alternative</Ul> to returning a value from a function. That is, any given function may terminate in one of three ways: 1) reaching the end of its control block (body); 2) returning a value; or 3) throwing an exception.</P>

      <P>(Technically, when a function reaches the end of its control block, it implicitly returns <Code>None</Code>. So 1) is actually a subset of 2).)</P>

      <P>If a function terminates by throwing an exception, then it does not return anything. Note that this is different from returning <Code>None</Code>. <Code>None</Code> is an actual object that can be returned. Throwing an exception does <It>not</It> cause the function to return the object <Code>None</Code>. Rather, it literally means the function does not return <It>anything</It> whatsoever.</P>

      <P>You might be surprised to hear that Mypy is okay with this. Ordinarily, Mypy is very strict about requiring functions with a given return type to always return something of that type. But the reason is simple: when an exception is thrown from a function call, it affects the program's control flow (i.e., the order of execution of various lines of code) differently from how a return value would. When a function returns a value, the program resumes at the call site (i.e., where the function was called from), replacing the function call itself with the return value. In contrast, when a function throws an exception, the program behaves quite differently: it proceeds to unwind the call stack until the exception is caught, as explained earlier. For example, when the <Code>raise</Code> operator is used to raise an exception, the interpreter checks whether the <Code>raise</Code> operator was used inside a <Code>try</Code> block with an accompanying <Code>except</Code> block that's capable of catching the raised exception. If so, it simply jumps to the <Code>except</Code> block and executes its body, and then it proceeds from there, executing whatever comes after the <Code>except</Code> block. But if not, then it throws (propagates) the raised exception to the call site (i.e., to the function that called the one that raised the exception). It then checks if that function call was inside a <Code>try</Code> block with an accompanying <Code>except</Code> block that's capable of catching the thrown exception. If so, it jumps to <It>that</It> <Code>except</Code> block, executes its body, and proceeds from there. But if not, it throws (propagates) the exception <It>further</It> down the call stack, back to the function that called <It>that</It> function, and so on. It continues doing this until either a) the exception is caught, or b) the exception is propagated all the way out of global / module scope, at which point the program crashes and prints a traceback.</P>

      <P>Because of the way that exceptions affect the program's control flow, when a function throws an exception, its return value is completely unnecessary. After all, the point of a return value is to be substituted into the function call expression at the call site. But if a function terminates by throwing an exception, then the call site never gets a chance to evaluate the function call expression <It>anyways</It>; it immediately jumps to an <Code>except</Code> block or propagates the exception down the call stack.</P>

      <P>Consider this example:</P>

      <PythonBlock fileName="raisenotreturn.py">{
`from traceback import print_exc

def cool_function(x: int) -> int:
    if x == 1:
        return 100
    elif x == 2:
        return 1000
    
    raise ValueError(f'x must be either 1 or 2, but got {x}')

def main() -> None:
    # Prints 100
    print(cool_function(1))

    # Prints 1000
    print(cool_function(2))
    
    try:
        # Never gets a chance to print anything. It raises an
        # exception, which gets thrown here to main(). It then
        # immediately jumps to the except block below.
        print(cool_function(3))
    except ValueError as e:
        print("cool_function(3) failed. Here's the traceback: ")
        print_exc()

    # Also never gets a chance to print anything. It raises an
    # exception, which gets thrown here to main(). But we don't
    # catch it here, so it gets propagated down the call stack
    # (in this case, it's never caught, so the program crashes).
    print(cool_function(4))
    

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Running the above program produces the following output:</P>

      <TerminalBlock copyable={false}>{
`$ python raisenotreturn.py 
100
1000
cool_function(3) failed. Here's the traceback: 
Traceback (most recent call last):
  File "/nfs/stak/users/guyera/instructor/static-content/guyera.github.io/code-samples/cs162/exceptions/raisenotreturn.py", line 22, in main
    print(cool_function(3))
  File "/nfs/stak/users/guyera/instructor/static-content/guyera.github.io/code-samples/cs162/exceptions/raisenotreturn.py", line 9, in cool_function
    raise ValueError(f'x must be either 1 or 2, but got {x}')
ValueError: x must be either 1 or 2, but got 3
Traceback (most recent call last):
  File "/nfs/stak/users/guyera/instructor/static-content/guyera.github.io/code-samples/cs162/exceptions/raisenotreturn.py", line 35, in <module>
    main()
  File "/nfs/stak/users/guyera/instructor/static-content/guyera.github.io/code-samples/cs162/exceptions/raisenotreturn.py", line 31, in main
    print(cool_function(4))
  File "/nfs/stak/users/guyera/instructor/static-content/guyera.github.io/code-samples/cs162/exceptions/raisenotreturn.py", line 9, in cool_function
    raise ValueError(f'x must be either 1 or 2, but got {x}')
ValueError: x must be either 1 or 2, but got 4
`
      }</TerminalBlock>

      <P>Pay close attention to the code comments. When a value other than <Code>1</Code> or <Code>2</Code> is passed to <Code>cool_function()</Code>, it throws an exception, which is either caught at the call site or propagated down the call stack. In either case, the function call is never fully evaluated, and its value is never printed. For example, <Code>print(cool_function(3))</Code> doesn't actually get a chance to print anything whatsoever; the <Code>cool_function(3)</Code> call throws an exception, altering the program's control flow before the enclosing <Code>print()</Code> function call gets a chance to start. The same goes for <Code>print(cool_function(4))</Code> (but in that case, the entire program crashes).</P>

      <P>This is why throwing an exception is an <Ul>alternative</Ul> to returning a value. If an exception is thrown out of a function, then it never gets a chance to return anything. And that's okay since its return value will never get a chance to be used at the call site anyways.</P>

      <P>And indeed, Mypy is okay with this. Even though <Code>cool_function()</Code> is annotated as having a return type of <Code>int</Code>, it doesn't actually return an <Code>int</Code> when <Code>x</Code> is anything other than <Code>1</Code> or <Code>2</Code>. But since it throws an exception in all other cases, Mypy doesn't complain:</P>

      <TerminalBlock copyable={false}>{
`$ mypy raisenotreturn.py 
Success: no issues found in 1 source file
`
      }</TerminalBlock>

      {/*TODO Expand on the previous paragraph.*/}

      <SectionHeading id="debate-on-exceptions">(Optional content) Debate on exceptions</SectionHeading>

      <P>There's a lot of debate within the software engineering community surrounding exceptions. I'd be remiss if I didn't mention it.</P>

      <P>First of all, I mentioned a rule of thumb earlier: if you can detect that an error will occur using an if statement, that should be preferred over simply executing the operation in a try block and catching the error with an except block.</P>

      <P>There are a few reasons for this rule of thumb. The main reason is performance. If statements are simple, and computers are very good at evaluating and interpreting them. On the other hand, try, except, and <Code>raise</Code> are much more complicated. They require your computer to accrue exception information, propagate it down the call stack (also called "stack unwinding"), detect whether a given except block is capable of handling the thrown exception, and many other minute details that we won't talk about. Moreover, if the error can be anticipated early using an if statement rather than caught when it occurs using try / except, the program can often avoid several unnecessary operations.</P>

      <P>Another (weaker) reason is philosophical: many people say that exceptions should only ever be thrown in exceptional circumstances. These people often say that simple, common errors (e.g., user errors) should be handled by if statements instead. A similar philosophy states that exceptions should only handle programming errors (e.g., for development and debugging purposes)<Emdash/>not user errors or other runtime errors.</P>

      <P>All that being said, even the performance issue usually isn't a practical concern, and much of this debate is probably bikeshedding. Python 3.11 and C++, for example, both implement zero-cost exception handling, meaning that exceptions are only slower than if statements (to a degree that might matter) when an exception is <It>actually</It> thrown, so unless exceptions are being thrown hundreds or thousands of times per second (which is almost never the case when this debate comes up), it likely makes no difference whether you use try/except vs an if statement, and spending energy thinking about it is likely premature optimization.</P>

      <P>Still, there's no real reason <It>not</It> to follow this rule of thumb. It just doesn't matter as much as some people think it does.</P>

      <P>There's a lot more to the debate, though. Some people say that exceptions are inherently problematic and wish that programming languages did not support them at all. Their argument usually has to do with control flow and transparency: if any function can throw any exception at any time, then any function call can result in any exception being thrown, and that can affect the program's control flow in complicated ways. This makes it hard to track and understand a program's control flow. Consider the following simple example:</P>

      <PythonBlock copyable={false} showLineNumbers={false}>{
`def main():
    foo()
    bar()`
      }</PythonBlock>

      <P>Without carefully analyzing the <Code>foo()</Code> function's documentation, you have no way of knowing whether the above program will even <It>execute</It> the <Code>bar()</Code> function. Indeed, if the <Code>foo()</Code> function returns (terminates normally), then the <Code>bar()</Code> function will be executed in turn. But if the <Code>foo()</Code> function throws an exception, the program will suddenly start doing something else entirely<Emdash/>the <Code>main()</Code> function, which is not equipped with a try/except mechanism to catch and handle the exception, will propagate it further down the call stack until it's eventually caught. Perhaps that's fine, but that control flow<Emdash/>that manner in which the program moves from one instruction to the next<Emdash/>is not transparent. That's to say, looking at the above code, it seems reasonable to assume that it will execute <Code>foo()</Code> followed by <Code>bar()</Code>, but exceptions break this assumption. The fact that Python supports exceptions <It>at all</It> means there's no saying what the above program will do unless you're <It>certain</It> about whether <Code>foo()</Code> will or will not throw an exception. And you can't be certain of that without looking at the <Code>foo()</Code> function's documentation (assuming its exceptions are documented to begin with<Emdash/>hopefully they are!).</P>

      <P>Of course, as in all good debates, there's a counterargument: exceptions are part of a function's interface, meaning that if you don't know what kinds of exceptions a function might throw, then you have no business calling that function whatsoever. For reference, a function's name, parameters and return type are also a part of its interface. You clearly can't call a function without knowing these things, and types of exceptions that the function might throw are no different.</P>
      
      <P>Still, knowing what types of exceptions the <Code>foo()</Code> function might throw does not inherently make the above code's control flow "transparent". Just looking at the above code in isolation, there's no syntax that would suggest that the <Code>bar()</Code> function might not be executed. To figure that out, you'd have to look elsewhere. And that's precisely the issue: you must look at the <Code>foo()</Code> function's documentation in order to understand the control flow of the <Code>main()</Code> function.</P>

      <P>To some people, control flow should be obvious and transparent, and this is a very big deal. To others, the advantage of exceptions<Emdash/>of separating actual outputs and errors into two distinct communication channels that are each dealt with in different ways by default<Emdash/>outweighs their disadvantages.</P>

      <P>Lastly, some people believe that exceptions are particularly problematic in programming languages that do not require them to be a part of the static type signatures of functions. For example, when creating a function in Python, you must annotate its return type, or else Mypy will generate errors (at least when run in strict mode). However, you <It>don't</It> need to annotate the types of exceptions that it might throw. So the argument goes: if the exceptions that a function might throw are a part of its interface, then they ought to be subject to static analysis like the rest of the function's interface. Yet, for complicated reasons (some of which are historical), lots of programming languages (including Python + Mypy) do not consider exception types to be a part of a function's type signature, so they don't support static analysis of exceptions in basically any way. The same is true in C++, the first language to popularize exceptions.</P>

      <P>Terminology: exceptions that are not annotated in a function's static type signature are sometimes called <Bold>unchecked exceptions</Bold>, whereas exceptions that are annotated in a function's type signature and subject to static analysis are called <Bold>checked exceptions</Bold>. Python and C++ do not support checked exceptions<Emdash/>only unchecked exceptions.</P>

      <P>Some other languages do support checked exceptions with rigorous static analysis (e.g., Java, where exceptions are deeply engrained into the language, and you have no choice but to think about them all the time... Though it still doesn't solve the problem completely).</P>

      <P>Various error-handling mechanisms have appeared in other programming languages (especially newer ones), partly in response to this debate (see, e.g., Rust's <Code>match</Code> feature). But they all have their pros and cons.</P>
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
