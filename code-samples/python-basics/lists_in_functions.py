# The list_of_values parameter is a list of integers. Hence,
# we annotate its type as list[int].
def compute_sum_of_values(list_of_values: list[int]) -> int:
    value_sum = 0
    for value in list_of_values:
        value_sum += value
    return value_sum

def main() -> None:
    my_list = [1, 4, 7]

    # Compute the sum of the values in my_list and print it
    print(compute_sum_of_values(my_list))

if __name__ == '__main__':
    main()
