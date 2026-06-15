from person import Person

class PersonDatabase:
    _people: list[Person]

    def __init__(self) -> None:
        self._people = [] # Initially empty

    # Add any given person to the database (as opposed to always 
    # adding one hyperspecific person, such as Joe, age 42)
    def add_person(self, p: Person) -> None:
        self._people.append(p)

    # Print the age of a person with a given name (as opposed to always
    # searching for one hyperpsecific person)
    def print_age_of_person(self, name: str) -> None:
        for p in self._people:
            if p.name == name:
                print(f"{p.name}'s age is {p.age}")
                return

    # Search for people whose age matches a given value (as opposed to
    # always searching for people who are one hyperspecific age, like
    # 42).
    def print_people_with_age(self, age: int) -> None:
        print(f'People who are {age} years of age')
        for p in self._people:
            if p.age == age:
                print(f'\t{p.name}')
