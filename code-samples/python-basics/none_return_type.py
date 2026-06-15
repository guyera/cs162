def print_multiplication_table(width: int, height: int) -> None:
    for row_idx in range(height):
        for col_idx in range(width):
            print((row_idx + 1) * (col_idx + 1), end="\t")
        print()

def main() -> None:
    print_multiplication_table(7, 5)
    print()
    print_multiplication_table(3, 4)

if __name__ == '__main__':
    main()
