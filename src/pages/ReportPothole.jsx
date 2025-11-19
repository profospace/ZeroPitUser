// import React, { useState, useEffect, useRef } from 'react';
// import { Camera, MapPin, Upload, Send, AlertCircle, CheckCircle, Loader } from 'lucide-react';
// import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
// import { base_url } from '../utils/base_url';
// import FloatingLocationAlert from '../components/FloatingLocationAlert';
// import UserProfile from '../components/UserProfile';
// import { useNavigate } from 'react-router-dom';
// import { checkIsAuthenticated, getConfig } from '../utils/auth';
// import toast from 'react-hot-toast';

// const API_URL = `${base_url}/api`;
// const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

// const mapContainerStyle = {
//     width: "100%",
//     height: "350px",
//     borderRadius: "10px",
// };

// function ReportPothole() {
//     const navigate = useNavigate(); // ADD: For navigation

//     // const [image, setImage] = useState(null);
//     // const [imageFile, setImageFile] = useState(null);

//     const [images, setImages] = useState([]); // Changed from image to images array
//     const [imageFiles, setImageFiles] = useState([]);

//     // ADD: New state for form persistence
//     const [formData, setFormData] = useState(() => {
//         const saved = sessionStorage.getItem('potholeFormData');
//         return saved ? JSON.parse(saved) : null;
//     });

//     const [location, setLocation] = useState(null);
//     const [address, setAddress] = useState("");

//     const [severity, setSeverity] = useState("mild");
//     const [position, setPosition] = useState("middle");
//     const [description, setDescription] = useState("");
//     const [reportedBy, setReportedBy] = useState("");

//     const [loading, setLoading] = useState(false);
//     const [uploadProgress, setUploadProgress] = useState(0);
//     const [success, setSuccess] = useState(false);
//     const [error, setError] = useState("");
//     const [locationLoading, setLocationLoading] = useState(false);

//     const fileInputRef = useRef(null);
//     const videoRef = useRef(null);
//     const canvasRef = useRef(null);

//     const [cameraOpen, setCameraOpen] = useState(false);
//     const [cameraStream, setCameraStream] = useState(null);

//     const { isLoaded } = useJsApiLoader({
//         googleMapsApiKey: MAPS_API_KEY,
//     });



//     const getCurrentLocation = async () => {
//         if (!navigator.geolocation) {
//             setError("Geolocation not supported");
//             return;
//         }

//         setLocationLoading(true);

//         navigator.geolocation.getCurrentPosition(
//             async (pos) => {
//                 const coords = {
//                     latitude: pos.coords.latitude,
//                     longitude: pos.coords.longitude,
//                 };
//                 setLocation(coords);

//                 try {
//                     const res = await fetch(
//                         `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`
//                     );
//                     const data = await res.json();
//                     setAddress(data.display_name || "Unknown location");
//                 } catch {
//                     setAddress(`${coords.latitude}, ${coords.longitude}`);
//                 }

//                 setLocationLoading(false);
//             },
//             () => {
//                 setError("Failed to get location");
//                 setLocationLoading(false);
//             }
//         );
//     };


//     // ADD: Effect to restore form data after login
//     useEffect(() => {
//         if (formData) {
//             setLocation(formData.location);
//             setAddress(formData.address);
//             setSeverity(formData.severity);
//             setPosition(formData.position);
//             setDescription(formData.description);
//             setReportedBy(formData.reportedBy);
//             setImages(formData.images || []);
//             setImageFiles(formData.imageFiles || []);

//             // Clear after restoring
//             sessionStorage.removeItem('potholeFormData');
//             toast.success('Form data restored!');
//         }
//     }, []);

//     useEffect(() => {
//         getCurrentLocation();
//     }, []);

//     // const handleFileSelect = (e) => {
//     //     const file = e.target.files[0];
//     //     if (!file || !file.type.startsWith("image/")) {
//     //         return setError("Invalid image");
//     //     }

//     //     setImageFile(file);

//     //     const reader = new FileReader();
//     //     reader.onload = (e) => setImage(e.target.result);
//     //     reader.readAsDataURL(file);
//     // };

//     const handleFileSelect = (e) => {
//         const files = Array.from(e.target.files);

//         if (images.length + files.length > 3) {
//             return toast.error('Maximum 3 images allowed');
//         }

//         const validFiles = files.filter(f => f.type.startsWith('image/'));

//         if (validFiles.length !== files.length) {
//             toast.error('Only image files are allowed');
//         }

//         validFiles.forEach(file => {
//             const reader = new FileReader();
//             reader.onload = (e) => {
//                 setImages(prev => [...prev, e.target.result]);
//                 setImageFiles(prev => [...prev, file]);
//             };
//             reader.readAsDataURL(file);
//         });
//     };

//     const openCamera = async () => {
//         try {
//             const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//             videoRef.current.srcObject = stream;
//             setCameraStream(stream);
//             setCameraOpen(true);
//         } catch {
//             setError("Camera access denied");
//         }
//     };

//     // const capturePhoto = () => {
//     //     const video = videoRef.current;
//     //     const canvas = canvasRef.current;
//     //     const ctx = canvas.getContext("2d");

//     //     canvas.width = video.videoWidth;
//     //     canvas.height = video.videoHeight;
//     //     ctx.drawImage(video, 0, 0);

//     //     canvas.toBlob((blob) => {
//     //         setImageFile(blob);
//     //         setImage(canvas.toDataURL("image/jpeg"));
//     //         closeCamera();
//     //     }, "image/jpeg");
//     // };

//     const capturePhoto = () => {
//         if (images.length >= 3) {
//             return toast.error('Maximum 3 images allowed');
//         }

//         const video = videoRef.current;
//         const canvas = canvasRef.current;
//         const ctx = canvas.getContext("2d");

//         canvas.width = video.videoWidth;
//         canvas.height = video.videoHeight;
//         ctx.drawImage(video, 0, 0);

//         canvas.toBlob((blob) => {
//             const dataUrl = canvas.toDataURL("image/jpeg");
//             setImageFiles(prev => [...prev, blob]);
//             setImages(prev => [...prev, dataUrl]);
//             closeCamera();
//             toast.success('Photo captured!');
//         }, "image/jpeg");
//     };

//     // ADD: Function to remove individual image
//     const removeImage = (index) => {
//         setImages(prev => prev.filter((_, i) => i !== index));
//         setImageFiles(prev => prev.filter((_, i) => i !== index));
//         toast.success('Image removed');
//     };

//     const closeCamera = () => {
//         if (cameraStream) cameraStream.getTracks().forEach((t) => t.stop());
//         setCameraOpen(false);
//     };

//     // const submitReport = async () => {
//     //     if (!image) return setError("Image required");
//     //     if (!location) return setError("Location required");
//     //     if (!description.trim()) return setError("Description required");

//     //     setLoading(true);
//     //     setUploadProgress(0);

//     //     const form = new FormData();
//     //     form.append("image", imageFile, imageFile.name || "report.jpg");
//     //     form.append("latitude", location.latitude);
//     //     form.append("longitude", location.longitude);
//     //     form.append("address", address);
//     //     form.append("severity", severity);
//     //     form.append("position", position);
//     //     form.append("description", description);
//     //     form.append("reportedBy", reportedBy || "Anonymous");

//     //     try {
//     //         const xhr = new XMLHttpRequest();
//     //         xhr.open("POST", `${API_URL}/potholes`);

//     //         xhr.upload.onprogress = (e) => {
//     //             if (e.lengthComputable)
//     //                 setUploadProgress(Math.round((e.loaded / e.total) * 100));
//     //         };

//     //         xhr.onload = () => {
//     //             setLoading(false);
//     //             if (xhr.status === 201) {
//     //                 setSuccess(true);
//     //                 setTimeout(resetForm, 2000);
//     //             } else setError("Submission failed");
//     //         };

//     //         xhr.onerror = () => setError("Network error");

//     //         xhr.send(form);
//     //     } catch {
//     //         setError("Failed to submit");
//     //         setLoading(false);
//     //     }
//     // };

//     const submitReport = async () => {
//         // Validation
//         if (images.length === 0) return toast.error('At least one image is required');
//         if (!location) return toast.error('Location is required');
//         if (!description.trim()) return toast.error('Description is required');

//         // CHANGE: Check authentication
//         if (!checkIsAuthenticated()) {
//             // Save form data to sessionStorage
//             sessionStorage.setItem('potholeFormData', JSON.stringify({
//                 location,
//                 address,
//                 severity,
//                 position,
//                 description,
//                 reportedBy,
//                 images,
//                 imageFiles
//             }));

//             toast.error('Please login to submit report');
//             navigate('/auth?redirect=/');
//             return;
//         }

//         setLoading(true);
//         setUploadProgress(0);

//         const form = new FormData();

//         // CHANGE: Append multiple images
//         imageFiles.forEach((file, index) => {
//             form.append('images', file, file.name || `report_${index}.jpg`);
//         });

//         form.append("latitude", location.latitude);
//         form.append("longitude", location.longitude);
//         form.append("address", address);
//         form.append("severity", severity);
//         form.append("position", position);
//         form.append("description", description);
//         form.append("reportedBy", reportedBy || "Anonymous");

//         try {
//             const xhr = new XMLHttpRequest();
//             xhr.open("POST", `${API_URL}/potholes`);

//             // ADD: Set authorization header
//             const config = getConfig();
//             Object.keys(config.headers).forEach(key => {
//                 xhr.setRequestHeader(key, config.headers[key]);
//             });

//             xhr.upload.onprogress = (e) => {
//                 if (e.lengthComputable)
//                     setUploadProgress(Math.round((e.loaded / e.total) * 100));
//             };

//             xhr.onload = () => {
//                 setLoading(false);
//                 if (xhr.status === 201) {
//                     setSuccess(true);
//                     toast.success('Report submitted successfully!');
//                     setTimeout(resetForm, 2000);
//                 } else if (xhr.status === 401) {
//                     toast.error('Session expired. Please login again');
//                     navigate('/auth?redirect=/');
//                 } else {
//                     toast.error('Submission failed');
//                 }
//             };

//             xhr.onerror = () => {
//                 toast.error('Network error occurred');
//                 setLoading(false);
//             };

//             xhr.send(form);
//         } catch (error) {
//             toast.error('Failed to submit report');
//             setLoading(false);
//         }
//     };


//     // const resetForm = () => {
//     //     setImage(null);
//     //     setImageFile(null);
//     //     setLocation(null);
//     //     setAddress("");
//     //     setSeverity("mild");
//     //     setPosition("middle");
//     //     setDescription("");
//     //     setReportedBy("");
//     //     setSuccess(false);
//     //     getCurrentLocation();
//     // };

//     const resetForm = () => {
//         setImages([]);
//         setImageFiles([]);
//         setLocation(null);
//         setAddress("");
//         setSeverity("mild");
//         setPosition("middle");
//         setDescription("");
//         setReportedBy("");
//         setSuccess(false);
//         setError("");
//         getCurrentLocation();
//     };

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">

//             {/* <FloatingLocationAlert /> */}
//             {/* HEADER */}
//             <header className="bg-white shadow-md p-6 text-center flex justify-between">
//                 <div><h1 className="text-3xl font-bold">Pothole Reporter</h1>
//                     <p className="text-gray-600">Help us improve road conditions</p></div>
//                 <UserProfile />
//             </header>

//             <div className="max-w-7xl mx-auto p-6 space-y-6">

//                 {/* SUCCESS */}
//                 {success && (
//                     <div className="p-4 bg-green-100 border border-green-400 rounded-lg flex gap-3">
//                         <CheckCircle className="text-green-600" />
//                         Report submitted successfully!
//                     </div>
//                 )}

//                 {/* ERROR */}
//                 {error && (
//                     <div className="p-4 bg-red-100 border border-red-400 rounded-lg flex gap-3">
//                         <AlertCircle className="text-red-600" />
//                         {error}
//                     </div>
//                 )}

//                 {/* ========= GOOGLE MAP SECTION ========= */}
//                 {isLoaded && (
//                     <div className="bg-white p-6 shadow-md rounded-lg">
//                         <h2 className="text-lg font-semibold mb-3 flex gap-2 items-center">
//                             <MapPin className="w-5 h-5" /> Your Location *
//                         </h2>

//                         {/* MAP (User cannot move or change anything) */}
//                         {location && (
//                             <GoogleMap
//                                 center={{ lat: location.latitude, lng: location.longitude }}
//                                 zoom={16}
//                                 mapContainerStyle={mapContainerStyle}
//                                 options={{
//                                     draggable: false,
//                                     zoomControl: false,
//                                     scrollwheel: false,
//                                     disableDoubleClickZoom: true,
//                                 }}
//                             >
//                                 <Marker
//                                     position={{ lat: location.latitude, lng: location.longitude }}
//                                     draggable={false}
//                                 />
//                             </GoogleMap>
//                         )}

//                         <p className="mt-3 text-sm text-gray-700">
//                             📍 <strong>Address:</strong> {address || "No location found"}
//                         </p>
//                     </div>
//                 )}

//                 {/* === IMAGE UPLOAD SECTION === */}
//                 <div className="bg-white p-6 rounded-lg shadow-md">
//                     <h2 className="text-lg font-semibold flex gap-2 items-center">
//                         <Camera className="w-5" /> Photos * (Max 3)
//                     </h2>

//                     {/* {image ? (
//                         <>
//                             <img src={image} className="w-full h-64 object-cover rounded-lg mt-4" />
//                             <button
//                                 onClick={() => { setImage(null); setImageFile(null); }}
//                                 className="w-full mt-3 px-4 py-2 bg-gray-300 rounded-lg"
//                             >
//                                 Remove Photo
//                             </button>
//                         </>
//                     ) : (
//                         <>
//                             <button
//                                 onClick={openCamera}
//                                 className="w-full mt-3 px-4 py-3 bg-blue-600 text-white rounded-lg flex justify-center gap-2"
//                             >
//                                 <Camera /> Open Camera
//                             </button>

//                             <button
//                                 onClick={() => fileInputRef.current.click()}
//                                 className="w-full mt-3 px-4 py-3 bg-gray-600 text-white rounded-lg flex justify-center gap-2"
//                             >
//                                 <Upload /> Upload From Device
//                             </button>

//                             <input
//                                 ref={fileInputRef}
//                                 type="file"
//                                 accept="image/*"
//                                 className="hidden"
//                                 onChange={handleFileSelect}
//                             />
//                         </>
//                     )} */}

//                     {images.length > 0 && (
//                         <div className="grid grid-cols-3 gap-3 mt-4">
//                             {images.map((img, idx) => (
//                                 <div key={idx} className="relative">
//                                     <img
//                                         src={img}
//                                         className="w-full h-32 object-cover rounded-lg"
//                                         alt={`Pothole ${idx + 1}`}
//                                     />
//                                     <button
//                                         onClick={() => removeImage(idx)}
//                                         className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs"
//                                     >
//                                         ✕
//                                     </button>
//                                 </div>
//                             ))}
//                         </div>
//                     )}

//                     {/* Show upload buttons only if less than 3 images */}
//                     {images.length < 3 && (
//                         <>
//                             <button
//                                 onClick={openCamera}
//                                 className="w-full mt-3 px-4 py-3 bg-blue-600 text-white rounded-lg flex justify-center gap-2"
//                             >
//                                 <Camera /> Open Camera
//                             </button>

//                             <button
//                                 onClick={() => fileInputRef.current.click()}
//                                 className="w-full mt-3 px-4 py-3 bg-gray-600 text-white rounded-lg flex justify-center gap-2"
//                             >
//                                 <Upload /> Upload From Device
//                             </button>

//                             <input
//                                 ref={fileInputRef}
//                                 type="file"
//                                 accept="image/*"
//                                 multiple
//                                 className="hidden"
//                                 onChange={handleFileSelect}
//                             />
//                         </>
//                     )}

//                     <p className="text-sm text-gray-500 mt-2">
//                         {images.length}/3 images uploaded
//                     </p>
//                 </div>

//                 {/* ADD: Camera modal (if not already present) */}
//                 {cameraOpen && (
//                     <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
//                         <div className="bg-white p-4 rounded-lg max-w-2xl w-full">
//                             <video ref={videoRef} autoPlay className="w-full rounded-lg mb-3" />
//                             <canvas ref={canvasRef} className="hidden" />
//                             <div className="flex gap-3">
//                                 <button
//                                     onClick={capturePhoto}
//                                     className="flex-1 py-2 bg-blue-600 text-white rounded-lg"
//                                 >
//                                     Capture
//                                 </button>
//                                 <button
//                                     onClick={closeCamera}
//                                     className="flex-1 py-2 bg-gray-600 text-white rounded-lg"
//                                 >
//                                     Cancel
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 {/* OTHER FORM FIELDS */}
//                 <div className="bg-white p-6 rounded-lg shadow-md">
//                     <h2 className="font-semibold mb-2">Severity *</h2>
//                     <select className="w-full p-3 border rounded-lg" value={severity} onChange={(e) => setSeverity(e.target.value)}>
//                         <option value="mild">Mild</option>
//                         <option value="severe">Severe</option>
//                         <option value="dangerous">Dangerous</option>
//                     </select>
//                 </div>

//                 <div className="bg-white p-6 rounded-lg shadow-md">
//                     <h2 className="font-semibold mb-2">Position *</h2>
//                     <select className="w-full p-3 border rounded-lg" value={position} onChange={(e) => setPosition(e.target.value)}>
//                         <option value="left">Left</option>
//                         <option value="middle">Middle</option>
//                         <option value="right">Right</option>
//                         <option value="full-width">Full width</option>
//                     </select>
//                 </div>

//                 <div className="bg-white p-6 rounded-lg shadow-md">
//                     <h2 className="font-semibold mb-2">Description *</h2>
//                     <textarea
//                         rows="3"
//                         className="w-full p-3 border rounded-lg"
//                         value={description}
//                         onChange={(e) => setDescription(e.target.value)}
//                         placeholder="Describe the pothole"
//                     />
//                 </div>

//                 <div className="bg-white p-6 rounded-lg shadow-md">
//                     <h2 className="font-semibold mb-2">Your Name (Optional)</h2>
//                     <input
//                         type="text"
//                         className="w-full p-3 border rounded-lg"
//                         value={reportedBy}
//                         onChange={(e) => setReportedBy(e.target.value)}
//                         placeholder="Enter name"
//                     />
//                 </div>

//                 <button
//                     onClick={submitReport}
//                     disabled={loading}
//                     className="w-full px-6 py-4 bg-red-600 text-white rounded-lg text-lg flex justify-center gap-2"
//                 >
//                     {loading ? <Loader className="animate-spin" /> : <Send />} Submit Report
//                 </button>
//             </div>
//         </div>

//     );
// }

// export default ReportPothole;


// import React, { useState, useEffect, useRef } from 'react';
// import { Camera, MapPin, Upload, Send, AlertCircle, CheckCircle, Loader } from 'lucide-react';
// import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
// import { useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import { base_url } from '../utils/base_url';
// import { getToken, checkIsAuthenticated } from '../utils/auth';
// import FloatingLocationAlert from '../components/FloatingLocationAlert';
// import UserProfile from '../components/UserProfile';

// const API_URL = `${base_url}/api`;
// const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

// const mapContainerStyle = {
//     width: "100%",
//     height: "350px",
//     borderRadius: "10px",
// };

// function ReportPothole() {
//     const navigate = useNavigate();

//     // Changed from single image to multiple images (max 3)
//     const [images, setImages] = useState([]);
//     const [imageFiles, setImageFiles] = useState([]);

//     const [location, setLocation] = useState(null);
//     const [address, setAddress] = useState("");

//     const [severity, setSeverity] = useState("mild");
//     const [position, setPosition] = useState("middle");
//     const [description, setDescription] = useState("");
//     const [reportedBy, setReportedBy] = useState("");

//     const [loading, setLoading] = useState(false);
//     const [uploadProgress, setUploadProgress] = useState(0);
//     const [success, setSuccess] = useState(false);
//     const [error, setError] = useState("");
//     const [locationLoading, setLocationLoading] = useState(false);

//     const fileInputRef = useRef(null);
//     const videoRef = useRef(null);
//     const canvasRef = useRef(null);

//     const [cameraOpen, setCameraOpen] = useState(false);
//     const [cameraStream, setCameraStream] = useState(null);

//     const { isLoaded } = useJsApiLoader({
//         googleMapsApiKey: MAPS_API_KEY,
//     });

//     // Restore form data from sessionStorage after login redirect
//     useEffect(() => {
//         const savedFormData = sessionStorage.getItem('potholeFormData');
//         if (savedFormData) {
//             const formData = JSON.parse(savedFormData);
//             setLocation(formData.location);
//             setAddress(formData.address);
//             setSeverity(formData.severity);
//             setPosition(formData.position);
//             setDescription(formData.description);
//             setReportedBy(formData.reportedBy);

//             // Restore images as base64 strings (preview only)
//             if (formData.images && formData.images.length > 0) {
//                 setImages(formData.images);
//             }

//             sessionStorage.removeItem('potholeFormData');
//             toast.success('Form data restored! Please re-upload images.');
//         }
//     }, []);

//     const getCurrentLocation = async () => {
//         if (!navigator.geolocation) {
//             toast.error("Geolocation not supported");
//             return;
//         }

//         setLocationLoading(true);

//         navigator.geolocation.getCurrentPosition(
//             async (pos) => {
//                 const coords = {
//                     latitude: pos.coords.latitude,
//                     longitude: pos.coords.longitude,
//                 };
//                 setLocation(coords);

//                 try {
//                     const res = await fetch(
//                         `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`
//                     );
//                     const data = await res.json();
//                     setAddress(data.display_name || "Unknown location");
//                 } catch {
//                     setAddress(`${coords.latitude}, ${coords.longitude}`);
//                 }

//                 setLocationLoading(false);
//             },
//             () => {
//                 toast.error("Failed to get location");
//                 setLocationLoading(false);
//             }
//         );
//     };

//     useEffect(() => {
//         getCurrentLocation();
//     }, []);

//     const handleFileSelect = (e) => {
//         const files = Array.from(e.target.files);

//         if (images.length + files.length > 3) {
//             return toast.error('Maximum 3 images allowed');
//         }

//         const validFiles = files.filter(f => f.type.startsWith('image/'));

//         if (validFiles.length !== files.length) {
//             toast.error('Only image files are allowed');
//         }

//         validFiles.forEach(file => {
//             const reader = new FileReader();
//             reader.onload = (e) => {
//                 setImages(prev => [...prev, e.target.result]);
//                 setImageFiles(prev => [...prev, file]);
//             };
//             reader.readAsDataURL(file);
//         });
//     };

//     const openCamera = async () => {
//         try {
//             const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//             videoRef.current.srcObject = stream;
//             setCameraStream(stream);
//             setCameraOpen(true);
//         } catch {
//             toast.error("Camera access denied");
//         }
//     };

//     const capturePhoto = () => {
//         if (images.length >= 3) {
//             closeCamera();
//             return toast.error('Maximum 3 images allowed');
//         }

//         const video = videoRef.current;
//         const canvas = canvasRef.current;
//         const ctx = canvas.getContext("2d");

//         canvas.width = video.videoWidth;
//         canvas.height = video.videoHeight;
//         ctx.drawImage(video, 0, 0);

//         canvas.toBlob((blob) => {
//             const dataUrl = canvas.toDataURL("image/jpeg");
//             setImageFiles(prev => [...prev, blob]);
//             setImages(prev => [...prev, dataUrl]);
//             closeCamera();
//             toast.success('Photo captured!');
//         }, "image/jpeg");
//     };

//     const closeCamera = () => {
//         if (cameraStream) cameraStream.getTracks().forEach((t) => t.stop());
//         setCameraOpen(false);
//     };

//     const removeImage = (index) => {
//         setImages(prev => prev.filter((_, i) => i !== index));
//         setImageFiles(prev => prev.filter((_, i) => i !== index));
//         toast.success('Image removed');
//     };

//     const submitReport = async () => {
//         // Validation
//         if (images.length === 0) return toast.error('At least one image is required');
//         if (!location) return toast.error('Location is required');
//         if (!description.trim()) return toast.error('Description is required');

//         // Check authentication before submission
//         if (!checkIsAuthenticated()) {
//             // Save form data to sessionStorage (excluding image files)
//             sessionStorage.setItem('potholeFormData', JSON.stringify({
//                 location,
//                 address,
//                 severity,
//                 position,
//                 description,
//                 reportedBy,
//                 images // Save preview URLs only
//             }));

//             toast.error('Please login to submit report');
//             navigate('/auth?redirect=/');
//             return;
//         }

//         setLoading(true);
//         setUploadProgress(0);

//         const form = new FormData();

//         // Append multiple images
//         imageFiles.forEach((file, index) => {
//             form.append('images', file, file.name || `report_${index}.jpg`);
//         });

//         form.append("latitude", location.latitude);
//         form.append("longitude", location.longitude);
//         form.append("address", address);
//         form.append("severity", severity);
//         form.append("position", position);
//         form.append("description", description);
//         form.append("reportedBy", reportedBy || "Anonymous");

//         try {
//             const xhr = new XMLHttpRequest();
//             xhr.open("POST", `${API_URL}/potholes`);

//             // IMPORTANT: Only set Authorization header, NOT Content-Type
//             // Browser will automatically set Content-Type to multipart/form-data with boundary
//             const token = getToken();
//             if (token) {
//                 xhr.setRequestHeader('Authorization', `Bearer ${token}`);
//             }

//             xhr.upload.onprogress = (e) => {
//                 if (e.lengthComputable)
//                     setUploadProgress(Math.round((e.loaded / e.total) * 100));
//             };

//             xhr.onload = () => {
//                 setLoading(false);
//                 if (xhr.status === 201) {
//                     setSuccess(true);
//                     toast.success('Report submitted successfully!');
//                     setTimeout(resetForm, 2000);
//                 } else if (xhr.status === 401) {
//                     toast.error('Session expired. Please login again');
//                     navigate('/auth?redirect=/');
//                 } else {
//                     const response = JSON.parse(xhr.responseText);
//                     toast.error(response.message || 'Submission failed');
//                 }
//             };

//             xhr.onerror = () => {
//                 toast.error('Network error occurred');
//                 setLoading(false);
//             };

//             xhr.send(form);
//         } catch (error) {
//             toast.error('Failed to submit report');
//             setLoading(false);
//         }
//     };

//     const resetForm = () => {
//         setImages([]);
//         setImageFiles([]);
//         setLocation(null);
//         setAddress("");
//         setSeverity("mild");
//         setPosition("middle");
//         setDescription("");
//         setReportedBy("");
//         setSuccess(false);
//         setError("");
//         getCurrentLocation();
//     };

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//             {/* HEADER */}
//             <header className="bg-white shadow-md p-6 text-center flex justify-between">
//                 <div>
//                     <h1 className="text-3xl font-bold">Pothole Reporter</h1>
//                     <p className="text-gray-600">Help us improve road conditions</p>
//                 </div>
//                 <UserProfile />
//             </header>

//             <div className="max-w-7xl mx-auto p-6 space-y-6">

//                 {/* ========= GOOGLE MAP SECTION ========= */}
//                 {isLoaded && (
//                     <div className="bg-white p-6 shadow-md rounded-lg">
//                         <h2 className="text-lg font-semibold mb-3 flex gap-2 items-center">
//                             <MapPin className="w-5 h-5" /> Your Location *
//                         </h2>

//                         {/* MAP (User cannot move or change anything) */}
//                         {location && (
//                             <GoogleMap
//                                 center={{ lat: location.latitude, lng: location.longitude }}
//                                 zoom={16}
//                                 mapContainerStyle={mapContainerStyle}
//                                 options={{
//                                     draggable: false,
//                                     zoomControl: false,
//                                     scrollwheel: false,
//                                     disableDoubleClickZoom: true,
//                                 }}
//                             >
//                                 <Marker
//                                     position={{ lat: location.latitude, lng: location.longitude }}
//                                     draggable={false}
//                                 />
//                             </GoogleMap>
//                         )}

//                         <p className="mt-3 text-sm text-gray-700">
//                             📍 <strong>Address:</strong> {address || "No location found"}
//                         </p>
//                     </div>
//                 )}

//                 {/* === IMAGE UPLOAD SECTION === */}
//                 <div className="bg-white p-6 rounded-lg shadow-md">
//                     <h2 className="text-lg font-semibold flex gap-2 items-center mb-3">
//                         <Camera className="w-5" /> Photos * (Max 3)
//                     </h2>

//                     {/* Display uploaded images in grid */}
//                     {images.length > 0 && (
//                         <div className="grid grid-cols-3 gap-3 mb-4">
//                             {images.map((img, idx) => (
//                                 <div key={idx} className="relative">
//                                     <img
//                                         src={img}
//                                         className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
//                                         alt={`Pothole ${idx + 1}`}
//                                     />
//                                     <button
//                                         onClick={() => removeImage(idx)}
//                                         className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-700"
//                                     >
//                                         ✕
//                                     </button>
//                                 </div>
//                             ))}
//                         </div>
//                     )}

//                     {/* Show upload buttons only if less than 3 images */}
//                     {images.length < 3 ? (
//                         <>
//                             <button
//                                 onClick={openCamera}
//                                 className="w-full mt-3 px-4 py-3 bg-blue-600 text-white rounded-lg flex justify-center gap-2 hover:bg-blue-700"
//                             >
//                                 <Camera /> Open Camera
//                             </button>

//                             <button
//                                 onClick={() => fileInputRef.current.click()}
//                                 className="w-full mt-3 px-4 py-3 bg-gray-600 text-white rounded-lg flex justify-center gap-2 hover:bg-gray-700"
//                             >
//                                 <Upload /> Upload From Device
//                             </button>

//                             <input
//                                 ref={fileInputRef}
//                                 type="file"
//                                 accept="image/*"
//                                 multiple
//                                 className="hidden"
//                                 onChange={handleFileSelect}
//                             />
//                         </>
//                     ) : (
//                         <p className="text-center text-gray-600 py-2">Maximum images reached (3/3)</p>
//                     )}

//                     <p className="text-sm text-gray-500 mt-2 text-center">
//                         {images.length}/3 images uploaded
//                     </p>
//                 </div>

//                 {/* OTHER FORM FIELDS */}
//                 <div className="bg-white p-6 rounded-lg shadow-md">
//                     <h2 className="font-semibold mb-2">Severity *</h2>
//                     <select className="w-full p-3 border rounded-lg" value={severity} onChange={(e) => setSeverity(e.target.value)}>
//                         <option value="mild">Mild</option>
//                         <option value="severe">Severe</option>
//                         <option value="dangerous">Dangerous</option>
//                     </select>
//                 </div>

//                 <div className="bg-white p-6 rounded-lg shadow-md">
//                     <h2 className="font-semibold mb-2">Position *</h2>
//                     <select className="w-full p-3 border rounded-lg" value={position} onChange={(e) => setPosition(e.target.value)}>
//                         <option value="left">Left</option>
//                         <option value="middle">Middle</option>
//                         <option value="right">Right</option>
//                         <option value="full-width">Full width</option>
//                     </select>
//                 </div>

//                 <div className="bg-white p-6 rounded-lg shadow-md">
//                     <h2 className="font-semibold mb-2">Description *</h2>
//                     <textarea
//                         rows="3"
//                         className="w-full p-3 border rounded-lg"
//                         value={description}
//                         onChange={(e) => setDescription(e.target.value)}
//                         placeholder="Describe the pothole"
//                     />
//                 </div>

//                 <div className="bg-white p-6 rounded-lg shadow-md">
//                     <h2 className="font-semibold mb-2">Your Name (Optional)</h2>
//                     <input
//                         type="text"
//                         className="w-full p-3 border rounded-lg"
//                         value={reportedBy}
//                         onChange={(e) => setReportedBy(e.target.value)}
//                         placeholder="Enter name"
//                     />
//                 </div>

//                 {/* Upload Progress Bar */}
//                 {loading && uploadProgress > 0 && (
//                     <div className="bg-white p-4 rounded-lg shadow-md">
//                         <div className="flex justify-between mb-2">
//                             <span className="text-sm font-medium">Uploading...</span>
//                             <span className="text-sm font-medium">{uploadProgress}%</span>
//                         </div>
//                         <div className="w-full bg-gray-200 rounded-full h-2.5">
//                             <div
//                                 className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
//                                 style={{ width: `${uploadProgress}%` }}
//                             ></div>
//                         </div>
//                     </div>
//                 )}

//                 <button
//                     onClick={submitReport}
//                     disabled={loading}
//                     className="w-full px-6 py-4 bg-red-600 text-white rounded-lg text-lg flex justify-center gap-2 hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed"
//                 >
//                     {loading ? <Loader className="animate-spin" /> : <Send />}
//                     {loading ? 'Submitting...' : 'Submit Report'}
//                 </button>
//             </div>

//             {/* Camera Modal */}
//             {cameraOpen && (
//                 <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
//                     <div className="bg-white p-4 rounded-lg max-w-2xl w-full">
//                         <video ref={videoRef} autoPlay className="w-full rounded-lg mb-3" />
//                         <canvas ref={canvasRef} className="hidden" />
//                         <div className="flex gap-3">
//                             <button
//                                 onClick={capturePhoto}
//                                 className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
//                             >
//                                 📸 Capture Photo
//                             </button>
//                             <button
//                                 onClick={closeCamera}
//                                 className="flex-1 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-semibold"
//                             >
//                                 Cancel
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default ReportPothole;


// import React, { useState, useEffect, useRef } from 'react';
// import { Camera, MapPin, Upload, Send, Loader } from 'lucide-react';
// import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
// import { useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import { base_url } from '../utils/base_url';
// import { getToken, checkIsAuthenticated } from '../utils/auth';
// import FloatingLocationAlert from '../components/FloatingLocationAlert';
// import UserProfile from '../components/UserProfile';

// // Redux
// import { useDispatch, useSelector } from "react-redux";
// import { setField, addImage, removeImage, resetForm } from "../redux/potholeFormSlice";

// const API_URL = `${base_url}/api`;
// const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

// const mapContainerStyle = {
//     width: "100%",
//     height: "350px",
//     borderRadius: "10px",
// };

// function ReportPothole() {
//     const navigate = useNavigate();
//     const dispatch = useDispatch();

//     // Redux selectors
//     const {
//         images,
//         imageFiles,
//         location,
//         address,
//         severity,
//         position,
//         description,
//         reportedBy
//     } = useSelector((state) => state.potholeForm);

//     const [loading, setLoading] = useState(false);
//     const [uploadProgress, setUploadProgress] = useState(0);
//     const [locationLoading, setLocationLoading] = useState(false);

//     const fileInputRef = useRef(null);
//     const videoRef = useRef(null);
//     const canvasRef = useRef(null);

//     const [cameraOpen, setCameraOpen] = useState(false);
//     const [cameraStream, setCameraStream] = useState(null);

//     const { isLoaded } = useJsApiLoader({
//         googleMapsApiKey: MAPS_API_KEY,
//     });

//     // Fetch current location
//     const getCurrentLocation = async () => {
//         if (!navigator.geolocation) {
//             toast.error("Geolocation not supported");
//             return;
//         }

//         setLocationLoading(true);

//         navigator.geolocation.getCurrentPosition(
//             async (pos) => {
//                 const coords = {
//                     latitude: pos.coords.latitude,
//                     longitude: pos.coords.longitude,
//                 };

//                 dispatch(setField({ field: "location", value: coords }));

//                 try {
//                     const res = await fetch(
//                         `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`
//                     );
//                     const data = await res.json();

//                     dispatch(setField({
//                         field: "address",
//                         value: data.display_name || "Unknown location"
//                     }));
//                 } catch {
//                     dispatch(setField({
//                         field: "address",
//                         value: `${coords.latitude}, ${coords.longitude}`
//                     }));
//                 }

//                 setLocationLoading(false);
//             },
//             () => {
//                 toast.error("Failed to get location");
//                 setLocationLoading(false);
//             }
//         );
//     };

//     useEffect(() => {
//         if (!location) getCurrentLocation();
//     }, []);

//     // File Upload (from device)
//     const handleFileSelect = (e) => {
//         const files = Array.from(e.target.files);

//         if (images.length + files.length > 3)
//             return toast.error("Maximum 3 images allowed");

//         files.forEach((file) => {
//             if (!file.type.startsWith("image/"))
//                 return toast.error("Only images allowed");

//             const reader = new FileReader();
//             reader.onload = (ev) => {
//                 dispatch(addImage({ preview: ev.target.result, file }));
//             };
//             reader.readAsDataURL(file);
//         });
//     };

//     // Open camera
//     const openCamera = async () => {
//         try {
//             const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//             videoRef.current.srcObject = stream;
//             setCameraStream(stream);
//             setCameraOpen(true);
//         } catch {
//             toast.error("Camera access denied");
//         }
//     };

//     // Capture photo
//     const capturePhoto = () => {
//         if (images.length >= 3) {
//             closeCamera();
//             return toast.error("Maximum 3 images");
//         }

//         const video = videoRef.current;
//         const canvas = canvasRef.current;
//         const ctx = canvas.getContext("2d");

//         canvas.width = video.videoWidth;
//         canvas.height = video.videoHeight;
//         ctx.drawImage(video, 0, 0);

//         canvas.toBlob((blob) => {
//             const dataUrl = canvas.toDataURL("image/jpeg");
//             dispatch(addImage({ preview: dataUrl, file: blob }));
//             closeCamera();
//             toast.success("Photo captured!");
//         }, "image/jpeg");
//     };

//     const closeCamera = () => {
//         if (cameraStream) cameraStream.getTracks().forEach((t) => t.stop());
//         setCameraOpen(false);
//     };

//     // Submit
//     const submitReport = async () => {
//         if (!images.length) return toast.error("At least one image required");
//         if (!location) return toast.error("Location required");
//         if (!description.trim()) return toast.error("Description required");

//         if (!checkIsAuthenticated()) {
//             toast.error("Please login to submit");
//             navigate("/auth?redirect=/report");
//             return;
//         }

//         setLoading(true);
//         setUploadProgress(0);

//         const form = new FormData();

//         imageFiles.forEach((file, index) => {
//             form.append("images", file, `pothole_${index}.jpg`);
//         });

//         form.append("latitude", location.latitude);
//         form.append("longitude", location.longitude);
//         form.append("address", address);
//         form.append("severity", severity);
//         form.append("position", position);
//         form.append("description", description);
//         form.append("reportedBy", reportedBy || "Anonymous");

//         try {
//             const xhr = new XMLHttpRequest();
//             xhr.open("POST", `${API_URL}/potholes`);

//             const token = getToken();
//             if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);

//             xhr.upload.onprogress = (e) => {
//                 if (e.lengthComputable)
//                     setUploadProgress(Math.round((e.loaded / e.total) * 100));
//             };

//             xhr.onload = () => {
//                 setLoading(false);

//                 if (xhr.status === 201) {
//                     toast.success("Report submitted successfully!");
//                     dispatch(resetForm());
//                     getCurrentLocation();
//                 } else {
//                     const res = JSON.parse(xhr.responseText || "{}");
//                     toast.error(res.message || "Submission failed");
//                 }
//             };

//             xhr.onerror = () => {
//                 toast.error("Network error");
//                 setLoading(false);
//             };

//             xhr.send(form);
//         } catch (error) {
//             toast.error("Failed to submit");
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//             {/* HEADER */}
//             <header className="bg-white shadow-md p-6 text-center flex justify-between">
//                 <div>
//                     <h1 className="text-3xl font-bold">Pothole Reporter</h1>
//                     <p className="text-gray-600">Help us improve road conditions</p>
//                 </div>
//                 <UserProfile />
//             </header>

//             <div className="max-w-7xl mx-auto p-6 space-y-6">

//                 {/* ===== GOOGLE MAP ===== */}
//                 {isLoaded && location && (
//                     <div className="bg-white p-6 shadow-md rounded-lg">
//                         <h2 className="text-lg font-semibold mb-3 flex gap-2 items-center">
//                             <MapPin className="w-5 h-5" /> Your Location *
//                         </h2>

//                         <GoogleMap
//                             center={{
//                                 lat: location.latitude,
//                                 lng: location.longitude
//                             }}
//                             zoom={16}
//                             mapContainerStyle={mapContainerStyle}
//                             options={{
//                                 draggable: false,
//                                 zoomControl: false,
//                                 scrollwheel: false,
//                                 disableDoubleClickZoom: true,
//                             }}
//                         >
//                             <Marker
//                                 position={{
//                                     lat: location.latitude,
//                                     lng: location.longitude
//                                 }}
//                             />
//                         </GoogleMap>

//                         <p className="mt-3 text-sm text-gray-700">
//                             📍 <strong>Address:</strong> {address}
//                         </p>
//                     </div>
//                 )}

//                 {/* ===== IMAGE UPLOAD ===== */}
//                 <div className="bg-white p-6 rounded-lg shadow-md">
//                     <h2 className="text-lg font-semibold flex gap-2 items-center mb-3">
//                         <Camera className="w-5" /> Photos * (Max 3)
//                     </h2>

//                     {images.length > 0 && (
//                         <div className="grid grid-cols-3 gap-3 mb-4">
//                             {images.map((img, idx) => (
//                                 <div key={idx} className="relative">
//                                     <img
//                                         src={img}
//                                         className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
//                                         alt={`Pothole ${idx + 1}`}
//                                     />
//                                     <button
//                                         onClick={() => dispatch(removeImage(idx))}
//                                         className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-700"
//                                     >
//                                         ✕
//                                     </button>
//                                 </div>
//                             ))}
//                         </div>
//                     )}

//                     {images.length < 3 ? (
//                         <>
//                             <button
//                                 onClick={openCamera}
//                                 className="w-full mt-3 px-4 py-3 bg-blue-600 text-white rounded-lg flex justify-center gap-2 hover:bg-blue-700"
//                             >
//                                 <Camera /> Open Camera
//                             </button>

//                             <button
//                                 onClick={() => fileInputRef.current.click()}
//                                 className="w-full mt-3 px-4 py-3 bg-gray-600 text-white rounded-lg flex justify-center gap-2 hover:bg-gray-700"
//                             >
//                                 <Upload /> Upload From Device
//                             </button>

//                             <input
//                                 ref={fileInputRef}
//                                 type="file"
//                                 accept="image/*"
//                                 multiple
//                                 className="hidden"
//                                 onChange={handleFileSelect}
//                             />
//                         </>
//                     ) : (
//                         <p className="text-center text-gray-600 py-2">Maximum images reached (3/3)</p>
//                     )}

//                     <p className="text-sm text-gray-500 mt-2 text-center">
//                         {images.length}/3 images uploaded
//                     </p>
//                 </div>

//                 {/* ===== OTHER FIELDS ===== */}
//                 <div className="bg-white p-6 rounded-lg shadow-md">
//                     <h2 className="font-semibold mb-2">Severity *</h2>
//                     <select
//                         className="w-full p-3 border rounded-lg"
//                         value={severity}
//                         onChange={(e) =>
//                             dispatch(setField({ field: "severity", value: e.target.value }))
//                         }
//                     >
//                         <option value="mild">Mild</option>
//                         <option value="severe">Severe</option>
//                         <option value="dangerous">Dangerous</option>
//                     </select>
//                 </div>

//                 <div className="bg-white p-6 rounded-lg shadow-md">
//                     <h2 className="font-semibold mb-2">Position *</h2>
//                     <select
//                         className="w-full p-3 border rounded-lg"
//                         value={position}
//                         onChange={(e) =>
//                             dispatch(setField({ field: "position", value: e.target.value }))
//                         }
//                     >
//                         <option value="left">Left</option>
//                         <option value="middle">Middle</option>
//                         <option value="right">Right</option>
//                         <option value="full-width">Full width</option>
//                     </select>
//                 </div>

//                 <div className="bg-white p-6 rounded-lg shadow-md">
//                     <h2 className="font-semibold mb-2">Description *</h2>
//                     <textarea
//                         rows="3"
//                         className="w-full p-3 border rounded-lg"
//                         value={description}
//                         onChange={(e) =>
//                             dispatch(setField({ field: "description", value: e.target.value }))
//                         }
//                         placeholder="Describe the pothole"
//                     />
//                 </div>

//                 <div className="bg-white p-6 rounded-lg shadow-md">
//                     <h2 className="font-semibold mb-2">Your Name (Optional)</h2>
//                     <input
//                         type="text"
//                         className="w-full p-3 border rounded-lg"
//                         value={reportedBy}
//                         onChange={(e) =>
//                             dispatch(setField({ field: "reportedBy", value: e.target.value }))
//                         }
//                         placeholder="Enter name"
//                     />
//                 </div>

//                 {/* UPLOAD PROGRESS */}
//                 {loading && uploadProgress > 0 && (
//                     <div className="bg-white p-4 rounded-lg shadow-md">
//                         <div className="flex justify-between mb-2">
//                             <span className="text-sm font-medium">Uploading...</span>
//                             <span className="text-sm font-medium">{uploadProgress}%</span>
//                         </div>
//                         <div className="w-full bg-gray-200 rounded-full h-2.5">
//                             <div
//                                 className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
//                                 style={{ width: `${uploadProgress}%` }}
//                             ></div>
//                         </div>
//                     </div>
//                 )}

//                 {/* SUBMIT BUTTON */}
//                 <button
//                     onClick={submitReport}
//                     disabled={loading}
//                     className="w-full px-6 py-4 bg-red-600 text-white rounded-lg text-lg flex justify-center gap-2 hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed"
//                 >
//                     {loading ? <Loader className="animate-spin" /> : <Send />}
//                     {loading ? 'Submitting...' : 'Submit Report'}
//                 </button>
//             </div>

//             {/* Camera Modal */}
//             {cameraOpen && (
//                 <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
//                     <div className="bg-white p-4 rounded-lg max-w-2xl w-full">
//                         <video ref={videoRef} autoPlay className="w-full rounded-lg mb-3" />
//                         <canvas ref={canvasRef} className="hidden" />
//                         <div className="flex gap-3">
//                             <button
//                                 onClick={capturePhoto}
//                                 className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
//                             >
//                                 📸 Capture Photo
//                             </button>
//                             <button
//                                 onClick={closeCamera}
//                                 className="flex-1 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-semibold"
//                             >
//                                 Cancel
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default ReportPothole;


// ReportPothole.jsx
// Complete updated file: uses Redux for text fields, IndexedDB (Dexie) for storing real image Blobs
// - Images are persisted to IndexedDB (so they survive reloads and are real Blob/File objects).
// - Text fields remain in Redux (and can be persisted via redux-persist).
// - Component keeps local state for image previews & DB ids to avoid storing non-serializable Blobs in Redux.
//
// Make sure you have created `src/db/imageDB.js` with Dexie utilities:
//   export const saveImage(key, file) -> returns id
//   export const getImages(key) -> returns [{id, key, file}, ...]
//   export const deleteImage(id) -> deletes single id
//   export const deleteImages(key) -> deletes all records for key
//
// If you want, I can also paste imageDB.js. (But you mentioned you have Dexie installed already.)

import React, { useState, useEffect, useRef } from 'react';
import { Camera, MapPin, Upload, Send, Loader } from 'lucide-react';
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { base_url } from '../utils/base_url';
import { getToken, checkIsAuthenticated } from '../utils/auth';
import FloatingLocationAlert from '../components/FloatingLocationAlert';
import UserProfile from '../components/UserProfile';

// Redux (only for text fields)
import { useDispatch, useSelector } from "react-redux";
import { setField, resetForm } from "../redux/potholeFormSlice";

// IndexedDB utilities (Dexie)
import { saveImage, getImages, deleteImage, deleteImages } from "../db/imageDB";

const API_URL = `${base_url}/api`;
const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const FORM_KEY = "potholeForm"; // key used in IndexedDB to group images for this draft

const mapContainerStyle = {
    width: "100%",
    height: "350px",
    borderRadius: "10px",
};

function ReportPothole() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Redux selectors - only text fields / small data
    const {
        location,
        address,
        severity,
        position,
        description,
        reportedBy
    } = useSelector((state) => state.potholeForm);

    // Local state for images (previews) and their DB ids (so we don't persist Blobs in Redux)
    const [images, setImages] = useState([]);         // array of base64 previews (strings)
    const [imageMeta, setImageMeta] = useState([]);   // array of { id, name }

    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [locationLoading, setLocationLoading] = useState(false);

    const fileInputRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const [cameraOpen, setCameraOpen] = useState(false);
    const [cameraStream, setCameraStream] = useState(null);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: MAPS_API_KEY,
    });

    // Helper: convert Blob/File to base64 preview
    const blobToBase64 = (blob) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });

    // Restore images from IndexedDB on mount
    useEffect(() => {
        (async () => {
            try {
                const dbImages = await getImages(FORM_KEY); // returns array of { id, key, file }
                if (!dbImages || dbImages.length === 0) return;

                const previews = [];
                const meta = [];

                for (const item of dbImages) {
                    const file = item.file;
                    const preview = await blobToBase64(file);
                    previews.push(preview);
                    meta.push({ id: item.id, name: file.name || `image_${item.id}` });
                }

                setImages(previews);
                setImageMeta(meta);
                toast.success("Draft images restored");
            } catch (err) {
                console.warn("Failed to restore images from IndexedDB", err);
            }
        })();
    }, []);

    // Fetch current location (sets in Redux)
    const getCurrentLocation = async () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation not supported");
            return;
        }

        setLocationLoading(true);

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const coords = {
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                };

                dispatch(setField({ field: "location", value: coords }));

                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`
                    );
                    const data = await res.json();

                    dispatch(setField({
                        field: "address",
                        value: data.display_name || "Unknown location"
                    }));
                } catch {
                    dispatch(setField({
                        field: "address",
                        value: `${coords.latitude}, ${coords.longitude}`
                    }));
                }

                setLocationLoading(false);
            },
            () => {
                toast.error("Failed to get location");
                setLocationLoading(false);
            }
        );
    };

    useEffect(() => {
        if (!location) getCurrentLocation();
    }, []);

    // Save a selected file to IndexedDB and update local state
    const storeFileAndPreview = async (file) => {
        try {
            // Save file blob to IndexedDB under FORM_KEY, returns numeric id
            const dbId = await saveImage(FORM_KEY, file);
            const preview = await blobToBase64(file);

            setImages(prev => [...prev, preview]);
            setImageMeta(prev => [...prev, { id: dbId, name: file.name }]);
        } catch (err) {
            console.error("Failed to save image to DB", err);
            toast.error("Failed to save image locally");
        }
    };

    // File upload from device
    const handleFileSelect = async (e) => {
        const files = Array.from(e.target.files || []);
        if (images.length + files.length > 3) {
            toast.error("Maximum 3 images allowed");
            return;
        }

        for (const file of files) {
            if (!file.type.startsWith("image/")) {
                toast.error("Only image files are allowed");
                continue;
            }
            await storeFileAndPreview(file);
        }

        // reset input so same file can be re-selected if needed
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // Open camera
    const openCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) videoRef.current.srcObject = stream;
            setCameraStream(stream);
            setCameraOpen(true);
        } catch (err) {
            console.error(err);
            toast.error("Camera access denied");
        }
    };

    // Capture photo from camera, save to DB & preview
    const capturePhoto = async () => {
        if (images.length >= 3) {
            closeCamera();
            return toast.error("Maximum 3 images");
        }

        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        const ctx = canvas.getContext("2d");
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        ctx.drawImage(video, 0, 0);

        canvas.toBlob(async (blob) => {
            if (!blob) {
                toast.error("Failed to capture photo");
                return;
            }

            // give the blob a name and type so backend receives sensible filename
            const fileLike = new File([blob], `camera_${Date.now()}.jpg`, { type: "image/jpeg" });

            await storeFileAndPreview(fileLike);
            closeCamera();
            toast.success("Photo captured!");
        }, "image/jpeg");
    };

    const closeCamera = () => {
        if (cameraStream) cameraStream.getTracks().forEach((t) => t.stop());
        setCameraOpen(false);
    };

    // Remove single image (delete from IndexedDB and local state)
    const removeImageAt = async (index) => {
        try {
            const meta = imageMeta[index];
            if (meta && meta.id) {
                await deleteImage(meta.id);
            }
            setImages(prev => prev.filter((_, i) => i !== index));
            setImageMeta(prev => prev.filter((_, i) => i !== index));
            toast.success("Image removed");
        } catch (err) {
            console.error("Failed to remove image", err);
            toast.error("Failed to remove image");
        }
    };

    // Submit: load real blobs from IndexedDB and append to FormData
    const submitReport = async () => {
        if (images.length === 0) return toast.error("At least one image required");
        if (!location) return toast.error("Location required");
        if (!description || !description.trim()) return toast.error("Description required");

        if (!checkIsAuthenticated()) {
            toast.error("Please login to submit");
            navigate("/auth?redirect=/report");
            return;
        }

        setLoading(true);
        setUploadProgress(0);

        try {
            // Get image records from DB
            const dbImages = await getImages(FORM_KEY); // [{id, key, file}]
            if (!dbImages || dbImages.length === 0) {
                toast.error("No images found to upload");
                setLoading(false);
                return;
            }

            const form = new FormData();

            // Append real File/Blob objects
            dbImages.forEach((item, idx) => {
                // item.file should be a File/Blob saved in DB
                // Provide filename fallback if missing
                const blob = item.file;
                const filename = (blob && blob.name) || `pothole_${idx}.jpg`;
                form.append("images", blob, filename);
            });

            form.append("latitude", location.latitude);
            form.append("longitude", location.longitude);
            form.append("address", address);
            form.append("severity", severity);
            form.append("position", position);
            form.append("description", description);
            form.append("reportedBy", reportedBy || "Anonymous");

            const xhr = new XMLHttpRequest();
            xhr.open("POST", `${API_URL}/potholes`);

            const token = getToken();
            if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);

            xhr.upload.onprogress = (e) => {
                if (e.lengthComputable)
                    setUploadProgress(Math.round((e.loaded / e.total) * 100));
            };

            xhr.onload = async () => {
                setLoading(false);
                if (xhr.status === 201 || xhr.status === 200) {
                    toast.success("Report submitted successfully!");
                    // Clear DB images for this form and local state
                    try {
                        await deleteImages(FORM_KEY);
                    } catch (err) {
                        console.warn("Failed to clear images from DB", err);
                    }
                    setImages([]);
                    setImageMeta([]);
                    dispatch(resetForm());
                    getCurrentLocation();
                } else if (xhr.status === 401) {
                    toast.error("Session expired. Please login again");
                    navigate('/auth?redirect=/report');
                } else {
                    let response;
                    try {
                        response = JSON.parse(xhr.responseText || "{}");
                    } catch { response = {}; }
                    toast.error(response.message || "Submission failed");
                }
            };

            xhr.onerror = () => {
                toast.error("Network error occurred");
                setLoading(false);
            };

            xhr.send(form);
        } catch (err) {
            console.error("submitReport error", err);
            toast.error("Failed to submit report");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* HEADER */}
            <header className="bg-white shadow-md p-6 text-center flex justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Pothole Reporter</h1>
                    <p className="text-gray-600">Help us improve road conditions</p>
                </div>
                <UserProfile />
            </header>

            <div className="max-w-7xl mx-auto p-6 space-y-6">

                {/* GOOGLE MAP */}
                {isLoaded && location && (
                    <div className="bg-white p-6 shadow-md rounded-lg">
                        <h2 className="text-lg font-semibold mb-3 flex gap-2 items-center">
                            <MapPin className="w-5 h-5" /> Your Location *
                        </h2>

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
                            <Marker position={{ lat: location.latitude, lng: location.longitude }} />
                        </GoogleMap>

                        <p className="mt-3 text-sm text-gray-700">
                            📍 <strong>Address:</strong> {address || "No location found"}
                        </p>
                    </div>
                )}

                {/* IMAGE UPLOAD */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold flex gap-2 items-center mb-3">
                        <Camera className="w-5" /> Photos * (Max 3)
                    </h2>

                    {images.length > 0 && (
                        <div className="grid grid-cols-3 gap-3 mb-4">
                            {images.map((img, idx) => (
                                <div key={idx} className="relative">
                                    <img
                                        src={img}
                                        className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                                        alt={`Pothole ${idx + 1}`}
                                    />
                                    <button
                                        onClick={() => removeImageAt(idx)}
                                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-700"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {images.length < 3 ? (
                        <>
                            <button
                                onClick={openCamera}
                                className="w-full mt-3 px-4 py-3 bg-blue-600 text-white rounded-lg flex justify-center gap-2 hover:bg-blue-700"
                            >
                                <Camera /> Open Camera
                            </button>

                            <button
                                onClick={() => fileInputRef.current.click()}
                                className="w-full mt-3 px-4 py-3 bg-gray-600 text-white rounded-lg flex justify-center gap-2 hover:bg-gray-700"
                            >
                                <Upload /> Upload From Device
                            </button>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={handleFileSelect}
                            />
                        </>
                    ) : (
                        <p className="text-center text-gray-600 py-2">Maximum images reached (3/3)</p>
                    )}

                    <p className="text-sm text-gray-500 mt-2 text-center">
                        {images.length}/3 images uploaded
                    </p>
                </div>

                {/* OTHER FIELDS */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="font-semibold mb-2">Severity *</h2>
                    <select
                        className="w-full p-3 border rounded-lg"
                        value={severity}
                        onChange={(e) => dispatch(setField({ field: "severity", value: e.target.value }))}
                    >
                        <option value="mild">Mild</option>
                        <option value="severe">Severe</option>
                        <option value="dangerous">Dangerous</option>
                    </select>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="font-semibold mb-2">Position *</h2>
                    <select
                        className="w-full p-3 border rounded-lg"
                        value={position}
                        onChange={(e) => dispatch(setField({ field: "position", value: e.target.value }))}
                    >
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
                        onChange={(e) => dispatch(setField({ field: "description", value: e.target.value }))}
                        placeholder="Describe the pothole"
                    />
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="font-semibold mb-2">Your Name (Optional)</h2>
                    <input
                        type="text"
                        className="w-full p-3 border rounded-lg"
                        value={reportedBy}
                        onChange={(e) => dispatch(setField({ field: "reportedBy", value: e.target.value }))}
                        placeholder="Enter name"
                    />
                </div>

                {/* UPLOAD PROGRESS */}
                {loading && uploadProgress > 0 && (
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium">Uploading...</span>
                            <span className="text-sm font-medium">{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                {/* SUBMIT BUTTON */}
                <button
                    onClick={submitReport}
                    disabled={loading}
                    className="w-full px-6 py-4 bg-red-600 text-white rounded-lg text-lg flex justify-center gap-2 hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed"
                >
                    {loading ? <Loader className="animate-spin" /> : <Send />}
                    {loading ? 'Submitting...' : 'Submit Report'}
                </button>
            </div>

            {/* Camera Modal */}
            {cameraOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-4 rounded-lg max-w-2xl w-full">
                        <video ref={videoRef} autoPlay className="w-full rounded-lg mb-3" />
                        <canvas ref={canvasRef} className="hidden" />
                        <div className="flex gap-3">
                            <button
                                onClick={capturePhoto}
                                className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                            >
                                📸 Capture Photo
                            </button>
                            <button
                                onClick={closeCamera}
                                className="flex-1 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-semibold"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            
        </div>
    );
}

export default ReportPothole;
