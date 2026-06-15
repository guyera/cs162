def main() -> None:
    value_sum = 0

    # The condition "True" is ALWAYS true. Ordinarily, that would
    # make this an infinite loop (a loop that runs repeatedly
    # forever). However, the break statement in the loop body
    # provides a way for the loop to terminate.
    while True:
        next_value = int(input('Enter a number: '))
        value_sum += next_value

        quit_input = input("Type q if you'd like to quit. "
                           "Otherwise, type anything else: ")

        if quit_input == 'q':
            # The user wants to quit. Terminate the loop.
            break
    
    # The control flow will only reach this point once the user
    # types 'q' to quit. That means that they're done entering
    # numbers. Let's print the sum of all the numbers that
    # they entered:
    print(f'The sum of all the numbers you entered is {value_sum}')

if __name__ == '__main__':
    main()
