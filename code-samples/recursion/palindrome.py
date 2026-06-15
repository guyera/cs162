def palindrome(s: str) -> bool:
    # A string is a palindrome if and only if:
    #   1. The first character is equal to the last character
    #   AND
    #   2. The smaller string consisting of everything in between the
    #      first and last characters is, itself, a palindrome. This
    #      is the recursive part of our solution.

    # As we recurse, we'll be dealing with smaller and smaller strings.
    # The size will decrease by 2 at each recursive step. The base
    # cases are strings of length 0 and strings of length 1 (because,
    # in either of those two cases, there is no "inner" substring
    # on which to recurse). Let's handle these base cases up front:
    if len(s) <= 1:
        # s is of length 0 or 1. All strings of length 0 or 1 are
        # inherently palindromes. So just return true.
        return True

    # In all other cases, we have to check both conditions. First,
    # verify that the first and last character are equal to each other:
    if s[0] != s[len(s) - 1]:
        # The first and last character are NOT the same, so s must
        # not be a palindrome. Return False
        return False

    # If the function is still going, then the first and last character
    # must be the same. Check the second condition: verify that
    # the "inner" substring is a palindrome. We can use Python's
    # slice indexing to get the inner substring: use 1 for the start
    # index and len(s) - 1 as the (exclusive) end index.
    inner_substring = s[1 : len(s) - 1]
    
    # Now check whether inner_substring is a palindrome
    if not palindrome(inner_substring):
        # It's not a palindrome, so return False
        return False

    # If the function is still going, then s passed both conditions,
    # so it must be a palindrome. Return True
    return True

def main() -> None:
    word = input('Enter a word: ')
    if palindrome(word):
        print(f'"{word}" is a palindrome')
    else:
        print(f'"{word}" is not a palindrome')

if __name__ == '__main__':
    main()
