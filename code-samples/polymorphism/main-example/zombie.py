from monster import Monster
from player import Player

# The Zombie class inherits from the Monster class
class Zombie(Monster):
    # Extension: The Zombie class additionally has a _sanity attribute
    _sanity: float

    def __init__(self) -> None:
        # Zombies get 20 HP. Pass this to the Monster constructor
        # to be stored in the private _hp attribute
        super().__init__(20)

        self._sanity = 1.0 # All zombies start out with 1.0 sanity

    # Override the attack() method. This is what zombies will do when
    # they attack the player, instead of executing the "default" /
    # boring Monster class's attack() method.
    def attack(self, p: Player) -> None:
        if self._sanity > 0.0:
            # If this zombie still has some sanity, then they won't
            # damage the player this turn, but they will lose 0.5
            # sanity.
            self._sanity -= 0.5

            # If sanity became negative, clip it to zero
            if self._sanity < 0.0:
                self._sanity = 0.0
        else:
            # Otherwise, this zombie has gone insane, so they attack
            # the player, damaging them by 2
            p.take_damage(2)
