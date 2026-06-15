from traceback import print_exc

def main() -> None:
    best_numbers = [42, 7, 777, 24, 25]

    chosen_index = int(input('Which number would you like to see? '
        'For example, type "0" to see the first number, "1" to see '
        'the second number, and so on: '))

    try:
        # Try to do the following, knowing that an error might occur
        # in the process. NOTE: THIS EXAMPLE IS JUST TO DEMONSTRATE THE
        # SYNTAX OF EXCEPTIONS. I DO NOT ACTUALLY RECOMMEND THAT YOU
        # USE EXCEPTIONS FOR INDEX / BOUNDS CHECKING. READ THE REST
        # OF THIS SECTION CAREFULLY.
        print(f'The number you chose is: {best_numbers[chosen_index]}')

        # If chosen_index is not between 0 and 4,
        # best_numbers[chosen_index] will attempt to access an
        # element that doesn't exist, throwing an IndexError.
        # In such a case, this whole try block immediately ends, and
        # the program jumps to the except block down below.
    except IndexError as e:
        # If the try block above throws an IndexError at any point,
        # the program will jump to this except block. This is where
        # we "handle" the error (whatever that means, depending on
        # the context). In this case, we'll just tell the user that
        # that they entered an invalid index.
        print('Error: The index must be between 0 and 4, inclusive.')

        # The error (exception) itself is a value, and it's stored in
        # the variable e (that's what I named it on line 23 above---you
        # can name it whatever you want). e contains information about
        # the error that occurred. For example, you can print it to
        # the terminal, which prints a short message describing
        # the error:
        print()
        print(e)

        # You can also print its traceback via print_exc() (this can
        # only be done within an except block). print_exc is provided
        # by the traceback module (imported on line 1 above). This is
        # what would normally be printed if the program failed to catch
        # the exception and crashed as a result:
        print()
        print('Traceback:')
        print_exc()

    # Once the above try / except blocks are done executing, the
    # program continues normally from here. It does NOT simply crash /
    # end immediately.


if __name__ == '__main__':
    main()
