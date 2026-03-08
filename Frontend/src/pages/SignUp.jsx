import React, { useState } from 'react'
import { FaRegEye, FaRegEyeSlash, FaUser, FaEnvelope, FaPhoneAlt, FaLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import { serverUrl } from '../App';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase';
import { ClipLoader } from "react-spinners"
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

function SignUp() {
    const primaryColor = "#ff4d2d";
    const [showPassword, setShowPassword] = useState(false)
    const [role, setRole] = useState("user")
    const navigate = useNavigate()
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [mobile, setMobile] = useState("")
    const [err, setErr] = useState("")
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    const handleSignUp = async () => {
        setLoading(true)
        try {
            const result = await axios.post(`${serverUrl}/api/auth/signup`, {
                fullName, email, password, mobile, role
            }, { withCredentials: true })
            dispatch(setUserData(result.data))
            setErr("")
            setLoading(false)
        } catch (error) {
            setErr(error?.response?.data?.message || "Registration failed")
            setLoading(false)
        }
    }

    const handleGoogleAuth = async () => {
        if (!mobile) {
            return setErr("Mobile number is required for Google Sign-up")
        }
        const provider = new GoogleAuthProvider()
        try {
            const result = await signInWithPopup(auth, provider)
            const { data } = await axios.post(`${serverUrl}/api/auth/google-auth`, {
                fullName: result.user.displayName,
                email: result.user.email,
                role,
                mobile
            }, { withCredentials: true })
            dispatch(setUserData(data))
        } catch (error) {
            console.log(error)
            setErr("Google authentication failed")
        }
    }

    // UPDATED: High Contrast Input Styles
    const inputWrapper = "relative group space-y-1.5";
    const inputIcon = "absolute left-4 top-[38px] text-gray-400 group-focus-within:text-[#ff4d2d] transition-colors duration-300 z-10";
    const inputClass = "w-full bg-gray-50 border border-gray-300 rounded-2xl pl-12 pr-4 py-3.5 outline-none focus:bg-white focus:border-[#ff4d2d] focus:ring-4 focus:ring-[#ff4d2d]/10 transition-all font-medium text-gray-800 placeholder:text-gray-400";

    return (
        // STEP 1: Page Background - bg-gray-100
        <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-6 bg-gray-100 relative">
            
            {/* STEP 2: Main Card - bg-white, border-gray-300, soft shadows */}
            <div className="bg-white border border-gray-300 rounded-[3rem] shadow-[0_8px_30px_rgba(0,0,0,0.06)] w-full max-w-[500px] p-8 md:p-12 z-10 relative overflow-hidden">
                
                <div className="text-center mb-10">
                    <div className="inline-block px-4 py-2 rounded-2xl bg-gray-50 border border-gray-300 mb-4">
                        <h1 className="text-4xl font-[1000] tracking-tighter italic" style={{ color: primaryColor }}>
                            Vingo<span className="text-gray-900">.</span>
                        </h1>
                    </div>
                    <p className="text-gray-500 font-bold text-xs uppercase tracking-[0.2em] opacity-70">Create Account</p>
                </div>

                <div className="space-y-5">
                    {/* Full Name */}
                    <div className={inputWrapper}>
                        <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                        <FaUser className={inputIcon} />
                        <input 
                            type="text" 
                            className={inputClass}
                            placeholder="e.g. John Doe" 
                            onChange={(e) => setFullName(e.target.value)} 
                            value={fullName} 
                            required
                        />
                    </div>

                    {/* Email & Phone Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={inputWrapper}>
                            <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">Email</label>
                            <FaEnvelope className={inputIcon} />
                            <input 
                                type="email" 
                                className={inputClass}
                                placeholder="mail@xyz.com" 
                                onChange={(e) => setEmail(e.target.value)} 
                                value={email} 
                            />
                        </div>
                        <div className={inputWrapper}>
                            <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">Phone</label>
                            <FaPhoneAlt className={inputIcon} />
                            <input 
                                type="tel" 
                                className={inputClass}
                                placeholder="10 Digit No." 
                                onChange={(e) => setMobile(e.target.value)} 
                                value={mobile} 
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className={inputWrapper}>
                        <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">Password</label>
                        <FaLock className={inputIcon} />
                        <input 
                            type={showPassword ? "text" : "password"} 
                            className={inputClass}
                            placeholder="••••••••" 
                            onChange={(e) => setPassword(e.target.value)} 
                            value={password} 
                        />
                        <button 
                            className="absolute right-4 top-[38px] text-gray-400 hover:text-[#ff4d2d] transition-colors p-1" 
                            onClick={() => setShowPassword(prev => !prev)}
                        >
                            {!showPassword ? <FaRegEye size={18} /> : <FaRegEyeSlash size={18} />}
                        </button>
                    </div>

                    {/* Role Selector - STEP 3: Inner boxes using bg-gray-50 */}
                    <div className="bg-gray-50 border border-gray-300 p-2 rounded-2xl mt-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block text-center mb-2">Join as</label>
                        <div className="flex gap-1">
                            {["user", "owner", "deliveryBoy"].map((r) => (
                                <button
                                    key={r}
                                    className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 border ${
                                        role === r 
                                        ? "bg-white border-gray-300 text-[#ff4d2d] shadow-sm scale-[1.02]" 
                                        : "bg-transparent border-transparent text-gray-400 hover:text-gray-600"
                                    }`}
                                    onClick={() => setRole(r)}
                                >
                                    {r === 'deliveryBoy' ? 'Courier' : r}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Create Account Button - STEP 6: Strong Shadow */}
                    <button 
                        className="w-full bg-[#ff4d2d] text-white font-black py-4 rounded-[1.5rem] shadow-[0_20px_40px_rgba(255,77,45,0.25)] hover:shadow-[0_25px_50px_rgba(255,77,45,0.35)] transition-all transform hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-2 mt-4" 
                        onClick={handleSignUp} 
                        disabled={loading}
                    >
                        {loading ? <ClipLoader size={20} color='white'/> : "Register Now"}
                    </button>

                    {err && (
                        <div className="bg-red-50 border border-red-200 p-3 rounded-2xl">
                            <p className="text-red-500 text-center text-[11px] font-black uppercase tracking-tighter">Error: {err}</p>
                        </div>
                    )}

                    {/* STEP 5: Divider Lines - bg-gray-300 */}
                    <div className="relative py-4 flex items-center">
                        <div className="flex-grow h-[2px] bg-gray-300 opacity-50 rounded-full"></div>
                        <span className="mx-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">OR</span>
                        <div className="flex-grow h-[2px] bg-gray-300 opacity-50 rounded-full"></div>
                    </div>

                    <button 
                        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-[1.5rem] px-4 py-4 font-bold text-gray-700 hover:bg-gray-50 transition-all active:scale-[0.98] shadow-sm" 
                        onClick={handleGoogleAuth}
                    >
                        <FcGoogle size={24} />
                        <span className="text-sm">Signup with Google</span>
                    </button>

                    <p className="text-center mt-6 text-gray-400 text-sm font-semibold">
                        Already joined? 
                        <button 
                            className="text-[#ff4d2d] font-black ml-2 hover:underline decoration-2 underline-offset-4" 
                            onClick={() => navigate("/signin")}
                        >
                            Sign In
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SignUp