
import { Navigate, Route, Routes } from "react-router";
import { Main } from "../Components/Screens/Main/Main";
import { Productos } from "../Components/Screens/Productos/Productos";
import { Pedidos } from "../Components/Screens/Pedidos/Pedidos";
import { Balance } from "../Components/Screens/Balance/Balance";

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/main" element={<Main />}>
        <Route path="productos" element={<Productos />} /> 
        <Route path="pedidos" element={<Pedidos />} /> 
        <Route path="balance" element={<Balance />} /> 
      </Route>
  <Route path="*" element={<Navigate to="/main/productos" replace />} />
    </Routes>
  );
};