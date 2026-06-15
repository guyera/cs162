def main() -> None:
    value_sum = 0
    user_wants_to_quit = False
    while not user_wants_to_quit:
        next_value = int(input('Enter a number: '))
        value_sum += next_value

        quit_input = input("Type q if you'd like to quit. "
                           "Otherwise, type anything else: ")

        if quit_input == 'q':
            user_wants_to_quit = True
        # Alternatively: user_wants_to_quit = quit_input == 'q'
    
    # The control flow will only reach this point once the user
    # types 'q' to quit. That means that they're done entering
    # numbers. Let's print the sum of all the numbers that
    # they entered:
    print(f'The sum of all the numbers you entered is {value_sum}')

if __name__ == '__main__':
    main()
