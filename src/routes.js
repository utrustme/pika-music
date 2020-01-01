import { Details, Home } from "./utils/lazyPage"
import Header from "./client/Header"
import fetchHomeData from "./client/Home/fetchHomeData"

const routes = [
  {
    component: Header,
    routes: [
      {
        path: "/",
        exact: true,
        loadData: fetchHomeData,
        component: Home,
      },
      {
        path: "/home",
        loadData: fetchHomeData,
        component: Home,
      },
      {
        path: "/details",
        component: Details,
      },
    ],
  },
]

export default routes
