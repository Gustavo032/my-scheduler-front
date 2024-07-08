import * as React from "react"

import {
  ChakraProvider,
  theme,
} from "@chakra-ui/react"
import { 	Route, Routes } from "react-router-dom"
import { Login } from "./pages/Login"
import NotFound from "./components/notFound"
import { Register } from "./pages/Register"
import ClientDashboard from "./pages/ClientDashboard"
import AdminDashboard from "./pages/AdminDashboard"

export const App = () => {

  return(
    <ChakraProvider theme={theme}>
      <Routes>
        <Route path="/" element={<Login/>} />
				<Route path="/register" element={<Register/>} />
				<Route path="/client-dashboard" element={<ClientDashboard/>} />
				<Route path="/admin-dashboard" element={<AdminDashboard/>} />
        <Route path="/*" element={<NotFound/>} />
      </Routes>
			
    </ChakraProvider>
  )
}

export default App;
