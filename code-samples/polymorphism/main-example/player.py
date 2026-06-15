class Player:
    _hp: int

    def __init__(self) -> None:
        # The player starts out with 100 HP. When it drops to zero,
        # they lose the game.
        self._hp = 100
    
    # Getter for _hp
    def get_hp(self) -> int:
        return self._hp

    # Causes the player to take some damage. Used by the monster
    # class and its subclasses when they attack the player.
    def take_damage(self, amount: int) -> None:
        # Forbid the amount of damage from being negative
        if amount < 0:
            raise ValueError(f'Error: Expected amount to be '
                f'non-negative, but got {amount}')

        # Damage the player
        self._hp -= amount
        
        # Preserve the class invariant that _hp must be non-negative
        if self._hp < 0:
            self._hp = 0
