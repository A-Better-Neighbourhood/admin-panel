"use client";

import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";

interface CameraCaptureProps {
  onCapture: (image: string, location: { lat: number; lng: number }) => void;
}

const CAMERA_HEIGHT = 320;

const CameraCaptureWithLocation: React.FC<CameraCaptureProps> = ({ onCapture }) => {
  const webcamRef = useRef<Webcam>(null);
  const [captured, setCaptured] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Prevent hydration mismatch by not rendering anything until mounted on client
    return null;
  }

  return (
    <div className="mb-4 w-full flex flex-col items-center">
      {!captured && (
        <>
          <div className="w-full flex justify-center" style={{ minHeight: CAMERA_HEIGHT, maxHeight: CAMERA_HEIGHT }}>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-full rounded-lg object-cover"
              videoConstraints={{ facingMode: "environment", height: CAMERA_HEIGHT }}
              style={{ minHeight: CAMERA_HEIGHT, maxHeight: CAMERA_HEIGHT }}
            />
          </div>
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
        <div className="relative flex flex-col items-center w-full" style={{ minHeight: CAMERA_HEIGHT, maxHeight: CAMERA_HEIGHT }}>
          <img src={capturedImage} alt="Captured" className="rounded-lg shadow-lg max-h-64 object-cover w-full" style={{ minHeight: CAMERA_HEIGHT, maxHeight: CAMERA_HEIGHT }} />
          <button
            type="button"
            onClick={() => {
              setCaptured(false);
              setCapturedImage(null);
            }}
            className="absolute top-2 right-2 px-3 py-1 bg-yellow-500 text-white rounded shadow-lg z-10"
            style={{ fontSize: '0.95rem' }}
          >
            Retake
          </button>
          <p className="text-green-600 mt-2">Photo captured!</p>
        </div>
      )}
    </div>
  );
};

export default CameraCaptureWithLocation;
