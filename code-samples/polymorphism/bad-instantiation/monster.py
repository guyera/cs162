from abc import ABC, abstractmethod
from player import Player

# The Monster class is now abstract because it inherits from ABC
# (Abstract Base Class)
class Monster(ABC):
    _hp: int

    def __init__(self, hp: int) -> None:
        # Different monsters will start out with different amounts
        # of hp, so we pass the monster's starting HP as an argument
        # to this constructor's hp parameter. It then stores it in
        # the self._hp attribute.
        self._hp = hp

    # There's no useful default behavior for this method. We intend
    # to override it in each and every derived class. So there's no
    # good definition to give to it here. Hence, we make it abstract,
    # which allows us to choose to not define it whatsoever (or,
    # rather, to leave its definition empty)
    @abstractmethod
    def attack(self, p: Player) -> None:
        # Python requires empty scopes to have the 'pass' keyword
        # present, signifying that it's intentionally empty
        pass
