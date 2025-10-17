import React from "react";
import {
    Box,
    Button,
    Checkbox,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControlLabel,
    InputAdornment,
    Menu,
    MenuItem,
    Paper,
    TextField
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Link2, Link1, Hashtag } from "lucide-react";
import AddIcon from "@mui/icons-material/Add";

const DepartmentManagement = ({
                         handleAddConfig,
                         rowsRoles,
                         columns,
                         rowRolesCount,
                         loading,
                         paginationRolesModel,
                         setPaginationRolesModel,
                         setSortRolesModel,
                         rolesAnchorEl,
                         handleRolesMenuClose,
                         handleRolesEditClick,
                         openRolesEditModal,
                         handleRolesEditModalClose,
                         RolesTransition,
                         editRolesFormData,
                         parameterValueErrorEdit,
                         handleRolesFormChange,
                         handleRolesEditSave
                     }) => {
    return (
        <Paper
            elevation={5}
            sx={{
                p: 2,
                borderRadius: 2,
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#fff"
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                    flexGrow: 1,
                    justifyContent: "space-between"
                }}
            >
                <TextField
                    label="Parameter Type"
                    size="small"
                    sx={{ flex: 1, minWidth: 180 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Link2 size="18" color="#666" />
                            </InputAdornment>
                        )
                    }}
                />
                <TextField
                    label="Parameter Category"
                    size="small"
                    sx={{ flex: 1, minWidth: 180 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Link1 size="18" color="#666" />
                            </InputAdornment>
                        )
                    }}
                />
                <TextField
                    label="Parameter Value"
                    size="small"
                    sx={{ flex: 1, minWidth: 180 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Hashtag size="18" color="#666" />
                            </InputAdornment>
                        )
                    }}
                />
                <Button
                    variant="contained"
                    onClick={handleAddConfig}
                    startIcon={<AddIcon />}
                    sx={{
                        height: 36,
                        background: "linear-gradient(90deg, #116530, #1b7a3e)",
                        textTransform: "none",
                        fontWeight: 600
                    }}
                >
                    Add Config
                </Button>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Box sx={{ height: 440 }}>
                <DataGrid
                    rows={rowsRoles}
                    columns={columns}
                    rowCount={rowRolesCount}
                    loading={loading}
                    paginationModel={paginationRolesModel}
                    onPaginationModelChange={setPaginationRolesModel}
                    paginationMode="server"
                    sortingMode="server"
                    onSortModelChange={setSortRolesModel}
                    pageSizeOptions={[5, 10, 20, 50]}
                    disableColumnMenu
                    rowHeight={40}
                    headerHeight={38}
                    sx={{
                        "& .MuiDataGrid-columnHeaderTitle": {
                            fontWeight: "700"
                        }
                    }}
                    slots={{
                        loadingOverlay: () => (
                            <Box
                                sx={{
                                    height: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            >
                                <CircularProgress />
                            </Box>
                        )
                    }}
                />

                {/* Actions Menu */}
                <Menu
                    anchorEl={rolesAnchorEl}
                    open={Boolean(rolesAnchorEl)}
                    onClose={handleRolesMenuClose}
                >
                    <MenuItem onClick={handleRolesEditClick}>Edit</MenuItem>
                </Menu>

                {/* Edit Modal */}
                <Dialog
                    open={openRolesEditModal}
                    onClose={handleRolesEditModalClose}
                    maxWidth="sm"
                    disableRestoreFocus
                    fullWidth
                    TransitionComponent={RolesTransition}
                    PaperProps={{
                        sx: {
                            borderRadius: 3,
                            background: "rgba(255, 255, 255, 0.95)",
                            backdropFilter: "blur(20px)",
                            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.2)"
                        }
                    }}
                >
                    <DialogTitle
                        sx={{
                            background: "linear-gradient(135deg, #116530 0%, #1b7a3e 100%)",
                            color: "#fff",
                            fontWeight: 700,
                            fontSize: "1.25rem",
                            py: 2.5
                        }}
                    >
                        Edit Config
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
                            {/* Parameter Value */}
                            <TextField
                                label="Parameter Value"
                                fullWidth
                                type="text"
                                size="small"
                                value={editRolesFormData.value}
                                error={parameterValueErrorEdit}
                                InputProps={{
                                    sx: {
                                        fontSize: 14,
                                        height: 36
                                    }
                                }}
                                InputLabelProps={{
                                    sx: { fontSize: 14 }
                                }}
                                onChange={(e) =>
                                    handleRolesFormChange("value", e.target.value)
                                }
                            />

                            {/* Status */}
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={editRolesFormData.status === 1}
                                        onChange={(e) =>
                                            handleRolesFormChange("active", e.target.checked)
                                        }
                                    />
                                }
                                label="Active"
                                sx={{
                                    "& .MuiFormControlLabel-label": {
                                        fontSize: "0.95rem"
                                    }
                                }}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleRolesEditModalClose} disabled={loading}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleRolesEditSave}
                            variant="contained"
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={20} /> : "Save Changes"}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Paper>
    );
};

export default DepartmentManagement;
