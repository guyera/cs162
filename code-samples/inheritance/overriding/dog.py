class Dog:
    _name: str
    _age: int
    
    def __init__(self, name: str, age: int) -> None:
        self._name = name
        self._age = age

    def vocalize(self) -> None:
        print('Bark! Bark!')

    def print(self) -> None:
        print(f'Name: {self._name}')
        print(f'Age: {self._age}')
