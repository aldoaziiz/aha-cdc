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

// admissions
import RegistrationsNew from "@/components/Admissions/Registrations.vue";

// billing
import Billing from "@/components/Billing.vue";
import Invoice from "@/components/Invoice.vue";

// schedule
import Schedule from "@/components/Transactions/Schedule.vue";

import Activity from "@/components/Activity.vue";

import Curriculum from "@/components/Learning/Curriculum.vue";
import LessonPlan from "@/components/Learning/LessonPlan.vue";
import MilestoneLog from "@/components/Learning/Milestone Log.vue";
import ProgressReport from "@/components/Learning/ProgressReport.vue";

import ReportAdmission from "@/components/Report/ReportAdmission.vue";
import ReportAttendance from "@/components/Report/ReportAttendance.vue";
import ReportLateCheckOut from "@/components/Report/ReportLateCheckOut.vue";
import ReportActivity from "@/components/Report/ReportActivity.vue";

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

  {
    path: "/activity",
    component: Activity,
    meta: { layout: "app" },
  },
  {
    path: "/curriculum",
    component: Curriculum,
    meta: { layout: "app" },
  },
  {
    path: "/lesson-plan",
    component: LessonPlan,
    meta: { layout: "app" },
  },
  {
    path: "/milestone-log",
    component: MilestoneLog,
    meta: { layout: "app" },
  },
  {
    path: "/progress-report",
    component: ProgressReport,
    meta: { layout: "app" },
  },
  {
    path: "/report-admission",
    component: ReportAdmission,
    meta: { layout: "app" },
  },
  {
    path: "/report-attendance",
    component: ReportAttendance,
    meta: { layout: "app" },
  },
  {
    path: "/report-late-check-out",
    component: ReportLateCheckOut,
    meta: { layout: "app" },
  },
  {
    path: "/report-activity",
    component: ReportActivity,
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
