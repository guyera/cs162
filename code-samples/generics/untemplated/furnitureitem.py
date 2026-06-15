class FurnitureItem:
    _name: str # Name of furniture item
    _price: float # Price in dollars
    
    def __init__(self, name: str, price: float) -> None:
        self._name = name
        self._price = price

    def get_price(self) -> float:
        return self._price

    def print(self) -> None:
        print(f'  - Item: {self._name}')
        # Note: {x:.2f} prints the value of x to 2 decimal places
        print(f'    Price: ${self._price:.2f}')
