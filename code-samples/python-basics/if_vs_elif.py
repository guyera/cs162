def main() -> None:
    # The following if / elif chain prints "ABC", but it does NOT
    # print "123", even though 3 + 3 is indeed equal to 6. That's
    # because the second block is an elif statement---not just
    # another if statement. Hence, it will execute if and only if
    # 1) its condition (3 + 3 == 6) is true, AND 2) the preceding
    # if statement's condition was false. But the preceding if
    # statement's condition (2 + 2 == 4) was true, so the else if
    # statement body does NOT execute, even though its condition
    # is true.
    if 2 + 2 == 4:
        print('ABC')
    elif 3 + 3 == 6:
        print('123')

    # In contrast, the following if statements operate completely
    # independently of one another; the second if statement knows
    # nothing about the first if statement, and vice-versa. Each
    # if statement's condition is evaluated to true, so both if
    # statement bodies execute. Hence, XYZ is printed, followed by
    # 987.
    if 2 + 2 == 4:
        print('XYZ')
    if 3 + 3 == 6:
        print('987')


if __name__ == '__main__':
    main()
