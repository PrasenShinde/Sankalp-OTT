import { useState } from 'react'
import { Plus, Edit2, Trash2, Eye } from 'lucide-react'
import Modal, { FormGroup, ModalSection } from '../components/ui/Modal.jsx'
import { Toggle, ConfirmDialog } from '../components/ui/Controls.jsx'

const initBanners = [
  { id:1, name:'Homepage Hero', image:null, link:'Secret Marriage', destination:'drama', position:'home-top', trigger:'always', targetPlan:'All', schedule:'Always on', status:'Live', type:'banner', impressions:48200, clicks:3840 },
  { id:2, name:'Membership Offer Popup', image:null, link:'20% off promo', destination:'membership', position:'popup', trigger:'on-open', targetPlan:'Free', schedule:'Apr 10 – Apr 20', status:'Scheduled', type:'popup', impressions:0, clicks:0 },
  { id:3, name:'New Release Banner', image:null, link:"CEO's Revenge", destination:'drama', position:'home-mid', trigger:'on-scroll', targetPlan:'All', schedule:'Not set', status:'Draft', type:'banner', impressions:0, clicks:0 },
  { id:4, name:'Weekend Offer', image:null, link:'Annual Plan discount', destination:'membership', position:'popup', trigger:'timer', targetPlan:'Paid', schedule:'Apr 5 – Apr 7', status:'Live', type:'popup', impressions:24100, clicks:1820 },
]

const POSITIONS = ['home-top', 'home-mid', 'home-bottom', 'detail-page', 'popup']



function BannerModal({ open, onClose, onSave, initial }) {
  const isEdit = !!initial?.id
  const [form, setForm] = useState(initial || { name:'', link:'', destination:'drama', position:'home-top', trigger:'always', targetPlan:'All', schedule:'', type:'banner', status:'Draft' })
  const upd = (k,v) => setForm(p=>({...p,[k]:v}))
  if(!open) return null
  return (
    <Modal open={open} onClose={onClose} title={isEdit?`Edit — ${initial.name}`:'Add Banner / Popup'} width={560}
      footer={<><button className="btn btn-ghost" onClick={onClose}>Cancel</button><button className="btn btn-primary" onClick={() => { onSave({...form,id:initial?.id||Date.now(),impressions:initial?.impressions||0,clicks:initial?.clicks||0}); onClose() }}>{isEdit?'Save Changes':'Create'}</button></>}
    >
      <ModalSection title="Basic details">
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <FormGroup label="Banner name *"><input className="input" style={{ width:'100%' }} placeholder="e.g. Homepage Hero" value={form.name} onChange={e=>upd('name',e.target.value)}/></FormGroup>
          <FormGroup label="Type">
            <select className="select" style={{ width:'100%' }} value={form.type} onChange={e=>upd('type',e.target.value)}><option value="banner">Banner</option><option value="popup">Popup</option></select>
          </FormGroup>
        </div>
        <FormGroup label="Banner image / creative">
          <div style={{ border:'2px dashed var(--border2)', borderRadius:'var(--radius)', padding:16, textAlign:'center', background:'var(--bg3)', cursor:'pointer', position:'relative' }}>
            <input type="file" accept="image/*" style={{ position:'absolute', inset:0, opacity:0, cursor:'pointer' }}/>
            <div style={{ fontSize:20, marginBottom:6 }}>🖼</div>
            <div style={{ fontSize:12, color:'var(--text2)' }}>Upload image</div>
            <div style={{ fontSize:11, color:'var(--text3)' }}>PNG, JPG · 1280×400 px for banners · 600×800 px for popups</div>
          </div>
        </FormGroup>
      </ModalSection>

      <ModalSection title="Link & target">
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <FormGroup label="Destination type">
            <select className="select" style={{ width:'100%' }} value={form.destination} onChange={e=>upd('destination',e.target.value)}>
              <option value="drama">Drama / Episode</option><option value="membership">Membership plan</option><option value="url">External URL</option>
            </select>
          </FormGroup>
          <FormGroup label="Link to">
            <input className="input" placeholder="Search drama or enter URL…" value={form.link} onChange={e=>upd('link',e.target.value)}/>
          </FormGroup>
        </div>
      </ModalSection>

      <ModalSection title="Display settings">
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <FormGroup label="Position">
            <select className="select" style={{ width:'100%' }} value={form.position} onChange={e=>upd('position',e.target.value)}>
              {POSITIONS.map(p=><option key={p}>{p}</option>)}
            </select>
          </FormGroup>
          <FormGroup label="Popup trigger">
            <select className="select" style={{ width:'100%' }} value={form.trigger} onChange={e=>upd('trigger',e.target.value)}>
              {TRIGGERS.map(t=><option key={t}>{t}</option>)}
            </select>
          </FormGroup>
          <FormGroup label="Target audience">
            <select className="select" style={{ width:'100%' }} value={form.targetPlan} onChange={e=>upd('targetPlan',e.target.value)}>
              {TARGET_PLANS.map(t=><option key={t}>{t}</option>)}
            </select>
          </FormGroup>
          <FormGroup label="Schedule range">
            <input className="input" placeholder="e.g. Apr 10 – Apr 20" value={form.schedule} onChange={e=>upd('schedule',e.target.value)}/>
          </FormGroup>
          <FormGroup label="Start date"><input className="input" type="date"/></FormGroup>
          <FormGroup label="End date"><input className="input" type="date"/></FormGroup>
        </div>
      </ModalSection>
    </Modal>
  )
}

function PreviewModal({ open, onClose, banner }) {
  if (!banner || !open) return null
  return (
    <Modal open={open} onClose={onClose} title={`Preview — ${banner.name}`} width={500}>
      <div style={{ background:'var(--bg3)', borderRadius:10, overflow:'hidden', marginBottom:16 }}>
        <div style={{ height: banner.type==='popup'?220:110, background:'linear-gradient(135deg, var(--accent-bg), var(--bg4))', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:8 }}>
          <div style={{ fontSize:16, fontWeight:600, color:'var(--text)' }}>{banner.name}</div>
          <div style={{ fontSize:12, color:'var(--text3)' }}>→ {banner.link}</div>
          {banner.type==='popup' && <div style={{ padding:'6px 16px', background:'var(--accent)', borderRadius:20, fontSize:12, color:'#fff', marginTop:8 }}>Get Offer</div>}
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 }}>
        {[{l:'Position',v:banner.position},{l:'Trigger',v:banner.trigger},{l:'Audience',v:banner.targetPlan}].map(r => (
          <div key={r.l} style={{ background:'var(--bg3)', padding:10, borderRadius:8, textAlign:'center' }}>
            <div style={{ fontSize:10, color:'var(--text3)', marginBottom:3 }}>{r.l}</div>
            <div style={{ fontSize:12, fontWeight:500 }}>{r.v}</div>
          </div>
        ))}
      </div>
    </Modal>
  )
}

export default function Banners() {
  const [banners, setBanners] = useState(initBanners)
  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)
  const [confirm, setConfirm] = useState(null)

  const saveBanner = data => setBanners(p => p.find(b=>b.id===data.id)?p.map(b=>b.id===data.id?data:b):[...p,data])
  const deleteBanner = id => { setBanners(p=>p.filter(b=>b.id!==id)); setConfirm(null) }
  const toggleStatus = id => setBanners(p => p.map(b => b.id===id ? {...b, status:b.status==='Live'?'Draft':'Live'} : b))
  const open = (m, b=null) => { setModal(m); setSelected(b) }

  const liveBanners = banners.filter(b=>b.status==='Live')
  const totalImpressions = banners.reduce((a,b)=>a+b.impressions,0)
  const totalClicks = banners.reduce((a,b)=>a+b.clicks,0)

  return (
    <div className="page-enter">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
        <div>
          <div style={{ fontWeight:600 }}>Banners &amp; promotional popups</div>
          <div style={{ fontSize:12, color:'var(--text3)' }}>{banners.length} total · {liveBanners.length} live</div>
        </div>
        <button className="btn btn-primary" onClick={() => open('add')}><Plus size={14}/> Add banner</button>
      </div>

      {/* Stats */}
      <div className="metrics-grid" style={{ gridTemplateColumns:'repeat(4,1fr)', marginBottom:16 }}>
        {[
          { label:'Total Banners', value:banners.length, sub:`${liveBanners.length} currently live` },
          { label:'Total Impressions', value:totalImpressions.toLocaleString(), sub:'all-time views' },
          { label:'Total Clicks', value:totalClicks.toLocaleString(), sub:'all-time clicks' },
          { label:'Avg CTR', value:totalImpressions?`${((totalClicks/totalImpressions)*100).toFixed(1)}%`:'—', sub:'click-through rate' },
        ].map(m => (
          <div className="metric-card" key={m.label}>
            <div className="metric-label">{m.label}</div>
            <div className="metric-value" style={{ fontSize:20 }}>{m.value}</div>
            <div className="metric-sub">{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Banner cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:14, marginBottom:20 }}>
        {banners.map(b => (
          <div className="card" key={b.id}>
            {/* Preview area */}
            <div style={{
              height:80, borderRadius:8, marginBottom:12,
              background:'linear-gradient(135deg, var(--accent-bg), var(--bg4))',
              display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:4,
              border:'1px solid var(--border)', position:'relative', overflow:'hidden',
            }}>
              <div style={{ fontSize:13, fontWeight:500, color:'var(--text)' }}>{b.name}</div>
              <div style={{ fontSize:11, color:'var(--text3)' }}>{b.position} · {b.trigger}</div>
              <span className={`badge ${b.status==='Live'?'badge-green':b.status==='Scheduled'?'badge-amber':'badge-blue'}`} style={{ position:'absolute', top:8, right:8 }}>{b.status}</span>
            </div>

            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
              <div style={{ fontSize:12, color:'var(--text2)' }}>→ {b.link}</div>
              <span className="badge badge-blue" style={{ fontSize:10 }}>{b.type}</span>
            </div>
            <div style={{ fontSize:11, color:'var(--text3)', marginBottom:10 }}>📅 {b.schedule} · 👥 {b.targetPlan}</div>

            {b.impressions > 0 && (
              <div style={{ display:'flex', gap:12, fontSize:11, color:'var(--text3)', marginBottom:12 }}>
                <span>👁 {b.impressions.toLocaleString()} impressions</span>
                <span>🖱 {b.clicks.toLocaleString()} clicks</span>
                <span>📊 CTR {((b.clicks/b.impressions)*100).toFixed(1)}%</span>
              </div>
            )}

            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ display:'flex', gap:6 }}>
                <button className="btn btn-ghost btn-sm" onClick={() => open('edit', b)}><Edit2 size={11}/> Edit</button>
                <button className="btn btn-ghost btn-sm" onClick={() => open('preview', b)}><Eye size={11}/> Preview</button>
              </div>
              <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                <button className={`btn btn-sm ${b.status==='Live'?'btn-danger':'btn-primary'}`} onClick={() => toggleStatus(b.id)} style={{ fontSize:10 }}>
                  {b.status==='Live'?'Disable':'Enable'}
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => setConfirm({id:b.id,name:b.name})}><Trash2 size={11}/></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <BannerModal open={modal==='add'} onClose={() => setModal(null)} onSave={saveBanner} initial={null}/>
      <BannerModal open={modal==='edit'} onClose={() => setModal(null)} onSave={saveBanner} initial={selected}/>
      <PreviewModal open={modal==='preview'} onClose={() => setModal(null)} banner={selected}/>
      <ConfirmDialog open={!!confirm} danger title="Delete Banner"
        message={`Remove "${confirm?.name}" permanently?`}
        onConfirm={() => deleteBanner(confirm.id)} onCancel={() => setConfirm(null)}
      />
    </div>
  )
}
