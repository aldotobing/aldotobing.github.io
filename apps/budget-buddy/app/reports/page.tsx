'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Wallet, TrendingUp, PiggyBank, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function Reports() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      setUser(JSON.parse(currentUser))
    } else {
      router.push('/auth')
    }
  }, [router])

  if (!user) return null

  const totalIncome = user.budget.income.reduce((sum: number, item: any) => sum + Number(item.amount), 0)
  const totalExpenses = user.budget.expenses.reduce((sum: number, item: any) => sum + Number(item.amount), 0)
  const balance = totalIncome - totalExpenses

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard" className="text-white hover:text-gray-200 transition-colors duration-300 mb-4 inline-block">
          <ArrowLeft className="inline-block mr-2" />
          Back to Dashboard
        </Link>
        <h1 className="text-4xl font-bold mb-8 text-white">Financial Reports</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-6 rounded-2xl shadow-xl"
          >
            <TrendingUp className="text-green-400 mb-4" size={48} />
            <h2 className="text-xl font-semibold mb-2 text-white">Total Income</h2>
            <p className="text-2xl text-green-400">${totalIncome.toFixed(2)}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-6 rounded-2xl shadow-xl"
          >
            <Wallet className="text-red-400 mb-4" size={48} />
            <h2 className="text-xl font-semibold mb-2 text-white">Total Expenses</h2>
            <p className="text-2xl text-red-400">${totalExpenses.toFixed(2)}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-6 rounded-2xl shadow-xl"
          >
            <PiggyBank className="text-blue-400 mb-4" size={48} />
            <h2 className="text-xl font-semibold mb-2 text-white">Balance</h2>
            <p className={`text-2xl ${balance >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
              ${balance.toFixed(2)}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

