"use client";

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
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Grid,
    Alert,
    Snackbar,
    CircularProgress,
    FormControlLabel,
    Checkbox,
    FormGroup,
    Divider,
    Card,
    CardContent,
} from "@mui/material";
import {
    Search,
    Edit,
    Delete,
    Security,
    Add,
    Refresh,
    Info,
} from "@mui/icons-material";
import { rolesApi, Role } from "../services/rolesApi";

function RoleManagement() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [permissions, setPermissions] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [formData, setFormData] = useState<Partial<Role>>({
        name: "",
        displayName: "",
        description: "",
        permissions: [],
        hierarchyLevel: 50,
        isActive: true,
    });

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success" as "success" | "error",
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [fetchedRoles, fetchedPermissions] = await Promise.all([
                rolesApi.getRolesWithStats(true),
                rolesApi.getAllPermissions(),
            ]);
            setRoles(fetchedRoles);
            setPermissions(fetchedPermissions);
        } catch (error: any) {
            showSnackbar(error.message, "error");
        } finally {
            setLoading(false);
        }
    };

    const showSnackbar = (message: string, severity: "success" | "error") => {
        setSnackbar({ open: true, message, severity });
    };

    const handleOpenDialog = (role?: Role) => {
        if (role) {
            setSelectedRole(role);
            setFormData({
                name: role.name,
                displayName: role.displayName,
                description: role.description,
                permissions: role.permissions,
                hierarchyLevel: role.hierarchyLevel,
                isActive: role.isActive,
            });
        } else {
            setSelectedRole(null);
            setFormData({
                name: "",
                displayName: "",
                description: "",
                permissions: [],
                hierarchyLevel: 50,
                isActive: true,
            });
        }
        setDialogOpen(true);
    };

    const handleSaveRole = async () => {
        try {
            if (selectedRole) {
                await rolesApi.updateRole(selectedRole._id, formData);
                showSnackbar("Role updated successfully", "success");
            } else {
                await rolesApi.createRole(formData);
                showSnackbar("Role created successfully", "success");
            }
            setDialogOpen(false);
            fetchData();
        } catch (error: any) {
            showSnackbar(error.message, "error");
        }
    };

    const handleDeleteRole = async () => {
        if (!selectedRole) return;
        try {
            await rolesApi.deleteRole(selectedRole._id);
            showSnackbar("Role deleted successfully", "success");
            setDeleteDialogOpen(false);
            fetchData();
        } catch (error: any) {
            showSnackbar(error.message, "error");
        }
    };

    const handlePermissionToggle = (permission: string) => {
        const currentPermissions = formData.permissions || [];
        const newPermissions = currentPermissions.includes(permission)
            ? currentPermissions.filter((p) => p !== permission)
            : [...currentPermissions, permission];
        setFormData({ ...formData, permissions: newPermissions });
    };

    const filteredRoles = roles.filter(
        (role) =>
            role.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            role.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const permissionGroups = permissions.reduce((acc, curr) => {
        const [group] = curr.split(":");
        if (!acc[group]) acc[group] = [];
        acc[group].push(curr);
        return acc;
    }, {} as Record<string, string[]>);

    return (
        <Box sx={{ width: "100%", minHeight: "100vh", p: 3, bgcolor: "#f5f5f5" }}>
            <Box sx={{ mb: 4, mt: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h4" fontWeight="bold" color="primary">
                    Role Management
                </Typography>
                    <Box>
                        <Button
                            variant="outlined"
                            startIcon={<Refresh />}
                            onClick={fetchData}
                            sx={{ mr: 2 }}
                        >
                            Refresh
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={() => handleOpenDialog()}
                        >
                            Add Role
                        </Button>
                    </Box>
                </Box>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={3}>
                        <Card sx={{ bgcolor: "#e3f2fd" }}>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>Total Roles</Typography>
                                <Typography variant="h4">{roles.length}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={9}>
                        <Alert severity="info" icon={<Info />}>
                            Roles define user permissions across the system. System roles (marked with a lock) are protected from deletion to ensure system stability.
                        </Alert>
                    </Grid>
                </Grid>

                <Paper sx={{ width: "100%", overflow: "hidden", borderRadius: 4, boxShadow: 3 }}>
                    <Box sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
                        <TextField
                            placeholder="Search roles..."
                            variant="outlined"
                            size="small"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ width: 300 }}
                        />
                    </Box>
                    <TableContainer>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Display Name</TableCell>
                                    <TableCell>Internal Name</TableCell>
                                    <TableCell>Permissions</TableCell>
                                    <TableCell>Level</TableCell>
                                    <TableCell>Users</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                                            <CircularProgress />
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredRoles
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((role) => (
                                            <TableRow key={role._id} hover>
                                                <TableCell>
                                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                                        {role.isSystem && <Security sx={{ fontSize: 16, mr: 1, color: "text.secondary" }} />}
                                                        <Typography variant="subtitle2">{role.displayName}</Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell><code>{role.name}</code></TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={`${role.permissions.length} Permissions`}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                </TableCell>
                                                <TableCell>{role.hierarchyLevel}</TableCell>
                                                <TableCell>{role.userCount || 0}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={role.isActive ? "Active" : "Inactive"}
                                                        color={role.isActive ? "success" : "default"}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <IconButton size="small" onClick={() => handleOpenDialog(role)}>
                                                        <Edit fontSize="small" />
                                                    </IconButton>
                                                    {!role.isSystem && (
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            onClick={() => {
                                                                setSelectedRole(role);
                                                                setDeleteDialogOpen(true);
                                                            }}
                                                        >
                                                            <Delete fontSize="small" />
                                                        </IconButton>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 50]}
                        component="div"
                        count={filteredRoles.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={(_, newPage) => setPage(newPage)}
                        onRowsPerPageChange={(e) => {
                            setRowsPerPage(parseInt(e.target.value, 10));
                            setPage(0);
                        }}
                    />
                </Paper>
            </Box>

            {/* Add/Edit Role Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    {selectedRole ? "Edit Role" : "Create New Role"}
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Role Display Name"
                                placeholder="e.g. Sales Manager"
                                value={formData.displayName}
                                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Internal Name"
                                placeholder="e.g. sales_manager"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                disabled={!!selectedRole && selectedRole.isSystem}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" gutterBottom fontWeight="bold">Permissions</Typography>
                            <Paper variant="outlined" sx={{ p: 2, maxHeight: 300, overflow: "auto" }}>
                                {Object.entries(permissionGroups).map(([group, groupPermissions]) => (
                                    <Box key={group} sx={{ mb: 2 }}>
                                        <Typography variant="overline" color="primary">{group}</Typography>
                                        <Divider sx={{ mb: 1 }} />
                                        <FormGroup>
                                            {groupPermissions.map((perm) => (
                                                <FormControlLabel
                                                    key={perm}
                                                    control={
                                                        <Checkbox
                                                            size="small"
                                                            checked={formData.permissions?.includes(perm)}
                                                            onChange={() => handlePermissionToggle(perm)}
                                                        />
                                                    }
                                                    label={<Typography variant="body2">{perm.split(":")[1].replace("_", " ")}</Typography>}
                                                />
                                            ))}
                                        </FormGroup>
                                    </Box>
                                ))}
                            </Paper>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSaveRole}>Save Role</Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Delete Role</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete the role "{selectedRole?.displayName}"? This action cannot be undone and will only be successful if no active users are assigned to this role.
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button variant="contained" color="error" onClick={handleDeleteRole}>Delete</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default RoleManagement;
