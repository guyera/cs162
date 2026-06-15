class Dog:
    name: str
    birth_year: int

    def __init__(self, n: str, b: int) -> None:
        # n is the dog's name, and b is the dog's birth year.
        # Store them in self.name and self.birth_year
        self.name = n
        self.birth_year = b

    def print(self) -> None:
        print(f'{self.name} was born in {self.birth_year}')
