// app/layout.js
import CustomSessionProvider from './session-provider'; // Import the new provider
import './globals.css'; // Update the import path for the global CSS file

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <CustomSessionProvider>
                    {children}
                </CustomSessionProvider>
            </body>
        </html>
    );
}
