class Dog:
    _name: str
    _age: int
    
    def __init__(self, name: str, age: int) -> None:
        self._name = name
        self._age = age

    def bark(self) -> None:
        print(f"Bark! Bark! My name is {self._name}, and I'm "
            f"{self._age} years old")
