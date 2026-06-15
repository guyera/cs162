class Pet:
    _owners_name: str

    def __init__(self, owners_name: str) -> None:
        self._owners_name = owners_name

    def print(self) -> None:
        print(f"Owner's name: {self._owners_name}")
