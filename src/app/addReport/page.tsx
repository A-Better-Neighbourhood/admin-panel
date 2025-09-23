"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Input, Button } from "../../components";
import CameraCaptureWithLocation from "../../components/captureCamera";

const Map = dynamic(() => import("../../components/Map"), { ssr: false });

export default function AddReportPage() {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationName, setLocationName] = useState<string>("");
  const [road, setRoad] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [country, setCountry] = useState<string>("");

  useEffect(() => {
    async function fetchLocationName() {
      if (location) {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}`
          );
          const data = await response.json();
          setLocationName(data.display_name || "Unknown location");
          setRoad(data.address?.road || ""); // Only use the exact road name
          setState(data.address?.state || "");
          setCountry(data.address?.country || "");
        } catch (err) {
          setLocationName("Unknown location");
          setRoad("");
          setState("");
          setCountry("");
        }
      } else {
        setLocationName("");
        setRoad("");
        setState("");
        setCountry("");
      }
    }
    fetchLocationName();
  }, [location]);

  return (
    <div className="max-w-xl mx-auto bg-white/90 rounded-2xl shadow-xl p-8 mt-8 flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-2">Add a New Report</h2>
      <Input
        label="Title"
        placeholder="Enter report title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="mb-2"
      />
      <CameraCaptureWithLocation
        onCapture={(img, loc) => {
          setImage(img);
          setLocation(loc);
        }}
      />
      {location && (
        <div className="mb-4">
          <label className="block font-semibold mb-1">Location:</label>
          <div className="text-gray-700 mb-2">
            {locationName && <span className="block font-medium">Address: {locationName}</span>}
            {road && <span>Road: {road} <br /></span>}
            <span>Lat: {location.lat}, Lng: {location.lng}</span>
          </div>
          <div className="rounded-lg overflow-hidden border border-gray-200">
            <Map lat={location.lat} lng={location.lng} />
          </div>
        </div>
      )}
      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg mt-4">
        Submit Report
      </Button>
    </div>
  );
}
