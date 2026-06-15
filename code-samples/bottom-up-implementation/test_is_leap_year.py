# Must import this function so that we can test it
from daysbetweendates import is_leap_year

# Test cases are functions whose names start with the word 'test'.
# A single test case should generally verify a single, small property
# of the component / feature that you're testing. That is, each test
# case should be very simple. The name of the test case's function
# should clearly indicate what property it aims to verify. For example,
# This test case will verify that the is_leap_year() function correctly
# returns False when given a year that is not divisible by 4. Hence,
# its name is test_year_indivisible_by_4_is_not_leap_year
def test_year_indivisible_by_4_is_not_leap_year() -> None:
    # Arrange: Arrange the inputs for our test cases
    y = 2003 # Not a leap year

    # Act: Run the is_leap_year() function on our inputs, collecting
    # the outputs
    result = is_leap_year(y)

    # Assert: Verify that the outputs of the Act phase are what
    # they're supposed to be, raising an exception otherwise
    assert result == False

def test_year_divisible_by_100_but_not_400_is_not_leap_year() -> None:
    # Arrange
    y = 2100 # Not a leap year

    # Act
    result = is_leap_year(y)

    # Assert
    assert result == False

def test_year_divisible_by_400_is_leap_year() -> None:
    # Arrange
    y = 2000 # Leap year

    # Act
    result = is_leap_year(y)

    # Assert
    assert result == True

def test_year_divisible_by_4_but_not_100_is_leap_year() -> None:
    # Arrange
    y = 2024 # Leap year

    # Act
    result = is_leap_year(y)

    # Assert
    assert result == True
