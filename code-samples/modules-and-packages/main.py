from animals.dog import Dog, print_dog

def main() -> None:
    # Notice: It's now just Dog(), as opposed to dog.Dog(), because of
    # the way that we imported it
    spot = Dog()

    spot.name = 'Spot'
    spot.birth_year = 2022

    # Notice: It's now just print_dog, as opposed to dog.print_dog,
    # because of the way that we imported it
    print_dog(spot)

if __name__ == '__main__':
    main()
