from furniturevendor import FurnitureVendor
from furnitureitem import FurnitureItem
from automobilevendor import AutomobileVendor
from automobile import Automobile

def main() -> None:
    #################################
    #### Furniture demonstration ####
    #################################
    
    john = FurnitureVendor('John')
    john.add_to_stock(FurnitureItem('Couch', 100.00))
    
    print("John's information prior to selling his couch:")
    john.print()
    print()

    john.sell(0)

    print("John's information after selling his couch:")
    john.print()

    print()
    print()

    ##################################
    #### Automobile demonstration ####
    ##################################

    samantha = AutomobileVendor('Samantha')
    samantha.add_to_stock(Automobile('Ford', 2001, 'Taurus', 2000.00))

    print("Samantha's information prior to selling her Ford Taurus:")
    samantha.print()
    print()
    
    samantha.sell(0)

    print("Samantha's information after selling her Ford Taurus:")
    samantha.print()

if __name__ == '__main__':
    main()
