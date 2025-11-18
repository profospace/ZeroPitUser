import React from "react";
import { MapPinOff } from "lucide-react";

const FloatingLocationAlert = ({ locationEnabled }) => {
    if (locationEnabled) return null; // Hide when location is ON

    return (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-red-500 text-white px-4 py-3 rounded-2xl shadow-2xl animate-bounce">
            <MapPinOff size={22} className="text-white" />
            <span className="font-medium text-sm">
                Location is OFF — Turn it ON for accurate tracking
            </span>
        </div>
    );
};

export default FloatingLocationAlert;
