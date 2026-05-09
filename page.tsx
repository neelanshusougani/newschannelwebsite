"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function Home() {
  const [news, setNews] = useState<any[]>([]);
  const [cats, setCats] = useState<any[]>([]);
  const [global, setGlobal] = useState<any>(null);
  const [selectedNews, setSelectedNews] = useState<any>(null);
  const [activeCat, setActiveCat] = useState('All');
  const [lang, setLang] = useState('hi');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadEverything = async () => {
      try {
        const { data: n } = await supabase.from('news').select('*').order('created_at', { ascending: false });
        if (n) setNews(n);
        const { data: c } = await supabase.from('categories').select('*');
        if (c) setCats(c);
        const { data: s } = await supabase.from('site_settings').select('*').eq('section_id', 'global_config').maybeSingle();
        if (s) setGlobal(s);
        setIsLoaded(true);
      } catch (err) {
        console.error("Error:", err);
      }
    };
    loadEverything();
  }, []);

  const filteredNews = activeCat === 'All' ? news : news.filter(i => i.category === activeCat);

  if (!isLoaded) return <div style={{textAlign:'center', marginTop:'50px'}}>Loading Basti Jyoti...</div>;

  return (
    <div style={{ 
      backgroundImage: global?.bg_image ? `url("${global.bg_image}")` : 'none', 
      backgroundColor: '#f4f4f4',
      backgroundSize: 'cover', 
      backgroundAttachment: 'fixed', 
      minHeight: '100vh',
      width: '100%'
    }}>
      {/* Navbar */}
      <nav style={{ background: '#b91c1c', color: '#fff', padding: '15px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '1.8rem' }}>{global?.site_name || 'BASTI JYOTI'}</h1>
        <button onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')} style={{ padding: '8px 15px', borderRadius: '20px', cursor: 'pointer', border: 'none', fontWeight: 'bold', background: '#fff', color: '#b91c1c' }}>
          {lang === 'hi' ? 'English' : 'हिंदी'}
        </button>
      </nav>

      {/* Marquee (Multiple) */}
      {global?.marquee_data && Array.isArray(global.marquee_data) && global.marquee_data.map((m: any, i: number) => (
        m.text && <marquee key={i} style={{ background: i % 2 === 0 ? '#000' : '#b91c1c', color: '#fff', padding: '5px', display: 'block' }}>{m.text}</marquee>
      ))}

      {/* Ad Code */}
      {global?.ad_code && (
        <div style={{ textAlign: 'center', margin: '15px auto', maxWidth: '800px' }} 
             dangerouslySetInnerHTML={{ __html: global.ad_code }} />
      )}

      {/* Category Bar */}
      <div style={{ background: 'white', padding: '10px', display: 'flex', justifyContent: 'center', gap: '8px', position: 'sticky', top: 0, zIndex: 10, overflowX: 'auto', borderBottom: '1px solid #ddd' }}>
        <button onClick={() => setActiveCat('All')} style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', background: activeCat === 'All' ? '#b91c1c' : '#eee', color: activeCat === 'All' ? '#fff' : '#000', cursor: 'pointer' }}>All</button>
        {cats.map(c => (
          <button key={c.id} onClick={() => setActiveCat(c.name)} style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', background: activeCat === c.name ? '#b91c1c' : '#eee', color: activeCat === c.name ? '#fff' : '#000', cursor: 'pointer', whiteSpace: 'nowrap' }}>{c.name}</button>
        ))}
      </div>

      {/* News List */}
      <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
        {filteredNews.map((item) => (
          <div key={item.id} onClick={() => setSelectedNews(item)} style={{ background: 'rgba(255,255,255,0.95)', marginBottom: '15px', borderRadius: '12px', display: 'flex', cursor: 'pointer', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
            <img src={item.image_url} style={{ width: '140px', height: '100px', objectFit: 'cover' }} />
            <div style={{ padding: '15px' }}>
              <span style={{ color: '#b91c1c', fontWeight: 'bold', fontSize: '0.75rem' }}>{item.category}</span>
              <h3 style={{ margin: '5px 0', fontSize: '1.1rem' }}>{lang === 'hi' ? item.title_hi : (item.title_en || item.title_hi)}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer style={{ background: '#111', color: '#fff', padding: '30px 5%', textAlign: 'center' }}>
        <p>📞 {global?.phone_no} | 📧 {global?.email_id}</p>
        <p>© 2026 {global?.site_name || 'Basti Jyoti'}</p>
      </footer>

      {/* News Modal */}
      {selectedNews && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', zIndex: 100, display: 'flex', justifyContent: 'center', padding: '15px' }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: '750px', maxHeight: '90vh', borderRadius: '20px', overflowY: 'auto', padding: '25px', position: 'relative' }}>
            <button onClick={() => setSelectedNews(null)} style={{ position: 'absolute', top: '15px', right: '20px', fontSize: '1.8rem', border: 'none', background: 'none', cursor: 'pointer' }}>×</button>
            <div style={{ display: 'flex', overflowX: 'auto', gap: '10px', marginBottom: '15px' }}>
              {selectedNews.images?.map((img:string, i:number) => <img key={i} src={img} style={{ height: '250px', borderRadius: '10px' }} />)}
            </div>
            <h2>{lang === 'hi' ? selectedNews.title_hi : (selectedNews.title_en || selectedNews.title_hi)}</h2>
            <p style={{ whiteSpace: 'pre-wrap', fontSize: '1.1rem', lineHeight: '1.6' }}>{lang === 'hi' ? selectedNews.content_hi : (selectedNews.content_en || selectedNews.content_hi)}</p>
          </div>
        </div>
      )}
    </div>
  );
}