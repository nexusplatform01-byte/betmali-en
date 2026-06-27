---
name: Firebase Auth & Firestore wiring
description: Key decisions about BetWin Firebase integration, auth, balance logic, and admin data patterns.
---

## Auth
- Firebase projectId: bet-mali, hardcoded config in `artifacts/betwin/src/lib/firebase.ts`
- Email/password + Google login. Phone is stored as a Firestore profile field only (not Firebase phone auth).
- After Google login, if no phone on profile, `needsPhone` flag prompts phone entry.
- Admin email: admin@betwin.ug (handled separately in adminData.ts, not Firebase Auth).

## Balance logic
- `balance` = real withdrawable balance. `bonusBalance` = betting-only bonus (UGX 1,000 on register).
- `deductForBet(stake)` drains `bonusBalance` first, then `balance`.
- Winnings always go to real `balance`. Withdrawals only from real `balance`.
- `totalBalance` = computed `balance + bonusBalance`, exported from useAuthModal both as module-level and in the return object.

## useAuthModal exports (inside the return object)
- `modalType, currentUser, needsPhone, authLoading, userTransactions, totalBalance`
- `openLogin, openRegister, closeModal, login, logout`
- `addToBalance, deductForBet`
- `loginWithEmail, registerWithEmail, loginWithGoogle, savePhone`
- `depositFunds, withdrawFunds, cashoutFunds, updateProfile`

## Admin data (adminData.ts)
- All collections subscribed via Firestore `onSnapshot` on admin login.
- `settleBet(betId, status)` — updates bet doc AND credits user balance on win.
- `updateTransactionStatus(txId, status)` — updates Firestore.
- `adjustWallet(userId, amount, type, note)` — writes to Firestore, adds tx doc.
- `updateUserStatus(userId, status)` — writes to Firestore.
- `saveSiteSettings(partial)` — merges into siteSettings Firestore doc.
- `withdrawSiteBalance(amount, method)` — deducts from siteSettings.siteBalance.

**Why:** All mutations must go through Firestore so admin changes reflect in real-time across sessions.

## No emojis policy
- All pages use SVG icons inline. No Unicode emoji anywhere.
- Confirmed: AdminLayout, TopNav, AuthModal, Dashboard, BetsPage, TransactionsPage, UserDetail, WalletPage, SettingsPage, UsersPage, ProfilePage, RightSidebar.
