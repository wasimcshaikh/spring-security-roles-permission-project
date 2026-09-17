const signupFields = [
  {
    name: "fullName",
    label: "Full Name",
    type: "text",
    required: true,
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    required: true,
  },
  {
    name: "phoneNumber",
    label: "Phone Number",
    type: "text",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    required: true,
  },
  {
    name: "role",
    label: "Role",
    type: "select",
    required: true,
    options: [
      {
        value: "PROVIDER",
        label: "Provider",
      },
      {
        value: "ADMIN",
        label: "Admin",
      },
    ],
  },
];

export default signupFields;