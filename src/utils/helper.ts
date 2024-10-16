import { GeoCoordinates } from 'react-native-geolocation-service';

// Haversine formula constants
const R = 6371000; // Earth's radius in meters

// Function to convert degrees to radians
function degToRad(deg: number) {
  return deg * (Math.PI / 180);
}

// Function to normalize the direction between two points
// function getUnitVector(start: number, end: number, distance: number) {
//   return (end - start) / distance;
// }

// Calculate AR position based on lat/lng differences
export function calculateARPosition(currentLocation:GeoCoordinates, targetLocation: GeoCoordinates) {
  // Destructure current and target locations
  const { latitude: lat1, longitude: lon1 } = currentLocation;
  const { latitude: lat2, longitude: lon2 } = targetLocation;

  // Convert latitude and longitude differences to meters
  const deltaLat = degToRad(lat2 - lat1);
  const deltaLon = degToRad(lon2 - lon1);

  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) *
            Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance between current and target in meters

  // Approximate the AR positions based on distances
  // This assumes that x is east-west, z is north-south, and y is up-down
  const xPosition = deltaLon * R; // East-west displacement in meters
  let zPosition = deltaLat * R; // North-south displacement in meters
  zPosition = -Math.abs(zPosition);
  const yPosition = -2; // Fixed height

  return {position:[ xPosition, yPosition, zPosition ], distance};
}

// Calculate AR positions spaced 1 meter apart
// export function calculateARPosition(currentLocation: GeoCoordinates, targetLocation: GeoCoordinates) {
//  // Destructure current and target locations
//  const { latitude: lat1, longitude: lon1 } = currentLocation;
//  const { latitude: lat2, longitude: lon2 } = targetLocation;

//  // Convert latitude and longitude differences to meters
//  const deltaLat = degToRad(lat2 - lat1);
//  const deltaLon = degToRad(lon2 - lon1);

//  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
//            Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) *
//            Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
//  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//  const totalDistance = R * c; // Total distance between current and target in meters

//  // Approximate the AR positions based on distances
//  const rawXPosition = deltaLon * R; // East-west displacement in meters
//  const rawZPosition = deltaLat * R; // North-south displacement in meters

//  // Get the unit vector direction for x and z (normalized to 1 meter)
//  const xUnitVector = getUnitVector(0, rawXPosition, totalDistance);
//  const zUnitVector = getUnitVector(0, -Math.abs(rawZPosition), totalDistance);

//  const yPosition = -2; // Fixed height

//  // Generate positions and distances at 1 meter intervals
//  const positionsWithDistances: any = {};
//  for (let i = 0; i <= totalDistance; i++) {
//    const xPosition = xUnitVector * i; // x position at meter i
//    const zPosition = zUnitVector * i; // z position at meter i
//   //  positionsWithDistances.push({
//   //    position: [xPosition, yPosition, zPosition],
//   //    distance: i, // Distance from the start in meters
//   //  });
//    positionsWithDistances.position = [xPosition, yPosition, zPosition];
//    positionsWithDistances.distance = i;
//  }

//  return positionsWithDistances;
// }

const scaleFactor = 111000;  // Scale degrees to meters (rough approximation)

export const convertLatLongToAR = (currentLocation:GeoCoordinates, targetLocation: GeoCoordinates) => {
  // Convert the difference between the user’s lat/long and the base to AR coordinates
  const xPosition = (targetLocation.latitude - currentLocation.latitude) * scaleFactor;
  const zPosition = (targetLocation.longitude - currentLocation.longitude) * scaleFactor;
  return [xPosition, -2, zPosition];  // yPosition remains constant (-1 for floor level)
};

// const clampValue = (value: number, min: number, max: number) =>
//   Math.max(min, Math.min(max, value));
// const convertGeoToAR = (latitude: number, longitude: number) => {
//   const scaleFactor = 10000; // Adjust this factor as needed

//   // Calculate AR position
//   const xPosition = clampValue(longitude * scaleFactor, 1, -1); // X = Longitude
//   const yPosition = -1; // Always -1 as per your requirement
//   const zPosition = clampValue(-latitude * scaleFactor, 1, -1); // Z = -Latitude (depth)

//   return [xPosition, yPosition, zPosition]; // Return AR coordinates
// }
