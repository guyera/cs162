def gcd(a: int, b: int) -> int:
    # Require that a and b both be positive
    if a <= 0 or b <= 0:
        raise ValueError('a and b must both be positive!')

    # Make sure that b <= a. If not, swap them to make it so.
    if b > a:
        temp = b
        b = a
        a = temp

    # Now, in the simple case, if a is divisible by b, simply return
    # b
    if a % b == 0:
        # Remainder of 0 after division means a is divisible by b
        return b

    # If the function is still running, then this is the more
    # complicated case. As we proved, in this case, gcd(a, b) is
    # equivalent to gcd(b, a % b). And that's a simpler / smaller
    # version of the same problem, so we compute the answer via a
    # recursive call and return it
    return gcd(b, a % b)

def main() -> None:
    val1 = int(input('Enter an integer: '))
    val2 = int(input('Enter another integer: '))

    answer = gcd(val1, val2)

    print(f'The GCD if {val1} and {val2} is {answer}')

if __name__ == '__main__':
    main()
