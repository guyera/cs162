class Circle:
    _diameter: float
    
    def __init__(self, radius: float) -> None:
        self._diameter = radius * 2 # Diameter = 2 * specified radius

    # Getter for the radius
    def get_radius(self) -> float:
        return self._diameter / 2 # Radius = diameter / 2

    # Setter for the radius
    def set_radius(self, value: float) -> None:
        self._diameter = value * 2 # Diameter = 2 * specified radius
