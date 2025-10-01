import { motion } from 'motion/react';
import { useState } from 'react';
import { Button, Input } from './ui/all-components';

const documentsImageUrl = 'https://i.pinimg.com/1200x/c8/88/65/c88865a0346f9c09a87defe3a56b3ccf.jpg';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [signupData, setSignupData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login/signup
    setTimeout(() => {
      onLoginSuccess();
    }, 500);
  };

  const handleLoginChange = (field: string, value: string) => {
    setLoginData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignupChange = (field: string, value: string) => {
    setSignupData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="h-screen w-full flex overflow-hidden bg-white">
      {/* Left side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          {/* Logo/Icon */}
          <div className="mb-6">
            <div className="text-2xl mb-3">🏠</div>
            <h1 className="text-2xl text-black mb-2">
              {isLogin ? 'Welcome back' : 'Welcome'}
            </h1>
            <p className="text-sm text-black/60">
              {isLogin ? 'Please enter your details.' : 'Create your account.'}
            </p>
          </div>

          {/* Toggle between Login and Signup */}
          <div className="flex mb-6 border-b border-black/10">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 pb-2 transition-all text-sm ${
                isLogin
                  ? 'text-black border-b-2 border-black'
                  : 'text-black/40 hover:text-black/60'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 pb-2 transition-all text-sm ${
                !isLogin
                  ? 'text-black border-b-2 border-black'
                  : 'text-black/40 hover:text-black/60'
              }`}
            >
              Sign up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs text-black mb-1">Username</label>
                <Input
                  type="text"
                  placeholder="Your username"
                  value={signupData.username}
                  onChange={(e) => handleSignupChange('username', e.target.value)}
                  className="w-full h-10 border-black/20 bg-white placeholder:text-black/40 text-sm text-black rounded-lg"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-xs text-black mb-1">Email</label>
              <Input
                type="email"
                placeholder="Your email"
                value={isLogin ? loginData.email : signupData.email}
                onChange={(e) =>
                  isLogin
                    ? handleLoginChange('email', e.target.value)
                    : handleSignupChange('email', e.target.value)
                }
                className="w-full h-10 border-black/20 bg-white placeholder:text-black/40 text-sm text-black rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-black mb-1">Password</label>
              <Input
                type="password"
                placeholder="Your password"
                value={isLogin ? loginData.password : signupData.password}
                onChange={(e) =>
                  isLogin
                    ? handleLoginChange('password', e.target.value)
                    : handleSignupChange('password', e.target.value)
                }
                className="w-full h-10 border-black/20 bg-white placeholder:text-black/40 text-sm text-black rounded-lg"
                required
              />
            </div>

            {isLogin && (
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center text-black/60">
                  <input type="checkbox" className="mr-2" />
                  Remember for 30 days
                </label>
                <button type="button" className="text-black/60 hover:text-black">
                  Forgot password?
                </button>
              </div>
            )}

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full h-10 bg-black text-white hover:bg-black/90 transition-all rounded-lg text-sm"
              >
                {isLogin ? 'Login' : 'Sign up'}
              </Button>
            </div>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-black/10"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4 bg-white text-black/40">OR</span>
              </div>
            </div>

            {/* Social login buttons */}
            <div className="flex gap-2 justify-center">
              <button
                type="button"
                className="w-10 h-10 rounded-full border border-black/10 hover:border-black/30 transition-all flex items-center justify-center"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
              </button>
              <button
                type="button"
                className="w-10 h-10 rounded-full border border-black/10 hover:border-black/30 transition-all flex items-center justify-center"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </button>
              <button
                type="button"
                className="w-10 h-10 rounded-full border border-black/10 hover:border-black/30 transition-all flex items-center justify-center"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Right side - Image */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="hidden md:block w-1/2 relative overflow-hidden h-screen"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${documentsImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        {/* Subtle overlay to ensure image doesn't clash with overall design */}
        <div className="absolute inset-0 bg-black/5"></div>
      </motion.div>
    </div>
  );
}
