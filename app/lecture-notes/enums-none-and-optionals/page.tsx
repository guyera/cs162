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
        <Item><Link href="#enums">Enums</Link></Item>
        <Item><Link href="#optionals">Optionals</Link></Item>
      </Itemize>

      <SectionHeading id="enums">Enums</SectionHeading>

      <P>We've seen how classes can be a useful way to organize our code and related data. When we create a new instance of an object, we can change its attributes without affecting other instances. We can even encapsulate changes to our object attributes to ensure that all the data remains consistent. But sometimes it makes sense to restrict the possible instances that a class can be. For example, let's say we are building a calendar. You might create a class to store days of the week:</P>

      <PythonBlock copyable={false} showLineNumbers={false}>{
`class DayOfWeek:
    name: str
     
    def __init__(self, name) -> None:
        self.name = name
 `}</PythonBlock>

      <P>The calendar can instantiate a day for Monday with <Code>monday = DayOfWeek("Monday")</Code>. But it doesn't make sense to support any aribtrary day, because there are only 7 possible days in a week. We also probably want our <Code>monday</Code> instance to work for languages other than English. </P>

      <P>For cases where a class should only have specific possible instances, we use a special type called an <Code>Enum</Code>. An enum is an class which can be instantiated like any other class, with one big exception: the class can only have predefined instances. Defining our DayOfWeek class as an enum looks like:</P>

      <PythonBlock copyable={false} showLineNumbers={false}>{
`from enum import Enum

class DayOfWeek(Enum):
    MONDAY = "Monday"
 
print(DayOfWeek.MONDAY)
 `}</PythonBlock>

      <P>First we import the <Code>Enum</Code> class from Python's standard enum module. Next, when defining our class, we make it a subclass of <Code>Enum</Code>. Any attribute defined inside this enum will be an instance of DayOfWeek. We can't reassign these attributes to other values, or create new DayOfweek objects. Since they are essentially constants, we write their names in all uppercase like other constant values. Also note that each attribute has a string value, which is mostly to have a nice value to print. To complete the example with all days of the week:</P>

      <PythonBlock copyable={false} showLineNumbers={false}>{
`from enum import Enum

class DayOfWeek(Enum):
    MONDAY = "Monday"
    TUESDAY = "Tuesday"
    WEDNESDAY = "Wednesday"
    THURSDAY = "Thursday"
    FRIDAY = "Friday"
    SATURDAY = "Saturday"
    SUNDAY = "Sunday"
 
print(DayOfWeek.MONDAY)
 `}</PythonBlock>

      <P>You can use any string value you want for each enum as long as it is unique. You can write <Code>MONDAY = "Lundi"</Code> and your code will still work, because the MONDAY instance still exists. Python will raise an error if you try to create an instance with any value other than these 7. Enums are especially useful when you are writing functions that take parameters, because you can use enums to restrict the possible values that can be passed to your function. For example, let's say we are building a game and need to allow users to choose one possible action:</P>

      <PythonBlock copyable={false} showLineNumbers={false}>{
`def do_action(user_input: str) -> None
    if user_input is None:
        raise ValueError("Invalid input")
    elif user_input.lower() == "start":
        start_game()
    elif user_input == "continue":
        do_next_turn()
    elif user_input.lower() == "stop":
        end_game()
 `}</PythonBlock>

      <P>While the above code isn't wrong, it's also redundant and error-prone. Did you catch the bug processing <Code>continue</Code>? The underlying cause of the code complexity is that a string can contain values other than the allowed input. There are only 3 valid user actions: start, continue, stop. Let's code it as an enum instead:</P>

      <PythonBlock copyable={false} showLineNumbers={false}>{
`from enum import Enum

class Action(Enum):
    START = "start"
    CONTINUE = "continue"
    STOP = "stop"

def do_action(user_action: Action) -> None
  elif user_action == Action.START:
      start_game()
  elif user_action == Action.CONTINUE:
      do_next_turn()
  elif user_action == Action.STOP
      end_game()
 `}</PythonBlock>

      <P>Using enums to manage our game state made the code shorter, easier to read, and helps avoid bugs because we guarantee that the input must be one of the specific values. While the examples we have seen map a string value to each enum value (<Code>"start" for Action.START</Code>), but we haven't really used the string for anything. Sometimes it's useful to associate some data to each enum value, whether that data is a string label or an integer:</P>

      <PythonBlock copyable={false} showLineNumbers={false}>{
`from enum import Enum

class Action(Enum):
    START = 1
    CONTINUE = 2
    STOP = 3

class DayOfWeek(Enum):
    MONDAY = 1
    TUESDAY = 2
    WEDNESDAY = 3
    THURSDAY = 4
    FRIDAY = 5
    SATURDAY = 6
    SUNDAY = 7

print(DayOfWeek(1)) # will print DayOfWeek.MONDAY
`
 }</PythonBlock>

      <P>We have changed our previous examples to use integer values intead of strings. The actual enum values are the same (<Code>Action.START</Code>, <Code>DayOfWeek.MONDAY</Code>), but now we have an integer associated with each one. This integer can be used for determining order of values, or looking up a value by index, or other things your code might find useful. To access an enum's value, call it's <Code>value</Code> attribute:</P>

      <PythonBlock copyable={false} showLineNumbers={false}>{
`print(DayOfWeek.MONDAY.value)
`}</PythonBlock>

      <SectionHeading id="optionals">Optionals</SectionHeading>

      <P>There's a special primitive data type in Python that we haven't covered yet: <Code>NoneType</Code>. <Code>NoneType</Code> is the type of the <Code>None</Code> literal (in the same way that <Code>boolean</Code> is the type of the <Code>True</Code> and <Code>False</Code> literals, and <Code>int</Code> is the type of the literal <Code>100</Code>). <Code>NoneType</Code> is special in that <Code>None</Code> is the <Ul>only</Ul> value in all of Python whose type is <Code>NoneType</Code> (whereas there are two valid boolean values, billions of valid integer values, and so on).</P>

      <P>The purpose of the value <Code>None</Code> is to indicate the absence of data. This can be helpful for constructing variables that sometimes store actual values but sometimes don't. As a simple example, suppose you have a list of <Code>Person</Code> objects and want to retrieve the age of a person with a given name from the list. Naively, you might try something like this:</P>

      <PythonBlock copyable={false} showLineNumbers={false}>{
`for p in list_of_people:
    if p.name == 'Joe':
      found_age = p.age
      break

print(f"Joe's age is {found_age}")`
      }</PythonBlock>
        
      <P>But there's an issue with the above code: what happens if Joe is not present in <Code>list_of_people</Code>? Simple: <Code>found_age</Code> will never be defined, so the program will throw an exception (specifically an <Code>UnboundLocalError</Code>) and crash. Actually, MyPy will even report errors about the above code, stating something about being unable to infer the type of <Code>found_age</Code> because, in some contexts, it's not properly defined.</P>

      <P>There are various solutions to this issue. One solution is to store some sort of "dummy" value within <Code>found_age</Code> in the case that Joe is not present in the list. For example, a person's age should never be negative, so we might use the value of <Code>-1</Code> to indicate that Joe was not found in the list:</P>

      <PythonBlock copyable={false} showLineNumbers={false}>{
`found_age = -1
for p in list_of_people:
    if p.name == 'Joe':
      found_age = p.age
      break

if found_age != -1:
    print(f"Joe's age is {found_age}")`
      }</PythonBlock>

      <P>This technically works in this particular case, but it's messy for various reasons. For one, it only works because the <Code>int</Code> type supports negative values, but ages cannot be negative, so we can use those negative values as dummy values. If we were dealing with something other than ages that <It>could</It> be negative, this strategy wouldn't work; you wouldn't be able to distinguish a negative "dummy" value from a negative "real" value.</P>

      <P>Second, this strategy is problematic because the syntax of the code does not align with its semantics. That's to say, <Code>found_age</Code> being <Code>-1</Code> does not very clearly communicate that the person "Joe" could not be found within the list (this special, unintuive meaning of the value <Code>-1</Code> makes it a so-called "magic number", which are an infamous problem in many poorly designed codebases). This makes the code hard to understand.</P>

      <P>There are several other more reasonable solutions to this particular example, but the one that I want to highlight is the use of <Code>None</Code>. Indeed, the purpose of <Code>None</Code> is to indicate the absence of data. If Joe is not present in the list, then <Code>found_age</Code> should not store an age at all<Emdash/>it should store <It>nothing</It>. We can indicate this by assigning it the value <Code>None</Code>:</P>

      <PythonBlock copyable={false} showLineNumbers={false} highlightLines="{1,7}">{
`found_age = None
for p in list_of_people:
    if p.name == 'Joe':
      found_age = p.age
      break

if found_age is not None:
    print(f"Joe's age is {found_age}")`
      }</PythonBlock>

      <P>Important: Notice that I check whether <Code>found_age</Code> stores the value <Code>None</Code> via the syntax <Code>if found_age is not None</Code>. I did <Ul>not</Ul> use the <Code>!=</Code> operator. This is critical. In Python, the correct way to check whether a value <Code>x</Code> is <Code>None</Code> is via one of two syntaxes: a) <Code>if x is None</Code> (to check if <Code>x</Code> stores the value <Code>None</Code>), or b) <Code>if x is not None</Code> (to check if <Code>x</Code> does <It>not</It> store the value <Code>None</Code>). Using the <Code>==</Code> or <Code>!=</Code> operator to check for noneness <It>sometimes</It> works, but it's not completely reliable.</P>

      <P>The above code works while avoiding many of the issues with magic numbers and other dummy values. It also passes through Mypy without errors.</P>

      <P>The fact that it passes through Mypy without errors might surprise you. In the past, I've said that Mypy does not allow a variable's (static) type to change during the duration of a program. And yet, <Code>found_age</Code> clearly changes types throughout the above code: it starts out as <Code>None</Code>, which is of the special type <Code>NoneType</Code>, and then it changes to <Code>p.age</Code>, which is (presumably) of type <Code>int</Code>. The reason that Mypy is okay with this in this particular case is a bit complicated. Mypy treats <Code>found_age</Code> to be of a special case that can be <Code>None</Code>, or another value. In particular, the actual type of <Code>found_age</Code> is either an <Code>int</Code> or is it <Code>NoneType</Code>. This indicates that <Code>found_age</Code> is allowed to store either a) an integer value, or b) the value <Code>None</Code>.</P>

      <P>Python variables are not limited to a single type, like some other languages. In Python a variable can be one of many different types. For example, to define the type of <Code>found_age</Code> explicity by separating the different types with the <Code>|</Code> operator:</P>

      <PythonBlock copyable={false} showLineNumbers={false}>{
`found_age: None | int = None`
      }</PythonBlock>

      <P>We call this type a <Code>Union</Code>, because it is a union of multiple other types. You can union any types, and as many types, as you want. Generally, defining a variable as a union type is a design mistake and you can usually come up with a better approach, but <Code>None</Code> is a unique case. It is often useful to indicate that a variable may be <Code>None</Code> (in which case it needs to be checked) or will never be None (in which case you don't have to check for None because the static analyzer will enforce it).</P>

      <P>You can also use union for explicit type annotations. For example, suppose you want to write a function that returns the age of a person with a given name from a given list, returning <Code>None</Code> in the case that no such person is found (i.e., we want to move some of the above code into its own function). This means that the return type must be able to support both a) int values, and b) the value <Code>None</Code>. Hence, its return type should be <Code>int | None</Code>, so that's how it should be explicitly annotated:</P>

      <PythonBlock fileName="main.py">{
`from person import Person # A POD type

# Return type is int | None. If the person with the given
# name is found in the given list, this function returns their age
# as an integer. Otherwise, it returns None.
def age_of_person(
        name: str,
        list_of_people: list[Person]) -> int | None:
    for p in list_of_people:
        if p.name == name:
            return p.age

    # Person was not found. Return None
    return None

def main() -> None:
    my_people = []
    my_people.append(Person('Joe', 42))
    my_people.append(Person('Amanda', 17))

    chosen_name = input('Whose age would you like to search for?: ')

    # found_age's type is either an integer or None
    found_age = age_of_person(chosen_name, my_people)

    if found_age is None:
        # found_age is None, meaning the person couldn't be found
        print(f"Sorry, I don't know {chosen_name}'s age.")
    else:
        # found_age is not None, meaning the person was found.
        # Print their age.
        print(f"{chosen_name}'s age is {found_age}.")
    

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Notice we also defined our parameter as <Code>list[Person]</Code>, rather than <Code>list[Person | None]</Code>, so we know that every element in the list will be valid <Code>Person</Code> instance. The above program passes through Mypy with no errors, assuming <Code>Person</Code> is properly defined in <Code>person.py</Code>. Here are some example runs:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python main.py 
Whose age would you like to search for?: Joe
Joe's age is 42.
(env) $ python main.py 
Whose age would you like to search for?: Amanda
Amanda's age is 17.
(env) $ python main.py 
Whose age would you like to search for?: Sally
Sorry, I don't know Sally's age.
`
      }</TerminalBlock>

      <P>As I mentioned earlier, you can put whatever types you want in the type definition. They don't even have to be a primitive type, such as <Code>int</Code>. It can be any valid type. Knowing that, another improvement we could make to the above program's design is to have the function return the entire <Code>Person</Code> object with the given name rather than just returning their age. That would make the function support more flexible use cases:</P>

      <PythonBlock fileName="main.py" highlightLines="{11,14,28,30,36}">{
`from person import Person # A POD type

# Return type Person | None, meaning the return value
# will either be an Person or None. If the person with the given
# name is found in the given list, this function returns the Person
# object. Otherwise, it returns None.
def age_of_person(
        name: str,
        list_of_people: list[Person]) -> Person | None:
    for p in list_of_people:
        if p.name == name:
            return p

    # Person was not found. Return None
    return None

def main() -> None:
    my_people = []
    my_people.append(Person('Joe', 42))
    my_people.append(Person('Amanda', 17))

    chosen_name = input('Whose age would you like to search for?: ')

    # found_person's type is either a Person or None
    found_person = age_of_person(chosen_name, my_people)

    if found_person is None:
        # found_person is None, meaning the person couldn't be found
        print(f"Sorry, I don't know {chosen_name}'s age.")
    else:
        # found_person is not None, meaning the person was found.
        # Print their age.
        print(f"{chosen_name}'s age is {found_person.age}.")
    

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
