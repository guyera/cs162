def main() -> None:
    x = 1
    print(x == 1) # Prints True
    
    print(x < 4) # Prints True
    
    print(x > 4) # Prints False

    x = 3
    y = 7
    print(x + y <= 10) # Prints True

    print(x + y >= 11) # Prints False

    print(x != 4) # Prints True

    # Some relational operators, such as ==, work on more than
    # just numeric expressions:

    my_string = 'Hello'
    print(my_string == 'Hello') # Prints True

    print(my_string != 'Hello') # Prints False

    # Of course, you can store the value of a relational
    # operation in a boolean variable:

    my_string_is_equal_to_goodbye = my_string == 'Goodbye'
    print(my_string_is_equal_to_goodbye) # Prints False

if __name__ == '__main__':
    main()
