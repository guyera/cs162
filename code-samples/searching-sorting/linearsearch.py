from typing import Optional
from person import Person

# Find the person with the given name in the given list and return
# that person. If no such person exists in the list, return None.
def person_with_name(
        people: list[Person],
        name: str) -> Optional[Person]:
    for p in people:
        if p.name == name:
            return p

    # If the function makes it this far, then it failed to find the
    # person with the specified name. The person must not exist.
    return None
