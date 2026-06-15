def main() -> None:
    with open('hello-world.txt', 'a') as cool_file:
        # Write the following content into hello-world.txt:

        # Hello,
        # World

        cool_file.write('Hello,\n')
        cool_file.write('World!\n')

if __name__ == '__main__':
    main()
