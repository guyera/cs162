def main() -> None:
    # If we want this to be a set of integers, but Mypy isn't able
    # to figure that out on its own, we can explicitly annotate its
    # type as set[int] (for example)
    my_set: set[int] = set()

if __name__ == '__main__':
    main()
