import api from "../utils/axios";
import React, { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { FiMail, FiLock, FiShield } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/api";
import { ClipLoader } from "react-spinners";
import { FiEye, FiEyeOff } from "react-icons/fi";

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  // const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return; // only digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // move to next input automatically
    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleSendOtp = async () => {
    setLoading(true);
    try {
      await api.post(
        `${BASE_URL}/api/auth/send-otp`,
        { email },
        { withCredentials: true },
      );
      setErr("");
      setStep(2);
    } catch (error) {
      setErr(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const finalOtp = otp.join(""); // 🔥 important

      await api.post(
        `${BASE_URL}/api/auth/verify-otp`,
        { email, otp: finalOtp },
        { withCredentials: true },
      );

      setErr("");
      setStep(3);
    } catch (error) {
      setErr(error?.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setErr("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await api.post(
        `${BASE_URL}/api/auth/reset-password`,
        { email, newPassword },
        { withCredentials: true },
      );
      setErr("");
      navigate("/signin");
    } catch (error) {
      setErr(error?.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  // Shared UI Styles - Optimized for higher visibility
  const inputContainerStyle = "relative group mb-6";
  const iconStyle =
    "absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ff4d2d] transition-colors duration-300";
  const inputFieldStyle =
    "w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 py-4 outline-none focus:bg-white focus:ring-4 focus:ring-orange-100 focus:border-[#ff4d2d] transition-all duration-300 font-medium shadow-inner";

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#f8fafc] relative overflow-hidden">
      {/* Background Decor - Darkened slightly for better contrast */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1493770348161-369560ae357d?auto=format&fit=crop&q=80&w=2070"
          alt="Food Background"
          className="w-full h-full object-cover opacity-[0.12] grayscale-[20%]"
        />
      </div>

      {/* Decorative Blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-orange-200 rounded-full blur-[120px] opacity-40 animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-red-200 rounded-full blur-[120px] opacity-40 animate-pulse delay-1000" />

      {/* Main Card - Increased Opacity and defined border */}
      <div className="relative z-10 bg-white/95 backdrop-blur-md rounded-[2.5rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] w-full max-w-md p-8 md:p-10 border border-gray-200">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => (step > 1 ? setStep(step - 1) : navigate("/signin"))}
            className="p-2.5 bg-gray-50 border border-gray-100 shadow-sm rounded-xl hover:bg-orange-50 hover:text-[#ff4d2d] transition-all active:scale-90 text-gray-600"
          >
            <IoIosArrowRoundBack size={26} />
          </button>
          <div className="text-right">
            <h1 className="text-lg font-black text-gray-900">Security</h1>
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">
              Step {step} of 3
            </p>
          </div>
        </div>

        {/* Progress Line */}
        <div className="flex gap-2 mb-10">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                s <= step ? "bg-[#ff4d2d]" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        {/* Step 1: Request OTP */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-100/50 text-[#ff4d2d] mb-4">
                <FiMail size={28} />
              </div>
              <h2 className="text-2xl font-black text-gray-800 tracking-tight">
                Forgot Password?
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Enter your email to receive a secure code.
              </p>
            </div>

            <div className={inputContainerStyle}>
              <FiMail className={iconStyle} />
              <input
                type="email"
                className={inputFieldStyle}
                placeholder="yourname@email.com"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>

            <button
              className="w-full bg-[#ff4d2d] text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-200/50 hover:bg-[#e64323] transition-all flex items-center justify-center text-lg"
              onClick={handleSendOtp}
              disabled={loading}
            >
              {loading ? <ClipLoader size={24} color="white" /> : "Send Code"}
            </button>
          </div>
        )}

        {/* Step 2: Verify OTP */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-2 duration-300">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-100/50 text-[#ff4d2d] mb-4">
                <FiShield size={28} />
              </div>
              <h2 className="text-2xl font-black text-gray-800 tracking-tight">
                Verify Code
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Sent to <span className="text-gray-900 font-bold">{email}</span>
              </p>
            </div>

            {/* OTP Inputs */}
            <div className="mb-6 flex justify-center gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  maxLength={1}
                  className="w-14 h-16 text-center text-2xl font-bold border border-gray-500 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-200 focus:border-[#ff4d2d] outline-none"
                />
              ))}
            </div>

            {/* Verify Button */}
            <button
              className="w-full bg-[#ff4d2d] text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-200/50 hover:bg-[#e64323] transition-all flex items-center justify-center text-lg"
              onClick={handleVerifyOtp}
              disabled={loading}
            >
              {loading ? (
                <ClipLoader size={24} color="white" />
              ) : (
                "Confirm Code"
              )}
            </button>
          </div>
        )}

        {/* Step 3: Set New Password */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-2 duration-300">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-100/50 text-[#ff4d2d] mb-4">
                <FiLock size={28} />
              </div>
              <h2 className="text-2xl font-black text-gray-800 tracking-tight">
                New Password
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Choose a secure password.
              </p>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              {/* New Password */}
              <div className={inputContainerStyle}>
                <FiLock className={iconStyle} />

                <input
                  type={showPassword ? "text" : "password"}
                  className={inputFieldStyle + " pr-12"}
                  placeholder="New Password"
                  onChange={(e) => setNewPassword(e.target.value)}
                  value={newPassword}
                />

                {/* Eye Toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#ff4d2d]"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className={inputContainerStyle}>
                <FiLock className={iconStyle} />

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className={inputFieldStyle + " pr-12"}
                  placeholder="Confirm Password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                />

                {/* Eye Toggle */}
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#ff4d2d]"
                >
                  {showConfirmPassword ? (
                    <FiEyeOff size={20} />
                  ) : (
                    <FiEye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              className="w-full bg-[#ff4d2d] text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-200/50 hover:bg-[#e64323] transition-all flex items-center justify-center text-lg mt-4"
              onClick={handleResetPassword}
              disabled={loading}
            >
              {loading ? (
                <ClipLoader size={24} color="white" />
              ) : (
                "Update Password"
              )}
            </button>
          </div>
        )}

        {/* Error Feedback */}
        {err && (
          <div className="mt-6 p-3 bg-red-50 border border-red-100 rounded-xl">
            <p className="text-red-500 text-center text-xs font-bold">{err}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
