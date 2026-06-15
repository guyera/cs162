class City:
    name: str # Every city has a name, which is a string
    population: int # Every city has a population, which is an integer


# Given a city, print all of its information to the terminal
def print_city(city: City) -> None:
    print(f'City name: {city.name}')
    print(f'City population: {city.population}')


def main() -> None:
    my_cool_city = City()

    my_cool_city.name = "Chicago"
    my_cool_city.population = 2721000
    
    # Use the print_city() function to print the information about
    # my_cool_city
    print_city(my_cool_city)

          
if __name__ == '__main__':
    main()
