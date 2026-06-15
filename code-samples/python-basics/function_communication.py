def cool_function(x: int) -> int:
    print(x)
    x = 5
    return x

def main() -> None:
    x = 1
    
    # The below function call prints 1 and returns 5, but the return
    # value is discarded
    cool_function(x)
    
    # Prints 1 (NOT 5---the main() function's x variable is separate
    # from cool_function()'s x variable / parameter)
    print(x)

    # The below function call prints 1 and returns 5. We then store the
    # return value (5) in this function's x variable, changing it from
    # 1 to 5.
    x = cool_function(x)

    print(x) # Prints 5

    # Change this function's x variable back to 1
    x = 1

    # The below function call prints 1 and returns 5. We then store the
    # return value (5) in a new variable named y. This function's
    # x variable remains 1.
    y = cool_function(x)

    print(x) # Prints 1
    print(y) # Prints 5


if __name__ == '__main__':
    main()
