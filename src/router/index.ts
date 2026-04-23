import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Login from '@/components/Login.vue'
import Dashboard from '@/components/Dashboard.vue'
import Children from '@/components/People/Children.vue'
import Parents from '@/components/People/Parents.vue'
import Staff from '@/components/People/Staff.vue'
import Applicants from '@/components/Admission/Applicants.vue'
import Forms from '@/components/Admission/Forms.vue'
import Programs from '@/components/Admission/Programs.vue'
import Rooms from '@/components/Admission/Rooms.vue'
import Transactions from '@/components/Billing/Transactions.vue'
import Students from '@/components/Billing/Students.vue'
import Template from '@/components/Billing/Template.vue'
import Activity from '@/components/Activity.vue'
import Curriculum from '@/components/Learning/Curriculum.vue'
import LessonPlan from '@/components/Learning/LessonPlan.vue'
import MilestoneLog from '@/components/Learning/Milestone Log.vue'
import ProgressReport from '@/components/Learning/ProgressReport.vue'
import ReportAdmission from '@/components/Report/ReportAdmission.vue'
import ReportAttendance from '@/components/Report/ReportAttendance.vue'
import ReportLateCheckOut from '@/components/Report/ReportLateCheckOut.vue'
import ReportActivity from '@/components/Report/ReportActivity.vue'
import HelpSupport from '@/components/HelpSupport.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    component: Login,
    meta: { layout: 'blank' },
  },
  {
    path: '/dashboard',
    component: Dashboard,
    meta: { layout: 'app' },
  },
  {
    path: '/children',
    component: Children,
    meta: { layout: 'app' },
  },
  {
    path: '/parents',
    component: Parents,
    meta: { layout: 'app' },
  },
  {
    path: '/staff',
    component: Staff,
    meta: { layout: 'app' },
  },
  {
    path: '/applicants',
    component: Applicants,
    meta: { layout: 'app' },
  },
  {
    path: '/forms',
    component: Forms,
    meta: { layout: 'app' },
  },
  {
    path: '/programs',
    component: Programs,
    meta: { layout: 'app' },
  },
  {
    path: '/rooms',
    component: Rooms,
    meta: { layout: 'app' },
  },
  {
    path: '/transactions',
    component: Transactions,
    meta: { layout: 'app' },
  },
  {
    path: '/students',
    component: Students,
    meta: { layout: 'app' },
  },
  {
    path: '/template',
    component: Template,
    meta: { layout: 'app' },
  },
  {
    path: '/activity',
    component: Activity,
    meta: { layout: 'app' },
  },
  {
    path: '/curriculum',
    component: Curriculum,
    meta: { layout: 'app' },
  },
  {
    path: '/lesson-plan',
    component: LessonPlan,
    meta: { layout: 'app' },
  },
  {
    path: '/milestone-log',
    component: MilestoneLog,
    meta: { layout: 'app' },
  },
  {
    path: '/progress-report',
    component: ProgressReport,
    meta: { layout: 'app' },
  },
  {
    path: '/report-admission',
    component: ReportAdmission,
    meta: { layout: 'app' },
  },
  {
    path: '/report-attendance',
    component: ReportAttendance,
    meta: { layout: 'app' },
  },
  {
    path: '/report-late-check-out',
    component: ReportLateCheckOut,
    meta: { layout: 'app' },
  },
  {
    path: '/report-activity',
    component: ReportActivity,
    meta: { layout: 'app' },
  },
  {
    path: '/help-support',
    component: HelpSupport,
    meta: { layout: 'app' },
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
