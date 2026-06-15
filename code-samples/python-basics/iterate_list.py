def main() -> None:
    my_list = [9.81, 3.14, -1.5]
    sum_of_values = 0.0
    for number in my_list:
        sum_of_values += number
    print(f'The sum of the values in the list is: {sum_of_values}')

if __name__ == '__main__':
    main()
