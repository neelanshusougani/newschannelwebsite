"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function AdminPage() {
  const [cats, setCats] = useState<any[]>([]);
  const [newsList, setNewsList] = useState<any[]>([]);
  const [newCat, setNewCat] = useState('');
  const [marqueeList, setMarqueeList] = useState([{ text: '' }]);
  const [editingId, setEditingId] = useState<string | null>(null); // Naya: Edit track karne ke liye
  const [siteSettings, setSiteSettings] = useState({ 
    name: 'BASTI JYOTI', phone: '', email: '', address: '', extraImg: '', adCode: '', bg: '' 
  });
  
  const [form, setForm] = useState({ 
    title_hi: '', title_en: '', content_hi: '', content_en: '', 
    category: '', image_url: '', images: [] as string[], video_url: '', audio_url: '' 
  });

  useEffect(() => { fetchCats(); fetchNews(); loadSettings(); }, []);

  const loadSettings = async () => {
    const { data } = await supabase.from('site_settings').select('*').eq('section_id', 'global_config').single();
    if (data) {
        setSiteSettings({
            name: data.site_name, phone: data.phone_no, email: data.email_id,
            address: data.address, extraImg: data.extra_home_img, adCode: data.ad_code, bg: data.bg_image
        });
        if (data.marquee_data) setMarqueeList(data.marquee_data);
    }
  };

  const fetchCats = async () => {
    const { data } = await supabase.from('categories').select('*');
    if (data) setCats(data);
  };

  const fetchNews = async () => {
    const { data } = await supabase.from('news').select('*').order('created_at', { ascending: false });
    if (data) setNewsList(data);
  };

  const addCategory = async () => {
    if (newCat) { await supabase.from('categories').insert([{ name: newCat }]); setNewCat(''); fetchCats(); }
  };

  const deleteCategory = async (id: string) => {
    if(confirm("Delete Category?")) { await supabase.from('categories').delete().eq('id', id); fetchCats(); }
  };

  const deleteNews = async (id: string) => {
    if(confirm("Delete News?")) { await supabase.from('news').delete().eq('id', id); fetchNews(); }
  };

  const startEdit = (n: any) => {
    setEditingId(n.id);
    setForm({
      title_hi: n.title_hi || '', title_en: n.title_en || '',
      content_hi: n.content_hi || '', content_en: n.content_en || '',
      category: n.category || '', image_url: n.image_url || '',
      images: n.images || [], video_url: n.video_url || '', audio_url: n.audio_url || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const saveGlobal = async () => {
    await supabase.from('site_settings').upsert({ 
      section_id: 'global_config', site_name: siteSettings.name, phone_no: siteSettings.phone,
      email_id: siteSettings.email, address: siteSettings.address, extra_home_img: siteSettings.extraImg,
      ad_code: siteSettings.adCode, bg_image: siteSettings.bg, marquee_data: marqueeList
    }, { onConflict: 'section_id' });
    alert("Full Site Settings Saved! ✅");
  };

  const handlePost = async () => {
    if (editingId) {
      const { error } = await supabase.from('news').update(form).eq('id', editingId);
      if(!error) { alert("Updated Successfully! ✅"); setEditingId(null); }
    } else {
      const { error } = await supabase.from('news').insert([form]);
      if(!error) alert("Published! 🚀");
    }
    setForm({ title_hi: '', title_en: '', content_hi: '', content_en: '', category: '', image_url: '', images: [], video_url: '', audio_url: '' });
    fetchNews();
  };

  const inputS = { padding: '12px', borderRadius: '10px', border: '1px solid #ccc', width: '100%', marginBottom: '10px' };

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: 'auto', fontFamily: 'sans-serif', background: '#f8f9fa' }}>
      <h1 style={{ textAlign: 'center', color: '#b91c1c', fontWeight: '900' }}>BASTI JYOTI - SUPREME COMMANDER</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
        
        <div>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
            <h3>{editingId ? "📝 Edit News" : "📰 Create News (Hindi + English)"}</h3>
            <select style={inputS} value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
              <option>Select Category</option>
              {cats.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
            <input style={inputS} value={form.title_hi} placeholder="Hindi Title" onChange={e => setForm({...form, title_hi: e.target.value})} />
            <textarea style={{...inputS, height: '80px'}} value={form.content_hi} placeholder="Hindi Content" onChange={e => setForm({...form, content_hi: e.target.value})} />
            <input style={inputS} value={form.title_en} placeholder="English Title" onChange={e => setForm({...form, title_en: e.target.value})} />
            <textarea style={{...inputS, height: '80px'}} value={form.content_en} placeholder="English Content" onChange={e => setForm({...form, content_en: e.target.value})} />
            <input style={inputS} value={form.image_url} placeholder="Main Thumbnail URL" onChange={e => setForm({...form, image_url: e.target.value})} />
            <input style={inputS} value={form.images.join(', ')} placeholder="Slider Images (comma separated)" onChange={e => setForm({...form, images: e.target.value.split(',').map(s=>s.trim())})} />
            <input style={inputS} value={form.video_url} placeholder="YouTube Video ID" onChange={e => setForm({...form, video_url: e.target.value})} />
            <input style={inputS} value={form.audio_url} placeholder="Audio MP3 Link" onChange={e => setForm({...form, audio_url: e.target.value})} />
            
            <button onClick={handlePost} style={{ width: '100%', background: editingId ? '#2563eb' : '#b91c1c', color: '#fff', padding: '15px', borderRadius: '10px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
                {editingId ? "UPDATE NEWS 🔄" : "PUBLISH NEWS 🚀"}
            </button>
            {editingId && <button onClick={() => {setEditingId(null); setForm({title_hi:'', title_en:'', content_hi:'', content_en:'', category:'', image_url:'', images:[], video_url:'', audio_url:''})}} style={{ marginTop: '10px', width: '100%', background: '#666', color: '#fff', padding: '10px', borderRadius: '10px', border: 'none', cursor: 'pointer' }}>Cancel Edit</button>}
          </div>

          <div style={{ background: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
            <h3>🗑️ Manage News</h3>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {newsList.map(n => (
                <div key={n.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', borderBottom: '1px solid #eee' }}>
                  <span><b>[{n.category}]</b> {n.title_hi?.substring(0,40)}...</span>
                  <div>
                    <button onClick={() => startEdit(n)} style={{ color: 'blue', cursor: 'pointer', marginRight: '10px', border: 'none', background: 'none' }}>Edit</button>
                    <button onClick={() => deleteNews(n.id)} style={{ color: 'red', cursor: 'pointer', border: 'none', background: 'none' }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
            <h3>🛠️ Global Settings (Ads & Site Name)</h3>
            <input style={inputS} placeholder="Website Name" value={siteSettings.name} onChange={e => setSiteSettings({...siteSettings, name: e.target.value})} />
            <input style={inputS} placeholder="Global Background Image URL" value={siteSettings.bg} onChange={e => setSiteSettings({...siteSettings, bg: e.target.value})} />
            <input style={inputS} placeholder="Phone" value={siteSettings.phone} onChange={e => setSiteSettings({...siteSettings, phone: e.target.value})} />
            <input style={inputS} placeholder="Email" value={siteSettings.email} onChange={e => setSiteSettings({...siteSettings, email: e.target.value})} />
            <textarea style={{...inputS, height: '60px'}} placeholder="Google Adsense Code" value={siteSettings.adCode} onChange={e => setSiteSettings({...siteSettings, adCode: e.target.value})} />
            
            <h4>Marquee Texts</h4>
            {marqueeList.map((m, i) => (
              <input key={i} style={inputS} value={m.text} onChange={e => {
                const nl = [...marqueeList]; nl[i].text = e.target.value; setMarqueeList(nl);
              }} />
            ))}
            <button onClick={() => setMarqueeList([...marqueeList, { text: '' }])} style={{ marginBottom: '10px' }}>+ Add Marquee</button>
            <button onClick={saveGlobal} style={{ width: '100%', background: '#333', color: '#fff', padding: '12px', borderRadius: '10px' }}>SAVE ALL SETTINGS</button>
          </div>

          <div style={{ background: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
            <h3>📁 Category Management</h3>
            <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
              <input style={inputS} placeholder="New Cat" value={newCat} onChange={e => setNewCat(e.target.value)} />
              <button onClick={addCategory} style={{ background: '#b91c1c', color: '#fff', padding: '10px', borderRadius: '10px' }}>Add</button>
            </div>
            {cats.map(c => (
              <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', background: '#f8f9fa', padding: '8px', marginBottom: '5px', borderRadius: '8px' }}>
                <span>{c.name}</span>
                <button onClick={() => deleteCategory(c.id)} style={{ color: 'red', border: 'none', background: 'none' }}>✖</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
