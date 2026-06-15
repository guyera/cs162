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
        <Item><Link href="#bottom-up-implementation">Bottom-up implementation</Link></Item>
        <Item><Link href="#assertions">Assertions</Link></Item>
        <Item><Link href="#tdd">Test-Driven Development (TDD)</Link></Item>
        <Item><Link href="#pytest">Pytest</Link></Item>
        <Item><Link href="#tdd-example">TDD Example</Link></Item>
      </Itemize>

      <SectionHeading id="bottom-up-implementation">Bottom-up implementation</SectionHeading>

      <P>We've talked about top-down design, but what about implementation? As it turns out, large software products are commonly implemented <Bold>bottom-up</Bold>.</P>

      <P>Bottom-up implementation is exactly as it sounds: when implementing a software design model, you start with the lower-level details and slowly work your way up to the high-level abstractions one component at a time. For example, in <Link href={`${PARENT_PATH}/${allPathData["top-down-design"].pathName}`}>our lecture on top-down design</Link>, we constructed a software design model for a function that computes the number of days between two dates. One of the "low-level" components in that design model was the <Code>is_leap_year</Code> component, which determines whether a given year <Code>y</Code> is a leap year. Here's the pseudocode again for your convenience:</P>

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
        return false # Not divisible by 4`
      }</SyntaxBlock>

      <P>This component is a "low-level" component in that it does not depend on many other complicated components. Importantly, this means that it can be implemented and <Bold>tested</Bold> in isolation. Indeed, we can implement this component and test it, verifying that it works correctly, without needing to implement any other components beforehand.</P>

      <P>Let's do that. A reasonable Python implementation of this component might look like the following:</P>

      <PythonBlock showLineNumbers={false}>{
`# Determines whether a given year is a leap year
def is_leap_year(y: int) -> bool:
    if y % 4 == 0:
        if y % 100 == 0 and y % 400 != 0:
            return False
        else:
            return True
    else:
        return False
`
      }</PythonBlock>

      <P>Notice that this implementation looks very similar to the previous design component. It's just written in Python instead of pseudocode. Believe it or not, design is supposed to be much, much harder than implementation. Implementation is supposed to be a simple translation effort<Emdash/>translating the design model into code. If you find the design phase to be easy and the implementation phase to be hard, then there's a good chance that you did not spend enough time on design. The whole point of the design phase is to get the hard work done<Emdash/>to figure out the high-level logic (i.e., semantics) before investing a ton of effort into code (i.e., syntax).</P>

      <P>As I hinted a moment ago, a big advantage of bottom-up implementation is that it allows continuous, iterative <Bold>testing</Bold> of components as they're implemented. Indeed, because the above component is "low-level" and does not depend on any other unwritten components, there's no reason that I can't immediately test it in isolation, verifying that it does what it's supposed to do:</P>

      <PythonBlock fileName="daysbetweendates.py">{
`# Determines whether a given year is a leap year
def is_leap_year(y: int) -> bool:
    if y % 4 == 0:
        if y % 100 == 0 and y % 400 != 0:
            return False
        else:
            return True
    else:
        return False

def main() -> None:
    # Test the is_leap_year() function.

    # Arrange: Arrange the inputs for our test cases
    year_not_divisible_by_4 = 2003 # Not a leap year
    year_divisible_by_100_but_not_400 = 2100 # Not a leap year
    year_divisible_by_400 = 2000 # Leap year
    year_divisible_by_4_but_not_100 = 2024 # Leap year

    # Act: Run the is_leap_year() function on our inputs, collecting
    # the outputs
    year_not_divisible_by_4_result = \\
        is_leap_year(year_not_divisible_by_4)
    year_divisible_by_100_but_not_400_result = \\
        is_leap_year(year_divisible_by_100_but_not_400)
    year_divisible_by_400_result = \\
        is_leap_year(year_divisible_by_400)
    year_divisible_by_4_but_not_100_result = \\
        is_leap_year(year_divisible_by_4_but_not_100)

    # Assert: Verify that the outputs of the Act phase are what
    # they're supposed to be, raising an exception otherwise
    if year_not_divisible_by_4_result == True:
        raise Exception(f'{year_not_divisible_by_4} is not a leap '
            'year, but is_leap_year() returned True')
    if year_divisible_by_100_but_not_400_result == True:
        raise Exception(f'{year_divisible_by_100_but_not_400} is not '
            'a leap year, but is_leap_year() returned True')
    if year_divisible_by_400_result == False:
        raise Exception(f'{year_divisible_by_400} is a leap year, '
            'but is_leap_year() returned False')
    if year_divisible_by_4_but_not_100_result == False:
        raise Exception(f'{year_divisible_by_4_but_not_100} is a '
            'leap year, but is_leap_year() returned False')

    # If the program is still running, then no exceptions occurred.
    # That means all the test cases passed.
    print('Success. All test cases passed')


if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>The above tests are referred to as <Bold>automated tests</Bold>. An automated is code that, when executed, tests <It>other</It> code, verifying that it works properly.</P>

      <P>I chose to follow the <Bold>Arrange-Act-Assert (AAA)</Bold> pattern of automated testing. This is a very common pattern; its goal is to clearly separate and distinguish the setup / configuration (arrange), execution (act), and verification (assert) phases of one or more software tests. And, indeed, the above tests are written in three phases: first arrange, then act, then assert.</P>

      <P>Running the above program currently produces the following output:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python daysbetweendates.py 
Success. All test cases passed
`
      }</TerminalBlock>

      <P>This means one of two things: a) our component and tests both work correctly, or b) or component does not work correctly, but its potential mistakes are not correctly detected by the tests. Of course, situation a) would be preferred, which is why it's important that your tests are fairly simple but also fairly thorough. They should be simple so as to minimize the chance of bugs in the tests themselves, and they should be thorough so as to detect various kinds of possible mistakes in the component.</P>

      <P>Just to illustrate a point, suppose that I had made a mistake when implementing (or designing) the component. For example, suppose I accidentally omitted the if statement that checks to see whether <Code>y</Code> is divisible by 100 but not 400:</P>

      <PythonBlock fileName="daysbetweendates.py">{
`# Determines whether a given year is a leap year
def is_leap_year(y: int) -> bool:
    if y % 4 == 0:
        return True
    else:
        return False

... # Testing code is the same as before. Omitted for brevity`
      }</PythonBlock>

      <P>Our tests, which are both simple and thorough, are capable of detecting this mistake:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python daysbetweendates.py 
Traceback (most recent call last):
  File "/home/alex/instructor/static-content/guyera.github.io/code-samples/bottom-up-implementation/daysbetweendates.py", line 59, in <module>
    main()
    ~~~~^^
  File "/home/alex/instructor/static-content/guyera.github.io/code-samples/bottom-up-implementation/daysbetweendates.py", line 44, in main
    raise Exception(f'{year_divisible_by_100_but_not_400} is not '
        'a leap year, but is_leap_year() returned True')
Exception: 2100 is not a leap year, but is_leap_year() returned True
`
      }</TerminalBlock>

      <P>As intended, the tests raise an exception with a clear diagnostic printout: 2100 is not a leap year, but is_leap_year() returned True. Not only does this tell us that there was a fault (the <Code>is_leap_year()</Code> function produced the wrong output), but it tells us the context in which the fault occurred (2100 is passed as the argument to <Code>is_leap_year</Code>), which helps us understand and diagnose the error (mistake) that led to the fault. Heck, the printout even gives us a traceback, pointing us to line 44 of <Code>daysbetweendates.py</Code>, allowing us to dig more deeply into the context if we need to.</P>

      <SectionHeading id="assertions">Assertions</SectionHeading>

      <P>Before we discuss theory of software testing, let's discuss a very helpful testing tool supported by many testing frameworks and / or programming languages: <Bold>assertions</Bold>. An assertion is a statement in a program that requires a certain condition to be true. If the asserted condition is false, then the test immediately fails, and the testing framework or interpreter will print a useful diagnostic message to the terminal stating which assertion failed and in what context.</P>

      <P>In many programming languages and testing frameworks, assertions work via exceptions. For example, in Python, there's a built-in <Code>assert</Code> keyword. Its syntax is <Code>assert {'<condition>'}, {'<message>'}</Code>. Replace <Code>{'<condition>'}</Code> with a boolean expression, and replace <Code>{'<message>'}</Code> with an optional string representing an error message. If the given condition evaluates to <Code>True</Code>, it does literally nothing. However, if it evaluates to <Code>False</Code>, it automatically raises an <Code>AssertionException</Code>, and the provided error message becomes the message associated with the raised exception (i.e., when the exception's traceback is printed to the terminal, the error message is included in that traceback). The message is optional (it can be omitted). If none is provided, then no special exception messages are included in the traceback (but the traceback itself is still printed).</P>

      <P>Let's rewrite our testing code from the previous section using the <Code>assert</Code> keyword instead of raising exceptions manually:</P>

      <PythonBlock fileName="daysbetweendates.py">{
`# Determines whether a given year is a leap year
def is_leap_year(y: int) -> bool:
    if y % 4 == 0:
        return True
    else:
        return False

def main() -> None:
    # Test the is_leap_year() function.

    # Arrange: Arrange the inputs for our test cases
    year_not_divisible_by_4 = 2003 # Not a leap year
    year_divisible_by_100_but_not_400 = 2100 # Not a leap year
    year_divisible_by_400 = 2000 # Leap year
    year_divisible_by_4_but_not_100 = 2024 # Leap year

    # Act: Run the is_leap_year() function on our inputs, collecting
    # the outputs
    year_not_divisible_by_4_result = \\
        is_leap_year(year_not_divisible_by_4)
    year_divisible_by_100_but_not_400_result = \\
        is_leap_year(year_divisible_by_100_but_not_400)
    year_divisible_by_400_result = \\
        is_leap_year(year_divisible_by_400)
    year_divisible_by_4_but_not_100_result = \\
        is_leap_year(year_divisible_by_4_but_not_100)

    # Assert: Verify that the outputs of the Act phase are what
    # they're supposed to be, raising an exception otherwise
    assert year_not_divisible_by_4_result == False,\\
        (f'{year_not_divisible_by_4} is not a leap year, but '
            'is_leap_year() returned True')
    assert year_divisible_by_100_but_not_400_result == False,\\
        (f'{year_divisible_by_100_but_not_400} is not a leap year, '
            'but is_leap_year() returned True')
    assert year_divisible_by_400_result == True,\\
        (f'{year_divisible_by_400} is a leap year, but '
            'is_leap_year() returned False')
    assert year_divisible_by_4_but_not_100_result == True,\\
        (f'{year_divisible_by_4_but_not_100} is a leap year, but '
            'is_leap_year() returned False')

    # If the program is still running, then no exceptions occurred.
    # That means all the test cases passed.
    print('Success. All test cases passed')


if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Note: If the condition and message are long and you'd rather not put it all into a single line of code, you can split them into two lines, but you must place a backslash (<Code>{'\\'}</Code>) character at the very end of the first lines. This is similar to how you might break up an import statement that imports several components from a single package or module.</P>

      <P>Notice that our component is still broken, so some of the above tests should still fail as before. Indeed, they do, but the printout looks slightly different:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python daysbetweendates.py 
Traceback (most recent call last):
  File "/home/alex/instructor/static-content/guyera.github.io/code-samples/bottom-up-implementation/daysbetweendates.py", line 60, in <module>
    main()
    ~~~~^^
  File "/home/alex/instructor/static-content/guyera.github.io/code-samples/bottom-up-implementation/daysbetweendates.py", line 44, in main
    assert year_divisible_by_100_but_not_400_result == False,\\
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
AssertionError: 2100 is not a leap year, but is_leap_year() returned True
`
      }</TerminalBlock>

      <P>It's mostly the same, but now it prints an <Code>AssertionError</Code> rather than a general <Code>Exception</Code>. The testing code is also more idiomatic; you should prefer to use <Code>assert</Code> rather than raising exceptions manually when writing software tests.</P>

      <SectionHeading id="tdd">Test-Driven Development (TDD)</SectionHeading>

      <P>There's a philosophy in software engineering known as <Bold>Test-Driven Development (TDD)</Bold>. TDD specifies a software development lifecycle that's driven by automated software tests. It's usually performed bottom-up and goes something like this:</P>

      <Enumerate listStyleType="decimal">
        <Item><P>Write a single small software test for a single behavior of the system that you have <Ul>not</Ul> yet implemented. Following the goals of bottom-up implementation, you should select a behavior that does <Ul>not</Ul> depend on any other currently unimplemented behaviors / components. Because the behavior has not yet been implemented, this test should currently fail when executed (e.g., it should raise an assertion error, or similar).</P></Item>
        <Item><P>Complete <It>just enough</It> implementation of the behavior so that it passes the previously written test, <Ul>without</Ul> breaking any of the existing tests.</P></Item>
        <Item><P>Zoom out and look at the system at a broader level. Are there ways that you can <Bold>refactor</Bold> / rewrite some of the existing implementation, perhaps to improve readability or maintainability? If so, do that now. Importantly, this step should not change the semantics of the system; refactoring means to improve the code itself without changing what it actually <It>does</It>. All tests should still be passing at this point.</P></Item>
        <Item><P>Repeat from step 1 until the software system is complete.</P></Item>
      </Enumerate>

      <P>Technically, TDD is a bit broader than this. What I've just described is actually the core development cycle within TDD known as <Bold>Red-Green-Refactor</Bold>. It's named this because after step 1, the newly written test will fail (i.e., the codebase is "red"); after step 2, the newly written test will pass (i.e., the codebase is "green" again); and after step 3, the code has been refactored (if necessary) back up to the team's standards.</P>

      <P>The main idea of TDD is that the first step is to write a test, and the <It>second</It> step is to implement the relevant behavior such that the test passes. This forces the developer to think about how they can verify that the system works correctly before actually implementing the system.</P>

      <P>This is helpful for a lot of reasons. For one, it provides natural goalposts; assuming that your tests are simple and thorough, you can be confident that you're done implementing a component (and that it works correctly) when all the tests pass. Second, it forces you to think about testing <It>whatsoever</It>. There's a natural overconfidence among many software engineers; they write a thousand lines of code, and the moment it passes static analysis (e.g., Mypy, or some other linter / compiler / etc), they try to deploy it to production without any thorough testing. Major bugs are discovered later, but perhaps they've already costed the company millions of dollars by that point (e.g., in lost users, unnecessary computing resources, etc). Third, TDD inherently revolves around automated testing, which is valuable in its own right (automated testing refers to software / code that tests other software / code, as opposed to relying on dedicated employees spending time testing the software manually).</P>

      <P>Of course, before you can write an automated test, you at least need to understand the interface of the component or feature that you're going to be implementing and testing. For example, if you're writing a test for the <Code>is_leap_year()</Code> function before you've implemented it (as in the spirit of TDD), that's great, but you at least need to know what name it's going to have (<Code>is_leap_year()</Code>, the types and semantics of its parameters, and the type and semantics of its return value. After all, the test will surely need to call the <Code>is_leap_year()</Code> function in order to verify that it works correctly, which requires knowing all these things. Luckily, if you practice top-down design prior to implementation, then you should have already figured out these interface details.</P>

      <SectionHeading id="pytest">Pytest</SectionHeading>
      
      <P>We'll practice TDD in a moment, but first we'll need to take a detour and talk about testing frameworks.</P>

      <P>Automated tests should generally be committed to version control. That's to say, you should not delete them once they pass<Emdash/>they should become a semipermanent part of your system, committed to your VCS (e.g., Git) repository just like the components that they exist to test. That way, if you or another developer ever accidentally changes the system in the future in a way that breaks an existing component or feature, the tests that were created during that component's / feature's initial development may still be able to detect the mistake immediately. That's to say, an automated test only needs to be written once, but it can (and should) be run countless times throughout the software product's entire lifetime, serving as a sort of protection against certain kinds of mistakes.</P>

      <P>There's an important implication here. A large system will consist of many components and features, and each of those components / features will need one or more tests to verify that it works correctly. All of those tests will need to be kept around semipermanently, maintained as a part of the system. Currently, we've put all our tests in the <Code>main()</Code> function, but that's clearly not sustainable. Eventually, our <Code>main()</Code> function will need to actually run the <It>program</It> rather than the <It>tests</It>, so we can't keep putting all our tests there. We need some other way to organize our tests.</P>

      <P>This is where <Bold>testing frameworks</Bold> come in handy. A testing framework is a set of software tools (e.g., libraries / packages / modules, execution scripts / command-line utilites, etc), that make it easier to organize and execute your automated tests. There are many testing frameworks for Python, but perhaps the most common one is <Link href="https://docs.pytest.org/en/stable/">Pytest</Link>.</P>

      <P>Pytest is a large, complicated testing framework, but we'll only be using it in a very basic capacity for this course. First, in your virtual environment, install the <Code>pytest</Code> package like so:</P>

      <TerminalBlock>{
`pip install pytest`
      }</TerminalBlock>

      <P>The next step is to create a Python module (file ending in <Code>.py</Code>) whose name starts with <Code>test_</Code>. This will be a test script, meaning it's where we'll write one or more of our automated tests. The tests themselves will be written into functions whose names start with the prefix <Code>test</Code> (Pytest requires you to follow all these naming conventions to support its test autodiscovery feature).</P>

      <P>Let's practice this by moving our previously written tests into a dedicated test script:</P>

      <PythonBlock fileName="test_is_leap_year.py">{
`# Must import this function so that we can test it
from daysbetweendates import is_leap_year

# Test cases are functions whose names start with the word 'test'.
# A single test case should generally verify a single, small property
# of the component / feature that you're testing. That is, each test
# case should be very simple. The name of the test case's function
# should clearly indicate what property it aims to verify. For example,
# This test case will verify that the is_leap_year() function correctly
# returns False when given a year that is not divisible by 4. Hence,
# its name is test_year_indivisible_by_4_is_not_leap_year
def test_year_indivisible_by_4_is_not_leap_year() -> None:
    # Arrange: Arrange the inputs for our test cases
    y = 2003 # Not a leap year

    # Act: Run the is_leap_year() function on our inputs, collecting
    # the outputs
    result = is_leap_year(y)

    # Assert: Verify that the outputs of the Act phase are what
    # they're supposed to be, raising an exception otherwise
    assert result == False

def test_year_divisible_by_100_but_not_400_is_not_leap_year() -> None:
    # Arrange
    y = 2100 # Not a leap year

    # Act
    result = is_leap_year(y)

    # Assert
    assert result == False

def test_year_divisible_by_400_is_leap_year() -> None:
    # Arrange
    y = 2000 # Leap year

    # Act
    result = is_leap_year(y)

    # Assert
    assert result == True

def test_year_divisible_by_4_but_not_100_is_leap_year() -> None:
    # Arrange
    y = 2024 # Leap year

    # Act
    result = is_leap_year(y)

    # Assert
    assert result == True
`
      }</PythonBlock>

      <P>This test script serves to test the <Code>is_leap_year()</Code> function. I've moved all of our previous tests into this script. Notice that each test case is now given its own function. You'll see why this is important in a moment. You might also notice that the <Code>assert</Code> statements no longer provide messages. I could have left the messages in if I wanted to, but I took them out because I feel that the names of the test cases' respective functions are sufficiently descriptive, and the test cases themselves are sufficiently simple, that I'll have no problem figuring out what error has occurred when an assertion fails.</P>

      <P>Our <Code>daysbetweendates.py</Code> module now looks like this (I've deleted the <Code>main()</Code> function entirely, leaving only the <Code>is_leap_year()</Code> function):</P>

      <PythonBlock fileName="daysbetweendates.py">{
`# Determines whether a given year is a leap year
def is_leap_year(y: int) -> bool:
    if y % 4 == 0:
        return True
    else:
        return False
`
      }</PythonBlock>

      <P>This function is still broken from the change that I made earlier, so our tests should still fail. But how do we run them?</P>

      <P>Well, if you've set everything up correctly, then Pytest makes running tests very easy. When you installed <Code>pytest</Code> via Pip, it came with a command-line utility. You can invoke it by simply typing <Code>pytest</Code> into your terminal and pressing enter. Pytest will then search through your working directory (and all directories inside your working directory, and directories inside those directories, and so on) for any and files starting with <Code>test_</Code> and ending in <Code>.py</Code>. In this case, it will discover <Code>test_is_leap_year.py</Code>. In each of those discovered test scripts, it will search for any and all functions whose names start with the word <Code>test</Code>. Finally, it will automatically execute those functions. If those functions raise any exceptions (e.g., an <Code>AssertionError</Code>), then it will catch those exceptions and print some neat diagnostic information to the terminal. In particular, it will tell you which test cases failed, and it will print out the actual source code of that test case, highlighting the line of code that raised the exception:</P>

      <TerminalBlock copyable={false}>{
`(env) $ pytest
=============================== test session starts ================================
platform linux -- Python 3.13.5, pytest-8.4.1, pluggy-1.6.0
rootdir: /home/alex/instructor/static-content/guyera.github.io/code-samples/bottom-up-implementation
collected 4 items                                                                  

test_is_leap_year.py .F..                                                    [100%]

===================================== FAILURES =====================================
_____________ test_year_divisible_by_100_but_not_400_is_not_leap_year ______________

    def test_year_divisible_by_100_but_not_400_is_not_leap_year() -> None:
        # Arrange
        y = 2100 # Not a leap year
    
        # Act
        result = is_leap_year(y)
    
        # Assert
>       assert result == False
E       assert True == False

test_is_leap_year.py:32: AssertionError
============================= short test summary info ==============================
FAILED test_is_leap_year.py::test_year_divisible_by_100_but_not_400_is_not_leap_year - assert True == False
=========================== 1 failed, 3 passed in 0.05s ============================`
      }</TerminalBlock>

      <P>(In your actual terminal, the printout is carefully colored / highlighted. For example, the line of code containing the failed assertion is usually bolded and colored in red).</P>

      <P>The <Code>{'>       assert result == False'}</Code> message, followed by <Code>{'E       assert True == False'}</Code>, is indicating that <Code>result</Code> is <Code>True</Code>, but our assertion states that it should be <Code>False</Code>. Because Pytest provides the context of the fault, it's easy to understand what led to the problem. <Code>result</Code> is computed as <Code>is_leap_year(y)</Code>, and <Code>y</Code> is <Code>2100</Code> (not a leap year). We assert that it should be false because 2100 is not a leap year, but it's actually <Code>True</Code>. This tells us that the <Code>is_leap_year()</Code> function is not correctly implemented to handle years that are divisible by 100 but not 400.</P>

      <P>This is also made clear simply from the name of the failed test: <Code>test_year_divisible_by_100_but_not_400_is_not_leap_year</Code>. The fact that this test failed suggests that our system believes that years divisible by 100 but not 400 are leap years (even though they aren't). This is precisely why each test case should be simple and descriptive<Emdash/>when a test fails, you should be able to hone in on the problem simply by the name of the failed test case alone. This makes debugging much easier.</P>

      <P>Another reason that it's important for each test case to be written as its own test function is <Bold>isolation</Bold>. Pytest (and many other testing frameworks) are often able to isolate individual test cases from one another, meaning that each is executed in its own "environment" so that the tests do not interfere with one another. For example, just because one test fails, that does not mean that all other tests should necessarily fail<Emdash/>they should still be able to be executed independently in turn since that provides the developer with the most possible information about the nature of the system's errors. Testing frameworks can only support test isolation if you conform to their interface. Pytest's interface requires each isolatable test case to be written as its own function.</P>
      
      <P>The periods in the message <Code>test_is_leap_year.py .F..</Code> each represent a successful test case. The <Code>F</Code> represents a failed test case. (In your actual terminal, the periods are usually colored in green, and the F's are usually colored in red). This proves that even after the second test fails, Pytest continues running the remaining tests, and they all pass.</P>

      <P>(A better example of test isolation is where one test modifies a global variable, but that modification is invisible to / does not affect the other tests. One reason that this is important is to ensure that the tests behave in the same manner regardless of the order in which the testing framework decides to execute them. Achieving such a level of robust test isolation is possible in Pytest, but it requires using more advanced Pytest features like <Link href="https://docs.pytest.org/en/stable/how-to/monkeypatch.html"><Code>monkeypatch</Code> fixtures</Link>).</P>

      <P>Anyways, our codebase is currently "red" (there are failing test cases). Let's fix that by correcting our <Code>is_leap_year()</Code> implementation, reverting it back to its original form:</P>

      <PythonBlock fileName="daysbetweendates.py">{
`# Determines whether a given year is a leap year
def is_leap_year(y: int) -> bool:
    if y % 4 == 0:
        if y % 100 == 0 and y % 400 != 0:
            return False
        else:
            return True
    else:
        return False
`
      }</PythonBlock>

      <P>Running Pytest again shows that all of our tests now pass:</P>

      <TerminalBlock copyable={false}>{
`(env) $ pytest
=============================== test session starts ================================
platform linux -- Python 3.13.5, pytest-8.4.1, pluggy-1.6.0
rootdir: /home/alex/instructor/static-content/guyera.github.io/code-samples/bottom-up-implementation
collected 4 items                                                                  

test_is_leap_year.py ....                                                    [100%]

================================ 4 passed in 0.01s =================================`
      }</TerminalBlock>

      <P>Our codebase is now "green" (all tests pass).</P>

      <SectionHeading id="tdd-example">TDD Example</SectionHeading>

      <P>We're ready to practice TDD. It's a bit different from how we've been doing things so far, so bear with me.</P>

      <P>To practice TDD, let's implement another component: <Code>number_of_days_in_year</Code>. But as TDD states, before we implement it, we should write a test for it. Specifically, we should write a single test for just one small unimplemented behavior. What exactly constitutes a "behavior" is up for debate, but most TDD followers would tell you that the <Code>number_of_days_in_year()</Code> function describes more than just one behavior. It's at least two: 1) when given a leap year, it produces 366; and 2) when given a non-leap year, it produces 365. TDD states that we should write a single test for just <It>one</It> of these behaviors, so that's what we'll do.</P>

      <P>(Some might break it down even further. For example, it could be said that producing 365 for non-leap years that are multiples of 100 is a separate behavior from that of producing 365 for non-leap years that aren't multiples of 4. If we treated these as two separate behaviors, then we'd write a test for each one, one at a time, each in their own iteration of the Red-Green-Refactor cycle. But I'd posit that treating these as a single behavior is good enough for our use case, especially given that we already have individual test cases for the different kinds of leap years<Emdash/>we handled that earlier when testing our <Code>is_leap_year()</Code> function.)</P>

      <P>Let's start with a test that verifies that the <Code>number_of_days_in_year</Code> produces 365 when given a non-leap year:</P>

      <PythonBlock fileName="test_number_of_days_in_year.py">{
`from daysbetweendates import number_of_days_in_year

def test_non_leap_year_has_365_days() -> None:
    # Arrange
    y = 2003 # Non-leap year
    
    # Act
    result = number_of_days_in_year(y)

    # Assert
    assert result == 365
`
      }</PythonBlock>

      <P>This test currently fails because <Code>number_of_days_in_year</Code> doesn't even exist yet. That is, the codebase is "red". The next step of the TDD cycle is to implement <It>just enough</It> of the <Code>number_of_days_in_year</Code> function that the codebase becomes "green" again (i.e., so that the new test passes without breaking any of the existing tests). That means that we shouldn't yet implement the <It>entire</It> <Code>number_of_days_in_year()</Code> function. Rather, we should implement <It>just enough</It> of it so that it correctly returns 365 when given a non-leap year. This might seem a bit silly, but bear with me.</P>

      <P>The pseudocode for this component looked like this:</P>

      <SyntaxBlock>{
`# Computes the number of days in the given year y
number_of_days_in_year(y):
    if is_leap_year(y):
        return 366
    otherwise:
        return 365`
      }</SyntaxBlock>
      
      <P>To make our new test pass, we don't have to implement <It>all</It> of that pseudocode. In fact, we only need a tiny part of it<Emdash/><Code>return 365</Code>:</P>

      <PythonBlock fileName="daysbetweendates.py" showLineNumbers={false}>{
`... # existing code is the same as before. Omitted for brevity.
def number_of_days_in_year(y: int) -> int:
    return 365
`
      }</PythonBlock>

      <P>This function obviously isn't complete yet. Currently, it <It>always</It> returns 365 even though leap years have 366 days. But, as intended, it's enough implementation to make the codebase green again. Here's your proof:</P>

      <TerminalBlock copyable={false}>{
`(env) $ pytest
=============================== test session starts ================================
platform linux -- Python 3.13.5, pytest-8.4.1, pluggy-1.6.0
rootdir: /home/alex/instructor/static-content/guyera.github.io/code-samples/bottom-up-implementation
collected 5 items                                                                  

test_is_leap_year.py ....                                                    [ 80%]
test_number_of_days_in_year.py .                                             [100%]

================================ 5 passed in 0.01s =================================`
      }</TerminalBlock>

      <P>The next step would be to refactor. But again, I don't think any refactoring is necessary. So we start the cycle over, writing another test for another behavior. This time, we'll write a test that verifies that the <Code>number_of_days_in_year()</Code> function produces 366 when given a leap year:</P>

      <PythonBlock fileName="test_number_of_days_in_year.py" showLineNumbers={false}>{
`... # existing code is the same as before. Omitted for brevity.

def test_leap_year_has_366_days() -> None:
    # Arrange
    y = 2004 # Leap year
    
    # Act
    result = number_of_days_in_year(y)

    # Assert
    assert result == 366
`
      }</PythonBlock>

      <P>Again, this test currently fails because, as it stands, the <Code>number_of_days_in_year()</Code> function always returns 365. Here, we want it to return 366. So to make the codebase "green" again, we need to update the component to return 366 when given a leap year. Importantly, we need to avoid breaking existing tests when we make this change. That is, it should still return 365 when given a non-leap year. Looking back at our pseudocode, we'll need to implement the rest of it to make that happen. Here's the updated implementation:</P>

      <PythonBlock fileName="daysbetweendates.py" showLineNumbers={false}>{
`... # existing code is the same as before. Omitted for brevity.

def number_of_days_in_year(y: int) -> int:
    if is_leap_year(y):
        return 366
    else:
        return 365
`
      }</PythonBlock>

      <P>The codebase is now green again.</P>

      <P>Let's address the elephant in the room: to some people, it might feel a bit silly to implement the <Code>number_of_days_in_year</Code> function "incorrectly" (or partially) in one iteration of TDD only to <It>reimplement</It> it correctly (or completely) in the next iteration. And that's what we essentially just did.</P>

      <P>Indeed, it's sometimes said that TDD makes implementation <It>artificially slow</It>, requiring you to work in extremely tiny iterations even if you've already worked out larger components in the design phase. However, there's a reason for this: the purpose of building up an implementation and testing it in small iterative steps is to avoid making and detecting several mistakes all at once. That is, the goal is to detect mistakes one at a time, as they're made. If you write hundreds of lines of code and then test it all at once, all the tests might fail simultaneously. In such a case, it could be hard to discern, for example, whether there are hundreds of small mistakes versus a few fundamental mistakes. Moreover, if there's just a single fundamental mistake, then <It>where is it</It>? If you just wrote hundreds of lines of code, then it could be <It>anywhere</It> within those hundreds of lines of code. In essence, the "artificial slowness" of TDD is intentional; it helps avoid these issues.</P>

      <P>(Changing one thing at a time to avoid confounding variables is an important principle in the philosophy of science as a whole. Software engineering is, indeed, a science. Also, for the curious reader: the process of making a single small change to a codebase and then re-testing the entire codebase as a whole is closely related to the idea of <Link href="https://en.wikipedia.org/wiki/Regression_testing">regression testing</Link>.)</P>


      <P>That's not to say that TDD doesn't have its downsides; it's actually fairly contentious. Also, there's no real consensus on exactly how TDD should be practiced. Indeed, I've only described one version of it. In reality, there exist many different versions as different teams and organizations practice it in different ways. For example, many teams integrate the design process directly into TDD rather than performing design as an independent, up-front, top-down process (these teams essentially use TDD as an exploratory design strategy for the entire system, starting with the lower-level components). There are advantages to this, but it loses many of the benefits of independent, top-down design. There also exist top-down TDD strategies (e.g., the "London school" of software testing philosophy). These strategies require mocking low-level components so that the higher-level components can be implemented and tested even before the lower-level components have been implemented.</P>
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
