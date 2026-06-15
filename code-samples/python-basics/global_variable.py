PI = 3.141592 # All caps implies that it shouldn't be modified

def area_of_circle(radius: float) -> float:
    # Bind 'PI' to the global variable created on line 1 above
    global PI

    # Now we can use it to compute the area of the circle
    return PI * radius * radius

def main() -> None:
    # Print the area of a circle with radius 10
    print(area_of_circle(10))

if __name__ == '__main__':
    main()
