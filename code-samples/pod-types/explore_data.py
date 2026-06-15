from typing import TextIO

class City:
    name: str # Every city has a name, which is a string
    population: int # Every city has a population, which is an integer


# Given a city, print all of its information to the terminal
def print_city(city: City) -> None:
    print(f'City: {city.name}')
    print(f'    Population: {city.population}')


# Given a file, read all of the cities' data from the file, and return
# a list of cities storing all that data.
def read_city_file(file: TextIO) -> list[City]:
    i = 1
    cities = []
    for line in file:
        if i >= 2: # Skip the first line in the file
            # Strip whitespace
            line = line.strip()

            # Extract tokens
            tokens = line.split(',')

            # Create a City variable, storing the name and population
            # values from the line inside its respective attributes
            city = City()
            city.name = tokens[0]
            city.population = int(tokens[1])

            # Append the City variable to our list of cities
            cities.append(city)

        i += 1 # Increment i by 1 (equivalent to 'i = i + 1')

    # The for loop is done. Return the list of cities parsed from the
    # file.
    return cities


# Prompts the user for an integer until they enter one that's valid,
# according to the given list of valid integers. See the Exceptions
# lecture notes for more information.
def prompt_for_integer_in_list(
        prompt: str, # Text to print when prompting the user
        valid_choices: list[int], # List of valid choices
        error_message: str # Text to print when given an invalid input
        ) -> int: # Returns the user's final, valid input
    supplied_valid_input = False
    while not supplied_valid_input:
        try:
            chosen_integer = int(input(prompt))
            if chosen_integer in valid_choices:
                supplied_valid_input = True
            else:
                print(error_message)
        except ValueError as e:
            print(error_message)
       
        print() # Print an empty line to make things easier to read

    return chosen_integer


def option_display_all_cities(cities: list[City]) -> None:
    for city in cities:
        print_city(city)
    print() # Print an empty line to make things easier to read


def option_search_city_by_name(cities: list[City]) -> None:
    chosen_name = input("Enter the city's name: ")
    
    found = False
    for city in cities:
        if city.name == chosen_name:
            # Found the city with the specified name. Print its
            # information
            print_city(city)
            found = True
            break # End the for loop

    if not found:
        print(f'Sorry, I don\'t know anything about the city named '
            f'"{chosen_name}"')

    print() # Print an empty line to make things easier to read


def main() -> None:
    cities_file_name = input('Enter the name of the cities data '
        'file: ')

    quit_program = False

    try:
        with open(cities_file_name, 'r') as cities_file:
            cities = read_city_file(cities_file)
    except FileNotFoundError as e:
        print('Error: File not found')
        quit_program = True
    except OSError as e:
        quit_program = True
        print('Error: Failed to read the file')

    # If we failed to read the file, quit_program will already be True.
    # Otherwise, it'll be False until the user chooses to quit.
    while not quit_program:
        menu_text = ('What would you like to do?\n'
            '    1. Display all cities\n'
            '    2. Search cities by name\n'
            '    3. Quit\n'
            'Enter your choice: ')
        valid_choices = [1, 2, 3]
        input_error_message = 'Error: Invalid choice'
        
        users_choice = prompt_for_integer_in_list(
            menu_text,
            valid_choices,
            input_error_message
        )

        if users_choice == 1:
            option_display_all_cities(cities)
        elif users_choice == 2:
            option_search_city_by_name(cities)
        else:
            quit_program = True

        

if __name__ == '__main__':
    main()
