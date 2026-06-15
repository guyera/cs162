def main() -> None:
    my_tuple = ('James', 25, 'Strawberries')
    print(my_tuple[0]) # Prints James
    print(my_tuple[1]) # Prints 25
    print(my_tuple[2]) # Prints Strawberries

    # Try to change 'James' to 'Jesse'. This isn't allowed. Crashes the
    # program
    my_tuple[0] = 'Jesse' 

if __name__ == '__main__':
    main()
