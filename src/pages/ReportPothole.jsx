import React, { useState, useEffect, useRef } from 'react';
import { Camera, MapPin, Upload, Send, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { base_url } from '../utils/base_url';
import FloatingLocationAlert from '../components/FloatingLocationAlert';
import UserProfile from '../components/UserProfile';

const API_URL = `${base_url}/api`;
const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

const mapContainerStyle = {
    width: "100%",
    height: "350px",
    borderRadius: "10px",
};

function ReportPothole() {
    const [image, setImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    const [location, setLocation] = useState(null);
    const [address, setAddress] = useState("");

    const [severity, setSeverity] = useState("mild");
    const [position, setPosition] = useState("middle");
    const [description, setDescription] = useState("");
    const [reportedBy, setReportedBy] = useState("");

    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [locationLoading, setLocationLoading] = useState(false);

    const fileInputRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const [cameraOpen, setCameraOpen] = useState(false);
    const [cameraStream, setCameraStream] = useState(null);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: MAPS_API_KEY,
    });

    const getCurrentLocation = async () => {
        if (!navigator.geolocation) {
            setError("Geolocation not supported");
            return;
        }

        setLocationLoading(true);

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const coords = {
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                };
                setLocation(coords);

                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`
                    );
                    const data = await res.json();
                    setAddress(data.display_name || "Unknown location");
                } catch {
                    setAddress(`${coords.latitude}, ${coords.longitude}`);
                }

                setLocationLoading(false);
            },
            () => {
                setError("Failed to get location");
                setLocationLoading(false);
            }
        );
    };

    useEffect(() => {
        getCurrentLocation();
    }, []);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith("image/")) {
            return setError("Invalid image");
        }

        setImageFile(file);

        const reader = new FileReader();
        reader.onload = (e) => setImage(e.target.result);
        reader.readAsDataURL(file);
    };

    const openCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.current.srcObject = stream;
            setCameraStream(stream);
            setCameraOpen(true);
        } catch {
            setError("Camera access denied");
        }
    };

    const capturePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);

        canvas.toBlob((blob) => {
            setImageFile(blob);
            setImage(canvas.toDataURL("image/jpeg"));
            closeCamera();
        }, "image/jpeg");
    };

    const closeCamera = () => {
        if (cameraStream) cameraStream.getTracks().forEach((t) => t.stop());
        setCameraOpen(false);
    };

    const submitReport = async () => {
        if (!image) return setError("Image required");
        if (!location) return setError("Location required");
        if (!description.trim()) return setError("Description required");

        setLoading(true);
        setUploadProgress(0);

        const form = new FormData();
        form.append("image", imageFile, imageFile.name || "report.jpg");
        form.append("latitude", location.latitude);
        form.append("longitude", location.longitude);
        form.append("address", address);
        form.append("severity", severity);
        form.append("position", position);
        form.append("description", description);
        form.append("reportedBy", reportedBy || "Anonymous");

        try {
            const xhr = new XMLHttpRequest();
            xhr.open("POST", `${API_URL}/potholes`);

            xhr.upload.onprogress = (e) => {
                if (e.lengthComputable)
                    setUploadProgress(Math.round((e.loaded / e.total) * 100));
            };

            xhr.onload = () => {
                setLoading(false);
                if (xhr.status === 201) {
                    setSuccess(true);
                    setTimeout(resetForm, 2000);
                } else setError("Submission failed");
            };

            xhr.onerror = () => setError("Network error");

            xhr.send(form);
        } catch {
            setError("Failed to submit");
            setLoading(false);
        }
    };

    const resetForm = () => {
        setImage(null);
        setImageFile(null);
        setLocation(null);
        setAddress("");
        setSeverity("mild");
        setPosition("middle");
        setDescription("");
        setReportedBy("");
        setSuccess(false);
        getCurrentLocation();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">

            {/* <FloatingLocationAlert /> */}
            {/* HEADER */}
            <header className="bg-white shadow-md p-6 text-center flex justify-between">
                <div><h1 className="text-3xl font-bold">Pothole Reporter</h1>
                    <p className="text-gray-600">Help us improve road conditions</p></div>
                <UserProfile />
            </header>

            <div className="max-w-7xl mx-auto p-6 space-y-6">

                {/* SUCCESS */}
                {success && (
                    <div className="p-4 bg-green-100 border border-green-400 rounded-lg flex gap-3">
                        <CheckCircle className="text-green-600" />
                        Report submitted successfully!
                    </div>
                )}

                {/* ERROR */}
                {error && (
                    <div className="p-4 bg-red-100 border border-red-400 rounded-lg flex gap-3">
                        <AlertCircle className="text-red-600" />
                        {error}
                    </div>
                )}

                {/* ========= GOOGLE MAP SECTION ========= */}
                {isLoaded && (
                    <div className="bg-white p-6 shadow-md rounded-lg">
                        <h2 className="text-lg font-semibold mb-3 flex gap-2 items-center">
                            <MapPin className="w-5 h-5" /> Your Location *
                        </h2>

                        {/* MAP (User cannot move or change anything) */}
                        {location && (
                            <GoogleMap
                                center={{ lat: location.latitude, lng: location.longitude }}
                                zoom={16}
                                mapContainerStyle={mapContainerStyle}
                                options={{
                                    draggable: false,
                                    zoomControl: false,
                                    scrollwheel: false,
                                    disableDoubleClickZoom: true,
                                }}
                            >
                                <Marker
                                    position={{ lat: location.latitude, lng: location.longitude }}
                                    draggable={false}
                                />
                            </GoogleMap>
                        )}

                        <p className="mt-3 text-sm text-gray-700">
                            📍 <strong>Address:</strong> {address || "No location found"}
                        </p>
                    </div>
                )}

                {/* === IMAGE UPLOAD SECTION === */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold flex gap-2 items-center">
                        <Camera className="w-5" /> Photo *
                    </h2>

                    {image ? (
                        <>
                            <img src={image} className="w-full h-64 object-cover rounded-lg mt-4" />
                            <button
                                onClick={() => { setImage(null); setImageFile(null); }}
                                className="w-full mt-3 px-4 py-2 bg-gray-300 rounded-lg"
                            >
                                Remove Photo
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={openCamera}
                                className="w-full mt-3 px-4 py-3 bg-blue-600 text-white rounded-lg flex justify-center gap-2"
                            >
                                <Camera /> Open Camera
                            </button>

                            <button
                                onClick={() => fileInputRef.current.click()}
                                className="w-full mt-3 px-4 py-3 bg-gray-600 text-white rounded-lg flex justify-center gap-2"
                            >
                                <Upload /> Upload From Device
                            </button>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileSelect}
                            />
                        </>
                    )}
                </div>

                {/* OTHER FORM FIELDS */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="font-semibold mb-2">Severity *</h2>
                    <select className="w-full p-3 border rounded-lg" value={severity} onChange={(e) => setSeverity(e.target.value)}>
                        <option value="mild">Mild</option>
                        <option value="severe">Severe</option>
                        <option value="dangerous">Dangerous</option>
                    </select>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="font-semibold mb-2">Position *</h2>
                    <select className="w-full p-3 border rounded-lg" value={position} onChange={(e) => setPosition(e.target.value)}>
                        <option value="left">Left</option>
                        <option value="middle">Middle</option>
                        <option value="right">Right</option>
                        <option value="full-width">Full width</option>
                    </select>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="font-semibold mb-2">Description *</h2>
                    <textarea
                        rows="3"
                        className="w-full p-3 border rounded-lg"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe the pothole"
                    />
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="font-semibold mb-2">Your Name (Optional)</h2>
                    <input
                        type="text"
                        className="w-full p-3 border rounded-lg"
                        value={reportedBy}
                        onChange={(e) => setReportedBy(e.target.value)}
                        placeholder="Enter name"
                    />
                </div>

                <button
                    onClick={submitReport}
                    disabled={loading}
                    className="w-full px-6 py-4 bg-red-600 text-white rounded-lg text-lg flex justify-center gap-2"
                >
                    {loading ? <Loader className="animate-spin" /> : <Send />} Submit Report
                </button>
            </div>
        </div>

    );
}

export default ReportPothole;
