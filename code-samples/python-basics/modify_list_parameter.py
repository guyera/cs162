def modify_list(list_of_names: list[str]) -> None:
    list_of_names.append('Liang') # This also modifies the argument
    del list_of_names[0] # This also modifies the argument
    list_of_names.insert(0, 'Joe') # This also modifies the argument
    
    # This does NOT modify the argument.
    list_of_names = ['John', 'Jacob', 'Jingleheimer', 'Schmidt']

def main() -> None:
    some_names = ['Mohammad', 'Mahatma', 'Aditya', 'Zhi']

    modify_list(some_names)

    # Prints ['Joe', 'Mahatma', 'Aditya', 'Zhi', 'Liang']
    print(some_names)
    

if __name__ == '__main__':
    main()
