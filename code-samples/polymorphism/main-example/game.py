from player import Player
from monster import Monster # Needed for static typing list[Monster]
from zombie import Zombie
from vampire import Vampire
from goblin import Goblin

# This function is the main "game loop". In other words, it contains
# the loop that runs the monsters' turns over and over again until the
# game ends (i.e., until the player loses). Notice: It only needs
# a single list parameter now, which is a list of Monster objects.
# Each Monster object in the list will have been upcasted from a
# more specific derived-class object (a Zombie, Vampire, or Goblin).
# See main() below for details.
def game_loop(
        p: Player,
        monsters: list[Monster]) -> None:
    # Until the player loses, keep running turns of the game
    turn_counter = 1 # Keeps track of what turn it is
    while p.get_hp() > 0:
        # ALL of the monsters attack the player. Notice: Just a single
        # for loop now.
        for m in monsters:
            m.attack(p)

        # Print the player's remaining HP
        print(f"After turn {turn_counter}, the player's remaining "
            f"HP is {p.get_hp()}")
        
        # Update the turn counter
        turn_counter += 1


def main() -> None:
    # Create the player object
    p = Player()

    # Suppose we want the game to have 3 zombies, 4 vampires, and 5
    # goblins. However, we do NOT need to create a separate list for
    # each. Rather, let's create a single list of monsters, meaning a
    # variable whose (static) type is list[Monster]. Because zombies,
    # vampires, and goblins can all be type-casted into monsters
    # (i.e., upcasting), we can store ALL of these things---zombies,
    # vampires, and goblins---in a single list of type list[Monster].

    # In instances like this, Mypy needs some help determining the
    # type of the list. We want it to be of type list[Monster], so
    # we have to tell Mypy that explicitly (see the Python Basics
    # lecture notes for more information about explicit type
    # annotations of local variables).
    monsters: list[Monster] = []

    # Now add all the zombies, vampires, and goblins to it
    for _ in range(3):
        # Create a Zombie object, implicitly upcast it into a Monster
        # object, and then store it in our list of Monster objects
        monsters.append(Zombie())

    for _ in range(4):
        # Create a Vampire object, implicitly upcast it into a Monster
        # object, and then store it in our list of Monster objects
        monsters.append(Vampire())

    for _ in range(5):
        # Create a Goblin object, implicitly upcast it into a Monster
        # object, and then store it in our list of Monster objects
        monsters.append(Goblin())

    # Now run the game loop, executing turns until the game is over.
    # This time, we only need to pass in a single list: monsters
    game_loop(p, monsters)
    

if __name__ == '__main__':
    main()
