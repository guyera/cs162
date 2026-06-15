from animals.dog import Dog

def main() -> None:
    # Call the Dog constructor to create spot, passing in "Spot"
    # as the name and 2022 as the birth year. The constructor will
    # then store these values within spot.name and spot.birth_year
    spot = Dog('Spot', 2022)

    # Print spot's information to the terminal
    spot.print()

if __name__ == '__main__':
    main()
