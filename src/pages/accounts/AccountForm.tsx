// import { useState, useEffect } from 'react';
// import {
//     Box,
//     Button,
//     FormControl,
//     FormLabel,
//     Input,
//     Select,
//     VStack,
//     useToast,
//     FormErrorMessage,
//     Grid,
//     GridItem,
// } from '@chakra-ui/react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { accountService, partyService, Account, Agency, Company } from '../../services/api';

// interface AccountFormProps {
//     mode: 'create' | 'edit';
// }

// export default function AccountForm({ mode }: AccountFormProps) {
//     const { id } = useParams<{ id: string }>();
//     const navigate = useNavigate();
//     const toast = useToast();

//     const [formData, setFormData] = useState<Account>({
//         _id: '',
//         act_id: '',
//         uname: '',
//         email: '',
//         role: '',
//         agency: '',
//         company: '',
//         location: '',
//         status: 'active',
//         created_at: '',
//         updated_at: '',
//         password: '', // Only for create mode
//     });

//     const [errors, setErrors] = useState<Record<string, string>>({});
//     const [isLoading, setIsLoading] = useState(false);
//     const [agencies, setAgencies] = useState<Agency[]>([]);
//     const [companies, setCompanies] = useState<Company[]>([]);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 // Fetch agencies and companies
//                 const agenciesResponse = await partyService.getAgencies();
//                 const companiesResponse = await partyService.getCompanies();
                
//                 setAgencies(agenciesResponse.data || []);
//                 setCompanies(companiesResponse.data || []);

//                 // If editing, fetch account data
//                 if (mode === 'edit' && id) {
//                     const accountResponse = await accountService.getAccountById(id);
//                     const account = accountResponse.data;
//                     // Set form data but keep password empty for edit mode
//                     setFormData({ 
//                         ...account, 
//                         password: '' // Always empty for edit mode
//                     });
//                 }
//             } catch (error) {
//                 console.error('Error fetching data:', error);
//                 toast({
//                     title: 'Error',
//                     description: mode === 'edit' ? 'Failed to fetch account details' : 'Failed to load form data',
//                     status: 'error',
//                     duration: 5000,
//                     isClosable: true,
//                 });
//                 if (mode === 'edit') {
//                     navigate('/accounts');
//                 }
//             }
//         };

//         fetchData();
//     }, [mode, id, navigate, toast]);

//     const validateForm = () => {
//         const newErrors: Record<string, string> = {};

//         if (!formData.uname?.trim()) newErrors.uname = 'Username is required';
//         if (!formData.email?.trim()) newErrors.email = 'Email is required';
//         if (!formData.role) newErrors.role = 'Role is required';
        
//         // Email validation
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (formData.email && !emailRegex.test(formData.email)) {
//             newErrors.email = 'Please enter a valid email address';
//         }

//         if (mode === 'create' && !formData.password?.trim()) {
//             newErrors.password = 'Password is required';
//         }

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();

//         if (!validateForm()) return;

//         setIsLoading(true);
//         try {
//             let submitData = { ...formData };
            
//             // For edit mode, don't send password if it's empty
//             if (mode === 'edit' && !submitData.password?.trim()) {
//                 const { password, ...dataWithoutPassword } = submitData;
//                 submitData = dataWithoutPassword as Account;
//             }

//             if (mode === 'create') {
//                 const response = await accountService.createAccount(submitData);
//                 if (response.success) {
//                     toast({
//                         title: 'Success',
//                         description: 'Account created successfully',
//                         status: 'success',
//                         duration: 3000,
//                         isClosable: true,
//                     });
//                 }
//             } else {
//                 if (!id) {
//                     throw new Error('Account ID is required for update');
//                 }
//                 const response = await accountService.updateAccount(id, submitData);
//                 if (response.success) {
//                     toast({
//                         title: 'Success',
//                         description: 'Account updated successfully',
//                         status: 'success',
//                         duration: 3000,
//                         isClosable: true,
//                     });
//                 }
//             }
//             navigate('/accounts');
//         } catch (error) {
//             console.error(`Error ${mode}ing account:`, error);
//             toast({
//                 title: 'Error',
//                 description: `Failed to ${mode} account: ${error instanceof Error ? error.message : 'Unknown error'}`,
//                 status: 'error',
//                 duration: 5000,
//                 isClosable: true,
//             });
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//         // Clear error when user starts typing
//         if (errors[name]) {
//             setErrors(prev => ({ ...prev, [name]: '' }));
//         }
//     };

//     return (
//         <Box p={5}>
//             <form onSubmit={handleSubmit}>
//                 <VStack spacing={4} align="stretch">
//                     <Grid templateColumns="repeat(2, 1fr)" gap={6}>
//                         <GridItem>
//                             <FormControl isInvalid={!!errors.uname}>
//                                 <FormLabel>Username</FormLabel>
//                                 <Input
//                                     name="uname"
//                                     value={formData.uname || ''}
//                                     onChange={handleChange}
//                                     placeholder="Enter username"
//                                 />
//                                 <FormErrorMessage>{errors.uname}</FormErrorMessage>
//                             </FormControl>
//                         </GridItem>

//                         <GridItem>
//                             <FormControl isInvalid={!!errors.email}>
//                                 <FormLabel>Email</FormLabel>
//                                 <Input
//                                     name="email"
//                                     type="email"
//                                     value={formData.email || ''}
//                                     onChange={handleChange}
//                                     placeholder="Enter email"
//                                 />
//                                 <FormErrorMessage>{errors.email}</FormErrorMessage>
//                             </FormControl>
//                         </GridItem>

//                         {mode === 'create' && (
//                             <GridItem>
//                                 <FormControl isInvalid={!!errors.password}>
//                                     <FormLabel>Password</FormLabel>
//                                     <Input
//                                         name="password"
//                                         type="password"
//                                         value={formData.password || ''}
//                                         onChange={handleChange}
//                                         placeholder="Enter password"
//                                     />
//                                     <FormErrorMessage>{errors.password}</FormErrorMessage>
//                                 </FormControl>
//                             </GridItem>
//                         )}

//                         <GridItem>
//                             <FormControl isInvalid={!!errors.role}>
//                                 <FormLabel>Role</FormLabel>
//                                 <Select
//                                     name="role"
//                                     value={formData.role || ''}
//                                     onChange={handleChange}
//                                     placeholder="Select role"
//                                 >
//                                     <option value="admin">Admin</option>
//                                     <option value="user">User</option>
//                                     <option value="agency">Agency</option>
//                                     <option value="company">Company</option>
//                                 </Select>
//                                 <FormErrorMessage>{errors.role}</FormErrorMessage>
//                             </FormControl>
//                         </GridItem>

//                         <GridItem>
//                             <FormControl>
//                                 <FormLabel>Agency</FormLabel>
//                                 <Select
//                                     name="agency"
//                                     value={formData.agency || ''}
//                                     onChange={handleChange}
//                                     placeholder="Select agency (optional)"
//                                 >
//                                     {agencies.map((agency) => (
//                                         <option key={agency._id || agency.id} value={agency._id || agency.id}>
//                                             {agency.name}
//                                         </option>
//                                     ))}
//                                 </Select>
//                             </FormControl>
//                         </GridItem>

//                         <GridItem>
//                             <FormControl>
//                                 <FormLabel>Company</FormLabel>
//                                 <Select
//                                     name="company"
//                                     value={formData.company || ''}
//                                     onChange={handleChange}
//                                     placeholder="Select company (optional)"
//                                 >
//                                     {companies.map((company) => (
//                                         <option key={company._id || company.id} value={company._id || company.id}>
//                                             {company.name}
//                                         </option>
//                                     ))}
//                                 </Select>
//                             </FormControl>
//                         </GridItem>

//                         <GridItem>
//                             <FormControl>
//                                 <FormLabel>Location</FormLabel>
//                                 <Input
//                                     name="location"
//                                     value={formData.location || ''}
//                                     onChange={handleChange}
//                                     placeholder="Enter location (optional)"
//                                 />
//                             </FormControl>
//                         </GridItem>

//                         <GridItem>
//                             <FormControl>
//                                 <FormLabel>Status</FormLabel>
//                                 <Select
//                                     name="status"
//                                     value={formData.status || 'active'}
//                                     onChange={handleChange}
//                                 >
//                                     <option value="active">Active</option>
//                                     <option value="inactive">Inactive</option>
//                                     <option value="pending">Pending</option>
//                                 </Select>
//                             </FormControl>
//                         </GridItem>
//                     </Grid>

//                     <Box display="flex" gap={4} mt={6}>
//                         <Button
//                             colorScheme="blue"
//                             type="submit"
//                             isLoading={isLoading}
//                             loadingText={mode === 'create' ? 'Creating...' : 'Updating...'}
//                         >
//                             {mode === 'create' ? 'Create Account' : 'Update Account'}
//                         </Button>
//                         <Button 
//                             onClick={() => navigate('/accounts')}
//                             isDisabled={isLoading}
//                         >
//                             Cancel
//                         </Button>
//                     </Box>
//                 </VStack>
//             </form>
//         </Box>
//     );
// }