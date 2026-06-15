from rectangle import Rectangle

class Square(Rectangle):
    def __init__(self, side_length: float):
        # A square does not have a separate length or width, just
        # a single side_length. So that's what this constructor
        # receives as a parameter. We then pass it up as both the
        # length AND the width to the Rectangle constructor, storing
        # it in both the _length AND _width attributes
        super().__init__(side_length, side_length)

    # Setter overrides. When modifying a square's length or width, it
    # actually modifies BOTH, forcing them to remain the equal to
    # each other.
    def set_length(self, side_length: float) -> None:
        super().set_length(side_length)
        super().set_width(side_length)

    def set_width(self, side_length: float) -> None:
        super().set_length(side_length)
        super().set_width(side_length)
