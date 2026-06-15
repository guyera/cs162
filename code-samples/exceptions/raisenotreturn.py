from traceback import print_exc

def cool_function(x: int) -> int:
    if x == 1:
        return 100
    elif x == 2:
        return 1000
    
    raise ValueError(f'x must be either 1 or 2, but got {x}')

def main() -> None:
    # Prints 100
    print(cool_function(1))

    # Prints 1000
    print(cool_function(2))
    
    try:
        # Never gets a chance to print anything. It raises an
        # exception, which gets thrown here to main(). It then
        # immediately jumps to the except block below.
        print(cool_function(3))
    except ValueError as e:
        print("cool_function(3) failed. Here's the traceback: ")
        print_exc()

    # Also never gets a chance to print anything. It raises an
    # exception, which gets thrown here to main(). But we don't
    # catch it here, so it gets propagated down the call stack
    # (in this case, it's never caught, so the program crashes).
    print(cool_function(4))
    

if __name__ == '__main__':
    main()

