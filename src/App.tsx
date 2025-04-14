import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Signup from "./pages/auth/Signup";
import { SignIn } from "./pages/auth/SignIn";
import SelectTemplate from "./pages/SelectTemplate";
import CutomizeTemplate from "./pages/v-Card/CustomizTemplate";
import VCard from "./pages/v-Card/Template";
import ClientDashboard from "./pages/ClientDashboard";
import { AdminDashboard } from "./pages/admin/Admin";
import MenuTemplate from "./pages/menu/MenuTemplate";
import AddCard from "./pages/admin/AddCard";
import Cards from "./pages/admin/Cards";
import Clients from "./pages/admin/Clients";
import FileTemplate from "./pages/file/FileTemplate";
import EditTemplate from "./pages/v-Card/EditTemplate";
import EditMenu from "./pages/menu/EditMenu";
import ProtectedTemplate from "./components/auth/ProtectedTemplate";
import ProtectAuthRoute from "./components/auth/ProtectAuthRoute";
import Layout from "./Layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/signup", element: <Signup /> },
      { path: "/signin", element: <SignIn /> },
      { path: "/select-template", element: <SelectTemplate /> },
      { path: "/customize-template", element: <CutomizeTemplate /> },
      {
        path: "/template",
        element: (
          // <ProtectedTemplate>
          <VCard />
          // </ProtectedTemplate>
        ),
      },
      {
        path: "/edit-template",
        element: (
          <ProtectedTemplate>
            <EditTemplate />
          </ProtectedTemplate>
        ),
      },
      {
        path: "/menu-template",
        element: (
          // <ProtectedTemplate>
          <MenuTemplate />
          // </ProtectedTemplate>
        ),
      },
      {
        path: "/edit-menu",
        element: (
          <ProtectedTemplate>
            <EditMenu />
          </ProtectedTemplate>
        ),
      },
      {
        path: "/client-dashboard",
        element: (
          <ProtectAuthRoute>
            <ClientDashboard />
          </ProtectAuthRoute>
        ),
      },
      {
        path: "/admin-dashboard",
        element: (
          // <ProtectAdminPage>
          <AdminDashboard />
          // </ProtectAdminPage>
        ),
      },
      { path: "/add-card", element: <AddCard /> },
      { path: "/cards", element: <Cards /> },
      { path: "/clients", element: <Clients /> },
      { path: "/file-template", element: <FileTemplate /> },
    ],
  },
]);

function App() {
  return (
    <Provider store={store}>
      <Toaster position="top-center" containerStyle={{ zIndex: "100" }} />
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
