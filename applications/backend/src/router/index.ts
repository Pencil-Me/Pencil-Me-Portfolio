import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: { name: 'ProjectList' }
  },
  {
    path: '/project-list',
    component: () => import('@/views/Projects/ProjectList.vue'),
    name: 'ProjectList'
  },
  {
    path: '/project/add',
    component: () => import('@/views/Projects/AddProject.vue'),
    name: 'AddProject'
  },
  {
    path: '/project/edit/:id',
    component: () => import('@/views/Projects/EditProject.vue'),
    name: 'EditProject',
    props: true
  },
  {
    path: '/customer-list',
    component: () => import('@/views/Customers/CustomerList.vue'),
    name: 'CustomerList'
  },
  {
    path: '/customer/add',
    component: () => import('@/views/Customers/AddCustomer.vue'),
    name: 'AddCustomer'
  },
  {
    path: '/customer/edit/:id',
    component: () => import('@/views/Customers/EditCustomer.vue'),
    name: 'EditCustomer',
    props: true
  },
  {
    path: '/techstack-list',
    component: () => import('@/views/TechStack/TechStackList.vue'),
    name: 'TechStackList'
  },
  {
    path: '/techstack/add',
    component: () => import('@/views/TechStack/AddTechStack.vue'),
    name: 'AddTechStack'
  },
  {
    path: '/techstack/edit/:id',
    component: () => import('@/views/TechStack/EditTechStack.vue'),
    name: 'EditTechStack',
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
