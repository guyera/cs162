def main() -> None:
    x = [1, 2, 3]
    y = x
    y[0] = 100
    print(x) # Prints [100, 2, 3]

if __name__ == '__main__':
    main()
