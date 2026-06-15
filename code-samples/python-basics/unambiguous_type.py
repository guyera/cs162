def main() -> None:
    # Mypy can't figure out what type of list this is by itself,
    # so we have to explicitly tell it. In this case, I want it to be
    # a list of strings, so the type annotation is list[str]
    my_list: list[str] = []

if __name__ == '__main__':
    main()
