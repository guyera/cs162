def main() -> None:
    # Notice: Mahatma is present in the list twice
    names = ['Mahatma', 'Aditya', 'Mohammad', 'Samantha', 'Richard',
             'Mahatma', 'John']

    unique_names = set(names)

    # Mahatma will only be present in this set once
    print(unique_names)


if __name__ == '__main__':
    main()
