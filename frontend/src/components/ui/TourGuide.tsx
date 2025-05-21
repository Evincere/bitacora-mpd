import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import type { DriveStep } from 'driver.js';

export const useTourGuide = () => {
  const driverObj = driver({
    animate: true,
    overlayOpacity: 0.75,
    stagePadding: 5,
  });

  const startTour = (steps: DriveStep[]) => {
    driverObj.setSteps(steps);
    driverObj.drive();
  };

  return { startTour };
};
