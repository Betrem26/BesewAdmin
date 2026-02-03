// import React, { useState } from 'react';
// import styled from 'styled-components';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { setToken, setUser } from '../../store/features/userSlice';
// import besewLogo from '../../assets/besew-logo.jpg';

// const Container = styled.div`
//   min-height: 100vh;
//   background: #fff;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
// `;

// const FormWrapper = styled.div`
//   background: #fff;
//   border: 1px solid #ddd;
//   border-radius: 6px;
//   padding: 32px 28px;
//   width: 350px;
//   box-shadow: 0 2px 8px rgba(0,0,0,0.05);
// `;

// const Logo = styled.h1`
//   font-family: Arial, sans-serif;
//   font-size: 32px;
//   font-weight: bold;
//   color: #232f3e;
//   text-align: center;
//   margin-bottom: 16px;
//   cursor: pointer;
// `;

// const Title = styled.h2`
//   font-size: 24px;
//   font-weight: 500;
//   margin-bottom: 16px;
// `;

// const Input = styled.input`
//   width: 100%;
//   padding: 10px;
//   margin-bottom: 16px;
//   border: 1px solid #ddd;
//   border-radius: 4px;
//   font-size: 16px;
//   transition: border-color 0.2s;

//   &:focus {
//     outline: none;
//     border-color: #007bff;
//     box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
//   }
// `;

// const Select = styled.select`
//   width: 100%;
//   padding: 10px;
//   margin-bottom: 16px;
//   border: 1px solid #ddd;
//   border-radius: 4px;
//   font-size: 16px;
//   transition: border-color 0.2s;

//   &:focus {
//     outline: none;
//     border-color: #007bff;
//     box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
//   }
// `;

// const Button = styled.button`
//   width: 100%;
//   background: #007bff;
//   color: #fff;
//   border: none;
//   border-radius: 4px;
//   padding: 12px 0;
//   font-size: 16px;
//   font-weight: 500;
//   cursor: pointer;
//   margin-bottom: 16px;
//   transition: background-color 0.2s;

//   &:hover {
//     background: #0056b3;
//   }

//   &:disabled {
//     background: #ccc;
//     cursor: not-allowed;
//   }
// `;

// const Label = styled.label`
//   font-size: 14px;
//   margin-bottom: 4px;
//   display: block;
//   color: #232f3e;
// `;

// const ErrorMessage = styled.div`
//   color: #dc3545;
//   font-size: 14px;
//   margin-bottom: 16px;
//   text-align: center;
// `;

// const SuccessMessage = styled.div`
//   color: #28a745;
//   font-size: 14px;
//   margin-bottom: 16px;
//   text-align: center;
// `;

// const SignUp: React.FC = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [formData, setFormData] = useState({
//     profile_name: '',
//     phonenumber: '',
//     party_type: 'user',
//     password: ''
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//     setError('');
//     setSuccess('');
//   };

//   const handleSignUp = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     setSuccess('');

//     // Basic validation
//     if (!formData.profile_name.trim()) {
//       setError('Full name is required');
//       setLoading(false);
//       return;
//     }

//     if (!formData.phonenumber.trim()) {
//       setError('Phone number is required');
//       setLoading(false);
//       return;
//     }

//     if (!formData.password.trim()) {
//       setError('Password is required');
//       setLoading(false);
//       return;
//     }

//     try {
//       // Store signup data in localStorage for signin validation
//       const signupData = {
//         profile_name: formData.profile_name,
//         phonenumber: formData.phonenumber,
//         password: formData.password,
//         party_type: formData.party_type,
//         timestamp: new Date().toISOString()
//       };
      
//       localStorage.setItem('signupData', JSON.stringify(signupData));

//       // Simulate API call or make actual call
//       const response = await fetch('https://account.besewonline.com/accounts', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           profile_name: formData.profile_name,
//           phonenumber: formData.phonenumber,
//           party_type: formData.party_type,
//           password: formData.password
//         })
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setSuccess(`Account created successfully! Please sign in with the same phone number and password.`);
        
//         // Redirect to signin after 3 seconds
//         setTimeout(() => {
//           navigate('/signin');
//         }, 3000);
//       } else {
//         // Even if API fails, we still store locally for signin validation
//         setSuccess(`Account created locally! Please sign in with the same phone number and password.`);
//         setTimeout(() => {
//           navigate('/signin');
//         }, 3000);
//       }
//     } catch (error) {
//       console.error('Registration error:', error);
//       // Store locally even if network fails
//       setSuccess(`Account created locally! Please sign in with the same phone number and password.`);
//       setTimeout(() => {
//         navigate('/signin');
//       }, 3000);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Container>
//       <Logo>
//         <img src={besewLogo} alt="BESEW logo" style={{ height: 40 }} />
//       </Logo>
//       <FormWrapper>
//         <Title>Create Account</Title>
//         <form onSubmit={handleSignUp}>
//           <Label htmlFor="fullname">Full Name *</Label>
//           <Input
//             id="fullname"
//             name="profile_name"
//             type="text"
//             placeholder="Enter your full name"
//             autoComplete="name"
//             value={formData.profile_name}
//             onChange={handleInputChange}
//             required
//           />

//           <Label htmlFor="phone">Phone Number *</Label>
//           <Input
//             id="phone"
//             name="phonenumber"
//             type="tel"
//             placeholder="Enter phone number"
//             autoComplete="tel"
//             value={formData.phonenumber}
//             onChange={handleInputChange}
//             required
//           />

//           <Label htmlFor="password">Password *</Label>
//           <Input
//             id="password"
//             name="password"
//             type="password"
//             placeholder="Enter your password"
//             autoComplete="new-password"
//             value={formData.password}
//             onChange={handleInputChange}
//             required
//           />

//           <Label htmlFor="party_type">Account Type *</Label>
//           <Select
//             id="party_type"
//             name="party_type"
//             value={formData.party_type}
//             onChange={handleInputChange}
//             required
//           >
//             <option value="user">Regular User</option>
//             <option value="agency">Agency</option>
//             <option value="admin">Administrator</option>
//           </Select>

//           {error && <ErrorMessage>{error}</ErrorMessage>}
//           {success && <SuccessMessage>{success}</SuccessMessage>}
          
//           <Button type="submit" disabled={loading}>
//             {loading ? 'Creating Account...' : 'Create Account'}
//           </Button>
//         </form>
//       </FormWrapper>
//     </Container>
//   );
// };

// export default SignUp;