from pet import Pet

class Dog(Pet):
    _name: str
    _age: int
    
    def __init__(self, owners_name: str, name: str, age: int) -> None:
        # Call the Pet class's constructor, passing the owner's name
        # up to it as an argument to be stored in the _owners_name
        # attribute
        super().__init__(owners_name)

        self._name = name
        self._age = age

    def vocalize(self) -> None:
        print('Bark! Bark!')

    def print(self) -> None:
        # Call the Pet class's print() method, printing the name
        # of the dog's owner
        super().print()

        print(f'Name: {self._name}')
        print(f'Age: {self._age}')
