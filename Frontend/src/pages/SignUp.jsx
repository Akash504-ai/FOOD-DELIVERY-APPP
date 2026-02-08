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

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 bg-gradient-to-br from-[#fff9f6] to-[#fff1ed]">
            {/* Background Decorative Blobs */}
            <div className="fixed top-[-10%] left-[-10%] w-96 h-96 bg-orange-100 rounded-full blur-[120px] opacity-60 pointer-events-none" />
            <div className="fixed bottom-[-10%] right-[-10%] w-96 h-96 bg-red-100 rounded-full blur-[120px] opacity-60 pointer-events-none" />

            <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(255,77,45,0.1)] w-full max-w-lg p-10 border border-white z-10 relative overflow-hidden">
                
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black mb-2 tracking-tight" style={{ color: primaryColor }}>
                        Vingo<span className="text-gray-800">.</span>
                    </h1>
                    <p className="text-gray-500 font-medium">Create your account to start ordering!</p>
                </div>

                <div className="space-y-5">
                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Full Name</label>
                        <div className="relative group">
                            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ff4d2d] transition-colors" />
                            <input 
                                type="text" 
                                className="w-full bg-gray-50 border-none rounded-2xl pl-11 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-[#ff4d2d]/20 transition-all font-medium text-gray-800"
                                placeholder="John Doe" 
                                onChange={(e) => setFullName(e.target.value)} 
                                value={fullName} 
                                required
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Email Address</label>
                        <div className="relative group">
                            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ff4d2d] transition-colors" />
                            <input 
                                type="email" 
                                className="w-full bg-gray-50 border-none rounded-2xl pl-11 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-[#ff4d2d]/20 transition-all font-medium text-gray-800"
                                placeholder="name@example.com" 
                                onChange={(e) => setEmail(e.target.value)} 
                                value={email} 
                                required
                            />
                        </div>
                    </div>

                    {/* Mobile */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Mobile Number</label>
                        <div className="relative group">
                            <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ff4d2d] transition-colors" />
                            <input 
                                type="tel" 
                                className="w-full bg-gray-50 border-none rounded-2xl pl-11 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-[#ff4d2d]/20 transition-all font-medium text-gray-800"
                                placeholder="+91 XXXXX XXXXX" 
                                onChange={(e) => setMobile(e.target.value)} 
                                value={mobile} 
                                required
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Password</label>
                        <div className="relative group">
                            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ff4d2d] transition-colors" />
                            <input 
                                type={showPassword ? "text" : "password"} 
                                className="w-full bg-gray-50 border-none rounded-2xl pl-11 pr-12 py-3.5 outline-none focus:ring-2 focus:ring-[#ff4d2d]/20 transition-all font-medium text-gray-800"
                                placeholder="Min. 8 characters" 
                                onChange={(e) => setPassword(e.target.value)} 
                                value={password} 
                                required
                            />
                            <button 
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#ff4d2d] transition-colors" 
                                onClick={() => setShowPassword(prev => !prev)}
                            >
                                {!showPassword ? <FaRegEye size={18} /> : <FaRegEyeSlash size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Role Selector */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3 ml-1">Join as a</label>
                        <div className="flex p-1 bg-gray-100 rounded-2xl gap-1">
                            {["user", "owner", "deliveryBoy"].map((r) => (
                                <button
                                    key={r}
                                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold capitalize transition-all duration-300 ${
                                        role === r 
                                        ? "bg-white text-[#ff4d2d] shadow-sm" 
                                        : "text-gray-500 hover:text-gray-700"
                                    }`}
                                    onClick={() => setRole(r)}
                                >
                                    {r === 'deliveryBoy' ? 'Courier' : r}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button 
                        className="w-full bg-[#ff4d2d] text-white font-black py-4 rounded-2xl shadow-lg shadow-orange-200 hover:bg-[#e64323] transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center" 
                        onClick={handleSignUp} 
                        disabled={loading}
                    >
                        {loading ? <ClipLoader size={20} color='white'/> : "Create Account"}
                    </button>

                    {err && (
                        <div className="bg-red-50 border border-red-100 p-3 rounded-xl">
                            <p className="text-red-500 text-center text-xs font-bold">*{err}</p>
                        </div>
                    )}

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-100"></span>
                        </div>
                        <span className="relative bg-white/0 px-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center block mx-auto w-fit">OR</span>
                    </div>

                    <button 
                        className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-100 rounded-2xl px-4 py-3.5 font-bold text-gray-700 hover:bg-gray-50 transition-all active:scale-[0.98]" 
                        onClick={handleGoogleAuth}
                    >
                        <FcGoogle size={22} />
                        <span>Sign up with Google</span>
                    </button>

                    <p className="text-center mt-8 text-gray-500 font-medium">
                        Already have an account? 
                        <span 
                            className="text-[#ff4d2d] font-bold ml-2 cursor-pointer hover:underline decoration-2 underline-offset-4" 
                            onClick={() => navigate("/signin")}
                        >
                            Sign In
                        </span>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SignUp