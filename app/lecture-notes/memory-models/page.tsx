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
      <P>Disclaimer: This lecture is theory-heavy. There will be almost no code whatsoever.</P>

      <P>Here's the outline for this lecture:</P>

      <Itemize>
        <Item><Link href="#memory">Memory</Link></Item>
        <Item><Link href="#stack">The stack</Link></Item>
        <Item><Link href="#heap">The heap</Link></Item>
        <Item><Link href="#pythons-memory-model">Python's memory model</Link></Item>
      </Itemize>

      <SectionHeading id="memory">Memory</SectionHeading>

      <P>As a program executes, it needs to store data for various reasons. For one, objects have values, and those values need to be stored somewhere. If I write <Code>print(1 + 2)</Code>, I'm telling the computer to calculate the sum of two integers (objects) and then print the result (also an object). In order for it to add up those two integers, they must first be stored somewhere, even if just temporarily, so that the computer can refer back to them as it computes the sum. And in order to pass the result to the <Code>print()</Code> function, it, too, must be stored somewhere (again, even if just temporarily, so that the computer can refer back to it as it converts it to text to be streamed to standard output). Second, variables are references to objects. Your computer needs to remember which objects are associated with which references, and that, too, requires storing some data somewhere.</P>

      <P>In the cases that I just described, the data in question is typically stored in the computer's <Bold>volatile memory</Bold>. <Bold>Memory</Bold> loosely refers to a place in which a computer can store data for quick and repeated access by one or more processes (running programs) during their execution. <Bold>Volatile memory</Bold> is specifically memory that does not persist upon reboot (i.e., if you turn a computer off and back on, most or all of its volatile memory is reset). Most memory is volatile.</P>

      <P>(There also exists <Bold>persistent storage</Bold>, which refers to a place in which your computer can store data that <It>does</It> persist on reboot. A simple example is disk storage (e.g., a hard drive / solid state drive), where files are typically stored. But this lecture isn't about persistent storage.)</P>

      <P>There are various kinds of memory. The most common, general-purpose kind of memory is <Bold>random access memory (RAM)</Bold>. Random access refers to the ability to quickly and easily access data from within the memory based on its position. Indeed, all data in RAM has a position, and if you (the computer) know the position of the data, you (the computer) can access it very quickly (e.g., a piece of data near the "end" of RAM can be accessed by the computer just as quickly as a piece of data near the "beginning" of RAM<Emdash/>that's random access).</P>

      <P>The "position" of a piece of data within the computer's RAM is referred to as its <Bold>memory address</Bold> (yes, you've heard this term before). Actually, every single byte in RAM has a dedicated memory adddress. A memory address is in fact just a single (often large) integer that represents a given byte's location in RAM<Emdash/>the first byte has memory address 0, the second byte has memory address 1, and so on. In other words, RAM is "linear"<Emdash/>all bytes in RAM are arranged in a "line" (there are other nonlinear forms of memory, such as content-addressable memory, but that's beyond the scope of this course).</P>

      <P>In essence, you can think of RAM as a massive array of bytes. Each byte has a memory address, just as each element in an array has an index. Arrays, too, are random-access data structures (your computer can access the millionth element in an array just as quickly as it can access the first element).</P>

      <P>So that's how a process's volatile data is stored within your computer, but bigger questions remain: 1) how does a program <It>arrange</It> data within RAM, and 2) how does a program decide when to allocate (create / dedicate) and free (delete / release) memory during its execution?</P>

      <P>These are surprisingly complicated questions. As it turns out, there are a couple different strategies, referred to as <Bold>memory models</Bold>, that a program might use to tackle these problems. The two most common memory models used by various programming languages are "<Bold>the stack</Bold>" and "<Bold>the heap</Bold>".</P>

      <SectionHeading id="stack">The stack</SectionHeading>

      <P><Bold>The stack</Bold> refers to a place in memory (usually RAM) where data is stored, allocated, and freed in an extremely structured manner. Specifically, new data may be added to the stack (i.e., memory allocated), and existing data may be removed from the stack (i.e., memory freed), but only ever from one "end" of it. Spcifically, memory is allocated and freed from the <Bold>top</Bold> of the stack.</P>

      <P>You can imagine the stack like a stack of plates. If you want to add a new plate to the stack, you can do that, but you have to put it on top. And you can remove a plate from the stack, but you have to remove it from the top. If you want to insert a plate into the middle of the stack, you first have to remove a bunch of plates from the top, then put the plate in question on top of the remaining (smaller) stack, then take the plates that you previously removed and put them back on top. Indeed, all allocation and freeing operations on the stack must happen at the top.</P>
      
      <P>The stack is said to be a <Bold>last-in-first-out (LIFO)</Bold> structure. This means that whatever is added to the stack last will be the first to be removed. Indeed, whatever plate is on top of the stack is always the last plate that was added, and when you start removing plates from the stack, it'll be the first to be removed.</P>

      <P>To be clear, you can <It>modify</It> data that's located in the middle of the stack. But you can't add new data (allocate memory) nor delete existing data (free memory) from the middle of the stack. This also means that modifications to data in the middle of the stack cannot change that data's <It>size</It> (because resizing data requires allocating new bytes of memory to it or freeing existing bytes of memory from it, and all allocations and frees must happen at the top of the stack).</P>

      <P>Perhaps that's a bit abstract. Here's a more concrete example. Suppose you store a list on the stack (not necessarily in Python<Emdash/>Python technically never stores lists on the stack). At first, you'll put it on top of the stack. But suppose you then then create some new data (e.g., new objects / new lists) and put them on the stack as well. They'll have to go on top of the list because all allocations on the stack happen at the top. The list is no longer at the top of the stack<Emdash/>it's wedged in between some other data. You can modify the elements within the list just fine, but you cannot resize the list<Emdash/>you can't add new elements to it nor remove elements from it. And perhaps this example makes it clear why that's the case: if the list is wedged in between a bunch of other data, it cannot be resized without moving all that other data to accommodate (and doing so would often break existing references to that data, which can lead to very big problems).</P>

      <P>This all might seem extremely restrictive, but it actually works just fine for a <It>lot</It> of data stored during the execution of a program. Think about it: most of the memory allocated for a program doesn't need to be resized. Sure, lists might need to be resized so as to fit new elements or remove existing elements. But what about all the objects in a program that <It>aren't</It> lists? What about the individual integers, booleans, <Code>Dog</Code> objects, <Code>Person</Code> objects, immutable collections (e.g., string objects, as in many programming languages), and so on? None of them ever need to be resized (an integer value may be overwritten with a larger value, but most programming languages just allocate a fixed number of bytes for each integer up front; if a small value is stored in the integer object, then many of the bits and bytes will simply be zero<Emdash/>but they're still pre-allocated).</P>

      <P>But the inability to resize data is not the only restriction of the stack. Another major restriction is the order in which memory must be freed: memory can only be freed from the top of the stack, so only the <It>most recently allocated</It> memory can be freed (again, it's a LIFO structure).</P>

      <P>Still, that's not an issue for a <It>lot</It> of data stored during the execution of a program. Again, think about it: even in Python (a language with an aggressively dynamic memory model), every function call has its own scope, meaning that the variables created within that function call are only accessible within the function's body during the duration of the function call's execution. This means that when a function call ends, all the variables that were created by it will no longer be accessible, so they're no longer needed. To be clear, the objects that those variables <It>refer</It> to may continue to exist and be accessed elsewhere (e.g., if they're returned, then they may be accessed at the call site), but the variables themselves<Emdash/>the <It>references</It> to those objects<Emdash/>are no longer necessary the moment the function call ends. This means that all variables (named references to objects) in Python can be freed at the end of the function call in which they were created.</P>

      <P>Now consider that function calls inherently start and end in a LIFO order: whenever a function is called, the function that called it is "paused" until the called function terminates. That is, if function A calls function B, then A will "pause" until B terminates. This implies that the first function to start<Emdash/>A<Emdash/>is also the last function to end, and the last function to start<Emdash/>B<Emdash/>is also the first function to end (hence, LIFO).</P>

      <P>If variables (named references) are associated with function calls, and function calls start and end in LIFO order, then it makes perfect sense that variables could be allocated and freed in LIFO order.</P>

      <P>(Again, the objects that those variables refer to might not be able to be freed in LIFO order, but the variables<Emdash/>the references themselves<Emdash/>often can be).</P>

      <P>So that explains why some data <It>can</It> be stored on the stack, but why <It>should</It> it be stored on the stack? Well, for one, the stack is very predictable due to its rigid structure, so it's easy for a program to determine exactly where a certain piece of data resides on the stack at any given point in time (usually by adding a static offset to the memory address of the current top of the stack). But also, the stack is extremely performant (fast). It has many restrictions, but only because it's extremely structured, and those restrictions serve to maintain that structure. That careful structure makes it very easy for your computer to operate on it<Emdash/>to allocate new memory on top of it, to free memory from the top of it, and even to access and modify data within it.</P>

      <P>(For the curious reader, stack operations are fast for various reasons. For one, the concept of the stack is built directly into CPU architectures: CPUs typically store a pointer to the top of the current process's stack directly in a local register, and allocating / freeing memory to / from the stack is a simple matter of adjusting that pointer. Second, because the stack is so structured, your computer can easily locate any referenced stack-allocated object. Typically, for each reference in the program's source code, a "hard-coded" stack offset is embedded directly into the program's executable file / bytecode. At runtime, the program can quickly compute the memory address of a stack-allocated object associated with a given reference by simply adding the reference's corresponding offset to the top-of-stack pointer (which is stored in a register, as previously mentioned). Third, if used carefully, the stack's contiguous structure can often support much better cache coherency (e.g., when accessing several different function-local variables back-to-back) than alternative memory models like <Link href="#heap">the heap</Link>).</P>

      <P>So, a given program might store <It>lots</It> of data that doesn't need to be resized and can reasonably be freed in LIFO order. This kind of data can often be stored on the stack without any issues, and the stack is very performant and easy to navigate, so this kind of data is a good candidate for stack storage. And indeed, many programming languages use the stack to store this kind of data (<Link href="#pythons-memory-model">we'll talk about how Python uses the stack in a bit</Link>).</P>

      <SectionHeading id="heap">The heap</SectionHeading>

      <P>The major alternative to the stack is <Bold>the heap</Bold>. The heap refers to a place in memory where data is stored, allocated, and freed in a much less structured and restrictive manner than how the stack operates.</P>

      <P>The heap itself is actually much simpler than the stack, but <It>using it correctly</It> is much more complicated (both are easy to use in Python, but that's because Python <It>makes</It> it easy<Emdash/>that comes at <Link href="#pythons-memory-model">a cost in performance</Link>). Think of the heap as a nebulous "cloud" of bytes. At any given point in time, some chunks of bytes in that cloud might be allocated for (being used by) certain objects / data, but other chunks of bytes might be free (not currently being used). Suppose you want to allocate some bytes to store a new object. Suppose that object <It>initially</It> requires 100 bytes of space (though that might change later). In order to store it on the heap, your computer will have to search through that "cloud of bytes" in order to find a free, contiguous chunk of 100 bytes. Later, suppose you want to free that object from memory because you're done using it. Then you simply tell your computer "please free the memory from the heap associated with this object". And it does exactly that, allowing that memory to later be reused in future allocations.</P>

      <P>This means that the heap is not, by any means, a LIFO structure. When you allocate memory on the heap, it could be allocated from <It>anywhere</It> on the heap. Moreover, when you free memory from the heap, it could be freed from <It>anywhere</It>.</P>

      <P>This makes the heap much less restrictive than the stack. Suppose you want to create an object A, then create another object B, then free object A <It>without</It> first freeing object B. Such a thing would be impossible on the stack, but it's trivial on the heap.</P>

      <P>Similarly, suppose you want to allocate some data within some function call, but you want that data to continue to be accessible even after that function call ends (e.g., perhaps you want to create an object in a function; return that object; and the continue to access / use it within the function caller). Again, this is easy to do on the heap, but it's generally impossible (or at least a very bad idea) on the stack<Emdash/>continuing to store it on the stack even after the end of the function call would also require continuing to store everything that's <It>below</It> it on the stack (because the stack is LIFO), even if that data doesn't need to be (or can't be) used anymore.</P>

      <P>However, the flexible nature of the heap comes at a cost. For one, because the stack is so structured, it's often easy for your program to remember where each stack-allocated variable is located (see my earlier comment about why the stack is so performant). In contrast, the heap is much less structured, so any given object could be stored <It>anywhere</It>. To keep track of where each heap-allocated object is located, your computer usually needs to explicitly store the memory address of each and every heap-allocated object (those memory addresses are, in turn, typically stored on the stack so that your computer knows where <It>they're</It> located). Storing these references requires additional memory.</P>

      <P>Moreover, accessing data on the heap is slower than accessing data on the stack. Before your computer can access data on the heap, it has to figure out where that data is located by loading its memory address from wherever <It>it's</It> being stored (again, typically these memory addresses are stored on the stack). It can then <It>follow</It> that memory address to find the heap-allocated object. This requires two "layers" of indirection. Accessing data on the stack typically only requires one (and some "pointer arithmetic", but that's quick and easy for your computer to do).</P>

      <P>(The heap can also suffer from more cache coherency issues than the stack. Sometimes that matters; sometimes it doesn't.)</P>

      <P>But I haven't yet explained the biggest issue with the heap yet: deciding <It>when</It> a heap-allocated object should be freed. In the case of the stack, things are pretty simple. Typically, the only data stored on the stack is data that's tied to a function call or scope, meaning data that's 1) created within a function call or scope, and 2) becomes inaccessible the moment that function call or scope ends. Hence, when a function call or scope ends, that's the moment that its stack-allocated data should be freed. But what about the heap? Because the heap is not a LIFO structure, it's much less restrictive. This allows us to use it to store data that <It>will</It> continue to be accessible even after the scope in which it was allocated ends (I previously explained this as a benefit of the heap). But if that data can outlive the scope or function call in which it was created, then when <It>should</It> it be freed from memory?</P>

      <P>It's important that it's freed <It>eventually</It>. Otherwise, if a program continuously allocates more and more objects on the heap over time but never frees any of them, your computer will eventually run out of available memory, and the program will crash (i.e., a heap overflow). But it's also important that it's not freed <It>too early</It>. If an object's memory is freed before the program is done using it, then bad things can happen (sometimes very bad things).</P>

      <P>Basically, a heap-allocated object should be freed from memory when the program is done using it. But this requires the program to <It>know</It> when it's done using each heap-allocated object. There are two ways that it could know such a thing:</P>

      <Enumerate>
        <Item><P>(Manual heap management) The programmer <It>manually</It> writes an explicit line of code saying something to the effect of "this object will never be used again after the execution of this statement, so it should be deleted now". This is how memory is freed from the heap in programming languages like C and C++.</P>

        <P>(That said, proper / "modern" C++ programs tend to use smart pointers and other generics with the Big Three to manage heap memory automatically. But in C, all heap-allocated memory is managed manually by the programmer.)</P></Item>

        <Item><P>The program itself <It>automatically</It> keeps track of all references to all objects, and when an object no longer has any more references that refer to it, the program, knowing that it can't possibly be used any longer, automatically frees it from the heap. It's often the responsibility of a <Bold>garbage collector</Bold> to keep track of these things. This is how memory is freed from the heap in Python (as well as most other high-level programming languages, except for C and C++).</P></Item>
      </Enumerate>

      <P>The former option puts a huge reponsibility on the programmer: the programmer must make sure to write code that explicitly frees all heap-allocated objects <Ul>at the right moment</Ul> (in C, this is done via by passing the heap-allocated object's memory address to the <Code>free()</Code> function). If the programmer accidentally frees a heap-allocated object before it's done being used by the program, bad things happen. In contrast, the latter option shifts the responsibility of heap memory management to the program itself. This makes heap memory management mostly "foolproof" (it's hard to mess it up as a programmer since the computer does most of the work for you). However, requiring a garbage collector to keep track of all references to all objects tends to slow down the program.</P>

      <P>This is one of the reasons why people say that C and C++ programs can be faster than, say, Python programs; that's an oversimplification, but there's some merit to it. However, it's also one of the reasons that <Link href="https://www.tomshardware.com/software/security-software/white-house-urges-developers-to-avoid-c-and-c-use-memory-safe-programming-languages">the whitehouse and NSA released bulletins</Link> urging developers to think twice before using C or C++<Emdash/>manual memory management is hard to do correctly, and messing it up can introduce serious security vulnerabilities into an application.</P>

      <P>(For the curious reader: Some programming languages offer ways of verifying that a program manages its memory properly even without the use of a garbage collector. For example, Rust's borrow checker verifies memory safety via static analysis. However, this usually requires imposing serious restrictions on how the code is allowed to work with objects and references so that the static analysis tool(s) can verify properties about its memory safety. It also slows down compilation by adding another responsibility to the compiler.)</P>

      <SectionHeading id="pythons-memory-model">Python's memory model</SectionHeading>

      <P>The stack and the heap are abstract concepts, but most programming languages do, indeed, use these two memory models to store most of the data needed for a program's execution. However, the way in which these two memory models are used differs between programming languages, and even between implementations of a given programming language.</P>

      <P>In the most common implementation of Python, known as CPython, the rule is more or less as follows: all objects are stored on the heap, and the <It>references</It> (e.g., variables) that refer to those objects are stored either on the stack or the heap depending on the context. In particular, function-local references (e.g., parameters and other variables created within functions) are typically stored on the stack, but references within objects (e.g., member references) are stored on the heap along with / in the object itself.</P>

      <P>Let's unpack that. First, remember: a variable is simply a <It>named reference</It> to an object, and variables typically work via memory addresses. In other words:</P>

      <Enumerate listStyleType="decimal">
        <Item><P>In Python, every variable is essentially just a name associated with a memory address.</P></Item>
        <Item><P>Memory addresses are numbers, and they must be stored somewhere. In Python, the memory address associated with each function-local variable is stored on the stack (at least in general; perhaps there are some minor exceptions that I'm not aware of).</P></Item>
        <Item><P>However, the objects that those memory addresses point to are stored on the heap, including other references that might be contained inside them.</P></Item>
      </Enumerate>

      <P>Suppose a Python program creates a function-local integer variable <Code>x = 1</Code>. Then suppose, later, it changes its value via <Code>x = 5</Code>. In that second statement<Emdash/><Code>x = 5</Code><Emdash/>a lot of things are happening. First, your computer reaches into the stack to find the memory address associated with the variable <Code>x</Code>. Then, it goes to the location in memory that that memory address points to (remember: memory addresses are just numbers that represent locations in memory). <It>That</It> location in memory is where the integer object (currently with value 1) is being stored, and it's on the heap<Emdash/>not the stack. Finally, it modifies the bytes in that location in memory (on the heap, associated with the integer object) to change its value from 1 to 5.</P>

      <P>One major reason that CPython's memory model works like this is that function-local references never need to be resized (because they're just memory addresses, all of which are the same size) and are always scoped to function calls, so they can <Ul>always</Ul> be allocated and freed in a LIFO manner. Hence, they're stored on the stack. The objects that those references refer to, on the other hand, often need to be resized (e.g., as with lists) and might outlive the scopes in which they're created. Hence, they, and everything inside them, are stored on the heap.</P>

      <P>This is somewhat overly conservative. There are plenty of instances where objects are created that aren't resized (or can't be resized, such as primitives) and don't outlive their scopes. Such objects <It>could</It> be stored on the stack, but CPython doesn't store them on the stack<Emdash/>it always stores them on the heap. There are reasons that CPython stores all objects on the heap, but that's beyond the scope of this course.</P>

      <P>(For the curious reader: In C and C++, it's completely up to the programmer to decide what goes on the stack versus the heap. This allows for the programmer to take advantage of the stack's performance even when storing and accessing objects rather than just references.)</P>

      <P>Finally, CPython automatically manages all heap-allocated memory with a garbage collector. Yes, this slows down CPython programs, but it ensures that no objects are ever freed before the program is done using them (i.e., it prevents use-after-free errors, an infamous class of bugs in many programs written in other "closer-to-the-metal" languages like C and C++).</P>
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
