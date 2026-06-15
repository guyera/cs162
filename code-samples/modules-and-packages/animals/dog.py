class Dog:
    name: str
    birth_year: int

def print_dog(dog: Dog) -> None:
    print(f'{dog.name} was born in {dog.birth_year}')
