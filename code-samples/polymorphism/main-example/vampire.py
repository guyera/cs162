from monster import Monster
from player import Player

# The Vampire class inherits from the Monster class
class Vampire(Monster):
    # Extension: The Vampire class additionally has a _strength
    # attribute
    _strength: int

    def __init__(self) -> None:
        # Vampires get 15 HP. Pass this to the Monster constructor
        # to be stored in the private _hp attribute
        super().__init__(15)

        self._strength = 1 # All vampires start out with 1 strength

    # Private helper method that increases a vampire's strength by a
    # specified amount without letting it exceed 3
    def _increase_strength(self, amount: int) -> None:
        # Forbid amount from being negative
        if amount < 0:
            raise ValueError(f'Expected amount to be non-negative, '
                f'but got {amount}')
        
        # Increase strength, clipping it down to a max of 3
        self._strength += amount
        if self._strength > 3:
            self._strength = 3

    # Override the attack() method. This is what vampires will do when
    # they attack the player, instead of executing the "default" /
    # boring Monster class's attack() method.
    def attack(self, p: Player) -> None:
        # Attack the player, dealing damage equal to the vampire's
        # strength
        p.take_damage(self._strength)

        # When vampires attack the player, they suck the player's
        # blood, gaining 1 strength in the process. We'll use
        # self._increase_strength() for this (which prevents it
        # from exceeding the max of 3)
        self._increase_strength(1)
