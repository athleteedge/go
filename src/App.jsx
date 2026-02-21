import { useState, useEffect, useRef } from "react";

const SPORTS = ["Swimming","Basketball","Soccer","Fencing","Ice Skating","Track & Field","Gymnastics","Cycling","Tennis","Volleyball","Wrestling","Rowing"];
const LEVELS = ["Recreational","Amateur","Elite"];
const GOALS = ["Weight Management","Endurance","Strength","Recovery","Competition Prep"];
const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const AVATARS = ["🏊","🏀","⚽","🤺","⛸️","🏃","🤸","🚴","🎾","🏐","🤼","🚣","👤"];
const COLORS = {
  Swimming:"#0ea5e9",Basketball:"#f97316",Soccer:"#22c55e",Fencing:"#8b5cf6",
  "Ice Skating":"#38bdf8","Track & Field":"#eab308",Gymnastics:"#ec4899",
  Cycling:"#f43f5e",Tennis:"#84cc16",Volleyball:"#fb923c",Wrestling:"#a855f7",Rowing:"#14b8a6"
};

// ─── STORAGE ──────────────────────────────────────────────────────────────────
const store = {
  async get(key, shared=false) {
    try { const r = await window.storage.get(key, shared); return r?.value ?? null; } catch { return null; }
  },
  async set(key, val, shared=false) {
    try { await window.storage.set(key, val, shared); } catch {}
  },
  async del(key) {
    try { await window.storage.delete(key); } catch {}
  }
};
const profileKey = email => `profile:${email.replace(/[@.]/g,"_")}`;
const pwKey      = email => `pwd:${email.replace(/[@.]/g,"_")}`;

// ─── AI CONTENT VIA ANTHROPIC API ────────────────────────────────────────────
async function fetchAI(prompt, maxTokens=900) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({
      model:"claude-sonnet-4-20250514",
      max_tokens: maxTokens,
      messages:[{role:"user", content: prompt}]
    })
  });
  const data = await res.json();
  return data.content?.[0]?.text ?? "";
}

async function getAINutrition(sport, level) {
  const text = await fetchAI(
    `You are a sports nutritionist. For a ${level} ${sport} athlete, respond ONLY with a JSON object (no markdown) with this exact shape:
{
  "macros": {"carbs": <number>, "protein": <number>, "fats": <number>},
  "today": {
    "breakfast": "<meal>",
    "lunch": "<meal>",
    "dinner": "<meal>",
    "snacks": "<snack | snack>"
  },
  "eat": ["<food>","<food>","<food>","<food>","<food>"],
  "avoid": ["<food>","<food>","<food>","<food>"]
}
Macros must sum to 100. Be specific and practical.`
  );
  try { return JSON.parse(text.replace(/```json|```/g,"").trim()); } catch { return null; }
}

async function getAIWorkout(sport, level, day) {
  const text = await fetchAI(
    `You are an elite sports coach. For a ${level} ${sport} athlete on ${day}, respond ONLY with a JSON object (no markdown):
{
  "focus": "<session focus>",
  "warmup": "<warmup description>",
  "exercises": [
    {"name":"<name>","sets":"<sets/reps/duration>","tips":"<coaching tip>","alt":"<easier alternative>","prog":"<progression>"},
    {"name":"<name>","sets":"<sets/reps/duration>","tips":"<coaching tip>","alt":"<easier alternative>","prog":"<progression>"},
    {"name":"<name>","sets":"<sets/reps/duration>","tips":"<coaching tip>","alt":"<easier alternative>","prog":"<progression>"}
  ],
  "cooldown": "<cooldown>"
}
3 exercises only. Be specific and practical.`
  );
  try { return JSON.parse(text.replace(/```json|```/g,"").trim()); } catch { return null; }
}

async function getAIRecovery(sport) {
  const text = await fetchAI(
    `You are a sports recovery specialist. For a ${sport} athlete, respond ONLY with a JSON object (no markdown):
{
  "injury_prevention": ["<tip>","<tip>","<tip>","<tip>","<tip>"],
  "recovery_protocols": ["<protocol>","<protocol>","<protocol>","<protocol>"],
  "sleep_tips": ["<tip>","<tip>","<tip>"],
  "mental_tips": ["<tip>","<tip>","<tip>"]
}`
  );
  try { return JSON.parse(text.replace(/```json|```/g,"").trim()); } catch { return null; }
}

// ─── UI PRIMITIVES ────────────────────────────────────────────────────────────
const Card = ({children, style={}}) => (
  <div style={{background:"#1e293b",borderRadius:16,padding:24,...style}}>{children}</div>
);
const Tag = ({label,color}) => (
  <span style={{background:color+"22",color,borderRadius:20,padding:"4px 12px",fontSize:12,fontWeight:700}}>{label}</span>
);
const Inp = ({label,placeholder,value,onChange,type="text",required}) => (
  <div style={{marginBottom:16}}>
    <label style={{display:"block",fontWeight:700,fontSize:13,color:"#94a3b8",marginBottom:6}}>
      {label}{required&&<span style={{color:"#f43f5e"}}> *</span>}
    </label>
    <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
      style={{width:"100%",background:"#0f172a",border:"1px solid #334155",borderRadius:10,
              padding:"12px 16px",color:"#e2e8f0",fontSize:14,boxSizing:"border-box",outline:"none"}}/>
  </div>
);
const Spinner = ({color="#facc15",size=32}) => (
  <div style={{width:size,height:size,border:`3px solid ${color}33`,borderTop:`3px solid ${color}`,
               borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
);

const POSTS_INIT = [
  {id:1,name:"Alex R.",sport:"Swimming",level:"Amateur",avatar:"🏊",time:"2h ago",
   title:"Pre-meet breakfast ideas?",
   body:"I always feel sluggish during warm-up. Any suggestions for what to eat the morning of a competition?",
   likes:12,replies:2,repliesList:[
     {id:11,name:"Sam T.",sport:"Track & Field",avatar:"🏃",time:"1h ago",body:"Oatmeal with banana 2.5hrs before — works perfectly!",color:"#eab308"},
     {id:12,name:"Jordan K.",sport:"Gymnastics",avatar:"🤸",time:"45m ago",body:"Toast with peanut butter and a small coffee. Keeps me light but energised.",color:"#ec4899"}
   ],color:"#0ea5e9"},
  {id:2,name:"Jordan K.",sport:"Gymnastics",level:"Elite",avatar:"🤸",time:"5h ago",
   title:"Wrist recovery after minor sprain",
   body:"Rolled my wrist during beam practice. Doing RICE but wondering if there are specific exercises to speed up recovery safely.",
   likes:8,replies:1,repliesList:[
     {id:21,name:"Alex R.",sport:"Swimming",avatar:"🏊",time:"3h ago",body:"Rice + wrist circles in warm water helped me. See a physio though!",color:"#0ea5e9"}
   ],color:"#ec4899"},
  {id:3,name:"Sam T.",sport:"Track & Field",level:"Recreational",avatar:"🏃",time:"1d ago",
   title:"Best protein sources on a budget",
   body:"Training for my first 10K. Can't afford expensive supplements. What whole foods give the best protein bang for my buck?",
   likes:21,replies:0,repliesList:[],color:"#eab308"},
];

// ─── AUTH ─────────────────────────────────────────────────────────────────────
function AuthScreen({onAuth}) {
  const [mode,setMode] = useState("login");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState("");
  const [msg,setMsg] = useState("");
  const [loading,setLoading] = useState(false);

  const submit = async () => {
    setError(""); setMsg("");
    if(!email||!password){setError("Please fill in all fields.");return;}
    if(password.length<6){setError("Password must be at least 6 characters.");return;}
    setLoading(true);
    await new Promise(r=>setTimeout(r,300));
    const key = pwKey(email);
    if(mode==="signup"){
      const existing = await store.get(key);
      if(existing){setError("Account already exists. Please log in.");setLoading(false);return;}
      await store.set(key, password);
      setMsg("✅ Account created! You can now log in.");
      setMode("login");
    } else {
      const stored = await store.get(key);
      if(stored===null){setError("No account found. Please sign up first.");setLoading(false);return;}
      if(stored!==password){setError("Incorrect password.");setLoading(false);return;}
      onAuth({email, id:"user_"+email.replace(/[@.]/g,"_")});
    }
    setLoading(false);
  };

  return (
    <div style={{minHeight:"100vh",background:"#0f172a",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{width:"100%",maxWidth:420}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontSize:48}}>🏅</div>
          <h1 style={{color:"#fff",fontWeight:900,fontSize:28,margin:"8px 0 0"}}><span style={{color:"#facc15"}}>Athlete</span>Edge</h1>
          <p style={{color:"#64748b",marginTop:8}}>Your sports nutrition & recovery community</p>
        </div>
        <Card>
          <div style={{display:"flex",marginBottom:24,background:"#0f172a",borderRadius:10,padding:4}}>
            {["login","signup"].map(m=>(
              <button key={m} onClick={()=>setMode(m)}
                style={{flex:1,background:mode===m?"#facc15":"transparent",color:mode===m?"#0f172a":"#64748b",
                        border:"none",borderRadius:8,padding:"10px",fontWeight:700,cursor:"pointer",fontSize:14}}>
                {m==="login"?"Log In":"Sign Up"}
              </button>
            ))}
          </div>
          {msg&&<div style={{background:"#22c55e22",border:"1px solid #22c55e",borderRadius:10,padding:12,marginBottom:16,color:"#86efac",fontSize:13}}>{msg}</div>}
          {error&&<div style={{background:"#f43f5e22",border:"1px solid #f43f5e",borderRadius:10,padding:12,marginBottom:16,color:"#fca5a5",fontSize:13}}>⚠️ {error}</div>}
          <Inp label="Email" placeholder="you@example.com" value={email} onChange={setEmail} type="email" required/>
          <Inp label="Password" placeholder="Min. 6 characters" value={password} onChange={setPassword} type="password" required/>
          <button onClick={submit} disabled={loading}
            style={{width:"100%",background:"#facc15",color:"#0f172a",border:"none",borderRadius:10,
                    padding:"14px",fontWeight:800,fontSize:15,cursor:loading?"not-allowed":"pointer",opacity:loading?0.7:1,marginTop:8}}>
            {loading ? <div style={{display:"flex",justifyContent:"center"}}><Spinner color="#0f172a" size={20}/></div>
                     : mode==="login"?"Log In →":"Create Account →"}
          </button>
        </Card>
        <p style={{textAlign:"center",color:"#334155",fontSize:12,marginTop:16}}>Your data is stored securely.</p>
      </div>
    </div>
  );
}

// ─── ONBOARDING ───────────────────────────────────────────────────────────────
function Onboarding({authUser, onComplete}) {
  const [step,setStep] = useState(1);
  const [form,setForm] = useState({
    name:"",age:"",gender:"",sport:"Swimming",level:"Amateur",goals:["Endurance"],
    email:authUser.email,phone:"",country:"",city:"",social:"",
    club:"",coach:"",trainingDays:[],clubWebsite:"",photo:null,avatar:"👤"
  });
  const fileRef = useRef();
  const sc = COLORS[form.sport]||"#facc15";
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const toggleGoal = g => set("goals", form.goals.includes(g)?form.goals.filter(x=>x!==g):[...form.goals,g]);
  const toggleDay  = d => set("trainingDays", form.trainingDays.includes(d)?form.trainingDays.filter(x=>x!==d):[...form.trainingDays,d]);
  const canNext = () => { if(step===1) return form.name.trim()&&form.age&&form.gender; return true; };
  const steps = ["Personal","Club & Goals","Photo"];

  return (
    <div style={{minHeight:"100vh",background:"#0f172a",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{width:"100%",maxWidth:560}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{fontSize:40}}>🏅</div>
          <h1 style={{color:"#fff",fontWeight:900,fontSize:24,margin:"8px 0 0"}}><span style={{color:"#facc15"}}>Athlete</span>Edge</h1>
          <p style={{color:"#64748b",marginTop:4}}>Set up your profile</p>
        </div>
        {/* Step dots */}
        <div style={{display:"flex",alignItems:"center",marginBottom:28,gap:0}}>
          {steps.map((l,i)=>(
            <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center"}}>
              <div style={{display:"flex",alignItems:"center",width:"100%"}}>
                {i>0&&<div style={{flex:1,height:2,background:step>i?"#facc15":"#334155"}}/>}
                <div style={{width:30,height:30,borderRadius:"50%",
                             background:step>i+1?"#facc15":step===i+1?sc:"#1e293b",
                             border:`2px solid ${step>=i+1?sc:"#334155"}`,
                             display:"flex",alignItems:"center",justifyContent:"center",
                             fontWeight:800,fontSize:12,color:step>i+1?"#0f172a":"#fff",flexShrink:0}}>
                  {step>i+1?"✓":i+1}
                </div>
                {i<2&&<div style={{flex:1,height:2,background:step>i+1?"#facc15":"#334155"}}/>}
              </div>
              <div style={{fontSize:10,color:step===i+1?"#facc15":"#475569",marginTop:5,fontWeight:600}}>{l}</div>
            </div>
          ))}
        </div>
        <Card>
          {step===1&&<div>
            <h2 style={{fontWeight:800,fontSize:18,margin:"0 0 18px"}}>👤 Personal Information</h2>
            <Inp label="Full Name" placeholder="Jordan Smith" value={form.name} onChange={v=>set("name",v)} required/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <Inp label="Age" placeholder="22" value={form.age} onChange={v=>set("age",v)} type="number" required/>
              <div style={{marginBottom:16}}>
                <label style={{display:"block",fontWeight:700,fontSize:13,color:"#94a3b8",marginBottom:6}}>Gender *</label>
                <div style={{display:"flex",gap:6}}>
                  {["Male","Female","Other"].map(g=>(
                    <button key={g} onClick={()=>set("gender",g)}
                      style={{flex:1,background:form.gender===g?sc:"#0f172a",color:form.gender===g?"#fff":"#64748b",
                              border:`2px solid ${form.gender===g?sc:"#334155"}`,borderRadius:10,
                              padding:"9px 4px",cursor:"pointer",fontWeight:700,fontSize:12}}>{g}</button>
                  ))}
                </div>
              </div>
            </div>
            <div style={{marginBottom:16}}>
              <label style={{display:"block",fontWeight:700,fontSize:13,color:"#94a3b8",marginBottom:10}}>Your Sport</label>
              <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                {SPORTS.map(s=>(
                  <button key={s} onClick={()=>set("sport",s)}
                    style={{background:form.sport===s?COLORS[s]:"#1e293b",color:form.sport===s?"#fff":"#94a3b8",
                            border:`2px solid ${form.sport===s?COLORS[s]:"#334155"}`,borderRadius:20,
                            padding:"7px 14px",cursor:"pointer",fontWeight:600,fontSize:12}}>{s}</button>
                ))}
              </div>
            </div>
            <div style={{marginBottom:16}}>
              <label style={{display:"block",fontWeight:700,fontSize:13,color:"#94a3b8",marginBottom:10}}>Level</label>
              <div style={{display:"flex",gap:8}}>
                {LEVELS.map(l=>(
                  <button key={l} onClick={()=>set("level",l)}
                    style={{flex:1,background:form.level===l?"#facc15":"#0f172a",color:form.level===l?"#0f172a":"#64748b",
                            border:`2px solid ${form.level===l?"#facc15":"#334155"}`,borderRadius:10,
                            padding:"9px",cursor:"pointer",fontWeight:700,fontSize:13}}>{l}</button>
                ))}
              </div>
            </div>
          </div>}

          {step===2&&<div>
            <h2 style={{fontWeight:800,fontSize:18,margin:"0 0 18px"}}>🏟️ Club & Goals</h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <Inp label="Club / Team" placeholder="City Aquatics Club" value={form.club} onChange={v=>set("club",v)}/>
              <Inp label="Coach" placeholder="Coach Martinez" value={form.coach} onChange={v=>set("coach",v)}/>
              <Inp label="Country" placeholder="United States" value={form.country} onChange={v=>set("country",v)}/>
              <Inp label="City" placeholder="Chicago" value={form.city} onChange={v=>set("city",v)}/>
            </div>
            <div style={{marginBottom:16}}>
              <label style={{display:"block",fontWeight:700,fontSize:13,color:"#94a3b8",marginBottom:10}}>Training Days</label>
              <div style={{display:"flex",gap:6}}>
                {DAYS.map(d=>{
                  const a=form.trainingDays.includes(d);
                  return <button key={d} onClick={()=>toggleDay(d)}
                    style={{flex:1,background:a?sc:"#0f172a",color:a?"#fff":"#64748b",
                            border:`2px solid ${a?sc:"#334155"}`,borderRadius:10,
                            padding:"9px 2px",cursor:"pointer",fontWeight:700,fontSize:11}}>{d}</button>;
                })}
              </div>
            </div>
            <div>
              <label style={{display:"block",fontWeight:700,fontSize:13,color:"#94a3b8",marginBottom:10}}>Goals</label>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {GOALS.map(g=>{
                  const a=form.goals.includes(g);
                  return <button key={g} onClick={()=>toggleGoal(g)}
                    style={{background:a?"#7c3aed22":"#0f172a",color:a?"#a78bfa":"#64748b",
                            border:`2px solid ${a?"#7c3aed":"#334155"}`,borderRadius:20,
                            padding:"7px 14px",cursor:"pointer",fontWeight:600,fontSize:13}}>{g}</button>;
                })}
              </div>
            </div>
          </div>}

          {step===3&&<div>
            <h2 style={{fontWeight:800,fontSize:18,margin:"0 0 8px"}}>📸 Profile Photo</h2>
            <p style={{color:"#64748b",fontSize:14,marginBottom:20}}>Upload a photo or pick an avatar.</p>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:16}}>
              <div style={{width:100,height:100,borderRadius:"50%",background:sc+"33",border:`3px solid ${sc}`,
                           display:"flex",alignItems:"center",justifyContent:"center",fontSize:50,overflow:"hidden"}}>
                {form.photo?<img src={form.photo} style={{width:"100%",height:"100%",objectFit:"cover"}} alt="av"/>:form.avatar}
              </div>
              <button onClick={()=>fileRef.current.click()}
                style={{background:sc,color:"#0f172a",border:"none",borderRadius:10,padding:"9px 18px",fontWeight:700,cursor:"pointer"}}>
                📁 Upload Photo
              </button>
              <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}}
                onChange={e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>set("photo",ev.target.result);r.readAsDataURL(f);}}/>
              <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center"}}>
                {AVATARS.map(a=>(
                  <button key={a} onClick={()=>{set("avatar",a);set("photo",null);}}
                    style={{width:42,height:42,borderRadius:"50%",
                            background:form.avatar===a&&!form.photo?sc+"33":"#0f172a",
                            border:`2px solid ${form.avatar===a&&!form.photo?sc:"#334155"}`,
                            fontSize:20,cursor:"pointer"}}>{a}</button>
                ))}
              </div>
            </div>
          </div>}

          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:24}}>
            <button onClick={()=>step>1&&setStep(step-1)}
              style={{background:"transparent",color:step===1?"#334155":"#94a3b8",
                      border:`2px solid ${step===1?"#1e293b":"#334155"}`,borderRadius:10,
                      padding:"9px 18px",fontWeight:600,cursor:step===1?"default":"pointer"}}>← Back</button>
            <span style={{color:"#475569",fontSize:13}}>{step} / {steps.length}</span>
            {step<3
              ? <button onClick={()=>canNext()&&setStep(step+1)}
                  style={{background:canNext()?"#facc15":"#334155",color:canNext()?"#0f172a":"#64748b",
                          border:"none",borderRadius:10,padding:"9px 22px",fontWeight:700,
                          cursor:canNext()?"pointer":"default"}}>Next →</button>
              : <button onClick={()=>onComplete(form)}
                  style={{background:"#facc15",color:"#0f172a",border:"none",borderRadius:10,
                          padding:"9px 22px",fontWeight:700,cursor:"pointer"}}>Complete 🎉</button>
            }
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── WELCOME ──────────────────────────────────────────────────────────────────
function WelcomeScreen({user, onEnter}) {
  const sc = COLORS[user.sport]||"#facc15";
  return (
    <div style={{minHeight:"100vh",background:"#0f172a",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{maxWidth:480,width:"100%",textAlign:"center"}}>
        <div style={{width:90,height:90,borderRadius:"50%",background:sc+"33",border:`3px solid ${sc}`,
                     display:"flex",alignItems:"center",justifyContent:"center",fontSize:46,
                     margin:"0 auto 20px",overflow:"hidden"}}>
          {user.photo?<img src={user.photo} style={{width:"100%",height:"100%",objectFit:"cover"}} alt="av"/>:user.avatar}
        </div>
        <div style={{fontSize:12,color:"#facc15",fontWeight:700,letterSpacing:2,marginBottom:10}}>WELCOME TO ATHLETEEDGE</div>
        <h1 style={{color:"#fff",fontWeight:900,fontSize:30,margin:"0 0 6px"}}>
          Hey, <span style={{color:sc}}>{user.name.split(" ")[0]}!</span> 👋
        </h1>
        <p style={{color:"#64748b",marginBottom:24}}>Your personalised athlete hub is ready.</p>
        <Card style={{textAlign:"left",marginBottom:20}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[{l:"Sport",v:user.sport,i:"🏅"},{l:"Level",v:user.level,i:"🎯"},
              {l:"Club",v:user.club||"Independent",i:"🏟️"},{l:"Goals",v:(user.goals||[]).join(", ")||"—",i:"⭐"}].map(x=>(
              <div key={x.l} style={{background:"#0f172a",borderRadius:12,padding:12}}>
                <div style={{fontSize:16,marginBottom:3}}>{x.i}</div>
                <div style={{fontSize:10,color:"#64748b",fontWeight:700}}>{x.l}</div>
                <div style={{fontSize:12,color:"#e2e8f0",fontWeight:600,marginTop:2}}>{x.v}</div>
              </div>
            ))}
          </div>
        </Card>
        <button onClick={onEnter}
          style={{background:sc,color:"#0f172a",border:"none",borderRadius:12,
                  padding:"14px 40px",fontWeight:800,fontSize:16,cursor:"pointer",width:"100%"}}>
          Enter AthleteEdge →
        </button>
      </div>
    </div>
  );
}

// ─── NAV ──────────────────────────────────────────────────────────────────────
function Nav({page, setPage, user, onLogout}) {
  const sc = COLORS[user.sport]||"#facc15";
  return (
    <nav style={{background:"#0f172a",padding:"0 16px",display:"flex",alignItems:"center",
                 justifyContent:"space-between",height:58,position:"sticky",top:0,zIndex:100,
                 borderBottom:"1px solid #1e293b"}}>
      <div style={{color:"#fff",fontWeight:800,fontSize:18}}>🏅 <span style={{color:"#facc15"}}>Athlete</span>Edge</div>
      <div style={{display:"flex",gap:2}}>
        {["Home","Nutrition","Workouts","Recovery","Community"].map(p=>(
          <button key={p} onClick={()=>setPage(p)}
            style={{background:page===p?"#facc15":"transparent",color:page===p?"#0f172a":"#94a3b8",
                    border:"none",borderRadius:8,padding:"6px 11px",cursor:"pointer",fontWeight:600,fontSize:12}}>{p}</button>
        ))}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <div style={{display:"flex",alignItems:"center",gap:7,cursor:"pointer"}} onClick={()=>setPage("Profile")}>
          <div style={{width:30,height:30,borderRadius:"50%",background:sc+"33",border:`2px solid ${sc}`,
                       display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,overflow:"hidden"}}>
            {user.photo?<img src={user.photo} style={{width:"100%",height:"100%",objectFit:"cover"}} alt="av"/>:user.avatar}
          </div>
          <span style={{color:"#e2e8f0",fontSize:13,fontWeight:600}}>{user.name?.split(" ")[0]}</span>
        </div>
        <button onClick={onLogout}
          style={{background:"transparent",color:"#64748b",border:"1px solid #334155",
                  borderRadius:8,padding:"5px 10px",cursor:"pointer",fontSize:11}}>Log Out</button>
      </div>
    </nav>
  );
}

// ─── NUTRITION PAGE (AI-powered) ──────────────────────────────────────────────
function NutritionPage({profile}) {
  const sc = COLORS[profile.sport]||"#facc15";
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState(DAYS[new Date().getDay()===0?6:new Date().getDay()-1]);

  useEffect(()=>{
    setLoading(true); setData(null);
    getAINutrition(profile.sport, profile.level).then(d=>{setData(d);setLoading(false);});
  },[profile.sport,profile.level]);

  return (
    <div style={{maxWidth:860,margin:"0 auto",padding:28}}>
      <div style={{display:"flex",gap:8,marginBottom:8}}><Tag label={profile.sport} color={sc}/><Tag label={profile.level} color="#facc15"/></div>
      <h2 style={{fontWeight:900,fontSize:26,marginBottom:20}}>🥗 Nutrition Plan</h2>
      <div style={{background:"#1e293b44",border:"1px solid #334155",borderRadius:12,padding:12,marginBottom:20,color:"#94a3b8",fontSize:13}}>
        ✨ AI-generated plan personalised for <strong style={{color:sc}}>{profile.level} {profile.sport}</strong> athletes. Refresh the page to generate a new plan.
      </div>
      {loading ? (
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:60,gap:16}}>
          <Spinner color={sc} size={40}/>
          <div style={{color:"#64748b"}}>Generating your personalised nutrition plan…</div>
        </div>
      ) : data ? (<>
        <Card style={{marginBottom:18}}>
          <div style={{fontWeight:800,fontSize:15,marginBottom:14}}>📊 Daily Macro Targets</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
            {[{l:"Carbs",v:data.macros.carbs,c:"#eab308",icon:"🍚"},{l:"Protein",v:data.macros.protein,c:sc,icon:"🥩"},{l:"Fats",v:data.macros.fats,c:"#f97316",icon:"🥑"}].map(m=>(
              <div key={m.l} style={{background:"#0f172a",borderRadius:12,padding:14,textAlign:"center"}}>
                <div style={{fontSize:24}}>{m.icon}</div>
                <div style={{fontSize:28,fontWeight:900,color:m.c,marginTop:3}}>{m.v}%</div>
                <div style={{fontSize:11,color:"#64748b",marginTop:3}}>{m.l}</div>
                <div style={{height:5,background:"#334155",borderRadius:3,marginTop:7}}>
                  <div style={{height:"100%",width:`${m.v}%`,background:m.c,borderRadius:3}}/>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card style={{marginBottom:18}}>
          <div style={{fontWeight:800,fontSize:15,marginBottom:12}}>🍽️ Today's Meal Plan</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[{l:"🌅 Breakfast",v:data.today.breakfast},{l:"☀️ Lunch",v:data.today.lunch},{l:"🌙 Dinner",v:data.today.dinner},{l:"🍎 Snacks",v:data.today.snacks}].map(m=>(
              <div key={m.l} style={{background:"#0f172a",borderRadius:12,padding:14}}>
                <div style={{fontWeight:700,color:sc,marginBottom:6,fontSize:13}}>{m.l}</div>
                <div style={{color:"#cbd5e1",fontSize:13,lineHeight:1.6}}>{m.v}</div>
              </div>
            ))}
          </div>
        </Card>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <Card style={{borderTop:"3px solid #22c55e"}}>
            <div style={{fontWeight:800,fontSize:14,marginBottom:10}}>✅ Foods to Prioritise</div>
            {data.eat.map((f,i)=>(
              <div key={i} style={{display:"flex",gap:8,padding:"6px 0",borderBottom:"1px solid #0f172a"}}>
                <span style={{color:"#22c55e"}}>●</span><span style={{color:"#cbd5e1",fontSize:13}}>{f}</span>
              </div>
            ))}
          </Card>
          <Card style={{borderTop:"3px solid #f43f5e"}}>
            <div style={{fontWeight:800,fontSize:14,marginBottom:10}}>❌ Foods to Avoid</div>
            {data.avoid.map((f,i)=>(
              <div key={i} style={{display:"flex",gap:8,padding:"6px 0",borderBottom:"1px solid #0f172a"}}>
                <span style={{color:"#f43f5e"}}>●</span><span style={{color:"#cbd5e1",fontSize:13}}>{f}</span>
              </div>
            ))}
          </Card>
        </div>
      </>) : (
        <div style={{textAlign:"center",padding:60,color:"#64748b"}}>Failed to load. Please try again.</div>
      )}
    </div>
  );
}

// ─── WORKOUTS PAGE (AI-powered) ───────────────────────────────────────────────
function WorkoutsPage({profile}) {
  const sc = COLORS[profile.sport]||"#facc15";
  const todayIdx = new Date().getDay();
  const todayDay = DAYS[todayIdx===0?6:todayIdx-1];
  const [activeDay, setActiveDay] = useState(todayDay);
  const [workoutCache, setWorkoutCache] = useState({});
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState({});
  const [reminderTime, setReminderTime] = useState("07:00");
  const [showCal, setShowCal] = useState(false);

  const workout = workoutCache[activeDay];

  useEffect(()=>{
    if(workoutCache[activeDay])return;
    setLoading(true);
    getAIWorkout(profile.sport, profile.level, activeDay).then(w=>{
      setWorkoutCache(c=>({...c,[activeDay]:w}));
      setLoading(false);
    });
  },[activeDay, profile.sport, profile.level]);

  const toggleEx = (day,i) => setCompleted(c=>({...c,[`${day}-${i}`]:!c[`${day}-${i}`]}));
  const totalEx = workout?.exercises?.length||0;
  const doneCount = workout?.exercises?.filter((_,i)=>completed[`${activeDay}-${i}`]).length||0;
  const progress = totalEx ? Math.round(doneCount/totalEx*100) : 0;

  const downloadICS = () => {
    const [h,m] = reminderTime.split(":").map(Number);
    const today = new Date();
    let ics = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//AthleteEdge//EN\nCALSCALE:GREGORIAN\n";
    Object.keys(workoutCache).forEach(day=>{
      const w = workoutCache[day]; if(!w) return;
      const date = new Date(today);
      const target = DAYS.indexOf(day);
      const cur = today.getDay()===0?6:today.getDay()-1;
      let ahead = target-cur; if(ahead<=0) ahead+=7;
      date.setDate(today.getDate()+ahead);
      const yr=date.getFullYear(),mo=String(date.getMonth()+1).padStart(2,"0"),dy=String(date.getDate()).padStart(2,"0");
      const hh=String(h).padStart(2,"0"),mm=String(m).padStart(2,"0"),eh=String(h+1).padStart(2,"0");
      ics+=`BEGIN:VEVENT\nUID:ae-${day}-${Date.now()}\nDTSTART:${yr}${mo}${dy}T${hh}${mm}00\nDTEND:${yr}${mo}${dy}T${eh}${mm}00\nSUMMARY:AthleteEdge - ${w.focus}\nDESCRIPTION:${w.exercises.map(e=>`${e.name}: ${e.sets}`).join("\\n")}\nRRULE:FREQ=WEEKLY\nEND:VEVENT\n`;
    });
    ics += "END:VCALENDAR";
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([ics],{type:"text/calendar"}));
    a.download = "athleteedge.ics"; a.click();
    setShowCal(false);
  };

  return (
    <div style={{maxWidth:860,margin:"0 auto",padding:28}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div>
          <div style={{display:"flex",gap:8,marginBottom:6}}><Tag label={profile.sport} color={sc}/><Tag label={profile.level} color="#facc15"/></div>
          <h2 style={{fontWeight:900,fontSize:26,margin:0}}>📅 Daily Workouts</h2>
        </div>
        <button onClick={()=>setShowCal(true)}
          style={{background:sc,color:"#0f172a",border:"none",borderRadius:12,padding:"10px 18px",fontWeight:700,cursor:"pointer",fontSize:13}}>
          📆 Add to Calendar
        </button>
      </div>
      <div style={{background:"#1e293b44",border:"1px solid #334155",borderRadius:12,padding:12,marginBottom:18,color:"#94a3b8",fontSize:13}}>
        ✨ AI-generated workouts. Each day loads fresh — click a different day to generate that session.
      </div>
      <div style={{display:"flex",gap:7,marginBottom:20,flexWrap:"wrap"}}>
        {DAYS.map(d=>(
          <button key={d} onClick={()=>setActiveDay(d)}
            style={{background:activeDay===d?sc:d===todayDay?"#1e293b":"#0f172a",
                    color:activeDay===d?"#0f172a":d===todayDay?sc:"#64748b",
                    border:`2px solid ${activeDay===d?sc:d===todayDay?sc:"#334155"}`,
                    borderRadius:10,padding:"9px 16px",cursor:"pointer",fontWeight:700,fontSize:13,position:"relative"}}>
            {d}{d===todayDay&&<span style={{position:"absolute",top:-3,right:-3,width:7,height:7,borderRadius:"50%",background:sc}}/>}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:60,gap:16}}>
          <Spinner color={sc} size={40}/>
          <div style={{color:"#64748b"}}>Generating {activeDay} workout…</div>
        </div>
      ) : workout ? (<>
        <Card style={{marginBottom:18,borderTop:`4px solid ${sc}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div>
              <div style={{fontWeight:800,fontSize:17}}>{workout.focus}</div>
              <div style={{color:"#64748b",fontSize:12,marginTop:2}}>🔥 {workout.warmup}</div>
            </div>
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:24,fontWeight:900,color:progress===100?"#22c55e":sc}}>{progress}%</div>
              <div style={{fontSize:11,color:"#64748b"}}>Complete</div>
            </div>
          </div>
          <div style={{height:7,background:"#0f172a",borderRadius:4}}>
            <div style={{height:"100%",width:`${progress}%`,background:progress===100?"#22c55e":sc,borderRadius:4,transition:"width 0.4s"}}/>
          </div>
          {progress===100&&<div style={{marginTop:10,textAlign:"center",color:"#22c55e",fontWeight:700}}>🎉 Workout Complete!</div>}
        </Card>
        <div style={{display:"flex",flexDirection:"column",gap:14,marginBottom:18}}>
          {workout.exercises.map((ex,i)=>{
            const done = completed[`${activeDay}-${i}`];
            return (
              <Card key={i} style={{borderLeft:`4px solid ${done?"#22c55e":sc}`,opacity:done?0.8:1}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                  <div style={{display:"flex",gap:10,alignItems:"center"}}>
                    <div style={{width:34,height:34,borderRadius:"50%",background:done?"#22c55e":sc,
                                 display:"flex",alignItems:"center",justifyContent:"center",
                                 fontWeight:900,color:"#0f172a",fontSize:14,flexShrink:0}}>{done?"✓":i+1}</div>
                    <div>
                      <div style={{fontWeight:800,fontSize:15,textDecoration:done?"line-through":"none",color:done?"#64748b":"#e2e8f0"}}>{ex.name}</div>
                      <div style={{color:done?"#64748b":sc,fontWeight:700,fontSize:13,marginTop:1}}>{ex.sets}</div>
                    </div>
                  </div>
                  <button onClick={()=>toggleEx(activeDay,i)}
                    style={{background:done?"#22c55e22":"#0f172a",color:done?"#22c55e":sc,
                            border:`2px solid ${done?"#22c55e":sc}`,borderRadius:10,
                            padding:"7px 14px",cursor:"pointer",fontWeight:700,fontSize:12}}>
                    {done?"✅ Done":"Mark Done"}
                  </button>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                  {[{l:"💡 TIPS",v:ex.tips},{l:"🔄 ALT",v:ex.alt},{l:"📈 PROGRESSION",v:ex.prog}].map(x=>(
                    <div key={x.l} style={{background:"#0f172a",borderRadius:10,padding:10}}>
                      <div style={{fontSize:10,color:"#64748b",fontWeight:700,marginBottom:3}}>{x.l}</div>
                      <div style={{color:"#cbd5e1",fontSize:12,lineHeight:1.5}}>{x.v}</div>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
        <Card style={{borderTop:"3px solid #8b5cf6"}}>
          <div style={{fontWeight:800,fontSize:14,marginBottom:6}}>🧊 Cool-Down</div>
          <div style={{color:"#cbd5e1",fontSize:13}}>{workout.cooldown}</div>
        </Card>
      </>) : (
        <div style={{textAlign:"center",padding:60,color:"#64748b"}}>Failed to generate workout. Please try again.</div>
      )}

      {showCal&&(
        <div style={{position:"fixed",inset:0,background:"#000a",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
          <Card style={{maxWidth:420,width:"100%",border:`1px solid ${sc}`}}>
            <div style={{fontWeight:800,fontSize:17,marginBottom:8}}>📆 Export to Calendar</div>
            <p style={{color:"#94a3b8",fontSize:13,marginBottom:16}}>Downloads a .ics file for the days you've viewed. Works with Google Calendar, Apple Calendar & Outlook.</p>
            <div style={{marginBottom:16}}>
              <label style={{display:"block",fontWeight:700,fontSize:12,color:"#94a3b8",marginBottom:6}}>⏰ Workout Time</label>
              <input type="time" value={reminderTime} onChange={e=>setReminderTime(e.target.value)}
                style={{background:"#0f172a",border:`1px solid ${sc}`,borderRadius:10,padding:"10px 14px",
                        color:"#e2e8f0",fontSize:15,fontWeight:700,width:"100%",boxSizing:"border-box"}}/>
            </div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={downloadICS}
                style={{flex:1,background:sc,color:"#0f172a",border:"none",borderRadius:10,padding:"11px",fontWeight:700,cursor:"pointer"}}>
                ⬇️ Download .ics
              </button>
              <button onClick={()=>setShowCal(false)}
                style={{background:"transparent",color:"#94a3b8",border:"1px solid #334155",borderRadius:10,padding:"11px 18px",fontWeight:600,cursor:"pointer"}}>
                Cancel
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// ─── RECOVERY PAGE (AI-powered) ───────────────────────────────────────────────
function RecoveryPage({profile}) {
  const sc = COLORS[profile.sport]||"#facc15";
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    setLoading(true); setData(null);
    getAIRecovery(profile.sport).then(d=>{setData(d);setLoading(false);});
  },[profile.sport]);

  const phases = [
    {day:"Day 1-2",phase:"Acute Recovery",actions:["R.I.C.E for sore areas","Cold water immersion 10-15 min","Light walk 20 min","Electrolytes + hydration","Sleep 9-10 hrs"],c:sc},
    {day:"Day 3-4",phase:"Repair Phase",actions:["Gentle mobility 20 min","Full body foam rolling","Protein meals every 3-4 hrs","Contrast shower","Sleep 8-9 hrs"],c:"#22c55e"},
    {day:"Day 5-6",phase:"Reactivation",actions:["Light technical work","Dynamic stretching 15 min","Gradual intensity increase","Monitor fatigue","Sleep 8 hrs"],c:"#f97316"},
    {day:"Day 7",phase:"Full Training",actions:["Full warm-up protocol","Normal training load","Post-session recovery","Weekly load review"],c:"#facc15"},
  ];

  return (
    <div style={{maxWidth:860,margin:"0 auto",padding:28}}>
      <h2 style={{fontWeight:900,fontSize:26,marginBottom:20}}>🛌 Recovery Center</h2>
      <Card style={{marginBottom:18}}>
        <div style={{fontWeight:800,fontSize:15,marginBottom:14}}>📅 Post-Competition Recovery Schedule</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {phases.map((s,i)=>(
            <div key={i} style={{background:"#0f172a",borderRadius:12,padding:14,borderLeft:`4px solid ${s.c}`}}>
              <div style={{fontWeight:700,color:s.c,fontSize:13}}>{s.day} — {s.phase}</div>
              <div style={{marginTop:8}}>
                {s.actions.map((a,j)=>(
                  <div key={j} style={{display:"flex",gap:6,marginBottom:4}}>
                    <span style={{color:s.c,fontSize:11}}>✓</span>
                    <span style={{color:"#94a3b8",fontSize:12}}>{a}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
      <div style={{background:"#1e293b44",border:"1px solid #334155",borderRadius:12,padding:12,marginBottom:18,color:"#94a3b8",fontSize:13}}>
        ✨ AI-generated recovery advice personalised for <strong style={{color:sc}}>{profile.sport}</strong> athletes.
      </div>
      {loading ? (
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:50,gap:16}}>
          <Spinner color={sc} size={40}/>
          <div style={{color:"#64748b"}}>Generating recovery protocols…</div>
        </div>
      ) : data ? (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <Card style={{borderTop:`3px solid ${sc}`}}>
            <div style={{fontWeight:800,fontSize:14,marginBottom:10}}>🛡️ Injury Prevention — {profile.sport}</div>
            {data.injury_prevention.map((t,i)=>(
              <div key={i} style={{display:"flex",gap:8,padding:"7px 0",borderBottom:"1px solid #0f172a"}}>
                <span style={{color:sc,flexShrink:0}}>✓</span>
                <span style={{color:"#cbd5e1",fontSize:13,lineHeight:1.4}}>{t}</span>
              </div>
            ))}
          </Card>
          <Card style={{borderTop:"3px solid #f43f5e"}}>
            <div style={{fontWeight:800,fontSize:14,marginBottom:10}}>🧊 Recovery Protocols</div>
            {data.recovery_protocols.map((t,i)=>(
              <div key={i} style={{display:"flex",gap:8,padding:"7px 0",borderBottom:"1px solid #0f172a"}}>
                <span style={{color:"#f43f5e",flexShrink:0}}>→</span>
                <span style={{color:"#cbd5e1",fontSize:13,lineHeight:1.4}}>{t}</span>
              </div>
            ))}
          </Card>
          <Card style={{borderTop:"3px solid #facc15"}}>
            <div style={{fontWeight:800,fontSize:14,marginBottom:10}}>😴 Sleep Tips</div>
            {data.sleep_tips.map((t,i)=>(
              <div key={i} style={{display:"flex",gap:8,padding:"7px 0",borderBottom:"1px solid #0f172a"}}>
                <span style={{color:"#facc15",flexShrink:0}}>→</span>
                <span style={{color:"#cbd5e1",fontSize:13,lineHeight:1.4}}>{t}</span>
              </div>
            ))}
          </Card>
          <Card style={{borderTop:"3px solid #a78bfa"}}>
            <div style={{fontWeight:800,fontSize:14,marginBottom:10}}>🧠 Mental Recovery</div>
            {data.mental_tips.map((t,i)=>(
              <div key={i} style={{display:"flex",gap:8,padding:"7px 0",borderBottom:"1px solid #0f172a"}}>
                <span style={{color:"#a78bfa",flexShrink:0}}>→</span>
                <span style={{color:"#cbd5e1",fontSize:13,lineHeight:1.4}}>{t}</span>
              </div>
            ))}
          </Card>
        </div>
      ) : (
        <div style={{textAlign:"center",padding:50,color:"#64748b"}}>Failed to load. Please try again.</div>
      )}
    </div>
  );
}

// ─── PROFILE PAGE ─────────────────────────────────────────────────────────────
function ProfilePage({user, onUpdate}) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(user);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef();
  const sc = COLORS[form.sport]||"#facc15";
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const handleSave = () => { onUpdate(form); setEditing(false); setSaved(true); setTimeout(()=>setSaved(false),3000); };

  return (
    <div style={{maxWidth:860,margin:"0 auto",padding:28}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
        <h2 style={{fontWeight:900,fontSize:26,margin:0}}>👤 My Profile</h2>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          {saved&&<span style={{color:"#22c55e",fontWeight:700,fontSize:13}}>✅ Saved!</span>}
          <button onClick={()=>editing?handleSave():setEditing(true)}
            style={{background:editing?"#22c55e":sc,color:"#0f172a",border:"none",
                    borderRadius:10,padding:"9px 22px",fontWeight:700,cursor:"pointer"}}>
            {editing?"✅ Save":"✏️ Edit"}
          </button>
          {editing&&<button onClick={()=>setEditing(false)}
            style={{background:"transparent",color:"#94a3b8",border:"1px solid #334155",
                    borderRadius:10,padding:"9px 14px",fontWeight:600,cursor:"pointer"}}>Cancel</button>}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"240px 1fr",gap:20}}>
        <Card style={{textAlign:"center"}}>
          <div style={{width:80,height:80,borderRadius:"50%",background:sc+"33",border:`3px solid ${sc}`,
                       display:"flex",alignItems:"center",justifyContent:"center",
                       fontSize:40,margin:"0 auto 14px",overflow:"hidden"}}>
            {form.photo?<img src={form.photo} style={{width:"100%",height:"100%",objectFit:"cover"}} alt="pf"/>:form.avatar}
          </div>
          {editing&&<>
            <button onClick={()=>fileRef.current.click()}
              style={{background:sc,color:"#0f172a",border:"none",borderRadius:8,
                      padding:"5px 12px",fontWeight:700,cursor:"pointer",fontSize:12,marginBottom:10}}>Change Photo</button>
            <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}}
              onChange={e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>set("photo",ev.target.result);r.readAsDataURL(f);}}/>
          </>}
          <div style={{fontWeight:800,fontSize:17}}>{form.name}</div>
          <div style={{color:"#64748b",fontSize:12,marginTop:3}}>{form.city}{form.city&&form.country?", ":""}{form.country}</div>
          <div style={{marginTop:10,display:"flex",flexWrap:"wrap",gap:5,justifyContent:"center"}}>
            <Tag label={form.sport} color={sc}/><Tag label={form.level} color="#facc15"/>
          </div>
        </Card>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Card>
            <div style={{fontWeight:800,fontSize:14,marginBottom:14}}>📋 Personal Details</div>
            {editing ? (
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {[["name","Full Name"],["age","Age"],["phone","Phone"],["country","Country"],["city","City"],["social","Social"]].map(([k,l])=>(
                  <div key={k}>
                    <label style={{display:"block",fontSize:11,color:"#64748b",fontWeight:700,marginBottom:3}}>{l}</label>
                    <input value={form[k]||""} onChange={e=>set(k,e.target.value)}
                      style={{width:"100%",background:"#0f172a",border:"1px solid #334155",borderRadius:8,
                              padding:"9px 11px",color:"#e2e8f0",fontSize:13,boxSizing:"border-box"}}/>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {[["Name",form.name],["Age",form.age],["Gender",form.gender],["Email",form.email],
                  ["Phone",form.phone||"—"],["City",`${form.city||""}${form.city&&form.country?", ":""}${form.country||""}`||"—"]].map(([l,v])=>(
                  <div key={l} style={{background:"#0f172a",borderRadius:10,padding:11}}>
                    <div style={{fontSize:10,color:"#64748b",fontWeight:700}}>{l}</div>
                    <div style={{fontSize:13,color:"#e2e8f0",fontWeight:600,marginTop:2}}>{v}</div>
                  </div>
                ))}
              </div>
            )}
          </Card>
          <Card>
            <div style={{fontWeight:800,fontSize:14,marginBottom:14}}>🏟️ Club & Training</div>
            {editing ? (
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {[["club","Club"],["coach","Coach"],["clubWebsite","Website"]].map(([k,l])=>(
                  <div key={k}>
                    <label style={{display:"block",fontSize:11,color:"#64748b",fontWeight:700,marginBottom:3}}>{l}</label>
                    <input value={form[k]||""} onChange={e=>set(k,e.target.value)}
                      style={{width:"100%",background:"#0f172a",border:"1px solid #334155",borderRadius:8,
                              padding:"9px 11px",color:"#e2e8f0",fontSize:13,boxSizing:"border-box"}}/>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {[["Club",form.club||"Independent"],["Coach",form.coach||"—"],
                  ["Training Days",(form.trainingDays||[]).join(", ")||"—"],["Website",form.clubWebsite||"—"]].map(([l,v])=>(
                  <div key={l} style={{background:"#0f172a",borderRadius:10,padding:11}}>
                    <div style={{fontSize:10,color:"#64748b",fontWeight:700}}>{l}</div>
                    <div style={{fontSize:13,color:"#e2e8f0",fontWeight:600,marginTop:2}}>{v}</div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── COMMUNITY ────────────────────────────────────────────────────────────────
function CommunityPage({profile, posts, setPosts}) {
  const sc = COLORS[profile.sport]||"#facc15";
  const [liked, setLiked] = useState({});
  const [expanded, setExpanded] = useState(null);
  const [replyText, setReplyText] = useState({});
  const [newPost, setNewPost] = useState({title:"",body:""});
  const [submitted, setSubmitted] = useState(false);

  const submitPost = () => {
    if(!newPost.title.trim()||!newPost.body.trim()) return;
    const p = {id:Date.now(),name:profile.name,sport:profile.sport,level:profile.level,
               avatar:profile.avatar||"👤",time:"just now",title:newPost.title,body:newPost.body,
               likes:0,replies:0,repliesList:[],color:COLORS[profile.sport]||"#facc15"};
    setPosts(prev=>[p,...prev]);
    setNewPost({title:"",body:""}); setSubmitted(true);
    setTimeout(()=>setSubmitted(false),3000);
  };

  const submitReply = postId => {
    const text = (replyText[postId]||"").trim(); if(!text) return;
    const reply = {id:Date.now(),name:profile.name,sport:profile.sport,
                   avatar:profile.avatar||"👤",time:"just now",body:text,color:sc};
    setPosts(prev=>prev.map(p=>p.id===postId?{...p,replies:p.replies+1,repliesList:[...p.repliesList,reply]}:p));
    setReplyText({...replyText,[postId]:""});
  };

  return (
    <div style={{maxWidth:860,margin:"0 auto",padding:28}}>
      <h2 style={{fontWeight:900,fontSize:26,marginBottom:4}}>🌍 Community Feed</h2>
      <p style={{color:"#64748b",marginBottom:20}}>Ask questions, share tips, connect with athletes. Posts are shared across all users.</p>
      <Card style={{marginBottom:20,border:`1px solid ${sc}44`}}>
        <div style={{fontWeight:800,fontSize:15,marginBottom:14}}>✍️ Share with the community</div>
        <input value={newPost.title} onChange={e=>setNewPost({...newPost,title:e.target.value})}
          placeholder="Post title…"
          style={{width:"100%",background:"#0f172a",border:"1px solid #334155",borderRadius:10,
                  padding:"11px 14px",color:"#e2e8f0",fontSize:14,marginBottom:8,boxSizing:"border-box"}}/>
        <textarea value={newPost.body} onChange={e=>setNewPost({...newPost,body:e.target.value})}
          placeholder="Share your question, tip or experience…" rows={3}
          style={{width:"100%",background:"#0f172a",border:"1px solid #334155",borderRadius:10,
                  padding:"11px 14px",color:"#e2e8f0",fontSize:14,resize:"none",boxSizing:"border-box"}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10}}>
          <span style={{fontSize:12,color:"#64748b"}}>
            <span style={{color:sc,fontWeight:700}}>{profile.name}</span> · {profile.sport} · {profile.level}
          </span>
          <button onClick={submitPost}
            style={{background:sc,color:"#0f172a",border:"none",borderRadius:10,
                    padding:"9px 22px",fontWeight:700,cursor:"pointer"}}>
            {submitted?"✅ Posted!":"Post →"}
          </button>
        </div>
      </Card>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        {posts.map(p=>(
          <Card key={p.id} style={{borderLeft:`4px solid ${p.color}`}}>
            <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:9}}>
              <div style={{width:36,height:36,borderRadius:"50%",background:p.color+"33",
                           display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{p.avatar}</div>
              <div>
                <div style={{fontWeight:700,fontSize:13}}>{p.name}</div>
                <div style={{fontSize:11,color:"#64748b"}}><Tag label={p.sport} color={p.color}/> {p.level} · {p.time}</div>
              </div>
            </div>
            <div style={{fontWeight:700,fontSize:14,marginBottom:5}}>{p.title}</div>
            <p style={{color:"#94a3b8",fontSize:13,lineHeight:1.6,margin:0}}>{p.body}</p>
            <div style={{display:"flex",gap:12,marginTop:12}}>
              <button onClick={()=>setLiked({...liked,[p.id]:!liked[p.id]})}
                style={{background:liked[p.id]?"#f43f5e22":"transparent",color:liked[p.id]?"#f43f5e":"#64748b",
                        border:`1px solid ${liked[p.id]?"#f43f5e":"#334155"}`,borderRadius:8,
                        padding:"5px 12px",cursor:"pointer",fontSize:12,fontWeight:600}}>
                ❤️ {p.likes+(liked[p.id]?1:0)}
              </button>
              <button onClick={()=>setExpanded(expanded===p.id?null:p.id)}
                style={{background:expanded===p.id?"#0ea5e922":"transparent",
                        color:expanded===p.id?"#0ea5e9":"#64748b",
                        border:`1px solid ${expanded===p.id?"#0ea5e9":"#334155"}`,borderRadius:8,
                        padding:"5px 12px",cursor:"pointer",fontSize:12,fontWeight:600}}>
                💬 {p.replies} {p.replies===1?"reply":"replies"}
              </button>
            </div>
            {expanded===p.id&&(
              <div style={{marginTop:14,borderTop:"1px solid #334155",paddingTop:14}}>
                {p.repliesList.length===0&&<p style={{color:"#475569",fontSize:12,marginBottom:12}}>No replies yet.</p>}
                {p.repliesList.map(r=>(
                  <div key={r.id} style={{display:"flex",gap:9,background:"#0f172a",borderRadius:10,padding:10,marginBottom:8}}>
                    <div style={{width:28,height:28,borderRadius:"50%",background:r.color+"33",
                                 display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>{r.avatar}</div>
                    <div>
                      <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:3}}>
                        <span style={{fontWeight:700,fontSize:12}}>{r.name}</span>
                        <Tag label={r.sport} color={r.color}/>
                        <span style={{color:"#475569",fontSize:11}}>{r.time}</span>
                      </div>
                      <p style={{color:"#94a3b8",fontSize:12,margin:0}}>{r.body}</p>
                    </div>
                  </div>
                ))}
                <div style={{display:"flex",gap:8,alignItems:"flex-start",marginTop:8}}>
                  <div style={{width:28,height:28,borderRadius:"50%",background:sc+"33",
                               display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0,overflow:"hidden"}}>
                    {profile.photo?<img src={profile.photo} style={{width:"100%",height:"100%",objectFit:"cover"}} alt="av"/>:profile.avatar||"👤"}
                  </div>
                  <div style={{flex:1}}>
                    <textarea value={replyText[p.id]||""} onChange={e=>setReplyText({...replyText,[p.id]:e.target.value})}
                      placeholder="Write a reply…" rows={2}
                      style={{width:"100%",background:"#1e293b",border:"1px solid #334155",borderRadius:10,
                              padding:"9px 12px",color:"#e2e8f0",fontSize:13,resize:"none",boxSizing:"border-box"}}/>
                    <button onClick={()=>submitReply(p.id)}
                      style={{background:sc,color:"#0f172a",border:"none",borderRadius:8,
                              padding:"7px 16px",fontWeight:700,cursor:"pointer",fontSize:12,marginTop:6}}>Reply →</button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── LOADING ──────────────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div style={{minHeight:"100vh",background:"#0f172a",display:"flex",alignItems:"center",
                 justifyContent:"center",flexDirection:"column",gap:16}}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{fontSize:44}}>🏅</div>
      <div style={{color:"#facc15",fontWeight:800,fontSize:17}}>Loading AthleteEdge…</div>
      <Spinner color="#facc15" size={32}/>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [appState, setAppState] = useState("loading");
  const [authUser, setAuthUser]   = useState(null);
  const [profile, setProfile]     = useState(null);
  const [page, setPage]           = useState("Home");
  const [posts, setPosts]         = useState(POSTS_INIT);
  const [postsReady, setPostsReady] = useState(false);

  // ── Init: restore session + community posts ──
  useEffect(()=>{
    (async()=>{
      // Restore session
      const savedEmail = await store.get("session:currentUser");
      if(savedEmail){
        const savedProfile = await store.get(profileKey(savedEmail));
        if(savedProfile){
          try{
            const p = JSON.parse(savedProfile);
            setAuthUser({email:savedEmail, id:"user_"+savedEmail.replace(/[@.]/g,"_")});
            setProfile(p);
            setAppState("app");
          } catch { setAppState("auth"); }
        } else {
          setAuthUser({email:savedEmail, id:"user_"+savedEmail.replace(/[@.]/g,"_")});
          setAppState("onboarding");
        }
      } else {
        setAppState("auth");
      }

      // Load shared community posts
      const savedPosts = await store.get("community:posts", true);
      if(savedPosts){
        try { const p=JSON.parse(savedPosts); if(p.length>0){setPosts(p);} } catch {}
      }
      setPostsReady(true);
    })();
  },[]);

  // ── Auto-save posts ──
  useEffect(()=>{
    if(!postsReady) return;
    store.set("community:posts", JSON.stringify(posts), true);
  },[posts, postsReady]);

  const handleAuth = async u => {
    setAuthUser(u);
    await store.set("session:currentUser", u.email);
    const existing = await store.get(profileKey(u.email));
    if(existing){
      try { setProfile(JSON.parse(existing)); setAppState("app"); return; } catch {}
    }
    setAppState("onboarding");
  };

  const handleOnboardingComplete = async form => {
    const p = {...form, id:authUser.id, email:authUser.email};
    setProfile(p);
    await store.set(profileKey(authUser.email), JSON.stringify(p));
    setAppState("welcome");
  };

  const handleUpdateProfile = async updated => {
    const p = {...updated, id:authUser.id};
    setProfile(p);
    await store.set(profileKey(authUser.email), JSON.stringify(p));
  };

  const handleLogout = async () => {
    await store.del("session:currentUser");
    setAppState("auth"); setAuthUser(null); setProfile(null); setPage("Home");
  };

  if(appState==="loading") return <LoadingScreen/>;
  if(appState==="auth")    return <AuthScreen onAuth={handleAuth}/>;
  if(appState==="onboarding") return <Onboarding authUser={authUser} onComplete={handleOnboardingComplete}/>;
  if(appState==="welcome") return <WelcomeScreen user={profile} onEnter={()=>setAppState("app")}/>;
  if(!profile) return <LoadingScreen/>;

  const sc = COLORS[profile.sport]||"#facc15";

  return (
    <div style={{minHeight:"100vh",background:"#0f172a",color:"#e2e8f0",fontFamily:"'Segoe UI',sans-serif"}}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} * {box-sizing:border-box;}`}</style>
      <Nav page={page} setPage={setPage} user={profile} onLogout={handleLogout}/>
      {page==="Nutrition"  && <NutritionPage profile={profile}/>}
      {page==="Workouts"   && <WorkoutsPage  profile={profile}/>}
      {page==="Recovery"   && <RecoveryPage  profile={profile}/>}
      {page==="Community"  && <CommunityPage profile={profile} posts={posts} setPosts={setPosts}/>}
      {page==="Profile"    && <ProfilePage   user={profile} onUpdate={handleUpdateProfile}/>}
      {page==="Home"&&(
        <div style={{maxWidth:860,margin:"0 auto",padding:28}}>
          <div style={{background:"linear-gradient(135deg,#1e293b,#0f172a)",borderRadius:22,
                       padding:"44px 36px",marginBottom:28,border:"1px solid #334155",
                       position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",right:-20,top:-20,fontSize:160,opacity:0.04}}>🏅</div>
            <div style={{fontSize:12,color:"#facc15",fontWeight:700,marginBottom:10,letterSpacing:2}}>WELCOME BACK</div>
            <h1 style={{fontSize:32,fontWeight:900,margin:"0 0 14px",lineHeight:1.1}}>
              Ready to train, <span style={{color:sc}}>{profile.name.split(" ")[0]}?</span> 💪
            </h1>
            <div style={{display:"flex",gap:7,marginBottom:18,flexWrap:"wrap"}}>
              <Tag label={profile.sport} color={sc}/>
              <Tag label={profile.level} color="#facc15"/>
              {(profile.goals||[]).map(g=><Tag key={g} label={g} color="#a78bfa"/>)}
            </div>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              <button onClick={()=>setPage("Workouts")}
                style={{background:sc,color:"#0f172a",border:"none",borderRadius:10,
                        padding:"11px 22px",fontWeight:700,fontSize:14,cursor:"pointer"}}>Today's Workout →</button>
              <button onClick={()=>setPage("Nutrition")}
                style={{background:"transparent",color:"#e2e8f0",border:"2px solid #334155",
                        borderRadius:10,padding:"11px 22px",fontWeight:600,fontSize:14,cursor:"pointer"}}>Meal Plan</button>
              <button onClick={()=>setPage("Community")}
                style={{background:"transparent",color:"#e2e8f0",border:"2px solid #334155",
                        borderRadius:10,padding:"11px 22px",fontWeight:600,fontSize:14,cursor:"pointer"}}>Community</button>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
            {[{icon:"🥗",label:"Nutrition Plans",sub:"AI-personalised meal plans",color:"#22c55e",p:"Nutrition"},
              {icon:"📅",label:"Workout Plans",sub:"AI daily training sessions",color:sc,p:"Workouts"},
              {icon:"🛌",label:"Recovery",sub:"Science-backed protocols",color:"#8b5cf6",p:"Recovery"},
              {icon:"🌍",label:"Community",sub:"Connect with athletes",color:"#0ea5e9",p:"Community"},
              {icon:"👤",label:"My Profile",sub:"Manage your details",color:"#facc15",p:"Profile"},
              {icon:"✨",label:"AI-Powered",sub:"All content generated for you",color:"#ec4899",p:"Nutrition"}
            ].map(s=>(
              <div key={s.label} onClick={()=>setPage(s.p)}
                style={{background:"#1e293b",borderRadius:14,padding:20,textAlign:"center",
                        cursor:"pointer",border:"1px solid #334155",transition:"border-color 0.2s"}}>
                <div style={{fontSize:32}}>{s.icon}</div>
                <div style={{fontWeight:800,color:s.color,fontSize:14,marginTop:7}}>{s.label}</div>
                <div style={{color:"#64748b",fontSize:12,marginTop:3}}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={{textAlign:"center",padding:28,color:"#334155",fontSize:12}}>
        🏅 AthleteEdge · Built for athletes · <span style={{color:"#facc15"}}>Not medical advice.</span>
      </div>
    </div>
  );
}