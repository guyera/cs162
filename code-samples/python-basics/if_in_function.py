def foo() -> int:
    number = int(input("What's your favorite number?\n"))
    # If their favorite number is greater than 10, return 1
    if number > 10:
        return 1

    # In all other cases, return 0. This is a "catch all".
    # Mypy can easily prove that this function will never
    # terminate without returning an int (which is the function's
    # return type). That makes Mypy happy, so it doesn't raise
    # any errors.
    return 0

def main() -> None:
    foo()

if __name__ == '__main__':
    main()
