from husky import Husky
from sled import Sled

def main() -> None:
    # Calls the Husky constructor, which calls the Dog constructor,
    # which calls the Pet constructor. The Pet constructor defines
    # the husky's owner's name (_owners_name). The Dog constructor
    # defines the name (_name) and age (_age). The Husky constructor
    # defines the energy value (_energy).
    cool_husky = Husky('Steve', 'Fluffy', 4, 100)

    # Calls the Husky vocalize() method, NOT the Dog vocalize()
    # method (the interpreter automatically calls the derived-class
    # override instead of the original, overridden base-class method)
    cool_husky.vocalize()

    fast_sled = Sled()
    cool_husky.pull_sled(fast_sled)
    print(f'Distance sled pulled: {fast_sled.distance_pulled}')

    # Calls the Husky print() method, which calls the Dog print()
    # method, which calls the Pet print() method. The Pet print()
    # method prints the husky's owner's name. The Dog print() method
    # additionally prints the husky's name and age. The Husky
    # print() method prints the husky's energy value.
    cool_husky.print()

if __name__ == '__main__':
    main()
