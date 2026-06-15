def main() -> None:
    print('Hello, ') # The next message will be on a new line
    
    print('World!') # The next message will be on a new line

    print('Hello, ', end='') # The next message will be on the
                             # same line

    print('World!') # The next message will be on a new line

    print('I', end=' ') # There's a space between this message
                        # and the next

    print('like', end=' ') # There's a space between this message
                           # and the next

    print('pie', end=' ') # There's a space between this message
                          # and the next

if __name__ == '__main__':
    main()
