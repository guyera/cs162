def main() -> None:
    x = 12 # x's type is int

    # Changes x's type from int to float. Mypy forbids this.
    x = 3.14

if __name__ == '__main__':
    main()
