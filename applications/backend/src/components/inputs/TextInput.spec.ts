import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import TextInput from '@/components/inputs/TextInput.vue'

describe('TextInput', () => {
  it('emits update:modelValue on input', async () => {
    const wrapper = mount(TextInput, {
      props: {
        label: 'Name',
        modelValue: ''
      }
    })

    await wrapper.find('input').setValue('Test GmbH')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Test GmbH'])
  })

  it('shows German required error', async () => {
    const wrapper = mount(TextInput, {
      props: {
        label: 'Name',
        modelValue: '',
        required: true
      }
    })

    await wrapper.find('input').setValue('')
    expect(wrapper.text()).toContain('Dieses Feld darf nicht leer sein.')
  })
})
