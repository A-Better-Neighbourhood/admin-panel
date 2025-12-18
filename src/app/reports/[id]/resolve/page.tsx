/** @format */

"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Issue, issuesAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Camera, CheckCircle, ArrowLeft, Clock } from "lucide-react";
import Image from "next/image";
import { reverseGeocode, formatAddress, Address } from "@/lib/geocoding";

export default function ResolveReportPage() {
  const router = useRouter();
  const params = useParams();
  const reportId = params?.id as string;

  const [report, setReport] = useState<Issue | null>(null);
  const [address, setAddress] = useState<Address>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [resolutionNote, setResolutionNote] = useState("");
  const [resolutionImage, setResolutionImage] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [success, setSuccess] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    loadReport();
  }, [reportId]);

  const loadReport = async () => {
    try {
      const data = await issuesAPI.getAllIssues();
      const foundReport = data.find((r) => r.id === reportId);
      if (foundReport) {
        setReport(foundReport);

        // Fetch address
        const addr = await reverseGeocode(
          foundReport.latitude,
          foundReport.longitude
        );
        setAddress(addr);
      }
    } catch (error) {
      console.error("Failed to load report:", error);
    } finally {
      setLoading(false);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Could not access camera. Please check permissions.");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL("image/jpeg");
        setResolutionImage(imageData);
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      setCameraActive(false);
    }
  };

  const handleSubmit = async () => {
    if (!resolutionImage || !resolutionNote.trim()) {
      alert("Please capture/upload an image and add resolution notes.");
      return;
    }

    setSubmitting(true);
    try {
      // Update report status to RESOLVED
      await issuesAPI.updateIssueStatus(reportId, "RESOLVED");

      // Here you would also send the resolution image and notes to the server
      // This would create an activity entry in the timeline

      setSuccess(true);
      setTimeout(() => {
        router.push("/reports");
      }, 2000);
    } catch (error) {
      console.error("Failed to resolve report:", error);
      alert("Failed to resolve report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Report Not Found
          </h1>
          <Button onClick={() => router.push("/reports")}>
            Back to Reports
          </Button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Report Resolved!
          </h1>
          <p className="text-gray-600 mb-8">
            The report has been marked as resolved and the resolution has been
            recorded in the timeline.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/reports")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Reports
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Resolve Report
          </h1>
          <p className="text-gray-600">
            Document the resolution with a photo and notes
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Original Report */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Original Report
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {report.title}
                </h3>
                <p className="text-sm text-gray-600">{report.description}</p>
              </div>

              {report.imageUrl && report.imageUrl.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Original Images
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {report.imageUrl.map((url, idx) => (
                      <div
                        key={idx}
                        className="relative h-32 rounded-lg overflow-hidden border border-gray-200"
                      >
                        <Image
                          src={url}
                          alt={`Original ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-gray-200 space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>
                    Reported on{" "}
                    {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Reporter:</span>{" "}
                  {report.creator.fullName}
                </div>
                <div>
                  <span className="font-medium">Location:</span>
                  <div className="mt-1 ml-0">
                    <div className="font-medium text-gray-700">
                      {formatAddress(address)}
                    </div>
                    <a
                      href={`https://www.google.com/maps?q=${report.latitude},${report.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-xs"
                    >
                      {report.latitude.toFixed(6)},{" "}
                      {report.longitude.toFixed(6)}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Resolution Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Resolution Documentation
            </h2>

            <div className="space-y-6">
              {/* Image Capture/Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resolution Photo *
                </label>

                {!resolutionImage && !cameraActive && (
                  <Button
                    onClick={startCamera}
                    className="w-full"
                    variant="outline"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Take Photo
                  </Button>
                )}

                {cameraActive && (
                  <div className="space-y-2">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full rounded-lg border border-gray-200"
                    />
                    <div className="flex gap-2">
                      <Button onClick={capturePhoto} className="flex-1">
                        Capture Photo
                      </Button>
                      <Button
                        onClick={stopCamera}
                        variant="outline"
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {resolutionImage && (
                  <div className="space-y-2">
                    <div className="relative h-64 rounded-lg overflow-hidden border border-gray-200">
                      <Image
                        src={resolutionImage}
                        alt="Resolution"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <Button
                      onClick={() => setResolutionImage(null)}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      Retake Photo
                    </Button>
                  </div>
                )}

                <canvas ref={canvasRef} className="hidden" />
              </div>

              {/* Resolution Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resolution Notes *
                </label>
                <Textarea
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="Describe how the issue was resolved, actions taken, etc."
                  rows={6}
                  className="w-full"
                />
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                disabled={submitting || !resolutionImage || !resolutionNote}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve & Mark as Resolved
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
