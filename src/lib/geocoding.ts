export interface Address {
  street?: string;
  area?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
  formattedAddress?: string;
}

export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<Address> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
      {
        headers: {
          "User-Agent": "AdminPanel/1.0",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Geocoding failed");
    }

    const data = await response.json();
    const addr = data.address || {};

    return {
      street: addr.road || addr.street || addr.neighbourhood,
      area: addr.suburb || addr.neighbourhood || addr.quarter,
      city: addr.city || addr.town || addr.village || addr.municipality,
      state: addr.state,
      postcode: addr.postcode,
      country: addr.country,
      formattedAddress: data.display_name,
    };
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return {};
  }
}

export function formatAddress(address: Address): string {
  const parts: string[] = [];

  if (address.street) parts.push(address.street);
  if (address.area) parts.push(address.area);
  if (address.city) parts.push(address.city);
  if (address.postcode) parts.push(address.postcode);

  return parts.length > 0 ? parts.join(", ") : "Address not available";
}
