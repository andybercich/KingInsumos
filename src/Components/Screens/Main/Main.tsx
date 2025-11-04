import { NavLink, Outlet } from "react-router"
import style from "./Main.module.css"

export const Main = () => {
  return (
    <>
     <div className={style.header}>
      
      <h1 className={style.mainTitle}>
        King insumos
      </h1>

      <div className={style.links}>
          <NavLink to={"/main/productos"} className={({ isActive }) => (isActive ? style.activeLink : "")}>Productos</NavLink>
          <NavLink to={"/main/pedidos"} className={({ isActive }) => (isActive ? style.activeLink : "")}>Pedidos</NavLink>
          <NavLink to={"/main/balance"} className={({ isActive }) => (isActive ? style.activeLink : "")}>Balance</NavLink>
      </div>
        

     </div>
    <Outlet />
    </>
  )
}
