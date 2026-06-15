def main() -> None:
    list_of_strings = ['the', 'quick', 'brown', 'fox']
    joined_string = ','.join(list_of_strings)
    print(joined_string) # Prints the,quick,brown,fox

    joined_string = '+-+'.join(list_of_strings)
    print(joined_string) # Prints the+-+quick+-+brown+-+fox

if __name__ == '__main__':
    main()
