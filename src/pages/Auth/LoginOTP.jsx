// // // src/pages/Auth/LoginOTP.jsx
// // import React, { useState } from 'react';
// // import { useNavigate, useLocation } from 'react-router-dom';
// // import axios from 'axios';
// // import { saveToken } from '../../utils/auth';
// // import { base_url } from '../../utils/base_url';

// // const API_BASE = `${base_url}/api`;

// // export default function LoginOTP() {
// //   const [phone, setPhone] = useState('');
// //   const [sending, setSending] = useState(false);
// //   const [otpSent, setOtpSent] = useState(false);
// //   const [otp, setOtp] = useState('');
// //   const [message, setMessage] = useState('');
// //   const navigate = useNavigate();
// //   const location = useLocation();

// //   // optional: redirect path (where to go after login)
// //   const redirectTo = new URLSearchParams(location.search).get('redirect') || '/';

// //   const requestOtp = async () => {
// //     setMessage('');
// //     if (!phone) return setMessage('Enter phone number');
// //     try {
// //       setSending(true);
// //       const res = await axios.post(`${API_BASE}/auth/request-otp`, { phone });
// //       setOtpSent(true);
// //       setMessage('OTP sent to your number.');
// //     } catch (err) {
// //       setMessage(err?.response?.data?.message || 'Failed to send OTP');
// //     } finally {
// //       setSending(false);
// //     }
// //   };

// //   const verifyOtp = async () => {
// //     setMessage('');
// //     if (!otp) return setMessage('Enter OTP');
// //     try {
// //       const res = await axios.post(`${API_BASE}/auth/verify-otp`, { phone, code: otp });
// //       const { token } = res.data;
// //       saveToken(token);
// //       setMessage('Login successful');

// //       // After login, redirect back
// //       navigate(redirectTo, { replace: true });
// //     } catch (err) {
// //       setMessage(err?.response?.data?.message || 'OTP verification failed');
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
// //       <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">
// //         <h2 className="text-xl font-semibold mb-4">Login / Verify with OTP</h2>

// //         <label className="block text-sm mb-1">Phone number</label>
// //         <input
// //           value={phone}
// //           onChange={(e) => setPhone(e.target.value)}
// //           placeholder="e.g. 919876543210"
// //           className="w-full p-2 border rounded mb-3"
// //         />

// //         {!otpSent ? (
// //           <>
// //             <button
// //               onClick={requestOtp}
// //               disabled={sending}
// //               className="w-full py-2 bg-blue-600 text-white rounded"
// //             >
// //               {sending ? 'Sending...' : 'Send OTP'}
// //             </button>
// //           </>
// //         ) : (
// //           <>
// //             <label className="block text-sm mt-3 mb-1">Enter OTP</label>
// //             <input
// //               value={otp}
// //               onChange={(e) => setOtp(e.target.value)}
// //               placeholder="6-digit code"
// //               className="w-full p-2 border rounded mb-3"
// //             />

// //             <div className="flex gap-2">
// //               <button onClick={verifyOtp} className="flex-1 py-2 bg-green-600 text-white rounded">Verify</button>
// //               <button
// //                 onClick={requestOtp}
// //                 className="flex-1 py-2 bg-gray-200 rounded"
// //               >
// //                 Resend
// //               </button>
// //             </div>
// //           </>
// //         )}

// //         {message && <p className="mt-3 text-sm text-gray-700">{message}</p>}

// //         <p className="mt-4 text-sm text-gray-500">
// //           After successful login you'll be returned to the report submission page.
// //         </p>
// //       </div>
// //     </div>
// //   );
// // }


// // src/pages/Auth/LoginOTP.jsx
// import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import axios from 'axios';
// import { saveToken, saveUserData } from '../../utils/auth';
// import { base_url } from '../../utils/base_url';

// const API_BASE = `${base_url}/api`;

// export default function LoginOTP() {
//     const [isSignup, setIsSignup] = useState(false);
//     const [phone, setPhone] = useState('');
//     const [name, setName] = useState('');
//     const [email, setEmail] = useState('');
//     const [sending, setSending] = useState(false);
//     const [otpSent, setOtpSent] = useState(false);
//     const [otp, setOtp] = useState('');
//     const [message, setMessage] = useState('');
//     const navigate = useNavigate();
//     const location = useLocation();

//     const redirectTo = new URLSearchParams(location.search).get('redirect') || '/';

//     const requestOtp = async () => {
//         setMessage('');
//         if (!phone) return setMessage('Enter phone number');

//         // Validate email format if provided
//         if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//             return setMessage('Please enter a valid email address');
//         }

//         try {
//             setSending(true);
//             const payload = { phone };

//             // Only include name and email if in signup mode and they're provided
//             if (isSignup) {
//                 if (name) payload.name = name;
//                 if (email) payload.email = email;
//             }

//             const res = await axios.post(`${API_BASE}/auth/request-otp`, payload);
//             setOtpSent(true);
//             setMessage('OTP sent to your number.');
//         } catch (err) {
//             setMessage(err?.response?.data?.message || 'Failed to send OTP');
//         } finally {
//             setSending(false);
//         }
//     };

//     const verifyOtp = async () => {
//         setMessage('');
//         if (!otp) return setMessage('Enter OTP');
//         try {
//             const res = await axios.post(`${API_BASE}/auth/verify-otp`, { phone, code: otp });
//             const { token, user } = res.data;

//             // Save token and user data to localStorage
//             saveToken(token);
//             saveUserData(user);

//             setMessage('Login successful');
//             navigate(redirectTo, { replace: true });
//         } catch (err) {
//             setMessage(err?.response?.data?.message || 'OTP verification failed');
//         }
//     };

//     const toggleMode = () => {
//         setIsSignup(!isSignup);
//         setMessage('');
//         setOtpSent(false);
//         setOtp('');
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
//             <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">
//                 <div className="flex justify-between items-center mb-4">
//                     <h2 className="text-xl font-semibold">
//                         {isSignup ? 'Sign Up' : 'Login'} with OTP
//                     </h2>
//                     <button
//                         onClick={toggleMode}
//                         className="text-sm text-blue-600 hover:underline"
//                     >
//                         {isSignup ? 'Already have an account? Login' : 'New user? Sign up'}
//                     </button>
//                 </div>

//                 <label className="block text-sm mb-1">Phone number *</label>
//                 <input
//                     value={phone}
//                     onChange={(e) => setPhone(e.target.value)}
//                     placeholder="e.g. 919876543210"
//                     className="w-full p-2 border rounded mb-3"
//                     disabled={otpSent}
//                 />

//                 {isSignup && !otpSent && (
//                     <>
//                         <label className="block text-sm mb-1">Name (Optional)</label>
//                         <input
//                             value={name}
//                             onChange={(e) => setName(e.target.value)}
//                             placeholder="Your name"
//                             className="w-full p-2 border rounded mb-3"
//                         />

//                         <label className="block text-sm mb-1">Email (Optional)</label>
//                         <input
//                             type="email"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             placeholder="your.email@example.com"
//                             className="w-full p-2 border rounded mb-3"
//                         />
//                     </>
//                 )}

//                 {!otpSent ? (
//                     <>
//                         <button
//                             onClick={requestOtp}
//                             disabled={sending}
//                             className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
//                         >
//                             {sending ? 'Sending...' : 'Send OTP'}
//                         </button>
//                     </>
//                 ) : (
//                     <>
//                         <label className="block text-sm mt-3 mb-1">Enter OTP</label>
//                         <input
//                             value={otp}
//                             onChange={(e) => setOtp(e.target.value)}
//                             placeholder="6-digit code"
//                             className="w-full p-2 border rounded mb-3"
//                             maxLength={6}
//                         />

//                         <div className="flex gap-2">
//                             <button
//                                 onClick={verifyOtp}
//                                 className="flex-1 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//                             >
//                                 Verify
//                             </button>
//                             <button
//                                 onClick={requestOtp}
//                                 className="flex-1 py-2 bg-gray-200 rounded hover:bg-gray-300"
//                             >
//                                 Resend
//                             </button>
//                         </div>
//                     </>
//                 )}

//                 {message && (
//                     <p className={`mt-3 text-sm ${message.includes('successful') || message.includes('sent') ? 'text-green-600' : 'text-red-600'}`}>
//                         {message}
//                     </p>
//                 )}

//                 <p className="mt-4 text-sm text-gray-500">
//                     After successful login you'll be returned to the report submission page.
//                 </p>
//             </div>
//         </div>
//     );
// }

// src/pages/Auth/LoginOTP.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
// import { saveToken, saveUserData } from '../../utils/api';
import { saveToken, saveUserData } from '../../utils/auth';

import { base_url } from '../../utils/base_url';

const API_BASE = `${base_url}/api`;

export default function LoginOTP() {
    const [isSignup, setIsSignup] = useState(false);
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [sending, setSending] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const redirectTo = new URLSearchParams(location.search).get('redirect') || '/';

    const requestOtp = async () => {
        setMessage('');
        if (!phone) return setMessage('Enter phone number');

        // Validate email format if provided
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return setMessage('Please enter a valid email address');
        }

        try {
            setSending(true);
            const payload = { phone };

            // Only include name and email if in signup mode and they're provided
            if (isSignup) {
                if (name) payload.name = name;
                if (email) payload.email = email;
            }

            const res = await axios.post(`${API_BASE}/auth/request-otp`, payload);
            setOtpSent(true);
            setMessage('OTP sent to your number.');
        } catch (err) {
            setMessage(err?.response?.data?.message || 'Failed to send OTP');
        } finally {
            setSending(false);
        }
    };

    const verifyOtp = async () => {
        setMessage('');
        if (!otp) return setMessage('Enter OTP');
        try {
            const res = await axios.post(`${API_BASE}/auth/verify-otp`, { phone, code: otp });
            const { token, user } = res.data;

            console.log("res" ,res)

            // Save token and user data to localStorage
            saveToken(token);
            saveUserData(user);

            setMessage('Login successful');
            navigate(redirectTo, { replace: true });
        } catch (err) {
            setMessage(err?.response?.data?.message || 'OTP verification failed');
        }
    };

    const toggleMode = () => {
        setIsSignup(!isSignup);
        setMessage('');
        setOtpSent(false);
        setOtp('');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">
                        {isSignup ? 'Sign Up' : 'Login'} with OTP
                    </h2>
                    <button
                        onClick={toggleMode}
                        className="text-sm text-blue-600 hover:underline"
                    >
                        {isSignup ? 'Already have an account? Login' : 'New user? Sign up'}
                    </button>
                </div>

                <label className="block text-sm mb-1">Phone number *</label>
                <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 919876543210"
                    className="w-full p-2 border rounded mb-3"
                    disabled={otpSent}
                />

                {isSignup && !otpSent && (
                    <>
                        <label className="block text-sm mb-1">Name (Optional)</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
                            className="w-full p-2 border rounded mb-3"
                        />

                        <label className="block text-sm mb-1">Email (Optional)</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your.email@example.com"
                            className="w-full p-2 border rounded mb-3"
                        />
                    </>
                )}

                {!otpSent ? (
                    <>
                        <button
                            onClick={requestOtp}
                            disabled={sending}
                            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
                        >
                            {sending ? 'Sending...' : 'Send OTP'}
                        </button>
                    </>
                ) : (
                    <>
                        <label className="block text-sm mt-3 mb-1">Enter OTP</label>
                        <input
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="6-digit code"
                            className="w-full p-2 border rounded mb-3"
                            maxLength={6}
                        />

                        <div className="flex gap-2">
                            <button
                                onClick={verifyOtp}
                                className="flex-1 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                                Verify
                            </button>
                            <button
                                onClick={requestOtp}
                                className="flex-1 py-2 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                Resend
                            </button>
                        </div>
                    </>
                )}

                {message && (
                    <p className={`mt-3 text-sm ${message.includes('successful') || message.includes('sent') ? 'text-green-600' : 'text-red-600'}`}>
                        {message}
                    </p>
                )}

                <p className="mt-4 text-sm text-gray-500">
                    After successful login you'll be returned to the report submission page.
                </p>
            </div>
        </div>
    );
}