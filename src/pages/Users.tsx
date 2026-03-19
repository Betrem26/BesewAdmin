//////
import type React from "react";

import { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Avatar,
  IconButton,
  Menu,
  MenuList,
  MenuItem as MuiMenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import {
  Search,
  MoreVert,
  Visibility,
  Edit,
  Delete,
  People,
  PersonAdd,
  Business,
  LocationOn,
  Phone,
  Email,
  CheckCircle,
} from "@mui/icons-material";
import Sidebar from "../common/Sidebar";
import Header from "../common/Header";
import { rolesApi, Role as RBACRole } from "../services/rolesApi";
import { accountApi, partyApi } from "../services/api";

interface User {
  _id: string;
  party_id?: string;
  act_id?: string;
  name: string;
  last_name?: string;
  uname?: string;
  email?: string;
  phone_number: string;
  sex: string;
  role: string;
  agency?: string;
  company: string;
  location: string;
  status: "Active" | "Inactive" | "Suspended" | "Pending OTP";
  auth_verified: boolean;
  created_at?: string;
  last_login?: string;
}

interface UserStats {
  total: number;
  active: number;
  verified: number;
  companies: number;
}

interface NewUserFormData {
  uname: string;
  email: string;
  phone: string; // This will be renamed to phonenumber in API call
  password: string;
  role: string;
  company: string;
  location: string;
  agency?: string;
  status: string;
  verified: boolean;
  // Add missing required fields
  party_type: string;
  profile_name: string;
}

const formatPhoneNumber = (value: string): string => {
  if (!value) return "N/A";
  // Remove all non-digit characters except +
  const cleaned = value.replace(/[^\d+]/g, "");

  // Ensure it starts with +
  if (cleaned && !cleaned.startsWith("+")) {
    return "+" + cleaned;
  }

  return cleaned;
};

function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openSidebar, setOpenSidebar] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [stats, setStats] = useState<UserStats>({
    total: 0,
    active: 0,
    verified: 0,
    companies: 0,
  });
  const [availableRoles, setAvailableRoles] = useState<RBACRole[]>([]);

  // Add User Dialog States
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [addUserLoading, setAddUserLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info"
  >("success");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [newUserData, setNewUserData] = useState<NewUserFormData>({
    uname: "",
    email: "",
    phone: "",
    password: "",
    role: "user",
    company: "",
    location: "",
    agency: "",
    status: "active",
    verified: false,
    party_type: "individual", // Add default value
    profile_name: "", // Add required field
  });

  // Fetch users data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("🔄 Fetching users data...");

        // Fetch accounts, party profiles and roles
        const [accountsResponse, partyResponse, rolesData] = await Promise.all([
          accountApi.get("/accounts"),
          partyApi.get("/party-profiles"),
          rolesApi.getAllRoles(false)
        ]);

        const accountsData = accountsResponse.data;
        const partyData = partyResponse.data;
        setAvailableRoles(rolesData);

        // Combine and normalize data
        const combinedUsers: User[] = [];

        // ... normalization logic remains similar ...
        if (Array.isArray(accountsData)) {
          accountsData.forEach((account: any) => {
            combinedUsers.push({
              _id: account._id || account.id,
              act_id: account.act_id,
              party_id: account.party_id,
              name: account.uname || account.name || "Unknown",
              last_name: account.last_name || "",
              uname: account.uname,
              email: account.email || "",
              phone_number: account.phone || account.phone_number || "N/A",
              sex: account.gender || account.sex || "N/A",
              role: account.role || "User",
              agency: account.agency || "N/A",
              company: account.company || "N/A",
              location: account.location || "N/A",
              status:
                account.status === "active" || account.status === "Active"
                  ? "Active"
                  : account.status === "suspended" || account.status === "Suspended"
                    ? "Suspended"
                    : account.status === "pending_otp"
                      ? "Pending OTP"
                      : "Inactive",
              auth_verified: account.verified || account.auth_verified || false,
              created_at: account.created_at,
              last_login: account.last_login,
            });
          });
        }

        if (Array.isArray(partyData)) {
          partyData.forEach((party: any) => {
            const existingUser = combinedUsers.find(
              (user) =>
                user.party_id === party.party_id ||
                user.phone_number === party.phone_number
            );

            if (!existingUser) {
              combinedUsers.push({
                _id: party._id,
                party_id: party.party_id,
                name: party.name || "Unknown",
                last_name: party.last_name || "",
                email: party.email || "",
                phone_number: party.phone_number || "N/A",
                sex: party.sex || "N/A",
                role: party.role || "User",
                company: party.company || "N/A",
                location: party.location || "N/A",
                status: party.status === "Active" ? "Active" : "Inactive",
                auth_verified: party.auth_verfied || false,
                created_at: party.created_at,
              });
            } else {
              existingUser.name = party.name || existingUser.name;
              existingUser.last_name = party.last_name || existingUser.last_name;
              existingUser.email = party.email || existingUser.email;
              existingUser.auth_verified = party.auth_verfied || existingUser.auth_verified;
            }
          });
        }

        setUsers(combinedUsers);
        setFilteredUsers(combinedUsers);

        // Calculate stats
        const uniqueCompanies = new Set(
          combinedUsers.map((user) => user.company).filter((c) => c !== "N/A")
        );
        setStats({
          total: combinedUsers.length,
          active: combinedUsers.filter((user) => user.status === "Active").length,
          verified: combinedUsers.filter((user) => user.auth_verified).length,
          companies: uniqueCompanies.size,
        });

      } catch (error) {
        console.error("❌ Error fetching data:", error);
        setSnackbarMessage("Failed to load users data");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter users based on search and filters
  useEffect(() => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone_number.includes(searchTerm) ||
          user.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (user) => user.status.toLowerCase() === statusFilter
      );
    }

    // Role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter(
        (user) => user.role.toLowerCase() === roleFilter
      );
    }

    setFilteredUsers(filtered);
    setPage(0);
  }, [searchTerm, statusFilter, roleFilter, users]);

  // Validate form data
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!newUserData.uname.trim()) {
      errors.uname = "Username is required";
    }

    if (!newUserData.profile_name.trim()) {
      errors.profile_name = "Profile name is required";
    }

    if (!newUserData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUserData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Replace the existing phone validation with:
    if (!newUserData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else {
      // Remove any spaces and validate E.164 format
      const cleanPhone = newUserData.phone.replace(/\s+/g, "");
      if (!/^\+[1-9]\d{1,14}$/.test(cleanPhone)) {
        errors.phone =
          "Phone number must be in E.164 format (e.g., +251946450835)";
      }
    }

    if (!newUserData.password.trim()) {
      errors.password = "Password is required";
    } else if (newUserData.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }

    if (!newUserData.party_type) {
      errors.party_type = "Party type is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // const retryRequest = async (fn: () => Promise<any>, maxRetries = 2): Promise<any> => {
  //   for (let i = 0; i <= maxRetries; i++) {
  //     try {
  //       return await fn()
  //     } catch (error) {
  //       if (i === maxRetries) throw error
  //       console.log(`Retry attempt ${i + 1}/${maxRetries}`)
  //       await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)))
  //     }
  //   }
  // }

  // Add new user function
  const handleAddUser = async () => {
    console.log("🚀 Starting user creation process...");

    if (!validateForm()) {
      console.log("❌ Form validation failed:", formErrors);
      setSnackbarMessage("Please fix the form errors before submitting");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    setAddUserLoading(true);

    // Replace the existing apiPayload with:
    const apiPayload = {
      uname: newUserData.uname.trim(),
      email: newUserData.email.trim(),
      phonenumber: newUserData.phone.replace(/\s+/g, ""), // Remove spaces and use 'phonenumber'
      password: newUserData.password,
      role: newUserData.role,
      company: newUserData.company.trim() || undefined,
      location: newUserData.location.trim() || undefined,
      agency: newUserData.agency?.trim() || undefined,
      status: newUserData.status,
      verified: newUserData.verified,
      party_type: newUserData.party_type,
      profile_name: newUserData.profile_name.trim(),
    };

    // Remove any undefined fields to avoid API issues
    Object.keys(apiPayload).forEach((key) => {
      if (apiPayload[key] === undefined) {
        delete apiPayload[key];
      }
    });

    console.log("📋 API payload being sent:", apiPayload);

    try {
      console.log("📤 Sending request to create new user...");
      console.log("📋 User data being sent:", newUserData);

      const response = await accountApi.post("/api/accounts", apiPayload);
      const responseData = response.data;
      console.log("📡 API Response Data:", responseData);

      console.log("✅ User created successfully!");
      console.log("🎉 New user data:", responseData);

      // Create new user object for local state
      const newUser: User = {
        _id: responseData._id || responseData.id || `temp_${Date.now()}`,
        party_id: responseData.party_id,
        act_id: responseData.act_id,
        name: newUserData.uname,
        last_name: "",
        uname: newUserData.uname,
        email: newUserData.email,
        phone_number: newUserData.phone,
        sex: "N/A",
        role: newUserData.role,
        company: newUserData.company,
        location: newUserData.location,
        agency: newUserData.agency || "N/A",
        status: newUserData.status === "active" ? "Active" : "Inactive",
        auth_verified: newUserData.verified,
        created_at: new Date().toISOString(),
      };

      // Update local state
      setUsers((prev) => [newUser, ...prev]);

      // Update stats
      setStats((prev) => ({
        ...prev,
        total: prev.total + 1,
        active: newUserData.status === "active" ? prev.active + 1 : prev.active,
        verified: newUserData.verified ? prev.verified + 1 : prev.verified,
      }));

      // Reset form
      setNewUserData({
        uname: "",
        email: "",
        phone: "",
        password: "",
        role: "user",
        company: "",
        location: "",
        agency: "",
        status: "active",
        verified: false,
        party_type: "individual",
        profile_name: "",
      });

      setFormErrors({});
      setAddUserDialogOpen(false);

      // Show success message
      setSnackbarMessage(
        `User "${newUserData.uname}" has been successfully created!`
      );
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      console.log("🎊 User creation process completed successfully!");
    } catch (error: any) {
      console.error("❌ Error creating user:", error);

      let errorMessage = error.response?.data?.message || "Failed to create user";
      const status = error.response?.status || error.status;

      if (status === 400) {
        errorMessage = "Invalid user data provided";
      } else if (status === 409) {
        errorMessage = "User with this email or username already exists";
      } else if (status === 422) {
        errorMessage = "Please check all required fields are filled correctly";
      } else if (status >= 500) {
        errorMessage = "Server error - please try again later";
      }

      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setAddUserLoading(false);
      console.log("🏁 User creation process finished");
    }
  };

  // Delete user function - UPDATED with correct API endpoint
  const handleDeleteUser = async (userId: string) => {
    try {
      console.log("🗑️ Starting user deletion process for ID:", userId);
      setAddUserLoading(true); // Show loading state

      const selectedUserData = selectedUser;
      if (!selectedUserData) {
        throw new Error("No user selected for deletion");
      }

      console.log(
        "👤 Deleting user:",
        selectedUserData.name,
        selectedUserData.email
      );
      console.log("🔍 Available IDs:", {
        user_id: selectedUserData._id,
        party_id: selectedUserData.party_id,
        act_id: selectedUserData.act_id,
      });

      // Try different deletion strategies based on available IDs
      let deleteUrl = "";
      let deleteId = "";

      if (selectedUserData.party_id) {
        // Primary: Use party_id with accounts endpoint
        deleteId = selectedUserData.party_id;
        deleteUrl = `https://account.besewonline.com/accounts/${deleteId}`;
        console.log("📤 Using party_id for deletion:", deleteId);
      } else if (selectedUserData.act_id) {
        // Secondary: Use act_id with accounts endpoint
        deleteId = selectedUserData.act_id;
        deleteUrl = `/api/accounts/${deleteId}`;
        console.log("📤 Using act_id for deletion:", deleteId);
      } else {
        // Fallback: Use user _id with accounts endpoint
        deleteId = selectedUserData._id;
        deleteUrl = `/api/accounts/${deleteId}`;
        console.log("📤 Using user _id for deletion:", deleteId);
      }

      console.log("📤 Sending DELETE request to:", deleteUrl);

      await accountApi.delete(deleteUrl);
      console.log("✅ User deletion successful!");

      // Remove user from local state
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user._id !== userId)
        );

        // Update stats
        setStats((prev) => ({
          ...prev,
          total: prev.total - 1,
          active:
            selectedUserData.status === "Active"
              ? prev.active - 1
              : prev.active,
          verified: selectedUserData.auth_verified
            ? prev.verified - 1
            : prev.verified,
        }));

        // Close dialog and clear selection
        setDeleteDialogOpen(false);
        setSelectedUser(null);

        // Show success message
        setSnackbarMessage(
          `User "${selectedUserData.name || selectedUserData.uname
          }" has been successfully deleted!`
        );
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        console.log("🎉 User deletion process completed successfully!");
    } catch (error: any) {
      console.error("❌ Error deleting user:", error);
      console.error("❌ Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });

      setSnackbarMessage(`Failed to delete user: ${error.message}`);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setAddUserLoading(false);
      console.log("🏁 User deletion process finished");
    }
  };

  // Update user status function
  const handleUpdateStatus = async (userId: string, newStatus: string) => {
    try {
      console.log(`🔄 Updating user ${userId} status to: ${newStatus}`);
      setAddUserLoading(true);

      const response = await accountApi.put(`/api/accounts/${userId}`, { status: newStatus.toLowerCase() });
      const responseData = response.data;
      console.log("✅ Status updated successfully:", responseData);

      // Update local state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId || user.party_id === userId
            ? { ...user, status: newStatus as any }
            : user
        )
      );

      setSnackbarMessage(`User status updated to ${newStatus} successfully!`);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error: any) {
      console.error("❌ Error updating status:", error);
      setSnackbarMessage(`Failed to update status: ${error.message}`);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setAddUserLoading(false);
      handleMenuClose();
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    console.log(event);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    user: User
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };


  const getInitials = (name: string, lastName?: string) => {
    return `${name.charAt(0)}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  // In handleInputChange function, add special handling for phone:
  const handleInputChange = (
    field: keyof NewUserFormData,
    value: string | boolean
  ) => {
    if (field === "phone" && typeof value === "string") {
      value = formatPhoneNumber(value);
    }

    setNewUserData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (loading) {
    return (
      <div className="flex w-full h-screen overflow-hidden">
        {openSidebar && (
          <div className="flex-shrink-0">
            <Sidebar closeSidebar={setOpenSidebar} />
          </div>
        )}
        <div className="flex items-center justify-center flex-1">
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading users...</Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full h-screen overflow-hidden">
      {openSidebar && (
        <div className="flex-shrink-0">
          <Sidebar closeSidebar={setOpenSidebar} />
        </div>
      )}

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex-shrink-0">
          <Header />
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          {/* Header */}
          <Box className="flex items-center justify-between mb-6">
            <Box>
              <Typography variant="h4" className="font-bold text-gray-900">
                User Management
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                Manage accounts and user profiles in one place
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              className="bg-blue-600"
              onClick={() => setAddUserDialogOpen(true)}
            >
              Add New User
            </Button>
          </Box>

          {/* Stats Cards */}
          <Grid container spacing={3} className="mb-6">
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box className="flex items-center justify-between">
                    <Box>
                      <Typography variant="h4" className="font-bold">
                        {stats.total}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Total Users
                      </Typography>
                    </Box>
                    <People className="text-blue-600" />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box className="flex items-center justify-between">
                    <Box>
                      <Typography
                        variant="h4"
                        className="font-bold text-green-600"
                      >
                        {stats.active}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Active Users
                      </Typography>
                    </Box>
                    <CheckCircle className="text-green-600" />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box className="flex items-center justify-between">
                    <Box>
                      <Typography
                        variant="h4"
                        className="font-bold text-blue-600"
                      >
                        {stats.verified}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Verified Users
                      </Typography>
                    </Box>
                    <CheckCircle className="text-blue-600" />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box className="flex items-center justify-between">
                    <Box>
                      <Typography
                        variant="h4"
                        className="font-bold text-purple-600"
                      >
                        {stats.companies}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Companies
                      </Typography>
                    </Box>
                    <Business className="text-purple-600" />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Filters */}
          <Paper className="p-4 mb-4">
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Search users by name, email, phone, company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    label="Status"
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    label="Role"
                  >
                    <MenuItem value="all">All Roles</MenuItem>
                    {availableRoles.map((role) => (
                      <MenuItem key={role._id} value={role.name}>
                        {role.displayName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>

          {/* Users Table */}
          <Paper>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Contact</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Company</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Verified</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>
                          <Box className="flex items-center space-x-3">
                            <Avatar>
                              {getInitials(user.name, user.last_name)}
                            </Avatar>
                            <Box>
                              <Typography
                                variant="body2"
                                className="font-medium"
                              >
                                {user.name} {user.last_name}
                              </Typography>
                              {user.uname && (
                                <Typography
                                  variant="caption"
                                  color="textSecondary"
                                >
                                  @{user.uname}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Box>
                            {user.email && (
                              <Box className="flex items-center mb-1">
                                <Email
                                  className="w-4 h-4 mr-1"
                                  fontSize="small"
                                />
                                <Typography variant="caption">
                                  {user.email}
                                </Typography>
                              </Box>
                            )}
                            <Box className="flex items-center">
                              <Phone
                                className="w-4 h-4 mr-1"
                                fontSize="small"
                              />
                              <Typography variant="caption">
                                {user.phone_number}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={user.role}
                            variant="outlined"
                            size="small"
                          />
                        </TableCell>

                        <TableCell>
                          <Box className="flex items-center">
                            <Business
                              className="w-4 h-4 mr-1"
                              fontSize="small"
                            />
                            <Typography variant="body2">
                              {user.company}
                            </Typography>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Box className="flex items-center">
                            <LocationOn
                              className="w-4 h-4 mr-1"
                              fontSize="small"
                            />
                            <Typography variant="body2">
                              {user.location}
                            </Typography>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={user.status}
                            color={
                              user.status === "Active" ? "success" :
                                user.status === "Suspended" ? "error" :
                                  user.status === "Pending OTP" ? "warning" : "default"
                            }
                            size="small"
                          />
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={
                              user.auth_verified ? "Verified" : "Unverified"
                            }
                            color={user.auth_verified ? "primary" : "default"}
                            size="small"
                          />
                        </TableCell>

                        <TableCell align="right">
                          <IconButton onClick={(e) => handleMenuClick(e, user)}>
                            <MoreVert />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={filteredUsers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </div>
      </div>

      {/* All dialogs remain the same... */}
      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuList>
          <MuiMenuItem onClick={handleMenuClose}>
            <Visibility className="mr-2" fontSize="small" />
            View Details
          </MuiMenuItem>
          <MuiMenuItem onClick={handleMenuClose}>
            <Edit className="mr-2" fontSize="small" />
            Edit User
          </MuiMenuItem>
          {selectedUser?.status !== "Active" && (
            <MuiMenuItem onClick={() => selectedUser && handleUpdateStatus(selectedUser.party_id || selectedUser._id, "Active")}>
              <CheckCircle className="mr-2 text-green-600" fontSize="small" />
              Activate Account
            </MuiMenuItem>
          )}
          {selectedUser?.status === "Active" && (
            <MuiMenuItem onClick={() => selectedUser && handleUpdateStatus(selectedUser.party_id || selectedUser._id, "Suspended")}>
              <Box sx={{ color: 'error.main', display: 'flex', alignItems: 'center' }}>
                <Edit className="mr-2" fontSize="small" style={{ visibility: 'hidden', width: 0 }} /> {/* Spacer */}
                <Typography variant="inherit" color="error">Suspend Account</Typography>
              </Box>
            </MuiMenuItem>
          )}
          <MuiMenuItem
            onClick={() => {
              setDeleteDialogOpen(true);
              handleMenuClose();
            }}
          >
            <Delete className="mr-2" fontSize="small" />
            Delete User
          </MuiMenuItem>
        </MenuList>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete{" "}
            <strong>
              {selectedUser?.name || selectedUser?.uname || "this user"}{" "}
              {selectedUser?.last_name || ""}
            </strong>
            ? This action cannot be undone.
          </Typography>
          {selectedUser && (
            <Box sx={{ mt: 2, p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
              <Typography variant="body2" color="textSecondary">
                User Details:
              </Typography>
              <Typography variant="body2">
                • User ID: {selectedUser._id}
              </Typography>
              <Typography variant="body2">
                • Party ID: {selectedUser.party_id || "Not available"}
              </Typography>
              <Typography variant="body2">
                • Account ID: {selectedUser.act_id || "Not available"}
              </Typography>
              <Typography variant="body2">
                • Email: {selectedUser.email || "N/A"}
              </Typography>
              <Typography variant="body2">
                • Phone: {selectedUser.phone_number || "N/A"}
              </Typography>
              <Typography variant="body2">
                • Role: {selectedUser.role}
              </Typography>
            </Box>
          )}
          {!selectedUser?.party_id && !selectedUser?.act_id && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Note: This user will be deleted using their user ID since no party
              ID or account ID is available.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={addUserLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={() => selectedUser && handleDeleteUser(selectedUser._id)}
            color="error"
            variant="contained"
            disabled={addUserLoading}
            startIcon={
              addUserLoading ? <CircularProgress size={20} /> : <Delete />
            }
          >
            {addUserLoading ? "Deleting..." : "Delete User"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add User Dialog */}
      <Dialog
        open={addUserDialogOpen}
        onClose={() => setAddUserDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box className="flex items-center">
            <PersonAdd className="mr-2" />
            Add New User Account
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              {/* Username */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Username *"
                  value={newUserData.uname}
                  onChange={(e) => handleInputChange("uname", e.target.value)}
                  error={!!formErrors.uname}
                  helperText={
                    formErrors.uname || "Unique username for the account"
                  }
                  required
                />
              </Grid>

              {/* Email */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email Address *"
                  type="email"
                  value={newUserData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  error={!!formErrors.email}
                  helperText={formErrors.email || "Valid email address"}
                  required
                />
              </Grid>

              {/* Phone */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number *"
                  value={newUserData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  error={!!formErrors.phone}
                  helperText={
                    formErrors.phone ||
                    "E.164 format with country code (e.g., +251946450835)"
                  }
                  placeholder="+251946450835"
                  required
                />
              </Grid>

              {/* Password */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Password *"
                  type="password"
                  value={newUserData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  error={!!formErrors.password}
                  helperText={formErrors.password || "Minimum 6 characters"}
                  required
                />
              </Grid>

              {/* Party Type */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Party Type *</InputLabel>
                  <Select
                    value={newUserData.party_type}
                    onChange={(e) =>
                      handleInputChange("party_type", e.target.value)
                    }
                    label="Party Type *"
                    error={!!formErrors.party_type}
                    required
                  >
                    <MenuItem value="individual">Individual</MenuItem>
                    <MenuItem value="organization">Organization</MenuItem>
                    <MenuItem value="company">Company</MenuItem>
                  </Select>
                  {formErrors.party_type && (
                    <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                      {formErrors.party_type}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Profile Name */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Profile Name *"
                  value={newUserData.profile_name}
                  onChange={(e) =>
                    handleInputChange("profile_name", e.target.value)
                  }
                  error={!!formErrors.profile_name}
                  helperText={
                    formErrors.profile_name || "Display name for the profile"
                  }
                  required
                />
              </Grid>

              {/* Role */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={newUserData.role}
                    onChange={(e) => handleInputChange("role", e.target.value)}
                    label="Role"
                  >
                    {availableRoles.map((role) => (
                      <MenuItem key={role._id} value={role.name}>
                        {role.displayName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Status */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Account Status</InputLabel>
                  <Select
                    value={newUserData.status}
                    onChange={(e) =>
                      handleInputChange("status", e.target.value)
                    }
                    label="Account Status"
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                    <MenuItem value="suspended">Suspended</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Company */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Company"
                  value={newUserData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  helperText="Company or organization name"
                />
              </Grid>

              {/* Location */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Location"
                  value={newUserData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  helperText="City, Country"
                />
              </Grid>

              {/* Agency */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Agency (Optional)"
                  value={newUserData.agency}
                  onChange={(e) => handleInputChange("agency", e.target.value)}
                  helperText="Agency party ID if applicable"
                />
              </Grid>

              {/* Verified Status */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Email Verification Status</InputLabel>
                  <Select
                    value={newUserData.verified.toString()}
                    onChange={(e) =>
                      handleInputChange("verified", e.target.value === "true")
                    }
                    label="Email Verification Status"
                  >
                    <MenuItem value="false">Unverified</MenuItem>
                    <MenuItem value="true">Verified</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setAddUserDialogOpen(false)}
            disabled={addUserLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddUser}
            variant="contained"
            disabled={addUserLoading}
            startIcon={
              addUserLoading ? <CircularProgress size={20} /> : <PersonAdd />
            }
          >
            {addUserLoading ? "Creating User..." : "Create User"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Users;
