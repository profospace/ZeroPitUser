

//  import React, { useState, useEffect, useRef } from 'react';
//  import { Camera, MapPin, Upload, Send, AlertCircle, CheckCircle, Loader } from 'lucide-react';
//  import { base_url } from './utils/base_url';

// const API_URL = `${base_url}/api`;

// function App() {
//   const [image, setImage] = useState(null);
//   const [imageFile, setImageFile] = useState(null);
//   const [location, setLocation] = useState(null);
//   const [address, setAddress] = useState('');
//   const [severity, setSeverity] = useState('mild');
//   const [position, setPosition] = useState('middle');
//   const [description, setDescription] = useState('');
//   const [reportedBy, setReportedBy] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState('');
//   const [locationLoading, setLocationLoading] = useState(false);

//   const fileInputRef = useRef(null);
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [cameraOpen, setCameraOpen] = useState(false);
//   const [cameraStream, setCameraStream] = useState(null);

//   // Get current location
//   const getCurrentLocation = async () => {
//     if (!navigator.geolocation) {
//       setError('Geolocation is not supported by your browser');
//       return;
//     }

//     setLocationLoading(true);
//     setError('');

//     navigator.geolocation.getCurrentPosition(
//       async (position) => {
//         const coords = {
//           latitude: position.coords.latitude,
//           longitude: position.coords.longitude,
//         };
//         setLocation(coords);

//         // Reverse geocode to get address
//         try {
//           const response = await fetch(
//             `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`
//           );
//           const data = await response.json();
//           setAddress(data.display_name || 'Unknown location');
//         } catch (err) {
//           setAddress(`${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`);
//         }

//         setLocationLoading(false);
//       },
//       (err) => {
//         setError('Unable to retrieve location: ' + err.message);
//         setLocationLoading(false);
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 10000,
//         maximumAge: 0
//       }
//     );
//   };

//   // Handle file input
//   const handleFileSelect = (e) => {
//     const file = e.target.files[0];
//     if (file && file.type.startsWith('image/')) {
//       setImageFile(file);
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setImage(e.target.result);
//       };
//       reader.readAsDataURL(file);
//     } else {
//       setError('Please select a valid image file');
//     }
//   };

//   // Open camera
//   const openCamera = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: { facingMode: 'environment' },
//         audio: false
//       });

//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//         setCameraStream(stream);
//         setCameraOpen(true);
//       }
//     } catch (err) {
//       setError('Unable to access camera: ' + err.message);
//     }
//   };

//   // Capture photo from camera
//   const capturePhoto = () => {
//     if (videoRef.current && canvasRef.current) {
//       const video = videoRef.current;
//       const canvas = canvasRef.current;
//       const context = canvas.getContext('2d');

//       canvas.width = video.videoWidth;
//       canvas.height = video.videoHeight;
//       context.drawImage(video, 0, 0, canvas.width, canvas.height);

//       canvas.toBlob((blob) => {
//         setImageFile(blob);
//         setImage(canvas.toDataURL('image/jpeg'));
//         closeCamera();
//       }, 'image/jpeg', 0.8);
//     }
//   };

//   // Close camera
//   const closeCamera = () => {
//     if (cameraStream) {
//       cameraStream.getTracks().forEach(track => track.stop());
//       setCameraStream(null);
//     }
//     setCameraOpen(false);
//   };

//   // Submit report
//   const submitReport = async () => {
//     // Validation
//     if (!image) {
//       setError('Please capture or upload a photo');
//       return;
//     }
//     if (!location) {
//       setError('Please capture your location');
//       return;
//     }
//     if (!description.trim()) {
//       setError('Please provide a description');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const formData = new FormData();
//       formData.append('image', imageFile, 'pothole.jpg');
//       formData.append('latitude', location.latitude.toString());
//       formData.append('longitude', location.longitude.toString());
//       formData.append('address', address);
//       formData.append('severity', severity);
//       formData.append('position', position);
//       formData.append('description', description);
//       formData.append('reportedBy', reportedBy || 'Anonymous');

//       const response = await fetch(`${API_URL}/potholes`, {
//         method: 'POST',
//         body: formData,
//       });

//       const result = await response.json();

//       if (result.success) {
//         setSuccess(true);
//         setTimeout(() => {
//           resetForm();
//         }, 3000);
//       } else {
//         setError(result.message || 'Failed to submit report');
//       }
//     } catch (err) {
//       setError('Network error: ' + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Reset form
//   const resetForm = () => {
//     setImage(null);
//     setImageFile(null);
//     setLocation(null);
//     setAddress('');
//     setSeverity('mild');
//     setPosition('middle');
//     setDescription('');
//     setReportedBy('');
//     setSuccess(false);
//     setError('');
//   };

//   // Cleanup camera on unmount
//   useEffect(() => {
//     return () => {
//       if (cameraStream) {
//         cameraStream.getTracks().forEach(track => track.stop());
//       }
//     };
//   }, [cameraStream]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//       {/* Header */}
//       <header className="bg-white shadow-md">
//         <div className="max-w-4xl mx-auto px-4 py-6">
//           <h1 className="text-3xl font-bold text-gray-900">Pothole Reporter</h1>
//           <p className="text-sm text-gray-600 mt-1">Report road issues and help improve infrastructure</p>
//         </div>
//       </header>

//       <div className="max-w-4xl mx-auto px-4 py-8">
//         {/* Success Message */}
//         {success && (
//           <div className="mb-6 p-4 bg-green-100 border border-green-400 rounded-lg flex items-center gap-3">
//             <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
//             <div>
//               <p className="font-semibold text-green-900">Report Submitted Successfully!</p>
//               <p className="text-sm text-green-700">Thank you for helping improve our roads.</p>
//             </div>
//           </div>
//         )}

//         {/* Error Message */}
//         {error && (
//           <div className="mb-6 p-4 bg-red-100 border border-red-400 rounded-lg flex items-center gap-3">
//             <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
//             <div>
//               <p className="font-semibold text-red-900">Error</p>
//               <p className="text-sm text-red-700">{error}</p>
//             </div>
//           </div>
//         )}

//         {/* Camera Modal */}
//         {cameraOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
//             <div className="relative w-full max-w-2xl">
//               <video
//                 ref={videoRef}
//                 autoPlay
//                 playsInline
//                 className="w-full rounded-lg"
//               />
//               <canvas ref={canvasRef} className="hidden" />
//               <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
//                 <button
//                   onClick={capturePhoto}
//                   className="px-6 py-3 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition"
//                 >
//                   Capture Photo
//                 </button>
//                 <button
//                   onClick={closeCamera}
//                   className="px-6 py-3 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Main Form */}
//         <div className="space-y-6">
//           {/* Photo Section */}
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
//               <Camera className="w-5 h-5" />
//               Photo *
//             </h2>

//             {image ? (
//               <div className="space-y-4">
//                 <img
//                   src={image}
//                   alt="Pothole"
//                   className="w-full h-64 object-cover rounded-lg"
//                 />
//                 <button
//                   onClick={() => {
//                     setImage(null);
//                     setImageFile(null);
//                   }}
//                   className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
//                 >
//                   Remove Photo
//                 </button>
//               </div>
//             ) : (
//               <div className="space-y-3">
//                 <button
//                   onClick={openCamera}
//                   className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
//                 >
//                   <Camera className="w-5 h-5" />
//                   Open Camera
//                 </button>
//                 <div className="relative">
//                   <input
//                     ref={fileInputRef}
//                     type="file"
//                     accept="image/*"
//                     onChange={handleFileSelect}
//                     className="hidden"
//                   />
//                   <button
//                     onClick={() => fileInputRef.current?.click()}
//                     className="w-full px-6 py-4 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition flex items-center justify-center gap-2"
//                   >
//                     <Upload className="w-5 h-5" />
//                     Upload from Device
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Location Section */}
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
//               <MapPin className="w-5 h-5" />
//               Location *
//             </h2>

//             {location ? (
//               <div className="space-y-4">
//                 <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
//                   <p className="text-sm font-medium text-green-900 mb-1">📍 {address}</p>
//                   <p className="text-xs text-green-700">
//                     Lat: {location.latitude.toFixed(6)}, Lng: {location.longitude.toFixed(6)}
//                   </p>
//                 </div>
//                 <button
//                   onClick={getCurrentLocation}
//                   disabled={locationLoading}
//                   className="w-full px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
//                 >
//                   Update Location
//                 </button>
//               </div>
//             ) : (
//               <button
//                 onClick={getCurrentLocation}
//                 disabled={locationLoading}
//                 className="w-full px-6 py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:bg-gray-400"
//               >
//                 {locationLoading ? (
//                   <>
//                     <Loader className="w-5 h-5 animate-spin" />
//                     Getting Location...
//                   </>
//                 ) : (
//                   <>
//                     <MapPin className="w-5 h-5" />
//                     Capture Current Location
//                   </>
//                 )}
//               </button>
//             )}
//           </div>

//           {/* Severity Section */}
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <h2 className="text-lg font-semibold text-gray-900 mb-4">Severity Level *</h2>
//             <select
//               value={severity}
//               onChange={(e) => setSeverity(e.target.value)}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               <option value="mild">🟡 Mild - Small pothole</option>
//               <option value="severe">🟠 Severe - Medium pothole</option>
//               <option value="dangerous">🔴 Dangerous - Large pothole</option>
//             </select>
//           </div>

//           {/* Position Section */}
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <h2 className="text-lg font-semibold text-gray-900 mb-4">Position on Road *</h2>
//             <select
//               value={position}
//               onChange={(e) => setPosition(e.target.value)}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               <option value="left">⬅️ Left side of road</option>
//               <option value="middle">🎯 Middle of road</option>
//               <option value="right">➡️ Right side of road</option>
//               <option value="full-width">↔️ Full width (entire road)</option>
//             </select>
//           </div>

//           {/* Description Section */}
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <h2 className="text-lg font-semibold text-gray-900 mb-4">Description *</h2>
//             <textarea
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               placeholder="Describe the pothole and its impact (e.g., causing traffic issues, near bus stop, etc.)"
//               rows="4"
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
//             />
//           </div>

//           {/* Reporter Name Section */}
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Name (Optional)</h2>
//             <input
//               type="text"
//               value={reportedBy}
//               onChange={(e) => setReportedBy(e.target.value)}
//               placeholder="Enter your name or leave blank for anonymous"
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>

//           {/* Submit Button */}
//           <button
//             onClick={submitReport}
//             disabled={loading}
//             className="w-full px-6 py-4 bg-red-600 text-white rounded-lg font-bold text-lg hover:bg-red-700 transition disabled:bg-gray-400 flex items-center justify-center gap-2 shadow-lg"
//           >
//             {loading ? (
//               <>
//                 <Loader className="w-5 h-5 animate-spin" />
//                 Submitting...
//               </>
//             ) : (
//               <>
//                 <Send className="w-5 h-5" />
//                 Submit Report
//               </>
//             )}
//           </button>

//           {/* Footer */}
//           <div className="text-center py-4">
//             <p className="text-sm text-gray-600">Help make our roads safer! 🛣️</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;

import React, { useState, useEffect, useRef } from 'react';
import { Camera, MapPin, Upload, Send, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { base_url } from './utils/base_url';

const API_URL = `${base_url}/api`;

function App() {
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [severity, setSeverity] = useState('mild');
  const [position, setPosition] = useState('middle');
  const [description, setDescription] = useState('');
  const [reportedBy, setReportedBy] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);

  // ✅ Get current location
  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLocationLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setLocation(coords);

        // Reverse geocode to get address
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`
          );
          const data = await response.json();
          setAddress(data.display_name || 'Unknown location');
        } catch (err) {
          setAddress(`${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`);
        }

        setLocationLoading(false);
      },
      (err) => {
        setError('Unable to retrieve location: ' + err.message);
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // ✅ Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setError('Please select a valid image file');
    }
  };

  // ✅ Camera functions
  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraStream(stream);
        setCameraOpen(true);
      }
    } catch (err) {
      setError('Unable to access camera: ' + err.message);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        setImageFile(blob);
        setImage(canvas.toDataURL('image/jpeg'));
        closeCamera();
      }, 'image/jpeg', 0.8);
    }
  };

  const closeCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setCameraOpen(false);
  };

  // ✅ Submit report
  const submitReport = async () => {
    if (!image) return setError('Please capture or upload a photo');
    if (!location) return setError('Please capture your location');
    if (!description.trim()) return setError('Please provide a description');

    setLoading(true);
    setError('');
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('image', imageFile, imageFile.name || 'pothole.jpg');
      formData.append('latitude', location.latitude.toString());
      formData.append('longitude', location.longitude.toString());
      formData.append('address', address);
      formData.append('severity', severity);
      formData.append('position', position);
      formData.append('description', description);
      formData.append('reportedBy', reportedBy || 'Anonymous');

      // ✅ Track upload progress
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${API_URL}/potholes`, true);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percent);
        }
      };

      xhr.onload = () => {
        setLoading(false);
        if (xhr.status === 201) {
          setSuccess(true);
          setTimeout(resetForm, 3000);
        } else {
          const res = JSON.parse(xhr.responseText);
          setError(res.message || 'Failed to submit report');
        }
      };

      xhr.onerror = () => {
        setLoading(false);
        setError('Network error during upload');
      };

      xhr.send(formData);
    } catch (err) {
      setLoading(false);
      setError('Error submitting report: ' + err.message);
    }
  };

  const resetForm = () => {
    setImage(null);
    setImageFile(null);
    setLocation(null);
    setAddress('');
    setSeverity('mild');
    setPosition('middle');
    setDescription('');
    setReportedBy('');
    setSuccess(false);
    setError('');
    setUploadProgress(0);
  };

  useEffect(() => {
    return () => {
      if (cameraStream) cameraStream.getTracks().forEach(track => track.stop());
    };
  }, [cameraStream]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Pothole Reporter</h1>
          <p className="text-sm text-gray-600 mt-1">Report road issues and help improve infrastructure</p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* ✅ Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-semibold text-green-900">Report Submitted Successfully!</p>
              <p className="text-sm text-green-700">Thank you for helping improve our roads.</p>
            </div>
          </div>
        )}

        {/* ✅ Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <div>
              <p className="font-semibold text-red-900">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* ✅ Camera Modal */}
        {cameraOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-2xl">
              <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg" />
              <canvas ref={canvasRef} className="hidden" />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                <button
                  onClick={capturePhoto}
                  className="px-6 py-3 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition"
                >
                  Capture Photo
                </button>
                <button
                  onClick={closeCamera}
                  className="px-6 py-3 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ✅ Main Form */}
        <div className="space-y-6">
          {/* Image Upload */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Camera className="w-5 h-5" /> Photo *
            </h2>

            {image ? (
              <div className="space-y-4">
                <img src={image} alt="Preview" className="w-full h-64 object-cover rounded-lg" />
                <button
                  onClick={() => { setImage(null); setImageFile(null); }}
                  className="w-full px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Remove Photo
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <button onClick={openCamera} className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center gap-2">
                  <Camera className="w-5 h-5" /> Open Camera
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-6 py-4 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 flex items-center justify-center gap-2"
                >
                  <Upload className="w-5 h-5" /> Upload from Device
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
              </div>
            )}

            {/* ✅ Upload Progress */}
            {loading && uploadProgress > 0 && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1 text-center">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            )}
          </div>

                     {/* Location Section */}
                     <div className="bg-white rounded-lg shadow-md p-6">
                       <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                         <MapPin className="w-5 h-5" />
                         Location *
                       </h2>

                       {location ? (
                         <div className="space-y-4">
                           <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                             <p className="text-sm font-medium text-green-900 mb-1">📍 {address}</p>
                             <p className="text-xs text-green-700">
                               Lat: {location.latitude.toFixed(6)}, Lng: {location.longitude.toFixed(6)}
                             </p>
                           </div>
                           <button
                             onClick={getCurrentLocation}
                             disabled={locationLoading}
                             className="w-full px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
                           >
                             Update Location
                           </button>
                         </div>
                       ) : (
                         <button
                           onClick={getCurrentLocation}
                           disabled={locationLoading}
                           className="w-full px-6 py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:bg-gray-400"
                         >
                           {locationLoading ? (
                             <>
                               <Loader className="w-5 h-5 animate-spin" />
                               Getting Location...
                             </>
                           ) : (
                             <>
                               <MapPin className="w-5 h-5" />
                               Capture Current Location
                             </>
                           )}
                         </button>
                       )}
                     </div>

                     {/* Severity Section */}
                     <div className="bg-white rounded-lg shadow-md p-6">
                       <h2 className="text-lg font-semibold text-gray-900 mb-4">Severity Level *</h2>
                       <select
                         value={severity}
                         onChange={(e) => setSeverity(e.target.value)}
                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       >
                         <option value="mild">🟡 Mild - Small pothole</option>
                         <option value="severe">🟠 Severe - Medium pothole</option>
                         <option value="dangerous">🔴 Dangerous - Large pothole</option>
                       </select>
                     </div>

                     {/* Position Section */}
                     <div className="bg-white rounded-lg shadow-md p-6">
                       <h2 className="text-lg font-semibold text-gray-900 mb-4">Position on Road *</h2>
                       <select
                         value={position}
                         onChange={(e) => setPosition(e.target.value)}
                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       >
                         <option value="left">⬅️ Left side of road</option>
                         <option value="middle">🎯 Middle of road</option>
                         <option value="right">➡️ Right side of road</option>
                         <option value="full-width">↔️ Full width (entire road)</option>
                       </select>
                     </div>

                     {/* Description Section */}
                     <div className="bg-white rounded-lg shadow-md p-6">
                       <h2 className="text-lg font-semibold text-gray-900 mb-4">Description *</h2>
                       <textarea
                         value={description}
                         onChange={(e) => setDescription(e.target.value)}
                         placeholder="Describe the pothole and its impact (e.g., causing traffic issues, near bus stop, etc.)"
                         rows="4"
                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                       />
                     </div>

                     {/* Reporter Name Section */}
                     <div className="bg-white rounded-lg shadow-md p-6">
                       <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Name (Optional)</h2>
                       <input
                         type="text"
                         value={reportedBy}
                         onChange={(e) => setReportedBy(e.target.value)}
                         placeholder="Enter your name or leave blank for anonymous"
                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       />
                     </div>


          {/* Location, Severity, Position, etc. — same as before */}
          {/* ✅ Keep rest of the form sections same */}
          {/* ✅ Submit Button */}
          <button
            onClick={submitReport}
            disabled={loading}
            className="w-full px-6 py-4 bg-red-600 text-white rounded-lg font-bold text-lg hover:bg-red-700 transition disabled:bg-gray-400 flex items-center justify-center gap-2 shadow-lg"
          >
            {loading ? <><Loader className="w-5 h-5 animate-spin" /> Submitting...</> : <><Send className="w-5 h-5" /> Submit Report</>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
