from copy import copy # Used for shallow copies

class Person:
    name: str

class House:
    owner: Person

def main() -> None:
    joe = Person()
    joe.name = 'Joe'

    house = House()
    house.owner = joe

    # house2 is a SHALLOW copy of house
    house2 = copy(house)

    # house and house2 refer to separate objects (these print different
    # identifiers)
    print(id(house))
    print(id(house2))
    print()

    # However, house.owner and house2.owner refer to the SAME
    # object (these print the same identifier):
    print(id(house.owner))
    print(id(house2.owner))
    print()

    # This means that modifying house2.owner.name will ALSO modify
    # house.owner.name (because house2.owner refers to the same
    # object as house.owner)
    house2.owner.name = 'Sally'
    print(house2.owner.name) # Prints Sally
    print(house.owner.name) # Prints Sally

    # Also, house.owner was defined to refer to the same object
    # as the variable 'joe', modifying house.owner.name ALSO
    # modifies joe.name:
    print(joe.name) # Prints Sally
    print()

    # But remember: house and house2 refer to different objects. So
    # modifying house2.owner does NOT modify house.owner
    amanda = Person()
    amanda.name = 'Amanda'
    house2.owner = amanda

    print(house2.owner.name) # Prints Amanda
    print(house.owner.name) # Prints Sally
    print()

    # Now that we have modified house2.owner, it now refers
    # to a different object from house.owner (these print different
    # identifiers):
    print(id(house2.owner))
    print(id(house.owner))
    print()

    # So NOW, modifications to house2.owner.name no longer modify
    # house.owner.name (because house.owner and house2.owner refer
    # to different objects at this point):
    house2.owner.name = 'Mahatma'
    print(house2.owner.name) # Prints Mahatma
    print(house.owner.name) # Prints Sally


if __name__ == '__main__':
    main()
