def base_10_log(value: float) -> float:
    if value == 0:
        # Cannot compute the log of 0. Raise a ValueError, immediately
        # throwing it back to the call site.
        raise ValueError('Cannot compute the log of 0!')

    # Otherwise, proceed to compute the log
    # (Computing the log of a value is actually not trivial. In
    # practice, you'd use the built-in math.log() function rather
    # than implementing this yourself. But just pretend that there's
    # some really cool, complicated code here that computes the
    # log of the given value, rather than the (wildly incorrect) return
    # statement below.)
    return 1000.0

def main() -> None:
    chosen_value = int(input('What value would you like to compute '
        'the log of?: '))
    
    try:
        # Try to compute the base-10 log, catching a ValueError
        # with the below except block if one is thrown
        answer = base_10_log(chosen_value)
    except ValueError as e:
        # A value error was thrown. Print its message to the terminal
        print(e)

if __name__ == '__main__':
    main()
