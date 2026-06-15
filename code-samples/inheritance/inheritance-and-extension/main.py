from husky import Husky
from sled import Sled

def main() -> None:
    # The Husky class now has its own constructor, so this line
    # of code will call that constructor as opposed to the inherited
    # Dog() constructor (however, the Husky constructor, in turn,
    # calls the Dog constructor via the super().__init__(...) line).
    # The Husky constructor requires three arguments: the name, the
    # age, and the energy.
    cool_husky = Husky('Fluffy', 4, 100)

    # The Husky class inherits the bark() method from the Dog class,
    # which prints its _name and _age attributes
    cool_husky.bark()

    # Create a sled for the husky to pull
    fast_sled = Sled()

    # Tell the husky to pull the sled
    cool_husky.pull_sled(fast_sled)

    # See how far the husky pulled the sled (prints 10)
    print(f'Distance sled pulled: {fast_sled.distance_pulled}')

    # (The Husky's energy should have also reduced from 100 to 90,
    # but that's not shown here. We'll revisit this shortly)

if __name__ == '__main__':
    main()
