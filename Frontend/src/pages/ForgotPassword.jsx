import axios from 'axios';
import React, { useState } from 'react';
import { IoIosArrowRoundBack } from "react-icons/io";
import { FiMail, FiLock, FiShield } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import { ClipLoader } from 'react-spinners';

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    setLoading(true);
    try {
      await axios.post(`${serverUrl}/api/auth/send-otp`, { email }, { withCredentials: true });
      setErr("");
      setStep(2);
      setLoading(false);
    } catch (error) {
      setErr(error.response?.data?.message || "Something went wrong");
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      await axios.post(`${serverUrl}/api/auth/verify-otp`, { email, otp }, { withCredentials: true });
      setErr("");
      setStep(3);
      setLoading(false);
    } catch (error) {
      setErr(error?.response?.data?.message || "Invalid OTP");
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
      await axios.post(`${serverUrl}/api/auth/reset-password`, { email, newPassword }, { withCredentials: true });
      setErr("");
      setLoading(false);
      navigate("/signin");
    } catch (error) {
      setErr(error?.response?.data?.message || "Failed to reset password");
      setLoading(false);
    }
  };

  return (
    <div className='flex w-full items-center justify-center min-h-screen p-4 bg-gradient-to-br from-[#fff9f6] to-[#fff1ed] relative overflow-hidden'>
      {/* Background Decorative Blurs */}
      <div className='absolute top-[-10%] right-[-5%] w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-50' />
      <div className='absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-red-50 rounded-full blur-3xl opacity-50' />

      <div className='bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(255,77,45,0.08)] w-full max-w-md p-10 border border-white z-10'>
        
        {/* Header Section */}
        <div className='flex items-center gap-4 mb-8'>
          <button 
            onClick={() => step > 1 ? setStep(step - 1) : navigate("/signin")}
            className='p-2 bg-white shadow-sm rounded-full hover:bg-orange-50 transition-all group'
          >
            <IoIosArrowRoundBack size={32} className='text-gray-700 group-hover:text-[#ff4d2d]' />
          </button>
          <div>
            <h1 className='text-2xl font-black text-gray-900 tracking-tight'>Password Reset</h1>
            <p className='text-xs text-gray-400 font-bold uppercase tracking-widest'>Step {step} of 3</p>
          </div>
        </div>

        {/* Stepper Progress Bar */}
        <div className="flex gap-2 mb-10">
          {[1, 2, 3].map((s) => (
            <div 
              key={s} 
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${s <= step ? 'bg-[#ff4d2d]' : 'bg-gray-100'}`} 
            />
          ))}
        </div>

        {/* Step 1: Email Entry */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8 text-center">
              <div className="bg-orange-50 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 text-[#ff4d2d]">
                <FiMail size={30} />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Verify Email</h2>
              <p className="text-sm text-gray-500">Enter the email associated with your account</p>
            </div>
            <div className='mb-6 relative group'>
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ff4d2d] transition-colors" />
              <input 
                type="email" 
                className='w-full bg-gray-50 border-none rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-[#ff4d2d]/20 transition-all font-medium' 
                placeholder='Email Address' 
                onChange={(e) => setEmail(e.target.value)} 
                value={email} 
                required 
              />
            </div>
            <button 
              className='w-full bg-[#ff4d2d] text-white font-black py-4 rounded-2xl shadow-lg shadow-orange-100 hover:bg-[#e64323] transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center' 
              onClick={handleSendOtp} 
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color='white' /> : "Send OTP"}
            </button>
          </div>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="mb-8 text-center">
              <div className="bg-orange-50 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 text-[#ff4d2d]">
                <FiShield size={30} />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Secure Access</h2>
              <p className="text-sm text-gray-500">Enter the verification code sent to {email}</p>
            </div>
            <div className='mb-6'>
              <input 
                type="text" 
                className='w-full bg-gray-50 border-none rounded-2xl px-4 py-4 outline-none focus:ring-2 focus:ring-[#ff4d2d]/20 transition-all font-black text-center text-2xl tracking-[0.5em]' 
                placeholder='000000' 
                onChange={(e) => setOtp(e.target.value)} 
                value={otp} 
                maxLength={6}
              />
            </div>
            <button 
              className='w-full bg-[#ff4d2d] text-white font-black py-4 rounded-2xl shadow-lg shadow-orange-100 hover:bg-[#e64323] transition-all active:scale-[0.98] flex items-center justify-center' 
              onClick={handleVerifyOtp} 
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color='white' /> : "Verify Code"}
            </button>
          </div>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="mb-8 text-center">
              <div className="bg-orange-50 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 text-[#ff4d2d]">
                <FiLock size={30} />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Secure Account</h2>
              <p className="text-sm text-gray-500">Create a strong password for your account</p>
            </div>
            <div className="space-y-4 mb-6">
              <div className='relative group'>
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ff4d2d] transition-colors" />
                <input 
                  type="password" 
                  className='w-full bg-gray-50 border-none rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-[#ff4d2d]/20 transition-all font-medium' 
                  placeholder='New Password' 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  value={newPassword}
                />
              </div>
              <div className='relative group'>
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ff4d2d] transition-colors" />
                <input 
                  type="password" 
                  className='w-full bg-gray-50 border-none rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-[#ff4d2d]/20 transition-all font-medium' 
                  placeholder='Confirm Password' 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  value={confirmPassword} 
                />
              </div>
            </div>
            <button 
              className='w-full bg-[#ff4d2d] text-white font-black py-4 rounded-2xl shadow-lg shadow-orange-100 hover:bg-[#e64323] transition-all active:scale-[0.98] flex items-center justify-center' 
              onClick={handleResetPassword} 
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color='white' /> : "Update Password"}
            </button>
          </div>
        )}

        {/* Error Message */}
        {err && (
          <div className="mt-4 p-3 bg-red-50 rounded-xl border border-red-100 animate-in fade-in slide-in-from-top-2">
            <p className='text-red-500 text-center text-xs font-bold italic'>*{err}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;