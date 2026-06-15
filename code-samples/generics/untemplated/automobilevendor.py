from automobile import Automobile

class AutomobileVendor:
    _name: str # The vendor's name
    _profit: float # Total profit made
    _automobiles: list[Automobile] # Inventory

    def __init__(self, name: str) -> None:
        self._name = name
        self._profit = 0.0
        self._automobiles = []

    def add_to_stock(self, automobile: Automobile) -> None:
        self._automobiles.append(automobile)

    def sell(self, idx: int) -> None:
        # Increase the vendor's total profit based on the price of
        # the sold furniture item
        self._profit += self._automobiles[idx].get_price()

        # Remove the sold furniture item
        del self._automobiles[idx]

    # Prints the vendor's information to the terminal
    def print(self) -> None:
        print(f'Name: {self._name}')
        # Note: '{x:.2f}' Prints x to 2 decimal places
        print(f'Total profit: ${self._profit:.2f}')
        print(f'Inventory:')
        for item in self._automobiles:
            item.print()
