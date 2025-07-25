import generalIcon from "@icons/general-icon.svg?raw";
import miscIcon from "@icons/misc-icon.svg?raw";

export const promotersTableConfig = {
  title: "Promoters Management",
  apiEndpoint: "http://localhost:8080/api/admin/promoters",
  entityName: "promoter",
  columns: [
    {
      id: "id",
      label: "ID",
      sortable: true,
      width: "80px",
    },
    {
      id: "name",
      label: "Name",
      sortable: true,
      searchable: true,
    },
    {
      id: "email",
      label: "Email",
      sortable: true,
      searchable: true,
    },
    {
      id: "commission_rate",
      label: "Commission Rate",
      sortable: true,
      formatter: (value: number) => `${value}%`,
    },
    {
      id: "total_sales",
      label: "Total Sales",
      sortable: true,
      formatter: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      id: "status",
      label: "Status",
      sortable: true,
      searchable: true,
      formatter: (value: string) => {
        const statusColors = {
          active: "#28a745",
          inactive: "#6c757d",
          suspended: "#dc3545",
          pending: "#ffc107",
        };
        return `<span style="color: ${statusColors[value as keyof typeof statusColors] || "#6c757d"}">${value}</span>`;
      },
    },
    {
      id: "created_at",
      label: "Created",
      sortable: true,
      formatter: (value: string) => new Date(value).toLocaleDateString(),
    },
  ],
  filters: [
    {
      id: "status",
      label: "Status",
      type: "select" as const,
      options: [
        { value: "", label: "All Statuses" },
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
        { value: "suspended", label: "Suspended" },
        { value: "pending", label: "Pending" },
      ],
    },
    {
      id: "commission_range",
      label: "Commission Range",
      type: "select" as const,
      options: [
        { value: "", label: "All Ranges" },
        { value: "0-5", label: "0% - 5%" },
        { value: "5-10", label: "5% - 10%" },
        { value: "10-15", label: "10% - 15%" },
        { value: "15+", label: "15%+" },
      ],
    },
    {
      id: "date_range",
      label: "Date Range",
      type: "date_range" as const,
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
      confirmMessage: "Are you sure you want to delete this promoter?",
    },
  ],
};

export const promotersFormConfig = {
  title: "Promoter Details",
  apiEndpoint: "http://localhost:8080/api/admin/promoters",
  entityName: "promoter",
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
          id: "phone",
          type: "text" as const,
          label: "Phone Number",
          placeholder: "Enter phone number",
          required: true,
        },
        {
          id: "commission_rate",
          type: "number" as const,
          label: "Commission Rate (%)",
          placeholder: "0.00",
          required: true,
          validation: (value: string) => {
            const num = parseFloat(value);
            if (isNaN(num) || num < 0 || num > 100) {
              return "Please enter a valid commission rate between 0 and 100";
            }
            return null;
          },
        },
      ],
    },
    {
      id: "details",
      label: "Details",
      icon: miscIcon,
      fields: [
        {
          id: "company",
          type: "text" as const,
          label: "Company",
          placeholder: "Enter company name",
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
          placeholder: "Enter promoter bio",
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
            { value: "pending", label: "Pending" },
          ],
        },
        {
          id: "website",
          type: "text" as const,
          label: "Website",
          placeholder: "Enter website URL",
          validation: (value: string) => {
            if (value && !/^https?:\/\/.+/.test(value)) {
              return "Please enter a valid URL starting with http:// or https://";
            }
            return null;
          },
        },
        {
          id: "social_media",
          type: "textarea" as const,
          label: "Social Media Links",
          placeholder: "Enter social media links (one per line)",
        },
      ],
    },
  ],
};

export default { promotersTableConfig, promotersFormConfig };
