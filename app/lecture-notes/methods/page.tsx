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
      <P>This lecture is about <Bold>methods</Bold>. We'll cover the following:</P>

      <Itemize>
        <Item><Link href="#basic-methods">Basic methods</Link></Item>
        <Item><Link href="#constructors">Constructors</Link></Item>
        <Item><Link href="#objects">Objects</Link></Item>
      </Itemize>

      <SectionHeading id="basic-methods">Basic methods</SectionHeading>

      <P>Attributes allow us to establish "has-a" relationships. For example, every city has a name, and every city has a population. See the <Link href={`${PARENT_PATH}/${allPathData["pod-types"].pathName}`}>POD types lecture notes</Link> for a reminder about attributes.</P>

      <P>But, as I mentioned in the POD types lecture, POD types represent the most limited use case of classes. Indeed, classes can be used to create much more complicated data types than just POD types.</P>

      <P>For one, classes can have <Bold>methods</Bold>. A method is a function that exists within instances of a class, just as an attribute is a variable that exists within instances of a class. In some sense, if an attribute represents a "has-a" relationship, then a method represents a <Bold>"can" relationship</Bold>. For example, a <Code>Dog</Code> class might have a <Code>bark()</Code> method. In such a case, barking would be something that all <Code>Dog</Code> instances <Ul>can</Ul> do (dogs <Ul>can</Ul> bark, hence the "can" relationship).</P>

      <P>Let's start simple. In <Link href={`${PARENT_PATH}/${allPathData["modules-and-packages"].pathName}`}>our modules and packages lecture</Link>, we created a <Code>Dog</Code> class and a <Code>print_dog()</Code> function. It looked like this:</P>

      <PythonBlock fileName="dog.py">{
`class Dog:
    name: str
    birth_year: int

def print_dog(dog: Dog) -> None:
    print(f'{dog.name} was born in {dog.birth_year}')
`
      }</PythonBlock>

      <P>If we wanted to print a <Code>Dog</Code> instance, we would pass it as an argument to the <Code>print_dog()</Code> function. For example:</P>

      <PythonBlock fileName="main.py" highlightLines="{9}">{
`from animals.dog import Dog, print_dog

def main() -> None:
    spot = Dog()

    spot.name = 'Spot'
    spot.birth_year = 2022

    print_dog(spot)

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>But suppose we want to change our representation a bit. Rather than having a global function that prints a given <Code>Dog</Code> instance, suppose we want <Code>Dog</Code> instances to be able to print their <It>own</It> information to the terminal. That's to say, suppose we want to establish the "can" relationship: dogs <Ul>can</Ul> print their information to the terminal.</P>

      <P>To do this, we might create a method named <Code>print()</Code> within the <Code>Dog</Code> class. The syntax for defining a class method is as follows:</P>

      <SyntaxBlock>{
`def <name>(self, <parameter 1>, ..., <parameter N>) -> <return type>:
    <method body>`
      }</SyntaxBlock>

      <P>Importantly, method definitions (as above) must be placed inside class definitions, similar to attribute declarations.</P>

      <P>You might have noticed that the above syntax looks very similar to a regular function definition. That shouldn't be surprising; methods are just functions that exist inside class instances. Anyways, replace <Code>{'<name>'}</Code> with the method's name, replace each <Code>{'<parameter X>'}</Code> with a valid function parameter declaration (e.g., <Code>x: int</Code>, if you want the method to have an integer parameter named <Code>x</Code>), replace <Code>{'<return type>'}</Code> with the method's return type, and replace <Code>{'<method body>'}</Code> with the block of code that you want to be executed when the method is called.</P>

      <P>You might be wondering what <Code>self</Code> means in the above syntax. Well, in order to explain that (and before I can provide a fully functional example of a method), I first have to explain how methods are <It>called</It>. Suppose that we define a <Code>print()</Code> method within the <Code>Dog</Code> class. First, remember that the dot operator can be used to access things that exist inside class instances. For example, to access the <Code>name</Code> attribute within the <Code>Dog</Code> instance <Code>spot</Code>, we would write <Code>spot.name</Code> (as in <Code>main.py</Code> above). Second, remember that methods are functions that exist inside class instances. Putting these two facts together, it stands to reason that, in order to access and call the <Code>print()</Code> method within the <Code>Dog</Code> instance <Code>spot</Code>, we would write something like <Code>spot.print()</Code> (possibly passing in some arguments, if applicable). And indeed, that's precisely how you access methods.</P>

      <P>This often confuses students, so I'll try to explain it in another way: methods exist inside class instances, so if you don't have a class instance, then you don't have a method. Indeed, if the <Code>Dog</Code> class defined a <Code>print()</Code> method, we couldn't simply call it via <Code>print()</Code>. That wouldn't make any sense; <Code>print()</Code>, being a method of the <Code>Dog</Code> class, exists <It>inside</It> <Code>Dog</Code> instances. It does not exist as a standalone function. So, in order to use it, we first have to create a <Code>Dog</Code> instance, such as <Code>spot</Code>. Just as <Code>spot</Code> has a <Code>name</Code> attribute and a <Code>birth_year</Code> attribute, <Code>spot</Code> also has a <Code>print()</Code> method (or, equivalently, "spot <Ul>can</Ul> print"). To access <Code>spot</Code>'s <Code>name</Code>, we write <Code>spot.name</Code>. By the same token, to call <Code>spot</Code>'s <Code>print()</Code> method, we write <Code>spot.print()</Code> (again, possibly passing in some arguments, if applicable).</P>

      <P>The implication here is that <It>every</It> time you call a method, you must access it from <It>within</It> some particular class instance using the dot operator. Something like <Code>spot.print()</Code>, or <Code>fluffy.print()</Code>, or <Code>bella.print()</Code><Emdash/><Ul>never</Ul> just <Code>print()</Code>.</P>

      <P>How does this all relate to <Code>self</Code>? Well, when you call a method, you're always calling it "on" a specific class instance. That instance is sometimes, in the context of some programming languages, referred to as the <Bold>calling object</Bold> (this is not common terminology in the context of Python, but it's a useful term, so I'm going to use it anyways). For example, if we call <Code>spot.print()</Code>, then <Code>spot</Code> is the calling object. If we call <Code>fluffy.print()</Code>, then <Code>fluffy</Code> is the calling object. And so on. Here's the kicker: <Ul>whenever you call a method, the calling object is implicitly and automatically passed in as a sort of "hidden argument" to the method.</Ul> Hence, the method <Ul>must</Ul> have a corresponding parameter to serve as a placeholder for that implicit argument. This is what <Code>self</Code> is. It's just a parameter that, in the context of the method body, refers to the calling object.</P>

      <P>It doesn't even technically need to be named <Code>self</Code>. You can actually name it whatever you want. However, it's unconventional to name it anything other than <Code>self</Code>, so please don't do that. Moreover, understand that the calling object is always implicitly passed as the <Ul>first</Ul> argument to the method call, so the <Ul>first</Ul> parameter will always refer to the calling object. This means that every method you ever create (in Python) should always have a <Code>self</Code> parameter, and it should always be the first parameter of the method (and sometimes the only parameter of the method). Hence the above syntax.</P>

      <P>This is also why the <Code>self</Code> parameter does not need a type annotation (though can, technically, type-annotate it if you'd like). Since it's always a reference to the calling object, Mypy already knows what its type is.</P>

      <P>Finally, that's enough information to show you an actual example. Let's get rid of the <Code>print_dog()</Code> function and replace it with a <Code>print()</Code> method that's defined inside the <Code>Dog</Code> class:</P>

      <PythonBlock fileName="dog.py">{
`class Dog:
    name: str
    birth_year: int

    # Methods are defined inside classes, so we define the Dog
    # print() method here. Make sure that it's indented over so that
    # it's recognized as belonging to the class.
    def print(self) -> None:
        # self refers to the calling object. For example, if we call
        # spot.print(), then self refers to spot (spot is implicitly
        # passed in as an argument to the self parameter). Hence,
        # if we print self.name, that will print the name attribute
        # of the calling object. And if we print self.birth_year,
        # that will print the birth_year attribute of the calling
        # object. Therefore, spot.print() will print spot's information
        # to the terminal, whereas fluffy.print() will print fluffy's
        # information to the terminal, and so on.
        print(f'{self.name} was born in {self.birth_year}')
`
      }</PythonBlock>

      <P>Now, suppose we have a <Code>Dog</Code> instance named <Code>spot</Code>, such as in <Code>main.py</Code>. Previously, if we wanted to print <Code>spot</Code>'s information to the terminal, we would write <Code>print_dog(spot)</Code>, thereby passing <Code>spot</Code> as an argument to the <Code>print_dog()</Code> function. Now, we would instead write <Code>spot.print()</Code>. This executes the <Code>print()</Code> method of the <Code>Dog</Code> class, but specifically the one that exists <Ul>inside</Ul> <Code>spot</Code>. This, in turn, passes in <Code>spot</Code> as the argument to the <Code>self</Code> parameter of the <Code>print()</Code> method. When it then prints <Code>self.name</Code> and <Code>self.birth_year</Code> (see the above code), it will be printing <Code>spot</Code>'s name and birth year.</P>

      <P>Let's update <Code>main.py</Code> accordingly:</P>

      <PythonBlock fileName="main.py">{
`from animals.dog import Dog

def main() -> None:
    spot = Dog()

    spot.name = 'Spot'
    spot.birth_year = 2022

    # Instead of print_dog(spot), we now write spot.print()
    spot.print()

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Running the above program produces the following output:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python main.py 
Spot was born in 2022
`
      }</TerminalBlock>

      <SectionHeading id="constructors">Constructors (<Code>__init__()</Code> methods)</SectionHeading>

      <P>So, what the heck is the point? What was wrong with <Code>print_dog(spot)</Code>? Why did we have to introduce a whole new language feature just so that we could instead write <Code>spot.print()</Code>? Well, there are many very good reasons that methods exist<Emdash/>things that they allow you to do that otherwise wouldn't be possible. We'll be covering many of these things incrementally throughout the course, but we'll start with a simple one: <Bold>constructors</Bold>.</P>

      <P>A constructor is a special method that's automatically called on a class instance the moment it's first created. The purpose of a constructor is to "set up" the instance, initializing its attributes to a valid state.</P>

      <P>For example, in <Code>main.py</Code> above, we create a <Code>Dog</Code> instance via <Code>spot = Dog()</Code>. But as we saw in the <Link href={`${PARENT_PATH}/${allPathData["pod-types"].pathName}`}>POD types lecture</Link>, <Code>spot</Code> is not immediately initialized to a valid state. Rather, from the moment <Code>spot</Code> is created within <Code>main()</Code>, its attributes are undefined until we explicitly define them (<Code>spot.name = 'Spot'</Code>, and <Code>spot.birth_year = 2022</Code>). If we forget to initialize <Code>spot</Code>'s attributes, they'll remain undefined. Suppose we then call <Code>spot.print()</Code>. That would result in a runtime error when the <Code>print()</Code> method attempts to print an undefined attribute:</P>

      <PythonBlock fileName="main.py">{
`from animals.dog import Dog

def main() -> None:
    spot = Dog()

    # Suppose we forget to initialize spot's attributes

    # Then spot.print() will throw an AttributeError when it tries
    # to print undefined attributes
    spot.print()

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Running the above program produces the following output:</P>

      <TerminalBlock copyable={false}>{
`(env) methods $ python main.py 
Traceback (most recent call last):
  File "/home/alex/instructor/static-content/guyera.github.io/code-samples/methods/main.py", line 13, in <module>
    main()
    ~~~~^^
  File "/home/alex/instructor/static-content/guyera.github.io/code-samples/methods/main.py", line 10, in main
    spot.print()
    ~~~~~~~~~~^^
  File "/home/alex/instructor/static-content/guyera.github.io/code-samples/methods/animals/dog.py", line 18, in print
    print(f'{self.name} was born in {self.birth_year}')
             ^^^^^^^^^
AttributeError: 'Dog' object has no attribute 'name'
`
      }</TerminalBlock>

      <P>"So just don't forget to initialize your attributes," I hear you say. But I often say: a good interface serves to prevent mistakes. Forgetting to initialize an attribute is a particularly common mistake. If we define a constructor for the <Code>Dog</Code> class that initializes each <Code>Dog</Code> instance's attributes to some specified values, then such mistakes become impossible. That would be a much better interface.</P>

      <P>In Python, a constructor is defined as a method with the name <Code>__init__</Code> and a return type of <Code>None</Code> (it must have that exact name, including the double underscores at the beginning and end). Besides that, it's defined just like any other method; it must have a <Code>self</Code> parameter, and it can optionally have additional parameters.</P>

      <P>In our case, the constructor's job is to initialize the <Code>name</Code> and <Code>birth_year</Code> attributes of each newly created <Code>Dog</Code> instance, so it needs to know what values it should initialize those attributes to. This is the purpose of parameters in a constructor<Emdash/>to give the constructor some information about the instance that's being created.</P>

      <P>Let's add a constructor to our <Code>Dog</Code> class:</P>

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

      <P>The moment a <Code>Dog</Code> instance is created, the <Code>Dog</Code> constructor will automatically be called on that instance. This means that, in the context of a constructor, <Code>self</Code> refers to the instance that's currently being created. The <Code>n</Code> parameter specifies the newly created dog's name, and the <Code>b</Code> parameter specifies its birth year. The constructor then stores those values into the respective <Code>name</Code> and <Code>birth_year</Code> attributes of the <Code>Dog</Code> instance (accessible via <Code>self.name</Code> and <Code>self.birth_year</Code>).</P>

      <P>But how do we call this method? Well, I mentioned that a class's constructor is automatically called on an instance of the class the moment it's created. In <Code>main.py</Code>, we create <Code>spot</Code> via <Code>spot = Dog()</Code>. The righthand side of that assignment operator<Emdash/><Code>Dog()</Code><Emdash/>is, in fact, a constructor call. You might remember that I left a comment in the POD types lecture notes stating that class instantiation syntax looks similar to a function call. Indeed, it <It>is</It> a function call. <Code>Dog()</Code> calls the <Code>Dog</Code> class's constructor, and that's exactly how <Code>Dog</Code> instances are created. (Technically, even if you don't define a constructor for a class, the class still <It>has</It> a constructor; it just accepts no arguments and does nothing).</P>

      <P>Currently, we're not passing in any arguments to the <Code>Dog</Code> constructor when we construct <Code>spot</Code>. But now, we've defined the <Code>Dog</Code> constructor to have two parameters (in addition to <Code>self</Code>): 1) <Code>n</Code>, the dog's name, and 2) <Code>b</Code>, the dog's birth year. Hence, when we call the <Code>Dog</Code> constructor to construct <Code>spot</Code>, we must pass in two arguments corresponding to these parameters. Let's update <Code>main()</Code> accordingly:</P>

      <PythonBlock fileName="main.py" highlightLines="{4-7}">{
`from animals.dog import Dog

def main() -> None:
    # Call the Dog constructor to create spot, passing in "Spot"
    # as the name and 2022 as the birth year. The constructor will
    # then store these values within spot.name and spot.birth_year
    spot = Dog('Spot', 2022)

    # Print spot's information to the terminal
    spot.print()

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Now, it's essentially impossible to create <Code>Dog</Code> instances that aren't immediately initialized to a valid state<Emdash/>in order to create a <Code>Dog</Code> instance, we must specify its name and birth year, and the constructor automatically stores those values in the instance's appropriate attributes. And if we made a mistake in the constructor call (e.g., <Code>spot = Dog()</Code>, leaving out the arguments), that would be detected immediately by Mypy, making such mistakes extremely easy to locate and diagnose.</P>

      <SectionHeading id="objects">Objects</SectionHeading>

      <P>To describe <Code>spot</Code>, I've been using the terms "class instance" and "variable" a lot. But there's actually another term that's commonly used to describe things like <Code>spot</Code>: <Bold>objects</Bold>.</P>

      <P>The exact definition of an object depends on the context and who you ask. One possible definition simply states that an object is an instance of a class (i.e., it's synonymous with "class instance"). A slightly more rigorous definition requires objects to have both state (attributes, or "has-a" relationships) and behavior (methods, or "can" relationships). This would mean that <Code>spot</Code> refers to an object since it has attributes and methods, but primitives (e.g., integers) and instances of POD types are not objects because they don't have state / methods. When we discuss <Bold>object-oriented programming</Bold>, this is the definition that we'll go with<Emdash/>something with both state and behavior.</P>

      <P>But there's another much looser definition that states that objects are simply <It>values</It>, regardless of the types of those values. Under this definition, even primitives like integers, floats, and doubles are considered to be objects. This is actually the definition that's used by the Python language specification. In Python, <It>technically</It>, everything is an object. This is a somewhat uncommon definition, though, and the reason that Python takes this stance has to do with how Python stores, identifies, and references values under the hood. But we'll save that for a future lecture.</P>

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
