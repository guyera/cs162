# Finds the smallest prime number that's greater than the
# given argument, and prints the prime number to the
# terminal
def print_first_prime_greater_than(lower_bound: int) -> None:
    current_value = lower_bound + 1
    while True:
        # Check if current_value is a prime number
        is_prime = True
        for i in range(2, current_value):
            if current_value % i == 0:
                # current_value is divisible by an integer
                # that's smalller than it (other than 1),
                # so it must not be prime.
                is_prime = False
                break # End this for loop immediately
        
        if is_prime:
            # If is_prime is still True, then that means
            # we failed to find any numbers by which
            # current_value is divisible. It must be prime.
            # Print it and return, ending the entire function
            # immediately.
            print(current_value)
            return
        
        # Otherwise, increase current_value by 1 and go back
        # to the top of the loop
        current_value += 1
    

def main() -> None:
    print_first_prime_greater_than(11) # Prints 13

if __name__ == '__main__':
    main()
