class Cat:
    name: str
    birth_year: int

def print_cat(cat: Cat) -> None:
    print(f'{cat.name} was born in {cat.birth_year}')
