from abc import ABC, abstractmethod

class Item:
    _price: float # Every item has a price

    def __init__(self, price: float) -> None:
        self._price = price

    def get_price(self) -> float:
        return self._price

    # Every item can be printed to the terminal (but different items
    # have different information that needs to be printed in different
    # formats, so we make this an abstract method, which we'll override
    # in the derived classes)
    @abstractmethod
    def print(self) -> None:
        pass
