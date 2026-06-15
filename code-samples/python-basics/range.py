def main() -> None:
    my_range = range(5)

    print(my_range)

    # Printing a range directly isn't very illustrative. Let's
    # try printing it again, but this time we'll type-cast it to
    # a list first (more on lists shortly).
    print(list(range(5)))

if __name__ == '__main__':
    main()
