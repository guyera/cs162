from dog import Dog
from sled import Sled

class Husky(Dog):
    _energy: int

    def __init__(self, name: str, age: int, energy: int) -> None:
        # This method, being a method of the Husky class, is not
        # supposed to access the _name and _age attributes since they
        # were declared in the Dog class. But, somehow, we need
        # 'self._name' to be assigned the value of the 'name' parameter
        # and 'self._age' to be assigned the value of 'age'. To
        # accomplish this, we pass 'name' and 'age' up to the base
        # class (Dog) constructor, which in turn stores those values in
        # the appropriate attributes:
        super().__init__(name, age)
        self._energy = energy

    def pull_sled(self, sled: Sled) -> None:
        # Remember: parameters are references to their arguments, so
        # modifying the parameter's distance_pulled attribute will
        # also modify the argument's distance_pulled attribute
        sled.distance_pulled += 10
        self._energy -= 10
