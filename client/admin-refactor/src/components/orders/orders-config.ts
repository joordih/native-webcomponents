import generalIcon from "@icons/general-icon.svg?raw";
import miscIcon from "@icons/misc-icon.svg?raw";
import { ordersSlice } from "@/redux/slices/orders/orders-slice";

export const ordersTableConfig = {
  title: "Orders Management",
  apiEndpoint: "http://localhost:8080/api/admin/orders",
  entityName: "order",
  columns: [
    {
      id: "id",
      label: "ID",
      sortable: true,
      width: "80px",
    },
    {
      id: "customer_name",
      label: "Customer",
      sortable: true,
      searchable: true,
    },
    {
      id: "total_amount",
      label: "Total",
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
          pending: "#ffc107",
          processing: "#17a2b8",
          completed: "#28a745",
          cancelled: "#dc3545",
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
        { value: "pending", label: "Pending" },
        { value: "processing", label: "Processing" },
        { value: "completed", label: "Completed" },
        { value: "cancelled", label: "Cancelled" },
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
      confirmMessage: "Are you sure you want to delete this order?",
    },
  ],
  reduxSlice: {
    selector: (state: any) => state.orders,
    actions: {
      addItems: ordersSlice.actions.addOrders,
      setCount: ordersSlice.actions.setCount,
      clearItems: ordersSlice.actions.clearOrders,
      setQueuedUpdate: ordersSlice.actions.setQueuedUpdate,
    },
  },
};

export const ordersFormConfig = {
  title: "Order Details",
  apiEndpoint: "http://localhost:8080/api/admin/orders",
  entityName: "order",
  tabs: [
    {
      id: "general",
      label: "General",
      icon: generalIcon,
      fields: [
        {
          id: "customer_name",
          type: "text" as const,
          label: "Customer Name",
          placeholder: "Enter customer name",
          required: true,
        },
        {
          id: "customer_email",
          type: "email" as const,
          label: "Customer Email",
          placeholder: "Enter customer email",
          required: true,
        },
        {
          id: "total_amount",
          type: "number" as const,
          label: "Total Amount",
          placeholder: "0.00",
          required: true,
          validation: (value: string) => {
            const num = parseFloat(value);
            if (isNaN(num) || num < 0) {
              return "Please enter a valid positive amount";
            }
            return null;
          },
        },
        {
          id: "status",
          type: "select" as const,
          label: "Status",
          required: true,
          options: [
            { value: "pending", label: "Pending" },
            { value: "processing", label: "Processing" },
            { value: "completed", label: "Completed" },
            { value: "cancelled", label: "Cancelled" },
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
          id: "shipping_address",
          type: "textarea" as const,
          label: "Shipping Address",
          placeholder: "Enter shipping address",
        },
        {
          id: "billing_address",
          type: "textarea" as const,
          label: "Billing Address",
          placeholder: "Enter billing address",
        },
        {
          id: "notes",
          type: "textarea" as const,
          label: "Notes",
          placeholder: "Additional notes about the order",
        },
        {
          id: "payment_method",
          type: "select" as const,
          label: "Payment Method",
          options: [
            { value: "credit_card", label: "Credit Card" },
            { value: "paypal", label: "PayPal" },
            { value: "bank_transfer", label: "Bank Transfer" },
            { value: "cash", label: "Cash" },
          ],
        },
      ],
    },
  ],
  reduxSlice: {
    selector: (state: any) => state.orders,
    actions: {
      addItems: ordersSlice.actions.addOrders,
      setCount: ordersSlice.actions.setCount,
      clearItems: ordersSlice.actions.clearOrders,
      setQueuedUpdate: ordersSlice.actions.setQueuedUpdate,
      setCurrentTab: ordersSlice.actions.setSearchTerm,
      addElement: ordersSlice.actions.addOrder,
      incrementCount: ordersSlice.actions.incrementCount,
    },
  },
};

export default { ordersTableConfig, ordersFormConfig };
