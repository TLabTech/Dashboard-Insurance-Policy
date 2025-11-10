import { createBrowserRouter } from "react-router";

/* Layout */
import { Layout } from "./layouts";
import { ProtectedRoute } from "./layouts/protected-route";

/* API */
import { getProfile } from "./app/auth/api";

/* Pages */
import { DashboardPage } from "./app/dashboard/views";
import { Login } from "./app/auth/views";
import { UserListPage } from "./app/pengguna/views";
import { DetailUserPage } from "./app/pengguna/views/detail";
import { CreateUserPage } from "./app/pengguna/views/create";
import { EditUserPage } from "./app/pengguna/views/edit";
import { ListSubmissionPage } from "./app/pengajuan/views";
import { CreateSubmissionPage } from "./app/pengajuan/views/create";
import { EditSubmissionPage } from "./app/pengajuan/views/edit";
import { DetailSubmissionPage } from "./app/pengajuan/views/detail";
import { NotFoundPage } from "./components/404";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />
  },
  {
    Component: Layout,
    loader: getProfile,
    children: [
      {
        path: "/",
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "/pengajuan",
        children: [
          {
            path: "",
            index: true,
            element: <ListSubmissionPage />,
          },
          {
            path: "create",
            element: <CreateSubmissionPage />,
          },
          {
            path: "edit/:id",
            element: <EditSubmissionPage />
          },
          {
            path: ":id",
            element: <DetailSubmissionPage />
          }
        ]
      },
      {
        path: "/pengguna",
        element: <ProtectedRoute allowedRoles={['admin']} />,
        children: [
          {
            index: true,
            path: "",
            element: <UserListPage />
          },
          {
            path: "create",
            element: <CreateUserPage />
          },
          {
            path: "edit/:id",
            element: <EditUserPage />
          },
          {
            path: ":id",
            element: <DetailUserPage />
          }
        ]
      }
    ]
  },
  {
    path: "*",
    element: (
      <div className="h-screen">
        <NotFoundPage />
      </div>
    )
  }
])
