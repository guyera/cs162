# Given a list of names, find the UNIQUE names within that
# list and return them as a set
def get_unique_names(names: list[str]) -> set[str]:
    result = set() # Initially empty
    for name in names:
        # Add each name to the set, or do nothing if it's already in
        # the set
        result.add(name)

    return result
    

def main() -> None:
    # Notice: Mahatma is present in the list twice
    names = ['Mahatma', 'Aditya', 'Mohammad', 'Samantha', 'Richard',
             'Mahatma', 'John']

    unique_names = get_unique_names(names)

    # Mahatma will only be present in this set once
    print(unique_names)


if __name__ == '__main__':
    main()
