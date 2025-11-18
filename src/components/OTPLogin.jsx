// components/OTPLogin.jsx
import React, { useState } from 'react';
import { Phone, Lock, ArrowLeft, Loader } from 'lucide-react';
import axios from 'axios';
import { base_url } from '../utils/base_url';

const API_URL = `${base_url}/api/auth`;

const OTPLogin = ({ onLoginSuccess, onBack }) => {
    const [step, setStep] = useState('phone'); // 'phone' or 'otp'
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [otpSent, setOtpSent] = useState(false);

    // Send OTP
    const handleSendOTP = async (e) => {
        e.preventDefault();
        setError('');

        // Validate phone number
        if (!/^[6-9]\d{9}$/.test(phoneNumber)) {
            return setError('Please enter a valid 10-digit Indian mobile number');
        }

        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/send-otp`, {
                phoneNumber
            });

            if (response.data.success) {
                setOtpSent(true);
                setStep('otp');

                // Show OTP in dev mode
                if (response.data.otp) {
                    console.log('🔐 Development OTP:', response.data.otp);
                    alert(`Dev Mode - OTP: ${response.data.otp}`);
                }
            } else {
                setError(response.data.message || 'Failed to send OTP');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Verify OTP
    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError('');

        if (otp.length !== 6) {
            return setError('Please enter a valid 6-digit OTP');
        }

        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/verify-otp`, {
                phoneNumber,
                otp
            });

            if (response.data.success) {
                // Store token in localStorage
                localStorage.setItem('authToken', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));

                // Call success callback
                onLoginSuccess(response.data.token, response.data.user);
            } else {
                setError(response.data.message || 'Invalid OTP');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Resend OTP
    const handleResendOTP = async () => {
        setOtp('');
        setError('');
        await handleSendOTP({ preventDefault: () => { } });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
                {/* Back Button */}
                {onBack && (
                    <button
                        onClick={onBack}
                        className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-800"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>
                )}

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        {step === 'phone' ? (
                            <Phone className="w-8 h-8 text-blue-600" />
                        ) : (
                            <Lock className="w-8 h-8 text-blue-600" />
                        )}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        {step === 'phone' ? 'Login with OTP' : 'Enter OTP'}
                    </h2>
                    <p className="text-gray-600 mt-2">
                        {step === 'phone'
                            ? 'Enter your mobile number to receive OTP'
                            : `OTP sent to +91 ${phoneNumber}`
                        }
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {/* Phone Number Step */}
                {step === 'phone' && (
                    <form onSubmit={handleSendOTP}>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mobile Number
                            </label>
                            <div className="flex gap-2">
                                <div className="bg-gray-100 px-3 py-3 rounded-lg border border-gray-300 flex items-center">
                                    <span className="font-medium">+91</span>
                                </div>
                                <input
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                    placeholder="Enter 10-digit number"
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    maxLength="10"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || phoneNumber.length !== 10}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin" />
                                    Sending OTP...
                                </>
                            ) : (
                                'Send OTP'
                            )}
                        </button>
                    </form>
                )}

                {/* OTP Verification Step */}
                {step === 'otp' && (
                    <form onSubmit={handleVerifyOTP}>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Enter 6-Digit OTP
                            </label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="000000"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                maxLength="6"
                                disabled={loading}
                                autoFocus
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || otp.length !== 6}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                'Verify OTP'
                            )}
                        </button>

                        {/* Resend OTP */}
                        <div className="mt-4 text-center">
                            <button
                                type="button"
                                onClick={handleResendOTP}
                                disabled={loading}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium disabled:text-gray-400"
                            >
                                Didn't receive OTP? Resend
                            </button>
                        </div>

                        {/* Change Number */}
                        <div className="mt-2 text-center">
                            <button
                                type="button"
                                onClick={() => {
                                    setStep('phone');
                                    setOtp('');
                                    setError('');
                                }}
                                disabled={loading}
                                className="text-gray-600 hover:text-gray-800 text-sm disabled:text-gray-400"
                            >
                                Change number
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default OTPLogin;