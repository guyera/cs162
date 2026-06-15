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
        <Item><Link href="#inheritance">Inheritance</Link></Item>
        <Item><Link href="#extension">Extension</Link></Item>
        <Item><Link href="#overriding">Overriding</Link></Item>
        <Item><Link href="#grandchildren">Grandchildren</Link></Item>
        <Item><Link href="#square-rectangle-conundrum">(Optional content) When is a square not a rectangle?</Link></Item>
      </Itemize>

      <SectionHeading id="inheritance">Inheritance</SectionHeading>

      <P>Attributes establish a sort of "has-a" relationship. If you'd like dogs to "have" ages in your program, then the <Code>Dog</Code> class should have an <Code>age</Code> attribute. Methods, in contrast, establish a sort of "can" relationship. If you'd like dogs to be able to bark in your program, then the <Code>Dog</Code> class should have a <Code>bark()</Code> method. But there's one more sort of relationship that we haven't discussed: <Bold>"is-a" relationships</Bold>.</P>

      <P>An "is-a" relationship is a kind of relationship that exists between two classes. This is in contrast to "has-a" relationships, which exist between objects and their attributes, and "can" relationships, which exist between objects and their methods. Some examples of "is-a" relationships include:</P>

      <Itemize>
        <Item>A dog is a mammal</Item>
        <Item>A mammal is an animal</Item>
        <Item>A dog is an animal</Item>
        <Item>A truck is an automobile</Item>
        <Item>An automobile is a vehicle</Item>
        <Item>A truck is a vehicle</Item>
        <Item>A spaceship is a vehicle</Item>
      </Itemize>

      <P>"Is-a" relationships are incredibly descriptive. For example, suppose you've never heard of a husky before. If you asked me what a husky is, and I told you "a husky <Ul>is a</Ul> kind of dog", you'd <It>immediately</It> know a lot more about huskies than you did just a few seconds earlier. You'd immediately know that they have four legs, a snout, and some fur; that they give live birth; that they're kept as pets by some people; that there's probably at least a hundred of them in the world named "Fluffy" or "Bella"; and so on. Indeed, I can convey <It>all that</It> information to you with a single sentence: "a husky is a kind of dog". This works by drawing from your existing contextual knowledge about dogs. When I tell you that a husky is a kind of dog, you can immediately apply that contextual knowledge to huskies as well.</P>

      <P>"Is-a" relationships are incredibly descriptive, and programming is all about description, so it'd be nice if we could express "is-a" relationships in our code. Suppose you have a <Code>Dog</Code> class with an <Code>age</Code> attribute and a <Code>bark()</Code> method. Then, suppose you want to introduce an <Code>Husky</Code> class into your program. Huskies <Ul>are</Ul> dogs, so huskies should also have ages and be able to bark. But do you really want to have to copy and paste the same attribute declarations and method definitions from the <Code>Dog</Code> class into the <Code>Husky</Code> class? Maybe that's not such a big deal, but what if you wanted to create thirty more classes, each corresponding to a respective species of dog? If <It>all</It> of them need some of the same methods and attributes, do you really want to copy and paste those methods and attributes thirty plus times? Besides, copying and pasting complex declarations and definitions introduces unnecessary coupling in your program, hence the DRY principle (e.g., if you ever wanted to change the way that dogs bark in your program, you'd now have to change it in over thirty places instead of just one).</P>

      <P><Bold>Inheritance</Bold> is an object-oriented language feature of many programming languages, and it's used to express "is-a" relationships, avoiding the need for all that copying and pasting. A class A can inherit from another class B. When this happens, all the attributes and methods declared and defined in B are <Bold>inherited</Bold> into A, meaning that they become <It>automatically</It> declared and defined in A as well. This avoids needing to <It>manually</It> redefine those inherited attributes and methods.</P>

      <P>The class from which attributes and methods are being inherited is referred to as the <Bold>superclass</Bold>, or <Bold>base class</Bold>. The class that's inheriting those methods and attributes is referred to as the <Bold>subclass</Bold>, or <Bold>derived class</Bold>. The inheritance relationship is specified when defining the subclass (derived class). The syntax is as follows:</P>

      <SyntaxBlock>{
`class <DerivedClassName>(<BaseClassName>):
    <class definition>`
      }</SyntaxBlock>

      <P>That is, define the two classes as normal, except when defining the derived class, put the name of the <It>base</It> class in parentheses immediately after the derived class's name (but before the colon).</P>

      <P>For example, suppose we have a <Code>Dog</Code> class defined in <Code>dog.py</Code>:</P>

      <PythonBlock fileName="dog.py">{
`class Dog:
    _name: str
    _age: int
    
    def __init__(self, name: str, age: int) -> None:
        self._name = name
        self._age = age

    def bark(self) -> None:
        print(f"Bark! Bark! My name is {self._name}, and I'm "
            f"{self._age} years old")
`
      }</PythonBlock>

      <P>Now suppose we want to create a <Code>Husky</Code> class that also has a <Code>_name</Code> attribute, an <Code>_age</Code> attribute, and a <Code>bark()</Code> method. We could do that like so:</P>

      <PythonBlock fileName="husky.py">{
`from dog import Dog # Necessary for the inheritance

# Huskies ARE a kind of dog. We establish the is-a relationship via
# inheritance
class Husky(Dog):
    # TODO define the rest of the Husky class here

    # For now, I'll leave this class empty. Python requires you to
    # use the "pass" keyword to leave a body of code empty
    pass
`
      }</PythonBlock>

      <P>Because the <Code>Husky</Code> class inherits from the <Code>Dog</Code> class, it <It>automatically</It> has a <Code>_name</Code> attribute, an <Code>_age</Code> attribute, and a <Code>bark()</Code> method. These things don't need to be manually copied and pasted into the <Code>Husky</Code> class. In fact, even the constructor (<Code>__init__()</Code>) is inherited into the <Code>Husky</Code> class<Emdash/><It>everything</It> is inherited. As it stands, the <Code>Husky</Code> class is basically identical to the <Code>Dog</Code> class.</P>

      <P>Here's some proof:</P>

      <PythonBlock fileName="main.py">{
`from husky import Husky

def main() -> None:
    # The Husky class inherits the  __init__() method from the Dog
    # class. It accepts a name and age as arguments, storing them in
    # the _name and _age attributes, respectively
    cool_husky = Husky('Fluffy', 4)

    # The Husky class inherits the bark() method from the Dog class,
    # which prints its _name and _age attributes
    cool_husky.bark()

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Running the above program produces the following output:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python main.py 
Bark! Bark! My name is Fluffy, and I'm 4 years old
`
      }</TerminalBlock>

      <SectionHeading id="extension">Extension</SectionHeading>

      <P>As I said, the <Code>Husky</Code> class is currently basically identical to the <Code>Dog</Code> class. That's not very useful. Indeed, inheritance by itself does not accomplish much.</P>

      <P>However, inheritance can be combined with a couple of other techniques to make it very powerful. One simple technique is known as <Bold>extension</Bold>. Extension simply means to add new attribute declarations and / or method definitions to the derived class. We refer to this as extension because it essentially "extends" the base class by creating a new (derived) class with all of the same attributes and methods, <It>but also more</It>.</P>

      <P>For example, huskies are sled dogs, so they can bark, but they can also pull a sled. And as they pull the sled, they lose energy. Perhaps we want to express this in our code. First, let's create a very simple <Code>Sled</Code> POD type:</P>

      <PythonBlock fileName="sled.py">{
`class Sled:
    distance_pulled: int
    def __init__(self) -> None:
        self.distance_pulled = 0
`
      }</PythonBlock>

      <P>Now let's update our <Code>Husky</Code> class accordingly:</P>

      <PythonBlock fileName="husky.py">{
`from dog import Dog
from sled import Sled

class Husky(Dog):
    # Huskies have the same attributes and methods as the Dog class,
    # except they ALSO have the following attributes and methods:
    _energy: int

    def pull_sled(self, sled: Sled) -> None:
        # Remember: parameters are references to their arguments, so
        # modifying the parameter's distance_pulled attribute will
        # also modify the argument's distance_pulled attribute
        sled.distance_pulled += 10
        self._energy -= 10
`
      }</PythonBlock>

      <P>There's one issue, though: The <Code>_energy</Code> attribute is declared, but it's never defined (i.e., assigned a value). As you know, the appropriate place to define attributes is within the class's constructor. But in this case, the <Code>Husky</Code> class inherits its constructor from the <Code>Dog</Code> class, and the <Code>Dog</Code> class's constructor doesn't define the <Code>_energy</Code> attribute.</P>

      <P>A naive solution would be to define the <Code>_energy</Code> attribute in the <Code>Dog</Code> class's constructor, similar to the <Code>_name</Code> and <Code>_age</Code> attributes. But that wouldn't make any sense. It would imply that all dogs have an <Code>_energy</Code> attribute. That's not what we want<Emdash/>we want all dogs to have <Code>_name</Code> and <Code>_age</Code>, but we want the <Code>_energy</Code> attribute to be specific to the <Code>Husky</Code> class (because huskies are sled pullers, so it's useful to track their energy).</P>

      <P>A much better solution would be to define a new constructor that's specific to the <Code>Husky</Code> class. It could then define the <Code>_energy</Code> attribute. Since it'll be specific to the <Code>Husky</Code> class, it will only execute when <Code>Husky</Code> objects are created<Emdash/>not when arbitrary <Code>Dog</Code> objects are created. Hence, huskies will have an <Code>_energy</Code> attribute, but other dogs will not. And that's the objective here.</P>

      <P>What should this <Code>Husky</Code> constructor look like? Well, huskies have three attributes: <Code>_name</Code>, <Code>_age</Code>, and <Code>_energy</Code>. All three of those attributes need to be defined for every <Code>Husky</Code> object that's ever created, so the <Code>Husky</Code> constructor should somehow define these three things when executed. It'll have three parameters, then<Emdash/>one for each of these three attributes:</P>

      <PythonBlock fileName="husky.py">{
`from dog import Dog
from sled import Sled

class Husky(Dog):
    _energy: int

    def __init__(self, name: str, age: int, energy: int) -> None:
        # TODO 

    def pull_sled(self, sled: Sled) -> None:
        # Remember: parameters are references to their arguments, so
        # modifying the parameter's distance_pulled attribute will
        # also modify the argument's distance_pulled attribute
        sled.distance_pulled += 10
        self._energy -= 10
`
      }</PythonBlock>

      <P>Before we write the constructor's body, remember the intention of private attributes: they should not be accessed from anywhere other than within a method of the class in which they're declared. Although it's true that the <Code>Husky</Code> class "has a" <Code>_name</Code> attribute and an <Code>_age</Code> attribute, that's not where they're declared. They're declared in the <Code>Dog</Code> class. The <Code>Husky</Code> class simply inherits them. So, although Python technically <It>allows</It> the <Code>Husky</Code> class's constructor to access and define these attributes, it would be inappropriate for it to do so (it'd introduce unnecessary coupling and open up opportunities to accidentally break certain class invariants).</P>

      <P>So the <Code>Husky</Code> class's constructor needs to somehow define the <Code>_name</Code> and <Code>_age</Code> attributes, assigning them the <Code>name</Code> and <Code>age</Code> parameters (respectively), but it's not allowed to do that <It>directly</It> since those attributes are private to the <Code>Dog</Code> class. In order to define these attributes, then, the <Code>Husky</Code> class's constructor must somehow <It>call</It> a method of the <Code>Dog</Code> class, passing in the <Code>name</Code> and <Code>age</Code> as arguments, so that <It>that</It> method can define the attributes themselves (if it's a method of the <Code>Dog</Code> class, then it's allowed to access <Code>_name</Code> and <Code>_age</Code> directly).</P>

      <P>As a crude example, suppose the <Code>Dog</Code> class had a method named <Code>define_attributes</Code> that accepts a name and age, storing those parameters into the respective attributes:</P>

      <PythonBlock copyable={false} showLineNumbers={false}>{
`# ... (Inside the dog class definition)
def define_attributes(self, name: str, age: int) -> None:
    self._name = name
    self._age = age`
      }</PythonBlock>

      <P>The <Code>Husky</Code> constructor could then <It>call</It> that method, passing in its own <Code>name</Code> and <Code>age</Code> parameters, via <Code>self.define_attributes(name, age)</Code>. Again, this would work because the <Code>Husky</Code> class inherits everything from the <Code>Dog</Code> class, so if the <Code>Dog</Code> class provided a <Code>define_attributes</Code> method, then <Code>Husky</Code> objects would <It>also</It> have that method. And if <Code>Husky</Code> objects have such a method, then there's no reason that you couldn't call it on the <Code>self</Code> object within the <Code>Husky</Code> class's constructor.</P>

      <P>However, that would be a rather crude solution because, as it turns out, the <Code>Dog</Code> class already <It>has</It> a method that, when given a name and age, stores those values within the <Code>_name</Code> and <Code>_age</Code> attributes, defining them in the process. Indeed, I'm referring to the <Code>Dog</Code> class's constructor. So if we can get the <Code>Husky</Code> class's constructor to <It>call</It> the <Code>Dog</Code> class's constructor, that'll solve our problem (i.e., the <Code>Husky</Code> constructor can't define the <Code>_name</Code> and <Code>_age</Code> parameters directly, but perhaps it can call the <Code>Dog</Code> constructor, which can <It>in turn</It> define those attributes).</P>

      <P>But how do we call the <Code>Dog</Code> constructor from within the <Code>Husky</Code> constructor? Well, you might guess that you could do something like <Code>self.__init__(name, age)</Code>, and, perhaps surprisingly, that would actually be <It>almost</It> correct. However, there's an issue: <Code>Husky</Code> objects actually have <It>two</It> methods that are both named <Code>__init__()</Code>: the one inherited from the base class (i.e., the <Code>Dog</Code> constructor), and the one defined directly in the derived class (i.e., the <Code>Husky</Code> constructor itself). If, in the <Code>Husky</Code> constructor, we simply wrote <Code>self.__init__(name, age)</Code>, the Python interpreter would think that we're trying to tell the <Code>Husky</Code> constructor to call <It>itself</It>. But what we <It>actually</It> want is for the <Code>Husky</Code> constructor to call the <Code>Dog</Code> constructor. The fact that they're both named <Code>__init__()</Code> creates some ambiguity.</P>

      <P>(By the way, the term <Bold>method overriding</Bold> describes the case wherein a base class and derived class each define a method with the same name. <Link href="#overriding">We'll discuss this further shortly</Link>.)</P>

      <P>Luckily, there's a solution. Python provides a special built-in function named <Code>super()</Code>. It accepts no arguments and returns a sort of base-class "version" of the calling object. You can then proceed to call methods on that object, and it will specifically call the <It>base-class methods</It>, even if the derived class has methods with the same name (i.e., overrides). That is, you can call a base class constructor from within a derived class constructor like so:</P>

      <SyntaxBlock>{
`super().__init__(<argument list>)`
      }</SyntaxBlock>

      <P>Let's tell the <Code>Husky</Code> constructor to call the <Code>Dog</Code> constructor, passing in the <Code>name</Code> and <Code>age</Code> parameters as arguments, accordingly:</P>

      <PythonBlock fileName="husky.py" highlightLines="{8-16}">{
`from dog import Dog
from sled import Sled

class Husky(Dog):
    _energy: int

    def __init__(self, name: str, age: int, energy: int) -> None:
        # This method, being a method of the Husky class, is not
        # supposed to access the _name and _age attributes since they
        # were declared in the Dog class. But, somehow, we need
        # 'self._name' to be assigned the value of the 'name' parameter
        # and 'self._age' to be assigned the value of 'age'. To
        # accomplish this, we pass 'name' and 'age' up to the base
        # class (Dog) constructor, which in turn stores those values in
        # the appropriate attributes:
        super().__init__(name, age)

    def pull_sled(self, sled: Sled) -> None:
        # Remember: parameters are references to their arguments, so
        # modifying the parameter's distance_pulled attribute will
        # also modify the argument's distance_pulled attribute
        sled.distance_pulled += 10
        self._energy -= 10
`
      }</PythonBlock>

      <P>Indeed, this is an extremely common pattern. In fact, any time you create a derived class and implement a constructor for it, the very first thing in that constructor's body should basically <Ul>always</Ul> be a call to the base class's constructor, passing in the appropriate arguments.</P>

      <P>Our <Code>Husky</Code> constructor is still missing one step, though: it needs to define the <Code>_energy</Code> attribute, assigning it the value of the <Code>energy</Code> parameter. Because the <Code>_energy</Code> attribute is private to the <Code>Husky</Code> class, the <Code>Husky</Code> class's constructor is allowed to access and define it directly:</P>

      <PythonBlock fileName="husky.py" highlightLines="{17}">{
`from dog import Dog
from sled import Sled

class Husky(Dog):
    _energy: int

    def __init__(self, name: str, age: int, energy: int) -> None:
        # This method, being a method of the Husky class, is not
        # supposed to access the _name and _age attributes since they
        # were declared in the Dog class. But, somehow, we need
        # 'self._name' to be assigned the value of the 'name' parameter
        # and 'self._age' to be assigned the value of 'age'. To
        # accomplish this, we pass 'name' and 'age' up to the base
        # class (Dog) constructor, which in turn stores those values in
        # the appropriate attributes:
        super().__init__(name, age)
        self._energy = energy

    def pull_sled(self, sled: Sled) -> None:
        # Remember: parameters are references to their arguments, so
        # modifying the parameter's distance_pulled attribute will
        # also modify the argument's distance_pulled attribute
        sled.distance_pulled += 10
        self._energy -= 10
`
      }</PythonBlock>

      <P>Finally, we need to update our program itself. When we create a <Code>Husky</Code>, we now need to pass three arguments into its constructor instead of two (because now we'll be calling the <Code>Husky</Code> constructor instead of the inherited <Code>Dog</Code> constructor). We'll test out the <Code>pull_sled()</Code> method as well while we're at it:</P>

      <PythonBlock fileName="main.py" highlightLines="{2,5-11,17-24}">{
`from husky import Husky
from sled import Sled

def main() -> None:
    # The Husky class now has its own constructor, so this line
    # of code will call that constructor as opposed to the inherited
    # Dog() constructor (however, the Husky constructor, in turn,
    # calls the Dog constructor via the super().__init__(...) line).
    # The Husky constructor requires three arguments: the name, the
    # age, and the energy.
    cool_husky = Husky('Fluffy', 4, 100)

    # The Husky class inherits the bark() method from the Dog class,
    # which prints its _name and _age attributes
    cool_husky.bark()

    # Create a sled for the husky to pull
    fast_sled = Sled()

    # Tell the husky to pull the sled
    cool_husky.pull_sled(fast_sled)

    # See how far the husky pulled the sled (prints 10)
    print(f'Distance sled pulled: {fast_sled.distance_pulled}')

    # (The Husky's energy should have also reduced from 100 to 90,
    # but that's not shown here. We'll revisit this shortly)

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Running the above program produces the following output:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python main.py 
Bark! Bark! My name is Fluffy, and I'm 4 years old
Distance sled pulled: 10
`
      }</TerminalBlock>

      <SectionHeading id="overriding">Overriding</SectionHeading>

      <P>In Python, it is not permissible to define two methods with the same name in the same class (some languages support this through so-called <Bold>method overloads</Bold><Emdash/>which are different from method overrides<Emdash/>but Python does not support such things). However, it <It>is</It> permissible to define a method in a base class, create a derived class that inherits from that base class (and therefore inherits the aforementioned method), and then define another method in that <It>derived</It> class with the same name as the method in the base class. This derived-class method is referred to as a <Bold>method override</Bold>.</P>

      <P>The implication of a method override is that the derived class has two (or more) methods with the same name: the one that it inherits from its base class, and the one that it defines directly (there may be more than two in the case of <Link href="#grandchildren">deep inheritance hierarchies</Link>, such as classes inheriting from classes that inherit from other classes, or multiple inheritance, which is beyond the scope of this course).</P>

      <P>I mentioned this offhandedly earlier in my example about derived-class constructors. As you know, a constructor must be named <Code>__init__()</Code>. Constructors are methods, and, like all methods, they are inherited into derived classes. Hence, if a class A inherits from another class B, and B defines a constructor, then A inherits that constructor as well. But if A <It>also</It> defines a constructor, then both of those constructors will be present in class A. Indeed, class <Code>A</Code> will have two methods with the same name: <Code>__init__</Code>.</P>

      <P>The reason that the derived-class method is referred to as the "override" is that it <Bold>overrides</Bold> the method with the same name inherited from the base class. What I mean by that is this: if a class has two methods with the same name due to an inherited base-class method being overridden by a derived-class method, then when you attempt to <It>call</It> the method by its name, the Python interpreter will <It>assume</It> that you're referring to the derived-class method<Emdash/>not the base-class method. In essence, the derived-class method takes precedence over the base-class method; it "overrides" the base-class method.</P>

      <P>We've seen this already. When we constructed a <Code>Husky</Code> object earlier via <Code>cool_husky = Husky('Fluffy', 4, 100)</Code>, that line of code called the <Code>Husky</Code> class constructor<Emdash/>not the <Code>Dog</Code> class constructor (though the <Code>Husky</Code> constructor calls the <Code>Dog</Code> constructor in turn, but that's besides the point). This is an important detail because the <Code>Husky</Code> class actually has <Ul>two</Ul> constructors (the <Code>Husky</Code> constructor and the <Code>Dog</Code> constructor), but the interpreter automatically calls the derived-class one rather than the base-class one.</P>

      <P>To demonstrate another example of method overrides, I'm going to rewrite our <Code>Dog</Code> and <Code>Husky</Code> classes. Here's the new version of the <Code>Dog</Code> class:</P>

      <PythonBlock fileName="dog.py">{
`class Dog:
    _name: str
    _age: int
    
    def __init__(self, name: str, age: int) -> None:
        self._name = name
        self._age = age

    def vocalize(self) -> None:
        print('Bark! Bark!')

    def print(self) -> None:
        print(f'Name: {self._name}')
        print(f'Age: {self._age}')
`
      }</PythonBlock>

      <P>I've basically separated the <Code>bark()</Code> method into two methods: <Code>vocalize()</Code> and <Code>print()</Code>. The <Code>vocalize()</Code> method prints <Code>'Bark! Bark!'</Code> to the terminal, and the <Code>print()</Code> method prints the dog's name and age to the terminal.</P>

      <P>However, as a husky owner would tell you, huskies don't just <It>bark</It><Emdash/>they <It>howl</It>. So, suppose that when I create a <Code>Husky</Code> object and tell it to <Code>vocalize()</Code>, rather than printing <Code>'Bark! Bark!'</Code> to the terminal, I'd like it to print <Code>'Awooo!'</Code> to the terminal. I can accomplish this by overriding the <Code>vocalize()</Code> method in the <Code>Husky</Code> class:</P>

      <PythonBlock fileName="husky.py" highlightLines="{15-18}">{
`from dog import Dog
from sled import Sled

class Husky(Dog):
    _energy: int

    def __init__(self, name: str, age: int, energy: int) -> None:
        super().__init__(name, age)
        self._energy = energy

    def pull_sled(self, sled: Sled) -> None:
        sled.distance_pulled += 10
        self._energy -= 10

    # Override the vocalize() method. When a husky vocalizes, it says
    # 'Awooo!' instead of 'Bark! Bark!'
    def vocalize(self) -> None:
        print('Awooo!')
`
      }</PythonBlock>

      <P>Let's make use of our new methods. Here's an updated <Code>main()</Code> function:</P>

      <PythonBlock fileName="main.py">{
`from husky import Husky
from sled import Sled

def main() -> None:
    # Calls the Husky constructor, which calls the Dog constructor.
    # The Dog constructor defines the name (_name) and age (_age). The
    # Husky constructor defines the energy value (_energy).
    cool_husky = Husky('Fluffy', 4, 100)

    # Calls the Husky vocalize() method, NOT the Dog vocalize()
    # method (the interpreter automatically calls the derived-class
    # override instead of the original, overridden base-class method)
    cool_husky.vocalize()

    fast_sled = Sled()
    cool_husky.pull_sled(fast_sled)
    print(f'Distance sled pulled: {fast_sled.distance_pulled}')

    # Calls the Dog print() method, as inherited by the Husky
    # class, printing cool_husky's name and age to the terminal.
    cool_husky.print()

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Again, because derived-class methods override base-class methods, <Code>cool_husky.vocalize()</Code> calls the <Code>Husky</Code> class's <Code>vocalize()</Code> method<Emdash/>not the <Code>Dog</Code> class's <Code>vocalize()</Code> method. Running the above program produces the following output:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python main.py 
Awooo!
Distance sled pulled: 10
Name: Fluffy
Age: 4
`
      }</TerminalBlock>

      <P>There's at least one thing that we could improve about the above program: when we call <Code>cool_husky.print()</Code>, it'd be nice if it printed <It>all</It> of the husky's information to the terminal, but it currently only prints the husky's name and age. Indeed, the husky's remaining energy value (i.e., the <Code>_energy</Code> attribute) is omitted from the printout.</P>

      <P>Of course, the <Code>_energy</Code> attribute is defined in the <Code>Husky</Code> class, not the <Code>Dog</Code> class. And because of the direction of inheritance, this means that dogs, in general, do not have an energy value. Huskies do, but arbitrary dogs do not. It wouldn't make any sense, then, try to print the <Code>_energy</Code> attribute from within the <Code>Dog</Code> class's <Code>print()</Code> method. Dogs simply do not have an <Code>_energy</Code> attribute.</P>

      <P>Again, this is the perfect use case for an override. If we override the <Code>print()</Code> method in the <Code>Husky</Code> class, we can have it print <It>all</It> of the Husky's information to the terminal, including its <Code>_energy</Code> attribute. But we'll run into the exact same problem that we did when defining the <Code>Husky</Code> class's constructor: because <Code>_name</Code> and <Code>_age</Code> are declared as private attributes in the <Code>Dog</Code> class, methods of the <Code>Husky</Code> class should not access them directly. This means that the <Code>Husky</Code> class's <Code>print()</Code> method should <It>not</It> directly access the husky's name and age. But, somehow, it needs to print the husky's name and age to the terminal.</P>

      <P>The solution is the same as that of the constructor problem: if we can tell the <Code>Husky</Code> class's <Code>print()</Code> override to <It>call</It> the <Code>Dog</Code> class's <Code>print()</Code> method on the calling object (<Code>self</Code>), that would in turn print the calling object's name and age to the terminal. Again, you might think that you can do this via <Code>self.print()</Code>, and again, that would be <It>almost</It> correct, except it would tell the <Code>Husky</Code> class's <Code>print()</Code> method to call <It>itself</It> rather than to call the inherited base-class method with the same name. And, <It>again</It>, this ambiguity can be resolved via the <Code>super()</Code> function.</P>

      <P>In the constructor case, we wrote <Code>super().__init__(name, age)</Code> to tell the <Code>Husky</Code> constructor to call the <Code>Dog</Code> constructor. In this case, we'll write <Code>super().print()</Code> to tell the <Code>Husky</Code> class's <Code>print()</Code> method to call the <Code>Dog</Code> class's <Code>print()</Code> method:</P>

      <PythonBlock fileName="husky.py" highlightLines="{20-36}">{
`from dog import Dog
from sled import Sled

class Husky(Dog):
    _energy: int

    def __init__(self, name: str, age: int, energy: int) -> None:
        super().__init__(name, age)
        self._energy = energy

    def pull_sled(self, sled: Sled) -> None:
        sled.distance_pulled += 10
        self._energy -= 10

    # Override the vocalize() method. When a husky vocalizes, it says
    # 'Awooo!' instead of 'Bark! Bark!'
    def vocalize(self) -> None:
        print('Awooo!')

    # Override the print() method. When a husky is printed to the
    # terminal, its energy needs to be printed in addition to its
    # name and age
    def print(self) -> None:
        # This method is defined in the Husky class, so it's not
        # supposed to access the inherited _name and _age attributes
        # (they're private to the Dog class). But we need to print
        # them. To that end, we call the Dog class's print() method
        # on the calling object (self), which it indeed has due
        # to inheritance. But that method has the same name as this
        # one, so to avoid this method calling itself, we need to use
        # the super() function to specify that we want to call the
        # base class's print() method.
        super().print()

        # Print the energy value to the terminal
        print(f'Remaining energy: {self._energy}')
`
      }</PythonBlock>

      <P>Now, when we run our program, <Code>cool_husky.print()</Code> calls the <Code>Husky</Code> class's <Code>print()</Code> method rather than the <Code>Dog</Code> class's <Code>print()</Code> method. The <Code>Husky</Code> class's <Code>print()</Code> method in turn calls the <Code>Dog</Code> class's <Code>print()</Code> method via <Code>super().print()</Code> (which prints the husky's name and age to the terminal) before directly printing the husky's energy to the terminal. Here's the new program output:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python main.py 
Awooo!
Distance sled pulled: 10
Name: Fluffy
Age: 4
Remaining energy: 90
`
      }</TerminalBlock>

      <P>In both my examples of the <Code>super()</Code> function, I've used it to call a base-class method from within the derived-class method that overrides said base-class method. However, it's actually more flexible than that<Emdash/>it can be used within <It>any</It> derived-class method to call <It>any</It> base-class method that has been overridden in the derived class. For example, if I wanted to (for some reason), I could write <Code>super().vocalize()</Code> within the body of the <Code>Husky</Code> class's <Code>pull_sled()</Code> method:</P>

      <PythonBlock copyable={false} showLineNumbers={false}>{
`# ... In the Husky class definition
def pull_sled(sled: Sled) -> None:
    # ... (existing code omitted for brevity)
    super().vocalize() # Calls the Dog class's vocalize() method`
      }</PythonBlock>

      <P>That would make the text <Code>'Bark! Bark!'</Code> appear in the terminal whenever a <Code>Husky</Code> object's <Code>pull_sled()</Code> method is called. In contrast, suppose I wrote <Code>self.vocalize()</Code> instead:</P>

      <PythonBlock copyable={false} showLineNumbers={false}>{
`# ... In the Husky class definition
def pull_sled(sled: Sled) -> None:
    # ... (existing code omitted for brevity)
    self.vocalize() # Calls the Husky class's vocalize() method`
      }</PythonBlock>

      <P>That would make the text <Code>'Awooo!'</Code> appear in the terminal whenever a <Code>Husky</Code> object's <Code>pull_sled()</Code> method is called.</P>

      <P>It's also possible to use the <Code>super()</Code> function <It>outside</It> of a class method (e.g., from within the <Code>main()</Code> function). This allows you to call overridden base-class methods on arbitrary objects. But that's beyond the scope of this course.</P>

      <P>(For the curious reader, an example of the correct syntax would be to write <Code>super(Husky, cool_husky).vocalize()</Code> in our <Code>main()</Code> function, which would call the <Code>Dog</Code> class's <Code>vocalize()</Code> method instead of the <Code>Husky</Code> class's <Code>vocalize()</Code> method. Indeed, when used outside a class method, the <Code>super()</Code> function must be given two arguments, the first being the derived class itself, and the second being the object whose overridden base-class methods you'd like to call). </P>

      <P>The power of overrides becomes more apparent in larger demonstrations with more classes. For example, we could have thirty different species-specific classes that all inherit from the <Code>Dog</Code> class, and many of them could override the <Code>vocalize()</Code> method, each in their own way. Perhaps a husky says "Awooo!", but a yorkshire terrier says "yip!". Also, suppose that many of those classes <It>don't</It> override the <Code>vocalize()</Code> method. That's perfectly okay<Emdash/>they'd still have the inherited <Code>vocalize()</Code> method from the <Code>Dog</Code> class, meaning the would simply print "Bark! Bark!" when their <Code>vocalize()</Code> method is called (indeed, the base-class method sort of serves as a "default" behavior if it's not overridden in a given derived class). I could write out such an example, but this lecture is already getting quite long, so I'll leave that as an exercise to the reader.</P>

      <P>(And the <It>true</It> power of overrides is showcased by polymorphism. But that's <Link href={`${PARENT_PATH}/${allPathData["polymorphism"].pathName}`}>a different lecture</Link>.)</P>

      <P>Before we move on, here are some rules of thumb to keep in mind:</P>

      <Itemize>
        <Item><P>When practicing encapsulation (e.g., when creating a "proper" class, as opposed to a simple POD type), a given class should generally be responsible for its own attributes. Its attributes should generally be private, and they should only be accessed by methods of that exact class (not even methods of its derived classes should access them directly, even though they are <It>inherited</It> by those derived classes).</P></Item>
        <Item><P>When a derived-class method needs to perform some operation(s) on a private attribute inherited from its base class, rather than accessing and operating on that attribute directly (which would violate the previous rule of thumb), it should instead call a (public) method inherited from the base class. That method, then, can perform the necessary operation(s) on the private attribute.</P></Item>
        <Item><P>In order to call an <It>overridden</It> base-class method (i.e., a method in the base class that has the same name as a method in the derived class), the <Code>super()</Code> function can be used. For example, <Code>super().__init__()</Code> allows a derived class's constructor to call its base class's constructor (as opposed to calling itself, despite the fact that they're both named <Code>__init__</Code>). Similarly, <Code>super().print()</Code> allows a method of a derived class to call its base class's <Code>print()</Code> method, even if the derived class overrides that method with its own <Code>print()</Code> method.</P></Item>
      </Itemize>

      <SectionHeading id="grandchildren">Grandchildren</SectionHeading>

      <P>A base class may also be a derived class. That's to say, it's possible to create inheritance hierarchies that are deeper than two layers, wherein a class inherits from another class that, in turn, inherits from <It>another</It> class (and so on). For various reasons, extremely deep inheritance hierarchies are often a sign of poor code design. But in some cases, it's perfectly fine (and useful) to have more than just two layers.</P>

      <P>I've told you that base classes are also called superclasses, and derived classes are also called subclasses. But there's <It>another</It> pair of terms to describe these things: base classes can also be called <Bold>parent</Bold> classes, and derived classes can also be called <Bold>child classes</Bold>. This is because inheritance hierarchies are often diagrammed as trees; each class is a node, and derived classes are represented as child nodes of their respective base classes' nodes.</P>

      <P>When three layers are present in an inheritance hierarchy, this sort of establishes a "grandparent / grandchild" relationship: the class at the top of the inheritance tree is the grandparent, and the classes at the bottom of the tree are the grandchildren.</P>

      <P>Anything that's inherited into a child class is also inherited into the grandchild class(es). So if class A inherits from class B, which inherits from class C, then anything declared or defined within class C is inherited into B, but it's <It>also</It> inherited all the way down into A (because A inherits it from B, which inherits it from C).</P>

      <P>For example, we could create a <Code>Pet</Code> class, from which the <Code>Dog</Code> class is derived (establishing the "is-a" relationship that dogs <Ul>are</Ul> pets in the context of our program):</P>

      <PythonBlock fileName="pet.py">{
`class Pet:
    _owners_name: str

    def __init__(self, owners_name: str) -> None:
        self._owners_name = owners_name

    def print(self) -> None:
        print(f"Owner's name: {self._owners_name}")
`
      }</PythonBlock>

      <P>All pets have an owner, and the owner's name is stored in the <Code>Pet</Code> object's private <Code>_owners_name</Code> attribute.</P>

      <P>Next, we'll update the <Code>Dog</Code> class to establish the inheritance relationship. Since dogs are pets, and pets have an <Code>_owners_name</Code> attribute, dogs will also have an <Code>_owners_name</Code> attribute. Whenever a <Code>Dog</Code> object is constructed, then, we need to be able to specify the name of its owner, and we need to store that name in the dog's <Code>_owners_name</Code> attribute. We can do this by updating our <Code>Dog</Code> constructor, giving it an <Code>owners_name</Code> parameter and having it pass that parameter as an argument up to the <Code>Pet</Code> class constructor. Finally, whenever a <Code>Dog</Code> object is printed to the terminal, we want its owner's name to be printed as well, which we can accomplish by updating the <Code>Dog</Code> class's <Code>print()</Code> method to have it call the <Code>Pet</Code> class's <Code>print()</Code> method. Here's the updated <Code>Dog</Code> class:</P>

      <PythonBlock fileName="dog.py" highlightLines="{1,7-11,20-22}">{
`from pet import Pet

class Dog(Pet):
    _name: str
    _age: int
    
    def __init__(self, owners_name: str, name: str, age: int) -> None:
        # Call the Pet class's constructor, passing the owner's name
        # up to it as an argument to be stored in the _owners_name
        # attribute
        super().__init__(owners_name)

        self._name = name
        self._age = age

    def vocalize(self) -> None:
        print('Bark! Bark!')

    def print(self) -> None:
        # Call the Pet class's print() method, printing the name
        # of the dog's owner
        super().print()

        print(f'Name: {self._name}')
        print(f'Age: {self._age}')
`
      }</PythonBlock>

      <P>Now that the <Code>Dog</Code> class's constructor has an additional parameter for the owner's name, we need to update the <Code>Husky</Code> constructor accordingly. We'll give it a fourth parameter to specify the owner's name, and we'll have it pass that parameter as an argument up to the <Code>Dog</Code> class's constructor (along with the name and age):</P>

      <PythonBlock fileName="husky.py" highlightLines="{9,13}">{
`from dog import Dog
from sled import Sled

class Husky(Dog):
    _energy: int

    def __init__(
            self,
            owners_name: str,
            name: str,
            age: int,
            energy: int) -> None:
        super().__init__(owners_name, name, age)
        self._energy = energy

    def pull_sled(self, sled: Sled) -> None:
        sled.distance_pulled += 10
        self._energy -= 10

    # Override the vocalize() method. When a husky vocalizes, it says
    # 'Awooo!' instead of 'Bark! Bark!'
    def vocalize(self) -> None:
        print('Awooo!')

    # Override the print() method. When a husky is printed to the
    # terminal, its energy needs to be printed in addition to its
    # name and age
    def print(self) -> None:
        # This method is defined in the Husky class, so it's not
        # supposed to access the inherited _name and _age attributes
        # (they're private to the Dog class). But we need to print
        # them. To that end, we call the Dog class's print() method
        # on the calling object (self), which it indeed has due
        # to inheritance. But that method has the same name as this
        # one, so to avoid this method calling itself, we need to use
        # the super() function to specify that we want to call the
        # base class's print() method.
        super().print()

        # Print the energy value to the terminal
        print(f'Remaining energy: {self._energy}')
`
      }</PythonBlock>

      <P>Finally, let's update our <Code>main()</Code> function so that, when we construct <Code>cool_husky</Code>, we pass in a fourth argument for the owner's name:</P>

      <PythonBlock fileName="main.py" highlightLines="{5-10,21-25}">{
`from husky import Husky
from sled import Sled

def main() -> None:
    # Calls the Husky constructor, which calls the Dog constructor,
    # which calls the Pet constructor. The Pet constructor defines
    # the husky's owner's name (_owners_name). The Dog constructor
    # defines the name (_name) and age (_age). The Husky constructor
    # defines the energy value (_energy).
    cool_husky = Husky('Steve', 'Fluffy', 4, 100)

    # Calls the Husky vocalize() method, NOT the Dog vocalize()
    # method (the interpreter automatically calls the derived-class
    # override instead of the original, overridden base-class method)
    cool_husky.vocalize()

    fast_sled = Sled()
    cool_husky.pull_sled(fast_sled)
    print(f'Distance sled pulled: {fast_sled.distance_pulled}')

    # Calls the Husky print() method, which calls the Dog print()
    # method, which calls the Pet print() method. The Pet print()
    # method prints the husky's owner's name. The Dog print() method
    # additionally prints the husky's name and age. The Husky
    # print() method prints the husky's energy value.
    cool_husky.print()

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Running the above program produces the following output:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python main.py 
Awooo!
Distance sled pulled: 10
Owner's name: Steve
Name: Fluffy
Age: 4
Remaining energy: 90
`
      }</TerminalBlock>

      <P>Let's make sure you understand what's going on.</P>

      <P>If you were to construct a <Code>Pet</Code> object (e.g., via <Code>my_cool_pet = Pet('Sally')</Code>), then that object would have a single <Code>print()</Code> method and no <Code>vocalize()</Code> methods. If you called its <Code>print()</Code> method (e.g., <Code>my_cool_pet.print()</Code>), that would simply execute the <Code>Pet</Code> class's <Code>print()</Code> method. If you <It>tried</It> to call its <Code>vocalize()</Code> method (e.g., <Code>my_cool_pet.vocalize()</Code>), that would produce a runtime error (and Mypy errors) since <Code>Pet</Code> objects do not have a <Code>vocalize()</Code> method.</P>

      <P>If you were to construct a <Code>Dog</Code> object (e.g., via <Code>my_cool_dog = Dog('Sally', 'Spot', 4)</Code>), then that object would have two <Code>print()</Code> methods (the one inherited from the <Code>Pet</Code> class, and the override defined in the <Code>Dog</Code> class) and one <Code>vocalize()</Code> method (the one defined in the <Code>Dog</Code> class). If you were to call its <Code>print()</Code> method (e.g., via <Code>my_cool_dog.print()</Code>), that would execute the <Code>Dog</Code> class's <Code>print()</Code> method, which would <It>in turn</It> execute the <Code>Pet</Code> class's <Code>print()</Code> method via <Code>super().print()</Code>. If you were to call its <Code>vocalize()</Code> method, that would simply execute the <Code>Dog</Code> class's <Code>vocalize()</Code> method, printing <Code>'Bark! Bark!'</Code> to the terminal.</P>

      <P>If you were to construct a <Code>Husky</Code> object (e.g., via <Code>cool_husky = Husky('Steve', 'Fluffy', 4, 100)</Code>, as above), then that object would have three <Code>print()</Code> methods (the <It>two</It> inherited from the <Code>Dog</Code> class, and the override defined in the <Code>Husky</Code> class) and two <Code>vocalize()</Code> methods (the one inherited from the <Code>Dog</Code> class, and the override defined in the <Code>Husky</Code> class). If you were to call its <Code>print()</Code> method, that would execute the <Code>Husky</Code> class's <Code>print()</Code> method, which would in turn call the <Code>Dog</Code> class's <Code>print()</Code> method, which would in turn call the <Code>Pet</Code> class's <Code>print()</Code> method. If you were to call its <Code>vocalize()</Code> method, that would execute the <Code>Husky</Code> class's <Code>vocalize()</Code> method, printing <Code>'Awooo!'</Code> to the terminal.</P>

      <SectionHeading id="square-rectangle-conundrum">(Optional content) When is a square not a rectangle?</SectionHeading>

      <P>Although it's commonly said that inheritance establishes "is-a" relationships, that's a bit of an oversimplified analogy, , depending on your class designand there are cases where it falls apart. A classic counterexample is the "square-is-a-rectangle" conundrum.</P>

      <P>In real life, a square is of course a rectangle (it's a quadrilateral consisting of four right angles, and that's the definition of a rectangle). However, depending on your class design, it might not be appropriate to represent this real-life is-a relationship with an inheritance relationship in your codebase.</P>

      <P>Suppose the <Code>Rectangle</Code> class looks like this:</P>

      <PythonBlock fileName="rectangle.py">{
`class Rectangle:
    _length: float
    _width: float

    def __init__(self, length: float, width: float) -> None:
        self._length = length
        self._width = width

    # Getters and setters
    def get_length(self) -> float:
        return self._length

    def get_width(self) -> float:
        return self._width

    def set_length(self, length: float) -> None:
        self._length = length

    def set_width(self, width: float) -> None:
        self._width = width
`
      }</PythonBlock>

      <P>Now suppose the derived <Code>Square</Code> class looks like this:</P>

      <PythonBlock fileName="square.py">{
`from rectangle import Rectangle

class Square(Rectangle):
    def __init__(self, side_length: float):
        # A square does not have a separate length or width, just
        # a single side_length. So that's what this constructor
        # receives as a parameter. We then pass it up as both the
        # length AND the width to the Rectangle constructor, storing
        # it in both the _length AND _width attributes
        super().__init__(side_length, side_length)
`
      }</PythonBlock>

      <P>Finally, consider the following program:</P>

      <PythonBlock fileName="main.py">{
`from rectangle import Rectangle
from square import Square

def main() -> None:
    # Create a 4x3 rectangle
    r = Rectangle(4.0, 3.0)

    # Change its length to 5 (so that it's a 5x3 rectangle)
    r.set_length(5.0)

    # Print its length and width
    print(f'Length: {r.get_length()}') # Prints 5.0
    print(f'Width: {r.get_width()}') # Prints 3.0

    # Create a 4x4 square
    s = Square(4.0)

    # Fine, but suppose we call its set_length() function, changing
    # its length
    s.set_length(5.0)

    # Notice: it's no longer a square! Its length and width are are
    # different (length is 5, width is still 4)
    print(f'Length: {s.get_length()}') # Prints 5.0
    print(f'Width: {s.get_width()}') # Prints 4.0

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Indeed, because squares "are" rectangles, and rectangles have <Code>set_length()</Code> and <Code>set_width()</Code> methods, squares <It>also</It> have <Code>set_length()</Code> and <Code>set_width()</Code> methods. That's hugely problematic; it allows us to independently modify a square's length and width. If we do that<Emdash/>if we modify a square's length but not its width (or vice-versa)<Emdash/>then it's definitionally not a square anymore even though its <It>type</It> is still <Code>Square</Code>. If we then passed it to a function that expects its <Code>Square</Code> parameter to have equal side lengths, that function would be sorely mistaken, and bugs could ensue. This is also a fairly subtle mistake. Mypy is not going to give us any errors or warnings.</P>

      <P>Put another way, the <Code>Square</Code> class should have a class invariant enforcing that its length and width are always the same, but it doesn't. And, in this case, so long as the <Code>Square</Code> class inherits from the <Code>Rectangle</Code> class, there's no way that we could ever create that class invariant because the setters inherited from the <Code>Rectangle</Code> class inherently violate it.</P>

      <P>You could <It>try</It> to create the invariant by overriding the setters in the <Code>Square</Code> class. For example:</P>

      <PythonBlock fileName="square.py" highlightLines="{12-21}">{
`from rectangle import Rectangle

class Square(Rectangle):
    def __init__(self, side_length: float):
        # A square does not have a separate length or width, just
        # a single side_length. So that's what this constructor
        # receives as a parameter. We then pass it up as both the
        # length AND the width to the Rectangle constructor, storing
        # it in both the _length AND _width attributes
        super().__init__(side_length, side_length)

    # Setter overrides. When modifying a square's length or width, it
    # actually modifies BOTH, forcing them to remain the equal to
    # each other.
    def set_length(self, side_length: float) -> None:
        super().set_length(side_length)
        super().set_width(side_length)

    def set_width(self, side_length: float) -> None:
        super().set_length(side_length)
        super().set_width(side_length)
`
      }</PythonBlock>

      <P>And, indeed, this does fix the problem in the previous example:</P>

      <PythonBlock fileName="main.py" highlightLines="{18-25}">{
`from rectangle import Rectangle
from square import Square

def main() -> None:
    # Create a 4x3 rectangle
    r = Rectangle(4.0, 3.0)

    # Change its length to 5 (so that it's a 5x3 rectangle)
    r.set_length(5.0)

    # Print its length and width
    print(f'Length: {r.get_length()}') # Prints 5.0
    print(f'Width: {r.get_width()}') # Prints 3.0

    # Create a 4x4 square
    s = Square(4.0)

    # This now calls the Square set_length() method, which in turn
    # calls the Rectangle class's set_length() AND set_width() methods,
    # setting the square's length AND width to 5. So it's still a
    # square!
    s.set_length(5.0)

    print(f'Length: {s.get_length()}') # Prints 5.0
    print(f'Width: {s.get_width()}') # Prints 5.0

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>However, as I mentioned in a note earlier, it's possible to use the <Code>super()</Code> function call overridden base-class methods on objects from anywhere; it doesn't <It>have</It> to be done from within a derived-class method. That's to say, even though <Code>s</Code> is a <Code>Square</Code>, and the <Code>Square</Code> class overrides the setters inherited from the <Code>Rectangle</Code> class, that doesn't change the fact that squares are still rectangles, so <Code>s</Code> still <It>has</It> those overridden setters. And if it has those setters, it's still technically possible to call them. It just requires using a slightly different syntax with the <Code>super()</Code> function:</P>

      <PythonBlock fileName="main.py" highlightLines="{27-35}">{
`from rectangle import Rectangle
from square import Square

def main() -> None:
    # Create a 4x3 rectangle
    r = Rectangle(4.0, 3.0)

    # Change its length to 5 (so that it's a 5x3 rectangle)
    r.set_length(5.0)

    # Print its length and width
    print(f'Length: {r.get_length()}') # Prints 5.0
    print(f'Width: {r.get_width()}') # Prints 3.0

    # Create a 4x4 square
    s = Square(4.0)

    # This now calls the Square set_length() method, which in turn
    # calls the Rectangle class's set_length() AND set_width() methods,
    # setting the square's length AND width to 5. So it's still a
    # square!
    s.set_length(5.0)

    print(f'Length: {s.get_length()}') # Prints 5.0
    print(f'Width: {s.get_width()}') # Prints 5.0

    # Uh oh! It's still possible to call the Rectangle class's setters
    # on s, which it has because the Square class inherits from the
    # Rectangle class (overriding an inherited method does not get rid
    # of it!). This sets s's length to 1.0, but its width is still 5.0.
    # So it's not a valid square anymore :(
    super(Square, s).set_length(1.0)

    print(f'Length: {s.get_length()}') # Prints 1.0
    print(f'Width: {s.get_width()}') # Prints 5.0

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Again, so long as the <Code>Square</Code> class inherits from the <Code>Rectangle</Code> class, and the <Code>Rectangle</Code> class continues to provide setters for the length and width, there is no way around this problem<Emdash/>it will always be possible to create a <Code>Square</Code> object whose length is not equal to its width. And, again, that's a huge problem. Many functions will <It>expect</It> squares to have equal lengths and widths, and if that assumption is violated, various problems could occur.</P>

      <P>There are two solutions, then:</P>

      <Enumerate>
        <Item><P>Remove the inheritance relationship. That is, make the <Code>Square</Code> class <It>not</It> inherit from the <Code>Rectangle</Code> class. Whatever attributes and methods a <Code>Square</Code> needs to have can be declared / defined directly in the <Code>Square</Code> class.</P></Item>
        <Item><P>Remove the setters from the <Code>Rectangle</Code> class. To be clear, you would <Ul>not</Ul> have to remove the getters<Emdash/>just the setters. Technically, it'd still be possible to modify the length and width of a <Code>Square</Code> or <Code>Rectangle</Code> object independently, but it'd require directly accessing <Code>_length</Code> or <Code>_width</Code> from somewhere other than within a method of the <Code>Rectangle</Code> class. And you're not supposed to do that anyways (if someone messes with private attributes and accidentally violates a class invariant, that's their fault).</P></Item>
      </Enumerate>

      <P>In some cases, either option could work. But in other cases, you might really want to keep those setters around, which would make option b) non-viable.</P>

      <P>(Though, if you went with option b and needed to modify the length or width of a <Code>Rectangle</Code> object, a relatively simple alternative would be to simply create a new <Code>Rectangle</Code> object. This is in line with how things are typically done in a functional paradigm. For example, if you need to modify the <Code>_length</Code> attribute of a <Code>Rectangle</Code> called <Code>r</Code>, changing its value to <Code>12.0</Code>, you could <It>simulate</It> that effect via <Code>r = Rectangle(12.0, r.get_width())</Code>. Of course, if there are any other references to the object that <Code>r</Code> references, this would <It>not</It> update those objects. So this isn't <It>exactly</It> the same thing as <Code>r.set_length(12.0)</Code>. But it's sufficient in many cases.)</P>

      <P>That's just one example of how the "inheritance represents is-a relationships" mindset is a bit oversimplified and can get you into trouble. Yes, in real life, squares "are" rectangles, but that doesn't necessarily mean that it's appropriate to represent that idea using inheritance. Other problematic examples abound.</P>

      <P>A much better mindset is provided by the <Link href="https://en.wikipedia.org/wiki/Liskov_substitution_principle">Liskov Substitution Principle (LSP)</Link>. It's the L in <Link href="https://en.wikipedia.org/wiki/SOLID">SOLID</Link>, meaning that it's one of the five major principles of object-oriented software design. It states that derived-class objects should always be substitutable for base-class objects, without breaking any intended class invariants or other program properties. That is, in any situation where a base-class object is expected, it should be sensible to provide a derived-class object instead. If you can think of a counterexample wherein providing a derived-class object in substitution for a base-class object does not make sense (e.g., where it would break an intended class invariant), then that inidicates an LSP violation. In such a case, either the inheritance should be removed altogether, or the base class's interface should be modified to resolve the counterexample(s).</P>

      <P>For example, if a function has a <Code>Rectangle</Code> parameter <Code>r</Code> and calls <Code>r.set_length(5.0)</Code>, then it would not make sense to pass in a <Code>Square</Code> object as a substitute since that would modify the square's length but not its width (violating the definition of a <Code>Square</Code>). This is a clear counterexample in that it indicates that <Code>Square</Code> objects are <Ul>not</Ul> always substitutable for <Code>Rectangle</Code> objects, which means that the <Code>Square</Code> class should <Ul>not</Ul> inherit from the <Code>Rectangle</Code> class (or the setters should be removed to resolve this counterexample and establish the substitutability).</P>

      <P>The LSP basically suggests that we should treat inheritance as establishing "substitutable-for" relationships rather than "is-a" relationships. Although these are very similar concepts, the former is a bit more rigorous, and it helps avoid common design mistakes like the square-is-a-rectangle conundrum.</P>
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
