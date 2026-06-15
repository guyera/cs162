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
      <P>This lecture covers the following contents:</P>

      <Itemize>
        <Item><Link href="#maintainability">Maintainability</Link></Item>
        <Item><Link href="#encapsulation">Encapsulation</Link></Item>
        <Item><Link href="#coupling">Coupling</Link></Item>
        <Item><Link href="#reigning-in-coupling">Reigning in coupling</Link></Item>
        <Item><Link href="#private-attributes-and-methods">Private attributes and methods</Link></Item>
        <Item><Link href="#class-invariants">Class invariants</Link></Item>
        <Item><Link href="#getters-and-setters">Getters and setters</Link></Item>
      </Itemize>

      <SectionHeading id="maintainability">Maintainability</SectionHeading>

      <P>Most of our past lectures have served to teach you new language features that can be used to solve different kinds of computational problems. This lecture isn't so much about the technical details in solving computational problems as it is about the philosophy of software design.</P>

      <P>(Yes, this means that this lecture will be less code-heavy and more theory-heavy. Apologies in advance.)</P>

      <P>When you set out to write some code to solve a problem, there are often countless different approaches that would all <It>work</It>. Just take our labs and homework assignments, for example. Even in a class with hundreds of students, it's incredibly unlikely that two students would write the exact same code to solve one of these problems.</P>

      <P>When considering all these different approaches, how do we choose between them? What makes one approach "better" or "worse" than another? This is a natural question to ask, and software engineers have been thinking about it for decades. But it's a very complicated question with a very complicated answer; there are many properties that distinguish "good code" from "bad code" (so to speak). Sometimes, these properties can even run counter to one another in some sort of tradeoff, and the software engineer has to prioritize between them.</P>

      <P>But this isn't a software engineering course, so we don't have time to discuss the many properties of quality software design. Instead, we'll just focus on one of them: <Bold>maintainability</Bold>. As you might have guessed, maintainability describes how easy or hard it is to maintain a codebase, such as adding, removing, or changing features.</P>

      <P>Consider a video game that has two kinds of monsters: zombies and vampires. These monsters take turns attacking the player. Suppose the video game is wildly successful, so the developer decides to roll out a free update to the game. In this update, the developer would like to introduce a third kind of monster to the game: werewolves. Thinking about maintainability, an interesting question to ask is: how difficult is it for the developer to implement werewolves into the game? Does it require modifying hundreds of lines of code sprawled across tens of source code files? Or does it require modifying just ten lines of code across two source files? The latter case, which seems much more maintainable in this example, would likely be preferred, assuming the benefits from this maintainability outweigh the initial costs of designing and implementing the codebase to be maintainable to begin with (not to skip over <Link href="https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it">YAGNI</Link>; it has a place in this conversation as well).</P>

      <P>To be clear, maintainability is about much more than the number of lines of code that need to be modified in order to introduce a feature. It's also not the only important property of good software design. You might learn about these things in greater detail if you take some software engineering courses.</P>

      <SectionHeading id="encapsulation">Encapsulation</SectionHeading>

      <P>There are many tools and techniques that software engineers can use to improve a codebase's maintainability. One such tool is known as <Bold>encapsulation</Bold>. If you ask 100 software engineers exactly what "encapsulation" is, you'll get 100 different answers (partly for historical reasons<Emdash/>encapsulation has often been entangled with some other techniques, such as information hiding and message passing, so the definitions of these terms often get jumbled together in messy ways). But the definition I'm going to go with is as follows: encapsluation means co-location, or bundling together, of data with the behavior that operates on that data.</P>

      <P>The canonical example of encapsulation is classes and objects (but this certainly isn't the only example). Classes and objects are such a classic example of encapsulation that the term <Bold>object-oriented programming</Bold> is sometimes equated to encapsulation (depending on who you ask). As we've discussed, one common definition of objects, especially in the context of object-oriented programming, is a thing that has both state ("data"; e.g., attributes) and behavior (e.g., methods). The object's methods "operate on" (i.e., do things with) the object's attributes. Importantly, this data and behavior<Emdash/>the attributes and methods<Emdash/>are all defined in the same place: inside the class definition. Hence, the data (the attributes) are co-located (bundled) with the behaviors (the methods) that operate on that data. That's encapsulation.</P>

      <P>Take our <Code>Dog</Code> class, for example:</P>

      <PythonBlock fileName="dog.py">{
`class Dog:
    name: str
    birth_year: int

    def __init__(self, n: str, b: int) -> None:
        # n is the dog's name, and b is the dog's birth year.
        # Store them in self.name and self.birth_year
        self.name = n
        self.birth_year = b

    def print(self) -> None:
        print(f'{self.name} was born in {self.birth_year}')
`
      }</PythonBlock>

      <P>Every <Code>Dog</Code> object has two attributes: <Code>name</Code> and <Code>birth_year</Code>. Suppose we have a <Code>Dog</Code> object called <Code>spot</Code>, and we want to "operate on" <Code>spot</Code>'s attributes. This is what <Code>spot</Code>'s methods are for. For example, when we first create <Code>spot</Code>, we need to assign values to <Code>spot</Code>'s attributes. We do this with the constructor. And afterwards, we might want to print <Code>spot</Code>'s attributes to the terminal. We do this with <Code>spot</Code>'s <Code>print()</Code> method (i.e., <Code>spot.print()</Code>). These methods are defined next to (co-located with) the attributes that they operate on, so this is an example of encapsulation. </P>

      <P>We generally prefer encapsulation of data which belongs together. Data which is highly related should be grouped together, and data which is not very similar could potentially be part of a different class. The degree to which related data is encapsulated with each other and separate from unrelated data is called <Bold>cohesion</Bold>. We generally prefer code which is <Bold>higly cohesive</Bold>.</P>

      <SectionHeading id="coupling">Coupling</SectionHeading>

      <P>So, how can encapsulation be used to improve code maintainability? Well, it actually helps in a couple different ways:</P>

      <Enumerate listStyleType="decimal">
        <Item><P>Encapsulation can reduce coupling</P></Item>
        <Item><P>Encapsulation can enable class invariants</P></Item>
      </Enumerate>

      <P>Let's focus on coupling for now. <Link href="#class-invariants">We'll cover class invariants in a moment</Link>.</P>

      <P><Bold>Coupling</Bold>, like encapsulation, is a bit subjective. However, there is a theme among the various definitions: coupling, in some sense or another, refers to the case where changing one component of code requires changing one or more other components of code in turn. This is a somewhat vague definition, but it's good enough for our use case.</P>

      <P>If you ask 100 software engineers, you'll get 100 different definitions. (I once watched <Link href="https://www.youtube.com/watch?v=hd0v72pD1MI">an entire podcast</Link> about coupling and cohesion consisting of various highly regarded software engineers, including the likes of Kent Beck, Jim Weirich, and Ron Jeffries, and, even by the end of the podcast, they had mostly failed to agree on a unified definition of what these terms mean).</P>

      <P>Not all coupling is the same. For one, there are different degrees of coupling. If two components of code are <Bold>tightly coupled</Bold>, that means one is highly dependent on the other (and possibly vice-versa as well), so changing one will almost always require changing the other. In contrast, if two components of code are <Bold>loosely coupled</Bold>, that means they are only loosely dependent on one another, so changing one may or may not require changing the other.</P>

      <P>We generally prefer <Bold>loose coupling</Bold> over tight coupling.</P>

      <P>Coupling can also be <Bold>local</Bold> or <Bold>pervasive</Bold>. These are not widely accepted terms (I think I just made them up), but I think they're useful, so I'll use them anyways. Under my definitions, local coupling is when a small, controlled number of adjacent code components are coupled together, whereas pervasive coupling is when a given code component is coupled to countless other code components throughout the entire codebase (and, perhaps more importantly, pervasive coupling tends to get worse over time as the codebase gets more complex, but local coupling is mostly fixed; this is a result of <Link href="https://en.wikipedia.org/wiki/Open%E2%80%93closed_principle">Bertrand Meyer's open-closed principle</Link> of object-oriented software design).</P>

      <P>In many cases, coupling can make code hard to maintain (e.g., hard to change, hard to add to, hard to remove, etc). For example, suppose we have a class named <Code>Person</Code>, and every person has a name and an age:</P>

      <PythonBlock fileName="person.py">{
`class Person:
    name: str
    age: int

    def __init__(self, name: str, age: int) -> None:
        self.name = name
        self.age = age
`
      }</PythonBlock>

      <P>Suppose we also have a class named <Code>PersonDatabase</Code>, and every person database has a list of people (which is initially empty):</P>

      <PythonBlock fileName="persondatabase.py">{
`from person import Person

class PersonDatabase:
    people: list[Person]

    def __init__(self) -> None:
        self.people = []
`
      }</PythonBlock>

      <P>Now suppose that, throughout our program, we often find ourselves needing to add <Code>Person</Code> objects to one or more databases. For example, suppose we have several lines of code that look something like these:</P>

      <PythonBlock copyable={false} showLineNumbers={false}>{
`joe = Person("Joe", 42)
my_database.people.append(joe)

liang = Person("Liang", 23)
my_database.people.append(liang)

# And so on...`
      }</PythonBlock>

      <P>And perhaps, throughout our program, we occasionally find ourselves needing to retrieve the age of a person with a given name from the database. For example, suppose we have several blocks of code that look something like this:</P>

      <PythonBlock copyable={false} showLineNumbers={false}>{
`for p in my_database.people:
    if p.name == "Joe":
        print(f"Joe's age is {p.age}")
        break
`
      }</PythonBlock>

      <P>And lastly, perhaps, throughout our program, we occasionally find ourselves needing to retrieve the name of a person with a given age. For example, suppose we have several blocks of code that look something like this:</P>

      <PythonBlock copyable={false} showLineNumbers={false}>{
`print('People who are 42 years of age:')
for p in my_database.people:
    if p.age == 42:
        print(f'\\t{p.name}')
`
      }</PythonBlock>

      <P>Perhaps all the above code <It>works</It>, but consider: as this program grows in complexity (and perhaps becomes more successful / popular, garnering more users, etc), the size of the person databases will likely grow as well. In each of the above examples, <Code>my_database</Code> might have, say, millions of people in it. At a certain point, simply using a for loop to iterate over every single person in the database, looking for all the people with a given name or age, might no longer be a good idea; such for loops can be extremely slow when iterating over a gigantic list.</P>

      <P>So, when that day comes, how do we speed up the program? There are many techniques you will learn in your computer science education. In order to implement any optimizations, we'll almost surely have to rewrite most if not <It>all</It> of the above code.</P>

      <P>For example, one way of speeding up a searching process is to use a binary search rather than a linear search. We might discuss the binary search algorithm later on in the term, but to give you a very general idea, it's a searching algorithm that searches through a <Ul>sorted list</Ul> to find a given value. It's much faster than a naive for loop (i.e., a linear search). However, it requires that the list be sorted ahead of time. To use a binary search to find a person with a certain name, you'd need a list of people sorted (e.g., alphabetically) by their names. And to use a binary search to find the people with a given age, you'd need another <It>separate</It> list of people sorted (e.g., in ascending order) by their ages. To implement this idea, we'd have to rewrite both of the above for loops, replacing them with a binary search implementation. But beyond that, we'd also have to change how we add people to the database: 1) there would now be two lists of people instead of one (one sorted by name, and one sorted by age), so whenever we want to add a person to the database, we'd have to add them to <It>both</It> of these lists; and 2) we'd have to make sure to insert people in their correct places within the respective lists so that the lists remain sorted (as opposed to simply appending them to the list, as we do above). Indeed, this would require rewriting <It>all</It> of the above code.</P>

      <P>(There are other solutions as well, such as replacing our list with one or more dictionaries / hash tables, but that would have the exact same problem with regards to coupling.)</P>

      <P>But suppose that there are <It>hundreds</It> of places throughout our codebase where we add people to one or more person databases (i.e., lines of code that look something like <Code>my_database.people.append(joe)</Code>). If we need to change how we add people to databases (e.g., because we now have two lists instead of one, and because those lists need to remain sorted), then we need to make that change <It>everywhere</It>. That could require changing hundreds of lines of code, then. To a novice programmer, that might seem surprising. Indeed, to the untrained eye, <Code>my_database.people.append(joe)</Code> might look fairly innocuous, but it can actually lead to a maintainability nightmare.</P>

      <P>This is all a result of unchecked coupling. The lines of code such as <Code>my_database.people.append(joe)</Code> are tightly coupled to the representation of people within the <Code>PersonDatabase</Code> class. Hence, if we want to change that representation (e.g., to replace the unsorted <Code>people</Code> list with two separate sorted lists), we would also have to change those hundreds of lines of code that are coupled to it. Similarly, all our for loops that search through a <Code>PersonDatabase</Code>'s <Code>people</Code> list to find people with a certain name or age are <It>also</It> tightly coupled to this representation. So changing the representation would require rewriting all those for loops as well.</P>

      <P>In particular, this is an example of tight, pervasive coupling<Emdash/>many components of code sprawled throughout our entire codebase are tightly coupled to the representation of people within the <Code>PersonDatabase</Code> class. That makes it extremely difficult to change that representation; changing it would require changing the hundreds of other lines of code that are all coupled to it.</P>

      <P>You might also notice that the <Code>PersonDatabase</Code> class is not very well encapsulated. There are countless lines of code sprawled throughout the codebase that directly operate on the <Code>people</Code> attribute (e.g., <Code>my_database.people.append(joe)</Code>), and none of those lines of code are co-located (bundled) with the <Code>people</Code> attribute (i.e., none of those lines of code are in methods of the <Code>PersonDatabase</Code> class). We'll explore this more in the next section.</P>

      <SectionHeading id="reigning-in-coupling">Reducing coupling</SectionHeading>

      <P>I said that encapsulation can help "reduce" coupling, but what does that mean?</P>

      <P>First, understand that some coupling is inevitable. Your functions, data, and classes exist to interact with each other. At the very least, coupling occurs between all direct <Bold>dependencies</Bold>. A dependency is just a component of code that another component of code depends / relies on. Dependencies are <It>everywhere</It>. Whenever one function A calls another function B, that's a dependency<Emdash/>A depends on B. Whenever a class A defines an attribute of some other class type B, that's a dependency (again, A depends on B). Even within a single function, there are plenty of dependencies. If a line of code prints the value of the variable <Code>x</Code>, then that print statement depends on <Code>x</Code> having previously been defined<Emdash/>that's a dependency between two lines of code. This clearly cannot be avoided.</P>

      <P>Dependencies inevitably introduce coupling because in order to depend on something, you must interact with it. In particular, code components interact with one another through their <Bold>interfaces</Bold>. Definitionally, an interface is simply the part of a code component that other components need to know about in order to interact with it. Take this function, for example:</P>

      <PythonBlock copyable={false}>{
`def foo(a: int, b: int) -> int:
    return a + b * (a - b) ** 2.5`
      }</PythonBlock>

      <P>In order to call the <Code>foo</Code> function (i.e., in order to interact with it), you need to know its name, its parameter list, its return type, the meanings of its parameters and return value, the types of any exceptions it might throw, and so on. All of these things make up the <Code>foo</Code> function's interface. This is in contrast to the <Code>foo</Code> function's <Bold>implementation</Bold>. An implementation is simply the parts of a code component that <It>aren't</It> part of its interface. In the case of functions, the implementation is given by the function body (you don't need to know <It>how</It> <Code>foo</Code> works in order to call it<Emdash/>you only need to know <It>what</It> it does).</P>

      <P>Because dependencies interact with each other through their interfaces, changing a code component's interface requires changing how other components (specifically its dependents) interact with it (in contrast, changing a component's implementation generally does not require changing how other components interact with it). Keeping with our example, if I wanted to change the name of <Code>foo</Code> to <Code>bar</Code>, I'd have to change how I reference it in each and every <Code>foo</Code> function call. Or if I wanted to add a third parameter, I'd also have to add a third argument in each and every <Code>foo</Code> function call. (But if I wanted to change its <It>body</It><Emdash/>its implementation<Emdash/>I would not need to change how I call it). That's all to say, coupling inherently occurs at interfaces, and dependencies inherently interact with each other through their interfaces. Therefore, dependencies inherently create coupling, and this is inevitable.</P>

      <P>However, some coupling is essentially "unnecessary" and can be mitigated with better software design. For example, if a single block of code is copied and pasted many times over, then the coupling between it and its external dependencies is essentially replicated many times over as well. Moving the shared logic into a function and simply calling that function many times over can help reduce much of that unnecessary coupling.</P>

      <P>Next, understand that coupling is not inherently evil; it only makes code harder to change. But remember that there are various forms and degrees of coupling. A component of code that's subject to tight, pervasive coupling is going to be much harder to change than a component of code that's subject to loose, local couplng.</P>

      <P>With all that in mind, encapsulation can help us "reduce", or "manage" coupling in various ways:</P>

      <Enumerate listStyleType="decimal">
        <Item><P>It groups related things together (particularly, data and the behavior operating on that data), which keeps much of the relevant coupling contained in one place. This makes it easier to find all the coupled code that needs to be changed.</P></Item>
        <Item><P>By grouping related things together, it makes unnecessary coupling more apparent / easier to notice, which allows us to eliminate or reduce it.</P></Item>
        <Item><P>It can be enforced (strictly, in some programming languages) via <Link href="#private-attributes-and-methods">private attributes and methods</Link>, solidifying all the above points.</P></Item>
      </Enumerate>

      <P>I think the first point is fairly clear, and we'll discuss the third point in a bit, so let's focus on the second point. I think it'll make more sense with an example, so let's consider our <Code>PersonDatabase</Code> class. I said that it wasn't very well-encapsulated since it doesn't expose methods to operate on its <Code>people</Code> attribute. Instead, we simply operate on the <Code>people</Code> attribute directly from various places throughout our codebase (e.g., <Code>my_database.people.append(joe)</Code>). That's not encapsulation. Let's rewrite this class in a way that practices encapsulation. We'll start with an extremely naive rewriting of it; we'll take all the operations in our entire codebase that we're currently doing with the <Code>people</Code> attribute, and we'll move them each into their own method within the <Code>PersonDatabase</Code> class (yes, this will be painful, but bear with me):</P>

      <PythonBlock fileName="persondatabase.py">{
`class PersonDatabase:
    people: list[Person]

    def __init__(self) -> None:
        self.people = [] # Initially empty

    # Create a person named "Joe", aged 42, and add them to the
    # list of people
    def add_joe(self) -> None:
        joe = Person("Joe", 42)
        self.people.append(joe)
        
    # Create a person named "Liang", aged 23, and add them to the
    # list of people
    def add_liang(self) -> None:
        liang = Person("Liang", 23)
        self.people.append(liang)
        
    # ... And so on

    # Search for joe and print their age
    def print_joes_age(self) -> None:
        for p in self.people:
            if p.name == "Joe":
                print(f"Joe's age is {p.age}")
                return

    # Search for liang and print their age
    def print_liangs_age(self) -> None:
        for p in self.people:
            if p.name == "Liang":
                print(f"Liang's age is {p.age}")
                return
    
    # ... And so on

    # Search for people who are 42 years old and print their names
    def print_people_who_are_42(self) -> None:
        print('People who are 42 years of age')
        for p in self.people:
            if p.age == 42:
                print(f'\\t{p.name}')
`
      }</PythonBlock>

      <P>Now, suppose we want to create and add Joe, age 42, to <Code>my_database</Code>. Prevously, we did it like this:</P>

      <PythonBlock copyable={false} showLineNumbers={false}>{
`joe = Person('Joe', 42)
my_database.people.append(joe)`
      }</PythonBlock>

      <P>Practicing encapsulation, we'll now do it like this instead:</P>

      <PythonBlock copyable={false} showLineNumbers={false}>{
`my_database.add_joe()`
      }</PythonBlock>

      <P>Similarly, if we want to add Liang, age 23, to a person database, we can call the <Code>add_liang()</Code> method. If we want to find and print the age of Joe, we can call the <Code>print_joes_age()</Code> method. And so on.</P>

      <P>Again, I know the above class seems ridiculous. I'll get to that in just a second. For now, the goal is simply to avoid ever operating on (using) the <Code>people</Code> attribute from anywhere in our codebase that <It>isn't</It> a method of the <Code>PersonDatabase</Code> class. That is, the point is to practice encapsulation<Emdash/>when we want to operate on the <Code>people</Code> attribute, we do so from within a co-located (bundled) method of the very same class.</P>

      <P>Okay, let's address the elephant in the room: the above class definition is clearly ridiculous. Functions are supposed to be modular and reusable. The <Code>add_joe</Code> method is clearly not very modular nor reusable. It's only useful for one extremely specific thing: adding a person named Joe, age 42, to a given person database. The <Code>add_liang</Code> method suffers from the same problem, as do all of the <Code>print_XYZ_age</Code> methods as well as the <Code>print_people_who_are_42</Code> method.</P>

      <P>Indeed, these methods are ridiculous because they're not reusable, which requires us to copy and paste their internal logic whenever we want to accomplish a similar goal. But that's exactly my point: encapsulation makes all this repeated code extremely obvious. Again, to the untrained eye, <Code>my_database.people.append(joe)</Code> and <Code>my_database.people.append(liang)</Code> might not seem very problematic, even though they are (as we dicussed previously). But even a novice programmer should have no trouble recognizing how silly the <Code>print_people_who_are_42</Code> method is.</P>

      <P>The natural thing to do from here is refactor the above class implementation, making its methods much more modular. Let's do that:</P>

      <PythonBlock fileName="persondatabase.py">{
`from person import Person

class PersonDatabase:
    people: list[Person]

    def __init__(self) -> None:
        self.people = [] # Initially empty

    # Add any given person to the database (as opposed to always 
    # adding one hyperspecific person, such as Joe, age 42)
    def add_person(self, p: Person) -> None:
        self.people.append(p)

    # Print the age of a person with a given name (as opposed to always
    # searching for one hyperpsecific person)
    def print_age_of_person(self, name: str) -> None:
        for p in self.people:
            if p.name == name:
                print(f"{p.name}'s age is {p.age}")
                return

    # Search for people whose age matches a given value (as opposed to
    # always searching for people who are one hyperspecific age, like
    # 42).
    def print_people_with_age(self, age: int) -> None:
        print(f'People who are {age} years of age')
        for p in self.people:
            if p.age == age:
                print(f'\\t{p.name}')
`
      }</PythonBlock>

      <P>Now, suppose we want to create and add Joe, age 42, to <Code>my_database</Code>. We could do that like so:</P>

      <PythonBlock copyable={false} showLineNumbers={false}>{
`joe = Person('Joe', 42)
my_database.add_person(joe)`
      }</PythonBlock>

      <P>Similarly, we could find and print the age of someone named Liang via <Code>my_database.print_age_of_person('Liang')</Code>; we could print the names of every aged 42 via <Code>my_database.print_people_with_age(42)</Code>; and so on.</P>

      <P>Now all I have to do is convince you that this program design is better than what we started with, and hopefully you'll have a newfound appreciation of encapsulation. And I think that's pretty straightforward<Emdash/>let's revisit our previous example wherein we suddenly need to reimplement our searching strategy, again replacing the naive for loops with some sort of binary search, replacing the <Code>people</Code> list with two separate sorted lists, changing how we add people to a person database, and so on. Recall: in order to change how people are represented in <Code>PersonDatabase</Code>, we have to change all of the code throughout our codebase that's coupled to the <Code>people</Code> attribute. In our original program design, this would have meant changing hundreds of components of code sprawled throughout or codebase<Emdash/>components of code such as <Code>my_database.people.append(joe)</Code>, and various duplicated for loops that each searches through a database to find a person with a certain name or age.</P>

      <P>But now, things are much simpler. Now that everything's well-encapsulated, we can be confident that the only lines of code that are directly coupled to the <Code>people</Code> attribute must exist within the <Code>PersonDatabase</Code> class. After all, that's the entire point of encapsulation: behaviors that operate on data should be co-located (bundled) with that data, meaning that all functions that operate on the <Code>person</Code> attribute should be methods of the <Code>PersonDatabase</Code> class. And look<Emdash/>there's only four of them. Not hundreds of them. So if we update these four methods, that's sufficient.</P>

      <P>To be clear, encapsulation is not an inherent property of good software design. Rather, encapsulation is a tool that, in certain cases, can help manage coupling, and well-managed coupling is, in turn, a property of good software design. We'll revisit this idea at the end of the lecture.</P>

      <SectionHeading id="private-attributes-and-methods">Private attributes and methods</SectionHeading>

      <P>Encapsulation can be helpful toward managing coupling, but what's to stop us (or perhaps our naive coworker, or the newly hired intern) from breaking it? The whole point is that lines of code such as <Code>my_database.people.append(joe)</Code> can be problematic because they're tightly coupled to the representation of people within the <Code>PersonDatabase</Code> class (i.e., they're tightly coupled to the <Code>people</Code> attribute). And if such lines of code are sprawled throughout the entire codebase, then the representation of people suffers from tight, pervasive coupling, making it hard to change that representation should we ever need to (e.g., to support binary search, speeding up queries). Creating modular methods within the <Code>PersonDatabase</Code> class does not solve the problem<Emdash/>only removing those problematic lines of code will solve the problem. Yes, <Code>my_database.add_person(joe)</Code> serves as an <It>alternative</It> to <Code>my_database.people.append(joe)</Code>, but how do <It>prevent</It> us (or our coworker, or the intern) from writing <Code>my_database.people.append(joe)</Code> anyway? That is, how do we <It>enforce</It> encapsulation?</P>

      <P>Enter <Bold>private attributes</Bold>. A private attribute is an attribute of a class that may only be accessed by methods of that very same class. The alternative to a private attribute is a public attribute, which is an attribute that may be accessed from anywhere in the codebase.</P>

      <P>For example, if the <Code>people</Code> attribute was a private attribute of the <Code>PersonDatabase</Code> class (rather than a public attribute, as it is now), then it would only be accessible from within the four methods of the <Code>PersonDatabase</Code> class itself (<Code>__init__</Code>, <Code>add_person</Code>, <Code>print_age_of_person</Code>, and <Code>print_people_with_age</Code>). Hence, there would be no risk of statements such as <Code>my_database.people.append(joe)</Code> being sprawled across our entire codebase, breaking the encapsulation. That's to say, private attributes represent data (attributes) that can <It>only</It> be operated on by co-located behaviors (methods of the same class), thereby enforcing encapsulation.</P>

      <P>In Python, a private attribute is simply an attribute whose name starts with an underscore (<Code>_</Code>). Let's update the <Code>PersonDatabase</Code> class, making the <Code>people</Code> attribute private by renaming it to <Code>_people</Code>:</P>

      <PythonBlock fileName="persondatabase.py">{
`from person import Person

class PersonDatabase:
    people: list[Person]

    def __init__(self) -> None:
        self.people = [] # Initially empty

    # Add any given person to the database (as opposed to always 
    # adding one hyperspecific person, such as Joe, age 42)
    def add_person(self, p: Person) -> None:
        self.people.append(p)

    # Print the age of a person with a given name (as opposed to always
    # searching for one hyperpsecific person)
    def print_age_of_person(self, name: str) -> None:
        for p in self.people:
            if p.name == name:
                print(f"{p.name}'s age is {p.age}")
                return

    # Search for people whose age matches a given value (as opposed to
    # always searching for people who are one hyperspecific age, like
    # 42).
    def print_people_with_age(self, age: int) -> None:
        print(f'People who are {age} years of age')
        for p in self.people:
            if p.age == age:
                print(f'\\t{p.name}')
`
      }</PythonBlock>

      <P>Now, I've sort of just lied to you. In Python, there's technically no such thing as a "private attribute". However, it is well understood by the Python community, and indeed stated as guidance by the official style guide for Python code (PEP 8), that all attributes whose names start with an underscore are <It>meant</It> to be treated as private attributes and therefore <Ul>should not</Ul> be accessed from anywhere other than a method of the class that defines it (unless you're keen on getting into trouble). For example:</P>

      <PythonBlock fileName="main.py" highlightLines="{9-10,12-13}">{
`from person import Person
from persondatabase import PersonDatabase

def main() -> None:
    my_database = PersonDatabase()
    
    joe = Person('Joe', 42)

    # This is technically legal but extremely ill-advised:
    my_database._people.append(joe)

    # This is what you should do instead:
    my_database.add_person(joe)

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Heed the comments: you should generally avoid accessing private attributes (attributes whose names start with an underscore) from anywhere other than within a method of the class that defines those attributes. And if you go against this advice and access those attributes anyway, understand that this couples your code to those attributes' representations, and should those representations ever change, your code will break. This is especially important when interacting with code that is not your own (e.g., code from a library, or code written by a coworker). If an attribute is private, then the person who wrote that attribute does not intend for you to access it directly. If you do, and then they change the attribute's representation, breaking your code in the process, that's <It>your</It> fault<Emdash/>not <It>theirs</It> (it also opens you up to accidentally breaking <Link href="#class-invariants">class invariants</Link>, which would also be your fault). That's to say, ignore this advice at your own peril.</P>

      <P>In many other object-oriented programming languages (and programming languages that support encapsulation by other means), access to private attributes is strictly protected. Indeed, in C++, Java, C#, and countless other examples, attempting to access a private attribute from anywhere other than within a method of the class defining said attribute is considered to be a syntax error. But Python's philosophy with regards to encapsulation is a bit less "strict" (a common expression in the Python community is <Link href="https://mail.python.org/pipermail/tutor/2003-October/025932.html">"we're all consenting adults here"</Link>, meaning that you can access private attributes if you so choose, but you should know what you're getting yourself into).</P>

      <P>Just as a leading underscore in an attribute name indicates that it it's a private attribute, the same goes for methods: a method whose name starts with an underscore is meant to be treated as a private method. The rules for private methods are the same as those for private attributes: they should not be accessed from anywhere other than within <It>other methods</It> of the very same class.</P>

      <P>"Accessed", in this case, basically means "called". Indeed, methods can be called by other methods. Hopefully that isn't too surprising given that I've never told you anything that would suggest otherwise. But here's an example just in case:</P>

      <PythonBlock fileName="dog.py" highlightLines="{17-22}">{
`class Dog:
    name: str
    birth_year: int

    def __init__(self, n: str, b: int) -> None:
        # n is the dog's name, and b is the dog's birth year.
        # Store them in self.name and self.birth_year
        self.name = n
        self.birth_year = b

    def bark(self) -> None:
        print('Bark! Bark!')

    def print(self) -> None:
        print(f'{self.name} was born in {self.birth_year}')

        # Call the bark() method on the calling object. To clarify: the
        # calling object is a Dog object (it must be, given that this
        # print() method is a method of the Dog class). All Dog objects
        # additionally have a bark() method. That's the method that
        # we're calling here.
        self.bark()
`
      }</PythonBlock>

      <P>Given the above class, creating a <Code>Dog</Code> object, say <Code>spot</Code>, and executing <Code>spot.print()</Code> would print Spot's name and birth year to the terminal followed by "Bark! Bark!" as a result of the <Code>self.bark()</Code> call at the bottom of the <Code>Dog</Code> class's <Code>print</Code> method.</P>

      <P>As I was saying, methods can be made private in the same way that attributes can be made private:</P>

      <PythonBlock fileName="dog.py" highlightLines="{11,17}">{
`class Dog:
    name: str
    birth_year: int

    def __init__(self, n: str, b: int) -> None:
        # n is the dog's name, and b is the dog's birth year.
        # Store them in self.name and self.birth_year
        self.name = n
        self.birth_year = b

    def _bark(self) -> None:
        print('Bark! Bark!')

    def print(self) -> None:
        print(f'{self.name} was born in {self.birth_year}')

        self._bark()
`
      }</PythonBlock>

      <P>This indicates that the <Code>_bark</Code> method should not be called from anywhere other than within <It>another</It> method of the <Code>Dog</Code> class. For example, it's okay for the <Code>Dog</Code> class's <Code>print</Code> method to in turn call the <Code>_bark</Code> method, and it's okay for, say, the <Code>main()</Code> function to call <Code>spot.print()</Code>, but it would <Ul>not</Ul> be okay for the <Code>main()</Code> function to directly call <Code>spot._bark()</Code>.</P>

      <P>The purpose of private methods is the same as that of private attributes. It enforces encapsulation, allowing you to change the representations of private methods (e.g., changing their names, parameter types, return types, etc) while being confident that such changes will not break anything outside the class because, outside the class, those methods should not be used directly. It can also helps with the protection of class invariants, as we'll discuss momentarily.</P>

      <P>Important: In this course, you should never access a private attribute or method of a class from anywhere other than within a method of the very same class. Even though Python and even Mypy technically allow it, it's ill-advised, and doing so may result in a grade penalty.</P>

      <SectionHeading id="class-invariants">Class invariants</SectionHeading>

      <P>Besides reigning in coupling, encapsulation, supported by private attributes and methods, helps with something else as well: it allows us to establish <Bold>class invariants</Bold>. To be invariant means to not change. A class invariant, then, is a property of a class<Emdash/>or rather, of an object<Emdash/>that never changes.</P>

      <P>Consider a simple video game. The player might have a certain amount of hitpoints (HP; e.g., when it drops to zero, the player loses). Perhaps the player's HP can go up and down<Emdash/>up when they acquire a healing item, and down when they're attacked by an enemy. But one property should remain constant: the player's HP may never exceed some maximum value. For example, perhaps they begin the game with 10 HP, and it can never exceed that starting value. Or maybe there are opportunities for the player's max HP to be increased (e.g., by leveling up), but their HP should still not exceed their max HP at any give point in time.</P>

      <P>To implement such a system, you'd surely need two separate variables: one to store the player's HP, and one to store their max HP. But how do you prevent the value of the HP variable from <It>ever</It> exceeding value of the max HP variable? Well, you have to be very careful: whenever you increase the player's HP, make sure to clip it down to the max if it would otherwise exceed that max. Fine, but if the player's HP variable is accessible from everywhere in the entire codebase, you<Emdash/>or your coworker, or the intern<Emdash/>are likely to mess up at some point. Eventually, <It>someone, somewhere</It> will write a line of code that says (for example) <Code>player.hp += 1</Code>, forgetting to clip it down to <Code>player.max_hp</Code> after the fact.</P>

      <P>But encapsulation, and enforcement thereof, helps prevent such bugs by establishing class invariants. Consider this simple example of a <Code>Player</Code> class implementation:</P>

      <PythonBlock fileName="player.py">{
`# This class should have two class invariants:
# 1. The player's HP should never exceed their max HP
# 2. The player's HP should never be negative
class Player:
    _max_hp: int
    _hp: int

    def __init__(self, max_hp: int) -> None:
        # The player should start out with a positive amount of HP.
        # This helps preserve the second class invariant above.
        if max_hp <= 0:
            raise ValueError('max_hp must be positive!')

        self._max_hp = max_hp
        self._hp = max_hp # The player starts out with maximum HP

    # Adjusts the player's health by the specified amount (positive
    # amount heals the player, negative amount damages the player)
    def adjust_health(self, amount: int) -> None:
        self._hp += amount

        if self._hp > self._max_hp:
            # Preserve the first class invariant
            self._hp = self._max_hp
        elif self._hp < 0:
            # Preserve the second class invariant
            self._hp = 0
`
      }</PythonBlock>

      <P>The above <Code>Player</Code> class has two class invariants: 1) the player's HP cannot exceed their maximum HP, and 2) the player's HP cannot be negative. And, indeed, looking at the class's methods, it seems that those invariants hold true. When a <Code>Player</Code> object is first created, the constructor requires that their starting HP (which is also their max HP) be positive. From there, the only way to modify the player's HP is via the <Code>adjust_health</Code> method, which has some if statements to ensure that their HP is not adjusted to be larger than their max HP nor smaller than 0. This means that you can be fairly confident that the program will never have <It>any</It> bugs that cause the player to have an invalid amount of HP.</P>

      <P>Well, that's <It>almost</It> true. There is of course one way to break this class invariant: by directly accessing and modifying a player object's private <Code>_hp</Code> and / or <Code>_max_hp</Code> attributes from some other, external part of the codebase. But assuming that doesn't happen (and it shouldn't, because directly accessing private attributes from outside the class's methods is extremely ill-advised), such bugs cannot occur.</P>

      <P>Protecting your whole codebase, including parts that will be written by other people, from an entire <It>category</It> of possible bugs is an extremely powerful idea. This is, again, only possible by making use of encapsulation and supporting it with private attributes and methods.</P>

      <SectionHeading id="getters-and-setters">Getters and setters</SectionHeading>

      <P>I'd be remiss if I didn't mention and extremely common "trick" when working with encapsulation and private attributes: <Bold>getters</Bold> and <Bold>setters</Bold>. A getter is simply a method that returns ("gets") the value of a private attribute contained within an object. A setter is simply a method that allows you to modify ("sets") the value of a private attribute contained within an object. In many cases, getters start with the prefix <Code>get_</Code>, and setters start with the prefix <Code>set_</Code>. But this is by no means a requirement.</P>

      <P>Consider the following example:</P>

      <PythonBlock fileName="circle.py">{
`class Circle:
    _radius: float
    
    def __init__(self, radius: float) -> None:
        self._radius = radius

    # Getter for the _radius attribute
    def get_radius(self) -> float:
        return self._radius

    # Setter for the _radius attribute
    def set_radius(self, value: float) -> None:
        self._radius = value
`
      }</PythonBlock>

      <P>The <Code>_radius</Code> attribute is private to the <Code>Circle</Code> class, meaning that we're not supposed to directly access it from anywhere other than within methods of the <Code>Circle</Code> class itself. But what if we <It>want</It> to be able to access it in such places, perhaps for arbitrary / flexible use cases? Then we can use the <Code>Circle</Code> class's getters and setters (they're public methods<Emdash/>not private ones<Emdash/>so we can call them from anywhere):</P>

      <PythonBlock fileName="main.py" highlightLines="{7-10,12-15}">{
`from circle import Circle

def main() -> None:
    # We create a circle with radius 5
    c = Circle(5.0)

    # Later, suppose we want to change the circle's radius. We
    # can't access c._radius directly, but we can call c.set_radius()
    # to modify it
    c.set_radius(10.0)

    # Later, suppose we want to get the circle's radius, such as to
    # print it. We can't access c._radius directly, but we can call
    # c.get_radius() to retrieve its current value
    print(c.get_radius()) # Prints 10.0

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>A common question is, "what's the difference between making an attribute private that's accessible via getters and setters versus simply making it public to begin with?" It's an important question. Indeed, getters and setters <It>can</It> undo some of the benefits of encapsulation (some people even say they "break" encapsulation outright). That shouldn't be surprising; the idea of encapsulation is to only access attributes from within co-located methods, and making the attributes private supports that goal. Meanwhile, getters and setters allow <It>near</It> arbitrary access to an otherwise private attribute from anywhere in the entire codebase<Emdash/>that sounds like the opposite of encapsulation.</P>

      <P>However, making an attribute private and accessing it via getters and setters isn't <It>quite</It> the same thing as making it public. For example, suppose that, one day, I decide that I want to modify the <Code>Circle</Code> class, replacing its <Code>_radius</Code> attribute with a <Code>_diameter</Code> attribute. This seems like an innocuous change, but once again, this will break every line of code in the codebase that directly accesses the <Code>_radius</Code> attribute. If the <Code>_radius</Code> member were public and accessed from all over the place, that could break hundreds or thousands of lines of code. But in this case, it just breaks three lines of code: one in each of the three <Code>Circle</Code> class methods. And we can fix those lines of code easily:</P>

      <PythonBlock fileName="circle.py">{
`class Circle:
    _diameter: float
    
    def __init__(self, radius: float) -> None:
        self._diameter = radius * 2 # Diameter = 2 * specified radius

    # Getter for the radius
    def get_radius(self) -> float:
        return self._diameter / 2 # Radius = diameter / 2

    # Setter for the radius
    def set_radius(self, value: float) -> None:
        self._diameter = value * 2 # Diameter = 2 * specified radius
`
      }</PythonBlock>

      <P>Indeed, although the <Code>Circle</Code> class no longer has an attribute to store its radius, that's not to say that a circle's radius can't be <It>computed</It> from its other attributes, or that its other attributes can't be <It>computed</It> from a given radius (in this case, its <Code>_diameter</Code> attribute can be converted to or from a radius value). Hence, the <Code>get_radius</Code> and <Code>set_radius</Code> methods can be kept around, and we didn't even need to change their headers (their names, parameter lists, return types, etc); we just needed to reimplement their bodies.</P>

      <P>In this small example, this means that <Code>main.py</Code> doesn't need to be updated whatsoever. It still works exactly as written before. Here it is again for your convenience:</P>

      <PythonBlock fileName="main.py">{
`from circle import Circle

def main() -> None:
    # We create a circle with radius 5
    c = Circle(5.0)

    # Later, suppose we want to change the circle's radius. We
    # can't access c._radius directly, but we can call c.set_radius()
    # to modify it
    c.set_radius(10.0)

    # Later, suppose we want to get the circle's radius, such as to
    # print it. We can't access c._radius directly, but we can call
    # c.get_radius() to retrieve its current value
    print(c.get_radius()) # Prints 10.0

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>That may seem like a small deal. But in a much larger program, it's a huge deal<Emdash/>only needing to make changes to the <Code>Circle</Code> class, and being able to leave the entire rest of our codebase intact, is hugely beneficial for maintainability.</P>

      <P>This is proof that using private attributes and accessing them via getters and setters can be better than using public attributes when it comes to coupling. However, again, getters and setters <It>do</It> still reduce the benefits of encapsulation because, in general, they provide <It>nearly</It> the same kind of unrestricted access as simply making the attributes public. This can, in some cases, open up the attribute to loose but pervasive coupling with the rest of the codebase. We didn't run into any issues in the above example, but there's a simple reason for that: when we changed the getters and setters, we only changed their implementations<Emdash/>not their interfaces. As we discussed earlier, coupling occurs at interfaces, so changing an implementation while leaving the interface alone typically does not require making any changes to external dependents.</P>

      <P>It's not too hard to construct alternative examples where getters and setters can cause major problems, though. As a simple one, suppose that you want to remove an attribute from a class altogether, perhaps because you've decided that you no longer need to store its information anywhere. In such a case, if you have a getter for the attribute, then the getter cannot simply be reimplemented<Emdash/>it'd have to be removed entirely, which clearly constitutes an interface change (information cannot be retrieved, or "gotten", if it does not exist). But removing the getter would break all lines of code that call it, and since getters are (typically) public methods, they might be called from hundreds or thousands of places sprawled throughout the codebase. Indeed, this is a kind of coupling issue that can be caused by getters (setters are often even worse).</P>

      <P>(Getters and setters can also break a class's invariants, especially if you're not careful about how you implement them.)</P>

      <P>Still, getters and setters can be useful tools; don't treat them as if they're inherently evil. As in our <Code>Circle</Code> example, they can occasionally offer <It>some</It> useful protection against coupling (when compared to public attributes), even while providing nearly arbitrary access to an object's internal state. Nearly arbitrary access can be useful in some contexts (e.g., when implementing custom data structures; getters and setters are basically unavoidable in such cases since arbitrary access to a data structure's internal contents is necessary by definition).</P>

      <P>Given their complicated tradeoffs, exactly <It>when</It> to define getters and setters (and how to design "good classes" in general) is a complicated question, and the answer is largely a matter of opinion, so that discussion is beyond the scope of this course. But if you're curious, I have tons of thoughts on the matter, and I'd be thrilled to have a conversation with you in my office hours. And if you like to research on your own, I recommend starting with: 1) the difference between interface and implementation; 2) "Tell Dont Ask" (e.g., see <Link href="https://martinfowler.com/bliki/TellDontAsk.html">Martin Fowler's article</Link>, which I'm partial to); and 3) <Link href="https://en.wikipedia.org/wiki/SOLID">SOLID</Link>.</P>
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
