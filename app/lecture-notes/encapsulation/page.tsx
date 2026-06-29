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
        <Item><Link href="#reducing-coupling">Reducing coupling</Link></Item>
        <Item><Link href="#private-attributes">Private attributes</Link></Item>
        <Item><Link href="#private-methods">Private methods</Link></Item>
        <Item><Link href="#class-invariants">Class invariants</Link></Item>
        <Item><Link href="#getters-and-setters">Getters and setters</Link></Item>
      </Itemize>

      <SectionHeading id="maintainability">Maintainability</SectionHeading>

      <P>Most of our past lectures have served to teach you new language features that can be used to solve different kinds of computational problems. This lecture isn't so much about the technical details in solving computational problems as it is about the philosophy of software design.</P>

      <P>(Yes, this means that this lecture will be less code-heavy and more theory-heavy. Apologies in advance.)</P>

      <P>When you set out to write some code to solve a problem, there are often countless different approaches that would all <It>work</It>. Just take our labs and homework assignments, for example. Even in a class with hundreds of students, it's incredibly unlikely that two students would write the exact same code to solve one of these problems.</P>

      <P>When considering all these different approaches, how do we choose between them? What makes one approach "better" or "worse" than another? This is a natural question to ask, and software engineers have been thinking about it for decades. But it's a very complicated question with a very complicated answer; there are many properties that distinguish "good code" from "bad code" (so to speak). Often times, these properties can even run counter to one another in some sort of tradeoff, and the software engineer has to prioritize between them.</P>

      <P>But this isn't a software engineering course, so we don't have time to discuss the many properties of quality software design. Instead, we'll just focus on one of them: <Bold>maintainability</Bold>. As you might have guessed, maintainability describes how easy or hard it is to maintain a codebase, such as adding, removing, or changing features.</P>

      <P>Consider a video game that has two kinds of monsters: zombies and vampires. These monsters take turns attacking the player. Suppose the video game is wildly successful, so the developer decides to roll out a free update to the game. In this update, the developer would like to introduce a third kind of monster to the game: werewolves. Thinking about maintainability, an interesting question to ask is: how difficult is it for the developer to implement werewolves into the game? Does it require modifying hundreds of lines of code sprawled across tens of source code files? Or does it require modifying just ten lines of code across two source files? The latter case, which seems much more maintainable in this example, would likely be preferred, assuming the benefits from this maintainability outweigh the initial costs of designing and implementing the codebase to be maintainable to begin with (not to skip over <Link href="https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it">YAGNI</Link>; it has a place in this conversation as well).</P>

      <P>To be clear, maintainability is about much more than the number of lines of code that need to be modified in order to introduce a feature. It's also not the only important property of good software design. You might learn about these things in greater detail if you take some software engineering courses.</P>

      <SectionHeading id="encapsulation">Encapsulation</SectionHeading>

      <P>There are many tools and techniques that software engineers can use to improve a codebase's maintainability. One such tool is known as <Bold>encapsulation</Bold>. If you ask 100 software engineers exactly what "encapsulation" is, you'll get 100 different answers (partly for historical reasons<Emdash/>encapsulation has often been entangled with some other techniques, such as information hiding and message passing, so the definitions of these terms often get jumbled together in messy ways). But the definition I'm going to go with is as follows: encapsluation means isolated co-location, or bundling together, of data with the behavior that operates on that data.</P>

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

      <P>Every <Code>Dog</Code> object has two attributes: <Code>name</Code> and <Code>birth_year</Code>. Suppose we have a <Code>Dog</Code> object called <Code>spot</Code>, and we want to "operate on" <Code>spot</Code>'s attributes. This is what <Code>spot</Code>'s methods are for. For example, when we first create <Code>spot</Code>, we need to assign values to <Code>spot</Code>'s attributes. We do this with the constructor. And afterwards, we might want to print <Code>spot</Code>'s attributes to the terminal. We do this with <Code>spot</Code>'s <Code>print()</Code> method (i.e., <Code>spot.print()</Code>). These methods are defined next to (co-located with) the attributes that they operate on, so this is an example of encapsulation.</P>

      <P>A counterexample to encapsulation might look like this:</P>

      <PythonBlock fileName="noencapsulation.py">{
`from dog import Dog

def main() -> None:
    spot = Dog('', 0)
    spot.name = 'Spot'
    spot.birth_year = 2019
    print(f'{spot.name} was born in {spot.birth_year}')

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>In this case, the <Code>main</Code> function reaches inside the <Code>Dog</Code> object, <Code>spot</Code>, and directly operates on (accesses) its <Code>name</Code> and <Code>birth_year</Code> attributes, both for initializing them and printing them. This is code is <Ul>not</Ul> well-encapsulated.</P>

      <P>Moreover, simply putting everything in one gigantic class or other code component is <It>not</It> encapsulation. Yes, technically the attributes would all be co-located with the behaviors that operate on them, but not in an <It>isolated</It> manner<Emdash/>you'd have tons of attributes co-located with behaviors that have nothing to do with them.</P>

      <P>A related concept to encapsulation is that of <Bold>cohesion</Bold>, which is a measure of how closely related the various responsibilities are within a given module, class, or other component. It's often said that a good class design should be highly cohesive, meaning that its data (attributes) and behaviors (methods) should be closely related to one another.</P>

      <SectionHeading id="coupling">Coupling</SectionHeading>

      <P>So, how can encapsulation be used to improve code maintainability? Well, it actually helps in a couple different ways:</P>

      <Enumerate listStyleType="decimal">
        <Item><P>Encapsulation can reduce coupling</P></Item>
        <Item><P>Encapsulation can enable class invariants</P></Item>
      </Enumerate>

      <P>Let's focus on coupling for now. <Link href="#class-invariants">We'll cover class invariants in a bit</Link>.</P>

      <P>The definition of <Bold>coupling</Bold>, like that of encapsulation, is a bit subjective. However, there's a theme among the various definitions: coupling, in some sense or another, refers to a case where changing one component of code requires changing one or more other components of code in turn. This is a somewhat vague definition, but it's good enough for our use case.</P>

      <P>Not all coupling is the same. For one, there are different degrees of coupling. If two components of code are <Bold>tightly coupled</Bold>, that means one is highly dependent on the other (and possibly vice-versa as well), so changing one will almost always require changing the other. In contrast, if two components of code are <Bold>loosely coupled</Bold>, that means one is only loosely dependent on the other (and possibly vice-versa), so changing one may or may not require changing the other.</P>

      <P>Coupling can also be <Bold>local</Bold> or <Bold>pervasive</Bold>. These are not widely accepted terms (I think I just made them up), but I think they're useful, so I'll use them anyways. Under my definitions, local coupling is when a small, controlled number of adjacent code components are coupled together, whereas pervasive coupling is when a given code component is coupled to countless other code components throughout the entire codebase (and, perhaps more importantly, pervasive coupling tends to get worse over time as the codebase gets more complex, but local coupling is mostly fixed; this is a result of <Link href="https://en.wikipedia.org/wiki/Open%E2%80%93closed_principle">Bertrand Meyer's open-closed principle</Link> of object-oriented software design).</P>

      <P>In many cases, coupling can make code hard to maintain (e.g., hard to change, hard to add to, hard to remove, etc). For example, suppose you're part of a hobbyist rocketry team, and you're in charge of programming the rocket's flight computer. Maybe you have a <Code>Vector3</Code> class that represents an x, y, and z coordinate (perhaps a location in 3D space, or a velocity vector, or an acceleration vector, etc):</P>

      <PythonBlock fileName="vector3.py">{
`class Vector3:
    x: float
    y: float
    z: float

    def __init__(self) -> None:
        # All zeros by default
        self.x = 0
        self.y = 0
        self.z = 0
`
      }</PythonBlock>

      <P>And maybe you have a <Code>Rocket</Code> class like this one:</P>

      <PythonBlock fileName="rocket.py">{
`from vector3 import Vector3

class Rocket:
    # This list of Vector3 objects keeps a record of the rocket's
    # flight path so far, relative to the launch pad, as sourced from
    # the rocket's GPS module. The last element
    # in the list represents the rocket's current location.
    gps_flight_path: list[Vector3]
    
    def __init__(self) -> None:
        # Rocket is initially resting on the launch pad, so initialize
        # gps_flight_path to contain a single Vector3 object with x, y,
        # and z all equal to zero.
        self.gps_flight_path = [Vector3()]
`
      }</PythonBlock>

      <P>Now suppose that, throughout the program, you find yourself needing to interact with the rocket's data in various ways for various reasons. Perhaps, every few seconds, the program receives updates about the rocket's current position from a GPS module, at which point a new <Code>Vector3</Code> object should be appended to the rocket's <Code>gps_flight_path</Code> list attribute to reflect the new position:</P>

      <PythonBlock fileName="rocket.py" highlightLines="{16-27}">{
`from vector3 import Vector3

class Rocket:
    # This list of Vector3 objects keeps a record of the rocket's
    # flight path so far, relative to the launch pad, as sourced from
    # the rocket's GPS module. The last element
    # in the list represents the rocket's current location.
    gps_flight_path: list[Vector3]
    
    def __init__(self) -> None:
        # Rocket is initially resting on the launch pad, so initialize
        # gps_flight_path to contain a single Vector3 object with x, y,
        # and z all equal to zero.
        self.gps_flight_path = [Vector3()]

    def query_gps(self) -> None:
        new_position = Vector3()

        # Here, we would somehow retrieve the rocket's current position
        # from the GPS hardware and update the x/y/z coordinates of
        # new_position accordingly. Of course, reading from GPS
        # hardware is beyond the scope of this course, so just use your
        # imagination here.
        # ...

        # Append new position to self.gps_flight_path
        self.gps_flight_path.append(new_position)
`
      }</PythonBlock>

      <P>Perhaps the rocket steers through active fin actuation (e.g., adjusting the orientations of the fins via servo motors). Then the flight computer will need some code to tell it how and when to reorient, the calculations of which depend on the rocket's current trajectory (position and velocity):</P>

      <PythonBlock fileName="rocket.py" highlightLines="{29-48}">{
`from vector3 import Vector3

class Rocket:
    # This list of Vector3 objects keeps a record of the rocket's
    # flight path so far, relative to the launch pad, as sourced from
    # the rocket's GPS module. The last element
    # in the list represents the rocket's current location.
    gps_flight_path: list[Vector3]
    
    def __init__(self) -> None:
        # Rocket is initially resting on the launch pad, so initialize
        # gps_flight_path to contain a single Vector3 object with x, y,
        # and z all equal to zero.
        self.gps_flight_path = [Vector3()]

    def query_gps(self) -> None:
        new_position = Vector3()

        # Here, we would somehow retrieve the rocket's current position
        # from the GPS hardware and update the x/y/z coordinates of
        # new_position accordingly. Of course, reading from GPS
        # hardware is beyond the scope of this course, so just use your
        # imagination here.
        # ...

        # Append new position to self.gps_flight_path
        self.gps_flight_path.append(new_position)

    def actuate_fins(self) -> None:
        # Get rocket's current position
        current_position = \\
            self.gps_flight_path[len(self.gps_flight_path) - 1]
        
        # Approximate rocket's current velocity based on difference
        # between last two positions
        previous_position = \\
            self.gps_flight_path[len(self.gps_flight_path) - 2]
        current_velocity = Vector3()
        current_velocity.x = current_position.x - previous_position.x
        current_velocity.y = current_position.y - previous_position.y
        current_velocity.z = current_position.z - previous_position.z

        # Here, we would somehow use current_position and
        # current_velocity to determine how the fins should be actuated
        # so as to guide the rocket along the target trajectory.
        # That's beyond the scope of this course, so use your
        # imagination here as well.
        # ...
`
      }</PythonBlock>

      <P>At some point, the flight computer will need to deploy the rocket's parachute. This decision also depends on the rocket's current trajectory:</P>

      <PythonBlock fileName="rocket.py" highlightLines="{54-82,9,17-18}">{
`from vector3 import Vector3

class Rocket:
    # This list of Vector3 objects keeps a record of the rocket's
    # flight path so far, relative to the launch pad, as sourced from
    # the rocket's GPS module. The last element
    # in the list represents the rocket's current location.
    gps_flight_path: list[Vector3]
    deployed_parachute: bool
    
    def __init__(self) -> None:
        # Rocket is initially resting on the launch pad, so initialize
        # gps_flight_path to contain a single Vector3 object with x, y,
        # and z all equal to zero.
        self.gps_flight_path = [Vector3()]

        # Parachute initially undeployed
        self.deployed_parachute = False

    def query_gps(self) -> None:
        new_position = Vector3()

        # Here, we would somehow retrieve the rocket's current position
        # from the GPS hardware and update the x/y/z coordinates of
        # new_position accordingly. Of course, reading from GPS
        # hardware is beyond the scope of this course, so just use your
        # imagination here.
        # ...

        # Append new position to self.gps_flight_path
        self.gps_flight_path.append(new_position)

    def actuate_fins(self) -> None:
        # Get rocket's current position
        current_position = \\
            self.gps_flight_path[len(self.gps_flight_path) - 1]
        
        # Approximate rocket's current velocity based on difference
        # between last two positions
        previous_position = \\
            self.gps_flight_path[len(self.gps_flight_path) - 2]
        current_velocity = Vector3()
        current_velocity.x = current_position.x - previous_position.x
        current_velocity.y = current_position.y - previous_position.y
        current_velocity.z = current_position.z - previous_position.z

        # Here, we would somehow use current_position and
        # current_velocity to determine how the fins should be actuated
        # so as to guide the rocket along the target trajectory.
        # That's beyond the scope of this course, so use your
        # imagination here as well.
        # ...

    def deploy_parachute_if_ready(self) -> None:
        if self.deployed_parachute:
            # Parachute has already been deployed. Do nothing.
            return

        # Get rocket's current position
        current_position = \\
            self.gps_flight_path[len(self.gps_flight_path) - 1]
        
        # Approximate rocket's current velocity based on difference
        # between last two positions
        previous_position = \\
            self.gps_flight_path[len(self.gps_flight_path) - 2]
        current_velocity = Vector3()
        current_velocity.x = current_position.x - previous_position.x
        current_velocity.y = current_position.y - previous_position.y
        current_velocity.z = current_position.z - previous_position.z

        # Let's say the parachute is meant to be deployed at
        # apogee (peak of trajectory). Let's say the y coordinate
        # dimension represents elevation. Then we should deploy the
        # parachute when the y coordinate of current_velocity becomes
        # non-positive (when the rocket is no longer moving upward)
        if current_velocity.y <= 0:
            # Here, we would somehow engage with the hardware to
            # deploy the parachute. Again, use your imagination.
            # ...

            self.deployed_parachute = True
`
      }</PythonBlock>

      <P>And perhaps the rocket continuously sends data about its current trajectory back to a receiver on the ground for logging and monitoring:</P>

      <PythonBlock fileName="rocket.py" highlightLines="{84-101}">{
`from vector3 import Vector3

class Rocket:
    # This list of Vector3 objects keeps a record of the rocket's
    # flight path so far, relative to the launch pad, as sourced from
    # the rocket's GPS module. The last element
    # in the list represents the rocket's current location.
    gps_flight_path: list[Vector3]
    deployed_parachute: bool
    
    def __init__(self) -> None:
        # Rocket is initially resting on the launch pad, so initialize
        # gps_flight_path to contain a single Vector3 object with x, y,
        # and z all equal to zero.
        self.gps_flight_path = [Vector3()]

        # Parachute initially undeployed
        self.deployed_parachute = False

    def query_gps(self) -> None:
        new_position = Vector3()

        # Here, we would somehow retrieve the rocket's current position
        # from the GPS hardware and update the x/y/z coordinates of
        # new_position accordingly. Of course, reading from GPS
        # hardware is beyond the scope of this course, so just use your
        # imagination here.
        # ...

        # Append new position to self.gps_flight_path
        self.gps_flight_path.append(new_position)

    def actuate_fins(self) -> None:
        # Get rocket's current position
        current_position = \\
            self.gps_flight_path[len(self.gps_flight_path) - 1]
        
        # Approximate rocket's current velocity based on difference
        # between last two positions
        previous_position = \\
            self.gps_flight_path[len(self.gps_flight_path) - 2]
        current_velocity = Vector3()
        current_velocity.x = current_position.x - previous_position.x
        current_velocity.y = current_position.y - previous_position.y
        current_velocity.z = current_position.z - previous_position.z

        # Here, we would somehow use current_position and
        # current_velocity to determine how the fins should be actuated
        # so as to guide the rocket along the target trajectory.
        # That's beyond the scope of this course, so use your
        # imagination here as well.
        # ...

    def deploy_parachute_if_ready(self) -> None:
        if self.deployed_parachute:
            # Parachute has already been deployed. Do nothing.
            return

        # Get rocket's current position
        current_position = \\
            self.gps_flight_path[len(self.gps_flight_path) - 1]
        
        # Approximate rocket's current velocity based on difference
        # between last two positions
        previous_position = \\
            self.gps_flight_path[len(self.gps_flight_path) - 2]
        current_velocity = Vector3()
        current_velocity.x = current_position.x - previous_position.x
        current_velocity.y = current_position.y - previous_position.y
        current_velocity.z = current_position.z - previous_position.z

        # Let's say the parachute is meant to be deployed at
        # apogee (peak of trajectory). Let's say the y coordinate
        # dimension represents elevation. Then we should deploy the
        # parachute when the y coordinate of current_velocity becomes
        # non-positive (when the rocket is no longer moving upward)
        if current_velocity.y <= 0:
            # Here, we would somehow engage with the hardware to
            # deploy the parachute. Again, use your imagination.
            # ...

            self.deployed_parachute = True

    def log_data(self) -> None:
        # Get rocket's current position
        current_position = \\
            self.gps_flight_path[len(self.gps_flight_path) - 1]
        
        # Approximate rocket's current velocity based on difference
        # between last two positions
        previous_position = \\
            self.gps_flight_path[len(self.gps_flight_path) - 2]
        current_velocity = Vector3()
        current_velocity.x = current_position.x - previous_position.x
        current_velocity.y = current_position.y - previous_position.y
        current_velocity.z = current_position.z - previous_position.z

        # Here, we would somehow send current_position and
        # current_velocity to the ground receiver for monitoring.
        # Use your imagination.
        # ...
`
      }</PythonBlock>

      <P>Suppose you test the above code in a flight simulation and find that it works as intended. You proceed to deploy it to the rocket's flight computer, and the team runs its first test flight. During the test flight, one of your teammates notices that the rocket steers somewhat sporadically at high altitudes, and that the parachute is deployed earlier than it should've been. You analyze the data sent back by the rocket during the flight and discover that the position data streamed from the GPS module is extremely noisy and unreliable when the rocket is at high altitudes.</P>

      <P>Your team does some research and learns that this is a well-known limitation of most GPS modules. As such, you conclude that the rocket's guidance system shouldn't be informed purely by GPS data. Rather, the rocket should be equipped with additional sensors, such as a accelerometers and gyroscopes, and the guidance system should incorporate information from all these sensors.</P>

      <P>(Okay, perhaps it's somewhat unrealistic that your team wouldn't have incorporated these sensors to begin with, given that they're extremely standard, but this is all academic).</P>

      <P>Your team orders an accelerometer, and you begin updating the guidance system's code. First, you introduce new attributes to store the data sourced from the accelerometer:</P>

      <PythonBlock fileName="rocket.py" highlightLines="{11-20,31-34,49-63}">{
`from vector3 import Vector3

class Rocket:
    # This list of Vector3 objects keeps a record of the rocket's
    # flight path so far, relative to the launch pad, as sourced from
    # the rocket's GPS module. The last element
    # in the list represents the rocket's current location.
    gps_flight_path: list[Vector3]
    deployed_parachute: bool

    # Rocket's current acceleration as sourced from the
    # accelerometer
    acceleration: Vector3

    # We'll also keep track of a running estimate of the rocket's
    # velocity and position, periodically updating them based on its
    # acceleration at the given point in time (i.e., approximating
    # velocity and position through integration).
    velocity: Vector3
    position: Vector3
    
    def __init__(self) -> None:
        # Rocket is initially resting on the launch pad, so initialize
        # gps_flight_path to contain a single Vector3 object with x, y,
        # and z all equal to zero.
        self.gps_flight_path = [Vector3()]

        # Parachute initially undeployed
        self.deployed_parachute = False

        # Acceleration, velocity, and position all start as zero-vectors
        self.acceleration = Vector3()
        self.velocity = Vector3()
        self.position = Vector3()

    def query_gps(self) -> None:
        new_position = Vector3()

        # Here, we would somehow retrieve the rocket's current position
        # from the GPS hardware and update the x/y/z coordinates of
        # new_position accordingly. Of course, reading from GPS
        # hardware is beyond the scope of this course, so just use your
        # imagination here.
        # ...

        # Append new position to self.gps_flight_path
        self.gps_flight_path.append(new_position)

    def query_accelerometer(self) -> None:
        # Here, we would somehow query the rocket's current
        # acceleration from the accelerometer and update
        # self.acceleration accordingly
        # Use your imagination.
        # ...

        # Now, update velocity and position accordingly (note: this is
        # an oversimplification)
        self.velocity.x += self.acceleration.x
        self.velocity.y += self.acceleration.y
        self.velocity.z += self.acceleration.z
        self.position.x += self.velocity.x
        self.position.y += self.velocity.y
        self.position.z += self.velocity.z

    def actuate_fins(self) -> None:
        # Get rocket's current position
        current_position = \\
            self.gps_flight_path[len(self.gps_flight_path) - 1]
        
        # Approximate rocket's current velocity based on difference
        # between last two positions
        previous_position = \\
            self.gps_flight_path[len(self.gps_flight_path) - 2]
        current_velocity = Vector3()
        current_velocity.x = current_position.x - previous_position.x
        current_velocity.y = current_position.y - previous_position.y
        current_velocity.z = current_position.z - previous_position.z

        # Here, we would somehow use current_position and
        # current_velocity to determine how the fins should be actuated
        # so as to guide the rocket along the target trajectory.
        # That's beyond the scope of this course, so use your
        # imagination here as well.
        # ...

    def deploy_parachute_if_ready(self) -> None:
        if self.deployed_parachute:
            # Parachute has already been deployed. Do nothing.
            return

        # Get rocket's current position
        current_position = \\
            self.gps_flight_path[len(self.gps_flight_path) - 1]
        
        # Approximate rocket's current velocity based on difference
        # between last two positions
        previous_position = \\
            self.gps_flight_path[len(self.gps_flight_path) - 2]
        current_velocity = Vector3()
        current_velocity.x = current_position.x - previous_position.x
        current_velocity.y = current_position.y - previous_position.y
        current_velocity.z = current_position.z - previous_position.z

        # Let's say the parachute is meant to be deployed at
        # apogee (peak of trajectory). Let's say the y coordinate
        # dimension represents elevation. Then we should deploy the
        # parachute when the y coordinate of current_velocity becomes
        # non-positive (when the rocket is no longer moving upward)
        if current_velocity.y <= 0:
            # Here, we would somehow engage with the hardware to
            # deploy the parachute. Again, use your imagination.
            # ...

            self.deployed_parachute = True

    def log_data(self) -> None:
        # Get rocket's current position
        current_position = \\
            self.gps_flight_path[len(self.gps_flight_path) - 1]
        
        # Approximate rocket's current velocity based on difference
        # between last two positions
        previous_position = \\
            self.gps_flight_path[len(self.gps_flight_path) - 2]
        current_velocity = Vector3()
        current_velocity.x = current_position.x - previous_position.x
        current_velocity.y = current_position.y - previous_position.y
        current_velocity.z = current_position.z - previous_position.z

        # Here, we would somehow send current_position and
        # current_velocity to the ground receiver for monitoring.
        # Use your imagination.
        # ...
`
      }</PythonBlock>

      <P>Looks great! Now there's just one more issue: the rocket is still using its GPS flight path to approximate its trajectory for the sake of fin actuation, parachute deployment, and telemetry (logging / monitoring). Assuming the trajectories computed from the accelerometer data are more reliable, the code should be updated to use them instead.</P>

      <P>Except... That <It>isn't</It> just one more issue. It's three: 1) updating the fin-actuation code to use the new accelerometer-based trajectories; 2) updating the parachute-deployment code to use the new accelerometer-based trajectories; and 3) updating the telemetry / logging code to use the new accelerometer-based trajectories.</P>

      <P>Fine, we can handle that. Three small issues still isn't that big of a deal. But consider: the above code is a toy program. Real guidance systems are substantially more complicated than this, even in amateur rocketry. In a real guidance system, there might not just be three components of code that need updating, but rather three <It>hundred</It>. That's a much bigger deal, especially given that this change <It>should</It> be simple. After all, we're just trying to exchange one data source (GPS) for another (accelerometer). Why should that require changes to several code components sprawled throughout our entire codebase?</P>

      <P>This is an example of tight, pervasive coupling. The way the codebase is written, many of the rocket's features are tightly coupled to the <Code>gps_flight_path</Code> attribute. If we want to change those features to instead source the trajectory data from the new accelerometer-based attributes, that will require a lot of changes due to all this coupling.</P>

      <P>Put another way, much of our codebase is not just dependent on the rocket's <It>trajectories</It>, but rather <It>a very specific representation of its trajectories</It> (<Code>gps_flight_path</Code>). Dependencies induce coupling (more on this shortly), so this means our codebase is tightly and pervasively coupled to this representation, making it difficult to change. And that's precisely what we're trying to do.</P>

      <P>What's more, this was all very predictable. Representations are <It>design decisions</It>, and most design decisions aren't fundamental or definitional to the project's goals. They're just one way of <It>accomplishing</It> those goals. Indeed, there are often infinitely many ways to represent a given concept in code, and in the beginning, many of these representations will all seem equally valid, so you just choose one and go with it (i.e., you make a design decision). But later, as the project evolves, another representation might become more appealing (e.g., like exchanging one data structure for another for performance reasons; or like exchanging one data source for another to leverage new hardware, as in this rocketry example). When that day comes, you'll have to change the representation.</P>

      <P>Such is the nature of many design decisions<Emdash/>they're often extremely fragile, perhaps based on limited knowledge or experience, or engineered to fit a feature's overly simple requirements in the early phases of its development. Over time, the engineers will gain more knowledge and experience, and the feature or project will evolve new requirements, at which point those early design decisions may no longer make sense and will have to be updated. If the codebase is tightly and pervasively coupled to those design decisions, then you'll be in for a reckoning when that day inevitably comes.</P>

      <P>So, what can we do about it?</P>

      <SectionHeading id="reducing-coupling">Reducing coupling</SectionHeading>

      <P>Luckily, there are some tools that you can use when designing a codebase to protect yourself from potential issues of coupling (especially if you can predict those issues ahead of time, as we should have been able to do in this case). Earlier, I said that encapsulation is one such tool. What did I mean by that?</P>

      <P>First, understand that some coupling is inevitable. Your functions, data, and classes exist to interact with each other. At the very least, coupling occurs between all direct <Bold>dependencies</Bold>. A dependency is just a component of code that another component of code depends / relies on. Dependencies are <It>everywhere</It>. Whenever one function A calls another function B, that's a dependency<Emdash/>A depends on B. Whenever a class A defines an attribute of some other class type B, that's a dependency (again, A depends on B). Even within a single function, there are plenty of dependencies. If a line of code prints the value of the variable <Code>x</Code>, then that print statement depends on <Code>x</Code> having previously been defined<Emdash/>that's a dependency between two lines of code. This clearly cannot be avoided.</P>

      <P>Dependencies inevitably introduce coupling because in order to depend on something, you must interact with it. In particular, code components interact with one another through their <Bold>interfaces</Bold>. Definitionally, an interface is simply the part of a code component that other components need to know about in order to interact with it. Take this function, for example:</P>

      <PythonBlock copyable={false}>{
`def foo(a: int, b: int) -> int:
    return a + b * (a - b) ** 2.5`
      }</PythonBlock>

      <P>In order to call the <Code>foo</Code> function (i.e., in order to interact with it), you need to know its name, its parameter list, its return type, the meanings of its parameters and return value, the types of any exceptions it might throw, and so on. All of these things make up the <Code>foo</Code> function's interface. This is in contrast to the <Code>foo</Code> function's <Bold>implementation</Bold>. An implementation is simply the parts of a code component that <It>aren't</It> part of its interface. In the case of a function, the implementation is given by the function body.</P>

      <P>Put another way, an interface describes the <It>what</It> of a code component, sometimes referred to as a <Bold>contract</Bold>: the component's responsibilities, the semantics of its inputs and outputs, and so on. The implementation describes the <It>how</It> of a code component, meaning how it fulfill its contract. Interacting with a component requires understanding the what (interface), but not the how (implementation).</P>

      <P>Because dependencies interact with each other through their interfaces, changing a code component's interface requires changing how other components (specifically its dependents) interact with it. In contrast, changing a component's implementation generally does not require changing how other components interact with it (unless, say, changing the implementation requires changing its interface in turn). Keeping with our example, if I wanted to change the name of <Code>foo</Code> to <Code>bar</Code>, I'd have to change how I reference it in each and every <Code>foo()</Code> function call. Or if I wanted to add a third parameter, I'd also have to add a third argument to each and every <Code>foo()</Code> function call. But if I only wanted to change its <It>body</It><Emdash/>its implementation<Emdash/>I would not need to change how I call it. That's all to say, dependencies inherently interact with each other through their interfaces, which induces coupling against said interfaces. Therefore, dependencies inherently create coupling, and this is all inevitable.</P>

      <P>Although some coupling is inevitable, it isn't inherently evil. It can be problematic in that it makes code harder to change, but consider that not all code <It>needs</It> to be easy to change. If a code component is particularly "stable"<Emdash/>if you're rarely or never going to need to change it<Emdash/>then perhaps it doesn't matter too much if it's hard to change. As I mentioned, many design decisions are fragile and volatile, so <It>not</It> stable. But many other decisions are more fundamental, or definitional, to the project's goals, and therefore much more stable. Perhaps tight, pervasive coupling against such decisions isn't such a big deal.</P>

      <P>Moreover, remember that there are various forms and degrees of coupling. Loose, local coupling is likely to be less problematic than tight, pervasive coupling.</P>

      <P>With these things in mind, encapsulation (and other coupling-mitigating tools) can't eliminate all coupling. That would be impossible. However, encapsulation can help with coupling in more nuanced (but powerful) ways:</P>

      <Enumerate listStyleType="decimal">
        <Item><P>Encapsulation groups related things together (particularly, data and the behavior operating on that data), which keeps much of the relevant coupling contained in one place (i.e., local rather than pervasive). This makes it easier to find all the coupled code that needs to be changed in a given situation. Moreover, since the coupling is isolated / local, it can't sprawl out of control across the entire codebase unnoticed.</P>

        <P>Now, the methods of a class are often "public-facing", meaning they might be called from various places throughout the entire codebase. This might raise concerns of <It>new</It> pervasive coupling. However, a class's methods can often be carefully designed such that their interfaces are fairly stable, mitigating the harm of this coupling. This is a complicated topic, though; I'll show an example shortly.</P></Item>
        <Item><P>Some coupling is "unnecessary", such as when a dependent is replicated many times in violation of the Don't Repeat Yourself (DRY) principle. By isolating related things together in a small, dedicated class, encapsulation makes such unnecessary coupling more apparent, which allows us to eliminate or reduce it.</P></Item>
        <Item><P>Encapsulation can be enforced (strictly, in some programming languages) via <Link href="#private-attributes">private attributes</Link> and <Link href="#private-methods">private methods</Link>, solidifying the above points.</P></Item>
      </Enumerate>

      <P>All the above points are amplified when working in a team on a large project. In such cases, it's uncommon for any single team member to be aware of or understand the entire codebase. This makes it much easier for coupling to sprawl out of control, for DRY violations to ensue, and so on. If the whole team respects each others' encapsulation efforts (which can often be enforced, per point 3 above), then these issues become much less common.</P>

      <P>Let's see how encapsulation can help in our rocketry example. Forget about the accelerometer for now; let's rewind back to when it was just the GPS flight path. As written, the <Code>Rocket</Code> class is trying to do everything<Emdash/>actuate the fins, deploy the parachute, conduct telemetry, <It>and</It> parse sensor data to calculate trajectories. The last part in particular is the issue; these trajectories need to be calculated in many places, so we're facing pervasive coupling. Suppose we instead move the sensor-related behaviors and the sensor data to its own, dedicated, cohesive, encapsulated class:</P>

      <PythonBlock fileName="sensormodule.py">{
`from vector3 import Vector3

class SensorModule:
    # This list of Vector3 objects keeps a record of the rocket's
    # flight path so far, relative to the launch pad, as sourced from
    # the rocket's GPS module. The last element
    # in the list represents the rocket's current location.
    gps_flight_path: list[Vector3]
    
    def __init__(self) -> None:
        # Rocket is initially resting on the launch pad, so initialize
        # gps_flight_path to contain a single Vector3 object with x, y,
        # and z all equal to zero.
        self.gps_flight_path = [Vector3()]

    def query_gps(self) -> None:
        new_position = Vector3()

        # Here, we would somehow retrieve the rocket's current position
        # from the GPS hardware and update the x/y/z coordinates of
        # new_position accordingly. Of course, reading from GPS
        # hardware is beyond the scope of this course, so just use your
        # imagination here.
        # ...

        # Append new position to self.gps_flight_path
        self.gps_flight_path.append(new_position)
`
      }</PythonBlock>

      <P>In the spirit of encapsulation, the <Code>Rocket</Code> class should no longer access the <Code>gps_flight_path</Code> attribute directly. After all, it's no longer an attribute of the <Code>Rocket</Code> class, but rather the <Code>SensorModule</Code> class, so the behaviors (methods) that operate on this attribute should strictly be encapsulated within the <Code>SensorModule</Code> class. However, the <Code>Rocket</Code> class is still responsible for actuating the fins, deploying the parachute, and conducting telemetry, and all these things still require being able to retrieve the rocket's current trajectory (position and velocity) <It>somehow</It>.</P>

      <P>To support such capabilities while still practicing encapsulation, we can introduce a couple new methods in the <Code>SensorModule</Code> class:</P>

      <PythonBlock fileName="sensormodule.py" highlightLines="{29-52}">{
`from vector3 import Vector3

class SensorModule:
    # This list of Vector3 objects keeps a record of the rocket's
    # flight path so far, relative to the launch pad, as sourced from
    # the rocket's GPS module. The last element
    # in the list represents the rocket's current location.
    gps_flight_path: list[Vector3]
    
    def __init__(self) -> None:
        # Rocket is initially resting on the launch pad, so initialize
        # gps_flight_path to contain a single Vector3 object with x, y,
        # and z all equal to zero.
        self.gps_flight_path = [Vector3()]

    def query_gps(self) -> None:
        new_position = Vector3()

        # Here, we would somehow retrieve the rocket's current position
        # from the GPS hardware and update the x/y/z coordinates of
        # new_position accordingly. Of course, reading from GPS
        # hardware is beyond the scope of this course, so just use your
        # imagination here.
        # ...

        # Append new position to self.gps_flight_path
        self.gps_flight_path.append(new_position)

    def get_position(self) -> Vector3:
        # Get rocket's current position
        current_position = \\
            self.gps_flight_path[len(self.gps_flight_path) - 1]

        # Return
        return current_position

    def get_velocity(self) -> Vector3:
        # Get rocket's current position
        current_position = \\
            self.gps_flight_path[len(self.gps_flight_path) - 1]

        # Approximate rocket's current velocity based on difference
        # between last two positions
        previous_position = \\
            self.gps_flight_path[len(self.gps_flight_path) - 2]
        current_velocity = Vector3()
        current_velocity.x = current_position.x - previous_position.x
        current_velocity.y = current_position.y - previous_position.y
        current_velocity.z = current_position.z - previous_position.z

        # Return
        return current_velocity
`
      }</PythonBlock>

      <P>The <Code>Rocket</Code> class can now use these methods to retrieve trajectory data wherever it needs it.</P>

      <P>Let's update our <Code>Rocket</Code> class now. It will no longer have its own <Code>gps_flight_path</Code> attribute. Instead, it will have an attribute of type <Code>SensorModule</Code>, which in turn encapsulates the sensor data and behaviors. Then, whenever a <Code>Rocket</Code> object needs to know its current trajectory, it will rely on the methods of its <Code>SensorModule</Code> attribute to compute it:</P>

      <PythonBlock fileName="rocket.py" highlightLines="{1,4,8,14-20,34-40,55-61}">{
`from sensormodule import SensorModule

class Rocket:
    sensor_module: SensorModule
    deployed_parachute: bool

    def __init__(self) -> None:
        self.sensor_module = SensorModule()

        # Parachute initially undeployed
        self.deployed_parachute = False

    def actuate_fins(self) -> None:
        # Get rocket's current position from the sensor module via
        # its get_position() method
        current_position = self.sensor_module.get_position()
        
        # Get rocket's current velocity from the sensor module via
        # its get_velocity() method
        current_velocity = self.sensor_module.get_velocity()

        # Here, we would somehow use current_position and
        # current_velocity to determine how the fins should be actuated
        # so as to guide the rocket along the target trajectory.
        # That's beyond the scope of this course, so use your
        # imagination here as well.
        # ...

    def deploy_parachute_if_ready(self) -> None:
        if self.deployed_parachute:
            # Parachute has already been deployed. Do nothing.
            return

        # Get rocket's current position from the sensor module via
        # its get_position() method
        current_position = self.sensor_module.get_position()
        
        # Get rocket's current velocity from the sensor module via
        # its get_velocity() method
        current_velocity = self.sensor_module.get_velocity()

        # Let's say the parachute is meant to be deployed at
        # apogee (peak of trajectory). Let's say the y coordinate
        # dimension represents elevation. Then we should deploy the
        # parachute when the y coordinate of current_velocity becomes
        # non-positive (when the rocket is no longer moving upward)
        if current_velocity.y <= 0:
            # Here, we would somehow engage with the hardware to
            # deploy the parachute. Again, use your imagination.
            # ...

            self.deployed_parachute = True

    def log_data(self) -> None:
        # Get rocket's current position from the sensor module via
        # its get_position() method
        current_position = self.sensor_module.get_position()
        
        # Get rocket's current velocity from the sensor module via
        # its get_velocity() method
        current_velocity = self.sensor_module.get_velocity()

        # Here, we would somehow send current_position and
        # current_velocity to the ground receiver for monitoring.
        # Use your imagination.
        # ...
`
      }</PythonBlock>

      <P>Perhaps this doesn't look very different from before, but we've actually already solved most of our coupling problems. Before I prove it, let's make a few more improvements to our design. In the <Code>SensorModule</Code> class, the <Code>get_velocity</Code> method starts out by retrieving the rocket's current position from the end of the GPS flight path. But, unsurprisingly, the code that does that is completely identical to the entire implementation of the <Code>get_position</Code> method. Hence, we can replace that code with a call to the <Code>get_position</Code> method:</P>

      <PythonBlock fileName="sensormodule.py" highlightLines="{39}">{
`from vector3 import Vector3

class SensorModule:
    # This list of Vector3 objects keeps a record of the rocket's
    # flight path so far, relative to the launch pad, as sourced from
    # the rocket's GPS module. The last element
    # in the list represents the rocket's current location.
    gps_flight_path: list[Vector3]
    
    def __init__(self) -> None:
        # Rocket is initially resting on the launch pad, so initialize
        # gps_flight_path to contain a single Vector3 object with x, y,
        # and z all equal to zero.
        self.gps_flight_path = [Vector3()]

    def query_gps(self) -> None:
        new_position = Vector3()

        # Here, we would somehow retrieve the rocket's current position
        # from the GPS hardware and update the x/y/z coordinates of
        # new_position accordingly. Of course, reading from GPS
        # hardware is beyond the scope of this course, so just use your
        # imagination here.
        # ...

        # Append new position to self.gps_flight_path
        self.gps_flight_path.append(new_position)

    def get_position(self) -> Vector3:
        # Get rocket's current position
        current_position = \\
            self.gps_flight_path[len(self.gps_flight_path) - 1]

        # Return
        return current_position

    def get_velocity(self) -> Vector3:
        # Get rocket's current position
        current_position = self.get_position()

        # Approximate rocket's current velocity based on difference
        # between last two positions
        previous_position = \\
            self.gps_flight_path[len(self.gps_flight_path) - 2]
        current_velocity = Vector3()
        current_velocity.x = current_position.x - previous_position.x
        current_velocity.y = current_position.y - previous_position.y
        current_velocity.z = current_position.z - previous_position.z

        # Return
        return current_velocity
`
      }</PythonBlock>

      <P>(Yes, an object's methods can call its other methods. This is very common in complex classes that might need to reuse some logic in some places.)</P>

      <P>This is better because it aligns with the DRY principle, which further reduces coupling: each line of code that directly accesses <Code>self.gps_flight_path</Code> is inherently coupled to it, so by reducing the number of lines that directly access it, we've reduced unnecessary coupling.</P>

      <P>Let's make one more change. As it stands, the <Code>query_gps</Code> method is a bit problematic. Consider: although encapsulation suggests that only the <Code>SensorModule</Code> class's methods should directly access the <Code>gps_flight_path</Code> attribute, encapsulation says nothing about where the <Code>query_gps</Code> method itself might be called from. In other words, <Code>query_gps</Code> exposes a <It>public interface</It> that the entire codebase might interact with. This means that it may be subject to pervasive coupling (perhaps not, but it <It>could</It> be). That'd be fine if its interface were stable, but it isn't<Emdash/>if our team's engineers were to ever modify the rocket and remove its GPS module (e.g., replacing it with an accelerometer and other sensors), then the rocket would no longer be capable of querying said GPS module, in which case we'll probably want to remove the <Code>query_gps</Code> method altogether. This would break any and all <Code>query_gps()</Code> calls throughout the codebase. That's a problem.</P>

      <P>The solution is to redesign our <Code>SensorModule</Code> class to expose more stable interfaces. After all, most pervasive coupling occurs at interfaces, making them hard to change, so we should design our interfaces such that they're unlikely to ever need to be changed.</P>

      <P>Here's a simple idea: rename <Code>query_gps</Code> to <Code>collect_sensor_data</Code>. This is essentially just a philosophical adjustment, but it's powerful. Even if the team removes the GPS module from the rocket, it will still have sensors of <It>some sort</It>, and it will still need to periodically collect data from them. So, if that day comes, we won't need to remove any methods or otherwise break any interfaces; we'll just have to update the <It>implementation</It> of the <Code>collect_sensor_data</Code> method, changing where it sources its data from and how it stores it in the object's attributes.</P>

      <P>Here's that update for reference:</P>

      <PythonBlock fileName="sensormodule.py" highlightLines="{16}">{
`from vector3 import Vector3

class SensorModule:
    # This list of Vector3 objects keeps a record of the rocket's
    # flight path so far, relative to the launch pad, as sourced from
    # the rocket's GPS module. The last element
    # in the list represents the rocket's current location.
    gps_flight_path: list[Vector3]
    
    def __init__(self) -> None:
        # Rocket is initially resting on the launch pad, so initialize
        # gps_flight_path to contain a single Vector3 object with x, y,
        # and z all equal to zero.
        self.gps_flight_path = [Vector3()]

    def collect_sensor_data(self) -> None:
        new_position = Vector3()

        # Here, we would somehow retrieve the rocket's current position
        # from the GPS hardware and update the x/y/z coordinates of
        # new_position accordingly. Of course, reading from GPS
        # hardware is beyond the scope of this course, so just use your
        # imagination here.
        # ...

        # Append new position to self.gps_flight_path
        self.gps_flight_path.append(new_position)

    def get_position(self) -> Vector3:
        # Get rocket's current position
        current_position = \\
            self.gps_flight_path[len(self.gps_flight_path) - 1]

        # Return
        return current_position

    def get_velocity(self) -> Vector3:
        # Get rocket's current position
        current_position = self.get_position()

        # Approximate rocket's current velocity based on difference
        # between last two positions
        previous_position = \\
            self.gps_flight_path[len(self.gps_flight_path) - 2]
        current_velocity = Vector3()
        current_velocity.x = current_position.x - previous_position.x
        current_velocity.y = current_position.y - previous_position.y
        current_velocity.z = current_position.z - previous_position.z

        # Return
        return current_velocity
`
      }</PythonBlock>

      <P>Now, for the moment you've been waiting for. Suppose, as before, we conduct a flight test and find the GPS system to be unreliable at high altitudes, so we decide to replace it with an accelerometer. Under our previous design, this would have been difficult due to coupling. But now, look how easy it is:</P>

      <PythonBlock fileName="sensormodule.py" highlightLines="{10-19,27-30,45-58,61,64}">{
`from vector3 import Vector3

class SensorModule:
    # This list of Vector3 objects keeps a record of the rocket's
    # flight path so far, relative to the launch pad, as sourced from
    # the rocket's GPS module. The last element
    # in the list represents the rocket's current location.
    gps_flight_path: list[Vector3]

    # Rocket's current acceleration as sourced from the
    # accelerometer
    acceleration: Vector3

    # We'll also keep track of a running estimate of the rocket's
    # velocity and position, periodically updating them based on its
    # acceleration at the given point in time (i.e., approximating
    # velocity and position through integration).
    velocity: Vector3
    position: Vector3
    
    def __init__(self) -> None:
        # Rocket is initially resting on the launch pad, so initialize
        # gps_flight_path to contain a single Vector3 object with x, y,
        # and z all equal to zero.
        self.gps_flight_path = [Vector3()]

        # Acceleration, velocity, and position all start as zero-vectors
        self.acceleration = Vector3()
        self.velocity = Vector3()
        self.position = Vector3()

    def collect_sensor_data(self) -> None:
        new_position = Vector3()

        # Here, we would somehow retrieve the rocket's current position
        # from the GPS hardware and update the x/y/z coordinates of
        # new_position accordingly. Of course, reading from GPS
        # hardware is beyond the scope of this course, so just use your
        # imagination here.
        # ...

        # Append new position to self.gps_flight_path
        self.gps_flight_path.append(new_position)

        # Here, we would somehow query the rocket's current
        # acceleration from the accelerometer and update
        # self.acceleration accordingly
        # Use your imagination.
        # ...

        # Now, update velocity and position accordingly (note: this is
        # an oversimplification)
        self.velocity.x += self.acceleration.x
        self.velocity.y += self.acceleration.y
        self.velocity.z += self.acceleration.z
        self.position.x += self.velocity.x
        self.position.y += self.velocity.y
        self.position.z += self.velocity.z

    def get_position(self) -> Vector3:
        return self.position

    def get_velocity(self) -> Vector3:
        return self.velocity
`
      }</PythonBlock>

      <P>Notice: The <Code>Rocket</Code> class doesn't need to be updated whatsoever. In fact, the only code that needs to be updated is what's inside the <Code>SensorModule</Code> class. Indeed, this is the entire point of encapsulation. Because the representation of our trajectory data<Emdash/><Code>gps_flight_path</Code><Emdash/>is properly encapsulated within the <Code>SensorModule</Code> class, the only code that operates on it is <It>also</It> encapsulated within the <Code>SensorModule</Code> class. Hence, changing this representation does not directly require any changes outside this class. Moreover, this is a small class that's dedicated to the single responsibility of parsing the rocket's sensor data. It's <It>not</It> responsible for the all the other things that rockets do<Emdash/>actuating the fins, deploying the parachute, conducting telemetry, and so on. So long as we keep it like that, the coupling isolated within the <Code>SensorModule</Code> class will remain manageable.</P>

      <P>If we wanted to, we could even remove <Code>gps_flight_path</Code> altogether (e.g., if the team decided to remove the rocket's GPS module entirely), and we <It>still</It> wouldn't need to touch any code outside the <Code>SensorModule</Code> class.</P>

      <P>That said, encapsulation does not inherently solve everything. In fact, in order to gain much of anything out of encapsulation, you must think very carefully about your class design. Our <Code>SensorModule</Code> class exposes an interface consisting of four methods: a constructor, <Code>collect_sensor_data</Code>, <Code>get_position</Code>, and <Code>get_velocity</Code>. If we were to ever modify the rocket's design so drastically that these methods' <It>interfaces</It> would need to change, rather than just their <It>implementations</It> as above, then other code outside the <Code>SensorModule</Code> class (e.g., calls to these methods) could break as well. This is precisely why we renamed <Code>query_gps</Code> to <Code>collect_sensor_data</Code> earlier; the latter provides a more stable interface. But no interface is <It>perfectly</It> stable. Every now and then, your project requirements may change drastically, and you'll simply have no choice but to change an interface or two, potentially breaking code elsewhere.</P>

      <P>(The better you are at predicting future project requirements, the more stable you can make your interfaces. But nobody can perfectly predict the future, and there's also <Link href="https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it">a legitimate cost</Link> to overengineering your codebase early just for the sake of <It>possibly</It> saving some maintenance effort in the future.)</P>

      <P>Moreover, reducing coupling doesn't inherently require encapsulation. Indeed, many of the changes that we made could have been done without encapsulation at all. For example, one of the biggest things we did to mitigate coupling was practice the DRY principle by moving the trajectory computations into their own dedicated methods, <Code>get_position()</Code> and <Code>get_velocity()</Code>, rather than replicating those computations everywhere. Encapsulation wasn't strictly necessary for that change. We could have very well introduced these trajectory computation methods directly in the <Code>Rocket</Code> class. Heck, we could've made them global functions (not inside any class at all), perhaps even in a completely different Python module. That still would have addressed many of the coupling issues.</P>

      <P>There are also still some places in our codebase where we aren't practicing encapsulation, and maybe that's okay. For example, the <Code>Vector3</Code> class doesn't encapsulate any methods that operate on x/y/z coordinates. Instead, we treat <Code>Vector3</Code> as a POD type / passive data structure, operating on its x/y/z attributes directly from various places throughout the codebase. That isn't encapsulation, but it's probably fine. A <Code>Vector3</Code> object, by its very definition, will <It>always</It> have three coordinates, and there probably aren't many good reasons to ever change their representations. Since these attributes' representations are unlikely to ever change, maybe it's okay for the rest of the codebase to be tightly coupled to them.</P>

      <P>However, practicing encapsulation when appropriate does tend to naturally <It>encourage</It> decoupling. For example, if you ever need a function that's capable of computing the current position of the rocket, the first place you'd look is the <Code>SensorModule</Code> class, and you'd quickly find the <Code>get_position</Code> method. After all, in the spirit of encapsulation, that's probably where it should be<Emdash/>co-located with the sensor data that it operates on. Even if you're not the one who wrote it, you should still be able to find it. In contrast, if you and your team <It>don't</It> practice encapsulation, then you'd have no idea where to look for such a function. And if you fail to find it, then you'll probably end up rewriting it, even if it already exists elsewhere, increasing coupling. Or, worse, you might opt to not write a dedicated function for it <It>at all</It>, instead choosing to hardcode its implementation wherever you need it, which just encourages it to be rewritten again and again. Your teammates might do the same. That's precisely how coupling sprawls out of control.</P>

      <P>Similarly, proper encapsulation organizes the most tightly coupled components together. Whenever you change how the rocket's sensor data is represented, that can easily break any and all code coupled to the existing representation. But if that code is all co-located with the representation (attributes) itself, then it's easy to locate. This is especially important when the breaking change results in subtle logic errors that aren't easily detected by static analysis tools.</P>

      <SectionHeading id="private-attributes">Private attributes</SectionHeading>

      <P>For this section, let's again forget about the accelerometer and rewind back to when the <Code>SensorModule</Code> class only had a <Code>gps_flight_path</Code> attribute:</P>

      <PythonBlock fileName="sensormodule.py">{
`from vector3 import Vector3

class SensorModule:
    # This list of Vector3 objects keeps a record of the rocket's
    # flight path so far, relative to the launch pad, as sourced from
    # the rocket's GPS module. The last element
    # in the list represents the rocket's current location.
    gps_flight_path: list[Vector3]
    
    def __init__(self) -> None:
        # Rocket is initially resting on the launch pad, so initialize
        # gps_flight_path to contain a single Vector3 object with x, y,
        # and z all equal to zero.
        self.gps_flight_path = [Vector3()]

    def collect_sensor_data(self) -> None:
        new_position = Vector3()

        # Here, we would somehow retrieve the rocket's current position
        # from the GPS hardware and update the x/y/z coordinates of
        # new_position accordingly. Of course, reading from GPS
        # hardware is beyond the scope of this course, so just use your
        # imagination here.
        # ...

        # Append new position to self.gps_flight_path
        self.gps_flight_path.append(new_position)

    def get_position(self) -> Vector3:
        # Get rocket's current position
        current_position = \\
            self.gps_flight_path[len(self.gps_flight_path) - 1]

        # Return
        return current_position

    def get_velocity(self) -> Vector3:
        # Get rocket's current position
        current_position = self.get_position()

        # Approximate rocket's current velocity based on difference
        # between last two positions
        previous_position = \\
            self.gps_flight_path[len(self.gps_flight_path) - 2]
        current_velocity = Vector3()
        current_velocity.x = current_position.x - previous_position.x
        current_velocity.y = current_position.y - previous_position.y
        current_velocity.z = current_position.z - previous_position.z

        # Return
        return current_velocity
`
      }</PythonBlock>

      <P>Now, encapsulation can be helpful toward managing coupling, but what's to stop us (or perhaps our naive coworker, or the newly hired intern) from breaking it? For example, expressions in the <Code>Rocket</Code> class such as <Code>self.sensor_module.gps_flight_path[len(self.sensor_module.gps_flight_path) - 1]</Code> would violate the <Code>SensorModule</Code> class's encapsulation and reintroduce coupling to its representation of trajectories. If such problematic expressions are sprawled throughout the entire codebase, then the representation of trajectories will suffer from tight, pervasive coupling, making it hard to change that representation should we ever need to (e.g., to transition from GPS-based trajectories to accelerometer-based trajectories). Indeed, creating modular methods like <Code>get_position</Code> and <Code>get_velocity</Code> within the <Code>SensorModule</Code> class does not inherently prevent pervasive coupling if we or our teammates choose to subvert these methods and access the underlying attributes directly.</P>

      <P>That's to say, <Code>self.sensor_module.get_position()</Code> serves as an <It>alternative</It> to <Code>self.sensor_module.gps_flight_path[len(self.sensor_module.gps_flight_path) - 1]</Code>, and it provides a more stable interface to protect against coupling. But how do we <It>force</It> ourselves (or our coworker, or the intern) to use this nice alternative? That is, how do we <It>enforce</It> encapsulation?</P>

      <P>Enter <Bold>private attributes</Bold>. A private attribute is an attribute of a class that may only be accessed by methods of that very same class. The alternative to a private attribute is a public attribute, which is an attribute that may be accessed from anywhere in the codebase.</P>

      <P>For example, if the <Code>gps_flight_path</Code> attribute was a private attribute of the <Code>SensorModule</Code> class (rather than a public attribute, as it is now), then it would only be accessible from within the few, isolated methods of the <Code>SensorModule</Code> class itself. Hence, there would be no risk of expressions such as <Code>self.sensor_module.gps_flight_path[len(self.sensor_module.gps_flight_path) - 1]</Code> being sprawled across our entire codebase (e.g., in the <Code>Rocket</Code> class), breaking the encapsulation. That's to say, private attributes represent data (attributes) that can <It>only</It> be operated on by co-located behaviors (methods of the same class), thereby enforcing encapsulation.</P>

      <P>In Python, a private attribute is simply an attribute whose name starts with an underscore (<Code>_</Code>). Let's update the <Code>SensorModule</Code> class, making the <Code>gps_flight_path</Code> attribute private by renaming it to <Code>_gps_flight_path</Code>:</P>

      <PythonBlock fileName="sensormodule.py">{
`from vector3 import Vector3

class SensorModule:
    # This list of Vector3 objects keeps a record of the rocket's
    # flight path so far, relative to the launch pad, as sourced from
    # the rocket's GPS module. The last element
    # in the list represents the rocket's current location.
    _gps_flight_path: list[Vector3]
    
    def __init__(self) -> None:
        # Rocket is initially resting on the launch pad, so initialize
        # _gps_flight_path to contain a single Vector3 object with x, y,
        # and z all equal to zero.
        self._gps_flight_path = [Vector3()]

    def collect_sensor_data(self) -> None:
        new_position = Vector3()

        # Here, we would somehow retrieve the rocket's current position
        # from the GPS hardware and update the x/y/z coordinates of
        # new_position accordingly. Of course, reading from GPS
        # hardware is beyond the scope of this course, so just use your
        # imagination here.
        # ...

        # Append new position to self._gps_flight_path
        self._gps_flight_path.append(new_position)

    def get_position(self) -> Vector3:
        # Get rocket's current position
        current_position = \\
            self._gps_flight_path[len(self._gps_flight_path) - 1]

        # Return
        return current_position

    def get_velocity(self) -> Vector3:
        # Get rocket's current position
        current_position = self.get_position()

        # Approximate rocket's current velocity based on difference
        # between last two positions
        previous_position = \\
            self._gps_flight_path[len(self._gps_flight_path) - 2]
        current_velocity = Vector3()
        current_velocity.x = current_position.x - previous_position.x
        current_velocity.y = current_position.y - previous_position.y
        current_velocity.z = current_position.z - previous_position.z

        # Return
        return current_velocity
`
      }</PythonBlock>

      <P>Now, I've sort of just lied to you. In Python, there's technically no such thing as a "private attribute". However, it is well understood by the Python community, and indeed stated as guidance by the official style guide for Python code (PEP 8), that all attributes whose names start with an underscore are <It>meant</It> to be treated as private attributes and therefore <Ul>should not</Ul> be accessed from anywhere other than within a method of the class that defines it (unless you're keen on getting into trouble). For example:</P>

      <PythonBlock fileName="rocket.py" highlightLines="{13-26}" showLineNumbers={false}>{
`from sensormodule import SensorModule

class Rocket:
    sensor_module: SensorModule
    deployed_parachute: bool

    # ... Some code omitted for brevity

    def actuate_fins(self) -> None:
        # Get rocket's current position from the sensor module via
        # its position() method
        
        # This is fine, and it's what you should do. It respects the
        # encapsulation of the SensorModule class's _gps_flight_path
        # attribute.
        current_position = self.sensor_module.get_position()

        # This, on the other hand, is technically legal but extremely
        # ill-advised. _gps_flight_path is private to the SensorModule
        # class, meaning it should only ever be directly accessed from
        # within methods of the SensorModule class. This is a method of
        # the Rocket class; we [technically can but] should not be
        # accessing it here.
        # current_position = self.sensor_module._gps_flight_path[
        #     len(self.sensor_module._gps_flight_path) - 1
        # ]
        
        # ... Some code omitted for brevity
`
      }</PythonBlock>

      <P>Heed the comments: you should generally avoid accessing private attributes (attributes whose names start with an underscore) from anywhere other than within a method of the class that defines those attributes. And if you go against this advice and access those attributes anyway, understand that this couples your code to those attributes' representations, and should those representations ever change, your code will break. This is especially important when interacting with code that is not your own (e.g., code from a library, or code written by a coworker). If an attribute is private, then the person who wrote that attribute does not intend for you to access it directly. If you do, and then they change the attribute's representation, breaking your code in the process, that's <It>your</It> fault<Emdash/>not <It>theirs</It> (it also opens you up to accidentally breaking <Link href="#class-invariants">class invariants</Link>, which would also be your fault). That's to say, ignore this advice at your own peril.</P>

      <P>In many other object-oriented programming languages (and programming languages that support encapsulation by other means), access to private class attributes is strictly protected. Indeed, in C++, Java, C#, and countless other examples, attempting to access a private class attribute from anywhere other than within a method of the class defining said attribute is considered to be a syntax error. But Python's philosophy with regards to encapsulation is a bit less strict (a common expression in the Python community is <Link href="https://mail.python.org/pipermail/tutor/2003-October/025932.html">"we're all consenting adults here"</Link>, meaning that you can access private attributes if you so choose, but you should know what you're getting yourself into).</P>

      <P>(In case you're curious, there are upsides to Python's leniency. For one, it makes it easier to employ various powerful metaprogramming techniques like <Link href="https://en.wikipedia.org/wiki/Reflective_programming">reflection</Link>, <Link href="https://en.wikipedia.org/wiki/Type_introspection">introspection</Link>, and <Link href="https://en.wikipedia.org/wiki/Monkey_patch">monkey patching</Link>. For two, it makes it possible to extract more capability out of someone else's code without rewriting it<Emdash/>even if it doesn't quite do what you need it to do, and even if its classes try to hide their information thoroughly, you can still reach inside the objects instantiated from those classes and manipulate their private attributes at will, effectively "hacking" them into doing whatever you'd like.)</P>

      <SectionHeading id="private-methods">Private methods</SectionHeading>

      <P>Just as a leading underscore in an attribute name indicates that it it's a private attribute, the same goes for methods: a method whose name starts with an underscore is meant to be treated as a <Bold>private method</Bold>. The rules for private methods are the same as those for private attributes: they should not be accessed from anywhere other than within <It>other methods</It> of the very same class. "Accessed", in this case, mostly means "called".</P>

      <P>Private methods allow you to create reusable class methods without exposing them as part of the class's public interface. This is common in so-called "helper methods", which primarily exist to modularize some internal logic and assist the class's other methods. Helper methods tend to have unstable / volatile interfaces and would therefore benefit from being hidden from the external codebase to prevent tight, pervasive coupling from making them hard to change. (Moreover, using helper methods incorrectly may violate <Link href="#class-invariants">class invariants</Link>, so making them private is necessary to preserve those invariants).</P>

      <P>As an example, we might choose to reintroduce our <Code>query_gps</Code> method, but make it private (i.e., <Code>_query_gps</Code>) and call it in turn from <It>within</It> <Code>collect_sensor_data</Code>:</P>

      <PythonBlock fileName="sensormodule.py" highlightLines="{16-41}">{
`from vector3 import Vector3

class SensorModule:
    # This list of Vector3 objects keeps a record of the rocket's
    # flight path so far, relative to the launch pad, as sourced from
    # the rocket's GPS module. The last element
    # in the list represents the rocket's current location.
    _gps_flight_path: list[Vector3]
    
    def __init__(self) -> None:
        # Rocket is initially resting on the launch pad, so initialize
        # _gps_flight_path to contain a single Vector3 object with x, y,
        # and z all equal to zero.
        self._gps_flight_path = [Vector3()]

    # Helper method. Called by collect_sensor_data. Modularizes the GPS
    # querying. Should NOT be called from anywhere other than within
    # other methods of this class.
    def _query_gps(self) -> None:
        new_position = Vector3()

        # Here, we would somehow retrieve the rocket's current position
        # from the GPS hardware and update the x/y/z coordinates of
        # new_position accordingly. Of course, reading from GPS
        # hardware is beyond the scope of this course, so just use your
        # imagination here.
        # ...

        # Append new position to self._gps_flight_path
        self._gps_flight_path.append(new_position)

    # Public-facing. Can be called from anywhere in the codebase (e.g.,
    # in the Rocket class)
    def collect_sensor_data(self) -> None:
        self._query_gps()

        # Consider: If the sensor module had many other sensors (e.g.,
        # accelerometers, gyroscopes, etc), we could call other helper
        # methods for each of them here. This provides nice internal
        # code organization / modularization across helper methods while
        # keeping those methods out of the class's public interface.

    def get_position(self) -> Vector3:
        # Get rocket's current position
        current_position = \\
            self._gps_flight_path[len(self._gps_flight_path) - 1]

        # Return
        return current_position

    def get_velocity(self) -> Vector3:
        # Get rocket's current position
        current_position = self.get_position()

        # Approximate rocket's current velocity based on difference
        # between last two positions
        previous_position = \\
            self._gps_flight_path[len(self._gps_flight_path) - 2]
        current_velocity = Vector3()
        current_velocity.x = current_position.x - previous_position.x
        current_velocity.y = current_position.y - previous_position.y
        current_velocity.z = current_position.z - previous_position.z

        # Return
        return current_velocity
`
      }</PythonBlock>

      <P>Because <Code>_query_gps</Code> is private (starts with an underscore), it should not be called from anywhere other than within <It>another</It> method of the <Code>SensorModule</Code> class, such as <Code>collect_sensor_data</Code>. However, it's still perfectly okay to call <Code>collect_sensor_data</Code> from within the <Code>Rocket</Code> class, as we do.</P>

      <P>Private methods enforce encapsulation, just as private attributes do. Because private methods can't (or at least shouldn't) be accessed from outside the class, it's easy to change their interfaces (e.g., their names, parameter types, return types, etc) or even remove them altogether while being confident that such changes will not break anything outside the class. For example, if the team chooses to remove the GPS hardware module altogether after introducing the accelerometer, we could easily remove the <Code>_query_gps</Code> method; we'd simply have to remove all references (e.g., calls) to it within the <Code>SensorModule</Code> class. In this case, there's only one such reference.</P>

      <P>Important: In this course, you should never access a private attribute or method of a class from anywhere other than within a method of the very same class. Even though Python and even Mypy technically allow it, it's ill-advised, and doing so may result in a grade penalty.</P>

      <SectionHeading id="class-invariants">Class invariants</SectionHeading>

      <P>Besides mitigating coupling, encapsulation, supported by private attributes and methods, helps with something else as well: it allows us to establish <Bold>class invariants</Bold>. To be invariant means to not change. A class invariant, then, is a property of a class<Emdash/>or rather, of an object<Emdash/>that never changes.</P>

      <P>Consider a simple video game. The player might have a certain amount of hitpoints (HP; e.g., when it drops to zero, the player loses). Perhaps the player's HP can go up and down<Emdash/>up when they acquire a healing item, and down when they're attacked by an enemy. But one property should remain constant: the player's HP may never exceed some maximum value. For example, perhaps they begin the game with 10 HP, and it can never exceed that starting value. Or maybe there are opportunities for the player's max HP to be increased (e.g., by leveling up), but their HP should still not exceed their max HP at any give point in time.</P>

      <P>To implement such a system, you'd surely need two separate variables: one to store the player's current HP, and one to store their max HP. But how do you prevent the value of the HP variable from <It>ever</It> exceeding value of the max HP variable? Well, you have to be very careful: whenever you increase the player's HP, make sure to clip it down to the max if it would otherwise exceed that max. Fine, but if the player's HP variable is accessible from everywhere in the entire codebase, you<Emdash/>or your coworker, or the intern<Emdash/>are likely to mess up at some point. Eventually, <It>someone, somewhere</It> will write a line of code that says (for example) <Code>player.hp += 1</Code>, forgetting to clip it down to <Code>player.max_hp</Code> after the fact.</P>

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

      <P>I'd be remiss if I didn't mention and extremely common "trick" when working with encapsulation and private attributes: <Bold>getters</Bold> and <Bold>setters</Bold>. A getter is simply a method that returns ("gets") a value stored within the attributes of an object. A setter is simply a method that allows you to modify ("sets") values stored within the attributes of an object. In many cases, getters start with the prefix <Code>get_</Code>, and setters start with the prefix <Code>set_</Code>. But this is by no means a requirement.</P>

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

      <P>In general, getters often accept no arguments and return something contained within the object, whereas setters often accept an argument and store it within the object, returning nothing. But this is not a hard and fast rule; in more complicated cases, getters might accept arguments (e.g., search keys / indices), and setters might return values (e.g., references or indices for efficient subsequent retrieval).</P>

      <P>Now, the <Code>_radius</Code> attribute is private to the <Code>Circle</Code> class, meaning that we're not supposed to directly access it from anywhere other than within methods of the <Code>Circle</Code> class itself. But what if we <It>want</It> to be able to access it in such places, perhaps for arbitrary / flexible use cases? Then we can use the <Code>Circle</Code> class's getters and setters (they're public methods<Emdash/>not private ones<Emdash/>so we can call them from anywhere):</P>

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

      <P>However, making an attribute private and accessing it via getters and setters isn't <It>quite</It> the same thing as making it public. Firstly, getters and setters provide <It>some</It> limited protection against coupling. For example, suppose that, one day, I decide that I want to modify the <Code>Circle</Code> class, replacing its <Code>_radius</Code> attribute with a <Code>_diameter</Code> attribute. This seems like an innocuous change, but once again, this will break every line of code in the codebase that directly accesses the <Code>_radius</Code> attribute. If the <Code>_radius</Code> attribute were public and accessed from all over the place, that could break hundreds or thousands of lines of code. But in this case, it just breaks three lines of code: one in each of the three <Code>Circle</Code> class methods. And we can fix those lines of code easily:</P>

      <PythonBlock fileName="circle.py" highlightLines="{5,9,13}">{
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

      <P>Indeed, although the <Code>Circle</Code> class no longer has an attribute to store its radius, that's not to say that a circle's radius can't be <It>computed</It> from its other attributes, or that its other attributes can't be <It>computed</It> from a given radius (in this case, its <Code>_diameter</Code> attribute can be converted to or from a radius value). Hence, the <Code>get_radius</Code> and <Code>set_radius</Code> methods can be kept around, and we didn't even need to change their public interfaces (their names, parameter lists, return types, etc); we just needed to update their internal implementations. Since coupling mostly occurs at interfaces rather than implementations, this is easy.</P>

      <P>In this small example, this means that <Code>main.py</Code> doesn't need to be updated whatsoever. It still works exactly as written before. That may seem like a small deal. But in a much larger program, it's a huge deal<Emdash/>only needing to make changes to the <Code>Circle</Code> class, and being able to leave the entire rest of our codebase intact, is hugely beneficial for maintainability.</P>

      <P>This is proof that using private attributes and accessing them via getters and setters can be better than using public attributes when it comes to coupling. However, again, getters and setters <It>do</It> still reduce the benefits of encapsulation because, in general, they provide <It>nearly</It> the same kind of unrestricted access as simply making the attributes public. This can, in some cases, open up the attribute to indirect, loose but pervasive coupling with the rest of the codebase. We didn't run into any issues in the above example, but there's a simple reason for that: when we changed the getters and setters, we only changed their implementations<Emdash/>not their interfaces.</P>

      <P>It's not too hard to construct alternative examples where getters and setters can cause major problems. As a simple one, suppose that you want to remove an attribute from a class altogether, perhaps because you've decided that you no longer need to store its information anywhere. In such a case, if you have a getter for the attribute, then the getter cannot simply be reimplemented<Emdash/>it'd have to be removed entirely, which clearly constitutes an interface change (information cannot be retrieved, or "gotten", if it does not exist). But removing the getter would break all lines of code that call it, and since getters are (typically) public methods, they might be called from hundreds or thousands of places sprawled throughout the codebase. Indeed, this is a kind of coupling issue that can be caused by getters (setters are often even worse).</P>

      <P>But it's not just about coupling. If implemented carefully, getters and setters can preserve class invariants. Public attributes cannot. For example:</P>

      <PythonBlock fileName="circle.py" highlightLines="{5-6,16-17}">{
`class Circle:
    _diameter: float
    
    def __init__(self, radius: float) -> None:
        if radius <= 0:
            raise ValueError('Circle\\'s radius must be positive')

        self._diameter = radius * 2 # Diameter = 2 * specified radius

    # Getter for the radius
    def get_radius(self) -> float:
        return self._diameter / 2 # Radius = diameter / 2

    # Setter for the radius
    def set_radius(self, value: float) -> None:
        if value <= 0:
            raise ValueError('Circle\\'s radius must be positive')

        self._diameter = value * 2 # Diameter = 2 * specified radius
`
      }</PythonBlock>

      <P>Now there's no risk of having a <Code>Circle</Code> object with a non-positive radius. If <Code>_radius</Code> were public, it'd be impossible to preserve such invariants.</P>

      <P>Still, getters and setters are somewhat controversial. Some people say to avoid them when possible due to their coupling issues. The primary alternative is to carefully consider all of the things that you might want to do with a set of attributes, and design narrow, dedicated methods that do <It>just</It> those things, and nothing more. For example, instead of <Code>print(my_dog.get_name())</Code>, you might opt for <Code>my_dog.print()</Code>, which in turn executes <Code>print(self._name)</Code>. Narrow, dedicated methods can often be carefully designed such that their interfaces are fairly stable, perhaps more so than a getter's or setter's would be.</P>

      <P>Regardless, getters and setters can be useful tools. You shouldn't treat them as if they're inherently evil nor inherently good. Don't avoid them at all costs, but don't use them reflexively. Use them <It>when appropriate</It>, like all tools.</P>

      <P>What does "appropriate" mean? Well, that's highly subjective, but perhaps you can think of getters and setters as a middle ground between full, pure encapsulation (e.g., dedicated methods that only support a few narrow operations) versus zero encapsulation (e.g., POD types with public attributes). They offer <It>some</It> limited protection against coupling and can possibly preserve class invariants while simultaneously keeping the class's interface highly flexible / supporting many use cases. So, if that's what you need<Emdash/>a highly flexible interface with some support for invariants and decoupling<Emdash/>then perhaps getters and setters make sense. For example, if you're, say, building a modding / plugin engine for a video game, its entire goal is to expose the game state in a way that allows various mods / plugins to inspect and mutate the game state in nearly arbitrary ways without breaking things. This might call for some getters and setters (or something similar) to provide such a flexible interface while still preserving some class invariants.</P>

      <P>But perhaps most importantly, before introducing a getter or setter, you should ask yourself whether its interface is likely to ever need to change. Getters and setters are often used all over the codebase, so their interfaces are <It>particularly</It> difficult to change. If you think the getter's / setter's interface would be unstable / volatile, then perhaps you should opt out and lean more heavily into encapsulation instead.</P>

      <P>There's a lot more to discuss around getters and setters, but it's beyond the scope of this course. If you're curious, I have tons of thoughts on the matter, and I'd be thrilled to have a conversation with you in my office hours. And if you like to research on your own, I recommend starting with: 1) the difference between interface and implementation; 2) "Tell Dont Ask" (e.g., see <Link href="https://martinfowler.com/bliki/TellDontAsk.html">Martin Fowler's article</Link>, which I'm partial to); and 3) <Link href="https://en.wikipedia.org/wiki/SOLID">SOLID</Link>.</P>
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
