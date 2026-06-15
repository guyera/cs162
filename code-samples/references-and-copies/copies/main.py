from copy import deepcopy

# A Person POD type. It should probably be in a separate person.py,
# but this is just a demonstration
class Person:
    name: str
    age: int

def main() -> None:
    x = Person()
    x.name = 'Joe'
    x.age = 42

    y = deepcopy(x)
    y.name = 'Sally'

    print(x.name) # Question: What does this print?

if __name__ == '__main__':
    main()
