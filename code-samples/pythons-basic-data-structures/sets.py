def main() -> None:
    # Create a set of integers denoting all of the recent leap years
    recent_leap_years = {1996, 2000, 2004, 2008, 2012, 2016, 2020}

    # Add 2024 to the set
    recent_leap_years.add(2024)

    # Try to add 2024 to the set again. This does NOTHING.
    recent_leap_years.add(2024)

    # Remove 1996 from the set
    recent_leap_years.remove(1996)

    # Try to remove 1996 from the set again. This throws a KeyError,
    # causing the program to crash if it's not caught.
    recent_leap_years.remove(1996)

    # Print the set
    print(recent_leap_years)

    # Ask user for a year:
    chosen_year = int(input('Specify a year later than 1999: '))

    # Check if the user's specified year is in the set
    if (chosen_year in recent_leap_years):
        print('The specified year was a recent leap year')
    else:
        print('The specified year was NOT a recent leap year')

if __name__ == '__main__':
    main()
