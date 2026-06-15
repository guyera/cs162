def age(person_name: str) -> int:
    if person_name == 'Taylor Swift':
        # Taylor Swift is 35. Return 35, ending the function
        return 35
    elif person_name == 'Chappell Roan':
        # Chappell Roan is 27. Return 27, ending the function
        return 27

    # If we made it this far, then person_name must not be
    # 'Taylor Swift' nor 'Chappell Roan', or else the
    # function would have already ended.
    
    # In all other cases, return 0.
    return 0

def main() -> None:
    print(age("Taylor Swift")) # Prints 35
    print(age("Chappell Roan")) # Prints 27
    print(age("Jane Plane")) # Prints 0

if __name__ == '__main__':
    main()
