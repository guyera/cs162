def main() -> None:
    # Type-cast the user's input to an int before storing it
    # in birth_year. An alternative solution would be to type-cast
    # birth_year into an int when embedding it into the F-string,
    # but this solution allows us to treat birth_year as an int
    # from this point on without having to repeatedly type-cast it
    # every time we reference it.
    birth_year = int(input('What year were you born?\n'))
    
    print(f'Your age is (roughly) {2025 - birth_year}')

if __name__ == '__main__':
    main()
