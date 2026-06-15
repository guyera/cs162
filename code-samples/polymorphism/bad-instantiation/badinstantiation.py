from monster import Monster

def main() -> None:
    # This is illegal. Mypy detects it as a syntax error. If
    # executed, it throws a TypeError.
    my_monster = Monster(10)

if __name__ == '__main__':
    main()
