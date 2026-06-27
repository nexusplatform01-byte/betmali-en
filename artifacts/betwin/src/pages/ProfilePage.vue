<template>
  <div class="profile-app">
    <TopNav />
    <div class="profile-layout">

      <!-- ── SIDEBAR ── -->
      <aside class="profile-sidebar">
        <div class="ps-user">
          <div class="ps-av">{{ avatarLetter }}</div>
          <div class="ps-info">
            <div class="ps-name">{{ currentUser?.name }}</div>
            <div class="ps-bal">
              <span v-if="balVis">UGX {{ currentUser?.balance.toLocaleString() }}</span>
              <span v-else class="ps-bal-hidden">UGX ••••••</span>
              <button class="ps-eye" @click="balVis=!balVis">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <template v-if="balVis"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></template>
                  <template v-else><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></template>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <nav class="ps-nav">
          <button v-for="t in tabs" :key="t.id" class="psnav-btn" :class="{active: activeTab===t.id}" @click="activeTab=t.id">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <template v-if="t.id==='overview'"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></template>
              <template v-else-if="t.id==='wallet'"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></template>
              <template v-else-if="t.id==='bets'"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></template>
              <template v-else-if="t.id==='transactions'"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></template>
              <template v-else-if="t.id==='account'"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></template>
              <template v-else-if="t.id==='settings'"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></template>
            </svg>
            <span>{{ t.label }}</span>
          </button>
        </nav>

        <button class="ps-back" @click="$router.push('/')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          Back to Betting
        </button>
      </aside>

      <!-- ── MAIN ── -->
      <main class="profile-main">

        <!-- OVERVIEW -->
        <section v-if="activeTab==='overview'" class="tab-sec">
          <div class="sec-title">Overview</div>
          <div class="ov-hero">
            <div class="ov-av">{{ avatarLetter }}</div>
            <div><div class="ov-name">{{ currentUser?.name }}</div><div class="ov-since">Member since June 2026</div></div>
            <div class="ov-bal-pill">UGX {{ currentUser?.balance.toLocaleString() }}</div>
          </div>
          <div class="stats-grid">
            <div class="sc"><div class="sc-v">{{ bets.length }}</div><div class="sc-l">Total Bets</div></div>
            <div class="sc won"><div class="sc-v">{{ bets.filter(b=>b.status==='won').length }}</div><div class="sc-l">Won</div></div>
            <div class="sc lost"><div class="sc-v">{{ bets.filter(b=>b.status==='lost').length }}</div><div class="sc-l">Lost</div></div>
            <div class="sc pend"><div class="sc-v">{{ bets.filter(b=>b.status==='pending').length }}</div><div class="sc-l">Pending</div></div>
          </div>
          <div class="ov-wr" v-if="bets.filter(b=>b.status!=='pending').length">
            <span class="wr-lbl">Win Rate</span>
            <div class="wr-bar"><div class="wr-fill" :style="{width:winRatePct+'%'}"></div></div>
            <span class="wr-v">{{ winRatePct }}%</span>
          </div>
          <div class="sub-title">Recent Bets</div>
          <div class="recent-list">
            <div v-for="b in bets.slice(0,3)" :key="b.id" class="rb-row" @click="openTicket(b)">
              <div class="rb-l">
                <span class="rb-id">TICKET #{{ b.id }}</span>
                <span class="rb-meta">{{ b.type.toUpperCase() }} · {{ b.selections.length }} picks</span>
              </div>
              <span class="sbadge" :class="b.status">{{ statusLabel(b.status) }}</span>
            </div>
          </div>
          <div class="ov-actions">
            <button class="ov-btn dep" @click="openWalletModal('deposit')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="8 12 12 16 16 12"/><line x1="12" y1="8" x2="12" y2="16"/></svg>
              Deposit
            </button>
            <button class="ov-btn wdr" @click="openWalletModal('withdraw')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="16 12 12 8 8 12"/><line x1="12" y1="16" x2="12" y2="8"/></svg>
              Withdraw
            </button>
            <button class="ov-btn bets" @click="activeTab='bets'">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
              My Bets
            </button>
          </div>
        </section>

        <!-- WALLET -->
        <section v-else-if="activeTab==='wallet'" class="tab-sec">
          <div class="sec-title">Wallet</div>
          <div class="wallet-hero">
            <div class="wh-info">
              <div class="wh-lbl">Available Balance</div>
              <div class="wh-amt">UGX {{ currentUser?.balance.toLocaleString() }}</div>
            </div>
            <div class="wh-btns">
              <button class="wh-btn dep" @click="openWalletModal('deposit')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="8 12 12 16 16 12"/><line x1="12" y1="8" x2="12" y2="16"/></svg>
                Deposit
              </button>
              <button class="wh-btn wdr" @click="openWalletModal('withdraw')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="16 12 12 8 8 12"/><line x1="12" y1="16" x2="12" y2="8"/></svg>
                Withdraw
              </button>
            </div>
          </div>
          <div class="sub-title">Transaction History</div>
          <div class="tx-list">
            <div v-for="tx in transactions" :key="tx.id" class="tx-row">
              <div class="tx-dot" :class="tx.positive?'pos':'neg'"></div>
              <div class="tx-body"><div class="tx-name">{{ tx.name }}</div><div class="tx-date">{{ fmtDate(tx.date) }}</div></div>
              <div class="tx-amt" :class="tx.positive?'pos':'neg'">{{ tx.positive?'+':'-' }}UGX {{ tx.amount.toLocaleString() }}</div>
            </div>
          </div>
        </section>

        <!-- MY BETS -->
        <section v-else-if="activeTab==='bets'" class="tab-sec">
          <div class="sec-title">My Bets</div>
          <div class="filters">
            <button v-for="f in betFilters" :key="f" class="fbtn" :class="{active:betFilter===f}" @click="betFilter=f">{{ f }}</button>
          </div>
          <div v-if="!filteredBets.length" class="empty-msg">No {{ betFilter.toLowerCase() }} bets yet.</div>
          <div class="bets-list">
            <div v-for="b in filteredBets" :key="b.id" class="tkt-card" @click="openTicket(b)">
              <div class="tkt-l">
                <div class="tkt-top">
                  <span class="tkt-id">TICKET #{{ b.id }}</span>
                  <span class="tkt-type">{{ b.type.toUpperCase() }} · {{ b.selections.length }} picks · {{ b.combinedOdds.toFixed(2) }}x</span>
                </div>
                <div class="tkt-matches">{{ b.selections.slice(0,2).map(s=>s.matchName).join(' · ') }}{{ b.selections.length>2?` +${b.selections.length-2}`:'' }}</div>
              </div>
              <div class="tkt-r">
                <span class="sbadge" :class="b.status">{{ statusLabel(b.status) }}</span>
                <div class="tkt-pot">UGX {{ b.potentialReturn.toLocaleString() }}</div>
              </div>
            </div>
          </div>
        </section>

        <!-- TRANSACTIONS -->
        <section v-else-if="activeTab==='transactions'" class="tab-sec">
          <div class="sec-title">Transactions</div>
          <div class="filters">
            <button v-for="f in txFilters" :key="f" class="fbtn" :class="{active:txFilter===f}" @click="txFilter=f">{{ f }}</button>
          </div>
          <div class="tx-list">
            <div v-for="tx in filteredTx" :key="tx.id" class="tx-row">
              <div class="tx-dot" :class="tx.positive?'pos':'neg'"></div>
              <div class="tx-body"><div class="tx-name">{{ tx.name }}</div><div class="tx-date">{{ fmtDate(tx.date) }}</div></div>
              <div class="tx-amt" :class="tx.positive?'pos':'neg'">{{ tx.positive?'+':'-' }}UGX {{ tx.amount.toLocaleString() }}</div>
            </div>
          </div>
        </section>

        <!-- ACCOUNT -->
        <section v-else-if="activeTab==='account'" class="tab-sec">
          <div class="sec-title">Account</div>
          <div class="acc-hero">
            <div class="acc-av">{{ avatarLetter }}</div>
            <div><div class="acc-name">{{ currentUser?.name }}</div><div class="acc-since">Member since June 2026</div></div>
          </div>
          <div class="fc">
            <div class="fc-title">Personal Information</div>
            <div class="fg"><label>Full Name</label><input v-model="accName" class="pi" type="text"/></div>
            <div class="fg"><label>Phone</label><input v-model="accPhone" class="pi" type="tel"/></div>
            <div class="fg"><label>Email</label><input v-model="accEmail" class="pi" type="email" placeholder="you@email.com"/></div>
            <div class="fg"><label>Date of Birth</label><input v-model="accDob" class="pi" type="date"/></div>
            <button class="ps-btn" @click="saveAccount">Save Changes</button>
            <div v-if="accMsg" class="pmsg ok">{{ accMsg }}</div>
          </div>
          <div class="fc" style="margin-top:10px">
            <div class="fc-title">Change Password</div>
            <div class="fg"><label>Current Password</label><input class="pi" type="password" placeholder="••••••••"/></div>
            <div class="fg"><label>New Password</label><input class="pi" type="password" placeholder="••••••••"/></div>
            <div class="fg"><label>Confirm Password</label><input class="pi" type="password" placeholder="••••••••"/></div>
            <button class="ps-btn" @click="accMsg='Password updated!'">Update Password</button>
          </div>
        </section>

        <!-- SETTINGS -->
        <section v-else-if="activeTab==='settings'" class="tab-sec">
          <div class="sec-title">Settings</div>
          <div class="fc">
            <div class="fc-title">Notifications</div>
            <div v-for="n in notifications" :key="n.id" class="setting-row">
              <span class="sr-lbl">{{ n.label }}</span>
              <button class="tgl" :class="{on:n.enabled}" @click="n.enabled=!n.enabled"><span class="tgl-k"></span></button>
            </div>
          </div>
          <div class="fc" style="margin-top:10px">
            <div class="fc-title">Display</div>
            <div class="setting-row">
              <span class="sr-lbl">Odds Format</span>
              <div class="seg">
                <button v-for="o in ['Decimal','Fractional','American']" :key="o" class="seg-b" :class="{active:oddsFormat===o}" @click="oddsFormat=o">{{ o }}</button>
              </div>
            </div>
            <div class="setting-row">
              <span class="sr-lbl">Theme</span>
              <div class="seg"><button class="seg-b active">Dark</button><button class="seg-b">Light</button></div>
            </div>
          </div>
          <div class="fc" style="margin-top:10px">
            <div class="fc-title">Responsible Gambling</div>
            <div class="fg"><label>Daily Deposit Limit (UGX)</label><input v-model.number="dailyLimit" class="pi" type="number" placeholder="e.g. 100,000"/></div>
            <button class="ps-btn" @click="accMsg2='Limit saved!'">Save Limit</button>
            <div v-if="accMsg2" class="pmsg ok" style="margin-top:6px">{{ accMsg2 }}</div>
            <div class="rg-warn">
              <svg viewBox="0 0 24 24" fill="none" stroke="#e84c6b" stroke-width="2" stroke-linecap="round" width="16" height="16"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              <div><div class="rg-title">Self Exclusion</div><div class="rg-sub">Restrict your account from betting temporarily or permanently.</div></div>
            </div>
            <button class="ps-btn danger">Request Self Exclusion</button>
          </div>
        </section>

      </main>
    </div>

    <!-- ═══ WALLET FLOAT MODAL ═══ -->
    <teleport to="body">
      <transition name="wm-fade">
        <div v-if="walletModal" class="wm-backdrop" @click.self="walletModal=null">
          <div class="wm-card">
            <div class="wm-hdr">
              <div class="wm-tabs">
                <button :class="{active:walletModal==='deposit'}" @click="walletModal='deposit'">Deposit</button>
                <button :class="{active:walletModal==='withdraw'}" @click="walletModal='withdraw'">Withdraw</button>
              </div>
              <button class="wm-x" @click="walletModal=null">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div class="wm-body">
              <!-- DEPOSIT -->
              <template v-if="walletModal==='deposit'">
                <div class="wm-bal-row">Balance: <strong>UGX {{ currentUser?.balance.toLocaleString() }}</strong></div>
                <div class="fg"><label>Amount (UGX)</label><input v-model.number="depositAmount" class="pi" type="number" placeholder="Min 1,000"/></div>
                <div class="wm-quick">
                  <button v-for="a in [5000,10000,20000,50000,100000]" :key="a" class="wm-qa" @click="depositAmount=a">{{ a>=1000?(a/1000)+'K':a }}</button>
                </div>
                <div class="fg">
                  <label>Payment Method</label>
                  <div class="wm-methods">
                    <button v-for="m in paymentMethods" :key="m.id" class="wm-mth" :class="{active:selectedPayment===m.id}" @click="selectedPayment=m.id">{{ m.name }}</button>
                  </div>
                </div>
                <div class="fg" v-if="selectedPayment!=='card'"><label>Phone Number</label><input v-model="depositPhone" class="pi" type="tel" placeholder="07XXXXXXXX"/></div>
                <div class="fg" v-else><label>Card Number</label><input v-model="cardNumber" class="pi" type="text" placeholder="0000 0000 0000 0000"/></div>
                <button class="wm-submit dep" @click="handleDeposit" :disabled="!depositAmount||depositAmount<1000">
                  Deposit UGX {{ depositAmount ? depositAmount.toLocaleString() : '0' }}
                </button>
              </template>
              <!-- WITHDRAW -->
              <template v-else>
                <div class="wm-bal-row">Balance: <strong>UGX {{ currentUser?.balance.toLocaleString() }}</strong></div>
                <div class="fg"><label>Amount (UGX)</label><input v-model.number="withdrawAmount" class="pi" type="number" placeholder="Min 1,000" :max="currentUser?.balance"/></div>
                <div class="wm-quick">
                  <button v-for="a in [5000,10000,20000,50000]" :key="a" class="wm-qa" @click="withdrawAmount=a">{{ a>=1000?(a/1000)+'K':a }}</button>
                </div>
                <div class="fg">
                  <label>Method</label>
                  <div class="wm-methods">
                    <button v-for="m in paymentMethods" :key="m.id" class="wm-mth" :class="{active:selectedWithdraw===m.id}" @click="selectedWithdraw=m.id">{{ m.name }}</button>
                  </div>
                </div>
                <div class="fg"><label>Phone / Account</label><input v-model="withdrawPhone" class="pi" type="tel" placeholder="07XXXXXXXX"/></div>
                <button class="wm-submit wdr" @click="handleWithdraw" :disabled="!withdrawAmount||withdrawAmount<1000||withdrawAmount>(currentUser?.balance??0)">
                  Withdraw UGX {{ withdrawAmount ? withdrawAmount.toLocaleString() : '0' }}
                </button>
              </template>
              <div v-if="walletMsg" class="pmsg" :class="walletMsgType">{{ walletMsg }}</div>
            </div>
          </div>
        </div>
      </transition>
    </teleport>

    <!-- ═══ BET TICKET MODAL ═══ -->
    <transition name="modal-fade">
      <div v-if="selectedTicket" class="tm-backdrop" @click.self="selectedTicket=null">
        <div class="tm-modal">
          <!-- Header bar -->
          <div class="tm-hdr">
            <div class="tm-hdr-l">
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" width="14" height="14"><path d="M2 20h.01M7 20v-4"/><path d="M12 20V10"/><path d="M17 20V4"/><path d="M22 20v-8"/></svg>
              {{ betTypeLabel(selectedTicket) }} | COMBO {{ selectedTicket.selections.length }} EVENTS
            </div>
            <button class="tm-x" @click="selectedTicket=null">
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <!-- Body: two columns -->
          <div class="tm-cols">
            <!-- Left: match list -->
            <div class="tm-left">
              <div v-for="(sel, i) in selectedTicket.selections" :key="sel.key" class="tmm-row">
                <div class="tmm-meta">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="10" height="10"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {{ fmtDateShort(selectedTicket.timestamp) }}
                </div>
                <div class="tmm-teams">{{ formatMatchName(sel.matchName) }}</div>
                <div class="tmm-pick-row">
                  <span class="tmm-pick">{{ sel.market }} : <strong>{{ sel.label }}</strong></span>
                  <span class="tmm-odds">{{ sel.odds }}</span>
                </div>
                <div class="tmm-sel-st" :class="selectedTicket.selectionResults[i]?.status??'pending'">
                  {{ statusLabel(selectedTicket.selectionResults[i]?.status??'pending') }}
                </div>
              </div>
            </div>
            <!-- Right: info panel -->
            <div class="tm-right">
              <div class="tm-stub">
                <svg viewBox="0 0 64 48" fill="none" width="56" height="42">
                  <rect x="1" y="1" width="62" height="46" rx="4" fill="#1a1d2e" stroke="#2e3355"/>
                  <line x1="18" y1="1" x2="18" y2="47" stroke="#2e3355" stroke-dasharray="4 3"/>
                  <circle cx="9" cy="24" r="4" fill="#0f1120"/>
                  <line x1="22" y1="12" x2="58" y2="12" stroke="#3a4260"/>
                  <line x1="22" y1="20" x2="58" y2="20" stroke="#3a4260"/>
                  <line x1="22" y1="28" x2="58" y2="28" stroke="#3a4260"/>
                  <line x1="22" y1="36" x2="46" y2="36" stroke="#3a4260"/>
                  <rect x="4" y="10" width="8" height="4" rx="1" fill="#e84c6b" opacity="0.7"/>
                  <rect x="4" y="18" width="8" height="4" rx="1" fill="#e84c6b" opacity="0.4"/>
                  <rect x="4" y="26" width="8" height="4" rx="1" fill="#e84c6b" opacity="0.2"/>
                </svg>
              </div>
              <div class="tm-status-row">
                <span class="tm-st-lbl">STATUS:</span>
                <span class="tm-st-val" :class="selectedTicket.status">{{ statusLabel(selectedTicket.status).toUpperCase() }}</span>
              </div>
              <div class="tm-info">
                <div class="tmf"><span>TOTAL ODDS</span><span class="tmf-v odds">{{ selectedTicket.combinedOdds.toFixed(2) }}</span></div>
                <div class="tmf"><span>STAKE</span><span class="tmf-v">{{ selectedTicket.stake.toLocaleString() }} UGX</span></div>
                <div v-if="selectedTicket.bonusPct>0" class="tmf bonus"><span>BONUS</span><span class="tmf-v green">+{{ selectedTicket.bonusPct }}%</span></div>
                <div class="tmf total"><span>POSSIBLE WIN</span><span class="tmf-v green">{{ selectedTicket.potentialReturn.toLocaleString() }} UGX</span></div>
              </div>
              <div class="tm-acts">
                <button v-if="selectedTicket.status==='pending'" class="tma cashout" @click="showCashout=!showCashout">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="12" height="12"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  Cashout
                </button>
                <button class="tma share" @click="shareTicket">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="12" height="12"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                  Share
                </button>
                <button class="tma reuse" @click="reuseBet(selectedTicket)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="12" height="12"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.29"/></svg>
                  Reuse
                </button>
              </div>
              <transition name="slide-down">
                <div v-if="showCashout&&selectedTicket.status==='pending'" class="cp">
                  <div class="cp-lbl">Early Cashout Value</div>
                  <div class="cp-amt">UGX {{ Math.round(selectedTicket.stake * 0.85).toLocaleString() }}</div>
                  <div class="cp-note">{{ Math.round((selectedTicket.stake * 0.85 / selectedTicket.potentialReturn)*100) }}% of potential win</div>
                  <button class="cp-btn" @click="confirmCashout">Confirm Cashout</button>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import TopNav from '@/components/TopNav.vue'
import { useAuthModal } from '@/composables/useAuthModal'
import { useBets, type PlacedBet } from '@/composables/useBets'
import { useBetSlip } from '@/composables/useBetSlip'

const router = useRouter()
const { currentUser, addToBalance } = useAuthModal()
const { bets, addBet: saveBet } = useBets()
const { addBet: addToBetSlip } = useBetSlip()

if (!currentUser.value) router.push('/')

const activeTab = ref('overview')
const balVis = ref(true)
const betFilter = ref('All')
const txFilter = ref('All')
const selectedTicket = ref<PlacedBet | null>(null)
const showCashout = ref(false)
const walletModal = ref<'deposit' | 'withdraw' | null>(null)

const tabs = [
  { id: 'overview',     label: 'Overview' },
  { id: 'wallet',       label: 'Wallet' },
  { id: 'bets',         label: 'My Bets' },
  { id: 'transactions', label: 'Transactions' },
  { id: 'account',      label: 'Account' },
  { id: 'settings',     label: 'Settings' },
]

const avatarLetter = computed(() => currentUser.value?.name.charAt(0).toUpperCase() ?? '?')

const winRatePct = computed(() => {
  const settled = bets.value.filter(b => b.status !== 'pending')
  if (!settled.length) return 0
  return Math.round((bets.value.filter(b => b.status === 'won').length / settled.length) * 100)
})

function statusLabel(s: string) {
  if (s === 'pending') return 'PREPARING'
  if (s === 'won') return 'WON'
  if (s === 'lost') return 'LOST'
  return s.toUpperCase()
}

function betTypeLabel(b: PlacedBet) {
  if (b.type === 'single') return 'SINGLE'
  if (b.type === 'system') return 'SYSTEM'
  return 'PREMATCH'
}

function formatMatchName(name: string) {
  return name.toUpperCase().replace(/ VS /g, ' - ').replace(/ vs /g, ' - ')
}

// ── WALLET ──
const depositAmount = ref<number | null>(null)
const depositPhone = ref('')
const cardNumber = ref('')
const withdrawAmount = ref<number | null>(null)
const withdrawPhone = ref('')
const walletMsg = ref('')
const walletMsgType = ref('ok')
const selectedPayment = ref('mtn')
const selectedWithdraw = ref('mtn')

const paymentMethods = [
  { id: 'mtn', name: 'MTN Money' },
  { id: 'airtel', name: 'Airtel Money' },
  { id: 'card', name: 'Card' },
]

function openWalletModal(type: 'deposit' | 'withdraw') {
  walletModal.value = type
  walletMsg.value = ''
}

function handleDeposit() {
  if (!depositAmount.value || depositAmount.value < 1000) return
  addToBalance(depositAmount.value)
  walletMsg.value = `UGX ${depositAmount.value.toLocaleString()} deposited successfully!`
  walletMsgType.value = 'ok'
  transactions.unshift({ id: Date.now(), type: 'deposit', name: 'Deposit via ' + paymentMethods.find(p => p.id === selectedPayment.value)?.name, amount: depositAmount.value, positive: true, date: new Date() })
  depositAmount.value = null
  depositPhone.value = ''
  setTimeout(() => { walletMsg.value = ''; walletModal.value = null }, 2500)
}

function handleWithdraw() {
  if (!withdrawAmount.value || withdrawAmount.value < 1000 || withdrawAmount.value > (currentUser.value?.balance ?? 0)) return
  addToBalance(-withdrawAmount.value)
  walletMsg.value = `UGX ${withdrawAmount.value.toLocaleString()} withdrawal requested!`
  walletMsgType.value = 'ok'
  transactions.unshift({ id: Date.now(), type: 'withdraw', name: 'Withdrawal via ' + paymentMethods.find(p => p.id === selectedWithdraw.value)?.name, amount: withdrawAmount.value, positive: false, date: new Date() })
  withdrawAmount.value = null
  withdrawPhone.value = ''
  setTimeout(() => { walletMsg.value = ''; walletModal.value = null }, 2500)
}

// ── MY BETS ──
const betFilters = ['All', 'Pending', 'Won', 'Lost']

const filteredBets = computed(() => {
  if (betFilter.value === 'All') return bets.value
  return bets.value.filter(b => b.status === betFilter.value.toLowerCase())
})

function openTicket(b: PlacedBet) {
  selectedTicket.value = b
  showCashout.value = false
}

function shareTicket() {
  const t = selectedTicket.value
  if (!t) return
  const text = `BetWin Ticket #${t.id} — Stake: UGX ${t.stake.toLocaleString()} | Possible Win: UGX ${t.potentialReturn.toLocaleString()}`
  if (navigator.share) navigator.share({ title: 'BetWin Ticket', text })
  else { navigator.clipboard?.writeText(text); alert('Ticket copied to clipboard!') }
}

function reuseBet(bet: PlacedBet) {
  bet.selections.forEach(s => addToBetSlip(s))
  selectedTicket.value = null
  router.push('/')
}

function confirmCashout() {
  if (!selectedTicket.value) return
  const cashoutAmt = Math.round(selectedTicket.value.stake * 0.85)
  addToBalance(cashoutAmt)
  transactions.unshift({ id: Date.now(), type: 'cashout', name: `Cashout — Ticket #${selectedTicket.value.id}`, amount: cashoutAmt, positive: true, date: new Date() })
  selectedTicket.value.status = 'lost'
  showCashout.value = false
  selectedTicket.value = null
}

// ── TRANSACTIONS ──
interface Tx { id: number; type: string; name: string; amount: number; positive: boolean; date: Date }
const transactions = reactive<Tx[]>([
  { id: 1, type: 'deposit', name: 'Initial Deposit via MTN Money', amount: 250000, positive: true, date: new Date(Date.now() - 3 * 24 * 3600000) },
  { id: 2, type: 'bet', name: 'Bet Placed — Ticket #201', amount: 20000, positive: false, date: new Date(Date.now() - 48 * 3600000) },
  { id: 3, type: 'bet', name: 'Bet Placed — Ticket #287', amount: 10000, positive: false, date: new Date(Date.now() - 26 * 3600000) },
  { id: 4, type: 'win', name: 'Win Payout — Ticket #287', amount: 34500, positive: true, date: new Date(Date.now() - 24 * 3600000) },
  { id: 5, type: 'bet', name: 'Bet Placed — Ticket #332', amount: 5000, positive: false, date: new Date(Date.now() - 2 * 3600000) },
])

const txFilters = ['All', 'Deposits', 'Withdrawals', 'Bets']
const filteredTx = computed(() => {
  if (txFilter.value === 'All') return transactions
  if (txFilter.value === 'Deposits') return transactions.filter(t => t.type === 'deposit')
  if (txFilter.value === 'Withdrawals') return transactions.filter(t => t.type === 'withdraw' || t.type === 'cashout')
  return transactions.filter(t => t.type === 'bet' || t.type === 'win')
})

// ── ACCOUNT ──
const accName = ref(currentUser.value?.name ?? '')
const accPhone = ref(currentUser.value?.phone ?? '')
const accEmail = ref('')
const accDob = ref('')
const accMsg = ref('')
const accMsg2 = ref('')

function saveAccount() {
  if (currentUser.value) currentUser.value.name = accName.value
  accMsg.value = 'Profile updated successfully!'
  setTimeout(() => { accMsg.value = '' }, 3000)
}

// ── SETTINGS ──
const notifications = reactive([
  { id: 'email', label: 'Email Notifications', enabled: true },
  { id: 'sms', label: 'SMS Notifications', enabled: true },
  { id: 'push', label: 'Push Notifications', enabled: false },
  { id: 'promo', label: 'Promotional Offers', enabled: true },
])
const oddsFormat = ref('Decimal')
const dailyLimit = ref<number | null>(null)

function fmtDate(d: Date) {
  return new Intl.DateTimeFormat('en-UG', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(d))
}

function fmtDateShort(d: Date) {
  return new Intl.DateTimeFormat('en-UG', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(d))
}
</script>

<style scoped>
/* ── LAYOUT ── */
.profile-app { display:flex; flex-direction:column; height:100vh; background:#0f1120; overflow:hidden; }
.profile-layout { display:flex; flex:1; overflow:hidden; }

/* ── SIDEBAR ── */
.profile-sidebar {
  width: 180px; min-width:180px; background:#141624; border-right:1px solid #1e2235;
  display:flex; flex-direction:column; padding:10px 6px; gap:3px; overflow-y:auto;
}
.ps-user {
  display:flex; align-items:center; gap:8px; padding:8px; background:#1a1d2e;
  border-radius:8px; margin-bottom:6px;
}
.ps-av {
  width:32px; height:32px; border-radius:50%;
  background:linear-gradient(135deg,#e84c6b,#a0284a);
  color:#fff; font-size:14px; font-weight:900;
  display:flex; align-items:center; justify-content:center; flex-shrink:0;
}
.ps-name { font-size:11px; font-weight:700; color:#e2e8f0; }
.ps-bal { font-size:10px; color:#4ade80; font-weight:600; display:flex; align-items:center; gap:3px; }
.ps-bal-hidden { color:#5a6080; }
.ps-eye { background:none; border:none; color:#7a84a0; cursor:pointer; padding:0; display:flex; }
.ps-eye svg { width:11px; height:11px; }
.ps-nav { display:flex; flex-direction:column; gap:1px; flex:1; }
.psnav-btn {
  display:flex; align-items:center; gap:7px; background:none; border:none;
  border-radius:6px; color:#7a84a0; font-size:11px; font-weight:600;
  padding:7px 9px; cursor:pointer; text-align:left; transition:all 0.12s;
}
.psnav-btn svg { width:13px; height:13px; flex-shrink:0; }
.psnav-btn:hover { background:#1a1d2e; color:#c8cfe0; }
.psnav-btn.active { background:linear-gradient(90deg,rgba(232,76,107,0.12),transparent); color:#e84c6b; border-left:2px solid #e84c6b; }
.ps-back {
  background:none; border:1px solid #2e3355; border-radius:6px;
  color:#7a84a0; font-size:10px; font-weight:600; padding:6px 8px;
  cursor:pointer; margin-top:6px; display:flex; align-items:center; gap:5px;
  transition:all 0.12s;
}
.ps-back svg { width:12px; height:12px; }
.ps-back:hover { border-color:#e84c6b; color:#e84c6b; }

/* ── MAIN ── */
.profile-main { flex:1; overflow-y:auto; padding:14px 18px; background:#0f1120; }
.tab-sec { max-width:680px; margin:0 auto; }
.sec-title { font-size:15px; font-weight:900; color:#fff; margin-bottom:12px; letter-spacing:-0.2px; }
.sub-title { font-size:10px; font-weight:700; color:#5a6080; margin:14px 0 7px; text-transform:uppercase; letter-spacing:0.5px; }

/* ── OVERVIEW ── */
.ov-hero {
  display:flex; align-items:center; gap:10px;
  background:linear-gradient(135deg,#1a2040,#141624); border:1px solid #252840;
  border-radius:10px; padding:10px 12px; margin-bottom:12px;
}
.ov-av {
  width:36px; height:36px; border-radius:50%;
  background:linear-gradient(135deg,#e84c6b,#a0284a);
  color:#fff; font-size:15px; font-weight:900;
  display:flex; align-items:center; justify-content:center; flex-shrink:0;
}
.ov-name { font-size:13px; font-weight:800; color:#fff; }
.ov-since { font-size:10px; color:#5a6080; margin-top:1px; }
.ov-bal-pill { margin-left:auto; font-size:12px; font-weight:800; color:#4ade80; background:rgba(74,222,128,0.08); border:1px solid rgba(74,222,128,0.2); border-radius:20px; padding:4px 10px; white-space:nowrap; }
.stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:6px; margin-bottom:10px; }
.sc { background:#141624; border:1px solid #1e2235; border-radius:8px; padding:8px 6px; text-align:center; }
.sc.won { border-color:rgba(74,222,128,0.2); }
.sc.lost { border-color:rgba(232,76,107,0.2); }
.sc.pend { border-color:rgba(251,191,36,0.2); }
.sc-v { font-size:20px; font-weight:900; color:#fff; }
.sc.won .sc-v { color:#4ade80; } .sc.lost .sc-v { color:#e84c6b; } .sc.pend .sc-v { color:#fbbf24; }
.sc-l { font-size:9px; color:#5a6080; font-weight:600; margin-top:2px; text-transform:uppercase; letter-spacing:0.3px; }
.ov-wr { display:flex; align-items:center; gap:8px; background:#141624; border:1px solid #1e2235; border-radius:8px; padding:8px 10px; margin-bottom:10px; }
.wr-lbl { font-size:10px; color:#7a84a0; font-weight:700; white-space:nowrap; }
.wr-bar { flex:1; height:5px; background:#1e2235; border-radius:3px; overflow:hidden; }
.wr-fill { height:100%; background:linear-gradient(90deg,#22c55e,#4ade80); border-radius:3px; }
.wr-v { font-size:11px; font-weight:800; color:#4ade80; }
.recent-list { display:flex; flex-direction:column; gap:4px; margin-bottom:12px; }
.rb-row { display:flex; align-items:center; justify-content:space-between; background:#141624; border:1px solid #1e2235; border-radius:6px; padding:7px 10px; cursor:pointer; transition:border-color 0.12s; }
.rb-row:hover { border-color:#e84c6b; }
.rb-l { display:flex; flex-direction:column; gap:1px; }
.rb-id { font-size:11px; font-weight:700; color:#e2e8f0; }
.rb-meta { font-size:9px; color:#5a6080; }
.ov-actions { display:flex; gap:6px; }
.ov-btn { flex:1; display:flex; align-items:center; justify-content:center; gap:5px; padding:8px; border:none; border-radius:7px; font-size:11px; font-weight:700; cursor:pointer; transition:opacity 0.12s; }
.ov-btn svg { width:13px; height:13px; flex-shrink:0; }
.ov-btn:hover { opacity:0.85; }
.ov-btn.dep { background:linear-gradient(135deg,#16a34a,#22c55e); color:#fff; }
.ov-btn.wdr { background:linear-gradient(135deg,#1d4ed8,#3b82f6); color:#fff; }
.ov-btn.bets { background:linear-gradient(135deg,#7c3aed,#a855f7); color:#fff; }

/* ── WALLET ── */
.wallet-hero { display:flex; align-items:center; justify-content:space-between; background:linear-gradient(135deg,#1a2d4a,#0d1a2e); border:1px solid #1e3a5e; border-radius:10px; padding:14px 16px; margin-bottom:14px; }
.wh-lbl { font-size:10px; color:#9ba3b8; text-transform:uppercase; letter-spacing:0.4px; }
.wh-amt { font-size:20px; font-weight:900; color:#4ade80; margin-top:3px; }
.wh-btns { display:flex; gap:6px; }
.wh-btn { display:flex; align-items:center; gap:5px; padding:7px 12px; border:none; border-radius:6px; font-size:11px; font-weight:700; cursor:pointer; transition:opacity 0.12s; }
.wh-btn svg { width:13px; height:13px; }
.wh-btn:hover { opacity:0.85; }
.wh-btn.dep { background:linear-gradient(135deg,#16a34a,#22c55e); color:#fff; }
.wh-btn.wdr { background:linear-gradient(135deg,#1d4ed8,#3b82f6); color:#fff; }

/* ── MY BETS ── */
.filters { display:flex; gap:5px; margin-bottom:10px; flex-wrap:wrap; }
.fbtn { padding:4px 12px; border-radius:20px; border:1px solid #2e3355; background:none; color:#7a84a0; font-size:10px; font-weight:700; cursor:pointer; transition:all 0.12s; }
.fbtn.active { background:#e84c6b; border-color:#e84c6b; color:#fff; }
.bets-list { display:flex; flex-direction:column; gap:6px; }
.tkt-card { display:flex; align-items:center; justify-content:space-between; background:#141624; border:1px solid #1e2235; border-radius:8px; padding:9px 12px; cursor:pointer; transition:border-color 0.12s, transform 0.1s; gap:8px; }
.tkt-card:hover { border-color:#e84c6b; transform:translateY(-1px); }
.tkt-l { flex:1; min-width:0; }
.tkt-top { display:flex; align-items:center; gap:8px; margin-bottom:3px; }
.tkt-id { font-size:12px; font-weight:800; color:#fff; }
.tkt-type { font-size:9px; color:#5a6080; }
.tkt-matches { font-size:10px; color:#9ba3b8; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.tkt-r { display:flex; flex-direction:column; align-items:flex-end; gap:4px; flex-shrink:0; }
.tkt-pot { font-size:11px; font-weight:700; color:#4ade80; }
.empty-msg { text-align:center; color:#5a6080; padding:30px; font-size:12px; }

/* ── STATUS BADGES ── */
.sbadge { padding:2px 7px; border-radius:20px; font-size:9px; font-weight:800; letter-spacing:0.4px; }
.sbadge.pending { background:rgba(251,191,36,0.12); color:#fbbf24; border:1px solid rgba(251,191,36,0.25); }
.sbadge.won { background:rgba(74,222,128,0.12); color:#4ade80; border:1px solid rgba(74,222,128,0.25); }
.sbadge.lost { background:rgba(232,76,107,0.12); color:#e84c6b; border:1px solid rgba(232,76,107,0.25); }

/* ── TRANSACTIONS ── */
.tx-list { display:flex; flex-direction:column; }
.tx-row { display:flex; align-items:center; gap:10px; padding:8px 4px; border-bottom:1px solid #141624; }
.tx-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
.tx-dot.pos { background:#4ade80; } .tx-dot.neg { background:#e84c6b; }
.tx-body { flex:1; }
.tx-name { font-size:11px; font-weight:600; color:#c8cfe0; }
.tx-date { font-size:9px; color:#5a6080; margin-top:1px; }
.tx-amt { font-size:11px; font-weight:800; }
.tx-amt.pos { color:#4ade80; } .tx-amt.neg { color:#e84c6b; }

/* ── ACCOUNT ── */
.acc-hero { display:flex; align-items:center; gap:10px; margin-bottom:12px; }
.acc-av { width:40px; height:40px; border-radius:50%; background:linear-gradient(135deg,#e84c6b,#a0284a); color:#fff; font-size:17px; font-weight:900; display:flex; align-items:center; justify-content:center; }
.acc-name { font-size:14px; font-weight:800; color:#fff; }
.acc-since { font-size:10px; color:#5a6080; margin-top:2px; }

/* ── FORMS (shared) ── */
.fc { background:#141624; border:1px solid #1e2235; border-radius:10px; padding:14px; }
.fc-title { font-size:11px; font-weight:800; color:#fff; margin-bottom:10px; text-transform:uppercase; letter-spacing:0.3px; }
.fg { display:flex; flex-direction:column; gap:3px; margin-bottom:8px; }
.fg label { font-size:9px; font-weight:600; color:#7a84a0; letter-spacing:0.3px; text-transform:uppercase; }
.pi {
  background:#181b2c; border:1.5px solid #252a42; border-radius:6px;
  color:#c8cfe0; padding:7px 10px; font-size:12px; outline:none; width:100%;
  box-sizing:border-box; transition:border-color 0.15s;
}
.pi:focus { border-color:#e84c6b; }
.pi::placeholder { color:#3a4260; }
.ps-btn { background:linear-gradient(135deg,#e84c6b,#c93559); border:none; color:#fff; font-size:11px; font-weight:800; padding:9px; border-radius:7px; cursor:pointer; width:100%; transition:opacity 0.12s; margin-top:2px; }
.ps-btn:hover { opacity:0.9; }
.ps-btn.danger { background:linear-gradient(135deg,#991b1b,#e84c6b); margin-top:8px; }
.pmsg { margin-top:7px; padding:7px 10px; border-radius:6px; font-size:11px; font-weight:600; }
.pmsg.ok { background:rgba(74,222,128,0.1); color:#4ade80; border:1px solid rgba(74,222,128,0.2); }
.pmsg.err { background:rgba(232,76,107,0.1); color:#e84c6b; border:1px solid rgba(232,76,107,0.2); }

/* ── SETTINGS ── */
.setting-row { display:flex; align-items:center; justify-content:space-between; padding:9px 0; border-bottom:1px solid #1a1d2e; }
.setting-row:last-child { border-bottom:none; }
.sr-lbl { font-size:11px; color:#c8cfe0; font-weight:600; }
.tgl { width:34px; height:18px; border-radius:9px; border:none; background:#252840; cursor:pointer; position:relative; transition:background 0.2s; flex-shrink:0; }
.tgl.on { background:#22c55e; }
.tgl-k { position:absolute; top:2px; left:2px; width:14px; height:14px; background:#fff; border-radius:50%; transition:transform 0.2s; }
.tgl.on .tgl-k { transform:translateX(16px); }
.seg { display:flex; gap:1px; background:#1a1d2e; border-radius:5px; padding:2px; }
.seg-b { padding:3px 8px; border:none; border-radius:3px; background:none; color:#7a84a0; font-size:9px; font-weight:700; cursor:pointer; transition:all 0.12s; }
.seg-b.active { background:#252840; color:#fff; }
.rg-warn { display:flex; align-items:flex-start; gap:8px; background:rgba(232,76,107,0.06); border:1px solid rgba(232,76,107,0.12); border-radius:7px; padding:10px; margin-top:10px; }
.rg-title { font-size:11px; font-weight:700; color:#e84c6b; }
.rg-sub { font-size:10px; color:#7a84a0; margin-top:2px; line-height:1.4; }

/* ── WALLET FLOAT MODAL ── */
.wm-backdrop { position:fixed; inset:0; z-index:8000; background:rgba(0,0,0,0.65); backdrop-filter:blur(4px); display:flex; align-items:center; justify-content:center; padding:16px; }
.wm-card { background:#141624; border:1px solid #2e3355; border-radius:12px; width:100%; max-width:340px; box-shadow:0 16px 48px rgba(0,0,0,0.6); overflow:hidden; }
.wm-hdr { display:flex; align-items:center; justify-content:space-between; padding:10px 14px; border-bottom:1px solid #1e2235; background:#1a1d2e; }
.wm-tabs { display:flex; gap:2px; background:#252840; border-radius:5px; padding:2px; }
.wm-tabs button { padding:4px 14px; border:none; border-radius:4px; background:none; color:#7a84a0; font-size:11px; font-weight:700; cursor:pointer; transition:all 0.12s; }
.wm-tabs button.active { background:#e84c6b; color:#fff; }
.wm-x { background:none; border:none; color:#7a84a0; cursor:pointer; padding:2px; display:flex; transition:color 0.12s; }
.wm-x:hover { color:#e84c6b; }
.wm-x svg { width:14px; height:14px; }
.wm-body { padding:14px; }
.wm-bal-row { font-size:11px; color:#9ba3b8; margin-bottom:10px; }
.wm-bal-row strong { color:#4ade80; }
.wm-quick { display:flex; gap:4px; margin:6px 0 10px; flex-wrap:wrap; }
.wm-qa { padding:4px 10px; background:#1e2235; border:1px solid #2e3355; border-radius:4px; color:#c8cfe0; font-size:10px; font-weight:700; cursor:pointer; transition:all 0.12s; }
.wm-qa:hover { background:#e84c6b; border-color:#e84c6b; color:#fff; }
.wm-methods { display:flex; gap:4px; flex-wrap:wrap; }
.wm-mth { flex:1; min-width:70px; padding:6px; background:#1a1d2e; border:1.5px solid #252840; border-radius:6px; color:#9ba3b8; font-size:10px; font-weight:700; cursor:pointer; transition:all 0.12s; text-align:center; }
.wm-mth.active { border-color:#e84c6b; color:#e84c6b; background:rgba(232,76,107,0.06); }
.wm-submit { width:100%; padding:9px; border:none; border-radius:7px; font-size:12px; font-weight:800; cursor:pointer; margin-top:10px; transition:opacity 0.12s; }
.wm-submit:hover { opacity:0.9; }
.wm-submit:disabled { opacity:0.35; cursor:not-allowed; }
.wm-submit.dep { background:linear-gradient(135deg,#16a34a,#22c55e); color:#fff; }
.wm-submit.wdr { background:linear-gradient(135deg,#1d4ed8,#3b82f6); color:#fff; }
.wm-fade-enter-active,.wm-fade-leave-active { transition:all 0.2s; }
.wm-fade-enter-from,.wm-fade-leave-to { opacity:0; }
.wm-fade-enter-from .wm-card,.wm-fade-leave-to .wm-card { transform:scale(0.95) translateY(8px); }

/* ── TICKET MODAL ── */
.tm-backdrop { position:fixed; inset:0; z-index:9000; background:rgba(0,0,0,0.82); backdrop-filter:blur(5px); display:flex; align-items:center; justify-content:center; padding:12px; }
.tm-modal { background:#141624; border:1px solid #1e2235; border-radius:12px; width:100%; max-width:640px; max-height:88vh; display:flex; flex-direction:column; box-shadow:0 24px 64px rgba(0,0,0,0.7); overflow:hidden; }
.tm-hdr { background:linear-gradient(135deg,#c93030,#e84c30); display:flex; align-items:center; justify-content:space-between; padding:10px 14px; flex-shrink:0; }
.tm-hdr-l { font-size:11px; font-weight:800; color:#fff; letter-spacing:0.3px; display:flex; align-items:center; gap:6px; }
.tm-x { background:rgba(0,0,0,0.25); border:none; border-radius:50%; width:22px; height:22px; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:background 0.12s; flex-shrink:0; }
.tm-x:hover { background:rgba(0,0,0,0.45); }
.tm-x svg { width:11px; height:11px; }
.tm-cols { display:flex; flex:1; overflow:hidden; }
/* Left: match list */
.tm-left { flex:1; overflow-y:auto; border-right:1px solid #1e2235; }
.tmm-row { padding:10px 14px; border-bottom:1px solid #1e2235; }
.tmm-row:last-child { border-bottom:none; }
.tmm-meta { font-size:9px; color:#7a84a0; display:flex; align-items:center; gap:4px; margin-bottom:4px; }
.tmm-teams { font-size:12px; font-weight:800; color:#e2e8f0; margin-bottom:3px; letter-spacing:0.2px; }
.tmm-pick-row { display:flex; justify-content:space-between; align-items:center; }
.tmm-pick { font-size:10px; color:#9ba3b8; }
.tmm-pick strong { color:#e2e8f0; }
.tmm-odds { font-size:13px; font-weight:900; color:#e84c6b; }
.tmm-sel-st { font-size:9px; font-weight:700; margin-top:4px; letter-spacing:0.4px; }
.tmm-sel-st.pending { color:#fbbf24; }
.tmm-sel-st.won { color:#4ade80; }
.tmm-sel-st.lost { color:#e84c6b; }
/* Right: info panel */
.tm-right { width:190px; flex-shrink:0; background:#1a1d2e; display:flex; flex-direction:column; padding:12px; overflow-y:auto; gap:10px; }
.tm-stub { display:flex; justify-content:center; }
.tm-status-row { display:flex; align-items:center; gap:6px; flex-wrap:wrap; }
.tm-st-lbl { font-size:9px; color:#7a84a0; font-weight:700; letter-spacing:0.5px; }
.tm-st-val { font-size:11px; font-weight:900; padding:3px 8px; border-radius:4px; letter-spacing:0.3px; }
.tm-st-val.pending { background:rgba(251,191,36,0.15); color:#fbbf24; }
.tm-st-val.won { background:rgba(74,222,128,0.15); color:#4ade80; }
.tm-st-val.lost { background:rgba(232,76,107,0.15); color:#e84c6b; }
.tm-info { display:flex; flex-direction:column; gap:0; border:1px solid #252840; border-radius:6px; overflow:hidden; }
.tmf { display:flex; justify-content:space-between; align-items:center; padding:7px 8px; font-size:9px; color:#7a84a0; font-weight:700; border-bottom:1px solid #252840; letter-spacing:0.3px; }
.tmf:last-child { border-bottom:none; }
.tmf.total { background:rgba(74,222,128,0.05); }
.tmf.bonus { background:rgba(74,222,128,0.03); }
.tmf-v { font-size:11px; font-weight:800; color:#e2e8f0; text-align:right; }
.tmf-v.odds { color:#e84c6b; }
.tmf-v.green { color:#4ade80; }
.tm-acts { display:flex; gap:4px; }
.tma { flex:1; display:flex; flex-direction:column; align-items:center; gap:3px; padding:7px 4px; border:none; border-radius:6px; font-size:9px; font-weight:700; cursor:pointer; transition:opacity 0.12s; }
.tma svg { width:13px; height:13px; }
.tma:hover { opacity:0.85; }
.tma.cashout { background:linear-gradient(135deg,#16a34a,#22c55e); color:#fff; }
.tma.share { background:#252840; color:#9ba3b8; }
.tma.reuse { background:linear-gradient(135deg,#5b21b6,#7c3aed); color:#fff; }
.cp { background:linear-gradient(135deg,#0d2218,#12291e); border:1px solid #2a5a3a; border-radius:7px; padding:10px; text-align:center; }
.cp-lbl { font-size:9px; color:#6dbf90; font-weight:700; text-transform:uppercase; letter-spacing:0.4px; }
.cp-amt { font-size:18px; font-weight:900; color:#4ade80; margin:4px 0; }
.cp-note { font-size:9px; color:#5a8070; margin-bottom:8px; }
.cp-btn { background:linear-gradient(135deg,#16a34a,#22c55e); border:none; color:#fff; padding:7px 14px; border-radius:6px; font-size:10px; font-weight:800; cursor:pointer; width:100%; }

/* ── TRANSITIONS ── */
.modal-fade-enter-active,.modal-fade-leave-active { transition:opacity 0.2s; }
.modal-fade-enter-from,.modal-fade-leave-to { opacity:0; }
.slide-down-enter-active,.slide-down-leave-active { transition:all 0.2s ease; }
.slide-down-enter-from,.slide-down-leave-to { opacity:0; transform:translateY(-6px); }
</style>
