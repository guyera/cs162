from typing import TextIO

def process_file(data_file: TextIO) -> None:
    max_population_so_far = 0

    # Keep track of the line number. This will help us skip the
    # header row
    line_number = 1
    for current_line in data_file:
        # We need to skip the header row since it doesn't actually
        # have any data in it. That is, only process lines 2 and on
        if line_number >= 2:
            # Strip the newline character from the end of the line
            current_line = current_line.strip()

            # Split the line into two smaller strings (tokens): one
            # containing the city name, and one containing the
            # population.
            tokens = current_line.split(',')

            # 'tokens' is a list containing two strings: the city name,
            # and the city population. Let's store these in two 
            # separate variables to make things easy. While we're at
            # it, let's convert the population to an integer variable
            # instead of a string (which would throw a ValueError if
            # the city's population is not specified as a whole number
            # in data.txt).
            current_city_name = tokens[0]
            current_city_population = int(tokens[1])

            # Check if the population is greater than any we have seen
            # so far (this would not have been possible if we hadn't
            # converted the second token to an integer via
            # type-casting)
            if current_city_population > max_population_so_far:
                # We found a new largest city in the file. Let's record
                # that
                max_population_so_far = current_city_population
                
                # We also need to keep track of the name of the largest
                # city so that we can print it at the end.
                name_of_largest_city = current_city_name

        # Increment line_number for the next iteration
        line_number += 1

    # The for loop is over. max_population_so_far should store the
    # population of the largest city, and name_of_largest_city
    # should store its name.
    print(f'Largest city: {name_of_largest_city}')
    print(f'Population: {max_population_so_far}')
        

def main() -> None:
    with open('data.txt', 'r') as data_file:
        process_file(data_file)

if __name__ == '__main__':
    main()
