def main() -> None:
    value_sum = 0

    # range(10) consists of the integers 0 through 9
    for value in range(10):
        # This for loop body will execute once for each of the
        # values in range(10). In the first iteration, value
        # will be equal to 0. In the second iteration, it will
        # be equal to 1. And so on. In the final iteration,
        # it'll be equal to 9.

        # Hence, if we simply add the current value to the running
        # sum, this for loop will compute 0 + 1 + 2 + ... + 9:
        value_sum += value
    
    # The for loop is done. Print the computed sum:
    print(value_sum)

if __name__ == '__main__':
    main()
