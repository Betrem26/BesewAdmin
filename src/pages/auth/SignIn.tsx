import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "../../store/features/userSlice";
import besewLogo from "../../assets/besew-logo.jpg";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Container = styled.div`
  min-height: 100vh;
  background: #f4f7f9;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const FormWrapper = styled.div`
  background: #fff;
  border: 1px solid #e1e4e8;
  border-radius: 8px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`;

const LogoWrapper = styled.div`
  margin-bottom: 24px;
  text-align: center;
  cursor: pointer;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #1a1f36;
  margin-bottom: 8px;
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #4f566b;
  margin-bottom: 32px;
  text-align: center;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
  position: relative;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  display: block;
  color: #1a1f36;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  font-size: 16px;
  background-color: #fff;
  transition: all 0.2s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }

  &::placeholder {
    color: #8c959f;
  }
`;

const PasswordInputWrapper = styled.div`
  position: relative;
`;

const EyeButton = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6a737d;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  font-size: 18px;
  transition: color 0.2s;

  &:hover {
    color: #1a1f36;
  }
`;

const Button = styled.button`
  width: 100%;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 14px 0;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 12px;
  margin-bottom: 20px;
  transition: background-color 0.2s;

  &:hover {
    background: #0069d9;
  }

  &:disabled {
    background: #94c8ff;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #cf222e;
  font-size: 14px;
  margin-bottom: 16px;
  padding: 10px;
  background: #ffebe9;
  border: 1px solid rgba(207, 34, 46, 0.2);
  border-radius: 6px;
  text-align: left;
`;

const WarningMessage = styled.div`
  color: #9a6700;
  font-size: 14px;
  margin-bottom: 16px;
  background: #fff8c5;
  border: 1px solid rgba(154, 103, 0, 0.2);
  border-radius: 6px;
  padding: 10px;
`;

const SuccessMessage = styled.div`
  color: #1a7f37;
  font-size: 14px;
  margin-bottom: 16px;
  background: #dafbe1;
  border: 1px solid rgba(26, 127, 55, 0.2);
  border-radius: 6px;
  padding: 10px;
`;

const ForgotPasswordLink = styled.div`
  text-align: right;
  margin-top: -12px;
  margin-bottom: 24px;
`;

const Link = styled.span`
  color: #0969da;
  font-size: 13px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    phonenumber: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
    setWarning("");
    setSuccess("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setWarning("");
    setSuccess("");

    if (!formData.phonenumber.trim()) {
      setError("Phone number is required");
      setLoading(false);
      return;
    }

    if (!formData.password.trim()) {
      setError("Password is required");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "https://account.besewonline.com/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phonenumber: formData.phonenumber,
            password: formData.password,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();

        if (errorData.message && errorData.message.includes('pending_otp')) {
          setWarning("Your account requires OTP verification. Please verify your account first.");
          setLoading(false);

          setTimeout(() => {
            navigate("/verify-otp", {
              state: {
                phonenumber: formData.phonenumber,
                requiresVerification: true
              }
            });
          }, 2000);
          return;
        }

        setError(errorData.message || "Invalid phone number or password.");
        setLoading(false);
        return;
      }

      const data = await response.json();

      // Check if account requires OTP verification (but allow admin bypass)
      if (data.user && (data.user.status === 'pending_otp' || data.user.status === 'pending_verification')) {
        // Allow admin accounts to bypass OTP verification
        if (data.user.role === 'admin') {
          console.log('Admin account detected - bypassing OTP verification');
          setWarning("Admin account detected. Proceeding to dashboard...");
          
          // Dispatch tokens and user data for admin
          dispatch(setToken(data.access_token));
          dispatch(setUser(data.user));

          if (data.refresh_token) {
            localStorage.setItem('refreshToken', data.refresh_token);
          }

          setTimeout(() => {
            navigate("/dashboard");
          }, 1000);
          setLoading(false);
          return;
        }
        
        // For non-admin accounts, require OTP verification
        setWarning("Your account requires verification. Redirecting to verification page...");
        setTimeout(() => {
          navigate("/verify-otp", {
            state: {
              phonenumber: formData.phonenumber,
              userId: data.user._id,
              requiresVerification: true
            }
          });
        }, 2000);
        setLoading(false);
        return;
      }

      dispatch(setToken(data.access_token));
      dispatch(setUser(data.user));

      if (data.refresh_token) {
        localStorage.setItem('refreshToken', data.refresh_token);
      }

      setSuccess("Login successful! Redirecting to dashboard...");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      console.error('Login error:', error);
      setError("An error occurred while signing in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <FormWrapper>
        <LogoWrapper onClick={() => navigate("/")}>
          <img src={besewLogo} alt="BESEW logo" style={{ height: 48 }} />
        </LogoWrapper>
        <Title>Sign In</Title>
        <Subtitle>Administrative Portal Access</Subtitle>

        <form onSubmit={handleSignIn}>
          <InputGroup>
            <Label htmlFor="phonenumber">Phone Number</Label>
            <Input
              id="phonenumber"
              name="phonenumber"
              type="tel"
              placeholder="Enter your phone number"
              autoComplete="tel"
              value={formData.phonenumber}
              onChange={handleInputChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="password">Password</Label>
            <PasswordInputWrapper>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <EyeButton
                type="button"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </EyeButton>
            </PasswordInputWrapper>
          </InputGroup>

          <ForgotPasswordLink>
            <Link onClick={() => navigate("/forgot-password")}>
              Forgot password?
            </Link>
          </ForgotPasswordLink>

          {success && <SuccessMessage>{success}</SuccessMessage>}
          {warning && <WarningMessage>{warning}</WarningMessage>}
          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Button type="submit" disabled={loading}>
            {loading ? "Signing In..." : "Sign In to Admin"}
          </Button>
        </form>
      </FormWrapper>
    </Container>
  );
};

export default SignIn;
