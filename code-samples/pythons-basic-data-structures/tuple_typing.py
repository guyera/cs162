from math import sqrt

def quadratic_formula(
        a: float,
        b: float,
        c: float) -> tuple[float, float]:
    first_root = (-b - sqrt(b**2 - 4*a*c)) / (2 * a)
    second_root = (-b + sqrt(b**2 - 4*a*c)) / (2 * a)
    return first_root, second_root # Return the roots as a tuple

def main() -> None:
    # Consider the quadratic equation 4x^2 + 2x - 3 = 0. Under the
    # standard pattern (ax^2 + bx + c), that means:
    # a = 4, b = 2, c = -3.

    # Compute the roots using the quadratic formula:
    x1, x2 = quadratic_formula(4, 2, -3)

    print('The roots of the equation "4x^2 + 2x - 3 = 0" are:')
    print(f'x1: {x1}')
    print(f'x2: {x2}')

if __name__ == '__main__':
    main()
