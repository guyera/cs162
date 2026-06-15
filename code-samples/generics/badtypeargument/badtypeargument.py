from vendor import Vendor

def main() -> None:
    # Jim sells integers??? But 'int' is not a class that inherits from
    # the Item class, so Mypy will report an error.
    jim = Vendor[int]('Jim')

if __name__ == '__main__':
    main()
