def main() -> None:
    age = int(input('How old are you?\n'))
    country = input('What country do you live in?\n')

    # Many (e.g., European) countries require you to be 18 or
    # older to get a driver's license, but the USA only requires
    # you to be 16 or older. Notice the use of parentheses to
    # control the order of logical operations.
    if (age > 18 and not country == 'USA') or \
            (age > 16 and country == 'USA'):
        print('You can get a drivers license!')
    else:
        print("Sorry! You're not old enough to get a driver's license.")
    
    # Note: `not country == 'USA'` could instead be written as
    # `country != 'USA'`. In fact, the latter would be preferred.
    # But either way works, and this is just a demonstration.


if __name__ == '__main__':
    main()
