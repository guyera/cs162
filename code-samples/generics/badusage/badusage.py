from vendor import Vendor
from furnitureitem import FurnitureItem
from automobile import Automobile

def main() -> None:
    # Samantha is an automobile vendor
    samantha = Vendor[Automobile]('Samantha')

    # Suppose we accidentally add a couch to her stock
    samantha.add_to_stock(FurnitureItem('Couch', 200.00))

    # And then we try to sell the couch
    print("Samantha's information prior to selling her couch:")
    samantha.print()
    print()
    
    samantha.sell(0)

    print("Samantha's information after selling her Ford Taurus:")
    samantha.print()

if __name__ == '__main__':
    main()
