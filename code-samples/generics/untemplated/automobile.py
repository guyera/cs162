class Automobile:
    _manufacturer: str # Manufacturer that made the car
    _year: int # Year in which the car was built
    _model: str # The name of the car model
    _price: float # Price in dollars
    
    def __init__(
            self,
            manufacturer: str,
            year: int,
            model: str,
            price: float) -> None:
        self._manufacturer = manufacturer
        self._year = year
        self._model = model
        self._price = price

    def get_price(self) -> float:
        return self._price

    def print(self) -> None:
        print(f'  - Item: {self._year} {self._manufacturer} '
            f'{self._model}')
        # Note: {x:.2f} prints the value of x to 2 decimal places
        print(f'    Price: ${self._price:.2f}')
