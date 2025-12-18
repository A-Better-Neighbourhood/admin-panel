/** @format */
/** @format */

import React from "react";

interface MapProps {
  lat: number;
  lng: number;
  zoom?: number;
  width?: string;
  height?: string;
  className?: string;
}

const Map: React.FC<MapProps> = ({
  lat,
  lng,
  zoom = 15,
  width = "100%",
  height = "250px",
  className = "",
}) => {
  const bbox = 0.01; // Bounding box size
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${
    lng - bbox
  }%2C${lat - bbox}%2C${lng + bbox}%2C${
    lat + bbox
  }&layer=mapnik&marker=${lat}%2C${lng}`;

  return (
    <div className={`rounded-lg overflow-hidden ${className}`}>
      <iframe
        title="Location Map"
        width={width}
        height={height}
        src={src}
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="w-full"
      />
    </div>
  );
};

export default Map;
