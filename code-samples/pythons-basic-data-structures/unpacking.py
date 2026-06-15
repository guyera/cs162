def main() -> None:
    my_tuple = ('James', 25, 'Strawberries')
    print(my_tuple[0]) # Prints James
    print(my_tuple[1]) # Prints 25
    print(my_tuple[2]) # Prints Strawberries

    print('-------------------------')
    print('Unpacking tuple correctly:')
    
    # Unpack the three tuple values into three variables: name, age,
    # and favorite_fruit.
    name, age, favorite_fruit = my_tuple
    print(f'name: {name}') # Prints James
    print(f'age: {age}') # Prints 25
    print(f'favorite_fruit: {favorite_fruit}') # Prints Strawberries

    print('-------------------------')
    print('Unpacking tuple incorrectly:')

    # Tuples are always unpacked left-to-right. my_tuple has three
    # elements: 'James', 25, and 'Strawberries'. So those three
    # values will be unpacked into the three respective variables
    # in that exact order. If you mess up the order of your variables,
    # the wrong values will be unpacked into them:
    favorite_fruit, age, name = my_tuple
    print(f'name: {name}') # Prints Strawberries
    print(f'age: {age}') # Prints 25
    print(f'favorite_fruit: {favorite_fruit}') # Prints James


if __name__ == '__main__':
    main()
