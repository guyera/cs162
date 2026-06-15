from item import Item

from typing import Generic, TypeVar
T = TypeVar('T', bound=Item)

class Vendor(Generic[T]):
    _name: str # The vendor's name
    _profit: float # Total profit made
    _inventory: list[T] # Inventory

    def __init__(self, name: str) -> None:
        self._name = name
        self._profit = 0.0
        self._inventory = []

    def add_to_stock(self, item: T) -> None:
        self._inventory.append(item)

    def sell(self, idx: int) -> None:
        # Increase the vendor's total profit based on the price of
        # the sold item
        self._profit += self._inventory[idx].get_price()

        # Remove the sold item
        del self._inventory[idx]

    # Prints the vendor's information to the terminal
    def print(self) -> None:
        print(f'Name: {self._name}')
        # Note: '{x:.2f}' Prints x to 2 decimal places
        print(f'Total profit: ${self._profit:.2f}')
        print(f'Inventory:')
        for item in self._inventory:
            item.print()
