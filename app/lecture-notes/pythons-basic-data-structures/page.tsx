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
      <P>This lecture will teach you about some of Python's basic built-in collections and data structures (beyond lists). We'll cover the following:</P>

      <Itemize>
        <Item><Link href="#tuples">Tuples</Link></Item>
        <Item><Link href="#sets">Sets</Link></Item>
        <Item><Link href="#dictionaries">Dictionaries</Link></Item>
        <Item><Link href="#type-errors-with-collections">Type errors with collections</Link></Item>
      </Itemize>

      <SectionHeading id="tuples">Tuples</SectionHeading>
      
      <P>A <Term>tuple</Term> is a group of values. In Python, tuples are <Bold>immutable</Bold> and fixed in size, meaning that once a tuple has been created, you cannot modify the values in it, nor can you add or remove values to / from it. This is in contrast to lists, which are both mutable (modifiable) and resizable.</P>

      <P>Because tuples are immutable and fixed in size, they're usually only used to store a small number of (e.g., two or three) related values. Lists, in contrast, are often used to store hundreds, thousands, or even millions of values. However, this is not a hard and fast rule. Tuples can technically be as large as you want them to be, and lists can even be explicitly type-casted into tuples (and vice-versa).</P>

      <P>There are various ways to create tuples in Python. A simple way is to write out a comma-separated list of values in between a pair of parentheses. The interpreter will automatically convert the entire grouping into a single tuple containing all of the provided values. For example:</P>

      <PythonBlock fileName='tuples.py'>{
`def main() -> None:
    my_tuple = ('James', 25, 'Strawberries')

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Once a tuple has been created, you can access the values within it using square brackets and an index, just like you would with a list:</P>

      <PythonBlock fileName='tuples.py'>{
`def main() -> None:
    my_tuple = ('James', 25, 'Strawberries')
    print(my_tuple[0]) # Prints James
    print(my_tuple[1]) # Prints 25
    print(my_tuple[2]) # Prints Strawberries

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Running the above program produces the following output:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python tuples.py 
James
25
Strawberries
`
      }</TerminalBlock>

      <P>You might have noticed that <Code>my_tuple</Code> from the above example is heterogeneous, meaning that it contains values of different types (it contains a <Code>str</Code> value, an <Code>int</Code> value, and another <Code>str</Code> value). Indeed, although it's uncommon to find a good use case for a heterogeneous list, heterogeneous <It>tuples</It> are incredibly common. This is because a tuple is usually used to group a few pieces of related data<Emdash/>not to construct an ordered sequence of potentially thousands of different instances of the same kind of thing. For example, a tuple might store a few pieces of information about a person (e.g., their name, age, and favorite fruit, as in the above example), and those pieces of information might not be of the same type. A list, in contrast, might store an ordered sequence of a thousand people, or a thousand people's names, or a thousand people's ages, etc<Emdash/>every element of the list is of the same type.</P>

      <P>As with lists, attempting to index a tuple with an out-of-bounds index results in an exception being thrown (specifically an <Code>IndexError</Code>), causing the program to crash if the exception isn't caught.</P>
      
      <P>Again, although you can access the values within a tuple, you <Ul>cannot</Ul> modify the values within a tuple. Attempting to do so <It>also</It> results in an exception being thrown (specifically a <Code>TypeError</Code>). And, like all other exceptions, this causes your program to crash if the exception isn't caught:</P>

      <PythonBlock fileName='cant_modify_tuple.py'>{
`def main() -> None:
    my_tuple = ('James', 25, 'Strawberries')
    print(my_tuple[0]) # Prints James
    print(my_tuple[1]) # Prints 25
    print(my_tuple[2]) # Prints Strawberries

    # Try to change 'James' to 'Jesse'. This isn't allowed. Crashes the
    # program
    my_tuple[0] = 'Jesse' 

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Running the above program produces the following output:</P>

      <TerminalBlock>{
`(env) $ python cant_modify_tuple.py 
James
25
Strawberries
Traceback (most recent call last):
  File "/home/alex/instructor/static-content/guyera.github.io/code-samples/pythons-basic-data-structures/cant_modify_tuple.py", line 12, in <module>
    main()
    ~~~~^^
  File "/home/alex/instructor/static-content/guyera.github.io/code-samples/pythons-basic-data-structures/cant_modify_tuple.py", line 9, in main
    my_tuple[0] = 'Jesse'
    ~~~~~~~~^^^
TypeError: 'tuple' object does not support item assignment
`
      }</TerminalBlock>

      <P>A tuple can be <Term>unpacked</Term> into a set of individual variables. Those variables then refer to the respective values within the tuple. There are various contexts in which a tuple can be unpacked. The simplest is via assignment. Suppose you have a tuple called <Code>my_tuple</Code> with three elements (values) inside it. Then those three values can be unpacked into three individual variables like so:</P>

      <SyntaxBlock>{
`my_first_variable, my_second_variable, my_third_variable = my_tuple`
      }</SyntaxBlock>

      <P>Here's a complete example:</P>

      <PythonBlock fileName='unpacking.py'>{
`def main() -> None:
    my_tuple = ('James', 25, 'Strawberries')
    print(my_tuple[0]) # Prints James
    print(my_tuple[1]) # Prints 25
    print(my_tuple[2]) # Prints Strawberries

    print('-------------------------')
    print('Unpacking tuple correctly:')
    
    # Unpack the three tuple values into three variables: name, age,
    # and favorite_fruit.
    name, age, favorite_fruit = my_tuple
    print(f'name: {name}') # Prints James
    print(f'age: {age}') # Prints 25
    print(f'favorite_fruit: {favorite_fruit}') # Prints Strawberries

    print('-------------------------')
    print('Unpacking tuple incorrectly:')

    # Tuples are always unpacked left-to-right. my_tuple has three
    # elements: 'James', 25, and 'Strawberries'. So those three
    # values will be unpacked into the three respective variables
    # in that exact order. If you mess up the order of your variables,
    # the wrong values will be unpacked into them:
    favorite_fruit, age, name = my_tuple
    print(f'name: {name}') # Prints Strawberries
    print(f'age: {age}') # Prints 25
    print(f'favorite_fruit: {favorite_fruit}') # Prints James


if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Running the above program produces the following output:</P>

<TerminalBlock copyable={false}>{
`(env) $ python unpacking.py 
James
25
Strawberries
-------------------------
Unpacking tuple correctly:
name: James
age: 25
favorite_fruit: Strawberries
-------------------------
Unpacking tuple incorrectly:
name: Strawberries
age: 25
favorite_fruit: James
`
}</TerminalBlock>

      <P>As demonstrated in the above example, it's easy to mess up when unpacking tuples. The values are always unpacked from the tuple in the order of their indices, and those unpacked values are stored in the respective variables in left-to-right order. Listing the variables in the wrong order, then, can result in those variables storing the wrong values. If you're lucky, it can sometimes introduce type errors, which Mypy is capable of detecting (e.g., if <Code>name</Code> is already defined as a string variable, but you accidentally list it as the second variable when unpacking <Code>my_tuple</Code>, that would try to store the value <Code>25</Code> in it, which would change the type of <Code>name</Code> from <Code>str</Code> to <Code>int</Code><Emdash/>Mypy doesn't allow that). But in some cases, Mypy is not capable of detecting these kinds of mistakes, especially if two or more values in the tuple are of the same type.</P>

      <P>Besides unpacking values from a tuple in the wrong order, another common mistake is unpacking the wrong number of values. For example, suppose we have a tuple of three values, but we try to unpack it into just two variables:</P>

      <PythonBlock fileName='bad_unpacking.py' highlightLines='{7}'>{
`def main() -> None:
    my_tuple = ('James', 25, 'Strawberries')
    print(my_tuple[0]) # Prints James
    print(my_tuple[1]) # Prints 25
    print(my_tuple[2]) # Prints Strawberries

    name, age = my_tuple


if __name__ == '__main__':
    main()
i`
      }</PythonBlock>

      <P>Luckily, Mypy is capable of catching the above mistake:</P>

      <TerminalBlock copyable={false}>{
`(env) $ mypy bad_unpacking.py 
bad_unpacking.py:7: error: Too many values to unpack (2 expected, 3 provided)  [misc]
Found 1 error in 1 file (checked 1 source file)
`
      }</TerminalBlock>

      <P>If you ignore Mypy's errors and try to run the above program anyways, it throws an exception (specifically a <Code>ValueError</Code>) and crashes, assuming the exception isn't caught:</P>

<TerminalBlock copyable={false}>{
`(env) $ python bad_unpacking.py 
James
25
Strawberries
Traceback (most recent call last):
  File "/home/alex/instructor/static-content/guyera.github.io/code-samples/pythons-basic-data-structures/bad_unpacking.py", line 11, in <module>
    main()
    ~~~~^^
  File "/home/alex/instructor/static-content/guyera.github.io/code-samples/pythons-basic-data-structures/bad_unpacking.py", line 7, in main
    name, age = my_tuple
    ^^^^^^^^^
ValueError: too many values to unpack (expected 2)
`
}</TerminalBlock>
      
      <P>A similar exception is thrown if you try to unpack a tuple into <It>too many</It> variables.</P>

      <P>Suppose you want to write a function that accepts a tuple as a parameter or returns a tuple. In that case, you'll need to know how to explicitly type-annotate tuples so that they're accepted by Mypy. The syntax for a tuple type annotation is as follows:</P>

      <SyntaxBlock>{
`tuple[<type1>, <type2>, <type3>, ..., <typeN>]`
      }</SyntaxBlock>

      <P>Replace each of the the <Code>{'<typeX>'}</Code> instances with the type of the element in the tuple at the corresponding position.</P>

      <P>For example, suppose you want to write a function named <Code>foo()</Code> that has a single parameter <Code>x</Code>, which is in turn a tuple that consists of a string, followed by an integer, followed by another string. You could define <Code>foo()</Code> like so:</P>

      <SyntaxBlock>{
`def foo(x: tuple[str, int, str]):
    # Do something interesting with x...`
      }</SyntaxBlock>

      <P>Here's a more complete example that defines a function named <Code>quadratic_formula</Code> that returns the two roots of a quadratic equation in a single tuple:</P>

      <PythonBlock fileName={'tuple_typing.py'}>{
`from math import sqrt

def quadratic_formula(
        a: float,
        b: float,
        c: float) -> tuple[float, float]:
    first_root = (-b - sqrt(b**2 - 4*a*c)) / (2 * a)
    second_root = (-b + sqrt(b**2 - 4*a*c)) / (2 * a)
    return (first_root, second_root) # Return the roots as a tuple

def main() -> None:
    # Consider the quadratic equation 4x^2 + 2x - 3 = 0. Under the
    # standard pattern (ax^2 + bx + c), that means:
    # a = 4, b = 2, c = -3.

    # Compute the roots using the quadratic formula:
    roots = quadratic_formula(4, 2, -3)

    # Unpack the tuple
    first_root, second_root = roots

    print('The roots of the equation "4x^2 + 2x - 3 = 0" are:')
    print(f'x1: {first_root}')
    print(f'x2: {second_root}')

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Running the above program produces the following output:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python tuple_typing.py 
The roots of the equation "4x^2 + 2x - 3 = 0" are:
x1: -1.1513878188659974
x2: 0.6513878188659973
`
      }</TerminalBlock>
      
      <P>We can actually clean up the above code in a couple of ways:</P>

      <Itemize>
        <Item><P>When a tuple is used as a return value, you can optionally leave out the parentheses. For example, to return a tuple consisting of the variables <Code>a</Code>, <Code>b</Code>, and <Code>c</Code>, you can simply write <Code>return a, b, c</Code> as opposed to <Code>return (a, b, c)</Code>. Leaving out the parentheses in such a case is more idiomatic / conventional, so we should do that.</P></Item>
        <Item><P>We're currently storing the returned tuple in a variable named <Code>roots</Code> and <It>then</It> unpacking it into <Code>first_root</Code> and <Code>second_root</Code>. But, as you might have surmised, there's no reason that we couldn't directly unpack the return value into <Code>first_root</Code> and <Code>second_root</Code>, skipping the need for the <Code>roots</Code> variable altogether. This is also more idiomatic, so we should do this as well.</P></Item>
      </Itemize>

      <P>Here's the updated code taking into account the above changes:</P>

      <PythonBlock fileName={'tuple_typing.py'} highlightLines={'{9, 17}'}>{
`from math import sqrt

def quadratic_formula(
        a: float,
        b: float,
        c: float) -> tuple[float, float]:
    first_root = (-b - sqrt(b**2 - 4*a*c)) / (2 * a)
    second_root = (-b + sqrt(b**2 - 4*a*c)) / (2 * a)
    return first_root, second_root # Return the roots as a tuple

def main() -> None:
    # Consider the quadratic equation 4x^2 + 2x - 3 = 0. Under the
    # standard pattern (ax^2 + bx + c), that means:
    # a = 4, b = 2, c = -3.

    # Compute the roots using the quadratic formula:
    x1, x2 = quadratic_formula(4, 2, -3)

    print('The roots of the equation "4x^2 + 2x - 3 = 0" are:')
    print(f'x1: {x1}')
    print(f'x2: {x2}')

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>(Running it does the same thing as before)</P>

      <P>Lastly, it's technically possible to iterate over the elements of a tuple using a <Code>for</Code> loop in much the same way that you can iterate over the elements of a list:</P>

      <PythonBlock fileName="tuple_iteration.py">{
`def main() -> None:
    my_tuple = ('James', 25, 'Strawberries')
    for elem in my_tuple:
        print(elem)

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Running the above program produces the following output:</P>

      <TerminalBlock copyable={false}>{
`James
25
Strawberries
`
      }</TerminalBlock>

      <P>While the above program passes Mypy's type checks and runs just fine, there is something about it that might surprise you: the type of the variable named <Code>elem</Code> changes throughout the for loop. In the first iteration, it's a string (<Code>'James'</Code>). In the second iteration, it's an integer (<Code>25</Code>). In the third iteration, it's a string again (<Code>'Strawberries'</Code>). I've previously told you that Mypy generally doesn't allow a variable's type to change throughout a program. Although that's <It>generally</It> true, there are some nuances surrounding this rule. For now, you do not need to understand exactly why Mypy allows this in this case. It will likely make more sense later on in the term once we've covered dynamic types and polymorphism.</P>

      <P>(For the curious reader: Mypy infers <Code>elem</Code>'s static type to be some sort of union type, such as <Code>Union[str, int]</Code>, which allows its static type to be fixed even as its dynamic type changes. Indeed, Mypy is a <Ul>static</Ul> type checker; it forbids a variable's static type from changing, but a variable's dynamic type is allowed to change so long as it remains compatible with its fixed static type).</P>

      <SectionHeading id="sets">Sets</SectionHeading>

      <P>A <Bold>set</Bold> is a collection of unique values. If you'd like, you can think of a set as being similar to a list, except 1) a given value may only appear at most once within a set (as opposed to lists wherein a given value may appear arbitrarily many times), and 2) the values within a set do not have user-specified positions (e.g., there are no indices, so there is no "element 0", nor "element 1", nor "element 2", etc). Some people discribe sets as "bags of unique data". The "bag of data" description helps illustrate the nonpositional nature of sets.</P>

      <P>Since the values within a set do not have indices, you might be wondering how to access a value within a set. Well, you usually don't. There are three operations that are commonly done on sets:</P>

      <Itemize>
        <Item>Add a value to the set</Item>
        <Item>Remove a value from the set</Item>
        <Item>Check whether a given value is already present in the set</Item>
      </Itemize>

      <P>Notice that "Access the Nth element in the set" is not one of the above operations. Again, sets are nonpositional; there is no "Nth element".</P>

      <P>Moreover, while sets themselves are mutable (i.e., they can be changed, such as by adding values to them and removing values from them), the values <It>within</It> a set are immutable. If you want to change a value within a set, you must instead remove the value and add a new one.</P>

      <P>Lists can do all of the above operations as well <It>and more</It>. However, sets are particularly efficient at the third operation<Emdash/>checking whether a given value is present in the set. They're much faster at this than a list is, especially if you're dealing with an extremely large collection of values.</P>

      <P>Sets have various purposes. They can be used to keep track of all the unique values that are observed throughout a task; they can be used remove duplicates from a list; and so on.</P>

      <P>To create a set in Python, simply type out a comma-separated list of values enclosed in curly braces (<Code>{'{}'}</Code>) as opposed to square brackets (which would create a list instead). For example:</P>

      <PythonBlock fileName="sets.py">{
`def main() -> None:
    # Create a set of integers denoting all of the recent leap years
    recent_leap_years = {1996, 2000, 2004, 2008, 2012, 2016, 2020}

    print(recent_leap_years)

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Running the above program produces the following output (or similar):</P>

      <TerminalBlock copyable={false}>{
`(env) $ python sets.py 
{2016, 2000, 2020, 2004, 2008, 2012, 1996}
`
      }</TerminalBlock>

      <P>Notice that the values were not printed in the same order that they were specified when the set was created. Again, this is because sets are nonpositional. They are simply "bags of unique data". In fact, there's no guarantee as to what order the above values will be printed in whatsoever.</P>

      <P>You can add a value to a set using the <Code>.add()</Code> method. You can remove an value from a set using the <Code>.remove()</Code> method. You can check if an value is present in a set in the same way you do with a list<Emdash/>using the <Code>in</Code> operator. Let's update our example:</P>

      <PythonBlock fileName="sets.py">{
`def main() -> None:
    # Create a set of integers denoting all of the recent leap years
    recent_leap_years = {1996, 2000, 2004, 2008, 2012, 2016, 2020}

    # Add 2024 to the set
    recent_leap_years.add(2024)

    # Remove 1996 from the set
    recent_leap_years.remove(1996)

    # Print the set
    print(recent_leap_years)

    # Ask user for a year:
    chosen_year = int(input('Specify a year later than 1999: '))

    # Check if the user's specified year is in the set
    if (chosen_year in recent_leap_years):
        print('The specified year was a recent leap year')
    else:
        print('The specified year was NOT a recent leap year')

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Here's one example run of the above program:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python sets.py 
{2016, 2000, 2020, 2004, 2008, 2024, 2012}
Specify a year later than 1999: 1996
The specified year was NOT a recent leap year
`
      }</TerminalBlock>

      <P>Here's another:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python sets.py 
{2016, 2000, 2020, 2004, 2008, 2024, 2012}
Specify a year later than 1999: 2024
The specified year was a recent leap year
`
      }</TerminalBlock>

      <P>Because the values in a set must be unique (i.e., each value can appear at most once), if you try to add a value to a set that's already present in the set, nothing happens:</P>

      <PythonBlock fileName="sets.py" highlightLines="{8-9}">{
`def main() -> None:
    # Create a set of integers denoting all of the recent leap years
    recent_leap_years = {1996, 2000, 2004, 2008, 2012, 2016, 2020}

    # Add 2024 to the set
    recent_leap_years.add(2024)

    # Try to add 2024 to the set again. This does NOTHING.
    recent_leap_years.add(2024)

    # Remove 1996 from the set
    recent_leap_years.remove(1996)

    # Print the set
    print(recent_leap_years)

    # Ask user for a year:
    chosen_year = int(input('Specify a year later than 1999: '))

    # Check if the user's specified year is in the set
    if (chosen_year in recent_leap_years):
        print('The specified year was a recent leap year')
    else:
        print('The specified year was NOT a recent leap year')

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>However, if you try to remove a value from a set that's <It>not</It> present in the set, an exception is thrown (specifically a <Code>KeyError</Code>), which causes the program to crash if it's not caught:</P>

      <PythonBlock fileName="sets.py" highlightLines="{14-16}">{
`def main() -> None:
    # Create a set of integers denoting all of the recent leap years
    recent_leap_years = {1996, 2000, 2004, 2008, 2012, 2016, 2020}

    # Add 2024 to the set
    recent_leap_years.add(2024)

    # Try to add 2024 to the set again. This does NOTHING.
    recent_leap_years.add(2024)

    # Remove 1996 from the set
    recent_leap_years.remove(1996)

    # Try to remove 1996 from the set again. This throws a KeyError,
    # causing the program to crash if it's not caught.
    recent_leap_years.remove(1996)

    # Print the set
    print(recent_leap_years)

    # Ask user for a year:
    chosen_year = int(input('Specify a year later than 1999: '))

    # Check if the user's specified year is in the set
    if (chosen_year in recent_leap_years):
        print('The specified year was a recent leap year')
    else:
        print('The specified year was NOT a recent leap year')

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Running the above program produces the following output:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python sets.py 
Traceback (most recent call last):
  File "/home/alex/instructor/static-content/guyera.github.io/code-samples/pythons-basic-data-structures/sets.py", line 31, in <module>
    main()
    ~~~~^^
  File "/home/alex/instructor/static-content/guyera.github.io/code-samples/pythons-basic-data-structures/sets.py", line 16, in main
    recent_leap_years.remove(1996)
    ~~~~~~~~~~~~~~~~~~~~~~~~^^^^^^
KeyError: 1996
`
      }</TerminalBlock>

      <P>If you want to create an empty set, you unfortunately can't just use an empty pair of curly braces. Well, Python technically allows that, but it confuses Mypy. To avoid issues, use the built-in <Code>set()</Code> function instead, passing in no arguments. For example:</P>

      <PythonBlock copyable={false} showLineNumbers={false}>{
`my_cool_set = set()`
      }</PythonBlock>

      <P>You could then proceed to add values to <Code>my_cool_set</Code> using the <Code>.add()</Code> method, as per usual.</P>

      <P>To type-annotate a set, use the following syntax:</P>

      <SyntaxBlock>{
`set[<type>]`
      }</SyntaxBlock>

      <P>Replace <Code>{'<type>'}</Code> with the type of value that you want to put in the set. For example, the <Code>recent_leap_years</Code> set in the previous examples could be type-annotated as <Code>set[int]</Code> because it's a set that contains integers. This type annotation syntax implies that sets are generally homogeneous. And, indeed, they are. Much like lists, Mypy expects sets to be homogeneous even though Python technically allows them to be heterogeneous. Creating and using heterogeneous sets requires more complicated type annotation syntax, and it's usually ill-advised.</P>

      <P>Here's an example program that uses a set type annotation for a function return type:</P>

      <PythonBlock fileName="set_type_annotation.py">{
`# Given a list of names, find the UNIQUE names within that
# list and return them as a set
def get_unique_names(names: list[str]) -> set[str]:
    result = set() # Initially empty
    for name in names:
        # Add each name to the set, or do nothing if it's already in
        # the set
        result.add(name)

    return result
    

def main() -> None:
    # Notice: Mahatma is present in the list twice
    names = ['Mahatma', 'Aditya', 'Mohammad', 'Samantha', 'Richard',
             'Mahatma', 'John']

    unique_names = get_unique_names(names)

    # Mahatma will only be present in this set once
    print(unique_names)


if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Running the above program produces the following output (or similar):</P>

      <TerminalBlock copyable={false}>{
`(env) $ python set_type_annotation.py 
{'Mohammad', 'Aditya', 'Mahatma', 'Richard', 'John', 'Samantha'}
`
      }</TerminalBlock>

      <P>Python supports type-casting a list into a set and vice-versa. Type-casting a list into a set creates a set containing all of the unique values from the list, and type-casting a set into a list creates a list containing all of the same values as the set. Here's the syntax:</P>

      <SyntaxBlock>{
`my_cool_list = list(my_set) # Creates a list from my_set
my_cool_set = set(my_list) # Creates a set from my_list`
      }</SyntaxBlock>

      <P>As you might have noticed, this makes the <Code>get_unique_names()</Code> function in the previous example pretty silly. We could accomplish the same objective with a simple type cast:</P>

      <PythonBlock fileName="set_type_casting.py" highlightLines="{6}">{
`def main() -> None:
    # Notice: Mahatma is present in the list twice
    names = ['Mahatma', 'Aditya', 'Mohammad', 'Samantha', 'Richard',
             'Mahatma', 'John']

    unique_names = set(names)

    # Mahatma will only be present in this set once
    print(unique_names)


if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>The above program does the same thing as the previous example, but notice that it no longer needs a <Code>get_unique_names()</Code> function.</P>

      <P>You can iterate over the values of a set using a for loop, just like you can with a list or a tuple. However, because sets are nonpositional, there's no guarantee as to the order in which the values will be iterated.</P>

      <P>Lastly, understand that everything that can be done with a set can also be done with a list, but sets are <It>better</It> at certain things than lists are (particularly at checking whether a given value is present).</P>

      <SectionHeading id="dictionaries">Dictionaries</SectionHeading>

      <P>A <Bold>dictionary</Bold> is a map from <Bold>keys</Bold> to <Bold>values</Bold>. There are four common operations done on dictionaries:</P>

      <Itemize>
        <Item>Insert a key-value pair into the dictionary</Item>
        <Item>Access the value associated with a given key in the dictionary (either to modify or simply to retrieve it)</Item>
        <Item>Check whether a given key is present in the dictionary</Item>
        <Item>Remove a key-value pair from the dictionary</Item>
      </Itemize>

      <P>The purpose of a dictionary is to build an association, or mapping, that makes it easy to perform lookups. For example, suppose your program commonly needs to look up the age of a person given their name. A simple way to accomplish this would be to create a dictionary that maps names to ages. In that case, the names would be the keys, and the ages would be the values.</P>

      <P>The syntax for creating a dictionary in Python is as follows:</P>

      <SyntaxBlock>{
`my_dictionary = {<key1>: <value1>, <key2>: <value2>, ..., <keyN>: <valueN>}`
      }</SyntaxBlock>

      <P>Replace each <Code>{'<keyX>'}</Code> with a key and <Code>{'<valueX>'}</Code> with the value associated with that key.</P>

      <P>Here's my previous example written out in code:</P>

      <PythonBlock fileName="dictionaries.py">{
`def main() -> None:
    ages_of_people = {
        'John': 46,
        'Mahatma': 72,
        'Aditya': 34
    }

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>To retrieve a value associated with a given key within a dictionary, type the name of the dictionary followed by the given key enclosed in square brackets. Notice that this is the same syntax for indexing a list, except rather than putting an index in between the square brackets, you put a key (a key is actually sometimes referred to as an index for this reason). Let's update our example:</P>

      <PythonBlock fileName="dictionaries.py">{
`def main() -> None:
    ages_of_people = {
        'John': 46,
        'Mahatma': 72,
        'Aditya': 34
    }

    chosen_name = input('Whose age would you like to look up?: ')

    # Retrieve the age of the person with the specified name from the
    # dictionary
    associated_age = ages_of_people[chosen_name]

    # Print their age
    print(f"That person's age is {associated_age}")

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Here's an example run:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python dictionaries.py 
Whose age would you like to look up?: John
That person's age is 46
`
      }</TerminalBlock>

      <P>Attempting to look up a key that's not present within the dictionary results in an exception being thrown (specifically a <Code>KeyError</Code>), causing the program to crash if it's not caught:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python dictionaries.py 
Whose age would you like to look up?: Joseph
Traceback (most recent call last):
  File "/home/alex/instructor/static-content/guyera.github.io/code-samples/pythons-basic-data-structures/dictionaries.py", line 18, in <module>
    main()
    ~~~~^^
  File "/home/alex/instructor/static-content/guyera.github.io/code-samples/pythons-basic-data-structures/dictionaries.py", line 12, in main
    associated_age = ages_of_people[chosen_name]
                     ~~~~~~~~~~~~~~^^^^^^^^^^^^^
KeyError: 'Joseph'
`
      }</TerminalBlock>

      <P>Key-value lookups are case-sensitive, meaning that if the user typed in <Code>'john'</Code> (with a lowercase <Code>'j'</Code> instead of an uppercase <Code>'J'</Code>), the same <Code>KeyError</Code> would have been raised. This is actually the case with lookups using the <Code>in</Code> operator as well, including with lists, sets and other built-in collection types.</P>

      <P>The syntax for adding a new key-value pair to a dictionary is as follows:</P>

      <SyntaxBlock>{
`my_dictionary[<key>] = <value>`
      }</SyntaxBlock>

      <P>Replace <Code>{'<key>'}</Code> with the desired key and <Code>{'<value>'}</Code> with the value that you'd like to associate with that key. Notice that this is exactly the same syntax as is used for key-value lookups, except for the fact that the dictionary and its indexing happens on the left side of an assignment operator. This indicates to Python that you're trying to store a key-value pair in the dictionary rather than retrieve a key-value pair from the dictionary. Hence, it does not raise a <Code>KeyError</Code>.</P>

      <P>Let's update our example:</P>

      <PythonBlock fileName="dictionaries.py" highlightLines="{9-10}">{
`(env) $ cat dictionaries.py 
def main() -> None:
    ages_of_people = {
        'John': 46,
        'Mahatma': 72,
        'Aditya': 34
    }

    # Add another person and their age to the dictionary:
    ages_of_people['Mohammad'] = 21

    chosen_name = input('Whose age would you like to look up?: ')

    # Retrieve the age of the person with the specified name from the
    # dictionary
    associated_age = ages_of_people[chosen_name]

    # Print their age
    print(f"That person's age is {associated_age}")

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Here's an example run:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python dictionaries.py 
Whose age would you like to look up?: Mohammad
That person's age is 21
`
      }</TerminalBlock>

      <P>The keys in a dictionary are immutable, but the values in a dictionary are not. That's to say, you cannot modify a key once it has been added to a dictionary, but you can modify the value in a dictionary <It>associated</It> with a given key. Funny enough, the syntax for modifying a value associated with a given key is identical to the syntax for adding a new key-value pair to the dictionary. In other words, <Code>{'my_dictionary[<key>] = <value>'}</Code> will either a) change the value associated with the given key (<Code>{'<key>'}</Code>) to the specified value (<Code>{'<value>'}</Code>), or b) create a new key-value pair. If the dictionary already contains a key-value pair with the specified key, it does the former. Otherwise, it does the latter. Here's an updated example:</P>

      <PythonBlock fileName="dictionaries.py" highlightLines="{11-13}">{
`def main() -> None:
    ages_of_people = {
        'John': 46,
        'Mahatma': 72,
        'Aditya': 34
    }

    # Add another person and their age to the dictionary:
    ages_of_people['Mohammad'] = 21

    # Change Mohammad's age to 22 (notice---it's exactly the same
    # syntax as above!)
    ages_of_people['Mohammad'] = 22

    chosen_name = input('Whose age would you like to look up?: ')

    # Retrieve the age of the person with the specified name from the
    # dictionary
    associated_age = ages_of_people[chosen_name]

    # Print their age
    print(f"That person's age is {associated_age}")

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>You often need to check whether a key is present in a given dictionary before attempting to lookup the associated value (otherwise, if the key isn't present, attempting to look up the key-value pair results in a <Code>KeyError</Code> being raised, as we saw a few moments ago). The syntax for checking whether a key is present in a dictionary is identical to the syntax for checking whether a value is present in a set (or list, or tuple)<Emdash/>use the <Code>in</Code> operator:</P>

      <PythonBlock fileName="dictionaries.py" highlightLines="{17-19,23-24}">{
`def main() -> None:
    ages_of_people = {
        'John': 46,
        'Mahatma': 72,
        'Aditya': 34
    }

    # Add another person and their age to the dictionary:
    ages_of_people['Mohammad'] = 21

    # Change Mohammad's age to 22 (notice---it's exactly the same
    # syntax as above!)
    ages_of_people['Mohammad'] = 22

    chosen_name = input('Whose age would you like to look up?: ')

    # When used on a dictionary, the 'in' operator checks whether
    # the given KEY is present
    if chosen_name in ages_of_people:
        associated_age = ages_of_people[chosen_name]

        print(f"That person's age is {associated_age}")
    else:
        print(f"Sorry! I don't know the age of {chosen_name}")

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Specifying an unknown name at runtime no longer results in a <Code>KeyError</Code> being raised:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python dictionaries.py 
Whose age would you like to look up?: Joseph
Sorry! I don't know the age of Joseph
`
      }</TerminalBlock>

      <P>You can create an empty dictionary by simply leaving the curly braces empty (e.g., <Code>{'my_dictionary = {}'}</Code>). You can then proceed to add key-value pairs to it as per usual. (Actually, this syntax is precisely why you <It>can't</It> use an empty pair of curly braces to create an empty set<Emdash/>Mypy gets confused and thinks that you're trying to create an empty dictionary instead.)</P>

      <P>The syntax for remove a key-value pair from a dictionary is the same as the syntax for removing a value from a list, except you replace the index with the key:</P>

      <SyntaxBlock>{
`del my_dictionary[<key>]`
      }</SyntaxBlock>

      <P>Replace <Code>{'<key>'}</Code> with key of the key-value pair that you'd like to remove from the dictionary. For example:</P>

      <PythonBlock fileName="dictionaries.py" highlightLines="{15-16}">{
`def main() -> None:
    ages_of_people = {
        'John': 46,
        'Mahatma': 72,
        'Aditya': 34
    }

    # Add another person and their age to the dictionary:
    ages_of_people['Mohammad'] = 21

    # Change Mohammad's age to 22 (notice---it's exactly the same
    # syntax as above!)
    ages_of_people['Mohammad'] = 22

    # Remove John and his age from the dictionary
    del ages_of_people['John']

    chosen_name = input('Whose age would you like to look up?: ')

    # When used on a dictionary, the 'in' operator checks whether
    # the given KEY is present
    if chosen_name in ages_of_people:
        associated_age = ages_of_people[chosen_name]

        print(f"That person's age is {associated_age}")
    else:
        print(f"Sorry! I don't know the age of {chosen_name}")

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>And an example run:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python dictionaries.py 
Whose age would you like to look up?: John
Sorry! I don't know the age of John
`
      }</TerminalBlock>

      <P>To type-annotate a dictionary, use the following syntax:</P>

      <SyntaxBlock>{
`dict[<key type>, <value type>]`
      }</SyntaxBlock>

      <P>Replace <Code>{'<key type>'}</Code> with the type of the keys, and replace <Code>{'<value type>'}</Code> with the type of the values. For example, if we wanted to pass <Code>ages_of_people</Code> into a function as an argument, the corresponding parameter should be type-annotated as <Code>dict[str, int]</Code> because the keys are peoples' names (which are strings), and the values are peoples' ages (which are integers).</P>

      <P>Lastly, you can iterate through a dictionary using a for loop, but if done in the standard way (e.g., <Code>for k in my_dictionary</Code>), it only iterates through the <It>keys</It> of the dictionary<Emdash/>not the values (though, of course, you can easily look up the values associated with those keys using the syntax that we've discussed). There are ways of directly iterating over the values of a dictionary, as well as ways of iterating over the key-value pairs in the form of tuples, but we won't discuss them (for the curious reader, look up the <Code>.values()</Code> and <Code>.items()</Code> dictionary methods).</P>

      <SectionHeading id="type-errors-with-collections">Type errors with collections</SectionHeading>

      <P>As with lists, Mypy can get confused about the type of a set or dictionary if you initialize it to be empty and never add any elements to it <It>anywhere</It> in your code (and possibly in some other niche cases). For example, consider the following code:</P>

      <PythonBlock fileName="ambiguous_type_set.py">{
`def main() -> None:
    # Mypy doesn't know what kind of set this is. Is it a set of
    # integers? A set of strings? It has no way of knowing since we
    # never actually put anything in it.
    my_set = set()

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Running the above program through Mypy produces the following output:</P>

      <TerminalBlock copyable={false}>{
`(env) $ mypy ambiguous_type_set.py 
ambiguous_type_set.py:5: error: Need type annotation for "my_set" (hint: "my_set: set[<type>] = ...")  [var-annotated]
Found 1 error in 1 file (checked 1 source file)
`
      }</TerminalBlock>

      <P>A similar error occurs when you do the same thing with a dictionary.</P>

      <P>Mypy is telling us that it can't infer the type of <Code>my_set</Code> based on the context, so it needs us to explicitly type-annotate it. As discussed in a previous lecture, we can do this like so:</P>

      <PythonBlock fileName="unambiguous_type_set.py">{
`def main() -> None:
    # If we want this to be a set of integers, but Mypy isn't able
    # to figure that out on its own, we can explicitly annotate its
    # type as set[int] (for example)
    my_set: set[int] = set()

if __name__ == '__main__':
    main()`
      }</PythonBlock>

      <P>The above code passes through Mypy with no errors.</P>

      <P>Also, as you know, Mypy does not allow a variable's (static) type to change in the middle of a program. For this reason, whenever you create a collection (e.g., a list, a set, a dictionary, etc), you must immediately decide what type of data you plan on storing in that collection, and then you must make sure to never add any other kind of data to it. If <Code>my_set</Code> is meant to be a set of strings, you cannot add anything other than strings to it. If <Code>my_dictionary</Code> is meant to map integers to booleans, then all key-value pairs should have an integer key and a boolean value. And so on. Otherwise, Mypy will raise various type errors.</P>
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
