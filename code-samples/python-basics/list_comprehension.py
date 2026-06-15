def main() -> None:
    my_list = [3.14, 9.81, 12.6, -1.5]

    # For each value in my_list, which we'll refer to generally
    # as x, double it (i.e., compute 2 * x). Store all those
    # doubled values in a new list object, which we then store
    # inside the `doubled_list` variable.
    doubled_list = [2 * x for x in my_list]

    print(doubled_list)

if __name__ == '__main__':
    main()
