import generalIcon from "@icons/general-icon.svg?raw";
import miscIcon from "@icons/misc-icon.svg?raw";
import {
  addUsers,
  setCount,
  clearUsers,
  setQueuedUpdate,
  setSearchTerm,
  addUser,
  incrementCount,
} from "@redux/slices/users/index";

export const usersTableConfig = {
  title: "Users Management",
  apiEndpoint: "http://localhost:8080/api/admin/users",
  entityName: "user",
  columns: [
    {
      key: "id",
      label: "ID",
      sortable: true,
    },
    {
      key: "name",
      label: "Name",
      sortable: true,
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
    },
    {
      key: "role",
      label: "Role",
      sortable: true,
      render: (value: string) => {
        const roleColors = {
          admin: "#dc3545",
          manager: "#fd7e14",
          user: "#28a745",
          guest: "#6c757d",
        };
        return `<span style="color: ${roleColors[value as keyof typeof roleColors] || "#6c757d"}">${value || ""}</span>`;
      },
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value: string) => {
        const statusColors = {
          active: "#28a745",
          inactive: "#6c757d",
          suspended: "#dc3545",
        };
        return `<span style="color: ${statusColors[value as keyof typeof statusColors] || "#6c757d"}">${value || ""}</span>`;
      },
    },
    {
      key: "createdAt",
      label: "Created",
      sortable: true,
      render: (value: string) =>
        value ? new Date(value).toLocaleDateString() : "",
    },
  ],
  filters: [
    {
      key: "role",
      label: "Role",
      type: "select" as const,
      options: [
        { value: "", label: "All Roles" },
        { value: "admin", label: "Admin" },
        { value: "manager", label: "Manager" },
        { value: "user", label: "User" },
        { value: "guest", label: "Guest" },
      ],
    },
    {
      key: "status",
      label: "Status",
      type: "select" as const,
      options: [
        { value: "", label: "All Statuses" },
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
        { value: "suspended", label: "Suspended" },
      ],
    },
  ],
  actions: [
    {
      id: "edit",
      label: "Edit",
      icon: "edit",
      variant: "primary" as const,
    },
    {
      id: "delete",
      label: "Delete",
      icon: "delete",
      variant: "danger" as const,
      confirmMessage: "Are you sure you want to delete this user?",
    },
  ],
  reduxSlice: {
    selector: (state: any) => state.users,
    actions: {
      addItems: addUsers,
      setCount: setCount,
      clearItems: clearUsers,
      setQueuedUpdate: setQueuedUpdate,
    },
  },
};

export const usersFormConfig = {
  title: "User Details",
  apiEndpoint: "http://localhost:8080/api/admin/users",
  entityName: "user",
  tabs: [
    {
      id: "general",
      label: "General",
      icon: generalIcon,
      fields: [
        {
          id: "name",
          type: "text" as const,
          label: "Full Name",
          placeholder: "Enter full name",
          required: true,
        },
        {
          id: "email",
          type: "email" as const,
          label: "Email Address",
          placeholder: "Enter email address",
          required: true,
        },
        {
          id: "password",
          type: "password" as const,
          label: "Password",
          placeholder: "Enter password",
          required: true,
          validation: (value: string) => {
            if (value.length < 8) {
              return "Password must be at least 8 characters long";
            }
            if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
              return "Password must contain at least one uppercase letter, one lowercase letter, and one number";
            }
            return null;
          },
        },
        {
          id: "role",
          type: "select" as const,
          label: "Role",
          required: true,
          options: [
            { value: "admin", label: "Admin" },
            { value: "manager", label: "Manager" },
            { value: "user", label: "User" },
            { value: "guest", label: "Guest" },
          ],
        },
      ],
    },
    {
      id: "details",
      label: "Details",
      icon: miscIcon,
      fields: [
        {
          id: "phone",
          type: "text" as const,
          label: "Phone Number",
          placeholder: "Enter phone number",
        },
        {
          id: "address",
          type: "textarea" as const,
          label: "Address",
          placeholder: "Enter address",
        },
        {
          id: "bio",
          type: "textarea" as const,
          label: "Bio",
          placeholder: "Enter user bio",
        },
        {
          id: "status",
          type: "select" as const,
          label: "Status",
          required: true,
          options: [
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
            { value: "suspended", label: "Suspended" },
          ],
        },
        {
          id: "date_of_birth",
          type: "date" as const,
          label: "Date of Birth",
          placeholder: "Select date of birth",
        },
      ],
    },
  ],
  reduxSlice: {
    selector: (state: any) => state.users,
    actions: {
      addItems: addUsers,
      setCount: setCount,
      clearItems: clearUsers,
      setQueuedUpdate: setQueuedUpdate,
      setCurrentTab: setSearchTerm,
      addElement: addUser,
      incrementCount: incrementCount,
    },
  },
};

export default { usersTableConfig, usersFormConfig };
