import { describe, it, expect, beforeEach } from 'vitest'
import { useUserService } from '~/services/useUserService'
import { store } from '~/lib/store'

describe('useUserService', () => {
  beforeEach(() => {
    // Resetear el estado del store antes de cada prueba
    store.users = [
      {
        id: 1,
        firstName: 'Admin',
        lastName: 'Logística',
        phoneNumber: '999999999',
        documentNumber: 'ADMIN-001',
        email: 'admin@logistics.com',
        isActive: true,
        role: 'ADMIN',
      }
    ]
  })

  it('debería retornar la lista inicial de usuarios', () => {
    const { users } = useUserService()
    expect(users.value).toHaveLength(1)
    expect(users.value[0]!.firstName).toBe('Admin')
  })

  it('debería encontrar un usuario por número de documento', async () => {
    const { searchUser } = useUserService()
    const user = await searchUser('ADMIN-001')
    expect(user).toBeDefined()
    expect(user?.firstName).toBe('Admin')
  })

  it('debería encontrar un usuario por número de teléfono', async () => {
    const { searchUser } = useUserService()
    const user = await searchUser('999999999')
    expect(user).toBeDefined()
    expect(user?.lastName).toBe('Logística')
  })

  it('debería crear un nuevo usuario', async () => {
    const { createUser, users } = useUserService()
    const newUser = {
      firstName: 'Juan',
      lastName: 'Pérez',
      documentNumber: '12345678',
      phoneNumber: '987654321',
    }
    
    const created = await createUser(newUser)
    expect(created.id).toBeDefined()
    expect(users.value).toHaveLength(2)
    expect(users.value.find(u => u.documentNumber === '12345678')).toBeDefined()
  })

  it('debería actualizar un usuario existente', async () => {
    const { updateUser, users } = useUserService()
    await updateUser(1, { firstName: 'Admin Actualizado' })
    expect(users.value[0]!.firstName).toBe('Admin Actualizado')
  })

  it('debería retornar el nombre correcto del equipo', () => {
    const { getTeamName } = useUserService()
    store.teams = [{ id: 1, name: 'ADMINISTRACIÓN' }]
    
    expect(getTeamName(1)).toBe('ADMINISTRACIÓN')
    expect(getTeamName(999)).toBe('N/A')
  })
})
