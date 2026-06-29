from sensormodule import SensorModule

class Rocket:
    sensor_module: SensorModule
    deployed_parachute: bool

    def __init__(self) -> None:
        self.sensor_module = SensorModule()

        # Parachute initially undeployed
        self.deployed_parachute = False

    def actuate_fins(self) -> None:
        # Get rocket's current position from the sensor module via
        # its position() method
        current_position = self.sensor_module.get_position()
        
        # Get rocket's current velocity from the sensor module via
        # its velocity() method
        current_velocity = self.sensor_module.get_velocity()

        # Here, we would somehow use current_position and
        # current_velocity to determine how the fins should be actuated
        # so as to guide the rocket along the target trajectory.
        # That's beyond the scope of this course, so use your
        # imagination here as well.
        # ...

    def deploy_parachute_if_ready(self) -> None:
        if self.deployed_parachute:
            # Parachute has already been deployed. Do nothing.
            return

        # Get rocket's current position from the sensor module via
        # its position() method
        current_position = self.sensor_module.get_position()
        
        # Get rocket's current velocity from the sensor module via
        # its velocity() method
        current_velocity = self.sensor_module.get_velocity()

        # Let's say the parachute is meant to be deployed at
        # apogee (peak of trajectory). Let's say the y coordinate
        # dimension represents elevation. Then we should deploy the
        # parachute when the y coordinate of current_velocity becomes
        # non-positive (when the rocket is no longer moving upward)
        if current_velocity.y <= 0:
            # Here, we would somehow engage with the hardware to
            # deploy the parachute. Again, use your imagination.
            # ...

            self.deployed_parachute = True

    def log_data(self) -> None:
        # Get rocket's current position from the sensor module via
        # its position() method
        current_position = self.sensor_module.get_position()
        
        # Get rocket's current velocity from the sensor module via
        # its velocity() method
        current_velocity = self.sensor_module.get_velocity()

        # Here, we would somehow send current_position and
        # current_velocity to the ground receiver for monitoring.
        # Use your imagination.
        # ...
