from typing import TextIO

def process_file(data_file: TextIO) -> None:
    # Keep track of the line number
    line_number = 1

    # For each line in the file
    for current_line in data_file:
        # current_line contains an entire line of text from the
        # file, including the newline character sequence at the
        # end of it. Let's use the .strip() method to create a
        # new version of current_line that doesn't have that
        # whitespace, and then update current_line by assigning
        # it that new string
        current_line = current_line.strip()

        # Print the line number, followed by the line itself
        print(f'Line {line_number}: {current_line}')

        # Increment the line number
        line_number = line_number + 1
    

def main() -> None:
    with open('data.txt', 'r') as data_file:
        process_file(data_file)

if __name__ == '__main__':
    main()
