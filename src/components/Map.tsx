import React from "react";

interface MapProps {
  lat: number;
  lng: number;
  zoom?: number;
  width?: string;
  height?: string;
}

const Map: React.FC<MapProps> = ({ lat, lng, zoom = 15, width = "100%", height = "250px" }) => {
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01}%2C${lat-0.01}%2C${lng+0.01}%2C${lat+0.01}&layer=mapnik&marker=${lat}%2C${lng}`;
  return (
    <iframe
      title="Location Map"
      width={width}
      height={height}
      src={src}
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
};

export default Map;
