import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { serverUrl } from '../App';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase';
import { ClipLoader } from 'react-spinners';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

function SignIn() {
    const primaryColor = "#ff4d2d";
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const handleSignIn = async () => {
        setLoading(true);
        try {
            const result = await axios.post(`${serverUrl}/api/auth/signin`, {
                email, password
            }, { withCredentials: true });
            dispatch(setUserData(result.data));
            setErr("");
            setLoading(false);
        } catch (error) {
            setErr(error?.response?.data?.message || "Something went wrong");
            setLoading(false);
        }
    };

    const handleGoogleAuth = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const { data } = await axios.post(`${serverUrl}/api/auth/google-auth`, {
                email: result.user.email,
            }, { withCredentials: true });
            dispatch(setUserData(data));
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 bg-gradient-to-br from-[#fff9f6] to-[#fff1ed]">
            <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(255,77,45,0.08)] w-full max-w-md p-10 border border-orange-50 relative overflow-hidden">
                
                {/* Decorative Element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff4d2d] opacity-[0.03] rounded-full -mr-16 -mt-16"></div>

                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black mb-3 tracking-tight" style={{ color: primaryColor }}>
                        Vingo<span className="text-gray-800">.</span>
                    </h1>
                    <p className="text-gray-500 font-medium">Welcome back! Please enter your details.</p>
                </div>

                <div className="space-y-6">
                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Email Address</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#ff4d2d] transition-colors">
                                <FaEnvelope size={16} />
                            </div>
                            <input 
                                type="email" 
                                className="w-full bg-gray-50 border border-transparent rounded-2xl px-11 py-3.5 outline-none focus:bg-white focus:border-[#ff4d2d]/30 focus:ring-4 focus:ring-[#ff4d2d]/5 transition-all text-gray-800 placeholder:text-gray-400 font-medium" 
                                placeholder="name@example.com"
                                onChange={(e) => setEmail(e.target.value)} 
                                value={email} 
                                required
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Password</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#ff4d2d] transition-colors">
                                <FaLock size={16} />
                            </div>
                            <input 
                                type={showPassword ? "text" : "password"} 
                                className="w-full bg-gray-50 border border-transparent rounded-2xl px-11 py-3.5 outline-none focus:bg-white focus:border-[#ff4d2d]/30 focus:ring-4 focus:ring-[#ff4d2d]/5 transition-all text-gray-800 placeholder:text-gray-400 font-medium" 
                                placeholder="••••••••"
                                onChange={(e) => setPassword(e.target.value)} 
                                value={password} 
                                required
                            />
                            <button 
                                type="button"
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1" 
                                onClick={() => setShowPassword(prev => !prev)}
                            >
                                {!showPassword ? <FaRegEye size={18} /> : <FaRegEyeSlash size={18} />}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end mt-3 mb-8">
                    <button 
                        className="text-sm font-bold text-[#ff4d2d] hover:text-[#e64323] transition-colors"
                        onClick={() => navigate("/forgot-password")}
                    >
                        Forgot Password?
                    </button>
                </div>

                <button 
                    className="w-full bg-[#ff4d2d] text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-200 hover:bg-[#e64323] hover:shadow-orange-300 transition-all duration-300 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center" 
                    onClick={handleSignIn} 
                    disabled={loading}
                >
                    {loading ? <ClipLoader size={20} color='white' /> : "Sign In"}
                </button>

                {err && (
                    <div className="mt-4 p-3 bg-red-50 rounded-xl border border-red-100">
                        <p className="text-red-500 text-xs font-bold text-center italic">*{err}</p>
                    </div>
                )}

                <div className="relative my-8 text-center">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-100"></span>
                    </div>
                    <span className="relative bg-white px-4 text-xs font-bold text-gray-400 uppercase tracking-widest">or continue with</span>
                </div>

                <button 
                    className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 rounded-2xl px-4 py-3.5 font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 active:scale-[0.98]" 
                    onClick={handleGoogleAuth}
                >
                    <FcGoogle size={22} />
                    <span>Google</span>
                </button>

                <p className="text-center mt-8 text-gray-500 font-medium">
                    New to Vingo? 
                    <span 
                        className="text-[#ff4d2d] font-bold ml-2 cursor-pointer hover:underline underline-offset-4" 
                        onClick={() => navigate("/signup")}
                    >
                        Create Account
                    </span>
                </p>
            </div>
        </div>
    );
}

export default SignIn;