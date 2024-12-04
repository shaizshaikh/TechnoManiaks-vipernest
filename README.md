# **Technomaniaks: Azure Blob Storage and Okta Authentication Integration**

## **Overview**
**Technomaniaks** is a web application built using **Next.js (App Router)** that allows authenticated users to upload files directly to **Azure Blob Storage**. The application uses **Okta** for authentication and ensures that only users from the `pbs_students` group can access file upload functionality.

---

## **Features**
- **Secure Authentication**: Integration with Okta OIDC for login and user group management.
- **File Upload to Azure Blob Storage**: Authenticated users can upload files securely.
- **Responsive Design**: Tailored UI with TailwindCSS.
- **Custom Branding**: Includes a personalized logo and branded login experience.

---

## **Technologies Used**
- **Next.js**: Framework for building the app.
- **NextAuth.js**: Authentication management.
- **Okta OIDC**: Identity provider for secure login.
- **Azure Blob Storage SDK**: For handling file uploads.
- **TailwindCSS**: Styling the application.
- **Docker**: For containerization and deployment.
- **Azure App Services**: Cloud hosting for the application.

---

## **Environment Variables**
To run this project, you need to configure the following environment variables in a `.env.local` file:

```plaintext
NEXTAUTH_URL=<Your_App_Url>
NEXTAUTH_SECRET=<Your_Secret_Key>

OKTA_CLIENT_ID=<Your_Client_ID>
OKTA_CLIENT_SECRET=<Your_Client_Secret>
OKTA_ISSUER=<Your_Okta_Issuer_Url>

AZURE_STORAGE_CONNECTION_STRING=<Your_Azure_Storage_Connection_String>
AZURE_CONTAINER_NAME=<Your_Container_Name>
