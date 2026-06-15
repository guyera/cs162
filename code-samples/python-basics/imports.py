from math import sqrt

def main() -> None:
    x = 100

    # Notice: just sqrt(x), as opposed to math.sqrt(x)
    y = sqrt(x) # compute y as the square root of x

    # Prints The square root of 100 is 10
    print(f'The square root of {x} is {y}')

if __name__ == '__main__':
    main()
