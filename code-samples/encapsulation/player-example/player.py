# This class should have two class invariants:
# 1. The player's HP should never exceed their max HP
# 2. The player's HP should never be negative
class Player:
    _max_hp: int
    _hp: int

    def __init__(self, max_hp: int) -> None:
        # The player should start out with a positive amount of HP.
        # This helps preserve the second class invariant above.
        if max_hp <= 0:
            raise ValueError('max_hp must be positive!')

        self._max_hp = max_hp
        self._hp = max_hp # The player starts out with maximum HP

    # Adjusts the player's health by the specified amount (positive
    # amount heals the player, negative amount damages the player)
    def adjust_health(self, amount: int) -> None:
        self._hp += amount

        if self._hp > self._max_hp:
            # Preserve the first class invariant
            self._hp = self._max_hp
        elif self._hp < 0:
            # Preserve the second class invariant
            self._hp = 0
