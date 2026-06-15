def area_of_circle(radius: float) -> float:
    return 3.141592 * radius * radius

def main() -> None:
    # The interpreter will evaluate area_of_circle(5) by calling
    # the area_of_circle function, passing in 5 as the argument.
    # It will then replace {area_of_circle(5)} with the return
    # value.
    print(f'The area of a circle with radius 5 is {area_of_circle(5)}')

    # This will print "x is 10, and y is 7.5"
    x = 10
    y = 7.5
    print(f'x is {x}, and y is {y}')

    # Notice: the below string literal is missing the letter
    # f before the opening apostrophe. Hence, it is NOT an
    # F-string. It's just a regular string literal. This will
    # print "x is {x}, and y is {y}" (the braced expressions
    # are not evaluated; they're just treated as text to be
    # printed)
    print('x is {x}, and y is {y}')

if __name__ == '__main__':
    main()
