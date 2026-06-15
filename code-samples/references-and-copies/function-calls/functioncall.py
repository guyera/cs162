from copy import deepcopy

class Person:
    name: str

def change_person(p: Person) -> None:
    p.name = 'Sally'

def main() -> None:
    joe = Person()
    joe.name = 'Joe'

    # The parameter, p, refers to the same object that the argument,
    # joe, refers to. Line 5, then, reaches inside the object that
    # p refers to (which is also the object that joe refers to),
    # modifying its name attribute to refer to a new string object
    # storing the value 'Sally'. This means that joe.name is ALSO
    # modified
    change_person(joe)

    print(joe.name) # Prints Sally
    
    # Let's change joe's name back to 'Joe'
    joe.name = 'Joe'

    # This time, to avoid the issue, we can use copy() or deepcopy()
    # to create a copy of the OBJECT that joe refers to, and then pass
    # THAT as the argument. p will then refer to THAT object, rather
    # than the object that joe refers to. In this case, copy() and
    # deepcopy() will both work. But again, we usually want a deep copy
    change_person(deepcopy(joe))

    print(joe.name) # Prints Joe

if __name__ == '__main__':
    main()
