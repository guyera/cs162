class Rectangle:
    _length: float
    _width: float

    def __init__(self, length: float, width: float) -> None:
        self._length = length
        self._width = width

    # Getters and setters
    def get_length(self) -> float:
        return self._length

    def get_width(self) -> float:
        return self._width

    def set_length(self, length: float) -> None:
        self._length = length

    def set_width(self, width: float) -> None:
        self._width = width
