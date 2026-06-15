from copy import deepcopy # Used for deep copies

class Person:
    name: str

class House:
    owner: Person

def main() -> None:
    joe = Person()
    joe.name = 'Joe'

    house = House()
    house.owner = joe

    # house2 is a DEEP copy of house
    house2 = deepcopy(house)

    # house and house2 refer to separate objects (these print different
    # identifiers)
    print(id(house))
    print(id(house2))
    print()

    # house.owner and house2.owner ALSO refer to different objects
    # (these print different identifiers):
    print(id(house.owner))
    print(id(house2.owner))
    print()

    # No modifications to house2 will result in any modifications to
    # house:
    house2.owner.name = 'Sally'
    print(house2.owner.name) # Prints Sally
    print(house.owner.name) # Prints Joe



if __name__ == '__main__':
    main()
