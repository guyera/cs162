def main() -> None:
    password = input("What's the password?\n")
    
    if password == '1234':
        print('Correct. Come on in.')
    elif password == 'password':
        print('Very funny.')
    else:
        print('Wrong password!')

if __name__ == '__main__':
    main()
