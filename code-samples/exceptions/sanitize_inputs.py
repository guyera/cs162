def prompt_for_integer(prompt: str) -> int:
    supplied_valid_input = False
    while not supplied_valid_input:
        try:
            # If the user types in something other than an integer,
            # the int() type cast will fail and throw a ValueError,
            # jumping to the below except block. Otherwise, it will
            # continue on and set supplied_valid_input to True.
            chosen_integer = int(input(prompt))
            
            supplied_valid_input = True
        except ValueError as e:
            print('Error: You must enter an integer!')

            # Leave supplied_valid_input False, forcing the loop
            # to run again.

    # The while loop has ended, which must mean that the user supplied
    # an invalid input. Return it.
    return chosen_integer

def main() -> None:
    favorite_number = prompt_for_integer(
        'Enter your favorite whole number: '
    )

    if favorite_number == 42:
        print("You must be a fan of Hitchhiker's Guide to the Galaxy!")
    else:
        print('Ah, I see...')

if __name__ == '__main__':
    main()
