from typing import Optional

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
