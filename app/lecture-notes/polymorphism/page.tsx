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
        <Item><Link href="#setting-the-stage">Setting the stage</Link></Item>
        <Item><Link href="#upcasting">Upcasting</Link></Item>
        <Item><Link href="#polymorphism">Polymorphism</Link></Item>
        <Item><Link href="#dynamic-and-static-types">Dynamic and static types</Link></Item>
        <Item><Link href="#abstract">Abstract methods and abstract base classes</Link></Item>
        <Item><Link href="#override-decorator">The <Code>@override</Code> decorator</Link></Item>
        <Item><Link href="#polymorphism-in-other-languages">(Optional content) Polymorphism in other languages</Link></Item>
      </Itemize>

      <SectionHeading id="setting-the-stage">Setting the stage</SectionHeading>

      <P>Suppose you're developing a turn-based video game consisting of a player that fights various kinds of monsters (turn-based means that the player and the monsters take turns performing actions, such as attacking each other). Perhaps you have a <Code>Player</Code> class that looks like this:</P>

      <PythonBlock fileName="player.py">{
`class Player:
    _hp: int

    def __init__(self) -> None:
        # The player starts out with 100 HP. When it drops to zero,
        # they lose the game.
        self._hp = 100
    
    # Getter for _hp
    def get_hp(self) -> int:
        return self._hp

    # Causes the player to take some damage. Used by the monster
    # class and its subclasses when they attack the player.
    def take_damage(self, amount: int) -> None:
        # Forbid the amount of damage from being negative
        if amount < 0:
            raise ValueError(f'Error: Expected amount to be '
                f'non-negative, but got {amount}')

        # Damage the player
        self._hp -= amount
        
        # Preserve the class invariant that _hp must be non-negative
        if self._hp < 0:
            self._hp = 0
`
      }</PythonBlock>

      <P>To represent the various kinds of monsters, perhaps you have a <Code>Monster</Code> base class from which various subclasses (e.g., <Code>Zombie</Code>, <Code>Vampire</Code>, etc) will inherit:</P>

      <PythonBlock fileName="monster.py">{
`from player import Player

class Monster:
    _hp: int

    def __init__(self, hp: int) -> None:
        # Different monsters will start out with different amounts
        # of hp, so we pass the monster's starting HP as an argument
        # to this constructor's hp parameter. It then stores it in
        # the self._hp attribute.
        self._hp = hp

    # Attacks the player
    def attack(self, p: Player) -> None:
        # Reduce the player's HP by 1
        p.take_damage(1)
`
      }</PythonBlock>

      <P>There could be dozens of classes derived from the <Code>Monster</Code> base class. To illustrate, I'll provide three examples. First, the <Code>Zombie</Code> class:</P>

      <PythonBlock fileName="zombie.py">{
`from monster import Monster
from player import Player

# The Zombie class inherits from the Monster class
class Zombie(Monster):
    # Extension: The Zombie class additionally has a _sanity attribute
    _sanity: float

    def __init__(self) -> None:
        # Zombies get 20 HP. Pass this to the Monster constructor
        # to be stored in the private _hp attribute
        super().__init__(20)

        self._sanity = 1.0 # All zombies start out with 1.0 sanity

    # Override the attack() method. This is what zombies will do when
    # they attack the player, instead of executing the "default" /
    # boring Monster class's attack() method.
    def attack(self, p: Player) -> None:
        if self._sanity > 0.0:
            # If this zombie still has some sanity, then they won't
            # damage the player this turn, but they will lose 0.5
            # sanity.
            self._sanity -= 0.5

            # If sanity became negative, clip it to zero
            if self._sanity < 0.0:
                self._sanity = 0.0
        else:
            # Otherwise, this zombie has gone insane, so they attack
            # the player, damaging them by 2
            p.take_damage(2)
`
      }</PythonBlock>

      <P>Second, the <Code>Vampire</Code> class:</P>

      <PythonBlock fileName="vampire.py">{
`from monster import Monster
from player import Player

# The Vampire class inherits from the Monster class
class Vampire(Monster):
    # Extension: The Vampire class additionally has a _strength
    # attribute
    _strength: int

    def __init__(self) -> None:
        # Vampires get 15 HP. Pass this to the Monster constructor
        # to be stored in the private _hp attribute
        super().__init__(15)

        self._strength = 1 # All vampires start out with 1 strength

    # Private helper method that increases a vampire's strength by a
    # specified amount without letting it exceed 3
    def _increase_strength(self, amount: int) -> None:
        # Forbid amount from being negative
        if amount < 0:
            raise ValueError(f'Expected amount to be non-negative, '
                f'but got {amount}')
        
        # Increase strength, clipping it down to a max of 3
        self._strength += amount
        if self._strength > 3:
            self._strength = 3

    # Override the attack() method. This is what vampires will do when
    # they attack the player, instead of executing the "default" /
    # boring Monster class's attack() method.
    def attack(self, p: Player) -> None:
        # Attack the player, dealing damage equal to the vampire's
        # strength
        p.take_damage(self._strength)

        # When vampires attack the player, they suck the player's
        # blood, gaining 1 strength in the process. We'll use
        # self._increase_strength() for this (which prevents it
        # from exceeding the max of 3)
        self._increase_strength(1)
`
      }</PythonBlock>

      <P>Third, the <Code>Goblin</Code> class:</P>

      <PythonBlock fileName="goblin.py">{
`from monster import Monster

# The Goblin class inherits from the Monster class
class Goblin(Monster):
    def __init__(self) -> None:
        # Goblins get 5 HP. Pass this to the Monster constructor
        # to be stored in the private _hp attribute
        super().__init__(5)

    # The Goblin class does not override the attack() method, so when
    # goblins attack the player, they simply execute the Monster
    # class's attack() method (which the Goblin class inherits)
`
      }</PythonBlock>

      <P>Let's take a moment to remind ourselves about method overrides. Notice that the <Code>Zombie</Code> and <Code>Vampire</Code> classes override the <Code>attack()</Code> method, but the <Code>Goblin</Code> class does not. This means that <Code>Zombie</Code> and <Code>Vampire</Code> objects each have two <Code>attack()</Code> methods: the one inherited from the <Code>Monster</Code> class, and the override defined in the respective derived class (<Code>Zombie</Code> or <Code>Vampire</Code>). In contrast, <Code>Goblin</Code> objects only have a single <Code>attack()</Code> method: the one inherited from the <Code>Monster</Code> class.</P>

      <P>Hence, if you were to create a <Code>Zombie</Code> or <Code>Vampire</Code> object and tell it to attack the player (e.g., <Code>some_zombie.attack(the_player)</Code>, or <Code>some_vampire.attack(the_player)</Code>), it would execute the respective derived class's <Code>attack()</Code> method. In contrast, if you were to create a <Code>Goblin</Code> object and tell it to attack the player (e.g., <Code>some_goblin.attack(the_player)</Code>), it would execute the <Code>Monster</Code> class's <Code>attack()</Code> method.</P>

      <P>This is a common pattern. In essence, the <Code>Monster</Code> class's <Code>attack()</Code> method serves as a sort of "default" behavior for a monster attacking the player. If a derived class chooses not to override the <Code>attack()</Code> method, then objects of that class will execute the <Code>Monster</Code> class's <Code>attack()</Code> method when they're told to attack the player. But if a derived class <It>does</It> choose to override the <Code>attack()</Code> method, then objects of that class will instead execute the derived class's override when they're told to attack the player. Again, this is why it's referred to as "overriding"<Emdash/>the derived-class method overrides (takes precedence over) the base-class method (unless the <Code>super()</Code> function is used). If the derived class does not provide its own <Code>attack()</Code> method (e.g., as in the <Code>Goblin</Code> class), then no overriding takes place, and the "default" (base-class) method is used instead.</P>

      <P>Again, this is just an illustration. In practice, there might be <It>dozens</It> of subclasses. Many of them might override the <Code>attack()</Code> method with their own, interesting behaviors (similar to the <Code>Zombie</Code> and <Code>Vampire</Code> classes). But also, many of them might choose not to (similar to the <Code>Goblin</Code> class).</P>

      <P>Finally, here's the actual program that uses these classes:</P>

      <PythonBlock fileName="game.py">{
`from player import Player
from zombie import Zombie
from vampire import Vampire
from goblin import Goblin

# This function is the main "game loop". In other words, it contains
# the loop that runs the monsters' turns over and over again until the
# game ends (i.e., until the player loses)
def game_loop(
        p: Player,
        zombies: list[Zombie],
        vampires: list[Vampire],
        goblins: list[Goblin]) -> None:
    # Until the player loses, keep running turns of the game
    turn_counter = 1 # Keeps track of what turn it is
    while p.get_hp() > 0:
        # The zombies attack the player
        for z in zombies:
            z.attack(p)
        
        # The vampires attack the player
        for v in vampires:
            v.attack(p)

        # The goblins attack the player
        for g in goblins:
            g.attack(p)

        # Print the player's remaining HP
        print(f"After turn {turn_counter}, the player's remaining "
            f"HP is {p.get_hp()}")
        
        # Update the turn counter
        turn_counter += 1


def main() -> None:
    # Create the player object
    p = Player()

    # Suppose we want the game to have 3 zombies, 4 vampires, and 5
    # goblins. Let's create a list for each (we should use list
    # comprehensions in practice, but they're beyond the scope of
    # this course):
    zombies = []
    for _ in range(3):
        zombies.append(Zombie())

    vampires = []
    for _ in range(4):
        vampires.append(Vampire())

    goblins = []
    for _ in range(5):
        goblins.append(Goblin())

    # Now run the game loop, executing turns until the game is over
    game_loop(p, zombies, vampires, goblins)
    

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>(This is a very bare-bones game. In fact, it's arguably not even a game. The player doesn't actually get to <It>do</It> anything, other than sit there as the monsters attack them. We could implement some player interaction, but that'd lengthen the demonstration, and it's not the point of this lecture.)</P>

      <P>Let's trace the game loop.</P>

      <P>On the first turn, the zombies will not attack the player since they'll still have 1 sanity. But they'll each lose 0.5 sanity, leaving them with 0.5 remaining. The vampires will attack the player for 1 damage each since they initially only have 1 strength. This will increase their strength to 2. The goblins will attack the player for 1 damage each. In total, the player will lose 9 HP this turn (4 from the vampires, 5 from the goblins). This will leave them with 91 HP.</P>

      <P>On the second turn, the zombies still won't attack the player since they'll still each have 0.5 sanity. But they'll each lose that 0.5 sanity, leaving them with 0 sanity. The vampires will attack the player for 2 damage each since they'll each have 2 strength at this point. This will increase their strength to 3. The goblins will attack the player for 1 damage each. In total, the player will lose 13 HP this turn (8 from the vampires, 5 from the goblins). This will leave them with 78 HP.</P>

      <P>On each subsequent turn, the zombies will attack the player for 2 damage each since they will have no sanity remaining; the vampires will attack the player for 3 damage each (their strength cannot exceed 3); and the goblins will attack the player for 1 damage each. So, on each turn starting from turn 3, the player will lose 23 HP (6 from the zombies, 12 from the vampires, 5 from the goblins). After turn 3, the player will have 55 HP. After turn 4, the player will have 32 HP. After turn 5, the player will have 9 HP. After turn 6, the player will have 0 HP (their HP cannot drop below zero), ending the game.</P>

      <P>Indeed, running the above program produces the following output:</P>

      <TerminalBlock copyable={false}>{
`After turn 1, the player's remaining HP is 91
After turn 2, the player's remaining HP is 78
After turn 3, the player's remaining HP is 55
After turn 4, the player's remaining HP is 32
After turn 5, the player's remaining HP is 9
After turn 6, the player's remaining HP is 0
`
      }</TerminalBlock>

      <SectionHeading id="upcasting">Upcasting</SectionHeading>

      <P>The above code works as intended. However, there's a potential maintainability concern. Recall that the three subclasses in the above demonstration (<Code>Zombie</Code>, <Code>Vampire</Code>, and <Code>Goblin</Code>) are just an illustration. In a real video game, there might be <It>dozens</It> of such subclasses. That's problematic. As written, our code currently has a separate list for each of the subclasses. Each of those lists is passed into the <Code>game_loop()</Code> function. The <Code>game_loop()</Code> function then iterates through each of these lists one at a time. That's to say, each subclass has a corresponding list, function argument, function parameter, <It>and</It> for loop.</P>

      <P>There are only 3 subclasses in the above code, but if there were actually <It>dozens</It> of subclasses (as there would likely be in a real video game), then there would have to be substantially more code. In fact, as currently designed, almost the <It>entire</It> codebase grows proportionally with the number of subclasses. If we wanted to double the number of subclasses (from 3 to 6), we'd have to write nearly twice as much code. If we wanted to multiply it by 10 (from 3 to 30), we'd have to write nearly ten times as much code.</P>

      <P>Some people, myself included, might consider that to be a big deal. First of all, introducing new kinds of monsters into the game should probably be a fairly routine change. After all, if we want the game to be interesting, we probably want to create many kinds of monsters, adding new ones regularly as the game is updated. If it's meant to be a routine change, then it probably shouldn't be a difficult thing to do, or else most of our entire job becomes difficult. Currently, introducing a new kind of monster requires creating a new subclass, creating a list to store objects of that subclass, creating a new parameter in the <Code>game_loop()</Code> function to accept that list, passing the list as an argument, and creating another for loop in the <Code>game_loop()</Code> function to execute those new monsters' turns. That's too much work for a routine change.</P>

      <P>Second, The more code we write, the more code we have to maintain. If we ever decide to change, say, how the various kinds of monster objects are stored (e.g., replacing the lists with some other kind of data structure, such as trees, linked lists, dictionaries, etc), then we'd have to apply that change for <It>each</It> subclass (because we have a list for <It>each</It> subclass). If we had 30 subclasses, we'd have to apply that change 30 times. If this all reminds you of <Link href={`${PARENT_PATH}/${allPathData["encapsulation"].pathName}`}>our lecture on coupling</Link>, good<Emdash/>this is essentially a coupling problem that results from a whole bunch of code duplication.</P>

      <P>(I actually wrote most of <Code>game.py</Code> by creating a few lines of code to deal with zombies, copying and pasting those lines of code two more times, and then using Vim's find-and-replace feature to replace "zombie" with "vampire" or "goblin". Copy + paste + find-and-replace is <It>classic</It> code duplication.)</P>

      <P>So, what's the solution? Well, it's actually very simple. So simple, in fact, that after I show it to you, most of the rest of this lecture will just be about theory and principles<Emdash/>the code itself will only take a moment to explain.</P>
      
      <P>The solution is to combine two techniques: <Bold>upcasting</Bold> and <Bold>polymorphism</Bold>.</P>

      <P>Let's start with upcasting. Upcasting is a form of type casting, but it works a bit differently in the way that we'll use it. Recall that type casting means to convert the value of one expression into a new type, producing a new expression in the process. For example, <Code>int(input('Enter your favorite number: '))</Code> asks the user for their favorite number and then takes their string input (the actual characters that they typed on the keyboard, as returned by the <Code>input()</Code> function) and converts it, or type-casts it, into an integer. That is, the expression <Code>input('Enter your favorite number: ')</Code> is a string expression, and its value is whatever string is typed in by the user. By wrapping that expression in the explicit <Code>int()</Code> syntax, we convert it into an integer. So the inner expression is a string, but the whole, outer expression is an integer.</P>

      <P>That's an example of <Bold>explicit</Bold> type casting, but it can often done <Bold>implicitly</Bold> as well. For example, <Code>x: float = 1</Code> creates a variable named <Code>x</Code> of annotated type <Code>float</Code>, but it stores an object of type <Code>int</Code> inside it.</P>

      <P>Implicit type casting works a bit differently from explicit type casting. Explicit type casting actually creates a new object of a new type by type-converting the original object. Implicit type casting doesn't do that; rather, implicit type casting simply stores an object of one type in a variable of another type. Again, <Code>x: float = 1</Code> is an example of implicit type casting; it stores an object of type <Code>int</Code> in a variable of type <Code>float</Code>.</P>

      <P>This might be surprising to you. In the past, I've said that every variable has a single type, and its type can't be changed. Well, it turns out that there are some exceptions to this rule, and implicit type casting is one of them. To be clear, though, implicit type casting isn't always possible. It's <Ul>only</Ul> possible when the two types are "compatible with" one another, in some sense. <Code>int</Code> and <Code>float</Code> are compatible such that an <Code>int</Code> value can be implicitly type-casted into a <Code>float</Code> (but not the other way around).</P>

      <P>Now, what's upcasting? Upcasting is specifically a form of type casting wherein an object of a derived-class type is casted (converted) into its base-class type. As it turns out, this is always possible. And maybe that makes sense; if every zombie "is a" monster, then perhaps it's reasonable that a <Code>Zombie</Code> object can be casted into a <Code>Monster</Code> object.</P>

      <P>However, not only is upcasting always possible, it can always be done implicitly. That's to say, every derived class is always "compatible with" its base class insofar as derived-class objects can be implicitly upcasted into their base-class types.</P>

      <P>For example, suppose you have a variable whose type is annotated as <Code>Monster</Code>. In such a case, it's possible to store a <Code>Zombie</Code> object inside that variable (e.g., <Code>m: Monster = z</Code>, where <Code>z</Code> is a <Code>Zombie</Code> object). In case you don't realize how big of a deal this is, let me show you:</P>

      <PythonBlock fileName="game.py" highlightLines="{2,7-13,16,20-23,37-70}">{
`from player import Player
from monster import Monster # Needed for static typing list[Monster]
from zombie import Zombie
from vampire import Vampire
from goblin import Goblin

# This function is the main "game loop". In other words, it contains
# the loop that runs the monsters' turns over and over again until the
# game ends (i.e., until the player loses). Notice: It only needs
# a single list parameter now, which is a list of Monster objects.
# Each Monster object in the list will have been upcasted from a
# more specific derived-class object (a Zombie, Vampire, or Goblin).
# See main() below for details.
def game_loop(
        p: Player,
        monsters: list[Monster]) -> None:
    # Until the player loses, keep running turns of the game
    turn_counter = 1 # Keeps track of what turn it is
    while p.get_hp() > 0:
        # ALL of the monsters attack the player. Notice: Just a single
        # for loop now.
        for m in monsters:
            m.attack(p)

        # Print the player's remaining HP
        print(f"After turn {turn_counter}, the player's remaining "
            f"HP is {p.get_hp()}")
        
        # Update the turn counter
        turn_counter += 1


def main() -> None:
    # Create the player object
    p = Player()

    # Suppose we want the game to have 3 zombies, 4 vampires, and 5
    # goblins. However, we do NOT need to create a separate list for
    # each. Rather, let's create a single list of monsters, meaning a
    # variable whose (static) type is list[Monster]. Because zombies,
    # vampires, and goblins can all be type-casted into monsters
    # (i.e., upcasting), we can store ALL of these things---zombies,
    # vampires, and goblins---in a single list of type list[Monster].

    # In instances like this, Mypy needs some help determining the
    # type of the list. We want it to be of type list[Monster], so
    # we have to tell Mypy that explicitly (see the Python Basics
    # lecture notes for more information about explicit type
    # annotations of local variables).
    monsters: list[Monster] = []

    # Now add all the zombies, vampires, and goblins to it
    for _ in range(3):
        # Create a Zombie object, implicitly upcast it into a Monster
        # object, and then store it in our list of Monster objects
        monsters.append(Zombie())

    for _ in range(4):
        # Create a Vampire object, implicitly upcast it into a Monster
        # object, and then store it in our list of Monster objects
        monsters.append(Vampire())

    for _ in range(5):
        # Create a Goblin object, implicitly upcast it into a Monster
        # object, and then store it in our list of Monster objects
        monsters.append(Goblin())

    # Now run the game loop, executing turns until the game is over.
    # This time, we only need to pass in a single list: monsters
    game_loop(p, monsters)
    

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>(There are more lines of code than before, but that's just because I added many comments to explain the upcasting and type annotations. The number of <It>logical</It> lines of code is noticeably fewer than before, and the effect would be extremely obvious if there were, say, 30 subclasses instead of just 3.)</P>

      <P>Indeed, implicit upcasting allows us to create a single list of type <Code>list[Monster]</Code>; implicitly upcast <Code>Zombie</Code>, <Code>Vampire</Code>, and <Code>Goblin</Code> objects all into the <Code>Monster</Code> type; and store those upcasted objects in the list. This allows us to store all of our monsters in a single last rather than needing a separate list for each subclass.</P>

      <P>Again, this sort of type casting is a bit different from what you've seen before. When you cast a <Code>float</Code> to an <Code>int</Code> via <Code>int(3.14)</Code>, its value actually changes from <Code>3.14</Code> to <Code>3</Code>. But in this case, the type casting is essentially only performed on the <It>annotated</It> types of the objects. This means that, from MyPy's perspective, the elements in the list are all of type <Code>Monster</Code>, but from the interpreter's perspective, the elements in the list are of the various subtypes<Emdash/><Code>Zombie</Code>, <Code>Vampire</Code>, and <Code>Goblin</Code>. That's to say, the zombies in the list are still zombies, the vampires are still vampires, and the goblins are still goblins; they aren't <It>actually</It> converted to the <Code>Monster</Code> type (in contrast to <Code>3.14</Code> being converted to <Code>3</Code> in the case of explicit type casting). But MyPy treats them <It>as if they were</It> of the <Code>Monster</Code> type (and, because of the inheritance hierarchy and is-a relationships, they sort of <It>are</It> monsters, even though their actual types are more specific than that).</P>

      <P>In essence, we've created a heterogeneous list (a list containing elements of various types), but in a way that makes MyPy happy. The details will become clear <Link href="#dynamic-and-static-types">once we've discussed dynamic and static types</Link>.</P>

      <P>This greatly reduces the amount of duplicated code (and therefore unnecessary coupling). Yes, we still need a for loop in the <Code>main()</Code> function for each subclass in order to actually <It>create</It> the objects, but after that point<Emdash/>once we've created them, upcasted them, and put them in the list<Emdash/>we no longer need to duplicate any of our code on a per-subclass basis. For example, we only need a single for loop in the <Code>game_loop()</Code> function rather than one per subclass. Similarly, the <Code>game_loop()</Code> function only needs a single list parameter and corresponding argument rather than one per subclass.</P>

      <P>The benefit becomes more obvious with more subclasses. For example, the difference between three for loops and a single for loop may not seem like a big deal, but the difference between <It>thirty</It> for loops and a single for loop is a very big deal.</P>

      <P>The benefit also becomes more obvious with a more complex codebase in general. The above program only has a single function (<Code>game_loop()</Code>) that interacts with the monsters once they've been created. A more complex program, though, might have <It>several</It> functions that all interact with the monsters, each for a different reason (e.g., consider that a real game might display the monsters in the terminal, allow the player to interact with the monsters, and so on; each of these things might be done by separate function that iterates through all the monsters in the game). Having a single list of upcasted monsters, as opposed to a separate list for each subclass, could reduce the complexity of most if not all of those functions.</P>

      <SectionHeading id="polymorphism">Polymorphism</SectionHeading>

      <P>Now, I said that we needed to employ <It>two</It> techniques: upcasting and polymorphism. What's polymorphism?</P>

      <P>Well, we're actually already using polymorphism in the above program. In Python, polymorphism basically happens automatically whenever you use upcasted objects that could have been upcasted from any one of several derived classes. But in many other programming languages, it must be enabled manually through explicit syntax, so it's important that you understand it nonetheless.</P>

      <P><Bold>Polymorphism</Bold> means "many forms". The original definition of polymorphism described the case wherein a function's parameter can be any one of several different types. Nowadays, the most common definition is a bit looser: polymorphism simply describes the case wherein a given <It>expression</It> can be any one of several different types.</P>

      <P>Take a look at this line from the above <Code>game.py</Code>, for example:</P>

      <PythonBlock copyable={false} showLineNumbers={false}>{
`m.attack(p)`
      }</PythonBlock>

      <P>That line of code appears inside the for loop in the <Code>game_loop()</Code> function. <Code>m</Code> is the iterating variable<Emdash/>it iterates through the list, <Code>monsters</Code>.</P>

      <P>But that list<Emdash/><Code>monsters</Code><Emdash/>technically contains several different kinds of objects in it. Yes, they've all been upcasted to the type <Code>Monster</Code>, but that doesn't change the fact that they're <It>actually</It> objects of type <Code>Zombie</Code>, <Code>Vampire</Code>, and <Code>Goblin</Code>.</P>

      <P>This means that the variable <Code>m</Code> in the above line of code is <Bold>polymorphic</Bold>. Depending on the iteration of the for loop, <Code>m</Code> might be a <Code>Zombie</Code>, or it might be a <Code>Vampire</Code>, or it might be a <Code>Goblin</Code>. Indeed, <Code>m</Code> is an expression whose type could be one of several different things. In fact, <Code>m</Code>'s type could be <It>any</It> class that inherits from the <Code>Monster</Code> class, or it could even simply be the <Code>Monster</Code> class itself (our program doesn't actually create regular <Code>Monster</Code> objects, but there's no reason that it <It>couldn't</It>).</P>

      <P>Again, Python makes polymorphism very easy. Any time you upcast objects, you're probably doing polymorphism. But in some other programming languages (e.g., C++), upcasting by itself does not enable polymorphism. In those languages, other explicit syntax is required in addition to upcasting in order to get polymorphism to work properly (e.g., to deal with object slicing and static binding). <Link href="#polymorphism-in-other-languages">We'll discuss this in more detail shortly</Link>.</P>

      <P>(To be clear: Python is not the only language that makes polymorphism easy and automatic. However, making polymorphism easy usually requires sacrificing performance.)</P>

      <SectionHeading id="dynamic-and-static-types">Dynamic and static types</SectionHeading>

      <P>In the past, I've said that, generally, Mypy does not allow a variable's type to change throughout the duration of a program. Polymorphism inherently violates this general rule. As in my previous example, the variable <Code>m</Code> changes types from <Code>Zombie</Code> to <Code>Vampire</Code> to <Code>Goblin</Code> throughout the for loop of the <Code>game_loop()</Code> function.</P>

      <P>The reason is that the general rule<Emdash/>that a variable's type may not change<Emdash/>is not precise enough. To be more precise, every variable (actually, every expression) essentially has <It>two</It> types: a <Bold>static type</Bold>, and a <Bold>dynamic type</Bold>. Static types may not change, but dyanmic types may.</P>

      <P>A static type is a <It>declared</It> type, be it declared explicitly (via a type annotation) or implicitly (e.g., as inferred by Mypy). The static type of a variable or expression can easily be deduced by simply looking at the surrounding code. For example, in the <Code>game_loop()</Code> function, the static type of <Code>monsters</Code> is <Code>list[Monster]</Code>. You can see this clearly and plainly by looking at its declaration in the parameter list. This also means that the static type of <Code>m</Code> is <Code>Monster</Code>. Indeed, if <Code>monsters</Code> has a static type of <Code>list[Monster]</Code>, and <Code>m</Code> is one of the elements <It>of</It> that list, then its static type must be <Code>Monster</Code> (<Code>m</Code> is not <It>explicitly</It> declared to be of static type <Code>Monster</Code>, but you can still infer as much by looking at the code).</P>

      <P>The dynamic type of a variable or expression is its "actual type" at a given point during the program's execution. For example, consider the very first iteration of the for loop in the <Code>game_loop()</Code> function. During that iteration, the static type of <Code>m</Code> is <Code>Monster</Code>, but its dynamic type is <Code>Zombie</Code> (because the first three elements in the list are zombies, as appended in <Code>main()</Code>). In the fourth iteration of that very same for loop, the static type of <Code>m</Code> is still <Code>Monster</Code>, but its dynamic type is <Code>Vampire</Code>. In the eighth iteration, the static type of <Code>m</Code> is still <Code>Monster</Code>, but its dynamic type is <Code>Goblin</Code>. Indeed, because the dynamic type of a variable or expression depends on its actual type <It>at a given point during the program's execution</It>, the dynamic type of a variable or expression may change.</P>

      <P>However, a given expression's dynamic type must always be "compatible with" its static type. One example of compatibility is given by implicit upcasting: if the static type of an expression is a base class, then its dynamic type may be that same base class, <It>or</It> it may be any class that inherits from that base class. Hence, the dynamic type of <Code>m</Code> is allowed to change from <Code>Zombie</Code> to <Code>Vampire</Code> to <Code>Goblin</Code> because <It>all</It> of those dynamic types are compatible with its static type, <Code>Monster</Code>.</P>

      <P>Static types cannot change during a program's execution because they're not a property of an expression's value at runtime, but rather a property of the expression <It>itself</It>, meaning the code that contextualizes and constitutes the expression. I repeat: dynamic types are a property of the program's runtime state, whereas static types are a property of the program's source code. And, clearly, source code cannot change during the program's execution (for the most part...).</P>

      <P>Hopefully this isn't too surprising. I've said in the past that <Bold>dynamic</Bold> means "at runtime", whereas <Bold>static</Bold> means "before runtime". Anything that can be inferred before runtime must be a property of the code itself. Also, I've said that Mypy is a static analysis tool, and that it performs static type checking. This means that Mypy knows nothing about dynamic types<Emdash/>it knows only of static types. And of course that's the case; Mypy works by simply looking at the code, and only static types can be inferred by looking at the code.</P>

      <SectionHeading id="abstract">Abstract methods and abstract base classes</SectionHeading>

      <P>In our example program, the <Code>Goblin</Code> class does not override the <Code>attack()</Code> method, so when a goblin's <Code>attack()</Code> method is called, it simply executes the <Code>attack()</Code> method inherited from the <Code>Monster</Code> class.</P>

      <P>Again, the <Code>Monster</Code> class's <Code>attack()</Code> method essentially serves as the "default" behavior to be exceuted when a given monster attacks the player. Overriding that behavior requires overriding the <Code>attack()</Code> method in the given derived class.</P>

      <P>But in many cases, there is no reasonable "default" behavior for such methods. In fact, even in our example program, the <Code>Monster</Code> class's <Code>attack()</Code> method is not very interesting. It simply damages the player by 1 HP. In a real video game, a monster simply damaging the player by 1 HP would be quite boring. It'd be especially boring if <It>many</It> different kinds of monsters did this when they attack the player. So, in a real video game, it's unlikely that you'd have many monster classes that all do this same, boring thing (unless you want your game to be boring, and I assume you don't). But if few or none of the subclasses use this boring behavior when they attack, then it doesn't really make sense for it to be the "default" behavior, now does it?</P>

      <P>For example, suppose that the <Code>Goblin</Code> class does, indeed, override the <Code>attack()</Code> method, just like the <Code>Zombie</Code> and <Code>Vampire</Code> classes:</P>

      <PythonBlock fileName="goblin.py" highlightLines="{2,6-10,17-19,21-32}">{
`from monster import Monster
from player import Player

# The Goblin class inherits from the Monster class
class Goblin(Monster):
    # Goblins now alternate between dealing 1 and 2 damage on their
    # turns. We'll keep track of the damage that a goblin should
    # do on their next turn by flipping this boolean back and
    # forth between true and false.
    _one_damage: bool

    def __init__(self) -> None:
        # Goblins get 5 HP. Pass this to the Monster constructor
        # to be stored in the private _hp attribute
        super().__init__(5)

        # Goblins do 1 damage on their first turn, so we'll initialize
        # self._one_damage to True
        self._one_damage = True

    def attack(self, p: Player) -> None:
        # Goblins alternate between dealing 1 and 2 damage on each
        # of their turns.
        if self._one_damage:
            p.take_damage(1)
        else:
            p.take_damage(2)

        # If self._one_damage is True, change it to False. If it's
        # False, change it to True. We can do this in the single
        # following statement:
        self._one_damage = not self._one_damage
`
      }</PythonBlock>

      <P>At this point, there's essentially no reason for the <Code>Monster</Code> class's <Code>attack()</Code> method to even exist, right? After all, nowhere in our program do we ever create plain-old <Code>Monster</Code> objects<Emdash/>only <Code>Zombie</Code>, <Code>Vampire</Code>, and <Code>Goblin</Code> objects. Each of the subclasses override the <Code>attack()</Code> method with their own, special definition. Hence, nowhere in the entire program do we ever actually call the <Code>Monster</Code> class's <Code>attack()</Code> method, nor do we intend to. This is what I mean<Emdash/>sometimes, there's simply no reasonable definition for the "default" behavior of a method. Sometimes, you simply intend to override it in every derived class.</P>

      <P>In a case where you don't really have a reasonable definition for the "default" behavior for a method<Emdash/>that is, in a case where in you simply intend to override the method in each and every derived class<Emdash/>you can actually choose to <It>not</It> define a default behavior for the method whatsoever. In this case, that means that we can choose to <It>not</It> define the <Code>Monster</Code> class's <Code>attack()</Code> method. However, it's not as simple as getting rid of the method altogether. After all, Mypy needs to know that all monsters are capable of attacking in order to verify the correctness of <Code>m.attack(p)</Code> within the <Code>game_loop()</Code> function. No, we can't <It>get rid of</It> the <Code>Monster</Code> class's <Code>attack()</Code> method, but we can choose not to <It>define</It> it. We do this by making it an <Bold>abstract method</Bold>. However, only <Bold>abstract classes</Bold> are allowed to have abstract methods. This means that we must make the <Code>Monster</Code> class abstract as well.</P>

      <P>The syntax for creating an abstract class, and then defining an abstract method within it, is as follows:</P>

      <SyntaxBlock>{
`from abc import ABC, abstractmethod

class <class_name>(ABC):
    ... # Declare attributes, define non-abstract methods, etc

    @abstractmethod
    def <method_name>(<parameters>):
        pass`
      }</SyntaxBlock>

      <P>In other words, to make a class abstract, you must import <Code>ABC</Code> from the <Code>abc</Code> package, and then the class must inherit from <Code>ABC</Code> (<Code>ABC</Code> is itself a class; it stands for "abstract base class"). Once the class is abstract (i.e., once it inherits from <Code>ABC</Code>), it may then be given abstract methods. To make a method abstract, you must import <Code>abstractmethod</Code> from the <Code>abc</Code> package, and then the decorator <Code>@abstractmethod</Code> must be written directly above the method's definition. The actual definition should have an empty body (i.e., it must simply say <Code>pass</Code>).</P>
      
      <P>In our case, we'd like to make the <Code>Monster</Code> class's <Code>attack()</Code> method abstract since we no longer have a useful definition for it. This means that we also have to make the <Code>Monster</Code> class itself abstract. Here's the updated code:</P>

      <PythonBlock fileName="monster.py" highlightLines="{4-6,16-25}">{
`from abc import ABC, abstractmethod
from player import Player

# The Monster class is now abstract because it inherits from ABC
# (Abstract Base Class)
class Monster(ABC):
    _hp: int

    def __init__(self, hp: int) -> None:
        # Different monsters will start out with different amounts
        # of hp, so we pass the monster's starting HP as an argument
        # to this constructor's hp parameter. It then stores it in
        # the self._hp attribute.
        self._hp = hp

    # There's no useful default behavior for this method. We intend
    # to override it in each and every derived class. So there's no
    # good definition to give to it here. Hence, we make it abstract,
    # which allows us to choose to not define it whatsoever (or,
    # rather, to leave its definition empty)
    @abstractmethod
    def attack(self, p: Player) -> None:
        # Python requires empty scopes to have the 'pass' keyword
        # present, signifying that it's intentionally empty
        pass
`
      }</PythonBlock>

      <P>The program does the same thing as before, but now we've gotten away with not defining the <Code>attack()</Code> method in the <Code>Monster</Code> class. That's good; it was a useless definition that our program never actually executed, so there's no reason for us to provide it.</P>

      <P>So, an abstract method is essentially just a method that's declared but not defined in the base class; it's then defined via overridden in each of the derived classes. However, abstract methods can only exist within abstract classes. <Ul>Abstract classes themselves also have a very important property: they may not be instantiated</Ul>. In other words, you may not create an object whose dynamic type is that of an abstract base class.</P>

      <P>For example, our <Code>Monster</Code> class is now abstract, which means that we cannot instantiate the <Code>Monster</Code> class. To be clear, we're still allowed to create <Code>Zombie</Code>, <Code>Vampire</Code>, and <Code>Goblin</Code> objects, and we're still allowed to upcast those objects to the static type <Code>Monster</Code>. However, we are <Ul>not</Ul> allowed to create plain-old <Code>Monster</Code> objects (with the <It>dynamic</It> type <Code>Monster</Code>). Consider the following simple program as an example:</P>

      <PythonBlock fileName="badinstantiation.py">{
`from monster import Monster

def main() -> None:
    # This is illegal. Mypy detects it as a syntax error. If
    # executed, it throws a TypeError.
    my_monster = Monster(10)

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>This is the error reported by Mypy:</P>

      <TerminalBlock copyable={false}>{
`(env) $ mypy .
badinstantiation.py:6: error: Cannot instantiate abstract class "Monster" with abstract attribute "attack"  [abstract]
Found 1 error in 1 file (checked 6 source files)
`
      }</TerminalBlock>

      <P>And this is the error that occurs when the above program is executed:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python badinstantiation.py 
Traceback (most recent call last):
  File "/home/alex/instructor/static-content/guyera.github.io/code-samples/polymorphism/bad-instantiation/badinstantiation.py", line 9, in <module>
    main()
    ~~~~^^
  File "/home/alex/instructor/static-content/guyera.github.io/code-samples/polymorphism/bad-instantiation/badinstantiation.py", line 6, in main
    my_monster = Monster(10)
TypeError: Can't instantiate abstract class Monster without an implementation for abstract method 'attack'
`
      }</TerminalBlock>

      <P>The reason for this is relatively simple. The <Code>Monster</Code> class provides the abstract <Code>attack()</Code> method to make it clear (both to Mypy and the interpreter) that all monsters are capable of attacking the player (e.g., so that Mypy can verify that <Code>m.attack(p)</Code> is a valid statement). However, it doesn't provide a <It>definition</It> for what the <Code>attack()</Code> method should actually do. In some sense, the <Code>Monster</Code> class is "incomplete". It defines a concept<Emdash/>the concept of a monster, which is capable of attacking the player<Emdash/>but it does not complete that concept by defining <It>how</It> monsters attack the player. Instead, it leaves it up to the subclasses to define how the player should be attacked by overriding the <Code>attack()</Code> method (and each subclass can provide its own, special override).</P>

      <P>Put another way, the <Code>Monster</Code> class provides an <Bold>interface</Bold>. It states that the <Code>attack()</Code> method exists, and it states <It>what</It> it should do (it accepts a player and attacks them). However, it doesn't provide an <Bold>implementation</Bold>. It doesn't state <It>how</It> the player should be attacked. Indeed, this is very common terminology: abstract base classes provide interfaces, and derived classes implement those interfaces.</P>
      
      <P>If abstract classes provide interfaces but not implementations<Emdash/>if they're essentially "incomplete"<Emdash/>then hopefully it makes sense that they cannot be instantiated.</P>

      <P>But it's okay that abstract classes can't be instantiated. After all, in our game, we don't instantiate the <Code>Monster</Code> class at any point, and we have no intention of ever doing that. And if we <It>did</It> have an intention of doing that, then we must also have some idea of what <Code>m.attack(p)</Code> should do in the case that <Code>m</Code> has the dynamic type <Code>Monster</Code>. And if we have an idea of what that should do, then we don't need the <Code>Monster</Code> class's <Code>attack()</Code> method to be abstract<Emdash/>we could define it to do that thing. And in that case, the <Code>Monster</Code> class wouldn't need to be abstract, either, and we'd be able to instantiate it as needed.</P>

      <P>I said that subclasses "complete the concept", or "implement the interface", of their abstract base class by overriding all of the inherited abstract methods. But what if a derived class <It>doesn't</It> override one of its inherited abstract methods? Well, <Ul>if a derived class inherits an abstract method from an abstract base class, but it doesn't override that abstract method, then the derived class, too, is abstract</Ul>. Only once it overrides <Ul>all</Ul> of the abstract methods that it has inherited will it be considered <It>not</It> abstract. For example, if we had made the <Code>Monster</Code> class's <Code>attack()</Code> method abstract <It>without</It> overriding it in the <Code>Goblin</Code> class, then the <Code>Goblin</Code> class would also be abstract. That would have made it impossible to instantiate the <Code>Goblin</Code> class, which our <Code>main()</Code> function needs to be able to do.</P>

      <SectionHeading id="override-decorator">The <Code>@override</Code> decorator</SectionHeading>

      <P>It's also important that you override abstract methods <It>correctly</It>. In particular, when a derived class overrides an abstract method inherited from its base class, the override must have the exact same name as that of the inherited method, but also the exact same parameter list and return type. All of these things must match exactly. In our case, the abstract method is named <Code>attack</Code>, it accepts a single <Code>Player</Code> parameter, and it returns <Code>None</Code>. All of these things must also be true of the <Code>attack</Code> method's overrides in each of the derived classes (and, indeed, that is the case).</P>

      <P>Failure to override an abstract method correctly can result in various kinds of errors. For example, if the <Code>Goblin</Code> class's <Code>attack()</Code> override accepted two parameters instead of one, then <Code>m.attack(p)</Code> would fail when <Code>m</Code> has the dynamic type <Code>Goblin</Code> (it'd be calling a method with two parameters but only passing in one argument). Moreover, if the <It>name</It> of the override wasn't written correctly (e.g., due to a typo), then Mypy and the interpreter would treat it as a different method altogether, in which case the <Code>Goblin</Code> class would be abstract due to faliing to override the <Code>attack()</Code> method.</P>

      <P>To protect yourself from these sorts of mistakes, the <Code>typing</Code> module provides a special decorator: <Code>@override</Code>. Once imported, it can be used to annotate a method override by writing it directly above the override's definition. This tells Mypy that the intention is to override a method from the base class. Mypy will then carefully check that the override does, indeed, match all the specifications of the base class method (including the name, parameter list, and return type). If any of the specifications are not a match, it will immediately throw an error, pointing you to your mistake.</P>
      
      <P>For example:</P>

      <PythonBlock fileName="goblin.py">{
`from typing import override # Import the override decorator

from monster import Monster
from player import Player

# The Goblin class inherits from the Monster class
class Goblin(Monster):
    # Goblins now alternate between dealing 1 and 2 damage on their
    # turns. We'll keep track of the damage that a goblin should
    # do on their next turn by flipping this boolean back and
    # forth between true and false.
    _one_damage: bool

    def __init__(self) -> None:
        # Goblins get 5 HP. Pass this to the Monster constructor
        # to be stored in the private _hp attribute
        super().__init__(5)

        # Goblins do 1 damage on their first turn, so we'll initialize
        # self._one_damage to True
        self._one_damage = True

    # This tells Mypy and the interpreter that this method is meant to
    # be an override of an inherited method from the Monster class. If
    # we were to make a mistake when defining this override, such as
    # misspelling its name, giving it the wrong kinds of parameters, or
    # giving it the wrong return type, then Mypy will raise errors
    # and point out our mistake.
    @override
    def attack(self, p: Player) -> None:
        # Goblins alternate between dealing 1 and 2 damage on each
        # of their turns.
        if self._one_damage:
            p.take_damage(1)
        else:
            p.take_damage(2)

        # If self._one_damage is True, change it to False. If it's
        # False, change it to True. We can do this in the single
        # following statement:
        self._one_damage = not self._one_damage
`
      }</PythonBlock>

      <P>In the above example, the method is overridden correctly, so Mypy will not throw any errors. But if there were anything wrong with the override, even just typo in its name, Mypy would notify us. That's useful. Ordinarily, if there was just a typo in the method's name, Mypy wouldn't notice. It'd just think that we're trying to define a different method. We wouldn't see any issues in such a case until we try to instantiate the <Code>Goblin</Code> class.</P>

      <P>(In practice, we should use the <Code>@override</Code> decorator in the <Code>Zombie</Code> and <Code>Vampire</Code> classes as well, but I'll leave that as an exercise to the reader.)</P>

      <SectionHeading id="polymorphism-in-other-languages">(Optional content) Polymorphism in other languages</SectionHeading>

      <P>In Python, polymorphism basically happens automatically whenever you upcast anything (and in some other cases). But as I said earlier, this isn't the case in all programming languages. In C++, for example, getting polymorphism to work requires some extra syntax and attention to detail. This isn't a Python course. Rather, Python is merely a tool through which we're exploring computer science. So, I'd be remiss if I didn't explain how to accomplish polymorphism in other languages like C++ as well.</P>

      <P>When a function call is executed, such as <Code>m.attack(p)</Code>, your computer must somehow associate that function call with a certain function definition. That is, it must somehow figure out which body of code to jump to and execute. The process of associating the name of a symbol (such as the name of a function) with the definition of that symbol is referred to as <Bold>binding</Bold>.</P>

      <P>There are two ways that function names can be bound to their definitions: <Bold>static binding</Bold>, and <Bold>late binding</Bold>. Static binding is based on static types of expressions. Dynamic binding is based on dynamic types of expressions.</P>

      <P>For example, under static binding, <Code>m.attack(p)</Code> would always execute the <Code>Monster</Code> class's <Code>attack()</Code> method (which wouldn't be possible in our current program since it's undefined, but suppose that it <It>was</It> defined). That's because the static type of <Code>m</Code> is <Code>Monster</Code>, and static binding works through static types. In contrast, under dynamic binding, <Code>m.attack(p)</Code> would execute the correct override of the <Code>attack()</Code> method depending on the dynamic type of <Code>m</Code> (e.g., if the dyanmic type of <Code>m</Code> was <Code>Zombie</Code>, then it would execute the <Code>Zombie</Code> class's <Code>attack()</Code> method override).</P>

      <P>In Python, all function calls are bound dynamically. There is no such thing as static function binding in Python. This is why we didn't need to do anything special to get <Code>m.attack(p)</Code> to call the correct derived-class overrides.</P>

      <P>That sounds convenient, but dynamic binding is slower than static binding because it requires indirection / function lookups at runtime. For example, in C++, dynamic binding works via <Bold>virtual tables</Bold> and <Bold>virtual pointers</Bold>. These mechanisms require your computer to jump around from one place in memory to another <It>several times</It> in order to execute the target function definition. Static binding, in contrast, does not require any such indirection. Static binding happens at build time<Emdash/>the compiler simply translates the line of code containing the function call to a machine instruction that tells the computer to jump to a very specific definition at a fixed (relative) location in memory.</P>

      <P>(Dynamic binding is even slower in Python than in C++ because of how objects are associated with their members according to Python's object model.</P>

      <P>Hopefully this isn't surprising. Remember: "dynamic" means "at runtime", and anything that must happen at runtime is, of course, going to slow down the program when it's running. "Static" means "before runtime", meaning that static things can be done before the program even starts. So it should make sense that dynamic binding is slower than static binding.</P>

      <P>In languages that support both static and dynamic binding, static binding is typically the default binding mechanism. If you want to achieve dynamic binding of a certain function, then, you must enable it manually, often through a special keyword (such as C++'s <Code>virtual</Code> keyword, which is used to annotate the method in the base class, enabling dynamic binding of that method).</P>

      <P>Once you've done that, you might <It>still</It> run into issues getting polymorphism to work, depending on the programming language. Another common issue is known as <Bold>object slicing</Bold>. In some languages (again, such as C++), upcasting an object causes the object to lose its derived-class-specific attributes and methods. For example, in C++, upcasting a <Code>Zombie</Code> object into a <Code>Monster</Code> object would cause it to lose its <Code>attack()</Code> override and <Code>_sanity</Code> attribute because both of those things are defined in the <Code>Zombie</Code> class. That is, in C++, when a <Code>Zombie</Code> object is upcasted into a <Code>Monster</Code> object, it's essentially no longer a <Code>Zombie</Code> object anymore<Emdash/>it just becomes a plain-old <Code>Monster</Code> object (and, unsurprisingly, this isn't allowed if the <Code>Monster</Code> class is abstract). It's called "object slicing" because the derived-class-specific attributes and methods are "sliced" off, leaving you with nothing more than a plain-old <Code>Monster</Code> object.</P>

      <P>Avoiding object slicing usually involves upcasting pointers or references rather than upcasting objects directly (we don't have time to discuss why this solves the problem, but it does).</P>

      <P>Python doesn't have an object slicing problem because, in Python, everything is a reference (<Link href={`${PARENT_PATH}/${allPathData["references-and-copies"].pathName}`}>we discussed this in a past lecture</Link>), so when you upcast something in Python, you're inherently upcasting a reference. But, as with dynamic binding, this can cause performance issues.</P>
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
