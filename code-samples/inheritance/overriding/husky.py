from dog import Dog
from sled import Sled

class Husky(Dog):
    _energy: int

    def __init__(self, name: str, age: int, energy: int) -> None:
        super().__init__(name, age)
        self._energy = energy

    def pull_sled(self, sled: Sled) -> None:
        sled.distance_pulled += 10
        self._energy -= 10

    # Override the vocalize() method. When a husky vocalizes, it says
    # 'Awooo!' instead of 'Bark! Bark!'
    def vocalize(self) -> None:
        print('Awooo!')

    # Override the print() method. When a husky is printed to the
    # terminal, its energy needs to be printed in addition to its
    # name and age
    def print(self) -> None:
        # This method is defined in the Husky class, so it's not
        # supposed to access the inherited _name and _age attributes
        # (they're private to the Dog class). But we need to print
        # them. To that end, we call the Dog class's print() method
        # on the calling object (self), which it indeed has due
        # to inheritance. But that method has the same name as this
        # one, so to avoid this method calling itself, we need to use
        # the super() function to specify that we want to call the
        # base class's print() method.
        super().print()

        # Print the energy value to the terminal
        print(f'Remaining energy: {self._energy}')
