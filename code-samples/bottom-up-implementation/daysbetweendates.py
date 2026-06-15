# Determines whether a given year is a leap year
def is_leap_year(y: int) -> bool:
    if y % 4 == 0:
        if y % 100 == 0 and y % 400 != 0:
            return False
        else:
            return True
    else:
        return False

def number_of_days_in_year(y: int) -> int:
    if is_leap_year(y):
        return 366
    else:
        return 365
