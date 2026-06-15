from rectangle import Rectangle
from square import Square

def main() -> None:
    # Create a 4x3 rectangle
    r = Rectangle(4.0, 3.0)

    # Change its length to 5 (so that it's a 5x3 rectangle)
    r.set_length(5.0)

    # Print its length and width
    print(f'Length: {r.get_length()}') # Prints 5.0
    print(f'Width: {r.get_width()}') # Prints 3.0

    # Create a 4x4 square
    s = Square(4.0)

    # This now calls the Square set_length() method, which in turn
    # calls the Rectangle class's set_length() AND set_width() methods,
    # setting the square's length AND width to 5. So it's still a
    # square!
    s.set_length(5.0)

    print(f'Length: {s.get_length()}') # Prints 5.0
    print(f'Width: {s.get_width()}') # Prints 5.0

    # Uh oh! It's still possible to call the Rectangle class's setters
    # on s, which it has because the Square class inherits from the
    # Rectangle class (overriding an inherited method does not get rid
    # of it!). This sets s's length to 1.0, but its width is still 5.0.
    # So it's not a valid square anymore :(
    super(Square, s).set_length(1.0)

    print(f'Length: {s.get_length()}') # Prints 1.0
    print(f'Width: {s.get_width()}') # Prints 5.0

if __name__ == '__main__':
    main()
