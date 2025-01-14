'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus, Trash2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function Income() {
  const [user, setUser] = useState<any>(null)
  const [income, setIncome] = useState<any[]>([])
  const [newIncome, setNewIncome] = useState({ source: '', amount: '', date: '' })
  const router = useRouter()

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      const userData = JSON.parse(currentUser)
      setUser(userData)
      setIncome(userData.budget.income)
    } else {
      router.push('/auth')
    }
  }, [router])

  const handleAddIncome = (e: React.FormEvent) => {
    e.preventDefault()
    const updatedIncome = [...income, { ...newIncome, id: Date.now() }]
    setIncome(updatedIncome)
    updateUserData(updatedIncome)
    setNewIncome({ source: '', amount: '', date: '' })
  }

  const handleDeleteIncome = (id: number) => {
    const updatedIncome = income.filter(item => item.id !== id)
    setIncome(updatedIncome)
    updateUserData(updatedIncome)
  }

  const updateUserData = (updatedIncome: any[]) => {
    const updatedUser = { ...user, budget: { ...user.budget, income: updatedIncome } }
    localStorage.setItem('currentUser', JSON.stringify(updatedUser))
    setUser(updatedUser)

    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const updatedUsers = users.map((u: any) => u.username === user.username ? updatedUser : u)
    localStorage.setItem('users', JSON.stringify(updatedUsers))
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-cyan-500 to-blue-500 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard" className="text-white hover:text-gray-200 transition-colors duration-300 mb-4 inline-block">
          <ArrowLeft className="inline-block mr-2" />
          Back to Dashboard
        </Link>
        <h1 className="text-4xl font-bold mb-8 text-white">Income</h1>
        <motion.form
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleAddIncome}
          className="mb-8 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-6 rounded-2xl shadow-xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Source"
              value={newIncome.source}
              onChange={(e) => setNewIncome({ ...newIncome, source: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 bg-white bg-opacity-50 placeholder-gray-500 text-gray-800"
              required
            />
            <input
              type="number"
              placeholder="Amount"
              value={newIncome.amount}
              onChange={(e) => setNewIncome({ ...newIncome, amount: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 bg-white bg-opacity-50 placeholder-gray-500 text-gray-800"
              required
            />
            <input
              type="date"
              value={newIncome.date}
              onChange={(e) => setNewIncome({ ...newIncome, date: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 bg-white bg-opacity-50 placeholder-gray-500 text-gray-800"
              required
            />
          </div>
          <button type="submit" className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center w-full">
            <Plus className="mr-2" size={20} />
            Add Income
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
                  <th className="px-4 py-2 text-left text-gray-800">Source</th>
                  <th className="px-4 py-2 text-left text-gray-800">Amount</th>
                  <th className="px-4 py-2 text-left text-gray-800">Date</th>
                  <th className="px-4 py-2 text-left text-gray-800">Action</th>
                </tr>
              </thead>
              <tbody>
                {income.map((item) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-t border-gray-200"
                  >
                    <td className="px-4 py-2 text-gray-100">{item.source}</td>
                    <td className="px-4 py-2 text-gray-100">${item.amount}</td>
                    <td className="px-4 py-2 text-gray-100">{item.date}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleDeleteIncome(item.id)}
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

