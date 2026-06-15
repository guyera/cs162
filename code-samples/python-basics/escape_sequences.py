def main() -> None:
    # Print "Hello," followed by an endline sequence, followed
    # by "World!" (i.e., print "Hello," and "World!" each on
    # their own lines in the terminal, all with a single
    # print() statement).
    print('Hello,\nWorld!')

    # Print the numbers 7-15. The first three numbers (7-9)
    # are printed on the first line, separated by TABs (\t).
    # The next three numbers (10-12) are printed on the second
    # line, also separated by TABs. The last three numbers (13-15)
    # are printed on the third line, also separated by TABs.
    print('7\t8\t9\n10\t11\t12\n13\t14\t15')

    # Print an apostrophe in a string literal that uses
    # apostrophes as the enclosing symbol (\' is an escape
    # sequence for an apostrophe)
    print('Shepherd\'s Pie')

    # Print a quotation mark in a string literal that uses
    # quotation marks as the enclosing symbol
    print("\"Four score and seven years ago\"")

    # Print a backslash character (\\ is the escape sequence
    # for a backslash)
    print('\\')

if __name__ == '__main__':
    main()

