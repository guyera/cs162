def main() -> None:
    ages_of_people = {
        'John': 46,
        'Mahatma': 72,
        'Aditya': 34
    }

    # Add another person and their age to the dictionary:
    ages_of_people['Mohammad'] = 21

    # Change Mohammad's age to 22 (notice---it's exactly the same
    # syntax as above!)
    ages_of_people['Mohammad'] = 22

    # Remove John and his age from the dictionary
    del ages_of_people['John']

    chosen_name = input('Whose age would you like to look up?: ')

    # When used on a dictionary, the 'in' operator checks whether
    # the given KEY is present
    if chosen_name in ages_of_people:
        associated_age = ages_of_people[chosen_name]

        print(f"That person's age is {associated_age}")
    else:
        print(f"Sorry! I don't know the age of {chosen_name}")

if __name__ == '__main__':
    main()
