// Reverse geocoding utility to convert coordinates to location names
// Using Nominatim (OpenStreetMap) free API

interface LocationNameCache {
  [key: string]: string;
}

const locationCache: LocationNameCache = {};

export const reverseGeocode = async (
  latitude: number,
  longitude: number
): Promise<string> => {
  const cacheKey = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;

  // Return from cache if available
  if (locationCache[cacheKey]) {
    return locationCache[cacheKey];
  }

  try {
    // Using Nominatim API (free, no key required)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
      {
        headers: {
          "Accept-Language": "en",
        },
      }
    );

    if (!response.ok) {
      return formatCoordinates(latitude, longitude);
    }

    const data = await response.json();

    // Extract detailed location name from response
    let locationName = "Unknown Location";

    if (data.address) {
      const addr = data.address;
      const parts: string[] = [];

      // Build comprehensive address format
      // Format: House Number + Street Name, Locality/Area, City, State, Postal Code, Country

      // 1. Street address with house number
      let streetAddress = "";
      if (addr.house_number && (addr.road || addr.street)) {
        streetAddress = `${addr.house_number} ${addr.road || addr.street}`;
      } else if (addr.road || addr.street) {
        streetAddress = addr.road || addr.street;
      }

      if (streetAddress) {
        parts.push(streetAddress);
      }

      // 2. Locality/Area/Neighbourhood/Suburb
      if (addr.neighbourhood) {
        parts.push(addr.neighbourhood);
      } else if (addr.suburb) {
        parts.push(addr.suburb);
      } else if (addr.locality) {
        parts.push(addr.locality);
      }

      // 3. Village/Town/City (choose the most specific)
      let cityArea = "";
      if (addr.village) {
        cityArea = addr.village;
      } else if (addr.town) {
        cityArea = addr.town;
      } else if (addr.city) {
        cityArea = addr.city;
      } else if (addr.county) {
        cityArea = addr.county;
      }

      if (cityArea && !parts.includes(cityArea)) {
        parts.push(cityArea);
      }

      // 4. State/Province
      if (addr.state && !parts.includes(addr.state)) {
        parts.push(addr.state);
      }

      // 5. Postal Code
      if (addr.postcode) {
        parts.push(addr.postcode);
      }

      // 6. Country
      if (addr.country && !parts.includes(addr.country)) {
        parts.push(addr.country);
      }

      // Join all parts with proper formatting
      if (parts.length > 0) {
        locationName = parts.join(", ");
      }
    }

    // Append coordinates for precise navigation reference
    const coordinates = ` (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`;
    const fullLocation = locationName + coordinates;

    // Cache the result
    locationCache[cacheKey] = fullLocation;
    return fullLocation;
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return formatCoordinates(latitude, longitude);
  }
};

export const formatCoordinates = (latitude: number, longitude: number): string => {
  return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
};

export const getLocationName = (
  latitude: number,
  longitude: number,
  defaultName?: string
): string => {
  if (defaultName) return defaultName;
  return formatCoordinates(latitude, longitude);
};
