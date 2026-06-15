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
      <P>This lecture is about <Bold>plain-old-data (POD) types</Bold>. We'll cover the following:</P>

      <Itemize>
        <Item><Link href="#pod-types-via-classes">POD types ("structure types") via classes</Link></Item>
        <Item><Link href="#type-annotating-class-instances">Type-annotating class instances</Link></Item>
        <Item><Link href="#file-input-example">Example: Loading POD types via text I/O</Link></Item>
        <Item><Link href="#composition-of-objects">Composition of objects</Link></Item>
        <Item><Link href="#references">References</Link></Item>
      </Itemize>

      <SectionHeading id="pod-types-via-classes">POD types ("structure types") via classes</SectionHeading>

      <P>In <Link href={`${PARENT_PATH}/${allPathData["file-io"].pathName}`}>our File I/O lecture</Link>, we created a program that loads information about cities from a text file, particularly their names and population counts. Suppose you want to store all that information in a list. That sounds easy, but there's a problem: you know how to create a list of strings, and you know how to create a list of integers, but how do you create a list of <It>cities</It>?</P>

      <P>There are a few solutions. A naive solution would be to have <It>two</It> lists: a list of strings to store the cities' names, and a list of integers to store their corresponding population counts. For example, perhaps <Code>city_names[0]</Code> represents the name of the first city read from the text file, and <Code>city_populations[0]</Code> represents the population of that same city. This solution technically works, but there are a host of problems with it. For one, you (the programmer) have to be very careful to make sure that these two lists are always in alignment. If you ever insert a new city name into <Code>city_names</Code>, but you forget to insert the population of that city into <Code>city_populations</Code> (or if you remove a value from one of the lists, or if you change a value in one of the lists, etc), then the two lists will no longer be in alignment with one another; <Code>city_names[4]</Code> might represent the name of one city while <Code>city_populations[4]</Code> represents the population of a different city altogether. And at that point, there might be no way of knowing which populations correspond to which cities (you'll also probably run into an <Code>IndexError</Code> when iterating through the lists if one list is longer than the other).</P>

      <P>There are other issues with this solution as well, but let's move on to a better solution. Rather than having a list of strings for the cities' names and a separate list of integers for the cities' populations, wouldn't it be nice if you could just have a single list of <It>cities</It>? Hypothetically, in order to do that, your program would need to know what a "city" is. It already knows what a string is, and it already knows what an integer is. These data types are built into the Python language. But it doesn't know what a <It>city</It> is. If we could somehow tell our program what a city is<Emdash/>that it's some sort of <It>thing</It> that has both a name, which is a string, and a population, which is an integer<Emdash/>then perhaps we could create a single list of cities themselves.</P>

      <P>And, indeed, we can do exactly that by making use of <Bold>classes</Bold>. A class is a custom, programmer-defined data type. That's right<Emdash/>beyond the built-in types of integers, strings, floats, booleans, and so on, we can create our <It>own</It> types of data by defining classes for them. Once a class has been defined, you can then create variables whose types <It>are</It> those classes. These are often referred to as <Bold>instances</Bold> of the given class. For example, once you have defined the <Code>City</Code> class, you can then proceed to create variables of type <Code>City</Code> (i.e., instances of the <Code>City</Code> class), just as you can create <Code>int</Code> variables, <Code>str</Code> variables, <Code>float</Code> variables, and so on. That also implies that we could create a list of cities, just as we can create a list of integers, a list of strings, a list of booleans, and so on. This idea is much more appealing than having two separate lists to store all the information about the cities.</P>

      <P>Classes are extremely powerful. They support all sorts of complex features like attributes (member variables), methods (member functions), inheritance, upcasting, polymorphism, and various metaprogramming techniques, as well as philosophies like encapsulation, information hiding, and so on. We'll talk about all these things throughout this course, but we'll keep it simple to start. For now, we'll only use classes in their most limited capacity: we'll use them to define so-called <Bold>plain-old-data (POD) types</Bold>. In other programming languages, these are often specifically referred to as <Bold>structure types</Bold>.</P>

      <P>A POD type is simply a class that declares <Bold>attributes (member variables)</Bold> and nothing else. An attribute is essentially a variable that exists <It>inside</It> another variable. Attributes are often said to establish <Bold>"has-a" relationships</Bold>. For example, in the program that we're trying to write, every city <Ul>has a</Ul> name, and every city <Ul>has a</Ul> population. So, when we define our <Code>City</Code> class in a moment, we should give it two attributes: 1) a name, and 2) a population. Then, whenever we create a variable of type <Code>City</Code>, it will automatically have two other variables <It>inside</It> it: 1) a name, and 2) a population. If we then create a list of cities, that single list will be capable of storing all the information that we need it to store; we'll no longer need two separate lists.</P>

      <P>To define a class that represents a simple POD type, use the following syntax:</P>

      <SyntaxBlock>{
`class <name>:
    <attribute 1 name>: <attribute 1 type>
    <attribute 2 name>: <attribute 2 type>
    ...
    <attribute N name>: <attribute N type>`
      }</SyntaxBlock>

      <P>Replace <Code>{'<name>'}</Code> with the name of the class (i.e., the name of the data type itself), replace each <Code>{'<attribute X name>'}</Code> with the name of an attribute that you want instances of the class to have, and replace the corresponding <Code>{'<attribute X type>'}</Code> with the type of that attribute.</P>

      <P>Let's put this information to use and start writing our program:</P>

      <PythonBlock fileName="classes.py">{
`# Define the City class
class City:
    name: str # Every city has a name, which is a string
    population: int # Every city has a population, which is an integer

def main() -> None:
    # ...
    

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>The above code defines the <Code>City</Code> class such that every city, in the context of our program, has a name and a population. Cities' names are represented as strings, and cities' populations are represented as integers.</P>

      <P>It's important that you understand that the above code does <Ul>not</Ul> actually create any instances of the <Code>City</Code> class. That's to say, we have not yet created any cities themselves. We have only defined what a city <It>is</It>: a city is simply a kind of variable that has two other (smaller) variables inside it<Emdash/>one representing the city's name and the other representing its population.</P>

      <P>Notice that the class's name, <Code>City</Code>, is capitalized. Indeed, PEP 8, the official style guide for Python code, recommends that all classes be named using PascalCase, meaning that a class's name shouldn't contain underscores, and each word in the class's name should start with an uppercase letter (e.g., <Code>MyCoolClass</Code>). This naming convention makes it easy to distinguish the name of a class from the name of a variable since, as per PEP 8, variables are generally named using snake_case. For example, <Code>City</Code> might be the name of a class, but <Code>city</Code> might be the name of a variable (possibly even an instance of the <Code>City</Code> class).</P>

      <P>Also notice that the <Code>City</Code> class is defined in the module (global) scope rather than being defined inside some particular function or another. While it's legal in Python to define a class inside a function, doing so would result in that class only being usable within said function's scope. We want to use the <Code>City</Code> class throughout our entire program<Emdash/>not just in a single function<Emdash/>so we define it in the module scope.</P>

      <P>Now that we've defined the <Code>City</Code> class, we can proceed to create instances of it (i.e., variables whose type is <Code>City</Code>). To create an instance of a class, sometimes referred to as <Bold>instantiating</Bold> the class, simply write out the name of the class followed by an empty pair of parentheses (almost as if you're calling a function). For example:</P>

      <PythonBlock fileName="classes.py" highlightLines="{7}">{
`# Define the City class
class City:
    name: str # Every city has a name, which is a string
    population: int # Every city has a population, which is an integer

def main() -> None:
    my_cool_city = City()
    

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>This syntax works for simple POD types, anyway. When we introduce constructors (<Code>__init__()</Code> methods) in a future lecture, the syntax for instantiating our classes will get slightly more complicated.</P>

      <P>Important detail: you'll often run into problems if you try to use a class before it has been defined (especially when type-annotating class instances). That's to say, the definition of a given class should usually appear before (i.e., above) any and all lines of code that use it in any way. This is why I defined the <Code>City</Code> class at the top of the program.</P>

      <P>So, <Code>City</Code> is a class, which is a custom, programmer-defined data type, and <Code>my_cool_city</Code> is an instance of the <Code>City</Code> class. The <Code>City</Code> class declares two attributes: 1) name, and 2) population. Attributes establish a has-a relationship. Putting all that together, <Code>my_cool_city</Code> is a variable that <It>has</It> two other smaller variables inside it: 1) <Code>name</Code>, and 2) <Code>population</Code>. Question: how do we access those smaller, internal variables?</P>

      <P>Enter the <Bold>dot operator</Bold>. To access a variable that is contained <It>within</It> another variable, write out the name of the outer / larger variable, followed by a dot (<Code>.</Code>), followed by the name of the inner / smaller variable:</P>

      <PythonBlock fileName="classes.py" highlightLines="{9-13}">{
`# Define the City class
class City:
    name: str # Every city has a name, which is a string
    population: int # Every city has a population, which is an integer

def main() -> None:
    my_cool_city = City()
    
    # Print the value of the name variable, which is an attribute
    # that's contained inside the my_cool_city variable (every City
    # instance has a 'name' attribute, which is a string, as declared
    # in the City class definition above).
    print(my_cool_city.name)

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Another question: What's printed by the above program? Well, as it currently stands, it actually throws an <Code>AttributeError</Code> and crashes when we try to print <Code>my_cool_city.name</Code>:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python classes.py 
Traceback (most recent call last):
  File "/home/alex/instructor/static-content/guyera.github.io/code-samples/pod-types/classes.py", line 16, in <module>
    main()
    ~~~~^^
  File "/home/alex/instructor/static-content/guyera.github.io/code-samples/pod-types/classes.py", line 13, in main
    print(my_cool_city.name)
          ^^^^^^^^^^^^^^^^^
AttributeError: 'City' object has no attribute 'name'
`
      }</TerminalBlock>

      <P>The error might seem a bit confusing: <Code>'City' object has no attribute 'name'</Code>. How can this be? After all, didn't we define the <Code>City</Code> class to have a <Code>name</Code> attribute? Moreover, if we run the above program through Mypy, it reports no errors whatsoever. Well, the reason for the wording of this runtime error is a bit complicated, and it has to do with the discrepancy between Python's extremely dynamic type system and Mypy's static type system. When we define the <Code>City</Code> class to have an attribute called <Code>name</Code> of type <Code>str</Code>, that's mostly just for Mypy's sake<Emdash/>it's telling Mypy that instances of the <Code>City</Code> class should, for the purposes of static analysis, be treated as having an attribute called <Code>name</Code> of type <Code>str</Code>. However, when we actually <It>run</It> the program, Mypy's static type system is irrelevant; all that matters is the Python interpreter's type system, which is entirely dynamic. The interpreter's type system does not care about attribute declarations within class definitions. It only cares about what variables are <It>actually created</It> at runtime, and what types they <It>actually have</It>.</P>

      <P>Although the <Code>name: str</Code> attribute declaration <It>says</It> that all <Code>City</Code> instances have a <Code>name</Code> attribute, notice that we never actually assigned a <It>value</It> to <Code>my_cool_city.name</Code>. And yet, we try to print it anyways<Emdash/>we're trying to print a variable that, from the perspective of the interpreter, has not yet been defined (even if it does exist from Mypy's perspective).</P>

      <P>That's all to say, you cannot use a variable if you have not yet defined it (i.e., given it a value at runtime), even if you have declared it (statically) as an attribute of a class. Attempting to do so results in a runtime error.</P>

      <P>So, before we can print <Code>my_cool_city.name</Code>, we have to give it a value. We can do this using the assignment operator, just like when assigning a value to any other kind of variable (remember: attributes are just variables that exist inside other variables). We should do the same thing for <Code>my_cool_city.population</Code> as well while we're at it:</P>

      <PythonBlock fileName="classes.py" highlightLines="{9-11,18-19,25-26}">{
`# Define the City class
class City:
    name: str # Every city has a name, which is a string
    population: int # Every city has a population, which is an integer

def main() -> None:
    my_cool_city = City()

    # Give our city a name and a population
    my_cool_city.name = "Chicago"
    my_cool_city.population = 2721000
    
    # Now that my_cool_city.name and my_cool_city.population have been
    # defined at runtime (not just statically declared), we can proceed
    # to use these variables however we'd like (e.g., print them to the
    # terminal, or do anything else that you might want to do with
    # a string or integer)
    print(my_cool_city.name)
    print(my_cool_city.population)

    # my_cool_city.population is an integer, so we can even use it
    # in mathematical operations if we'd like (again, it's just like
    # any other integer---it's just inside another, larger variable
    # called my_cool_city)
    print(f"Half of chicago's population is: "
        f"{my_cool_city.population / 2}")
          
if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Running the above program produces the following output:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python classes.py 
Chicago
2721000
Half of chicago's population is: 1360500.0
`
      }</TerminalBlock>

      <P>Because attributes do not exist from the interpreter's perspective until they're actually defined (assigned values at runtime), and because using an undefined attribute is a bug and results in an <Code>AttributeError</Code> being thrown, it's a good idea to always define your attributes as early as possible. For example, in the above program, we create <Code>my_cool_city</Code> and then <It>immediately</It> proceed to assign values to <Code>my_cool_city.name</Code> and <Code>my_cool_city.population</Code>. If we didn't do this <It>immediately</It><Emdash/>if we created <Code>my_cool_city</Code> but didn't define its attributes until several lines of code later (or even perhaps several functions later)<Emdash/>then there'd be a potentially large section of code in which <Code>my_cool_city</Code> is defined, but its attributes are not. If we accidentally attempted to use any of its attributes within that section of code, we'd get an <Code>AttributeError</Code>. Defining attributes early mitigates these sorts of mistakes, so it's generally a good idea.</P>

      <P>So, declaring an attribute but failing to define it results in an <Code>AttributeError</Code> when the attribute is used at runtime. But what about the other way around? What if you attempt to define an attribute (assign it a value) at runtime but forget to declare it (statically) within the class definition? Well, this also results in an error, but a completely different kind. It results in a static type error, as reported by Mypy:</P>

      <PythonBlock fileName="define_undeclared_attribute.py" highlightLines="{3,18}">{
`# Define the City class
class City:
    # Notice: I've now omitted the name attribute declaration
    population: int # Every city has a population, which is an integer

def main() -> None:
    my_cool_city = City()

    # Give our city a name and a population
    my_cool_city.name = "Chicago" # Static type error here
    my_cool_city.population = 2721000
    
    # Now that my_cool_city.name and my_cool_city.population have been
    # defined at runtime (not just statically declared), we can proceed
    # to use these variables however we'd like (e.g., print them to the
    # terminal, or do anything else that you might want to do with
    # a string or integer)
    print(my_cool_city.name)
    print(my_cool_city.population)

    # my_cool_city.population is an integer, so we can even use it
    # in mathematical operations if we'd like (again, it's just like
    # any other integer---it's just inside another, larger variable
    # called my_cool_city)
    print(f"Half of chicago's population is: "
        f"{my_cool_city.population / 2}")
          
if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>And here's the error reported by Mypy:</P>

      <TerminalBlock copyable={false}>{
`(env) $ mypy define_undeclared_attribute.py 
define_undeclared_attribute.py:10: error: "City" has no attribute "name"  [attr-defined]
define_undeclared_attribute.py:18: error: "City" has no attribute "name"  [attr-defined]
Found 2 errors in 1 file (checked 1 source file)
`
      }</TerminalBlock>

      <P>Funny enough, though, the above program <It>runs</It> just fine (and it produces the same output as it did before). Again, this is because of discrepancies between the interpreter's dynamic type system and Mypy's static type system. This may lead you to think that Mypy is being picky or pedantic. But don't be fooled<Emdash/>Mypy is right. Even though the above program runs and works, the code is flawed: as defined, cities do not have names, yet we're trying to assign a value to <Code>my_cool_city.name</Code> anyway. If Mypy allowed us to do this (as the Python interpreter does), then nothing would stop us from creating arbitrary attributes within arbitrary objects whenever we want. Imagine<Emdash/>if any object could have any attribute at any time, you'd have no way of knowing which objects have which attributes without scouring the entire codebase to figure out where those attributes <It>might</It> have been defined (or might not have, depending on, say, the conditions of various if statements at runtime). That would make Python programs incredibly hard to maintain. Mypy at least gives us some semblance of confidence about what variables and attributes might exist at any given point in time.</P>

      <P>And, as you know, the code you submit for your labs and assignments must pass through Mypy in strict mode without any errors being reported, or else you'll be penalized.</P>

      <P>(Before Python static analysis tools like Mypy saw widespread adoption in industry, many large-scale Python codebases were extremely hard to maintain. For example, they would frequently crash unexpectedly due to type errors that are now easily caught by Mypy and similar tools. Functions were often littered with dynamic type assertions as a messy, last-ditch effort to mitigate these sorts of issues.)</P>

      <SectionHeading id="type-annotating-class-instances">Type-annotating class instances</SectionHeading>

      <P>Suppose you want to pass an instance of a class as an argument to a function, or you want to return an instance of a class from a function. Then you'll need to know how to type-annotate such variables. As it turns out, it's trivial: just write the name of the class. And hopefully that makes sense. If you want a parameter to store an integer value, you type-annotate it as an <Code>int</Code>. If you want it to store a string value, you type-annotate it as a <Code>str</Code>. If you want it to store a city, you type-annotate it as a <Code>City</Code>.</P>

      <P>For example:</P>

      <PythonBlock fileName="print_city.py" highlightLines="{7}">{
`class City:
    name: str # Every city has a name, which is a string
    population: int # Every city has a population, which is an integer


# Given a city, print all of its information to the terminal
def print_city(city: City) -> None:
    print(f'City name: {city.name}')
    print(f'City population: {city.population}')


def main() -> None:
    my_cool_city = City()

    my_cool_city.name = "Chicago"
    my_cool_city.population = 2721000
    
    # Use the print_city() function to print the information about
    # my_cool_city
    print_city(my_cool_city)

          
if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Running the above program produces the following output:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python print_city.py 
City name: Chicago
City population: 2721000
`
      }</TerminalBlock>

      <P>Again, you'll run into issues if you try to type-annotate a class instance before the class itself has been defined. To avoid such issues, prefer to define classes near the top of your program / module, above any of the functions that use them.</P>

      <SectionHeading id="file-input-example">Example: Loading POD types via text I/O</SectionHeading>

      <P>At the start of this lecture, I said that our goal was to write a program that reads a list of cities and their information from a file, storing it all in a single list. Let's combine what we've learned in this lecture with what we learned in <Link href={`${PARENT_PATH}/${allPathData["file-io"].pathName}`}>the File I/O lecture</Link> to do just that. And for the sake of completeness, I'll even add a simple user interface so that the user can choose from a couple options to explore the data in a couple different ways (perhaps that's a bit overboard, but I like to throw in some larger examples every now and then):</P>

      <PythonBlock>{
`from typing import TextIO

class City:
    name: str # Every city has a name, which is a string
    population: int # Every city has a population, which is an integer


# Given a city, print all of its information to the terminal
def print_city(city: City) -> None:
    print(f'City: {city.name}')
    print(f'    Population: {city.population}')


# Given a file, read all of the cities' data from the file, and return
# a list of cities storing all that data.
def read_city_file(file: TextIO) -> list[City]:
    i = 1
    cities = []
    for line in file:
        if i >= 2: # Skip the first line in the file
            # Strip whitespace
            line = line.strip()

            # Extract tokens
            tokens = line.split(',')

            # Create a City variable, storing the name and population
            # values from the line inside its respective attributes
            city = City()
            city.name = tokens[0]
            city.population = int(tokens[1])

            # Append the City variable to our list of cities
            cities.append(city)

        i += 1 # Increment i by 1 (equivalent to 'i = i + 1')

    # The for loop is done. Return the list of cities parsed from the
    # file.
    return cities


# Prompts the user for an integer until they enter one that's valid,
# according to the given list of valid integers. See the Exceptions
# lecture notes for more information.
def prompt_for_integer_in_list(
        prompt: str, # Text to print when prompting the user
        valid_choices: list[int], # List of valid choices
        error_message: str # Text to print when given an invalid input
        ) -> int: # Returns the user's final, valid input
    supplied_valid_input = False
    while not supplied_valid_input:
        try:
            chosen_integer = int(input(prompt))
            if chosen_integer in valid_choices:
                supplied_valid_input = True
            else:
                print(error_message)
        except ValueError as e:
            print(error_message)
       
        print() # Print an empty line to make things easier to read

    return chosen_integer


def option_display_all_cities(cities: list[City]) -> None:
    for city in cities:
        print_city(city)
    print() # Print an empty line to make things easier to read


def option_search_city_by_name(cities: list[City]) -> None:
    chosen_name = input("Enter the city's name: ")
    
    found = False
    for city in cities:
        if city.name == chosen_name:
            # Found the city with the specified name. Print its
            # information
            print_city(city)
            found = True
            break # End the for loop

    if not found:
        print(f'Sorry, I don\\'t know anything about the city named '
            f'"{chosen_name}"')

    print() # Print an empty line to make things easier to read


def main() -> None:
    cities_file_name = input('Enter the name of the cities data '
        'file: ')

    quit_program = False

    try:
        with open(cities_file_name, 'r') as cities_file:
            cities = read_city_file(cities_file)
    except FileNotFoundError as e:
        print('Error: File not found')
        quit_program = True
    except OSError as e:
        quit_program = True
        print('Error: Failed to read the file')

    # If we failed to read the file, quit_program will already be True.
    # Otherwise, it'll be False until the user chooses to quit.
    while not quit_program:
        menu_text = ('What would you like to do?\\n'
            '    1. Display all cities\\n'
            '    2. Search cities by name\\n'
            '    3. Quit\\n'
            'Enter your choice: ')
        valid_choices = [1, 2, 3]
        input_error_message = 'Error: Invalid choice'
        
        users_choice = prompt_for_integer_in_list(
            menu_text,
            valid_choices,
            input_error_message
        )

        if users_choice == 1:
            option_display_all_cities(cities)
        elif users_choice == 2:
            option_search_city_by_name(cities)
        else:
            quit_program = True


if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Suppose there's a text file in our working directory named <Code>data.txt</Code> with the following content:</P>

      <TerminalBlock copyable={false}>{
`City,Population
Corvallis,61993
Eugene,178786
Salem,180406
Portland,635749
`
      }</TerminalBlock>

      <P>Then here's an example run of the above program:</P>

      <TerminalBlock copyable={false}>{
`Enter the name of the cities data file: data.txt
What would you like to do?
    1. Display all cities
    2. Search cities by name
    3. Quit
Enter your choice: 4
Error: Invalid choice

What would you like to do?
    1. Display all cities
    2. Search cities by name
    3. Quit
Enter your choice: jfda
Error: Invalid choice

What would you like to do?
    1. Display all cities
    2. Search cities by name
    3. Quit
Enter your choice: 1

City: Corvallis
    Population: 61993
City: Eugene
    Population: 178786
City: Salem
    Population: 180406
City: Portland
    Population: 635749

What would you like to do?
    1. Display all cities
    2. Search cities by name
    3. Quit
Enter your choice: 2

Enter the city's name: jfdsa
Sorry, I don't know anything about the city named "jfdsa"

What would you like to do?
    1. Display all cities
    2. Search cities by name
    3. Quit
Enter your choice: 2

Enter the city's name: Corvallis
City: Corvallis
    Population: 61993

What would you like to do?
    1. Display all cities
    2. Search cities by name
    3. Quit
Enter your choice: 3
`
      }</TerminalBlock>

      <P>The <Code>read_city_file()</Code> function reads (loads) a list of cities from the given text file using file input techniques. If we wanted to, we could create another function, say <Code>write_city_file()</Code>, that writes (saves) a given list of cities to a given text file (perhaps in the same comma-separated values format) using file output techniques. But the above example is already fairly long, so I'll leave this as an exercise for the reader.</P>

      <SectionHeading id="composition-of-objects">Composition of objects</SectionHeading>

      <P>Perhaps this is obvious, but there's no reason that an attribute within a POD-type object can't <It>also</It> be, say, a POD-type object. For example:</P>

      <PythonBlock fileName="composition.py">{
`class BusinessOwner:
    first_name: str
    last_name: str
    address: str
    phone_number: str

class Business:
    name: str
    # Every business has an owner, which is in turn a BusinessOwner
    # object
    owner: BusinessOwner

def main() -> None:
    # Suppose we want to create a Business object. Every Business
    # has an owner, so we'll start by creating the BusinessOwner
    jensen_huang = BusinessOwner()
    jensen_huang.first_name = 'Jensen'
    jensen_huang.last_name = 'Huang'
    jensen_huang.address = '123 GPU Way'
    jensen_huang.phone_number = '(555) 123-4567'

    # Now we can create a Business object
    nvidia = Business()
    nvidia.name = 'Nvidia Corporation'
    # Store the BusinessOwner object, jensen_huang, inside the 'owner'
    # attribute of the Business object, nvidia
    nvidia.owner = jensen_huang


if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Indeed, objects can be arranged into arbitrary compositions. The above program stores a <Code>BusinessOwner</Code> object as an attribute of a <Code>Business</Code> object. If we wanted, the <Code>Business</Code> object could further be stored as an attribute of <It>another</It> object, and so on.</P>

      <P>Suppose you want to print the first name of the owner of a given business. Here's one way to do that:</P>

      <PythonBlock fileName="composition.py" highlightLines="{29-34}">{
`class BusinessOwner:
    first_name: str
    last_name: str
    address: str
    phone_number: str

class Business:
    name: str
    # Every business has an owner, which is in turn a BusinessOwner
    # object
    owner: BusinessOwner

def main() -> None:
    # Suppose we want to create a Business object. Every Business
    # has an owner, so we'll start by creating the BusinessOwner
    jensen_huang = BusinessOwner()
    jensen_huang.first_name = 'Jensen'
    jensen_huang.last_name = 'Huang'
    jensen_huang.address = '123 GPU Way'
    jensen_huang.phone_number = '(555) 123-4567'

    # Now we can create a Business object
    nvidia = Business()
    nvidia.name = 'Nvidia Corporation'
    # Store the BusinessOwner object, jensen_huang, inside the 'owner'
    # attribute of the Business object, nvidia
    nvidia.owner = jensen_huang

    # You can chain dot operators to access objects within objects
    # within objects (and so on). The first dot operator reaches inside
    # the nvidia object to access its owner attribute. The second
    # dot operator reaches inside that owner object to access its
    # first_name attribute.
    print(nvidia.owner.first_name)


if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>However, in line with the Single Responsibility Principle (SRP), it'd be a better idea to create dedicated functions to facilitate such printing logic. In particular, the logic required to print the information of a <Code>BusinessOwner</Code> should probably be separated from that required to print the information of a <Code>Business</Code> (e.g., in case you ever need to print the information of just a <Code>BusinessOwner</Code> without the <Code>Business</Code>), which should in turn be separated from our program's other logic.</P>

      <P>You'll find that when you adhere to the SRP closely, it's often not necessary to chain dot operators together. For example:</P>

      <PythonBlock fileName="composition.py" highlightLines="{13-28,46-48}">{
`class BusinessOwner:
    first_name: str
    last_name: str
    address: str
    phone_number: str

class Business:
    name: str
    # Every business has an owner, which is in turn a BusinessOwner
    # object
    owner: BusinessOwner

# Prints the information about a given BusinessOwner
def print_business_owner(owner: BusinessOwner) -> None:
    print(f'Owner first name: {owner.first_name}')
    print(f'Owner last name: {owner.last_name}')
    print(f'Owner address: {owner.address}')
    print(f'Owner phone number: {owner.phone_number}')

# Prints the information about a given Business, including its owner
# (but delegates the printing logic for the owner to the
# print_business_owner function, in line with the SRP).
def print_business(business: Business) -> None:
    print(f'Business name: {business.name}')
    print(f'Business owner information:')
    # To print the owner's information, call the
    # print_business_owner function on this business's owner
    print_business_owner(business.owner)

def main() -> None:
    # Suppose we want to create a Business object. Every Business
    # has an owner, so we'll start by creating the BusinessOwner
    jensen_huang = BusinessOwner()
    jensen_huang.first_name = 'Jensen'
    jensen_huang.last_name = 'Huang'
    jensen_huang.address = '123 GPU Way'
    jensen_huang.phone_number = '(555) 123-4567'

    # Now we can create a Business object
    nvidia = Business()
    nvidia.name = 'Nvidia Corporation'
    # Store the BusinessOwner object, jensen_huang, inside the 'owner'
    # attribute of the Business object, nvidia
    nvidia.owner = jensen_huang

    # Print all the information about the business, including its
    # owner
    print_business(nvidia)


if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>With this rewrite, the logic for printing the owner's first name has been extracted to <Code>print_business_owner</Code>. Since this function only needs access to the <Code>BusinessOwner</Code> object rather than the entire <Code>Business</Code> object, there are no more chained dot operators.</P>

      <P>Chaining dot operators together isn't bad in and of itself, but it's sometimes a sign that a function has been given too many responsibilities, requiring it to operate on attributes at various levels in the object composition.</P>

      <SectionHeading id="references">References</SectionHeading>

      <P>When objects are passed around from place to place, be it via arguments and parameters, return values, or even just stored in other variables via the assignment operator, the objects' attributes behave a bit like list elements: modifying the object's attributes in one context also modifies them in the other context(s).</P>

      <P>For example, if an object is passed from one function A into another function B, and then function B proceeds to modify the attributes of the received object, that <It>also</It> modifies the attributes of the object that was passed in from function A:</P>

      <PythonBlock>{
`class City:
    name: str

def change(city: City) -> None:
    city.name = 'Las Vegas'

def main() -> None:
    my_city = City()
    my_city.name = 'Corvallis'
    change(my_city) # my_city.name is now 'Las Vegas'
    print(my_city.name) # Prints Las Vegas

if __name__ == '__main__':
    main()`
      }</PythonBlock>

      <P>As I mentioned, this isn't just the case with arguments and parameters. It even happens when an object stored in one variable is simply assigned to another variable:</P>

      <PythonBlock>{
`class City:
    name: str

def main() -> None:
    my_city = City()
    my_city.name = 'Corvallis'

    my_second_city = my_city # Here's the object assignment

    # This changes my_city.name as well!
    my_second_city.name = 'Las Vegas'

    print(my_city.name) # Prints Las Vegas

if __name__ == '__main__':
    main()`
      }</PythonBlock>

      <P>We'll discuss the reason for this in a future lecture (it turns out that variables are just references, and it's possible for many variables to refer to the same object), but for now, this is just something that you should be aware of, else you may accidentally introduce some very confusing bugs into your labwork and homework assignments.</P>

      <P>Here's a full example program to further illustrate this phenomenon. Please analyze it carefully:</P>

      <PythonBlock fileName="modifyingattributes.py">{
`class BusinessOwner:
    first_name: str
    last_name: str
    address: str
    phone_number: str

class Business:
    name: str
    owner: BusinessOwner

def foo(business: Business) -> None:
    # Modifies not just the attribute of the parameter, but also that of
    # the argument supplied in the function call
    business.name = 'Amazon'

def retrieve_owner(business: Business) -> BusinessOwner:
    # Reach inside the given Business object and retrieve its
    # owner attribute. Return it.
    return business.owner

def main() -> None:
    jensen_huang = BusinessOwner()
    jensen_huang.first_name = 'Jensen'
    jensen_huang.last_name = 'Huang'
    jensen_huang.address = '123 GPU Way'
    jensen_huang.phone_number = '(555) 123-4567'

    nvidia = Business()
    nvidia.name = 'Nvidia Corporation'
    nvidia.owner = jensen_huang

    foo(nvidia) # Changes nvidia.name to 'Amazon'
    print(nvidia.name) # Prints Amazon

    # This is also the case with return values.
    the_owner = retrieve_owner(nvidia)
    # If we now modify the attributes of the_owner, that will
    # ALSO modify the corresponding attributes of nvidia.owner
    the_owner.first_name = 'Jeff'
    print(nvidia.owner.first_name) # Prints Jeff

    # Actually, none of this really has anything to do with functions.
    # Even the original BusinessOwner object, jensen_huang, has
    # been modified.
    print(jensen_huang.first_name) # Prints Jeff

    # Similarly, modifying jensen_huang.first_name also modifies
    # nvidia.owner.first_name.
    jensen_huang.first_name = 'Jensen'
    print(nvidia.owner.first_name) # Prints Jensen
    
    # However, if we create a brand new BusinessOwner object, it'll
    # be separate. Modifying it won't modify the others, and vice
    # versa.
    jeff = BusinessOwner()
    jeff.first_name = 'Jeff'
    jeff.last_name = 'Bezos'
    jeff.address = '123 Amazon St'
    jeff.phone_number = '(555) 987-6543'

    print(jeff.first_name) # Prints Jeff
    print(jensen_huang.first_name) # Prints Jensen
    print(the_owner.first_name) # Prints Jensen
    print(nvidia.owner.first_name) # Prints Jensen


if __name__ == '__main__':
    main()
`
      }</PythonBlock>
      
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
