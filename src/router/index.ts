import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";

import Login from "@/components/Login.vue";
import Dashboard from "@/components/Dashboard.vue";
import BlankLayout from "@/layouts/BlankLayout.vue";

// master data
import Children from "@/components/MasterData/Children.vue";
import Guardians from "@/components/MasterData/Guardians.vue";
import Staff from "@/components/MasterData/Staff.vue";
import Programs from "@/components/MasterData/Programs.vue";
import Rooms from "@/components/MasterData/Rooms.vue";

// transactions
import Registrations from "@/components/Transactions/Registrations.vue";
import TherapySessions from "@/components/Transactions/TherapySessions.vue";

// admissions
import RegistrationsNew from "@/components/Admissions/Registrations.vue";

// billing
import Billing from "@/components/Billing.vue";
import Invoice from "@/components/Invoice.vue";

// schedule
import Schedule from "@/components/Transactions/Schedule.vue";

// activity create
import Activity from "@/components/Activity.vue";
import ActivityCreate from "@/components/ActivityCreate.vue";
import ActivityEdit from "@/components/ActivityEdit.vue";

import HelpSupport from "@/components/HelpSupport.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    component: Login,
    meta: { layout: "blank" },
  },
  {
    path: "/dashboard",
    component: Dashboard,
    meta: { layout: "app" },
  },

  // master data
  {
    path: "/children",
    component: Children,
    meta: { layout: "app" },
  },
  {
    path: "/guardians",
    component: Guardians,
    meta: { layout: "app" },
  },
  {
    path: "/staff",
    component: Staff,
    meta: { layout: "app" },
  },
  {
    path: "/programs",
    component: Programs,
    meta: { layout: "app" },
  },
  {
    path: "/rooms",
    component: Rooms,
    meta: { layout: "app" },
  },

  // transactions
  {
    path: "/registrations",
    component: Registrations,
    meta: { layout: "app" },
  },
  {
    path: "/therapy-sessions",
    component: TherapySessions,
    meta: { layout: "app" },
  },

  // admissions
  {
    path: "/registrations-new",
    component: RegistrationsNew,
    meta: { layout: "app" },
  },

  // billing
  {
    path: "/billing",
    component: Billing,
    meta: { layout: "app" },
  },

  // invoice details
  {
    path: "/invoices/:id",
    component: Invoice,
    meta: { layout: "blank" },
  },

  // Schedule
  {
    path: "/registrations/:id/schedule",
    component: Schedule,
    meta: { layout: "app" },
  },

  // Activity
  {
    path: "/activity",
    component: Activity,
    meta: { layout: "app" },
  },
  {
    path: "/activity/create",
    component: ActivityCreate,
    meta: { layout: "app" },
  },
  {
    path: "/activity/:id/edit",
    component: ActivityEdit,
    meta: { layout: "app" },
  },

  {
    path: "/help-support",
    component: HelpSupport,
    meta: { layout: "app" },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
