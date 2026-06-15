def main() -> None:
    list_of_users = ['Roger', 'Jennifer', 'Rob']
    
    user_input = input('What user would you like to search for?\n')
    
    # Check whether the specified user is in the list
    if user_input in list_of_users:
        print('That user is in the list!')
    else:
        print('That user is not in the list!')

if __name__ == '__main__':
    main()
