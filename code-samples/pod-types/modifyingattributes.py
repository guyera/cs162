class BusinessOwner:
    first_name: str
    last_name: str
    address: str
    phone_number: str

class Business:
    name: str
    owner: BusinessOwner

def foo(business: Business) -> None:
    # Modifies not just the attribute of the parameter, but also that of
    # the argument supplied in the function call
    business.name = 'Amazon'

def retrieve_owner(business: Business) -> BusinessOwner:
    # Reach inside the given Business object and retrieve its
    # owner attribute. Return it.
    return business.owner

def main() -> None:
    jensen_huang = BusinessOwner()
    jensen_huang.first_name = 'Jensen'
    jensen_huang.last_name = 'Huang'
    jensen_huang.address = '123 GPU Way'
    jensen_huang.phone_number = '(555) 123-4567'

    nvidia = Business()
    nvidia.name = 'Nvidia Corporation'
    nvidia.owner = jensen_huang

    foo(nvidia) # Changes nvidia.name to 'Amazon'
    print(nvidia.name) # Prints Amazon

    # This is also the case with return values.
    the_owner = retrieve_owner(nvidia)
    # If we now modify the attributes of the_owner, that will
    # ALSO modify the corresponding attributes of nvidia.owner
    the_owner.first_name = 'Jeff'
    print(nvidia.owner.first_name) # Prints Jeff

    # Actually, none of this really has anything to do with functions.
    # Even the original BusinessOwner object, jensen_huang, has
    # been modified.
    print(jensen_huang.first_name) # Prints Jeff

    # Similarly, modifying jensen_huang.first_name also modifies
    # nvidia.owner.first_name.
    jensen_huang.first_name = 'Jensen'
    print(nvidia.owner.first_name) # Prints Jensen
    
    # However, if we create a brand new BusinessOwner object, it'll
    # be separate. Modifying it won't modify the others, and vice
    # versa.
    jeff = BusinessOwner()
    jeff.first_name = 'Jeff'
    jeff.last_name = 'Bezos'
    jeff.address = '123 Amazon St'
    jeff.phone_number = '(555) 987-6543'

    print(jeff.first_name) # Prints Jeff
    print(jensen_huang.first_name) # Prints Jensen
    print(the_owner.first_name) # Prints Jensen
    print(nvidia.owner.first_name) # Prints Jensen


if __name__ == '__main__':
    main()
