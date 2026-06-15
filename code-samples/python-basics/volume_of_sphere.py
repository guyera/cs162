# The name of the function is volume_of_sphere
# The function has a single input (parameter), which is
#   a float called `radius`
# The function returns a float as well
def volume_of_sphere(radius: float) -> float:
    # Compute the volume of a sphere with the given radius
    # and return it (the equation for the volume of a 
    # sphere is 4/3 pi r^2)
    volume = 4 / 3 * 3.141592 * radius * radius * radius
    return volume

def main() -> None:
    # Bind variable called `volume_of_radius_5_sphere`, and
    # store the return value of volume_of_sphere(5.0) inside
    # it.
    volume_of_radius_5_sphere = volume_of_sphere(5.0)
    print(volume_of_radius_5_sphere)

if __name__ == '__main__':
    main()
