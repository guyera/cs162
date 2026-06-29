from dog import Dog

def main() -> None:
    spot = Dog('', 0)
    spot.name = 'Spot'
    spot.birth_year = 2019
    print(f'{spot.name} was born in {spot.birth_year}')

if __name__ == '__main__':
    main()
