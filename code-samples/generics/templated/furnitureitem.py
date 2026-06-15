from item import Item

class FurnitureItem(Item):
    _name: str # Name of furniture item
    
    def __init__(self, name: str, price: float) -> None:
        super().__init__(price)
        self._name = name

    def print(self) -> None:
        print(f'  - Item: {self._name}')
        # Note: {x:.2f} prints the value of x to 2 decimal places
        print(f'    Price: ${self.get_price():.2f}')
