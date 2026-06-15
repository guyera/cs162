def c() -> None:
    the_list = ['hello']
    
    # Try to print the 100th element, which causes an IndexError
    # to be thrown. Since the below line of code isn't inside a
    # try block with an accompanying except block that's set up
    # to catch an IndexError, the exception will propagate to the
    # function that called THIS function.
    print(the_list[99])

def b() -> None:
    # Call c(), which will throw an IndexError. Since the below
    # line of code isn't inside a try block with an accompanying
    # except block that's set up to catch an IndexError, the
    # exception will propagate to the function that called THIS
    # function.
    c()

def a() -> None:
    # Call b(), which will throw an IndexError. Since the below
    # line of code isn't inside a try block with an accompanying
    # except block that's set up to catch an IndexError, the
    # exception will propagate to the function that called THIS
    # function.
    b()

def main() -> None:
    try:
        # Call a(), which will throw an IndexError. But here, we catch
        # it with the below except block.
        a()
    except IndexError as e:
        print('Exception caught!')

if __name__ == '__main__':
    main()
