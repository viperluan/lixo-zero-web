
import LoginContainer from 'views/login/index.js'
import { RegisterContainer } from "views/register";
import { CategoriesContainer } from "views/categories";
import { EventsContainer } from "views/events";
import { UsersContainer } from "views/users";
import { PartnersContainer } from "views/partners";
import { ActionContainer } from "views/events/create";
import { ActionCalendar } from "views/events/schedule";
import { AboutContainer } from 'views/about';
import { PartnersCreateContainer } from 'views/partners/create';
import { QuotasContainer } from 'views/quotas';
import { MyEventsContainer } from 'views/events/my-events';

var routes = [
  {
    path: "/login",
    name: "login",
    icon: "ni ni-key-25 text-info",
    component: <LoginContainer />,
    layout: "/auth",
  },
  {
    path: "/register",
    name: "Register",
    icon: "ni ni-circle-08 text-pink",
    component: <RegisterContainer />,
    layout: "/auth",
  },
  {
    path: "/categories",
    name: "Categorias",
    icon: "ni ni-bullet-list-67 text-red",
    component: <CategoriesContainer />,
    layout: "/admin",
  },
  {
    path: "/quotas",
    name: "Categorias",
    icon: "ni ni-bullet-list-67 text-red",
    component: <QuotasContainer />,
    layout: "/admin",
  },
  {
    path: "/events",
    name: "Eventos",
    icon: "ni ni-bullet-list-67 text-red",
    component: <EventsContainer />,
    layout: "/admin",
  },
  {
    path: "/events/create",
    name: "Ações",
    icon: "ni ni-bullet-list-67 text-red",
    component: <ActionContainer />,
    layout: "/auth",
  },
  {
    path: "/events/my-events/:id",
    name: "Ações",
    icon: "ni ni-bullet-list-67 text-red",
    component: <MyEventsContainer />,
    layout: "/auth",
  },
  {
    path: "/users",
    name: "Eventos",
    icon: "ni ni-bullet-list-67 text-red",
    component: <UsersContainer />,
    layout: "/admin",
  },
  {
    path: "/partners",
    name: "Eventos",
    icon: "ni ni-bullet-list-67 text-red",
    component: <PartnersContainer />,
    layout: "/admin",
  },
  {
    path: "/schedule",
    name: "Register",
    icon: "ni ni-circle-08 text-pink",
    component: <ActionCalendar />,
    layout: "/auth",
  },
  {
    path: "/about",
    name: "Register",
    icon: "ni ni-circle-08 text-pink",
    component: <AboutContainer />,
    layout: "/auth",
  },
  {
    path: "/partner/create",
    name: "Register",
    icon: "ni ni-circle-08 text-pink",
    component: <PartnersCreateContainer />,
    layout: "/auth",
  },
];
export default routes;
