from vector3 import Vector3

class SensorModule:
    # This list of Vector3 objects keeps a record of the rocket's
    # flight path so far, relative to the launch pad, as sourced from
    # the rocket's GPS module. The last element
    # in the list represents the rocket's current location.
    _gps_flight_path: list[Vector3]

    # Rocket's current acceleration as sourced from the
    # accelerometer
    acceleration: Vector3

    # We'll also keep track of a running estimate of the rocket's
    # velocity and position, periodically updating them based on its
    # acceleration at the given point in time (i.e., approximating
    # velocity and position through integration).
    velocity: Vector3
    position: Vector3
    
    def __init__(self) -> None:
        # Rocket is initially resting on the launch pad, so initialize
        # _gps_flight_path to contain a single Vector3 object with x, y,
        # and z all equal to zero.
        self._gps_flight_path = [Vector3()]

        # Acceleration, velocity, and position all start as zero-vectors
        self.acceleration = Vector3()
        self.velocity = Vector3()
        self.position = Vector3()

    # Helper method. Called by collect_sensor_data. Modularizes the GPS
    # querying. Should NOT be called from anywhere other than within
    # other methods of this class.
    def _query_gps(self) -> None:
        new_position = Vector3()

        # Here, we would somehow retrieve the rocket's current position
        # from the GPS hardware and update the x/y/z coordinates of
        # new_position accordingly. Of course, reading from GPS
        # hardware is beyond the scope of this course, so just use your
        # imagination here.
        # ...

        # Append new position to self._gps_flight_path
        self._gps_flight_path.append(new_position)

    # Another helper method. Not part of the lecture notes, but
    # a good idea.
    def _query_accelerometer(self) -> None:
        # Here, we would somehow query the rocket's current
        # acceleration from the accelerometer and update
        # self.acceleration accordingly
        # Use your imagination.
        # ...

        # Now, update velocity and position accordingly (note: this is
        # an oversimplification)
        self.velocity.x += self.acceleration.x
        self.velocity.y += self.acceleration.y
        self.velocity.z += self.acceleration.z
        self.position.x += self.velocity.x
        self.position.y += self.velocity.y
        self.position.z += self.velocity.z

    # Public-facing. Can be called from anywhere in the codebase (e.g.,
    # in the Rocket class)
    def collect_sensor_data(self) -> None:
        self._query_gps()
        self._query_accelerometer()

    def get_position(self) -> Vector3:
        return self.position

    def get_velocity(self) -> Vector3:
        return self.velocity
