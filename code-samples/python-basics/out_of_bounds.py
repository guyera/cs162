def main() -> None:
    # Create a list with 3 strings in it
    some_cool_words = ['Anomaly', 'Calamity', 'Anachronism']

    # The list has 3 elements, so the valid indices are 0, 1, and 2. An
    # index of 3 would be out-of-bounds. This throws an exception:
    print(some_cool_words[3])

    # Print the list to the terminal
    print(some_cool_words)

if __name__ == '__main__':
    main()

