import { reactive, ref } from 'vue'

export interface User {
  id: string
  name: string
  phone: string
  email: string
  walletBalance: number
  status: 'active' | 'suspended' | 'banned'
  lastVisit: string
  createdAt: string
  country: string
  currency: string
}

export interface Bet {
  id: string
  userId: string
  ticketId: string
  match: string
  selection: string
  odds: number
  stake: number
  potentialWin: number
  status: 'pending' | 'won' | 'lost'
  sport: string
  placedAt: string
  settledAt?: string
}

export interface Transaction {
  id: string
  userId: string
  type: 'deposit' | 'withdrawal'
  amount: number
  method: string
  status: 'completed' | 'pending' | 'failed'
  reference: string
  createdAt: string
}

export interface Activity {
  id: string
  userId: string
  action: string
  details: string
  page: string
  ip: string
  createdAt: string
}

const now = new Date()
const d = (daysAgo: number, hoursAgo = 0) => {
  const date = new Date(now)
  date.setDate(date.getDate() - daysAgo)
  date.setHours(date.getHours() - hoursAgo)
  return date.toISOString()
}

export const users = reactive<User[]>([
  { id: 'u1', name: 'James Okello', phone: '+256 700 123 456', email: 'james.okello@email.com', walletBalance: 45000, status: 'active', lastVisit: d(0, 1), createdAt: d(120), country: 'Uganda', currency: 'UGX' },
  { id: 'u2', name: 'Mary Achieng', phone: '+256 752 234 567', email: 'mary.achieng@email.com', walletBalance: 12500, status: 'active', lastVisit: d(0, 3), createdAt: d(90), country: 'Uganda', currency: 'UGX' },
  { id: 'u3', name: 'Peter Muwanga', phone: '+256 774 345 678', email: 'peter.muwanga@email.com', walletBalance: 78000, status: 'active', lastVisit: d(1), createdAt: d(60), country: 'Uganda', currency: 'UGX' },
  { id: 'u4', name: 'Grace Namukasa', phone: '+256 703 456 789', email: 'grace.namukasa@email.com', walletBalance: 3200, status: 'suspended', lastVisit: d(5), createdAt: d(200), country: 'Uganda', currency: 'UGX' },
  { id: 'u5', name: 'David Ssemakula', phone: '+256 781 567 890', email: 'david.ssemakula@email.com', walletBalance: 155000, status: 'active', lastVisit: d(0, 0), createdAt: d(30), country: 'Uganda', currency: 'UGX' },
  { id: 'u6', name: 'Fatima Nalubega', phone: '+256 755 678 901', email: 'fatima.nalubega@email.com', walletBalance: 0, status: 'banned', lastVisit: d(14), createdAt: d(300), country: 'Uganda', currency: 'UGX' },
  { id: 'u7', name: 'Samuel Kizito', phone: '+256 712 789 012', email: 'samuel.kizito@email.com', walletBalance: 23000, status: 'active', lastVisit: d(0, 2), createdAt: d(45), country: 'Uganda', currency: 'UGX' },
  { id: 'u8', name: 'Ruth Atim', phone: '+256 790 890 123', email: 'ruth.atim@email.com', walletBalance: 67500, status: 'active', lastVisit: d(2), createdAt: d(150), country: 'Uganda', currency: 'UGX' },
])

export const bets = reactive<Bet[]>([
  { id: 'b1', userId: 'u1', ticketId: 'TK-001234', match: 'New Zealand vs Belgium', selection: 'Belgium Win', odds: 1.17, stake: 10000, potentialWin: 11700, status: 'pending', sport: 'Soccer', placedAt: d(0, 2) },
  { id: 'b2', userId: 'u1', ticketId: 'TK-001235', match: 'Egypt vs IR Iran', selection: 'Draw', odds: 3.40, stake: 5000, potentialWin: 17000, status: 'won', sport: 'Soccer', placedAt: d(1), settledAt: d(0, 12) },
  { id: 'b3', userId: 'u2', ticketId: 'TK-001236', match: 'Croatia vs Ghana', selection: 'Croatia Win', odds: 1.80, stake: 20000, potentialWin: 36000, status: 'lost', sport: 'Soccer', placedAt: d(2), settledAt: d(1) },
  { id: 'b4', userId: 'u3', ticketId: 'TK-001237', match: 'Panama vs England', selection: 'England Win', odds: 1.17, stake: 50000, potentialWin: 58500, status: 'won', sport: 'Soccer', placedAt: d(0, 5), settledAt: d(0, 2) },
  { id: 'b5', userId: 'u5', ticketId: 'TK-001238', match: 'Colombia vs Portugal', selection: 'Portugal Win', odds: 1.90, stake: 100000, potentialWin: 190000, status: 'pending', sport: 'Soccer', placedAt: d(0, 1) },
  { id: 'b6', userId: 'u7', ticketId: 'TK-001239', match: 'Algeria vs Austria', selection: 'Algeria Win', odds: 3.90, stake: 8000, potentialWin: 31200, status: 'lost', sport: 'Soccer', placedAt: d(3), settledAt: d(2) },
  { id: 'b7', userId: 'u8', ticketId: 'TK-001240', match: 'Brazil vs Japan', selection: 'Brazil Win', odds: 1.72, stake: 30000, potentialWin: 51600, status: 'pending', sport: 'Soccer', placedAt: d(0, 0) },
  { id: 'b8', userId: 'u2', ticketId: 'TK-001241', match: 'Jordan vs Argentina', selection: 'Argentina Win', odds: 1.16, stake: 15000, potentialWin: 17400, status: 'won', sport: 'Soccer', placedAt: d(4), settledAt: d(3) },
  { id: 'b9', userId: 'u1', ticketId: 'TK-001242', match: 'Congo DR vs Uzbekistan', selection: 'Uzbekistan Win', odds: 2.10, stake: 7000, potentialWin: 14700, status: 'pending', sport: 'Soccer', placedAt: d(0, 3) },
  { id: 'b10', userId: 'u3', ticketId: 'TK-001243', match: 'South Africa vs Canada', selection: 'Draw', odds: 3.45, stake: 25000, potentialWin: 86250, status: 'lost', sport: 'Soccer', placedAt: d(5), settledAt: d(4) },
])

export const transactions = reactive<Transaction[]>([
  { id: 'tx1', userId: 'u1', type: 'deposit', amount: 50000, method: 'Mobile Money', status: 'completed', reference: 'MM-7841234', createdAt: d(0, 2) },
  { id: 'tx2', userId: 'u1', type: 'withdrawal', amount: 20000, method: 'Mobile Money', status: 'completed', reference: 'MM-7841235', createdAt: d(1) },
  { id: 'tx3', userId: 'u2', type: 'deposit', amount: 30000, method: 'Mobile Money', status: 'completed', reference: 'MM-7841236', createdAt: d(0, 5) },
  { id: 'tx4', userId: 'u3', type: 'deposit', amount: 100000, method: 'Bank Transfer', status: 'completed', reference: 'BK-1234567', createdAt: d(0, 1) },
  { id: 'tx5', userId: 'u5', type: 'deposit', amount: 200000, method: 'Mobile Money', status: 'completed', reference: 'MM-7841238', createdAt: d(0, 0) },
  { id: 'tx6', userId: 'u5', type: 'withdrawal', amount: 50000, method: 'Mobile Money', status: 'pending', reference: 'MM-7841239', createdAt: d(0, 1) },
  { id: 'tx7', userId: 'u7', type: 'deposit', amount: 25000, method: 'Mobile Money', status: 'completed', reference: 'MM-7841240', createdAt: d(1) },
  { id: 'tx8', userId: 'u8', type: 'deposit', amount: 80000, method: 'Bank Transfer', status: 'completed', reference: 'BK-1234568', createdAt: d(2) },
  { id: 'tx9', userId: 'u8', type: 'withdrawal', amount: 30000, method: 'Mobile Money', status: 'failed', reference: 'MM-7841242', createdAt: d(0, 6) },
  { id: 'tx10', userId: 'u2', type: 'withdrawal', amount: 10000, method: 'Mobile Money', status: 'completed', reference: 'MM-7841243', createdAt: d(3) },
  { id: 'tx11', userId: 'u3', type: 'withdrawal', amount: 40000, method: 'Bank Transfer', status: 'completed', reference: 'BK-1234569', createdAt: d(1) },
  { id: 'tx12', userId: 'u1', type: 'deposit', amount: 15000, method: 'Mobile Money', status: 'completed', reference: 'MM-7841244', createdAt: d(7) },
])

export const activities = reactive<Activity[]>([
  { id: 'ac1', userId: 'u1', action: 'Placed Bet', details: 'Placed bet on New Zealand vs Belgium (TK-001234)', page: '/betting', ip: '196.43.12.1', createdAt: d(0, 2) },
  { id: 'ac2', userId: 'u1', action: 'Deposit', details: 'Deposited UGX 50,000 via Mobile Money', page: '/wallet', ip: '196.43.12.1', createdAt: d(0, 2) },
  { id: 'ac3', userId: 'u1', action: 'Login', details: 'User logged in successfully', page: '/login', ip: '196.43.12.1', createdAt: d(0, 3) },
  { id: 'ac4', userId: 'u2', action: 'Login', details: 'User logged in successfully', page: '/login', ip: '41.210.45.22', createdAt: d(0, 3) },
  { id: 'ac5', userId: 'u2', action: 'Viewed Match', details: 'Viewed Croatia vs Ghana match details', page: '/match/3', ip: '41.210.45.22', createdAt: d(0, 4) },
  { id: 'ac6', userId: 'u3', action: 'Withdrawal Request', details: 'Requested withdrawal of UGX 40,000 via Bank Transfer', page: '/wallet', ip: '105.17.89.33', createdAt: d(1) },
  { id: 'ac7', userId: 'u5', action: 'Placed Bet', details: 'Placed bet on Colombia vs Portugal (TK-001238)', page: '/betting', ip: '196.200.34.10', createdAt: d(0, 1) },
  { id: 'ac8', userId: 'u5', action: 'Deposit', details: 'Deposited UGX 200,000 via Mobile Money', page: '/wallet', ip: '196.200.34.10', createdAt: d(0, 0) },
  { id: 'ac9', userId: 'u7', action: 'Login', details: 'User logged in successfully', page: '/login', ip: '41.75.120.55', createdAt: d(0, 2) },
  { id: 'ac10', userId: 'u8', action: 'Viewed Match', details: 'Viewed Brazil vs Japan match details', page: '/match/9', ip: '196.46.78.90', createdAt: d(0, 0) },
  { id: 'ac11', userId: 'u1', action: 'Viewed Odds', details: 'Clicked on Egypt vs IR Iran odds', page: '/betting', ip: '196.43.12.1', createdAt: d(0, 2) },
  { id: 'ac12', userId: 'u3', action: 'Won Bet', details: 'Bet TK-001237 won UGX 58,500', page: '/my-bets', ip: '105.17.89.33', createdAt: d(0, 2) },
])

export const siteSettings = reactive({
  siteName: 'BetWin',
  siteUrl: 'https://betwin.ug',
  adminEmail: 'admin@betwin.ug',
  adminPassword: 'admin123',
  currency: 'UGX',
  minDeposit: 1000,
  maxDeposit: 10000000,
  minWithdrawal: 5000,
  maxWithdrawal: 5000000,
  minBet: 500,
  maxBet: 1000000,
  maxOdds: 500,
  maintenanceMode: false,
  registrationEnabled: true,
  depositEnabled: true,
  withdrawalEnabled: true,
  bettingEnabled: true,
  siteBalance: 15000000,
})

export const adminAuth = reactive({
  isLoggedIn: false,
  username: '',
})

export function adminLogin(username: string, password: string): boolean {
  if (username === 'admin' && password === siteSettings.adminPassword) {
    adminAuth.isLoggedIn = true
    adminAuth.username = username
    return true
  }
  return false
}

export function adminLogout() {
  adminAuth.isLoggedIn = false
  adminAuth.username = ''
}

export function getUserById(id: string): User | undefined {
  return users.find(u => u.id === id)
}

export function getUserBets(userId: string): Bet[] {
  return bets.filter(b => b.userId === userId)
}

export function getUserTransactions(userId: string): Transaction[] {
  return transactions.filter(t => t.userId === userId)
}

export function getUserActivities(userId: string): Activity[] {
  return activities.filter(a => a.userId === userId)
}

export function adjustWallet(userId: string, amount: number, type: 'add' | 'deduct', method = 'Admin Adjustment'): void {
  const user = users.find(u => u.id === userId)
  if (!user) return
  if (type === 'add') {
    user.walletBalance += amount
    transactions.unshift({
      id: 'tx' + Date.now(),
      userId,
      type: 'deposit',
      amount,
      method,
      status: 'completed',
      reference: 'ADM-' + Date.now(),
      createdAt: new Date().toISOString(),
    })
    activities.unshift({
      id: 'ac' + Date.now(),
      userId,
      action: 'Admin Credit',
      details: `Admin added UGX ${amount.toLocaleString()} to wallet`,
      page: '/admin',
      ip: '127.0.0.1',
      createdAt: new Date().toISOString(),
    })
  } else {
    user.walletBalance = Math.max(0, user.walletBalance - amount)
    transactions.unshift({
      id: 'tx' + Date.now(),
      userId,
      type: 'withdrawal',
      amount,
      method,
      status: 'completed',
      reference: 'ADM-' + Date.now(),
      createdAt: new Date().toISOString(),
    })
    activities.unshift({
      id: 'ac' + Date.now(),
      userId,
      action: 'Admin Deduct',
      details: `Admin deducted UGX ${amount.toLocaleString()} from wallet`,
      page: '/admin',
      ip: '127.0.0.1',
      createdAt: new Date().toISOString(),
    })
  }
}

export function formatDate(iso: string): string {
  const date = new Date(iso)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  return date.toLocaleDateString('en-UG', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function formatFullDate(iso: string): string {
  return new Date(iso).toLocaleString('en-UG', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}
