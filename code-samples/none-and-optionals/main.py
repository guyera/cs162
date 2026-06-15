from typing import Optional

from person import Person # A POD type with a constructor

# Return type is Optional[Person], meaning the return value
# will either be an Person or None. If the person with the given
# name is found in the given list, this function returns the Person
# object. Otherwise, it returns None.
def age_of_person(
        name: str,
        list_of_people: list[Person]) -> Optional[Person]:
    for p in list_of_people:
        if p.name == name:
            return p

    # Person was not found. Return None
    return None

def main() -> None:
    my_people = []
    my_people.append(Person('Joe', 42))
    my_people.append(Person('Amanda', 17))

    chosen_name = input('Whose age would you like to search for?: ')

    # found_person's type is Optional[Person], meaning it's either
    # a Person or None
    found_person = age_of_person(chosen_name, my_people)

    if found_person is None:
        # found_person is None, meaning the person couldn't be found
        print(f"Sorry, I don't know {chosen_name}'s age.")
    else:
        # found_person is not None, meaning the person was found.
        # Print their age.
        print(f"{chosen_name}'s age is {found_person.age}.")
    

if __name__ == '__main__':
    main()
