import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, X, Check, RefreshCw, AlertCircle, Image as ImageIcon } from 'lucide-react';

interface CameraUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSelected: (imageDataUrl: string) => void;
  currentImage?: string;
  title?: string;
}

export const CameraUploadModal: React.FC<CameraUploadModalProps> = ({
  isOpen,
  onClose,
  onImageSelected,
  currentImage,
  title = 'Add Resource Photograph',
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'camera'>('upload');
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Stop camera when closing or changing tabs
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
    } else {
      setPreviewUrl(currentImage || null);
      setFileError(null);
      setCameraError(null);
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, currentImage]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API is not supported on this browser or device.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: unknown) {
      console.warn('Camera access error:', err);
      const message = err instanceof Error ? err.message : 'Unable to access camera.';
      setCameraError(
        message.includes('Permission') || message.includes('denied')
          ? 'Camera permission was denied. Please allow camera permissions in browser settings or upload from device.'
          : 'Camera device not accessible. You can use the device file uploader instead.'
      );
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setPreviewUrl(dataUrl);
      stopCamera();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!file.type.startsWith('image/')) {
      setFileError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setFileError('Image file size must be less than 5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPreviewUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleConfirm = () => {
    if (previewUrl) {
      onImageSelected(previewUrl);
      stopCamera();
      onClose();
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-teal-50 text-teal-700 rounded-lg">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">{title}</h3>
              <p className="text-xs text-slate-500">Capture or upload photographic condition proof</p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2">
          <button
            type="button"
            onClick={() => {
              stopCamera();
              setActiveTab('upload');
            }}
            className={`pb-2.5 px-3 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'upload'
                ? 'border-teal-700 text-teal-900'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5" />
              Upload from Device
            </span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('camera');
              if (!isCameraActive && !previewUrl) {
                startCamera();
              }
            }}
            className={`pb-2.5 px-3 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'camera'
                ? 'border-teal-700 text-teal-900'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5" />
              Device Camera
            </span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6">
          {previewUrl ? (
            <div className="space-y-4">
              <div className="relative aspect-4/3 w-full bg-slate-950 rounded-lg overflow-hidden border border-slate-200">
                <img
                  src={previewUrl}
                  alt="Captured resource"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemove}
                  className="absolute top-2 right-2 p-1.5 bg-slate-900/80 hover:bg-red-600 text-white rounded-lg transition-colors shadow-sm"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 px-1">
                <span className="flex items-center gap-1 text-emerald-700 font-medium">
                  <Check className="w-4 h-4" />
                  Photograph selected
                </span>
                <button
                  type="button"
                  onClick={() => {
                    handleRemove();
                    if (activeTab === 'camera') {
                      startCamera();
                    }
                  }}
                  className="text-teal-700 hover:text-teal-800 font-medium underline"
                >
                  Retake or replace
                </button>
              </div>
            </div>
          ) : activeTab === 'upload' ? (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileChange}
                className="hidden"
                id="resource-image-input"
              />
              <label
                htmlFor="resource-image-input"
                className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 rounded-xl hover:border-teal-500 hover:bg-teal-50/20 cursor-pointer transition-colors text-center"
              >
                <div className="p-3 bg-slate-100 rounded-full text-slate-500 mb-3">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-slate-800">
                  Click to browse or drop an image
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Supported formats: JPG, PNG, WebP (up to 5 MB)
                </p>
              </label>

              {fileError && (
                <div className="flex items-center gap-2 p-3 text-xs text-red-700 bg-red-50 rounded-lg border border-red-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{fileError}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {cameraError ? (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-slate-800 space-y-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-amber-900">Camera Notice</p>
                      <p className="text-xs text-slate-600 mt-0.5">{cameraError}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('upload')}
                    className="w-full py-2 px-3 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
                  >
                    Switch to File Upload
                  </button>
                </div>
              ) : isCameraActive ? (
                <div className="space-y-3">
                  <div className="relative aspect-4/3 w-full bg-black rounded-lg overflow-hidden border border-slate-800">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-3 flex justify-center">
                      <button
                        type="button"
                        onClick={capturePhoto}
                        className="flex items-center gap-2 py-2 px-5 bg-white text-slate-900 rounded-full font-semibold text-xs shadow-lg hover:bg-slate-100 transition-transform active:scale-95"
                      >
                        <Camera className="w-4 h-4 text-teal-600" />
                        Capture Frame
                      </button>
                    </div>
                  </div>
                  <p className="text-center text-xs text-slate-500">
                    Position the school resource in good lighting and tap Capture Frame
                  </p>
                </div>
              ) : (
                <div className="text-center py-6 space-y-3">
                  <button
                    type="button"
                    onClick={startCamera}
                    className="inline-flex items-center gap-2 py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Start Camera Stream
                  </button>
                  <p className="text-xs text-slate-500">
                    Browser will request temporary camera device access
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-3.5 bg-slate-50 border-t border-slate-200">
          <button
            type="button"
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="px-4 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!previewUrl}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Check className="w-4 h-4" />
            Use This Photograph
          </button>
        </div>
      </div>
    </div>
  );
};
