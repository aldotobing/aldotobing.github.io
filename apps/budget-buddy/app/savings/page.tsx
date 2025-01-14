'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus, Trash2, ArrowLeft, ImageIcon } from 'lucide-react'
import Link from 'next/link'

export default function Savings() {
  const [user, setUser] = useState<any>(null)
  const [savings, setSavings] = useState<any[]>([])
  const [newSaving, setNewSaving] = useState({ goal: '', targetAmount: '', currentAmount: '', targetDate: '', image: '' })
  const router = useRouter()

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      const userData = JSON.parse(currentUser)
      setUser(userData)
      setSavings(userData.budget.savings)
    } else {
      router.push('/auth')
    }
  }, [router])

  const handleAddSaving = (e: React.FormEvent) => {
    e.preventDefault()
    const updatedSavings = [...savings, { ...newSaving, id: Date.now() }]
    setSavings(updatedSavings)
    updateUserData(updatedSavings)
    setNewSaving({ goal: '', targetAmount: '', currentAmount: '', targetDate: '', image: '' })
  }

  const handleDeleteSaving = (id: number) => {
    const updatedSavings = savings.filter(saving => saving.id !== id)
    setSavings(updatedSavings)
    updateUserData(updatedSavings)
  }

  const updateUserData = (updatedSavings: any[]) => {
    const updatedUser = { ...user, budget: { ...user.budget, savings: updatedSavings } }
    localStorage.setItem('currentUser', JSON.stringify(updatedUser))
    setUser(updatedUser)

    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const updatedUsers = users.map((u: any) => u.username === user.username ? updatedUser : u)
    localStorage.setItem('users', JSON.stringify(updatedUsers))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewSaving({ ...newSaving, image: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard" className="text-white hover:text-gray-200 transition-colors duration-300 mb-4 inline-block">
          <ArrowLeft className="inline-block mr-2" />
          Back to Dashboard
        </Link>
        <h1 className="text-4xl font-bold mb-8 text-white">Savings Goals</h1>
        <motion.form
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleAddSaving}
          className="mb-8 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-6 rounded-2xl shadow-xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Goal"
              value={newSaving.goal}
              onChange={(e) => setNewSaving({ ...newSaving, goal: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 bg-white bg-opacity-50 placeholder-gray-500 text-gray-800"
              required
            />
            <input
              type="number"
              placeholder="Target Amount"
              value={newSaving.targetAmount}
              onChange={(e) => setNewSaving({ ...newSaving, targetAmount: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 bg-white bg-opacity-50 placeholder-gray-500 text-gray-800"
              required
            />
            <input
              type="number"
              placeholder="Current Amount"
              value={newSaving.currentAmount}
              onChange={(e) => setNewSaving({ ...newSaving, currentAmount: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 bg-white bg-opacity-50 placeholder-gray-500 text-gray-800"
              required
            />
            <input
              type="date"
              placeholder="Target Date"
              value={newSaving.targetDate}
              onChange={(e) => setNewSaving({ ...newSaving, targetDate: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 bg-white bg-opacity-50 placeholder-gray-500 text-gray-800"
              required
            />
          </div>
          <div className="mt-4">
            <label htmlFor="image-upload" className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center">
              <ImageIcon className="mr-2" size={20} />
              Upload Image
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
          {newSaving.image && (
            <img src={newSaving.image} alt="Goal" className="mt-4 w-full h-40 object-cover rounded-lg" />
          )}
          <button type="submit" className="mt-4 bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center w-full">
            <Plus className="mr-2" size={20} />
            Add Saving Goal
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
                  <th className="px-4 py-2 text-left text-gray-800">Goal</th>
                  <th className="px-4 py-2 text-left text-gray-800">Target Amount</th>
                  <th className="px-4 py-2 text-left text-gray-800">Current Amount</th>
                  <th className="px-4 py-2 text-left text-gray-800">Target Date</th>
                  <th className="px-4 py-2 text-left text-gray-800">Progress</th>
                  <th className="px-4 py-2 text-left text-gray-800">Image</th>
                  <th className="px-4 py-2 text-left text-gray-800">Action</th>
                </tr>
              </thead>
              <tbody>
                {savings.map((saving) => (
                  <motion.tr
                    key={saving.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-t border-gray-200"
                  >
                    <td className="px-4 py-2 text-gray-100">{saving.goal}</td>
                    <td className="px-4 py-2 text-gray-100">${saving.targetAmount}</td>
                    <td className="px-4 py-2 text-gray-100">${saving.currentAmount}</td>
                    <td className="px-4 py-2 text-gray-100">{saving.targetDate}</td>
                    <td className="px-4 py-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${(Number(saving.currentAmount) / Number(saving.targetAmount)) * 100}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      {saving.image && (
                        <img src={saving.image} alt={saving.goal} className="w-16 h-16 object-cover rounded-lg" />
                      )}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleDeleteSaving(saving.id)}
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

