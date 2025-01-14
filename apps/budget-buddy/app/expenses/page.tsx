'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus, Trash2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function Expenses() {
  const [user, setUser] = useState<any>(null)
  const [expenses, setExpenses] = useState<any[]>([])
  const [newExpense, setNewExpense] = useState({ description: '', amount: '', category: '' })
  const router = useRouter()

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      const userData = JSON.parse(currentUser)
      setUser(userData)
      setExpenses(userData.budget.expenses)
    } else {
      router.push('/auth')
    }
  }, [router])

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault()
    const updatedExpenses = [...expenses, { ...newExpense, id: Date.now() }]
    setExpenses(updatedExpenses)
    updateUserData(updatedExpenses)
    setNewExpense({ description: '', amount: '', category: '' })
  }

  const handleDeleteExpense = (id: number) => {
    const updatedExpenses = expenses.filter(expense => expense.id !== id)
    setExpenses(updatedExpenses)
    updateUserData(updatedExpenses)
  }

  const updateUserData = (updatedExpenses: any[]) => {
    const updatedUser = { ...user, budget: { ...user.budget, expenses: updatedExpenses } }
    localStorage.setItem('currentUser', JSON.stringify(updatedUser))
    setUser(updatedUser)

    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const updatedUsers = users.map((u: any) => u.username === user.username ? updatedUser : u)
    localStorage.setItem('users', JSON.stringify(updatedUsers))
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard" className="text-white hover:text-gray-200 transition-colors duration-300 mb-4 inline-block">
          <ArrowLeft className="inline-block mr-2" />
          Back to Dashboard
        </Link>
        <h1 className="text-4xl font-bold mb-8 text-white">Expenses</h1>
        <motion.form
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleAddExpense}
          className="mb-8 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-6 rounded-2xl shadow-xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Description"
              value={newExpense.description}
              onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 bg-white bg-opacity-50 placeholder-gray-500 text-gray-800"
              required
            />
            <input
              type="number"
              placeholder="Amount"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 bg-white bg-opacity-50 placeholder-gray-500 text-gray-800"
              required
            />
            <input
              type="text"
              placeholder="Category"
              value={newExpense.category}
              onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 bg-white bg-opacity-50 placeholder-gray-500 text-gray-800"
              required
            />
          </div>
          <button type="submit" className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center w-full">
            <Plus className="mr-2" size={20} />
            Add Expense
          </button>
        </motion.form>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 bg-opacity-50">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-800">Description</th>
                  <th className="px-4 py-2 text-left text-gray-800">Amount</th>
                  <th className="px-4 py-2 text-left text-gray-800">Category</th>
                  <th className="px-4 py-2 text-left text-gray-800">Action</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <motion.tr
                    key={expense.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-t border-gray-200"
                  >
                    <td className="px-4 py-2 text-gray-100">{expense.description}</td>
                    <td className="px-4 py-2 text-gray-100">${expense.amount}</td>
                    <td className="px-4 py-2 text-gray-100">{expense.category}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="text-red-500 hover:text-red-600 transition-colors duration-300"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

