class BusinessOwner:
    first_name: str
    last_name: str
    address: str
    phone_number: str

class Business:
    name: str
    # Every business has an owner, which is in turn a BusinessOwner
    # object
    owner: BusinessOwner

# Prints the information about a given BusinessOwner
def print_business_owner(owner: BusinessOwner) -> None:
    print(f'Owner first name: {owner.first_name}')
    print(f'Owner last name: {owner.last_name}')
    print(f'Owner address: {owner.address}')
    print(f'Owner phone number: {owner.phone_number}')

# Prints the information about a given Business, including its owner
# (but delegates the printing logic for the owner to the
# print_business_owner function, in line with the SRP).
def print_business(business: Business) -> None:
    print(f'Business name: {business.name}')
    print(f'Business owner information:')
    # To print the owner's information, call the
    # print_business_owner function on this business's owner
    print_business_owner(business.owner)

def main() -> None:
    # Suppose we want to create a Business object. Every Business
    # has an owner, so we'll start by creating the BusinessOwner
    jensen_huang = BusinessOwner()
    jensen_huang.first_name = 'Jensen'
    jensen_huang.last_name = 'Huang'
    jensen_huang.address = '123 GPU Way'
    jensen_huang.phone_number = '(555) 123-4567'

    # Now we can create a Business object
    nvidia = Business()
    nvidia.name = 'Nvidia Corporation'
    # Store the BusinessOwner object, jensen_huang, inside the 'owner'
    # attribute of the Business object, nvidia
    nvidia.owner = jensen_huang

    # Print all the information about the business, including its
    # owner
    print_business(nvidia)


if __name__ == '__main__':
    main()
