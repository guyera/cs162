def main() -> None:
    # Mypy doesn't know what kind of set this is. Is it a set of
    # integers? A set of strings? It has no way of knowing since we
    # never actually put anything in it.
    my_set = set()

if __name__ == '__main__':
    main()
