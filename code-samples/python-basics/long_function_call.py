# Each parameter is declared on a separate line of code to keep the
# lines short. They're also indented by TWO levels of indentation
# to distinguish the end of the function header from the start
# of the function body.
def cool_function(
        a: float,
        b: int,
        c: str,
        d: bool,
        e: float,
        f: int) -> None:
    print('Hello, World!')

def main() -> None:
    # Each argument is listed on a separate line of code to keep
    # the lines short.
    cool_function(
        3.14,
        5,
        'Hello',
        True,
        9.81,
        10
    )

if __name__ == '__main__':
    main()
