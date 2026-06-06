import { defineStore } from 'pinia'
import CustomerService from '@/services/customer.service'
import { withStoreAction } from '@/pinia/useAppStore'
import type { TCustomer } from '@/types/customer'

const emptyCustomer = (): TCustomer => ({
  id: '',
  name: '',
  location: ''
})

export const useCustomersStore = defineStore('customers', {
  state: () => ({
    customers: [] as TCustomer[],
    current: emptyCustomer()
  }),
  getters: {
    customerItems: (state) => state.customers,
    currentCustomer: (state) => state.current
  },
  actions: {
    async getAllCustomers() {
      await withStoreAction(async () => {
        this.customers = await CustomerService.getCustomers()
      })
    },
    async setCurrentCustomerItem(id: string) {
      await withStoreAction(async () => {
        this.current = await CustomerService.getCustomer(id)
      })
    },
    async addCustomer(customer: TCustomer) {
      await withStoreAction(async () => {
        await CustomerService.createCustomer(customer)
        await this.getAllCustomers()
      })
    },
    async updateCurrentCustomer(customer: TCustomer) {
      await withStoreAction(async () => {
        await CustomerService.updateCustomer(customer)
        this.current = await CustomerService.getCustomer(customer.id ?? '')
        await this.getAllCustomers()
      })
    },
    async deleteCurrentCustomer(customer: TCustomer) {
      await withStoreAction(async () => {
        await CustomerService.deleteCustomer(customer)
        await this.getAllCustomers()
      })
    }
  }
})
