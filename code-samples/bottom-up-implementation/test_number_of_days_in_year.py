from daysbetweendates import number_of_days_in_year

def test_non_leap_year_has_365_days() -> None:
    # Arrange
    y = 2003 # Non-leap year
    
    # Act
    result = number_of_days_in_year(y)

    # Assert
    assert result == 365

def test_leap_year_has_366_days() -> None:
    # Arrange
    y = 2004 # Leap year
    
    # Act
    result = number_of_days_in_year(y)

    # Assert
    assert result == 366
