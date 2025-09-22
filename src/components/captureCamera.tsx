"use client";

import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

interface CameraCaptureProps {
  onCapture: (image: string, location: { lat: number; lng: number }) => void;
}

const CameraCaptureWithLocation: React.FC<CameraCaptureProps> = ({ onCapture }) => {
  const webcamRef = useRef<Webcam>(null);
  const [captured, setCaptured] = useState(false);

  const handleCapture = () => {
    if (!captured && webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) return;

      // Get location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          onCapture(imageSrc, location);
          setCaptured(true);
        },
        (err) => {
          console.error("Location error:", err);
          onCapture(imageSrc, { lat: 0, lng: 0 }); // fallback
          setCaptured(true);
        },
        { enableHighAccuracy: true }
      );
    }
  };

  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  return (
    <div className="mb-4">
      {!captured && (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full rounded-lg"
            videoConstraints={{ facingMode: "environment" }}
          />
          <button
            type="button"
            onClick={() => {
              if (webcamRef.current) {
                const imageSrc = webcamRef.current.getScreenshot();
                if (!imageSrc) return;
                // Get location
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    const location = {
                      lat: position.coords.latitude,
                      lng: position.coords.longitude,
                    };
                    setCapturedImage(imageSrc);
                    onCapture(imageSrc, location);
                    setCaptured(true);
                  },
                  (err) => {
                    console.error("Location error:", err);
                    setCapturedImage(imageSrc);
                    onCapture(imageSrc, { lat: 0, lng: 0 });
                    setCaptured(true);
                  },
                  { enableHighAccuracy: true }
                );
              }
            }}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Capture Photo
          </button>
        </>
      )}
      {captured && capturedImage && (
        <div className="flex flex-col items-center">
          <img src={capturedImage} alt="Captured" className="rounded-lg shadow-lg max-h-64" />
          <p className="text-green-600 mt-2">Photo captured!</p>
        </div>
      )}
    </div>
  );
};

export default CameraCaptureWithLocation;
