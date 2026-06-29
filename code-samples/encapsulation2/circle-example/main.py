from circle import Circle

def main() -> None:
    # We create a circle with radius 5
    c = Circle(5.0)

    # Later, suppose we want to change the circle's radius. We
    # can't access c._radius directly, but we can call c.set_radius()
    # to modify it
    c.set_radius(10.0)

    # Later, suppose we want to get the circle's radius, such as to
    # print it. We can't access c._radius directly, but we can call
    # c.get_radius() to retrieve its current value
    print(c.get_radius()) # Prints 10.0

if __name__ == '__main__':
    main()
