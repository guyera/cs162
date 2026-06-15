from husky import Husky
from sled import Sled

def main() -> None:
    # Calls the Husky constructor, which calls the Dog constructor,
    # The Dog constructor defines the name (_name) and age (_age). The
    # Husky constructor defines the energy value (_energy).
    cool_husky = Husky('Fluffy', 4, 100)

    # Calls the Husky vocalize() method, NOT the Dog vocalize()
    # method (the interpreter automatically calls the derived-class
    # override instead of the original, overridden base-class method)
    cool_husky.vocalize()

    fast_sled = Sled()
    cool_husky.pull_sled(fast_sled)
    print(f'Distance sled pulled: {fast_sled.distance_pulled}')

    # Calls the Dog print() method, as inherited by the Husky
    # class, printing cool_husky's name and age to the terminal.
    cool_husky.print()

if __name__ == '__main__':
    main()
