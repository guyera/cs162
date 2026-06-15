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
        <Item><Link href="#searching">Searching</Link></Item>
        <Item><Link href="#linear-search">Linear search</Link></Item>
        <Item><Link href="#binary-search">Binary search</Link></Item>
        <Item><Link href="#sorting">Sorting</Link></Item>
        <Item><Link href="#selection-sort">Selection sort</Link></Item>
        <Item><Link href="#insertion-sort">Insertion sort</Link></Item>
        <Item><Link href="#merge-sort">Merge sort</Link></Item>
      </Itemize>

      <SectionHeading id="searching">Searching</SectionHeading>

      <P><Bold>Searching</Bold> refers to a class of problems in which you have a collection of data, and your goal is to find an element within said collection matching one or more criteria. For example, you might have a list of <Code>Person</Code> objects, and you need to find the person with the name <Code>"Liang"</Code> (e.g., so that you can print their information to the terminal). Or maybe you just have a list of integers and you want to determine whether a given integer is present in the list (and perhaps, if so, what its index is).</P>

      <P>An algorithm that solves a class of searching problems is referred to as a <Bold>searching algorithm</Bold>. There are lots of different searching algorithms that apply to different kinds of data structures and abstract data types. Since the only data structure that we've learned about in this course is Python's list implementation, we'll focus on searching algorithms that work with lists (though they also work with arrays). Specifically, we'll discuss <Bold>linear search</Bold> and <Bold>binary search</Bold>.</P>

      <SectionHeading id="linear-search">Linear search</SectionHeading>

      <P><Bold>Linear search</Bold> is perhaps the simplest searching algorithm. In essence, it's nothing more than a for loop that stops iterating when it finds the element with the target property.</P>

      <P>For example, suppose you need to write a function that retrieves the information about a person with a given name. An implementation of the linear search algorithm might look like this:</P>

      <PythonBlock fileName="linearsearch.py">{
`from typing import Optional
from person import Person

# Find the person with the given name in the given list and return
# that person. If no such person exists in the list, return None.
def person_with_name(
        people: list[Person],
        name: str) -> Optional[Person]:
    for p in people:
        if p.name == name:
            return p

    # If the function makes it this far, then it failed to find the
    # person with the specified name. The person must not exist.
    return None
`
      }</PythonBlock>

      <P>If you had a list of people named <Code>people</Code>, you could retrieve the <Code>Person</Code> object in the list with the name <Code>"Liang"</Code> like so: <Code>liang = person_with_name(peopole, "Liang")</Code>.</P>

      <P>The linear search algorithm can easily be modified to return the index of the target object within the list rather than the object itself.</P>

      <SectionHeading id="binary-search">Binary search</SectionHeading>

      <P>The problem with linear search is that it can be slow for large lists. For example, suppose you try to search for an element with a certain property in a list of size 1,000,000. Worse, suppose that no such element exists in the list. The for loop will iterate over all 1,000,000 elements before determining that the element doesn't exist. That will take your computer some time.</P>

      <P>There are faster searching algorithms, but they require placing certain restrictions on the data. One possible restriction that might help is sortedness<Emdash/>if the elements in a list are sorted according to some property (known as a <Bold>sort key</Bold>), then searching for an element for which that property matches one or more criteria can be easier than it would be if the list wasn't sorted.</P>

      <P>For example, suppose you have a list of integers that's sorted in ascending order (i.e., the first integer in the list is the smallest, and the last is the largest). Now suppose you need to determine whether the integer <Code>12</Code> is present in that list and, if so, return its index. Rather than iterating through the entire list until you find the integer <Code>12</Code> as you would with a linear search, you can do something a bit more clever: check the value of the element in the middle of the list. If it's the target value (12), simply return the index of the element in the middle of the list. If it's less than the target value ({'<'} 12), that doesn't necessarily mean that the target value isn't present in the list, but if it <It>is</It>, then it must be to the <It>right</It> of the middle of the list (because the list is sorted in ascending order, and the element in the middle is smaller than the target value). By the same token, if the element in the middle of the list is larger than the target value, then if the target value is present, it must be to the <It>left</It> of the middle. In either case, you can rule out the half of the list that definitely <It>doesn't</It> contain the target value. From there, you can simply recurse on the remaining half (the half you didn't rule out), repeating until you've either found the target value or ruled out every element.</P>

      <P>This algorithm is known as <Bold>binary search</Bold>. The word "binary", in this context, refers to the fact that half of the list is ruled out in each iteration. In contrast, linear search only rules out a single element in each iteration.</P>

      <P>I've described it recursively, but it's actually usually implemented as an iterative algorithm. To do this, simply keep track of indices marking the beginning and end of the "part" of the list that you haven't yet ruled out. Initially, these indices will be 0 and N-1 (to mark the beginning and end of the entire list). But as you rule out parts of the list, adjust these indices accordingly. Here's an implementation of binary search that returns the index of a specified integer value within a list of integers (or <Code>None</Code> if the value cannot be found):</P>

      <PythonBlock fileName="binarysearch.py">{
`from typing import Optional

# Given a list of integers and an integer value to search for
# within that list, return the index of the element within the
# list with the specified value. If the value is not found, None
# is returned instead.
def binary_search(values: list[int], value: int) -> Optional[int]:
    # Keep track of the parts of the list that we haven't yet ruled
    # out
    start_idx = 0
    end_idx = len(values) - 1

    # Keep going until we've ruled out everything in the entire list
    # (or found the value that we're searching for)
    while start_idx <= end_idx:
        # Compute the index that's exactly halfway between start_idx
        # and end_idx (rounding down if there's an even number of
        # elements in this range)
        middle_idx = int((start_idx + end_idx) / 2)

        # Get the middle value
        middle_value = values[middle_idx]
        
        if middle_value < value:
            # The value that we're searching for is greater than the
            # value in the middle of the current range. So if it's
            # present in the list, it must be in the right half of
            # the current range. "Rule out" the left half be updating
            # the start index to be equal to the middle index, plus 1.
            start_idx = middle_idx + 1
        elif middle_value > value:
            # In this case, the value must be in the left half of the
            # current range (if it's present at all). "Rule out" the
            # right half by updating the end index to be equal to the
            # middle index, minus 1.
            end_idx = middle_idx - 1
        else:
            # The middle value is EQUAL to the value that we're 
            # search for. That means we found it. Return its
            # index.
            return middle_idx

    # If the function still hasn't terminated, but while loop ended,
    # then we ruled out the entire list and failed to find the value.
    # Return None.
    return None
    
def main() -> None:
    # A SORTED list of values that we can search through using
    # binary search. It must be sorted in ascending order (we could
    # do descending order, but then we'd have to invert the logic in
    # the binary_search() function).
    some_list = [1, 7, 8, 12, 15, 1000]

    print(f'The list is: {some_list}')

    search_value = int(input('What value would you like to know the '
        'index of?: '))

    index_of_value = binary_search(some_list, search_value)
    if index_of_value is None:
        print(f"Sorry, I couldn't find {search_value} in the list.")
    else:
        print(f'The index of {search_value} is {index_of_value}')

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>And here are some example runs:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python binarysearch.py 
The list is: [1, 7, 8, 12, 15, 1000]
What value would you like to know the index of?: 9
Sorry, I couldn't find 9 in the list.
(env) $ python binarysearch.py 
The list is: [1, 7, 8, 12, 15, 1000]
What value would you like to know the index of?: 15
The index of 15 is 4
`
      }</TerminalBlock>

      <P>Linear search is so-named because the number of iterations that it requires is, in the worst case, a linear function of (proportional to, and in this case equal to) the length of the list. In contrast, the number of iterations required by binary search is, in the worst case, a logarithmic function (proportional to the logarithm of) the length of the list. Indeed, this means that binary search can be substantially faster than linear search, especially for very large lists.</P>

      <P>However, keep in mind that binary search does not work unless the list is sorted beforehand. Sorting a list takes longer than conducting a linear search, so if you just need to conduct a <It>single</It> search, it would be faster to do a linear search than it would be to sort the list and then conduct a binary search.</P>

      <P>(If you take a data structures course, you'll find that carefully arranging and structuring data in a particular way often has profound effects on the performance of various operations that could be conducted on that data, including searching, insertions, removals, and more).</P>

      <SectionHeading id="sorting">Sorting</SectionHeading>

      <P><Bold>Sorting</Bold> refers to a class of problems in which you have a collection of data, and your goal is to re-order (sort) that data according to one or more properties. For example, you might have a list of <Code>Person</Code> objects, and you need to sort the list in alphabetical order of people's names (or perhaps in ascending order of their ages, or according to some other property).</P>

      <P>An algorithm that solves this class of problem is known as a <Bold>sorting algorithm</Bold>. There are countless sorting algorithms. Many of them fall under the category of <Bold>comparative sorting algorithms</Bold>. These sorting algorithms work by comparing two elements to one another and deciding how to rearrange them based on the result of that comparison. There are also non-comparative sorting algorithms, but they're beyond the scope of this course.</P>

      <P>We'll discuss three comparative sorting algorithms: <Bold>selection sort</Bold>, <Bold>insertion sort</Bold>, and <Bold>merge sort</Bold> (though understand that there are many others). Again, we'll assume that we're dealing with a list (or array) as opposed to some other data structure.</P>

      <SectionHeading id="selection-sort">Selection sort</SectionHeading>

      <P><Bold>Selection sort</Bold> is perhaps the most intuitive sorting algorithm. Suppose you want to sort a list of integers in ascending order. Then selection sort would go something like this:</P>

      <Enumerate listStyleType="decimal">
        <Item><P>Maintain two parts of the list: a sorted part on the left, and an unsorted part on the right. They're divided by an imaginary line. Initially, that line is at the very left of the list (i.e., the entire list is unsorted).</P></Item>
        <Item><P>Select (find) the smallest value in the unsorted part of the list. This can be done by iterating through the entire unsorted part of the list, keeping track of the smallest discovered value and comparing each subsequent element to that value. Whenever a smaller value is found, update the variable that keeps track of the smallest discovered value accordingly.</P></Item>
        <Item><P>Swap the selected value with the first value in the unsorted part of the list.</P></Item>
        <Item><P>Take the imaginary line that divides the two parts of the list and shift it over one space to the right. It should now be immediately to the right of the value that you just put at the beginning of the unsorted part of the list (which is now the last value in the sorted part of the list).</P></Item>
        <Item><P>Repeat steps 2-4 until the imaginary line is at the very right of the list (technically, you can stop one iteration before that).</P></Item>
      </Enumerate>

      <P>Put another way, selection sort involves finding the smallest element and swapping it with the first element in the list; finding the second smallest element and swapping it with the second element in the list; and so on. This results in the list being sorted in ascending order after N-1 iterations (where N is the length of the list). Each of those iterations in turn requires iterating through the entire unsorted part of the list to find the smallest (or largest, or otherwise "most extreme") element. A typical implementation, then, often looks like a for loop inside a for loop.</P>

      <P>To sort in descending order, simply find the largest element in the unsorted part of the list (instead of the smallest) at each iteration.</P>

      <P>Like all other comparative sorting algorithms, selection sort can be applied to sort a list according to any sort key for which two elements' respective keys can be compared to determine which should come first in the target sorted ordering. For example, it could be used to sort a list of people by their ages in ascending order because two ages can be compared with one another to determine which is smaller. But it can also be used to sort a list of people by their names in alphabetical order because two names can be compared with one another to determine which one comes first in the alphabet.</P>

      <P>That's to say, comparative sorting algorithms work with numbers, but they also work with other kinds of comparable data.</P>

      <P>For the sake of time, I'll leave the implementation as an exercise for the reader (merge sort is more complicated anyways, and <Link href="#merge-sort">we'll be implementing it together in a bit</Link>).</P>

      <SectionHeading id="insertion-sort">Insertion sort</SectionHeading>

      <P>Another fairly intuitive sorting algorithm is <Bold>insertion sort</Bold>. It's similar to selection sort at a high level, but they differ in some details:</P>

      <Enumerate listStyleType="decimal">
        <Item><P>Maintain two parts of the list: a sorted part on the left, and an unsorted part on the right. They're divided by an imaginary line. Initially, that line is immediately to the right of the first element in the list (i.e., the first element is in the sorted part, but the rest of the list is in the unsorted part).</P></Item>
        <Item><P>Take the first element in the unsorted part of the list and insert it into its correct sorted position in the sorted part of the list. When done on a Python list or array, this typically involves repeatedly comparing the element with the neighbor to its left and, if it's smaller than said neighbor, swapping the two elements (i.e., "push" the element to the left until it's larger than whatever is to its left). If everything to the left of the element is smaller than it, then simply keep swapping it with the neighbor to its left until it's at the very left of the entire list.</P></Item>
        <Item><P>Take the imaginary line that divides the two parts of the list and shift it over one space to the right.</P></Item>
        <Item><P>Repeat steps 2-3 until the imaginary line is at the very right of the list.</P></Item>
      </Enumerate>

      <P>Put another way, insertion sort basically builds up a new list from the original list, but it builds it up in sorted order as it goes: as it pulls elements from the original list, it inserts them into the sorted list in their correct positions.</P>

      <P>However, it's a bit more clever than <It>actually</It> creating a second list. Instead, it reuses space within the original list<Emdash/>the "new" sorted list just goes on the left, and the "original" unsorted list just goes on the right. That is, rather than deleting elements from one list and inserting them into a new list, it just swaps elements around within the single original list, moving them from the unsorted part on the right into the sorted part on the left.</P>

      <P>Much like selection sort, insertion sort produces a sorted list after N-1 iterations. Each of those iterations requires pushing an element to the left several times (up to N-1 times at most). Again, a typical implementation often looks like a for loop inside a for loop.</P>

      <P>Again, for the sake of time, I'll leave the implementation as an exercise for the reader.</P>

      <SectionHeading id="merge-sort">Merge sort</SectionHeading>

      <P>Selection sort and insertion sort can be slow when sorting extremely large lists or arrays. There are actually ways of formalizing <It>how</It> slow they are (e.g., via runtime complexity analysis). You'll learn how to do that if you take a course on data structures and / or algorithms.</P>

      <P>As it turns out, there are other sorting algorithms that are provably faster than selection sort and insertion sort in terms of worst-case upper-bounded runtime complexity. In other words<Emdash/>loosely speaking<Emdash/>there are other sorting algorithms that tend to be faster when dealing with extremely large lists.</P>

      <P>There are actually several such sorting algorithms, but we'll just discuss one of them: <Bold>merge sort</Bold>. Merge sort is sort of the "classic" recursive sorting algorithm. Recall that recursion usually lends itself well to problems that can be broken down into smaller instances of themselves. Think for a moment: how can a sorting problem be broken down into <It>smaller</It> sorting problems? Put another way: if you were capable of sorting small lists, how could that help you sort a larger list?</P>

      <P>There are a few different answers to this question, and merge sort provides one of them: rather than sorting a large list of size N, consider breaking it into two <It>halves</It>, and then sorting both of those <It>half-lists</It> (each of size N/2). Once you've sorted the left half of the list and the right half of the list independently, all you need to do is "merge" them back together into a single, large sorted list of size N.</P>

      <P>How do we sort the smaller half-lists? Simple: with recursion. Indeed, we're describing an algorithm for sorting a list of size N, and the steps of that algorithm involve sorting two smaller lists each of size N/2. The algorithm can simply call upon itself to solve those two smaller problems.</P>

      <P>Every recursive algorithm needs a base case. The base case here is simple: any list whose size is 0 or 1 is <It>already</It> sorted, regardless of the target sorting order (i.e., a list with 0 or 1 element in it cannot possibly be "out of order"). So if N is equal to 0 or 1, then the algorithm can simply return immediately, doing absolutely nothing.</P>

      <P>Here's some high-level Python code for ascending merge sort:</P>

      <PythonBlock showLineNumbers={false}>{
`def merge_sort(values: list[int]) -> list[int]:
    if len(values) <= 1:
        # Base case. Return the list as-is since it's already sorted
        return values

    # Split the list into two smaller lists. We can use Python's list
    # slicing syntax to do this pretty easily.
    num_values_in_left_half = int(len(values) / 2)
    left_half = values[:num_values_in_left_half]
    right_half = values[num_values_in_left_half:]
    
    # Recursively sort the smaller half-lists
    left_half = merge_sort(left_half)
    right_half = merge_sort(right_half)

    # TODO Merge the two sorted lists into one big sorted list
    # ??? How do we do this?
`
      }</PythonBlock>

      <P>I've obviously left out an important part: the merging. How do you merge two small sorted lists into a single large sorted list?</P>

      <P>Well, the merge algorithm looks a bit different for different data structures. And, in fact, when you're sorting a Python list, there are a couple different merge algorithms that will work. But the most common one goes like this:</P>

      <Enumerate listStyleType="decimal">
        <Item><P>Create a new, empty list. Let <Code>new_list</Code> denote this new list.</P></Item>
        <Item><P>Maintain two indices: <Code>i</Code> and <Code>j</Code>. Initialize both of them to <Code>0</Code>.</P></Item>
        <Item><P>Compare the element in the left half-list at index <Code>i</Code> with the element in the right half-list at index <Code>j</Code>. Whichever is smaller, append it to <Code>new_list</Code> and increment the corresponding index (i.e., if the element in the left half-list is smaller, append it to <Code>new_list</Code> and increment <Code>i</Code>; if the element in the right half-list is smaller, append it to <Code>new_list</Code> and increment <Code>j</Code>).</P></Item>
        <Item><P>Repeat step 3 until all of the values from one of the two half-lists has been appended to <Code>new_list</Code>.</P></Item>
        <Item><P>Append the remaining values from the remaining half-list to <Code>new_list</Code> in left-to-right order.</P></Item>
        <Item><P>Return <Code>new_list</Code>.</P></Item>
      </Enumerate>

      <P>I encourage you to stop for a moment and prove to yourself that this algorithm works.</P>

      <P>Let's see the implementation:</P>

      <PythonBlock fileName="mergesort.py">{
`# Merges two small sorted lists into one big sorted list
def merge(
        left_half: list[int],
        right_half: list[int]) -> list[int]:
    # Create the new list, initially empty
    new_list = []
    
    # Create i and j, initializing them to 0
    i = 0
    j = 0

    # Until all elements from one of the half-lists have been
    # appended to new_list...
    while i < len(left_half) and j < len(right_half):
        # Between left_half[i] and right_half[j], take whichever
        # is smaller. Append it to new_list and increment the
        # corresponding index (i or j) accordingly.
        if left_half[i] < right_half[j]:
            new_list.append(left_half[i])
            i += 1
        else:
            new_list.append(right_half[j])
            j += 1

    if i >= len(left_half):
        # If we exhausted the left half-list, then append the remaining
        # elements from the right half-list
        while j < len(right_half):
            new_list.append(right_half[j])
            j += 1
    else:
        # Otherwise, we must have exhausted the right half-list.
        # Append the remaining elements from the left half-list.
        while i < len(left_half):
            new_list.append(left_half[i])
            i += 1

    # Return the new list
    return new_list

def merge_sort(values: list[int]) -> list[int]:
    if len(values) <= 1:
        # Base case. Return the list as-is since it's already sorted
        return values

    # Split the list into two smaller lists. We can use Python's list
    # slicing syntax to do this pretty easily.
    num_values_in_left_half = int(len(values) / 2)
    left_half = values[:num_values_in_left_half]
    right_half = values[num_values_in_left_half:]
    
    # Recursively sort the smaller half-lists
    left_half = merge_sort(left_half)
    right_half = merge_sort(right_half)

    # Merge the two sorted lists into one big sorted list, returning
    # the result
    return merge(left_half, right_half)

def main() -> None:
    some_list = [5, 7, 1, 2, 12, -100]
    print(f'Unsorted list: {some_list}')

    # Sort some_list, then update some_list to refer to that new
    # sorted version.
    some_list = merge_sort(some_list)

    print(f'Sorted list: {some_list}')

if __name__ == '__main__':
    main()
`
      }</PythonBlock>

      <P>I've also added a <Code>main()</Code> function so that we can easily test it. Here's the output:</P>

      <TerminalBlock copyable={false}>{
`(env) $ python mergesort.py 
Unsorted list: [5, 7, 1, 2, 12, -100]
Sorted list: [-100, 1, 2, 5, 7, 12]`
      }</TerminalBlock>

      <P>Of course, our implementation could easily be adapted to sort a list of floats, or a list of people according to their ages, or a list of people in alphabetical order of their names, etc.</P>

      <P>There are plenty of things that we could do to improve our implementation. First of all, there's actually no need to literally create two new, smaller lists via Python's slicing syntax. Rather, when we want to split the list in half, we can just draw an "imaginary line" between the two halves of the list but still keep them all in the same list (similar to the "imaginary line" in selection sort and insertion sort). This requires some careful index arithmetic, and it would require passing start and end indices as arguments to the <Code>merge_sort()</Code> and <Code>merge()</Code> functions, but it's very doable, and it'd save the computer both time and memory. Second, there are ways that we could make use of <Code>range()</Code> to replace some of the while loops with for loops, which would probably make the code a bit cleaner. I'll leave these things as exercises for the reader.</P>

      <P>Before we conclude this lecture, there are a couple things that I should point out about merge sort. First, as I already mentioned, it tends to be faster than selection sort and insertion sort when used to sort extremely large lists. This is because it has a smaller upper bound on its worst-case runtime complexity (which you'll learn about in data structures / algorithms). However, it's not <It>always</It> faster than selection sort and / or insertion sort. For smaller lists, selection and insertion sort tend to be faster. Moreover, insertion sort is (famously) very efficient when sorting a list that's already <It>partially</It> sorted (this is provable under certain formal definitions of partial sortedness). It's often much faster than merge sort and similar algorithms in such cases.</P>

      <P>(And indeed, sorting a list that's already partially (or mostly) sorted is <It>extremely</It> common. For example, a game's rendering engine might sort game objects according to their distance from the player so that they can be rendered in back-to-front order. This is necessary to achieve the correct overlaying and occlusion if an order-independent transparency rasterization algorithm isn't used.)</P>

      <P>Second, although merge sort tends to be faster than selection and insertion sort on very large lists, it also consumes more memory. There are a couple reasons for this. First of all, remember our discussion about the impact of recursion on memory consumption. If a function call A was executed by another function call B, which was in turn executed by another function call C, then at the moment that A is executing, B and C are "paused". Although they're paused, they haven't yet terminated, so all of the memory that they've allocated (e.g., to store their variables and the objects referenced by those variables) is still in use. In the case of merge sort, the maximum number of nested recursive calls on the call stack at any given point in time is a logarithmic function of the length of the list (it's roughly log_2(N) + 1). The amount of memory consumed by merge sort will therefore be <It>at least</It> proportional to this value.</P>

      <P>But there's a bigger reason that merge sort consumes a lot of memory: the merge algorithm is not <Bold>in-place</Bold>. An in-place sorting algorithm is a sorting algorithm that works by simply moving elements around within the data structure rather than by creating <It>new</It> data structures. Insertion sort and selection sort can both easily be implemented without needing to create new lists<Emdash/>they work simply by moving elements around within the <It>given</It> list. That's not the case for merge sort. Our above merge algorithm requires creating <Code>new_list</Code> and appending all N elements to it, one at a time. This means that when <Code>merge_sort()</Code> is executed on a list of size N, it needs to allocate <It>another</It> list of size N in order to conduct the merge process. What's worse, keep in mind that <Code>merge_sort()</Code> calls itself <It>two</It> more times, and each of those function calls in turn call <Code>merge_sort()</Code> <It>two</It> more times, and so on, until the base case is reached. Of course, when it calls itself, it does so on a list of half the size. Moreover, when the <Code>merge_sort()</Code> function returns the new list, that return value is used to replace an <It>old</It> list at the call site, so old lists are deleted just as quickly as new lists are created. But one way or another, merge sort consumes more memory than insertion sort or selection sort, and this is the reason.</P>

      <P>There are some ways around this. For example, there exist in-place merge algorithm implementations. However, most of these implementations are slow (in which case using them discards all the advantages of merge sort to begin with) or otherwise extremely complicated.</P>

      <P>(Note that this isn't necessarily the case when working with other data structures. For example, merge sort can be implemented in-place on a linked list quite easily.)</P>

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
