import { describe, it, expect, beforeEach } from 'vitest'
import { useTransactionService } from '~/services/useTransactionService'
import { store } from '~/lib/store'

describe('useTransactionService', () => {
  beforeEach(() => {
    // Resetear el estado del store
    store.transactions = []
    store.users = [
      { id: 1, firstName: 'Test', lastName: 'User', phoneNumber: '123', documentNumber: 'D-123', isActive: true }
    ]
    store.teams = [
      { id: 1, name: 'EQUIPO TEST' }
    ]
  })

  it('debería iniciar una nueva transacción', async () => {
    const { startTransaction, activeTransactions } = useTransactionService()
    const request = {
      userId: 1,
      teamId: 1,
      ticketCode: 'TS-001',
      itemDescription: 'Caja de Prueba',
      lockerCode: 'L-01'
    }

    const tx = await startTransaction(request)
    expect(tx.id).toBeDefined()
    expect(tx.ticketCode).toBe('TS-001')
    expect(activeTransactions.value).toHaveLength(1)
    expect(tx.user?.firstName).toBe('Test')
    expect(tx.teamName).toBe('EQUIPO TEST')
  })

  it('debería finalizar una transacción', async () => {
    const { startTransaction, endTransaction, activeTransactions, historicTransactions } = useTransactionService()
    const tx = await startTransaction({
      userId: 1,
      teamId: 1,
      ticketCode: 'TS-001',
      itemDescription: 'Caja de Prueba'
    })

    await endTransaction(tx.id)
    expect(tx.outTime).toBeDefined()
    expect(activeTransactions.value).toHaveLength(0)
    expect(historicTransactions.value).toHaveLength(1)
  })

  it('debería actualizar el código del casillero durante una transacción', async () => {
    const { startTransaction, updateLockerCode } = useTransactionService()
    const tx = await startTransaction({
      userId: 1,
      teamId: 1,
      ticketCode: 'TS-001',
      itemDescription: 'Caja de Prueba',
      lockerCode: 'VIEJO'
    })

    await updateLockerCode(tx.id, 'NUEVO')
    expect(tx.lockerCode).toBe('NUEVO')
  })

  it('debería retornar tickets disponibles excluyendo los activos', async () => {
    const { startTransaction, availableTickets } = useTransactionService()
    
    // El total de tickets es 48 (TS-001 a TS-048)
    expect(availableTickets.value).toHaveLength(48)

    await startTransaction({
      userId: 1,
      teamId: 1,
      ticketCode: 'TS-001',
      itemDescription: 'Prueba'
    })

    expect(availableTickets.value).toHaveLength(47)
    expect(availableTickets.value).not.toContain('TS-001')
  })

  it('debería lanzar un error al finalizar una transacción inexistente', async () => {
    const { endTransaction } = useTransactionService()
    await expect(endTransaction(999)).rejects.toThrow('Transaction not found')
  })
})
