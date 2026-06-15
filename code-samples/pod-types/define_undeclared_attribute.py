# Define the City class
class City:
    # Notice: I've now omitted the name attribute declaration
    population: int # Every city has a population, which is an integer

def main() -> None:
    my_cool_city = City()

    # Give our city a name and a population
    my_cool_city.name = "Chicago" # Static type error here
    my_cool_city.population = 2721000
    
    # Now that my_cool_city.name and my_cool_city.population have been
    # defined at runtime (not just statically declared), we can proceed
    # to use these variables however we'd like (e.g., print them to the
    # terminal, or do anything else that you might want to do with
    # a string or integer)
    print(my_cool_city.name)
    print(my_cool_city.population)

    # my_cool_city.population is an integer, so we can even use it
    # in mathematical operations if we'd like (again, it's just like
    # any other integer---it's just inside another, larger variable
    # called my_cool_city)
    print(f"Half of chicago's population is: "
        f"{my_cool_city.population / 2}")
          
if __name__ == '__main__':
    main()
