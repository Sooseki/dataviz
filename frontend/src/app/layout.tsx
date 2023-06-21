import { AuthContextProvider } from "@/context/AuthContext";
import '../styles/main.css';

export const metadata = {
  title: 'PerfGuardian'
}

const RootLayout = ({children}: {
  children: React.ReactNode
}) => {
  return (
    <html lang="en">
      <body>
        <AuthContextProvider>
          {children}
        </AuthContextProvider>
      </body>
    </html>
  )
}

export default RootLayout;