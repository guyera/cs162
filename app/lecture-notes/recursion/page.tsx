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
        <Item><Link href="#recursion">Recursion</Link></Item>
        <Item><Link href="#why-recursion">Why recursion?</Link></Item>
        <Item><Link href="#palindromes">Palindromes</Link></Item>
        <Item><Link href="#gcd">Greatest common divisor</Link></Item>
        <Item><Link href="#performance-of-recursion">Performance of recursion</Link></Item>
      </Itemize>

      <SectionHeading id="recursion">Recursion</SectionHeading>

      <P><Bold>Recursion</Bold> describes a computational process, such as a function, that calls itself. It's a relatively simple concept to explain but very difficult to master, so we'll practice with several examples.</P>

      <P>The classic example of recursion is the <Bold>fibonacci sequence</Bold>. It's the sequence of numbers that starts with 0 and then 1, and then every subsequent number in the sequence is the sum of the previous two numbers. To illustrate, the first ten numbers in the fibonacci sequence are: 0, 1, 1, 2, 3, 5, 8, 13, 21, and 34. If you look at any three adjacent numbers in that subsequence, you'll notice that the third number is the sum of the first two numbers; that's how the fibonacci sequence is defined.</P>

      <P>Recursion is not purely a programmatic concept. In fact, the fibonacci sequence is a mathematical function. Its definition looks like this:</P>

      <P spaceBelow={false}>fib(1) = 0</P>
      <P spaceBelow={false}>fib(2) = 1</P>
      <P>fib(x) = fib(x - 1) + fib(x - 2), for all x {'>'} 2</P>

      <P>The argument to the fib() function specifies which number in the sequence should be computed. If the argument is 1, then the first number should be computed. If it's 10, then the 10th number should be computed. The function then computes that number of the fibonacci sequence, which serves as the function's output. The first two numbers in the fibonacci sequence are 0 and 1, hence fib(1) = 0 and fib(2) = 1. Each subsequent number in the fibonacci sequence is the sum of the previous two numbers, hence fib(x) = fib(x - 1) + fib(x - 2).</P>

      <P>A Python representation of this mathematical function might look like something like this:</P>

      <PythonBlock showLineNumbers={false}>{
`def fib(x: int) -> int:
    if x <= 0:
        raise ValueError('x must be positive')

    if x == 1:
        return 0
    elif x == 2:
        return 1
    return fib(x - 1) + fib(x - 2)`
      }</PythonBlock>

      <P>Recursion can sometimes feel like black magic. I think that tracing a recursive function can be helpful in getting over that feeling. Suppose that the <Code>main()</Code> function has a single line of code: <Code>print(fib(4))</Code>. What value would be printed, and how would it be computed? Let's go through the process step by step:</P>

      <Enumerate listStyleType="decimal">
        <Item><P>When the computer encounters <Code>print(fib(4))</Code>, it must compute <Code>fib(4)</Code> in order to print it, so it will jump up to the <Code>fib()</Code> function's definition, passing the argument <Code>4</Code> to the parameter <Code>x</Code>. <Code>4</Code> is positive, but it's not 1 nor 2, so the recursive statement will execute: <Code>return fib(x - 1) + fib(x - 2)</Code>. In this moment, <Code>x</Code> is <Code>4</Code>, so this statement is equivalent to <Code>return fib(3) + fib(2)</Code>.</P>

      <P>But how does the computer compute <It>those</It> values? Well, it pauses what it's doing and restarts the same process two more times<Emdash/>once for <Code>fib(3)</Code>, and once for <Code>fib(2)</Code>:</P>

        <Enumerate listStyleType="decimal">
          <Item><P>Let's start with <Code>fib(3)</Code>. The computer once again jumps up to the top of the <Code>fib()</Code> function, but in this particular function call, <Code>x</Code> is given the argument <Code>3</Code> instead of <Code>4</Code>. Again, 3 is positive, but it's not 1 nor 2, so the recursive statement will execute: <Code>return fib(x - 1) + fib(x - 2)</Code>. But since <Code>x</Code> is <Code>3</Code> in this moment, this statement is equivalent to <Code>return fib(2) + fib(1)</Code>. Again, computing this statement requires restarting the process two more times:</P>

          <Enumerate listStyleType="decimal">
            <Item><P>To compute <Code>fib(2)</Code>, the computer jumps to the top of the <Code>fib()</Code> function, passing <Code>2</Code> as the argument to <Code>x</Code>. This time, the second base case's if statement will trigger, returning <Code>1</Code> and immediately ending the function call. To be clear, only this particular (<Code>fib(2)</Code>) function call is ended<Emdash/>the return statement does not end the <Code>fib(3)</Code> function call that in turn <It>called</It> <Code>fib(2)</Code>, nor the <Code>fib(4)</Code> function call that in turn called <Code>fib(3)</Code>.</P></Item>
            
            <Item><P>To compute <Code>fib(1)</Code>, the computer jumps to the top of the <Code>fib()</Code> function, passing <Code>1</Code> as the argument to <Code>x</Code>. This time, the first base case's if statement will trigger, returning <Code>0</Code> and immediately ending the function call.</P></Item>
          </Enumerate></Item>
          
          <Item><P>Now that <Code>fib(2)</Code> and <Code>fib(1)</Code> have been computed as 1 and 0, respectively, the sum can be computed within the <Code>fib(3)</Code> function call as 1 + 0 = 1. That sum is returned from the <Code>fib(3)</Code> function call (i.e., <Code>return fib(2) + fib(1)</Code> {'->'} <Code>return 1 + 0</Code> {'->'} <Code>return 1</Code>).</P></Item>

          <Item><P>But remember: the <Code>fib(4)</Code> function call in turn called <Code>fib(3)</Code> <It>and</It> <Code>fib(2)</Code>. Everything I've described up to this point has been regarding the <Code>fib(3)</Code> computation. So, once it's done computing <Code>fib(3)</Code> to be 1, it moves on to compute <Code>fib(2)</Code>. Again, the computer jumps to the top of the <Code>fib()</Code> function, passing <Code>2</Code> as the argument to <Code>x</Code>. The second base case's if statement triggers, returning <Code>1</Code> and ending the function.</P></Item>
        </Enumerate></Item>

        <Item><P>Within the <Code>fib(4)</Code> function call, <Code>fib(3)</Code> has been computed as 1, and <Code>fib(2)</Code> has also been computed as 1. All that's left is to add them up and return the sum (2).</P></Item>

      </Enumerate>

      <P>The <Code>main()</Code> function then receives that sum and prints it. So it prints 2.</P>

      <P>Stop and ask yourself: why is it necessary to explicitly spell out the fact that fib(1) = 0 and fib(2) = 1? That is, why do we need those if statements in our code? Well, suppose we omitted them. In such a case, what would happen when the computer needs to compute <Code>fib(2)</Code>? Without those if statements, the recursive statement would execute, in turn computing <Code>fib(1)</Code> and <Code>fib(0)</Code>. The <Code>fib(0)</Code> call would then raise a <Code>ValueError</Code>, propagating down the entire call stack and crashing the program.</P>

      <P>Now, what if we got rid of <It>all three</It> if statements, omitting the requirement that x be positive? Well, then we'd run into a different problem: <Code>fib(2)</Code> would recurse to <Code>fib(1) + fib(0)</Code>; <Code>fib(0)</Code> would recurse to <Code>fib(-1) + fib(-2)</Code>; <Code>fib(-2)</Code> would recurse to <Code>fib(-3) + fib(-4)</Code>; and so on, forever and ever. Mathematically, this would correspond to an infinite expansion of terms, never resolving to an actual value. Programatically, this would mean the function would call itself forever and ever<Emdash/>a sort of infinite loop (this is sometimes referred to as <Bold>infinite recursion</Bold>).</P>

      <P>(Technically, infinite recursion usually causes a stack overflow, which crashes the program and is, therefore, not <It>really</It> infinite. <Link href="#performance-of-recursion">More on this later</Link>.)</P>

      <P>In the case of the fibonacci sequence, both fib(1) <It>and</It> fib(2) must be explicit defined as the hard-coded (non-recursive) values 0 and 1, respectively. That is, even leaving out just <It>one</It> of these two if statements would break the entire function. I encourage you to think about why that's the case.</P>

      <P>fib(1) = 0 and fib(2) = 1 are known as <Bold>base cases</Bold>. A base case of a recursive function is a special set of argument values for which the function does <Ul>not</Ul> recurse (i.e., does not call itself). If <Code>x</Code> is equal to <Code>1</Code> or <Code>2</Code>, then the <Code>fib()</Code> function does <Ul>not</Ul> call itself. Hence, <Code>x == 1</Code> and <Code>x == 2</Code> are base cases of the <Code>fib()</Code> function.</P>

      <P>Every recursive function inherently needs at least one base case, or else nothing will stop it from either a) calling itself forever, resulting in infinite expansion of terms / infinite recursion, or b) producing undefined values / raising an error. Some recursive functions, such as <Code>fib()</Code>, need more than one base case, but every well-defined recursive function will have at least one.</P>

      <SectionHeading id="why-recursion">Why recursion?</SectionHeading>

      <P>As you might have already figured out, it's possible to rewrite the <Code>fib()</Code> function without any recursion whatsoever. Indeed, even though the fibonacci sequence is defined recursively in mathematics, it can be defined without recursion in an imperative programming paradigm:</P>

      <PythonBlock showLineNumbers={false}>{
`def fib(x: int) -> int:
    if x <= 0:
        raise ValueError('x must be positive')

    if x == 1:
        return 0
    elif x == 2:
        return 1
    
    val1 = 0
    val2 = 1
    for _ in range(x - 2):
        val3 = val1 + val2 # Compute sum of previous two numbers
        # Update previous two numbers
        val1 = val2
        val2 = val3

    return val3`
      }</PythonBlock>

      <P>Since recursion involves a function calling itself, it behaves a bit like a sort of loop, so it shouldn't be surprising that, at least in some cases, it can be replaced with an <It>actual</It> loop. In this case, we replaced the recursion with a for loop. When comparing a loop-based solution with a recursive one, the loop-based solution is often referred to as an <Bold>iterative</Bold> solution.</P>

      <P>Believe it or not, it's not too hard to prove that <It>all</It> recursive solutions can be rewritten in an iterative form, and <It>all</It> iterative solutions can be rewritten in a recursive form. That's to say, there's no such thing as a problem that can be solved with recursion but not a loop, and there's no such thing as a problem that can be solved with a loop but not recursion (in fact, some "functional-heavy" programming languages don't even offer loop-based mechanisms, resorting purely to recursion and higher-order functions to accomplish repetition).</P>

      <P>But if that's the case, then how do you choose between recursion and iteration?</P>

      <P>The answer is simple: recursion and iteration are just two different ways of thinking about computational problems and their solutions, and, in most cases, you should just use whichever one makes the most sense. In the case of the fibonacci sequence, it's easy to solve the problem using either a loop or recursion. But there exist many more complex problems for which the recursive solution is intuitive and elegant, but the iterative solution is messy and complicated. By the same token, there exist problems for which the iterative solution is intuitive and elegant, but the recursive solution is messy and complicated. That's to say, some problems lend themselves well to recursion, and some lend themselves well to iteration.</P>

      <P>As a general rule of thumb, the kinds of problems that lend themselves well to recursion are problems that can be solved by 1) breaking them down into smaller instances of themselves, then 2) computing and combining the solutions of those smaller problems to formulate a solution for the larger, original problem. For example, computing the 100th number in the fibonacci sequence sounds difficult, but what if you could compute the 99th and 98th values? Those values are <It>slightly</It> smaller and simpler, so maybe they're easier to compute. <It>If</It> you could compute them, then you could simply add them up to compute the 100th value in the fibonacci sequence. I've just described a problem that can be solved by 1) breaking it down into two smaller instances of the same problem, then 2) combining the solutions of those two smaller problems to solve the larger, original problem. Hence, recursion might be reasonable for this problem.</P>

      <P>In the above description, the process of breaking the problem down into smaller versions of the same problem is, itself, recursion. In our <Code>fib()</Code> function, this process is given by <Code>return fib(x - 1) + fib(x - 2)</Code><Emdash/>the original problem, <Code>fib(x)</Code>, is broken down into two smaller problems, <Code>fib(x - 1)</Code> and <Code>fib(x - 2)</Code>, and then their solutions are combined to produce the final answer (via summation, in this case).</P>

      <P>Now, where do base cases fit into this line of thinking? Well, as you break the problem down into smaller and smaller instances of the same kind of problem, it will eventually be so small that you either <It>can't</It> break it down any further, or you simply have <It>no need</It> to break it down any further (e.g., because the solution is "obvious"). In the case of the <Code>fib()</Code> function, when <Code>x == 1</Code> or <Code>x == 2</Code>, we're trying to compute the first or second (resp.) number in the fibonacci sequence. Since these are the first two numbers in the sequence, they can't possibly be defined as the sum of the two numbers that come before them (because there <It>aren't</It> two numbers that come before them). Indeed, these are the first and smallest numbers in the sequence, so the process of computing them can't be broken down into smaller steps. That is, fib(1) and fib(2) are "obvious"<Emdash/>they are trivially defined as 0 and 1, respectively, and that's that. Hence, they represent the base cases.</P>

      <SectionHeading id="palindromes">Palindromes</SectionHeading>

      <P>Recursion gets easier with practice, so let's practice.</P>

      <P>You're tasked with writing a function that accepts a string <Code>s</Code> and returns a boolean: <Code>True</Code> if <Code>s</Code> is a palindrome, and <Code>False</Code> otherwise. A palindrome is a string that's the same forwards as it is backwards. For example, <Code>"mom"</Code>, <Code>"dad"</Code>, and <Code>"racecar"</Code> are all palindromes because each of them remains the same when written in reverse. For our purposes, an empty string (<Code>""</Code>) should be considered a palindrome.</P>

      <P>This particular problem, like the fibonacci sequence, has a relatively simple iterative solution as well as a relatively simple recursive solution. Here's a recursive solution:</P>

      <PythonBlock fileName="palindrome.py">{
`def palindrome(s: str) -> bool:
    # A string is a palindrome if and only if:
    #   1. The first character is equal to the last character
    #   AND
    #   2. The smaller string consisting of everything in between the
    #      first and last characters is, itself, a palindrome. This
    #      is the recursive part of our solution.

    # As we recurse, we'll be dealing with smaller and smaller strings.
    # The size will decrease by 2 at each recursive step. The base
    # cases are strings of length 0 and strings of length 1 (because,
    # in either of those two cases, there is no "inner" substring
    # on which to recurse). Let's handle these base cases up front:
    if len(s) <= 1:
        # s is of length 0 or 1. All strings of length 0 or 1 are
        # inherently palindromes. So just return true.
        return True

    # In all other cases, we have to check both conditions. First,
    # verify that the first and last character are equal to each other:
    if s[0] != s[len(s) - 1]:
        # The first and last character are NOT the same, so s must
        # not be a palindrome. Return False
        return False

    # If the function is still going, then the first and last character
    # must be the same. Check the second condition: verify that
    # the "inner" substring is a palindrome. We can use Python's
    # slice indexing to get the inner substring: use 1 for the start
    # index and len(s) - 1 as the (exclusive) end index.
    inner_substring = s[1 : len(s) - 1]
    
    # Now check whether inner_substring is a palindrome
    if not palindrome(inner_substring):
        # It's not a palindrome, so return False
        return False

    # If the function is still going, then s passed both conditions,
    # so it must be a palindrome. Return True
    return True

def main() -> None:
    word = input('Enter a word: ')
    if palindrome(word):
        print(f'"{word}" is a palindrome')
    else:
        print(f'"{word}" is not a palindrome')

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Here are some example runs:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python palindrome.py 
Enter a word: racecar
"racecar" is a palindrome
(env) $ python palindrome.py 
Enter a word: antarctica
"antarctica" is not a palindrome
`
      }</TerminalBlock>

      <SectionHeading id="gcd">Greatest common divisor</SectionHeading>

      <P>Let's try a harder example. You're tasked with writing a function that accepts two positive integer arguments, <Code>a</Code> and <Code>b</Code>, and returns the greatest common divisor of those two arguments. A divisor is a number by which another number is divisible. A common divisor of two numbers <Code>a</Code> and <Code>b</Code>, then, is a third number by which both <Code>a</Code> and <Code>b</Code> are divisible. The greatest common divisor is exactly that<Emdash/>it's the greatest possible value that is a common divisor of <Code>a</Code> and <Code>b</Code>.</P>

      <P>For example, suppose <Code>a</Code> is 56 and <Code>b</Code> is 24. The greatest common divisor of these two numbers is 8. 56 is divisible by 8 (8 * 7 = 56), and 24 is divisible by 8 (8 * 3 = 24). There are some other common divisors (4, 2, and 1), but 8 is the greatest of all of them. Hence, it's the greatest common divisor.</P>

      <P>This sounds like a hard problem, so let's think about it some more. To make things simpler, let's first assume that <Code>b</Code> is always smaller than or equal to <Code>a</Code> (if it isn't, we can just swap the two values with each other to ensure that it is).</P>

      <P>In the simplest case, suppose <Code>a</Code> is divisible by <Code>b</Code>. The answer, in such a case, is simply <Code>b</Code>. The greatest possible divisor (factor) of any number is itself, meaning that the largest divisor of <Code>b</Code> is itself <Code>b</Code>. And since <Code>a</Code> is divisible by <Code>b</Code>, it's also a common divisor of the two arguments. Hence, it's the greatest common divisor.</P>

      <P>Now for the more complicated case. Suppose that <Code>a</Code> is not divisible by <Code>b</Code>. Then we need to find a third number, which I'll call <Code>x</Code>, that's the greatest common divisor of <Code>a</Code> and <Code>b</Code>. What do we know about <Code>x</Code>? Obviously it's a factor (divisor) of <Code>a</Code> and a factor (divisor) of <Code>b</Code>, but there's another small piece of information that we can glean with a bit of careful analysis. Since <Code>x</Code> is a factor of <Code>b</Code>, it must also be a factor of all <It>multiples</It> of <Code>b</Code> (e.g., suppose <Code>b</Code> is 24 and <Code>x</Code> is 8; consider that 8 is also a factor of all multiples of 24, such as 48, 72, etc).</P>

      <P>Consider the largest multiple of <Code>b</Code> that's still <It>smaller</It> than <Code>a</Code>. Let's refer to this number as <Code>y</Code> (e.g., if <Code>a</Code> is 56 and <Code>b</Code> is 24, then <Code>y</Code> would be 48). Since <Code>y</Code> is a multiple of <Code>b</Code>, <Code>x</Code> (the answer that we're looking for<Emdash/>the greatest common divisor of <Code>a</Code> and <Code>b</Code>) must <It>also</It> be a factor of <Code>y</Code>.</P>

      <P>Now, if <Code>x</Code> is a factor of <Code>y</Code> <It>and</It> a factor of <Code>a</Code> (which it is, as I just explained), then consider that it must <It>also</It> be a factor of <Code>a - y</Code>. I'll use <Code>z</Code> to denote this difference. If you're not convienced that <Code>x</Code> is a factor of <Code>z</Code>, think about it: if <Code>x</Code> is a factor of <Code>y</Code>, then if you count upward from 0 by increments of <Code>x</Code>, you'll eventually reach <Code>y</Code> (this is precisely the definition of a "factor", or "divisor"). But if you keep going from there, you'll eventually <It>also</It> reach <Code>a</Code> (since <Code>x</Code> is also a factor of <Code>a</Code>). This means that, if you were to count upward from <Code>y</Code> by increments of <Code>x</Code>, you'd eventually reach <Code>a</Code>. More generally, if you count upward by increments of <Code>x</Code>, you'll eventually reach a value that is <Code>z</Code> larger than your starting value, where <Code>z</Code> is the distance between <Code>y</Code> and <Code>a</Code> (i.e., <Code>z = a - y</Code>). By definition, this means that <Code>x</Code> is a factor of <Code>z</Code>.</P>

      <P>If you think carefully, you might realize that <Code>z</Code> is, by definition, equal to <Code>a % b</Code>. So all this analysis tells us something very important: if a given number <Code>x</Code> is a common divisor of <Code>a</Code> and <Code>b</Code>, then it's also a divisor of <Code>a % b</Code> (because it's a divisor of <Code>z</Code>, and <Code>z = a % b</Code>).</P>

      <P>But there's an inverse statement that's also true: if <Code>x</Code> is a common divisor of <Code>b</Code> and <Code>a % b</Code>, then it must also be a divisor of <Code>a</Code>. This is also fairly easy to show (again, think in terms of "counting upward by increments of <Code>x</Code>"<Emdash/>you'll eventually reach <Code>y</Code>, and then from there you'll eventually close the distance to <Code>a</Code>).</P>

      <P>So, the goal is to find the greatest common divisor <Code>x</Code> of <Code>a</Code> and <Code>b</Code>. But as we just proved, any common divisor of <Code>a</Code> and <Code>b</Code> is also a divisor of <Code>a % b</Code>, and any common divisor of <Code>b</Code> and <Code>a % b</Code> is also a divisor of <Code>a</Code>. That's to say, finding the greatest common divisor of <Code>a</Code> and <Code>b</Code> is equivalent to finding the greatest common divisor of <Code>b</Code> and <Code>a % b</Code>.</P>

      <P>Why is that useful? Well, of the three values <Code>a</Code>, <Code>b</Code>, and <Code>a % b</Code>, the latter two are the smallest (<Code>z</Code> is necessarily smaller than <Code>b</Code>, which, as per our assumption, is necessarily smaller than <Code>a</Code>). This means that our function, <Code>gcd(a, b)</Code>, is equivalent to <Code>gcd(b, a % b)</Code>. The latter expression is "simpler" in the sense that the arguments are smaller.</P>

      <P>Remember: the goal of recursion is often to break problems down into smaller versions of themselves. I'm saying that we can compute the greatest common divisor of two numbers by instead computing the greatest common divisor of a <It>smaller</It> pair of numbers. That sounds like recursion.</P>

      <P>I think that's enough analysis. Here's the code:</P>

      <PythonBlock fileName="gcd.py">{
`def gcd(a: int, b: int) -> int:
    # Require that a and b both be positive
    if a <= 0 or b <= 0:
        raise ValueError('a and b must both be positive!')

    # Make sure that b <= a. If not, swap them to make it so.
    if b > a:
        temp = b
        b = a
        a = temp

    # Now, in the simple case, if a is divisible by b, simply return
    # b
    if a % b == 0:
        # Remainder of 0 after division means a is divisible by b
        return b

    # If the function is still running, then this is the more
    # complicated case. As we proved, in this case, gcd(a, b) is
    # equivalent to gcd(b, a % b). And that's a simpler / smaller
    # version of the same problem, so we compute the answer via a
    # recursive call and return it
    return gcd(b, a % b)

def main() -> None:
    val1 = int(input('Enter an integer: '))
    val2 = int(input('Enter another integer: '))

    answer = gcd(val1, val2)

    print(f'The GCD if {val1} and {val2} is {answer}')

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>Here are some example runs:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python gcd.py 
Enter an integer: 56
Enter another integer: 24
The GCD if 56 and 24 is 8
(env) $ python gcd.py 
Enter an integer: 7
Enter another integer: 14
The GCD if 7 and 14 is 7
`
      }</TerminalBlock>

      <P>By the way, this is actually a famous algorithm. It's known as <Bold>Euclid's Algorithm</Bold>, and it's an extremely efficient way of computing the greatest common divisor of two numbers.</P>
      
      <SectionHeading id="performance-of-recursion">Performance of recursion</SectionHeading>

      <P>In some programming languages, including Python, recursion can often have a noticeable impact on memory consumption (and sometimes runtime, but we'll focus on memory consumption).</P>

      <P>Think back to our fibonacci example. In order to compute <Code>fib(4)</Code> so that it can be printed to the terminal, the <Code>fib(4)</Code> function call must in turn compute <Code>fib(3)</Code> and <Code>fib(2)</Code>. Think carefully about how function calls actually work for a moment: <It>before</It> <Code>fib(4)</Code> can return a value back to the <Code>main()</Code> function, it must call <Code>fib(2)</Code> and <Code>fib(3)</Code>. This means that these recursive calls must run to completion <It>before</It> the <Code>fib(4)</Code> function call can return.</P>

      <P>In essence, when one function A calls another function B, A "pauses" until B terminates (either by returning or by raising an error). But during that time<Emdash/>when A is "paused" so that B can execute<Emdash/>all of A's variables, including its local variables and parameters, must be retained (i.e., <It>not</It> deleted from memory) so that, when B eventually terminates and A is "unpaused", it still has access to those variables in case it needs them.</P>

      <P>Put in context, when <Code>fib(4)</Code> reaches the point that it needs to know the values of <Code>fib(3)</Code> and <Code>fib(2)</Code>, it must "pause" to compute those values by calling itself twice (one at a time<Emdash/>it pauses to call <Code>fib(3)</Code>, unpauses when <Code>fib(3)</Code> terminates, pauses again to call <Code>fib(2)</Code>, and then unpauses again when <Code>fib(2)</Code> terminates). This means that when <Code>fib(3)</Code> is executing, <Code>fib(4)</Code> is essentially "paused", but its variables, including its parameter(s), still exist in memory.</P>

      <P>This means that, for example, when <Code>fib(3)</Code> is executing, there are actually <It>two</It> parameters named <Code>x</Code> in memory: there's the parameter named <Code>x</Code> that exists within the context of the <Code>fib(3)</Code> call, and there's the parameter named <Code>x</Code> that exists within the context of the (currently paused, but still alive) <Code>fib(4)</Code> call.</P>

      <P>Let's take this reasoning to the logical conclusion: as a function calls itself, and then that call results in more recursive calls, and then those calls result in more recursive calls, and so on, your computer may eventually reach a very "deeply" nested recursive call (e.g., a <Code>fib(2)</Code> call, which was executed by <Code>fib(3)</Code>, which was executed by <Code>fib(4)</Code>, and so on, perhaps all the way up to <Code>fib(n)</Code> for some large, initial value <Code>n</Code>). When your computer is executing that very deeply nested recursive call, at that very moment, there are <It>many</It> function calls that are all "paused", and each of those function calls has its own local variables and parameters. At that moment, all of those local variables and parameters exist in the computer's memory simultaneously, being kept around for when their respective call "unpauses" so that it may resume using those variables if it needs to.</P>

      <P>That's to say, deeply nested recursive calls can have a noticeable impact on your program's memory consumption (actually, deeply nested calls <It>in general</It> can have this effect, but recursion is a natural reason for deeply nested calls).</P>

      <P>In Python, all objects are stored in a special place in memory known as the <Bold>heap</Bold>, but all references to those objects (e.g., as represented by variables) are stored in a separate place in memory known as the <Bold>stack</Bold> (more on these terms in <Link href={`${PARENT_PATH}/${allPathData["memory-models"].pathName}`}>a future lecture</Link>). Since all variables are references, including local variables and parameters, deeply nested recursive calls can cause too much memory to be allocated and stored on the stack. What's worse, the stack is typically restricted to be fairly small. This means that deeply nested recursive calls can easily cause the stack to run out of available space. This is known as a <Bold>stack overflow</Bold> (the infamous error after which <Link href="https://stackoverflow.com/questions">the popular programming stack exchange</Link> is named).</P>

      <P>(A true stack overflow is unrecoverable and will always result in the program crashing because there's no space in memory left to even run an exception handling mechanism. However, Python has its own "softer" recursion limit. When this limit is exceeded, which usually happens before a true stack overflow occurs, it automatically raises a <Code>RecursionError</Code>. This can be caught like any other exception. Still, it's possible for a true stack overflow to occur if the recursion limit is too small, either because it has been configured to be small (yes, it's configurable) or because each function call uses a large amount of memory.)</P>

      <P>This does not mean that you should avoid recursion. It only means that you should avoid recursion when 1) you've determined that the memory consumption of a recursive solution would be significant enough to matter for your use case, <It>and</It> 2) there's an alternative iterative solution that <It>doesn't</It> have such a significant memory footprint. For example, the fibonacci sequence can be computed via a simple iterative solution that's part of a family of algorithms known as <Bold>dynamic programming</Bold>. This solution is more efficient than our naive recursive implementation in terms of both memory consumption <It>and</It> runtime (I won't show you the algorithm since that's not the point of this course; just understand the potential performance implications of recursion).</P>

      <P>Now, in some other programming languages, the interpreter / compiler can use certain "tricks" to alleviate this issue. A common trick employed by many "functional-heavy" programming languages (e.g., Haskell) is <Bold>tail recursion</Bold>, which allows a recursive call to "reuse" some of the space in memory that was used by its caller. But this is only possible in certain cases (e.g., when the compiler / interpreter can determine with certainty that the caller will not need to refer back to that memory when it "unpauses", such as when the recursive call appears as the very last statement in the function (the "tail")), and it's only supported by programming languages that have tight restrictions on scope and control flow. Python's control flow and object reference model are too flexible, so it could never support tail recursion in a robust manner.</P>

      <P>Whatever programming language you're working in, you should be aware of the performance implications of deeply nested recursive calls.</P>
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
