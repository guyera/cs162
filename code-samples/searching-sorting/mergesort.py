# Merges two small sorted lists into one big sorted list
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
