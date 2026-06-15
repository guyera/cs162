def main() -> None:
    x = 14

    # Increase x by 1, to 15
    x = x + 1
    print(x) # Prints 15

    # This is shorthand for the same idea---it increases x
    # by 1
    x += 1
    print(x) # Prints 16

    # Importantly, this does NOT increase x by 1. It simply
    # computes the value of x + 1, and then does NOTHING
    # with that value (this is a valid line of code, but
    # it's essentially useless)
    x + 1

if __name__ == '__main__':
    main()
