import { useState } from 'react'
import { Plus, Edit2, Trash2, RefreshCw } from 'lucide-react'
import Modal, { FormGroup, ModalSection } from '../components/ui/Modal.jsx'
import { Toggle, ConfirmDialog } from '../components/ui/Controls.jsx'

const MODULES = ['Dashboard','Users','Dramas','Categories','Banners','Membership','Coins','Notifications','Analytics','Roles','CMS']
const ROLE_KEYS = ['super','content','support','analyst']

const initAdmins = [
  { id:1, name:'Super Admin',  initials:'SA', email:'super@ott.com',   role:'super',   status:'Active',   lastActive:'Apr 3, 10:22' },
  { id:2, name:'Content Mgr', initials:'CM', email:'content@ott.com',  role:'content', status:'Active',   lastActive:'Apr 3, 09:15' },
  { id:3, name:'Support',     initials:'SP', email:'support@ott.com',  role:'support', status:'Active',   lastActive:'Apr 2, 16:40' },
  { id:4, name:'Analyst',     initials:'AN', email:'analyst@ott.com',  role:'analyst', status:'Inactive', lastActive:'Mar 28, 11:00' },
]

const initPerms = {
  Dashboard:     { super:true,  content:true,  support:true,  analyst:true  },
  Users:         { super:true,  content:false, support:true,  analyst:false },
  Dramas:        { super:true,  content:true,  support:false, analyst:false },
  Categories:    { super:true,  content:true,  support:false, analyst:false },
  Banners:       { super:true,  content:true,  support:false, analyst:false },
  Membership:    { super:true,  content:false, support:false, analyst:true  },
  Coins:         { super:true,  content:false, support:true,  analyst:true  },
  Notifications: { super:true,  content:false, support:false, analyst:false },
  Analytics:     { super:true,  content:false, support:false, analyst:true  },
  Roles:         { super:true,  content:false, support:false, analyst:false },
  CMS:           { super:true,  content:true,  support:false, analyst:false },
}

const initActivityLog = [
  { admin:'Super Admin', action:'Deleted drama "Old Series"',    module:'Dramas',     date:'Apr 3, 10:20' },
  { admin:'Content Mgr', action:'Published drama "Twin Flames"', module:'Dramas',     date:'Apr 3, 09:10' },
  { admin:'Super Admin', action:'Blocked user Ravi V',           module:'Users',      date:'Mar 21, 14:00' },
  { admin:'Support',     action:'Credited ₵200 to Meena S',     module:'Coins',      date:'Apr 2, 16:38' },
  { admin:'Super Admin', action:'Created admin Analyst',         module:'Roles',      date:'Mar 28, 11:00' },
]

function AdminModal({ open, onClose, onSave, initial }) {
  const isEdit = !!initial?.id
  const [form, setForm] = useState(initial || { name:'', email:'', role:'content', status:'Active' })
  const [resetPw, setResetPw] = useState(false)
  const upd = (k,v) => setForm(p=>({...p,[k]:v}))
  if(!open) return null
  return (
    <Modal open={open} onClose={onClose} title={isEdit?`Edit Admin — ${initial.name}`:'Create Admin User'} width={460}
      footer={<><button className="btn btn-ghost" onClick={onClose}>Cancel</button><button className="btn btn-primary" onClick={() => { onSave({...form,id:initial?.id||Date.now(),initials:form.name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase(),lastActive:initial?.lastActive||'—'}); onClose() }}>{isEdit?'Save Changes':'Create Admin'}</button></>}
    >
      <ModalSection title="Identity">
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <FormGroup label="Full name *"><input className="input" placeholder="e.g. Sarah Lee" value={form.name} onChange={e=>upd('name',e.target.value)}/></FormGroup>
          <FormGroup label="Email *"><input className="input" type="email" placeholder="admin@ott.com" value={form.email} onChange={e=>upd('email',e.target.value)}/></FormGroup>
        </div>
      </ModalSection>
      <ModalSection title="Role & access">
        <FormGroup label="Assign role">
          <select className="select" style={{ width:'100%' }} value={form.role} onChange={e=>upd('role',e.target.value)}>
            <option value="super">Super Admin</option>
            <option value="content">Content Manager</option>
            <option value="support">Support</option>
            <option value="analyst">Analyst</option>
          </select>
        </FormGroup>
        <label style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' }}>
          <Toggle on={form.status==='Active'} onChange={v=>upd('status',v?'Active':'Inactive')}/>
          <span style={{ fontSize:13 }}>Account active</span>
        </label>
      </ModalSection>
      {isEdit && (
        <ModalSection title="Password">
          <button className="btn btn-ghost" onClick={() => setResetPw(true)}><RefreshCw size={12}/> Send password reset email</button>
          {resetPw && <div style={{ marginTop:8, fontSize:12, color:'var(--green)' }}>✓ Reset email sent to {form.email}</div>}
        </ModalSection>
      )}
    </Modal>
  )
}

export default function Roles() {
  const [admins, setAdmins] = useState(initAdmins)
  const [perms, setPerms] = useState(initPerms)
  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const [tab, setTab] = useState('admins')

  const saveAdmin = data => setAdmins(p => p.find(a=>a.id===data.id)?p.map(a=>a.id===data.id?data:a):[...p,data])
  const deleteAdmin = id => { setAdmins(p=>p.filter(a=>a.id!==id)); setConfirm(null) }
  const togglePerm = (mod, role) => setPerms(p => ({ ...p, [mod]: { ...p[mod], [role]: !p[mod][role] } }))

  const roleLabel = { super:'Super Admin', content:'Content Mgr', support:'Support', analyst:'Analyst' }
  const roleBadge = { super:'badge-red', content:'badge-purple', support:'badge-blue', analyst:'badge-green' }

  const TABS = ['admins', 'permissions', 'activity']

  return (
    <div className="page-enter">
      <div style={{ display:'flex', gap:0, marginBottom:18, borderBottom:'1px solid var(--border)' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding:'8px 16px', background:'none', border:'none', cursor:'pointer', fontSize:12,
            fontWeight:tab===t?600:400, color:tab===t?'var(--accent2)':'var(--text3)',
            borderBottom:tab===t?'2px solid var(--accent)':'2px solid transparent',
            textTransform:'capitalize', marginBottom:-1,
          }}>{t==='admins'?'Admin Users':t==='permissions'?'Permission Matrix':'Activity Logs'}</button>
        ))}
      </div>

      {/* Admin users */}
      {tab==='admins' && (
        <>
          <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:14 }}>
            <button className="btn btn-primary" onClick={() => { setSelected(null); setModal('admin-add') }}><Plus size={14}/> Create admin</button>
          </div>
          <div className="card" style={{ padding:0 }}>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Admin</th><th>Email</th><th>Role</th><th>Status</th><th>Last active</th><th>Actions</th></tr></thead>
                <tbody>
                  {admins.map(a => (
                    <tr key={a.id}>
                      <td>
                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                          <div className="avatar" style={{ background:a.status==='Inactive'?'var(--bg4)':'var(--accent-bg)' }}>{a.initials}</div>
                          <span style={{ fontWeight:500 }}>{a.name}</span>
                        </div>
                      </td>
                      <td style={{ color:'var(--text3)', fontSize:12 }}>{a.email}</td>
                      <td><span className={`badge ${roleBadge[a.role]}`}>{roleLabel[a.role]}</span></td>
                      <td><span className={`badge ${a.status==='Active'?'badge-green':'badge-amber'}`}>{a.status}</span></td>
                      <td style={{ color:'var(--text3)', fontSize:12 }}>{a.lastActive}</td>
                      <td>
                        <div style={{ display:'flex', gap:5 }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => { setSelected(a); setModal('admin-edit') }}><Edit2 size={11}/> Edit</button>
                          {a.role!=='super' && <button className="btn btn-danger btn-sm" onClick={() => setConfirm({id:a.id,name:a.name})}><Trash2 size={11}/></button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Permission matrix */}
      {tab==='permissions' && (
        <div className="card" style={{ padding:0 }}>
          <div style={{ padding:'14px 18px', borderBottom:'1px solid var(--border)' }}>
            <div className="card-title" style={{ marginBottom:0 }}>Per-module access control</div>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Module</th>
                  {ROLE_KEYS.map(r => <th key={r} style={{ textAlign:'center' }}>{roleLabel[r]}</th>)}
                </tr>
              </thead>
              <tbody>
                {MODULES.map(mod => (
                  <tr key={mod}>
                    <td style={{ fontWeight:500 }}>{mod}</td>
                    {ROLE_KEYS.map(role => (
                      <td key={role} style={{ textAlign:'center' }}>
                        {role==='super'
                          ? <span className="perm-check">✓</span>
                          : <Toggle on={perms[mod]?.[role]||false} onChange={() => togglePerm(mod, role)} disabled={role==='super'}/>
                        }
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding:'12px 18px', borderTop:'1px solid var(--border)' }}>
            <button className="btn btn-primary">Save permissions</button>
          </div>
        </div>
      )}

      {/* Activity log */}
      {tab==='activity' && (
        <div className="card" style={{ padding:0 }}>
          <div style={{ padding:'14px 18px', borderBottom:'1px solid var(--border)' }}>
            <div className="card-title" style={{ marginBottom:0 }}>Who did what and when</div>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Admin</th><th>Action</th><th>Module</th><th>Date</th></tr></thead>
              <tbody>
                {initActivityLog.map((l,i) => (
                  <tr key={i}>
                    <td style={{ fontWeight:500 }}>{l.admin}</td>
                    <td style={{ color:'var(--text2)' }}>{l.action}</td>
                    <td><span className="badge badge-blue" style={{ fontSize:10 }}>{l.module}</span></td>
                    <td style={{ color:'var(--text3)', fontSize:12 }}>{l.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AdminModal open={modal==='admin-add'} onClose={() => setModal(null)} onSave={saveAdmin} initial={null}/>
      <AdminModal open={modal==='admin-edit'} onClose={() => setModal(null)} onSave={saveAdmin} initial={selected}/>
      <ConfirmDialog open={!!confirm} danger title="Delete Admin"
        message={`Remove admin "${confirm?.name}"? They will lose all access.`}
        onConfirm={() => deleteAdmin(confirm.id)} onCancel={() => setConfirm(null)}
      />
    </div>
  )
}
