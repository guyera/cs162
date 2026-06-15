def main() -> None:
    x = 5
    print(id(x))
    x = 6
    print(id(x))
    x -= 4
    print(id(x))
    y = x
    print(id(y))
    z = 2
    print(id(z))

if __name__ == '__main__':
    main()
