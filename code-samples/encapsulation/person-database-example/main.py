from person import Person
from persondatabase import PersonDatabase

def main() -> None:
    my_database = PersonDatabase()
    
    joe = Person('Joe', 42)

    # This is technically legal but extremely ill-advised:
    my_database._people.append(joe)

    # This is what you should do instead:
    my_database.add_person(joe)

if __name__ == '__main__':
    main()
