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
        <Item><Link href="#setting-the-stage">Setting the stage</Link></Item>
        <Item><Link href="#generics">Generics</Link></Item>
        <Item><Link href="#data-structures-as-generics">Data structures as generics</Link></Item>
        <Item><Link href="#other-details">Other details</Link></Item>
      </Itemize>

      <SectionHeading id="setting-the-stage">Setting the stage</SectionHeading>

      <P>Suppose you're developing an ecommerce platform where registered vendors can sell products to customers around the world. To separate concerns and keep reviews cleanly organized, each vendor is registered to sell products from a single, select category. For example, one vendor might sell furniture, and another vendor might sell automobiles, but a single vendor may not sell both of these things (if a vendor would like to sell both of these things, they must register two vendor accounts<Emdash/>one per product category).</P>

      <P>Somehow, this needs to be represented in code. Suppose that one of the product categories is furniture. Then we need a <Code>FurnitureItem</Code> class to represent an item of furniture:</P>

      <PythonBlock fileName="furnitureitem.py">{
`class FurnitureItem:
    _name: str # Name of furniture item
    _price: float # Price in dollars
    
    def __init__(self, name: str, price: float) -> None:
        self._name = name
        self._price = price

    def get_price(self) -> float:
        return self._price

    def print(self) -> None:
        print(f'  - Item: {self._name}')
        # Note: {x:.2f} prints the value of x to 2 decimal places
        print(f'    Price: \${self._price:.2f}')`
      }</PythonBlock>

      <P>If our software platform has furniture, then surely it also has vendors who are registered to sell furniture. Then we need a <Code>FurnitureVendor</Code> class to represent these vendors:</P>

      <PythonBlock fileName="furniturevendor.py">{
`from furnitureitem import FurnitureItem

class FurnitureVendor:
    _name: str # The vendor's name
    _profit: float # Total profit made
    _furniture: list[FurnitureItem] # Inventory

    def __init__(self, name: str) -> None:
        self._name = name
        self._profit = 0.0
        self._furniture = []

    def add_to_stock(self, furniture_item: FurnitureItem) -> None:
        self._furniture.append(furniture_item)

    def sell(self, idx: int) -> None:
        # Increase the vendor's total profit based on the price of
        # the sold furniture item
        self._profit += self._furniture[idx].get_price()

        # Remove the sold furniture item
        del self._furniture[idx]

    # Prints the vendor's information to the terminal
    def print(self) -> None:
        print(f'Name: {self._name}')
        # Note: '{x:.2f}' Prints x to 2 decimal places
        print(f'Total profit: \${self._profit:.2f}')
        print(f'Inventory:')
        for item in self._furniture:
            item.print()
`
      }</PythonBlock>

      <P>Just to get a vision for what's going on, here's a very simple example program:</P>

      <PythonBlock fileName="main.py">{
`from furniturevendor import FurnitureVendor
from furnitureitem import FurnitureItem

def main() -> None:
    john = FurnitureVendor('John')
    john.add_to_stock(FurnitureItem('Couch', 100.00))
    
    print("John's information prior to selling his couch:")
    john.print()
    print()

    john.sell(0)

    print("John's information after selling his couch:")
    john.print()


if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Running the above program produces the following output:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python main.py 
John's information prior to selling his couch:
Name: John
Total profit: $0.00
Inventory:
  - Item: Couch
    Price: $100.00

John's information after selling his couch:
Name: John
Total profit: $100.00
Inventory:
`
      }</TerminalBlock>

      <P>So far so good, but our platform is meant to be a general purpose ecommerce platform. Currently, furniture is the only kind of product, and furniture vendors are the only kinds of vendors. Let's add one more kind of product and associated vendor: automobiles. First, the <Code>Automobile</Code> class:</P>

      <PythonBlock fileName="automobile.py">{
`class Automobile:
    _manufacturer: str # Manufacturer that made the car
    _year: int # Year in which the car was built
    _model: str # The name of the car model
    _price: float # Price in dollars
    
    def __init__(
            self,
            manufacturer: str,
            year: int,
            model: str,
            price: float) -> None:
        self._manufacturer = manufacturer
        self._year = year
        self._model = model
        self._price = price

    def get_price(self) -> float:
        return self._price

    def print(self) -> None:
        print(f'  - Item: {self._year} {self._manufacturer} '
            f'{self._model}')
        # Note: {x:.2f} prints the value of x to 2 decimal places
        print(f'    Price: \${self._price:.2f}')
`
      }</PythonBlock>

      <P>Next, the <Code>AutomobileVendor</Code> class:</P>

      <PythonBlock fileName="automobilevendor.py">{
`from automobile import Automobile

class AutomobileVendor:
    _name: str # The vendor's name
    _profit: float # Total profit made
    _automobiles: list[Automobile] # Inventory

    def __init__(self, name: str) -> None:
        self._name = name
        self._profit = 0.0
        self._automobiles = []

    def add_to_stock(self, automobile: Automobile) -> None:
        self._automobiles.append(automobile)

    def sell(self, idx: int) -> None:
        # Increase the vendor's total profit based on the price of
        # the sold furniture item
        self._profit += self._automobiles[idx].get_price()

        # Remove the sold furniture item
        del self._automobiles[idx]

    # Prints the vendor's information to the terminal
    def print(self) -> None:
        print(f'Name: {self._name}')
        # Note: '{x:.2f}' Prints x to 2 decimal places
        print(f'Total profit: \${self._profit:.2f}')
        print(f'Inventory:')
        for item in self._automobiles:
            item.print()
`
      }</PythonBlock>

      <P>Finally, I'll update the demonstration so that you can see these new classes in action:</P>

      <PythonBlock fileName="main.py">{
`from furniturevendor import FurnitureVendor
from furnitureitem import FurnitureItem
from automobilevendor import AutomobileVendor
from automobile import Automobile

def main() -> None:
    #################################
    #### Furniture demonstration ####
    #################################
    
    john = FurnitureVendor('John')
    john.add_to_stock(FurnitureItem('Couch', 100.00))
    
    print("John's information prior to selling his couch:")
    john.print()
    print()

    john.sell(0)

    print("John's information after selling his couch:")
    john.print()

    print()
    print()

    ##################################
    #### Automobile demonstration ####
    ##################################

    samantha = AutomobileVendor('Samantha')
    samantha.add_to_stock(Automobile('Ford', 2001, 'Taurus', 2000.00))

    print("Samantha's information prior to selling her Ford Taurus:")
    samantha.print()
    print()
    
    samantha.sell(0)

    print("Samantha's information after selling her Ford Taurus:")
    samantha.print()

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Running the above program produces the following output:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python main.py 
John's information prior to selling his couch:
Name: John
Total profit: $0.00
Inventory:
  - Item: Couch
    Price: $100.00

John's information after selling his couch:
Name: John
Total profit: $100.00
Inventory:


Samantha's information prior to selling her Ford Taurus:
Name: Samantha
Total profit: $0.00
Inventory:
  - Item: 2001 Ford Taurus
    Price: $2000.00

Samantha's information after selling her Ford Taurus:
Name: Samantha
Total profit: $2000.00
Inventory:
`
      }</TerminalBlock>

      <P>The above program works just fine, but if you look carefully at the <Code>FurnitureVendor</Code> and <Code>AutomobileVendor</Code> classes, you'll notice something peculiar: they're <It>extremely</It> similar to one another. Besides the fact that some of their variables' names are different from one another (which is immaterial<Emdash/>names are just names), the <It>only</It> difference between these two classes whatsoever is that the <Code>FurnitureVendor</Code> class has an an attribute that stores a list of <Code>FurnitureItem</Code> elements (<Code>_furniture</Code>) whereas the <Code>AutomobileVendor</Code> class has an attribute that stores a list of <Code>Automobile</Code> elements (<Code>_automobiles</Code>). And, of course, this also means that some of the classes' corresponding methods may have different parameter types or return types from one another (e.g., the <Code>FurnitureVendor</Code> class's <Code>add_to_stock()</Code> method has a parameter of type <Code>FurnitureItem</Code>, whereas the <Code>AutomobileVendor</Code> class's corresponding <Code>add_to_stock()</Code> method has a parameter of type <Code>Automobile</Code>). But they <It>use</It> those parameters and return values in the exact same ways.</P>

      <P>In fact, if we took the <Code>FurnitureVendor</Code> class and used Vim's find-and-replace feature to replace all instances of the word <Code>FurnitureItem</Code> with the word <Code>Automobile</Code> (and updated the import statements at the top of the file appropriately), the resulting class would essentially be identical to the <Code>AutomobileVendor</Code> class (again, except for some variable names).</P>

      <P>If that sounds like a lot of unnecessary code replication, that's because it is. Imagine how much worse it'd be if our platform supported 100 different categories of products instead of just two.</P>

      <P>So let's try to eliminate that code replication. A naive idea might be to use polymorphism. Rather than having a <Code>FurnitureVendor</Code> class and an <Code>AutomobileVendor</Code> class, we might have a single <Code>Vendor</Code> class. And rather than a <Code>Vendor</Code> object having a list of <Code>FurnitureItem</Code> objects (<Code>_furniture</Code>) or a list of <Code>Automobile</Code> objects (<Code>_automobiles</Code>), they could just have a list of <Code>Item</Code> objects (e.g., <Code>_inventory</Code>). Finally, the <Code>FurnitureItem</Code> and <Code>Automobile</Code> classes could inherit from the <Code>Item</Code> class, which could in turn serve as an abstract interface (e.g., with an abstract <Code>print()</Code> method).</P>

      <P>Let's give this a try, starting with the <Code>Item</Code> class:</P>

      <PythonBlock fileName="item.py">{
`from abc import ABC, abstractmethod

class Item:
    _price: float # Every item has a price

    def __init__(self, price: float) -> None:
        self._price = price

    def get_price(self) -> float:
        return self._price

    # Every item can be printed to the terminal (but different items
    # have different information that needs to be printed in different
    # formats, so we make this an abstract method, which we'll override
    # in the derived classes)
    @abstractmethod
    def print(self) -> None:
        pass
`
      }</PythonBlock>

      <P>We want the <Code>FurnitureItem</Code> and <Code>Automobile</Code> classes to inherit from the <Code>Item</Code> class and override the <Code>print()</Code> method. This will require rewriting these two classes. First, the <Code>FurnitureItem</Code> class:</P>

      <PythonBlock fileName="furnitureitem.py">{
`from item import Item

class FurnitureItem(Item):
    _name: str # Name of furniture item
    
    def __init__(self, name: str, price: float) -> None:
        super().__init__(price)
        self._name = name

    def print(self) -> None:
        print(f'  - Item: {self._name}')
        # Note: {x:.2f} prints the value of x to 2 decimal places
        print(f'    Price: \${self.get_price():.2f}')
`
      }</PythonBlock>

      <P>Next, the <Code>Automobile</Code> class:</P>

      <PythonBlock fileName="automobile.py">{
`from item import Item

class Automobile(Item):
    _manufacturer: str # Manufacturer that made the car
    _year: int # Year in which the car was built
    _model: str # The name of the car model
    
    def __init__(
            self,
            manufacturer: str,
            year: int,
            model: str,
            price: float) -> None:
        super().__init__(price)
        self._manufacturer = manufacturer
        self._year = year
        self._model = model

    def print(self) -> None:
        print(f'  - Item: {self._year} {self._manufacturer} '
            f'{self._model}')
        # Note: {x:.2f} prints the value of x to 2 decimal places
        print(f'    Price: \${self.get_price():.2f}')
`
      }</PythonBlock>

      <P>Finally, we can fulfill our objective: we can remove the <Code>FurnitureVendor</Code> and <Code>AutomobileVendor</Code> classes entirely, replacing them with a single <Code>Vendor</Code> class. Each <Code>Vendor</Code> object simply has an inventory of (upcasted) <Code>Item</Code> objects. Here it is:</P>

      <PythonBlock fileName="vendor.py">{
`from item import Item

class Vendor:
    _name: str # The vendor's name
    _profit: float # Total profit made
    _inventory: list[Item] # Inventory

    def __init__(self, name: str) -> None:
        self._name = name
        self._profit = 0.0
        self._inventory = []

    def add_to_stock(self, item: Item) -> None:
        self._inventory.append(item)

    def sell(self, idx: int) -> None:
        # Increase the vendor's total profit based on the price of
        # the sold item
        self._profit += self._inventory[idx].get_price()

        # Remove the sold item
        del self._inventory[idx]

    # Prints the vendor's information to the terminal
    def print(self) -> None:
        print(f'Name: {self._name}')
        # Note: '{x:.2f}' Prints x to 2 decimal places
        print(f'Total profit: \${self._profit:.2f}')
        print(f'Inventory:')
        for item in self._inventory:
            item.print()
`
      }</PythonBlock>

      <P>Let's update our demonstration again:</P>

      <PythonBlock fileName="main.py">{
`from vendor import Vendor
from furnitureitem import FurnitureItem
from automobile import Automobile

def main() -> None:
    #################################
    #### Furniture demonstration ####
    #################################
    
    john = Vendor('John')
    john.add_to_stock(FurnitureItem('Couch', 100.00))
    
    print("John's information prior to selling his couch:")
    john.print()
    print()

    john.sell(0)

    print("John's information after selling his couch:")
    john.print()

    print()
    print()

    ##################################
    #### Automobile demonstration ####
    ##################################

    samantha = Vendor('Samantha')
    samantha.add_to_stock(Automobile('Ford', 2001, 'Taurus', 2000.00))

    print("Samantha's information prior to selling her Ford Taurus:")
    samantha.print()
    print()
    
    samantha.sell(0)

    print("Samantha's information after selling her Ford Taurus:")
    samantha.print()

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Running the above program produces the same output as before. But now, we only have a single <Code>Vendor</Code> class rather than having a separate class for each kind of vendor.</P>

      <P>This seems like progress, but there's an issue with how we're representing vendors in our program now. Consider: There's absolutely nothing stopping us from adding an <Code>Automobile</Code> to <Code>john</Code>'s inventory, nor from adding a <Code>FurnitureItem</Code> to <Code>samantha</Code>'s inventory. For example, nothing is stopping us from doing this in <Code>main()</Code>:</P>

      <PythonBlock showLineNumbers={false}>{
`samantha.add_to_stock(FurnitureItem('Dining Table', 300.00))`
      }</PythonBlock>

      <P>That's a problem because, as I said in the very beginning of this lecture, we would like our platform to only support vendors who are registered to sell products from a single, select category. But the way the code is written, there's nothing stopping Samantha or John from selling both furniture <It>and</It> automobiles. That's to say, the above line of code is legal, but it <It>shouldn't</It> be because it represents a bug in the program: Samantha should not be <It>allowed</It> to sell furniture if she also sells automobiles.</P>

      <P>Back when we had two separate classes for vendors (<Code>FurnitureVendor</Code> and <Code>AutomobileVendor</Code>), there was no problem. Back then, had we tried to add a furniture item to Samantha's stock (or an automobile to John's stock), Mypy would have reported a type error. So we've reduced our total amount of code, but in doing so, we've sacrificed specificity in our representation, opening up our codebase to new kinds of potential mistakes.</P>

      <SectionHeading id="generics">Generics</SectionHeading>

      <P>Luckily, there's a "best of both worlds" solution: <Bold>generics</Bold>. Generics are a metaprogramming technique, meaning they allow us to write programs that operate on programs (in the particular case of generics, they allow us to write programs that analyze and operate on their own code). Specifically, generics allow us to create classes that have "placeholders" in them (<Bold>generic classes</Bold>). Those "placeholders" can even be names of types. Later on, we can instantiate those generic classes by filling in the blanks.</P>

      <P>Remember how I said that the only meaningful difference between the <Code>FurnitureVendor</Code> class and the <Code>AutomobileVendor</Code> class was in the type of their inventory? Imagine if we could create a single class that has an inventory of <It>some</It> type T, without having to specify the exact type of T up front. In other words, imagine if T could be a sort of placeholder for the name of a type that will be specified later on. Then we could create a single generic class <Code>Vendor</Code> that has an inventory of type <Code>list[T]</Code>. It would have a generic method called <Code>add_to_stock()</Code> that accepts an argument of type <Code>T</Code>, adding it to the inventory. Finally, when we want to create <Code>john</Code> within <Code>main()</Code>, we just specify that, in the case of <Code>john</Code>, <Code>T</Code> should be replaced with <Code>FurnitureItem</Code> (because John sells furniture). Similarly, when we want to create <Code>samantha</Code>, we just specify that, in the case of <Code>samantha</Code>, <Code>T</Code> should be replaced with <Code>Automobile</Code> (because Samantha sells automobiles).</P>

      <P>To do this, we first have to create <Code>T</Code>, which will serve as a placeholder for the kind of product that a given vendor will sell. We can do this like so:</P>

      <PythonBlock copyable={false} showLineNumbers={false} fileName="vendor.py" highlightLines="{3,4}">{
`from item import Item

class Vendor[T]:
    ... # Class body is the same as before; omitted for brevity
`
      }</PythonBlock>

      <P>In our case, we want <Code>T</Code> to be used as a placeholder for the type of product sold by a given vendor. To do this, we make the following changes to <Code>vendor.py</Code>:</P>

      <PythonBlock fileName="vendor.py" highlightLines="{3,6,9,16}">{
`from item import Item

class Vendor[T]:
    _name: str # The vendor's name
    _profit: float # Total profit made
    _inventory: list[T] # Inventory

    def __init__(self, name: str) -> None:
        self._name = name
        self._profit = 0.0
        self._inventory = []

    def add_to_stock(self, item: T) -> None:
        self._inventory.append(item)

    def sell(self, idx: int) -> None:
        # Increase the vendor's total profit based on the price of
        # the sold item
        self._profit += self._inventory[idx].get_price()

        # Remove the sold item
        del self._inventory[idx]

    # Prints the vendor's information to the terminal
    def print(self) -> None:
        print(f'Name: {self._name}')
        # Note: '{x:.2f}' Prints x to 2 decimal places
        print(f'Total profit: \${self._profit:.2f}')
        print(f'Inventory:')
        for item in self._inventory:
            item.print()
`
      }</PythonBlock>

      <P>First, we modify the <Code>Vendor</Code> class to define a generic type named <Code>T</Code>in its class definition. This is new syntax; it means that the <Code>Vendor</Code> class is now a <Ul>generic class</Ul>, and that uses <Code>T</Code> as a placeholder for the type of one or more objects throughout its definition (again, a generic class is just a class that's allowed to have type placeholders). Finally, we modify the <Code>Vendor</Code> class to do just that: throughout its definition, whenever we want to refer to the type of product that a vendor might sell, we use <Code>T</Code> to represent that type. Again: <Code>T</Code> is a <Ul>placeholder</Ul> at this stage. It does not represent a specific type of product that might be sold, but rather a <Ul>placeholder</Ul> for a type of product that might be sold.</P>

      <P>Since <Code>T</Code> is a placeholder, we must, at some point, specify what exactly should be filled into that placeholder. We do <Ul>not</Ul> do this in the generic <Code>Vendor</Code> class. The entire point is that the <Code>Vendor</Code> class is "generic" rather than "specific"; it represents a "generic kind of vendor"<Emdash/>not a "specific kind of vendor", such as a furniture vendor or an automobile vendor.</P>

      <P>So, where do we fill in that placeholder? Well, we do it when we need to: when creating vendors. For example, when I create <Code>john</Code>, I would like to somehow specify that John is a furniture vendor, and when I create <Code>samantha</Code>, I would like to somehow specify that Samantha is an automobile vendor. That's to say, in case of <Code>john</Code>, I'd like <Code>T</Code> to be filled in with the type <Code>FurnitureItem</Code>, but in the case of <Code>samantha</Code>, I'd like <Code>T</Code> to be filled in with the type <Code>Automobile</Code>. I do this in the <Code>main()</Code> function like so:</P>

      <PythonBlock fileName="main.py" highlightLines="{10,29}">{
`from vendor import Vendor
from furnitureitem import FurnitureItem
from automobile import Automobile

def main() -> None:
    #################################
    #### Furniture demonstration ####
    #################################
    
    john = Vendor[FurnitureItem]('John')
    john.add_to_stock(FurnitureItem('Couch', 100.00))
    
    print("John's information prior to selling his couch:")
    john.print()
    print()

    john.sell(0)

    print("John's information after selling his couch:")
    john.print()

    print()
    print()

    ##################################
    #### Automobile demonstration ####
    ##################################

    samantha = Vendor[Automobile]('Samantha')
    samantha.add_to_stock(Automobile('Ford', 2001, 'Taurus', 2000.00))

    print("Samantha's information prior to selling her Ford Taurus:")
    samantha.print()
    print()
    
    samantha.sell(0)

    print("Samantha's information after selling her Ford Taurus:")
    samantha.print()

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Indeed, when calling the generic <Code>Vendor</Code> class's constructor<Emdash/>when creating a specific <Code>Vendor</Code> object<Emdash/>that's the moment that I specify what kind of products that <It>specific</It> vendor will sell. In other words, that's the moment that I specify what type <Code>T</Code> should be replaced with. I do this by writing the type that <Code>T</Code> should be replaced with in square brackets immediately between the class's name (<Code>Vendor</Code>) and the parentheses in the constructor call. For example, <Code>Vendor[FurnitureItem]('John')</Code> constructs a vendor named John who sells furniture; <Code>Vendor[Automobile]('Samantha')</Code> constructs a vendor named Samantha who sells automobiles; <Code>Vendor[Television]('Jill')</Code> would constructr a vendor named Jill who sells televisions (assuming <Code>Television</Code> is an existing class that has been imported); and so on.</P>

      <P>Technically, the above program runs just fine, but Mypy will report an error at this stage:</P>

      <TerminalBlock copyable={false}>{
`(env) $ mypy .
vendor.py:22: error: "T" has no attribute "get_price"  [attr-defined]
vendor.py:34: error: "T" has no attribute "print"  [attr-defined]
Found 2 errors in 1 file (checked 5 source files)
`
      }</TerminalBlock>

      <P>If we take a closer look at the specified lines of code in <Code>vendor.py</Code>, we might be able to figure out what it's talking about:</P>

      <PythonBlock copyable={false} fileName="vendor.py" showLineNumbers={false} highlightLines="{9,22}">{
`...

class Vendor[T]:
    ...

    def sell(self, idx: int) -> None:
        # Increase the vendor's total profit based on the price of
        # the sold item
        self._profit += self._inventory[idx].get_price()

        # Remove the sold item
        del self._inventory[idx]

    ...

    def print(self) -> None:
        print(f'Name: {self._name}')
        # Note: '{x:.2f}' Prints x to 2 decimal places
        print(f'Total profit: \${self._profit:.2f}')
        print(f'Inventory:')
        for item in self._inventory:
            item.print()`
      }</PythonBlock>

      <P>Consider: when Mypy is analyzing <Code>vendor.py</Code>, it knows that <Code>_inventory</Code> is a list of <It>something</It>, but it doesn't exactly <It>what</It> it's a list of. That's the point: it's of type <Code>list[T]</Code>, and <Code>T</Code> is itself a placeholder. But that's a bit problematic because Mypy is supposed to verify that our code doesn't contain type errors (or other syntax errors), and it can't do that if it knows nothing about the types that will be used to fill in the placeholder <Code>T</Code>.</P>

      <P>For example, at runtime, if we create <Code>john</Code> and specify that <Code>T</Code> should be replaced with <Code>FurnitureItem</Code>, then the above code will work just fine. The <Code>FurnitureItem</Code> class defines a <Code>print()</Code> method, and it inherits the <Code>get_price()</Code> method from the <Code>Item</Code> class. But suppose that, at runtime, we create a vendor such as <Code>jim = Vendor[int]('Jim')</Code>. That is, we create a vendor named Jim who (somehow) sells integers. The problem is that integers do not have a <Code>get_price()</Code> method nor a <Code>print()</Code> method (they don't have methods at all). So, when we call <Code>jim.sell()</Code> or <Code>jim.print()</Code>, the above highlighted lines of code will fail.</P>

      <P>It's Mypy's job to detect these sorts of errors, and that's exactly what it's doing. Since Mypy knows nothing about the types that will be used to fill in the placeholder <Code>T</Code>, it has no reason to believe that those types will necessarily provide a <Code>get_price()</Code> nor <Code>print()</Code> method.</P>

      <P>The solution to this problem, then, is to <It>tell</It> Mypy a little bit about the types that will be used to fill in the placeholder <Code>T</Code>. Of course, we can't tell Mypy <It>exactly</It> what types might be used in place of <Code>T</Code><Emdash/>it's supposed to be a generic placeholder. However, that doesn't stop us from saying, for example, that <Code>T</Code> will only ever be filled in by types that inherit from the <Code>Item</Code> class. We can do this by making the following change in <Code>vendor.py</Code>:</P>

      <PythonBlock showLineNumbers={false} highlightLines="{4}">{
`from item import Item

class Vendor[T: Item]:
    ... # Class body is the same as before; omitted for brevity
`
      }</PythonBlock>

      <P>We can restrict placeholder types by defining them the same way we define types elsewhere, with a colon and the type definitions. If provided, then <Code>T</Code> may only be "filled in" by classes that inherit from that specified base class. So the above change tells Mypy that our program will only ever fill in the placeholder <Code>T</Code> with classes that inherit from the <Code>Item</Code> class. The <Code>Item</Code> class does, indeed, provide a <Code>get_price()</Code> method as well as an (abstract) <Code>print()</Code> method. So now, Mypy can be confident that <Code>self._inventory[idx].get_price()</Code> and <Code>item.print()</Code> will work just fine, regardless of what type is substituted for <Code>T</Code>. Mypy now produces no errors, and the program works just fine.</P>

      <P>Suppose we try to fill in the placeholder <Code>T</Code> with a class that does <It>not</It> inherit from the <Code>Item</Code> class:</P>

      <PythonBlock fileName="badtypeargument.py">{
`from vendor import Vendor

def main() -> None:
    # Jim sells integers??? But 'int' is not a class that inherits from
    # the Item class, so Mypy will report an error.
    jim = Vendor[int]('Jim')

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Then Mypy will detect this mistake and report an error:</P>

      <TerminalBlock copyable={false}>{
`(env) $ mypy .
badtypeargument.py:72: error: "T" has no attribute "get_price"  [attr-defined]
badtypeargument.py:84: error: "T" has no attribute "print"  [attr-defined]
Found 2 errors in 1 file (checked 1 source file)
`
      }</TerminalBlock>

      <P>If you actually wanted to support both <Code>int</Code> and <Code>Item</Code> types, you would use the standard union syntax and define your type with the following, which would again give mypy errors since <Code>int</Code> does not implement <Code>get_price()</Code> or <Code>print()</Code>:</P>

      <PythonBlock>{
`class Vendor[T: Item | int]:
    ... # Class body is the same as before; omitted for brevity
`
      }</PythonBlock>

      <P>It's sometimes a bit difficult to understand the difference between using generics versus polymorphism. To highlight the difference, recall that, earlier, our polymorphic solution had a problem: there was no way to prevent a single vendor from selling both furniture and automobiles. For example, <Code>samantha.add_to_stock(FurnitureItem('Couch', 200.00))</Code> was a perfectly legal line of code (in that it would not result in any errors reported by Mypy nor the interpreter) even though it <It>shouldn't</It> have been legal given that it reflects a bug in the program. Now, with generics, that problem is solved. Suppose we attempt to add furniture to Samantha's inventory:</P>

      <PythonBlock fileName="badusage.py" highlightLines="{10}">{
`from vendor import Vendor
from furnitureitem import FurnitureItem
from automobile import Automobile

def main() -> None:
    # Samantha is an automobile vendor
    samantha = Vendor[Automobile]('Samantha')

    # Suppose we accidentally add a couch to her stock
    samantha.add_to_stock(FurnitureItem('Couch', 200.00))

    # And then we try to sell the couch
    print("Samantha's information prior to selling her couch:")
    samantha.print()
    print()
    
    samantha.sell(0)

    print("Samantha's information after selling her Ford Taurus:")
    samantha.print()

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Although the above program technically runs, Mypy detects our mistake and prints an error:</P>

      <TerminalBlock copyable={false}>{
`(env) $ mypy .
badusage.py:10: error: Argument 1 to "add_to_stock" of "Vendor" has incompatible type "FurnitureItem"; expected "Automobile"  [arg-type]
Found 1 error in 1 file (checked 5 source files)
`
      }</TerminalBlock>

      <P>Classes are no the only place we can define generics. You can define generic types for a function with similar syntax by defining the placeholder as part of the function definition:</P>

      <PythonBlock>{
`def print_values[T](input: T) -> None:
    print(input)
`
      }</PythonBlock>

      <SectionHeading id="data-structures-as-generics">Data structures as generics</SectionHeading>

      <P>You've actually worked with a generic class before: <Code>list</Code>. Indeed, basically all data structure types (i.e., collection types), such as <Code>list</Code>, <Code>dict</Code>, <Code>set</Code>, and so on, are all generic classes.</P>

      <P>Think about it: when you specify the type of a list parameter in a function, you must write out the element type within square brackets after the word <Code>list</Code>. For example, if a parameter <Code>numbers</Code> is meant to accept a list of integers, it might be annotated as <Code>numbers: list[int]</Code>. If those square brackets look similar to the ones you see in <Code>Vendor[Automobile]</Code>, that's because they are<Emdash/><Code>list</Code> is a generic class with a placeholder type, and the <Code>int</Code> in <Code>list[int]</Code> is saying "I'd like to fill in the placeholder with the type <Code>int</Code>".</P>

      <P>(Similarly, if you wanted a function to strictly accept furniture vendors as an argument, the parameter might be annotated <Code>some_vendor: Vendor[FurnitureItem]</Code>.)</P>

      <P>In fact, data structures / collection types are the classic and most obvious use case of generics. This means that it's very important to understand generics if you ever want to implement your own data structure / collection types (e.g., as you might learn how to do in a data structures course).</P>

      <SectionHeading id="other-details">Other details</SectionHeading>

      <P>This lecture barely scratched the surface of generics. They support many more advanced features that we don't have time to cover, such as generic classes with more than one type parameter; covariant generic classes (e.g., <Code>Sequence</Code>); contravariant generic classes (e.g., <Code>Callable</Code>); and more. I encourage you to research things if you're curious, and feel free to stop by my office hours if you'd like to chat about them.</P>
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
