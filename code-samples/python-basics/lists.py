def main() -> None:
    # Create a list with 3 strings in it
    some_cool_words = ['Anomaly', 'Calamity', 'Anachronism']

    # Print the second element in the list (lists are indexed
    # by 0, so the first element has index 0, the second
    # element has index 1, and so on. We want to print the
    # second element, so we use 1 as our index).
    print(some_cool_words[1])

    # Add a fourth cool word to the end of the list
    some_cool_words.append('Amok')

    # Delete the 3rd element from the list
    del some_cool_words[2]

    # Insert another word at index 1, meaning between the current
    # first and second elements
    some_cool_words.insert(1, 'Clandestine')

    # Print the list to the terminal
    print(some_cool_words)

    # Print the length of the list to the terminal (prints 4)
    print(len(some_cool_words))

if __name__ == '__main__':
    main()
