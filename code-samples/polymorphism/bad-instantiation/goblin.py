from monster import Monster
from player import Player

# The Goblin class inherits from the Monster class
class Goblin(Monster):
    # Goblins now alternate between dealing 1 and 2 damage on their
    # turns. We'll keep track of the damage that a goblin should
    # do on their next turn by flipping this boolean back and
    # forth between true and false.
    _one_damage: bool

    def __init__(self) -> None:
        # Goblins get 5 HP. Pass this to the Monster constructor
        # to be stored in the private _hp attribute
        super().__init__(5)

        # Goblins do 1 damage on their first turn, so we'll initialize
        # self._one_damage to True
        self._one_damage = True

    def attack(self, p: Player) -> None:
        # Goblins alternate between dealing 1 and 2 damage on each
        # of their turns.
        if self._one_damage:
            p.take_damage(1)
        else:
            p.take_damage(2)

        # If self._one_damage is True, change it to False. If it's
        # False, change it to True. We can do this in the single
        # following statement:
        self._one_damage = not self._one_damage
