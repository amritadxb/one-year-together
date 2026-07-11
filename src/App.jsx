import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, Heart, LockKeyhole, LogOut, X } from "lucide-react";
import { memories } from "./memories";
import { finalLetter } from "./letter";

const PASSWORD = "coopandmurph";
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const WEEKDAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const dateKey = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
const longDate = key => new Intl.DateTimeFormat("en",{weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(new Date(`${key}T12:00:00`));

function Login({onLogin}) {
  const [password,setPassword]=useState("");
  const [error,setError]=useState("");
  const submit=e=>{
    e.preventDefault();
    if(password===PASSWORD){sessionStorage.setItem("one-year-auth","yes");onLogin();}
    else{setError("that password isn't quite right.");setPassword("");}
  };
  return <main className="login-page">
    <div className="login-stars" aria-hidden="true">{Array.from({length:18}).map((_,i)=><span key={i}/>)}</div>
    <section className="login-card">
      <button className="secret-heart" title="home."><Heart size={23}/></button>
      <p className="eyebrow">july 2025 — july 2026</p>
      <h1>One Year Together</h1>
      <h2>Accha and His Puppykutty</h2>
      <p className="login-copy">a little book of the moments that quietly became home.</p>
      <form onSubmit={submit}>
        <label htmlFor="password">our password</label>
        <div className="password-field"><LockKeyhole size={17}/><input id="password" type="password" value={password} onChange={e=>{setPassword(e.target.value);setError("");}} autoFocus placeholder="enter password"/></div>
        {error && <p className="error-message">{error}</p>}
        <button className="primary-button">open our year</button>
      </form>
    </section>
  </main>;
}

function Chapter({index,onBack,onChange,onLetter}) {
  const memory=memories[index];
  return <main className="chapter-page">
    <button className="floating-close" onClick={onBack}><X size={19}/></button>
    <section className="chapter-shell">
      <header className="chapter-heading">
        <p className="memory-count">memory {String(index+1).padStart(2,"0")} of {String(memories.length).padStart(2,"0")}</p>
        <p className="chapter-date">{longDate(memory.date)}</p>
        <h1>{memory.title}</h1>
      </header>
      {memory.photo ? <figure className="photo-frame"><img src={memory.photo} alt={memory.title}/></figure> :
        <div className="photo-placeholder"><Heart size={40}/><span>some memories live beyond photographs.</span></div>}
      <article className="memory-story"><p>{memory.description}</p></article>
      <nav className="chapter-nav">
        <button disabled={index===0} onClick={()=>onChange(index-1)}><ArrowLeft size={17}/><span><small>previous memory</small>{index?memories[index-1].title:"the beginning"}</span></button>
        <button className="calendar-pill" onClick={onBack}><CalendarDays size={16}/>calendar</button>
        {index===memories.length-1 ?
          <button className="letter-next" onClick={onLetter}><span><small>one last thing</small>to my accha</span><ArrowRight size={17}/></button> :
          <button onClick={()=>onChange(index+1)}><span><small>next memory</small>{memories[index+1].title}</span><ArrowRight size={17}/></button>}
      </nav>
    </section>
  </main>;
}

function Letter({onClose,onFinish}) {
  return <main className="letter-page">
    <button className="floating-close" onClick={onClose}><X size={19}/></button>
    <section className="letter-shell">
      <div className="letter-hero"><img src="/photos/2025-12-22.jpg" alt="Accha and his Puppykutty at the beach"/><div className="letter-overlay"><p>one year together</p><h1>to my dearest accha,</h1></div></div>
      <article className="letter-copy">
        {finalLetter.map((p,i)=><p key={i} className={p==="happy one year."?"letter-emphasis":i===finalLetter.length-1?"letter-signoff":""}>{p}</p>)}
        <button className="close-book" onClick={onFinish}>close the book</button>
      </article>
    </section>
  </main>;
}

function Ending({onRestart}) {
  const [clicks,setClicks]=useState(0);
  return <main className="ending-page">
    <button className="ending-heart" onClick={()=>setClicks(c=>c+1)}><Heart fill="currentColor"/></button>
    <h1>one year together.</h1>
    <p>july 2025 — july 2026</p>
    <span>accha and his puppykutty</span>
    {clicks>=5 && <button className="restart-link" onClick={onRestart}>every ending is another beginning.</button>}
  </main>;
}

function Calendar({onLogout}) {
  const [visible,setVisible]=useState(new Date(2025,6,1));
  const [selected,setSelected]=useState(null);
  const [showLetter,setShowLetter]=useState(false);
  const [ending,setEnding]=useState(false);
  const map=useMemo(()=>new Map(memories.map((m,i)=>[m.date,{m,i}])),[]);
  const cells=useMemo(()=>{
    const y=visible.getFullYear(),m=visible.getMonth(),start=new Date(y,m,1).getDay(),days=new Date(y,m+1,0).getDate();
    const a=Array(start).fill(null); for(let d=1;d<=days;d++)a.push(new Date(y,m,d)); while(a.length%7)a.push(null); return a;
  },[visible]);
  if(ending) return <Ending onRestart={()=>{setEnding(false);setShowLetter(false);setSelected(null);setVisible(new Date(2025,6,1));}}/>;
  if(showLetter) return <Letter onClose={()=>setShowLetter(false)} onFinish={()=>setEnding(true)}/>;
  if(selected!==null) return <Chapter index={selected} onBack={()=>setSelected(null)} onChange={setSelected} onLetter={()=>setShowLetter(true)}/>;
  return <main className="app-page">
    <header className="app-header"><div><p className="eyebrow title-secret" title="every date changed because of you.">a year of us</p><h1>Our Memories</h1></div><button className="logout-button" onClick={onLogout}><LogOut size={16}/>log out</button></header>
    <section className="calendar-card">
      <div className="calendar-toolbar">
        <div className="month-heading"><CalendarDays size={20}/><div><h2>{MONTHS[visible.getMonth()]}</h2><p>{visible.getFullYear()}</p></div></div>
        <div className="calendar-actions">
          <button className="icon-button" onClick={()=>setVisible(new Date(visible.getFullYear(),visible.getMonth()-1,1))}><ArrowLeft size={18}/></button>
          <button className="today-button" onClick={()=>setVisible(new Date(2025,6,1))}>first memory</button>
          <button className="icon-button" onClick={()=>setVisible(new Date(visible.getFullYear(),visible.getMonth()+1,1))}><ArrowRight size={18}/></button>
        </div>
      </div>
      <div className="weekday-row">{WEEKDAYS.map(x=><div key={x}>{x}</div>)}</div>
      <div className="calendar-grid">{cells.map((d,i)=>{
        if(!d)return <div className="empty-day" key={`e-${i}`}/>;
        const entry=map.get(dateKey(d));
        return <button key={dateKey(d)} disabled={!entry} className={`calendar-day ${entry?"has-memory":""}`} onClick={()=>entry&&setSelected(entry.i)}>
          <span className="day-number">{d.getDate()}</span>
          {entry&&<span className="memory-indicator"><Heart size={11} fill="currentColor"/><span>{entry.m.title}</span></span>}
        </button>;
      })}</div>
    </section>
    <p className="calendar-note">every heart opens one memory from our year.</p>
  </main>;
}

export default function App(){
  const [logged,setLogged]=useState(sessionStorage.getItem("one-year-auth")==="yes");
  return logged?<Calendar onLogout={()=>{sessionStorage.removeItem("one-year-auth");setLogged(false);}}/>:<Login onLogin={()=>setLogged(true)}/>;
}
