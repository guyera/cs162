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
        <Item><Link href="#objects-and-references">Objects and references</Link></Item>
        <Item><Link href="#copies">Copies</Link></Item>
      </Itemize>

      <SectionHeading id="objects-and-references">Objects and references</SectionHeading>

      <P>When I defined the term "object", I offered a few different definitions:</P>

      <Enumerate>
        <Item><P>An instance of a class</P></Item>
        <Item><P>A thing with both state and behavior (e.g., an instance of a class that has both attributes and methods)</P></Item>
        <Item><P>Any value (or, more rigorously, anything that stores a value)</P></Item>
      </Enumerate>

      <P>Clearly, these definitions are not all identical, but they're all valid depending on the context. In the Python language specification, the third definition is used: an object is simply <It>any value</It>, regardless of the type of that value. This means that, from the perspective of the Python language specification, even integer values such as <Code>5</Code> and <Code>-100</Code> are objects.</P>

      <P>But what's perhaps even more interesting is how Python defines and deals with variables. In many programming languages, a variable is a named location in the computer's memory in which a value of a certain type can be stored. In such languages, mechanisms that serve to modify the values of variables, such as assignment operators, simply tell the computer to go to the location represented by the variable and modify the value contained within it. But the story is very different in Python. In Python, each and every variable is actually a named <Bold>reference</Bold> to an object (under the aforementioned definition of "object"; i.e., a value). And in Python, variables do not have fixed locations<Emdash/>objects do. Mechanisms such as the assignment operator, then, do not modify the value (object) stored at a fixed location. Rather, they modify the variable (reference) to refer to a <It>new</It> location.</P>

      <P>Formally, a reference is just something that refers, or "points", to a certain object. But technically, references usually work by way of <Bold>memory addresses</Bold>. As a program executes, it needs a place to store its data. In most cases, that place is the computer's <Bold>memory</Bold> (usually random access memory, or RAM for short). A memory address is just a number that represents a certain place in the computer's memory. A reference is essentially a memory address: it refers to a certain location in the computer's memory, at which a certain object is stored.</P>

      <P>Consider house addresses as an analogy. A house address is a string of text that represents the location of a house. If you were to go to the that location, you'd (hopefully) find the house itself. Similarly, a memory address is a string of <It>bits</It> (i.e., a number) that represents the location of an object. If you were to go to that location in the computer's memory, you'd find the object itself.</P>

      <P>Variables are named references, and references are essentially memory addresses. <Code>y = x</Code> does not copy an object<Emdash/>it copies a reference, meaning a memory address. The result is that <Code>y</Code> and <Code>x</Code> are two separate copies of the same memory address. If you were to go to the location in memory referenced by <Code>x</Code>, that's the exact same location as the one referenced by <Code>y</Code>. Hence, they both "refer" to the same object.</P>

      <P>Take the following program, for example:</P>

      <PythonBlock copyable={false}>{
`x = 5
print(x)
x = 6
print(x)
x -= 4
print(x)
y = x
print(y)`
      }</PythonBlock>

      <P>We might describe line 1 as creating a variable <Code>x</Code> and storing the value <Code>5</Code> inside it. But in Python, that's not how things actually work. Rather, line 1 creates an integer object to store the value <Code>5</Code>, and then it creates a variable <Code>x</Code> that <It>refers</It> to that object (i.e., stores the memory address of that object). Similarly, line 2 does not print the value stored within <Code>x</Code>. Rather, it prints the value of the object that the variable <Code>x</Code> currently <It>refers</It> to.</P>

      <P>I'll explain why this matters in a moment. For now, let's just trace the rest of the above code to make sure we understand what's going on. Line 3 does not modify the value stored within <Code>x</Code>. Rather, it changes <Code>x</Code> to refer to a new, completely separate object: <Code>6</Code>. Line 4 then prints the value of that object. Line 5 is a bit more interesting. Recall that <Code>x -= 4</Code> is equivalent to <Code>x = x - 4</Code>. What line 5 does, then, is 1) retrieve the value of the object that <Code>x</Code> currently refers to (i.e., <Code>6</Code>); 2) subtract <Code>4</Code> from that value, computing the result (<Code>2</Code>) and storing it in a new object; and 3) change <Code>x</Code> to refer to that new object. Line 6, again, simply prints the value of that object.</P>

      <P>Line 7 is particularly interesting, and it illustrates the reason that all this matters: because no new values are written nor computed in line 7, it does not create any new objects whatsoever. Rather, all it actually does is create a new variable <Code>y</Code> and set it up to refer to the same object that <Code>x</Code> currently refers to. That's to say, by the time the program reaches line 8, you might think that there are two integers that both store the value <Code>2</Code>, but you'd be wrong. Rather, there is a single integer object storing the value 2, and there are two separate variables<Emdash/><Code>x</Code> and <Code>y</Code><Emdash/>that both refer to that single integer.</P>

      <P>I can prove that this is the case. In a Python program, every object that's ever created has a unique identifier, and an object's identifier can be retrieved via the <Code>id()</Code> function. It accepts a single argument, being the object whose identifier you'd like to retrieve, and it returns the identifier of that object. If you pass a variable as the argument, it returns the value of the object that that variable refers to.</P>

      <P>Object identifiers are just large integers that uniquely identify objects, so, like other integers, they can be printed to the terminal. Let's update the above code, making it print the identifiers of the integer objects rather than the values of the integer objects:</P>

      <PythonBlock fileName="main.py">{
`def main() -> None:
    x = 5
    print(id(x))
    x = 6
    print(id(x))
    x -= 4
    print(id(x))
    y = x
    print(id(y))

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Here's one possible example run of the above program:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python main.py 
140459534906288
140459534906320
140459534906192
140459534906192
`
      }</TerminalBlock>

      <P>There are a couple important things to notice here. For one, whenever the value of <Code>x</Code> changes, its identifier changes as well. Indeed, when its value is <Code>5</Code>, its identifier is <Code>140459534906288</Code>, but when its value is <Code>6</Code>, its identifier is <Code>140459534906320</Code> (and its identifier changes again when its value changes to <Code>2</Code>). This is because, as I explained, <Code>x = 6</Code> does not change the value "stored within <Code>x</Code>". Rather, it creates a new object to store the value 6, and it changes <Code>x</Code> to refer to that object (instead of referring to the object storing the value <Code>5</Code>). After that point, <Code>id(x)</Code> retrieves the identifier of the object storing the value <Code>6</Code> instead of the object storing the value <Code>5</Code>. These are two different objects, so they have two different identifiers. (And, again, this happens a second time due to <Code>x -= 4</Code>).</P>

      <P>Second, notice that the last two printed identifiers are the same. The second to last identifier is that of <Code>x</Code> when its value is <Code>2</Code>, and the last identifier is that of <Code>y</Code> after assigning <Code>y = x</Code>. This is because, as I explained, <Code>y = x</Code> does not store the value of <Code>x</Code> inside <Code>y</Code>. Rather, it creates <Code>y</Code> and tells it to refer to the object that <Code>x</Code> currently refers to. Hence, <Code>x</Code> and <Code>y</Code> refer to the same object, so <Code>id(x)</Code> and <Code>id(y)</Code> return the same identifiers.</P>

      <P>An important conclusion can be drawn from all this: <Ul>all primitive-type objects are immutable (constant) in Python</Ul>. Indeed, the values of primitive objects cannot possibly be changed. <Code>x = 6</Code>, for example, does not change the value of the underlying object from <Code>5</Code> to <Code>6</Code>, nor does <Code>x -= 4</Code> change the value of the underlying object from <Code>6</Code> to <Code>2</Code>. Rather, each of these operations create new objects to store the newly computed values, and then they update the variable on the left (<Code>x</Code>) to refer to those new objects.</P>

      <P>(Note for the curious reader: The Python interpreter is actually allowed to "reuse" existing objects for primitive-type expressions that resolve to the same value as said object. For example, if, at the end of the program, I wrote <Code>z = 2</Code> followed by <Code>print(id(z))</Code>, it, too, would print the same identifier as <Code>print(id(x))</Code> and <Code>print(id(y))</Code>. That's to say, the Python interpreter is allowed to reuse the exact same object for <Code>z</Code> as it does for <Code>x</Code> and <Code>y</Code> even though <Code>z</Code> was not directly assigned the value of <Code>x</Code> nor <Code>y</Code>. It's generally only allowed to do this for primitive-type objects, though, because such objects are immutable).</P>

      <SectionHeading id="copies">Copies</SectionHeading>

      <P>The exact distinction between "changing the value stored in a variable" versus "changing a variable to refer to a different object" might not seem very important in the context of primitives such as integers, but it's critical when we're dealing with more complex types such as classes (even POD types). Consider the following program:</P>

      <PythonBlock fileName="main.py">{
`# A Person POD type. It should probably be in a separate person.py,
# but this is just a demonstration
class Person:
    name: str
    age: int

def main() -> None:
    x = Person()
    x.name = 'Joe'
    x.age = 42

    y = x
    y.name = 'Sally'

    print(x.name) # Question: What does this print?

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Note the important question in the comment on Line 15 ("What does this print?"). What do you think?</P>

      <P>Before you can answer this question, you need to know how the dot operator fits into all of this: when the dot operator appears to the right of a variable name, it reaches inside the <It>object</It> that the variable refers to, accessing the attribute or method whose name is on the right of the dot operator. The important point here is that the dot operator does not reach inside <It>variables</It>, but rather <It>objects</It>. This means that attributes and methods belong to objects<Emdash/>not the variables that reference those objects. Again, this might seem pedantic, but the difference matters.</P>

      <P> Now let's answer the question. Line 8 creates a new object to store the newly created <Code>Person</Code> instance, and then it creates the variable <Code>x</Code>, setting it up to refer to that object. Line 9 creates a new string object to store the value <Code>'Joe'</Code>. Then<Emdash/>and this is where things get interesting<Emdash/>it reaches inside the <Ul>object</Ul> that <Code>x</Code> refers to (i.e., the <Code>Person</Code> instance created on Line 8) to access its <Code>name</Code> attribute, and it sets up that attribute (variable) to refer to the aforementioned string object. Something similar happens on Line 10; it creates an integer object to store the value 10, and then it reaches inside the object that <Code>x</Code> refers to, accessing its <Code>age</Code> attribute and setting it up to refer to said integer object.</P>

      <P>Line 12 creates a new variable, <Code>y</Code>, and sets it up to refer to the same object that <Code>x</Code> currently refers to<Emdash/>the <Code>Person</Code> instance created on Line 8. Line 13 is where things get interesting: similar to line 9, it creates a new string object to store the value <Code>'Sally'</Code>, and then it reaches inside the object that <Code>y</Code> refers to, accessing its <Code>name</Code> attribute and changing it to refer to said newly created string object.</P>

      <P>Finally, Line 15 reaches inside the object that <Code>x</Code> refers to, accessing its <Code>name</Code> attribute and printing the value of the object that it refers to.</P>

      <P>The key here is in recognizing two facts: 1) <Code>x</Code> and <Code>y</Code> are two separate variables, but they refer to the same underlying object (e.g., notice how I described Line 12 above); and 2) the dot operator simply reaches inside the <Ul>object</Ul> (specifically class instance) that the variable on the left refers to (e.g., <Code>y.name</Code> reaches inside the object that <Code>y</Code> refers to, accessing its <Code>name</Code> attribute), accessing its attributes and / or methods. Since <Code>x</Code> and <Code>y</Code> refer to the same object, when Line 13 modifies the <Code>name</Code> attribute of the object that <Code>y</Code> refers to, that <It>also</It> modifies the <Code>name</Code> attribute of the object that <Code>x</Code> refers to (because <Code>x</Code> and <Code>y</Code> refer to the exact same object).</P>

      <P>This means that modifying <Code>y.name = 'Sally'</Code> is equivalent to modifying <Code>x.name = 'Sally'</Code>. Line 15, then, prints <Code>'Sally'</Code>:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python main.py 
Sally
`
      }</TerminalBlock>

      <P>This might surprise you. In the past, you might have heard (and I might have even told you) that <Code>y = x</Code> copies the value stored in <Code>x</Code> into the newly created variable <Code>y</Code>. But that isn't actually the case. If <Code>y = x</Code> truly copied the <It>value</It> (object) stored in <Code>x</Code>, then you'd have two independent values: one stored in <Code>x</Code>, and the other stored in <Code>y</Code> (created as a copy of the original). Modifying <Code>y.name</Code>, then, would <It>not</It> modify <Code>x.name</Code>, because these would be two separate attributes of two separate objects. No, <Code>y = x</Code> does not copy a value. Rather, it copies a reference. You then have two references, <Code>x</Code> and <Code>y</Code>, that refer to the same value (object), so <Code>x.name</Code> and <Code>y.name</Code> are the same attribute of the same object.</P>

      <P>A similar thing happens with lists:</P>

      <PythonBlock>{
`x = [1, 2, 3]
y = x
y[0] = 100
print(x) # Prints [100, 2, 3]
`
      }</PythonBlock>

      <P>This is for the same reason as before. <Code>y = x</Code> does not create a new list. It just sets up <Code>y</Code> to refer to the same list (object) as the one that <Code>x</Code> currently refers to. <Code>y[0] = 100</Code> then reaches inside that list (object), modifying its first element to refer to the a new integer object storing the value <Code>100</Code>.</P>

      <P>Suppose you want to copy an object, then. How do you do that, given that <Code>y = x</Code> only actually copies a reference?</P>

      <P>Well, there are at least two functions provided by the Python standard library that can be used to copy objects: <Code>copy.copy()</Code>, and <Code>copy.deepcopy()</Code>. Using either of them requires importing the <Code>copy</Code> package (or importing the respective function from the <Code>copy</Code> package, such as <Code>from copy import copy</Code>, or <Code>from copy import deepcopy</Code>). To call one of these functions, simply pass in an object (or a variable that refers to an object) as an argument, and it will construct and return a copy of that object. When I say "a copy of that object", I mean that it will return an entirely new object that stores an "equivalent" value of that of the object being copied.</P>

      <P>In the context of this program, either one will work. But you <It>usually</It> want to use <Code>deepcopy</Code>, so let's do that:</P>

      <PythonBlock fileName="main.py" highlightLines="{1,14}">{
`from copy import deepcopy

# A Person POD type. It should probably be in a separate person.py,
# but this is just a demonstration
class Person:
    name: str
    age: int

def main() -> None:
    x = Person()
    x.name = 'Joe'
    x.age = 42

    y = deepcopy(x)
    y.name = 'Sally'

    print(x.name) # Question: What does this print?

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Now, <Code>y</Code> is defined to refer to a <It>copy</It> of the object that <Code>x</Code> refers to. This means that <Code>x</Code> and <Code>y</Code> refer to separate objects with their own attributes, so modifying <Code>y.name</Code> does not modify <Code>x.name</Code> (or vice-versa). Line 17, then, prints <Code>'Joe'</Code>:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python main.py 
Joe
`
      }</TerminalBlock>

      <P>In this case, <Code>copy()</Code> and <Code>deepcopy()</Code> essentially do the same thing, but that's not always the case. The difference between these two functions is that <Code>copy.copy()</Code> produces a <Bold>shallow copy</Bold>, whereas <Code>copy.deepcopy()</Code> produces a <Bold>deep copy</Bold>. To create a shallow copy of an object means to create a new object whose attributes refer to the exact same sub-objects as the attributes of the original object. In contrast, to create a deep copy of an object means to create a new object whose attributes in turn refer to <It>deep copies</It> of the sub-objects that the original object's attributes refer to (this, this is a recursive definition).</P>

      <P>As an example, suppose <Code>x</Code> refers to an object with an attribute named <Code>y</Code>, which in turn refers to an object with an attribute named <Code>z</Code>. Then suppose you write <Code>a = copy(x)</Code>. <Code>a</Code> will then refer to a new object that's a shallow copy of the object that <Code>x</Code> refers to. This means that <Code>a</Code> and <Code>x</Code> refer to two different objects. <Ul>However</Ul>, because it's only a shallow copy, <Code>a.y</Code> and <Code>x.y</Code> refer to the <Ul>same</Ul> underlying object. Similarly, <Code>a.y.z</Code> and <Code>x.y.z</Code> refer to the same underlying object. If you then proceeded to modify <Code>a.y.z</Code>, that would also modify <Code>x.y.z</Code> because <Code>a.y</Code> and <Code>x.y</Code> refer to the same object (so modifying the attributes of one also modifies the attributes of the other). However, if you modified <Code>a.y</Code> directly (e.g., <Code>a.y = something_else</Code>), that would <It>not</It> modify <Code>x.y</Code> because <Code>a</Code> and <Code>x</Code> refer to separate objects (each with their own separate attributes).</P>

      <P>Now let's alter that example to consider deep copies instead: if you write <Code>a = deepcopy(x)</Code> instead of <Code>a = copy(x)</Code>, then <Code>a</Code> will refer to a new object that's a deep copy of the object that <Code>x</Code> refers to. Again, this means that <Code>a</Code> and <Code>x</Code> refer to separate objects. However, the case of a deep copy, <Code>a.y</Code> and <Code>x.y</Code> would <It>also</It> refer to separate objects. Similarly, <Code>a.y.z</Code> and <Code>x.y.z</Code> would <It>also</It> refer to separate objects. And so on. Modifying <Code>a</Code>, or any of its attributes, or any of its <It>attributes'</It> attributes, or so one, will never result in any modifications to <Code>x</Code> or its attributes (or its attributes' attributes, and so on).</P>

      <P>Put simply, a deep copy is a complete, independent copy of the original object and everything inside it. In contrast, a shallow copy is a copy of the original object, but the things inside it are <It>not</It> copied. Rather, the copy's attributes refer to the same sub-objects as the attributes of the original, copied object (e.g., <Code>a.y</Code> and <Code>x.y</Code> refer to the same object, even though <Code>a</Code> and <Code>x</Code> refer to separate objects).</P>

      <P>This is a complicated concept, so here's a more complete example illustrating shallow copies:</P>

      <PythonBlock fileName="shallowcopy.py">{
`from copy import copy # Used for shallow copies

class Person:
    name: str

class House:
    owner: Person

def main() -> None:
    joe = Person()
    joe.name = 'Joe'

    house = House()
    house.owner = joe

    # house2 is a SHALLOW copy of house
    house2 = copy(house)

    # house and house2 refer to separate objects (these print different
    # identifiers)
    print(id(house))
    print(id(house2))
    print()

    # However, house.owner and house2.owner refer to the SAME
    # object (these print the same identifier):
    print(id(house.owner))
    print(id(house2.owner))
    print()

    # This means that modifying house2.owner.name will ALSO modify
    # house.owner.name (because house2.owner refers to the same
    # object as house.owner)
    house2.owner.name = 'Sally'
    print(house2.owner.name) # Prints Sally
    print(house.owner.name) # Prints Sally

    # Also, house.owner was defined to refer to the same object
    # as the variable 'joe', modifying house.owner.name ALSO
    # modifies joe.name:
    print(joe.name) # Prints Sally
    print()

    # But remember: house and house2 refer to different objects. So
    # modifying house2.owner does NOT modify house.owner
    amanda = Person()
    amanda.name = 'Amanda'
    house2.owner = amanda

    print(house2.owner.name) # Prints Amanda
    print(house.owner.name) # Prints Sally
    print()

    # Now that we have modified house2.owner, it now refers
    # to a different object from house.owner (these print different
    # identifiers):
    print(id(house2.owner))
    print(id(house.owner))
    print()

    # So NOW, modifications to house2.owner.name no longer modify
    # house.owner.name (because house.owner and house2.owner refer
    # to different objects at this point):
    house2.owner.name = 'Mahatma'
    print(house2.owner.name) # Prints Mahatma
    print(house.owner.name) # Prints Sally


if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Make sure to trace the above comments carefully and verify that you understand what's going on here.</P>

      <P>In contrast, here's an example illustrating deep copies:</P>

      <PythonBlock fileName="deepcopy.py">{
`from copy import deepcopy # Used for deep copies

class Person:
    name: str

class House:
    owner: Person

def main() -> None:
    joe = Person()
    joe.name = 'Joe'

    house = House()
    house.owner = joe

    # house2 is a DEEP copy of house
    house2 = deepcopy(house)

    # house and house2 refer to separate objects (these print different
    # identifiers)
    print(id(house))
    print(id(house2))
    print()

    # house.owner and house2.owner ALSO refer to different objects
    # (these print different identifiers):
    print(id(house.owner))
    print(id(house2.owner))
    print()

    # No modifications to house2 will result in any modifications to
    # house:
    house2.owner.name = 'Sally'
    print(house2.owner.name) # Prints Sally
    print(house.owner.name) # Prints Joe



if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>If you're just copying primitives (e.g., integers), <It>or</It> if you're copying objects whose attributes all refer to primitives (e.g., a <Code>Person</Code> with a string attribute <Code>name</Code> and integer attribute <Code>age</Code>, but no class-type attributes), then it technically doesn't matter whether you use shallow copies or deep copies. In such cases, the two kinds of copies are equivalent. But if you want to copy an object that has other objects inside it that, in turn, have other objects inside <It>them</It> (and so on), then there's a huge difference between a shallow copy and a deep copy. And in such cases, you <It>usually</It> want a deep copy, or else certain modifications to the copy could result in corresponding modifications to the original.</P>

      <P>The only advantage of shallow copies is that, when copying extremely complicated objects with deep object graphs, shallow copies are more efficient than deep copies. This is because shallow copies only copy the "outer" object, whereas deep copies traverse the entire object graph and copy <It>everything</It>. But again, shallow copies can lead to issues if you want the two objects (the original and the copy) to serve as completely independent objects from one another, enabling you to modify the deeper contents of one without it affecting the corresponding contents of the other.</P>

      <P>Lastly: everything that I've told you about the assignment operator<Emdash/>about how it modifies the variable on the left to refer to a new object as specified on the right<Emdash/>also applies to function arguments and parameters. When a function is called, the function's parameters (which are variables and therefore references) are set up to refer to the objects specified by the arguments. Indeed, this means that a given function parameter and its corresponding argument are two separate variables, but they refer to the same underlying object in the context of the function call. If the function then reaches <It>inside</It> that object (e.g., via the dot operator), that will also reach inside the object that the argument refers to. To avoid issues in such cases, you may need to use <Code>deepcopy()</Code> to copy the object before passing it as an argument:</P>

      <PythonBlock fileName="functioncall.py">{
`from copy import deepcopy

class Person:
    name: str

def change_person(p: Person) -> None:
    p.name = 'Sally'

def main() -> None:
    joe = Person()
    joe.name = 'Joe'

    # The parameter, p, refers to the same object that the argument,
    # joe, refers to. Line 5, then, reaches inside the object that
    # p refers to (which is also the object that joe refers to),
    # modifying its name attribute to refer to a new string object
    # storing the value 'Sally'. This means that joe.name is ALSO
    # modified
    change_person(joe)

    print(joe.name) # Prints Sally
    
    # Let's change joe's name back to 'Joe'
    joe.name = 'Joe'

    # This time, to avoid the issue, we can use copy() or deepcopy()
    # to create a copy of the OBJECT that joe refers to, and then pass
    # THAT as the argument. p will then refer to THAT object, rather
    # than the object that joe refers to. In this case, copy() and
    # deepcopy() will both work. But again, we usually want a deep copy
    change_person(deepcopy(joe))

    print(joe.name) # Prints Joe

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Remember when I told that lists behave a bit strange when used as parameters? How, when a function modifies the elements within a list that's received as a parameter, the corresponding elements are also modified within the list that was passed as an argument? This is precisely the reason: the parameter is not a <It>copy</It> of the argument's value, but rather a <It>reference</It> to the argument's value. If you want any sort of object-copying to take place, you have to do it yourself by calling <Code>deepcopy()</Code>.</P>

      <P>(Technically, the same principles apply to return values as well, but that rarely matters in practice).</P>
      
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
