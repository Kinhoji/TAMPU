import { createContext, useContext, useState, type ReactNode, MouseEvent } from 'react'
import { ArrowRight, ArrowUpRight, BadgeCheck, Bike, Check, CheckCircle2, ChevronDown, ChevronRight, Compass, Home, MapPin, Minus, PackageCheck, Plus, Recycle, ShoppingBasket, Smartphone, Sparkles, Star, UserRound, WalletCards, X, Zap, Store, ChevronLeft, ListTodo, Store as StoreIcon, MapPinned, Languages, CheckSquare, Square } from 'lucide-react'

// --- TIPOS Y DATOS ---
interface Casera { id: string; nombre: string; puesto: string; rating: number; especialidad: string; fotoUrl: string }
interface Producto { id: string; nombre: string; precioBase: number; isYapa?: boolean; soportaCuartilla?: boolean }
type TipoCanasta = 'Personal' | 'Dúo' | 'Familiar' | 'Personalizada'
type Frecuencia = 'Semanal' | 'Quincenal'
type UnidadMedida = 'Kilo' | 'Cuartilla' | 'Unidad' | 'Atado'

const caseras: Casera[] = [
  { id: 'rosa', nombre: 'Doña Rosa', puesto: 'Puesto 42 · La Cancha', rating: 4.9, especialidad: 'Verduras de temporada', fotoUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=360&h=360&fit=crop&crop=faces' },
  { id: 'carmen', nombre: 'Doña Carmen', puesto: 'Puesto 18 · La Cancha', rating: 4.8, especialidad: 'Frutas y verduras', fotoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=360&h=360&fit=crop&crop=faces' },
  { id: 'marta', nombre: 'Doña Marta', puesto: 'Puesto 05 · La Cancha', rating: 4.7, especialidad: 'Tubérculos y granos', fotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=360&h=360&fit=crop&crop=faces' },
]
const productosBase: Producto[] = [
  { id: 'papa', nombre: 'Papa imilla', precioBase: 10, soportaCuartilla: true },
  { id: 'tomate', nombre: 'Tomate perita', precioBase: 6, soportaCuartilla: true },
  { id: 'cebolla', nombre: 'Cebolla morada', precioBase: 8, soportaCuartilla: true },
  { id: 'zanahoria', nombre: 'Zanahoria', precioBase: 4, soportaCuartilla: false },
  { id: 'acelga', nombre: 'Acelga', precioBase: 3, soportaCuartilla: false },
  { id: 'locoto', nombre: 'Locoto', precioBase: 5, soportaCuartilla: true },
]
const yapas: Producto[] = [
  { id: 'hierbas', nombre: 'Atado de hierbas', precioBase: 0, isYapa: true },
  { id: 'quirquina', nombre: 'Locoto y quirquiña', precioBase: 0, isYapa: true },
  { id: 'limones', nombre: 'Limones', precioBase: 0, isYapa: true },
]

type Tab = 'inicio' | 'canasta' | 'ruta' | 'casera'
type Modal = 'swap' | 'yapa' | 'pago' | 'mapa' | null

interface CartItem { id: string; cantidad: number; unidad: UnidadMedida }
interface StoreContextType { 
  casera: Casera; setCasera: (c: Casera) => void; 
  yapa: Producto | null; setYapa: (p: Producto | null) => void; 
  basketType: TipoCanasta; setBasketType: (t: TipoCanasta) => void;
  frecuencia: Frecuencia; setFrecuencia: (f: Frecuencia) => void;
  cart: CartItem[]; updateCart: (id: string, qty: number, unit?: UnidadMedida) => void;
  swap: boolean; setSwap: (v: boolean) => void;
  lang: 'es' | 'qu'; setLang: (l: 'es' | 'qu') => void;
}
const TampuContext = createContext<StoreContextType | null>(null)
const useTampu = () => { const value = useContext(TampuContext); if (!value) throw new Error('TampuContext no disponible'); return value }
const money = (n: number) => `${n.toFixed(2)} Bs`

// --- DICCIONARIO GENERAL ---
const dicc = {
  es: {
    bienvenido: "Bienvenido", comoUsaras: "¿Cómo usarás\nTAMPU hoy?",
    quieroComprar: "Quiero comprar", recibeCanastas: "Recibe canastas frescas en tu puerta",
    soyCasera: "Soy Casera", gestionaVentas: "Gestiona tus ventas y yapas de la semana",
    soyRepartidor: "Soy Repartidor", llevaFrescura: "Lleva frescura y gana con cada entrega",
    iniciarCasera: "Acceso Casera", revisaPedidos: "Revisa tus pedidos de hoy",
    numCelular: "Número de celular", contrasena: "Contraseña", ingresar: "Ingresar",
    noCuenta: "¿No tienes una cuenta?", crearCuentaCasera: "Crear cuenta de Casera",
    saludo: "¡Buen día, Doña", pedidosTab: "Pedidos", puestoTab: "Mi Puesto",
    pedidosTitulo: "Pedidos para hoy", canastasArmar: "Canastas a preparar", pendientes: "pendientes",
    verLista: "Ver lista de verduras a preparar", tusVerduras: "Tus verduras de hoy",
    marcaLoQueTienes: "Marca lo que tienes para vender.", editarLista: "Editar Lista",
    noTienesHoy: "No tienes hoy", siHay: "SÍ HAY", seAcabo: "SE ACABÓ", cambiarPrecio: "Cambiar precio", el: "el"
  },
  qu: {
    bienvenido: "Allin jamuska", comoUsaras: "¿Imayna TAMPUta\nllamk'achinki?",
    quieroComprar: "Rantiyta munani", recibeCanastas: "Q'umir canastata wasiykipi jap'iy",
    soyCasera: "Caserita kani", gestionaVentas: "Ventasniykita, yapasniykita ima qhaway",
    soyRepartidor: "Apaykachaq kani", llevaFrescura: "Frescura apay, sapa entregapi ganay",
    iniciarCasera: "Yaykuy Caserita", revisaPedidos: "Kunan encargosniykita qhaway",
    numCelular: "Celular yupayniyki", contrasena: "Contraseña", ingresar: "Yaykuy",
    noCuenta: "¿Manachu cuentayki tiyan?", crearCuentaCasera: "Caserapaq cuentata ruway",
    saludo: "¡Allin p'unchay, Doña", pedidosTab: "Encargosniy", puestoTab: "Puestoy",
    pedidosTitulo: "Kunanpaq encargos", canastasArmar: "Canastas wakichinapaq", pendientes: "faltanraq",
    verLista: "Q'umir listata qhaway", tusVerduras: "Kunan p'unchaw q'umirniyki",
    marcaLoQueTienes: "Imatachus vendinayki tiyan chayta marcay.", editarLista: "Listata allinchay",
    noTienesHoy: "Mana kanchu", siHay: "TIYANMI", seAcabo: "TUKUKAPUN", cambiarPrecio: "Preciota cambianapaq", el: "" 
  }
}

// --- APP PRINCIPAL ---
export default function App() {
  const [appView, setAppView] = useState<'roles' | 'login' | 'signup' | 'dashboard'>('roles')
  const [role, setRole] = useState<'cliente' | 'casera' | 'delivery'>('cliente')
  const [lang, setLang] = useState<'es' | 'qu'>('es')

  const t = dicc[lang];

  if (appView === 'roles') return <RoleSelectionScreen lang={lang} setLang={setLang} t={t} onSelect={(r) => { setRole(r); setAppView('login') }} />
  if (appView === 'login') return <LoginScreen role={role} lang={lang} setLang={setLang} t={t} onBack={() => setAppView('roles')} onLogin={() => setAppView('dashboard')} onGoToSignUp={() => setAppView('signup')} />
  if (appView === 'signup') return <SignUpScreen role={role} lang={lang} setLang={setLang} onBack={() => setAppView('login')} onSignUp={() => setAppView('dashboard')} />
  
  if (role === 'cliente') return <CustomerDashboard onLogout={() => setAppView('roles')} />
  if (role === 'casera') return <CaseraDashboard lang={lang} setLang={setLang} t={t} onLogout={() => setAppView('roles')} />
  if (role === 'delivery') return <DeliveryDashboard onLogout={() => setAppView('roles')} />
  return null
}

function LangToggle({ lang, setLang, isDark = false }: { lang: 'es'|'qu', setLang: (l:'es'|'qu')=>void, isDark?: boolean }) {
  return (
    <button onClick={() => setLang(lang === 'es' ? 'qu' : 'es')} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 backdrop-blur-md transition-all active:scale-95 ${isDark ? 'bg-white/20 text-white' : 'bg-[#f0f3eb] text-[#3A4B40]'}`}>
      <Languages size={14} className="shrink-0"/>
      <span className="text-[10px] font-bold uppercase tracking-wider">{lang === 'es' ? 'Quechua' : 'Español'}</span>
    </button>
  )
}

function RoleSelectionScreen({ onSelect, lang, setLang, t }: { onSelect: (r: any) => void, lang: 'es'|'qu', setLang: (l:'es'|'qu')=>void, t: any }) {
  const roles = [
    { id: 'cliente', title: t.quieroComprar, desc: t.recibeCanastas, icon: <ShoppingBasket size={24} />, bg: 'bg-[#f1f6ea]', color: 'text-[#719B5C]', border: 'border-[#d4e5c8]' },
    { id: 'casera', title: t.soyCasera, desc: t.gestionaVentas, icon: <Store size={24} />, bg: 'bg-[#fff0e8]', color: 'text-[#F3793B]', border: 'border-[#f6d6c4]' },
    { id: 'delivery', title: t.soyRepartidor, desc: t.llevaFrescura, icon: <Bike size={24} />, bg: 'bg-[#e5f0f9]', color: 'text-[#4A8BBA]', border: 'border-[#c1daf1]' },
  ] as const
  return (
    <main className="flex h-[100dvh] w-full flex-col bg-white px-6 pb-8 pt-8">
      <div className="mb-6 flex justify-end"><LangToggle lang={lang} setLang={setLang} /></div>
      <div className="flex justify-center pb-8 pt-4"><img src="/tampu-wordmark.jpeg" alt="TAMPU" className="h-[70px] w-auto object-contain" /></div>
      <div className="mb-8 text-center"><p className="text-[10px] font-bold uppercase tracking-[.19em] text-[#719B5C]">{t.bienvenido}</p><h1 className="mt-1 whitespace-pre-line font-display text-[28px] font-extrabold leading-tight tracking-tight text-[#3A4B40]">{t.comoUsaras}</h1></div>
      <div className="flex flex-col gap-4">
        {roles.map((r) => (
          <button key={r.id} onClick={() => onSelect(r.id)} className={`flex items-center gap-4 rounded-[22px] border ${r.border} bg-white p-4 text-left shadow-sm transition-all duration-300 hover:shadow-md`}><div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] ${r.bg} ${r.color}`}>{r.icon}</div><div className="flex-1"><h2 className="font-display text-[15px] font-extrabold text-[#3A4B40]">{r.title}</h2><p className="mt-0.5 text-[10px] leading-relaxed text-[#7c8b82]">{r.desc}</p></div><ChevronRight size={18} className="text-[#c3ccc6]" /></button>
        ))}
      </div>
    </main>
  )
}

function LoginScreen({ role, onBack, onLogin, onGoToSignUp, lang, setLang, t }: { role: any; onBack: () => void; onLogin: () => void; onGoToSignUp: () => void, lang: 'es'|'qu', setLang: (l:'es'|'qu')=>void, t: any }) {
  const configs = {
    cliente: { title: 'Iniciar sesión', subtitle: 'Ingresa para pedir tu canasta', color: 'bg-[#719B5C]', button: 'bg-[#3A4B40]', text: 'text-[#719B5C]', focus: 'focus:border-[#719B5C] focus:ring-[#719B5C]/15' },
    casera: { title: 'Acceso Casera', subtitle: 'Revisa tus pedidos de hoy', color: 'bg-[#F3793B]', button: 'bg-[#F3793B]', text: 'text-[#F3793B]', focus: 'focus:border-[#F3793B] focus:ring-[#F3793B]/15' },
    delivery: { title: 'Acceso Repartidor', subtitle: 'Conéctate para empezar tu ruta', color: 'bg-[#4A8BBA]', button: 'bg-[#4A8BBA]', text: 'text-[#4A8BBA]', focus: 'focus:border-[#4A8BBA] focus:ring-[#4A8BBA]/15' },
  }
  const config = configs[role as keyof typeof configs]
  return (
    <main className="flex h-[100dvh] w-full flex-col bg-white">
      <header className="flex items-center justify-between px-4 py-5"><button onClick={onBack} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f4f7f2] text-[#55695d] transition-colors hover:bg-[#e6ebe3]"><ChevronLeft size={20} /></button><LangToggle lang={lang} setLang={setLang} /></header>
      <div className="flex-1 px-6 pt-4">
        <div className={`mb-6 inline-flex h-2 w-12 rounded-full ${config.color}`} />
        <h1 className="font-display text-[32px] font-extrabold leading-tight tracking-tight text-[#3A4B40]">{role === 'casera' ? t.iniciarCasera : config.title}</h1>
        <p className="mt-2 text-[12px] text-[#7a8a80]">{role === 'casera' ? t.revisaPedidos : config.subtitle}</p>
        <form className="mt-10 flex flex-col gap-5" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
          <div><label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#69796e]">{role === 'casera' ? t.numCelular : 'Número de celular'}</label><input type="tel" placeholder="Ej. 70012345" className={`w-full rounded-[16px] border border-[#e1e6de] bg-[#fbfdfa] px-4 py-3.5 text-[14px] font-medium text-[#3A4B40] outline-none transition-all focus:bg-white focus:ring-4 ${config.focus}`} required /></div>
          <div><label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#69796e]">{role === 'casera' ? t.contrasena : 'Contraseña'}</label><input type="password" placeholder="••••••••" className={`w-full rounded-[16px] border border-[#e1e6de] bg-[#fbfdfa] px-4 py-3.5 text-[14px] font-medium text-[#3A4B40] outline-none transition-all focus:bg-white focus:ring-4 ${config.focus}`} required /></div>
          <button type="submit" className={`mt-4 flex w-full items-center justify-center gap-2 rounded-[16px] ${config.button} py-4 text-[12px] font-bold text-white shadow-lg transition-transform active:scale-[0.98]`}>{role === 'casera' ? t.ingresar : 'Ingresar'} <ArrowRight size={15} /></button>
        </form>
        <div className="mt-8 flex flex-col items-center justify-center border-t border-[#f0f3eb] pt-6"><p className="text-[11px] text-[#7a8a80]">{role === 'casera' ? t.noCuenta : '¿No tienes una cuenta?'}</p><button onClick={onGoToSignUp} className={`mt-1.5 text-[12px] font-bold ${config.text} hover:underline`}>{role === 'casera' ? t.crearCuentaCasera : `Crear cuenta de ${role}`}</button></div>
      </div>
    </main>
  )
}

function SignUpScreen({ role, onBack, onSignUp, lang, setLang }: { role: any; onBack: () => void; onSignUp: () => void, lang: 'es'|'qu', setLang: (l:'es'|'qu')=>void }) {
  const configs = {
    cliente: { color: 'bg-[#719B5C]', button: 'bg-[#3A4B40]', text: 'text-[#719B5C]', focus: 'focus:border-[#719B5C] focus:ring-[#719B5C]/15' },
    casera: { color: 'bg-[#F3793B]', button: 'bg-[#F3793B]', text: 'text-[#F3793B]', focus: 'focus:border-[#F3793B] focus:ring-[#F3793B]/15' },
    delivery: { color: 'bg-[#4A8BBA]', button: 'bg-[#4A8BBA]', text: 'text-[#4A8BBA]', focus: 'focus:border-[#4A8BBA] focus:ring-[#4A8BBA]/15' },
  }
  const config = configs[role as keyof typeof configs]
  const inputClasses = `w-full rounded-[16px] border border-[#e1e6de] bg-[#fbfdfa] px-4 py-3.5 text-[14px] font-medium text-[#3A4B40] outline-none transition-all focus:bg-white focus:ring-4 ${config.focus}`
  return (
    <main className="flex min-h-[100dvh] w-full flex-col bg-white">
      <header className="flex items-center justify-between px-4 py-5"><button onClick={onBack} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f4f7f2] text-[#55695d] transition-colors hover:bg-[#e6ebe3]"><ChevronLeft size={20} /></button><LangToggle lang={lang} setLang={setLang} /></header>
      <div className="flex-1 px-6 pb-8 pt-2">
        <div className={`mb-6 inline-flex h-2 w-12 rounded-full ${config.color}`} />
        <h1 className="font-display text-[32px] font-extrabold leading-tight tracking-tight text-[#3A4B40]">Crear cuenta</h1>
        <form className="mt-8 flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); onSignUp(); }}>
          <div><label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#69796e]">Nombre completo</label><input type="text" className={inputClasses} required /></div>
          <div><label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#69796e]">Celular</label><input type="tel" className={inputClasses} required /></div>
          <button type="submit" className={`mt-4 flex w-full items-center justify-center gap-2 rounded-[16px] ${config.button} py-4 text-[12px] font-bold text-white shadow-lg transition-transform active:scale-[0.98]`}>Completar registro <CheckCircle2 size={15} /></button>
        </form>
      </div>
    </main>
  )
}

// --- APP DEL CLIENTE ---
function CustomerDashboard({ onLogout }: { onLogout?: () => void }) {
  const [activeTab, setActiveTab] = useState<Tab>('inicio')
  const [casera, setCasera] = useState(caseras[0])
  const [yapa, setYapa] = useState<Producto | null>(null)
  const [basketType, setBasketType] = useState<TipoCanasta>('Familiar')
  const [frecuencia, setFrecuencia] = useState<Frecuencia>('Semanal')
  const [cart, setCart] = useState<CartItem[]>([
    { id: 'papa', cantidad: 1, unidad: 'Kilo' },
    { id: 'tomate', cantidad: 1, unidad: 'Kilo' },
    { id: 'cebolla', cantidad: 1, unidad: 'Kilo' },
  ])
  const [swap, setSwap] = useState(false)
  const [modal, setModal] = useState<Modal>(null)

  const updateCart = (id: string, qty: number, unit?: UnidadMedida) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === id)
      if (!exists && qty > 0) return [...prev, { id, cantidad: qty, unidad: unit || 'Kilo' }]
      return prev.map(item => {
        if (item.id === id) return { ...item, cantidad: qty, unidad: unit || item.unidad }
        return item
      }).filter(item => item.cantidad > 0)
    })
  }

  const value = { casera, setCasera, yapa, setYapa, basketType, setBasketType, frecuencia, setFrecuencia, cart, updateCart, swap, setSwap, lang: 'es' as const, setLang: ()=>{} }
  
  return (
    <TampuContext.Provider value={value}>
      <main className="relative h-[100dvh] w-full overflow-hidden bg-[#FFFFFF] text-[#3A4B40]">
        <div className="relative h-full w-full overflow-hidden">
          <div className="scrollbar-hide absolute inset-0 overflow-y-auto pb-[76px]">
            {activeTab === 'inicio' && <HomeScreen goTracking={() => setActiveTab('ruta')} onLogout={onLogout} openMapa={() => setModal('mapa')} />}
            {activeTab === 'canasta' && <BasketScreen openModal={setModal} />}
            {activeTab === 'ruta' && <TrackingScreen />}
            {activeTab === 'casera' && <CaseraScreen />}
          </div>
          <nav className="absolute inset-x-0 bottom-0 z-20 flex h-[70px] items-center justify-around border-t border-[#e9ede5] bg-[#fffefa]/95 px-2 pb-2 backdrop-blur-xl">
            <NavItem active={activeTab === 'inicio'} label="Inicio" icon={<Home size={19}/>} onClick={() => setActiveTab('inicio')} />
            <NavItem active={activeTab === 'canasta'} label="Canasta" icon={<ShoppingBasket size={19}/>} onClick={() => setActiveTab('canasta')} badge={yapa ? 1 : undefined} />
            <NavItem active={activeTab === 'ruta'} label="Ruta en vivo" icon={<Compass size={19}/>} onClick={() => setActiveTab('ruta')} />
            <NavItem active={activeTab === 'casera'} label="Caseras" icon={<StoreIcon size={19}/>} onClick={() => setActiveTab('casera')} />
          </nav>
          {modal && <BottomSheet onClose={() => setModal(null)}>
            {modal === 'swap' ? <SwapSheet /> : 
             modal === 'yapa' ? <YapaSheet close={() => setModal(null)} /> : 
             modal === 'mapa' ? <MapaUbicacionSheet close={() => setModal(null)} /> :
             <PaymentSheet close={() => setModal(null)} afterPay={() => { setModal(null); setActiveTab('ruta') }} />}
          </BottomSheet>}
        </div>
      </main>
    </TampuContext.Provider>
  )
}

function NavItem({ active, label, icon, onClick, badge }: { active: boolean; label: string; icon: ReactNode; onClick: () => void; badge?: number }) { return <button onClick={onClick} className={`relative flex min-w-[68px] flex-col items-center gap-1 rounded-2xl px-2 py-2 transition-all duration-300 ${active ? 'text-[#719B5C]' : 'text-[#96a39a] hover:text-[#45665a]'}`}><span className="relative">{icon}{badge && <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#F3793B] px-1 text-[9px] font-bold text-white">{badge}</span>}</span><span className={`text-[9px] font-semibold ${active ? '' : 'font-medium'}`}>{label}</span>{active && <span className="absolute -bottom-1 h-0.5 w-5 rounded-full bg-[#719B5C]"/>}</button> }
function Header({ eyebrow, title, back }: { eyebrow: string; title: string; back?: ReactNode }) { return <header className="px-6 pb-5 pt-5">{back}<p className="mb-1 text-[10px] font-bold uppercase tracking-[.19em] text-[#719B5C]">{eyebrow}</p><h1 className="font-display text-[27px] font-extrabold leading-tight tracking-[-.05em] text-[#3A4B40]">{title}</h1></header> }

function HomeScreen({ goTracking, onLogout, openMapa }: { goTracking: () => void; onLogout?: () => void, openMapa: () => void }) { 
  const { basketType, frecuencia } = useTampu(); 
  return (
    <div className="pb-6">
      <div className="flex items-center justify-between px-6 pb-2 pt-3">
        <img src="/tampu-wordmark.jpeg" alt="TAMPU" onClick={onLogout} className="h-[54px] w-[94px] cursor-pointer object-contain object-left"/>
        <button onClick={openMapa} className="flex items-center gap-1.5 rounded-full border border-[#e1e6de] bg-white px-3 py-2 text-[10px] font-bold text-[#3A4B40] shadow-sm transition-all hover:bg-[#f4f7f2]">
          <MapPin size={12} className="text-[#F3793B]"/>Cercado, Cbba<ChevronDown size={12}/>
        </button>
      </div>
      <div className="px-5 pt-4">
        <div className="relative overflow-hidden rounded-[28px] bg-[#3A4B40] p-5 pb-4 text-white shadow-[0_16px_30px_-19px_#19533b]">
          <div className="absolute -right-12 -top-10 h-44 w-44 rounded-full border border-white/10"/><div className="absolute -right-1 top-9 h-28 w-28 rounded-full border border-white/10"/>
          <div className="relative z-10 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[.19em] text-[#c2f2d3]"><span className="h-1.5 w-1.5 rounded-full bg-[#a9ef68]"/>Suscripción {frecuencia}</div>
          <div className="relative z-10 mt-3 flex items-start justify-between"><div><h1 className="font-display text-[26px] font-extrabold leading-[1.08] tracking-[-.055em]">Lo fresco<br/>llega a casa.</h1><p className="mt-2 text-[11px] leading-relaxed text-white/70">Del mercado de La Cancha,<br/>con cariño y en caja retornable.</p></div><div className="mt-2 flex h-[76px] w-[76px] items-center justify-center rounded-[26px] bg-[#e2f6ca] text-4xl shadow-lg">🥬</div></div>
        </div>
      </div>
      <div className="px-5 pt-4">
        <div className="mb-2 flex items-center justify-between px-0.5"><h2 className="font-display text-[14px] font-extrabold tracking-tight">Tu aliada del mercado</h2></div>
        <CaseraCard compact />
      </div>
      <div className="mx-5 mt-4 flex items-center gap-3 rounded-[22px] border border-[#e5ece1] bg-white px-4 py-3.5"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#e8f7e8] text-[#719B5C]"><Recycle size={20}/></div><div className="flex-1"><p className="text-[10px] font-bold text-[#263b32]">Pequeños cambios, gran impacto</p><p className="mt-0.5 text-[9px] text-[#89978e]">Con TAMPU ya evitamos</p></div><div className="text-right"><p className="font-display text-[19px] font-extrabold leading-none tracking-tight text-[#719B5C]">12.5 kg</p><p className="mt-1 text-[8px] text-[#89978e]">de plástico</p></div></div>
      <div className="mx-5 mt-4 rounded-[22px] border border-[#e8ede6] bg-white p-4">
        <div className="flex items-center justify-between"><div><p className="text-[9px] font-bold uppercase tracking-[.13em] text-[#958363]">Tu próxima canasta</p><p className="mt-1 font-display text-[16px] font-extrabold">{basketType}</p></div><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#8c7d50]"><ShoppingBasket size={17}/></div></div>
        <button onClick={goTracking} className="mt-3 flex w-full items-center justify-center gap-2 rounded-[14px] bg-[#3A4B40] py-3 text-[11px] font-bold text-white shadow-sm transition-all duration-300 hover:bg-[#cf9219]"><Zap size={14} className="text-[#F3793B]" fill="currentColor"/>Simular entrega de hoy<ArrowUpRight size={14}/></button>
      </div>
    </div>
  )
}

function CaseraCard({ compact = false }: { compact?: boolean }) { 
  const { casera } = useTampu(); 
  return (
    <div className={`flex items-center gap-3 rounded-[22px] border border-[#e8ede6] bg-white ${compact ? 'p-3' : 'p-4'}`}>
      <img src={casera.fotoUrl} alt={casera.nombre} className={`${compact ? 'h-12 w-12' : 'h-[68px] w-[68px]'} rounded-[17px] object-cover`} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1"><h3 className="truncate font-display text-[13px] font-extrabold">{casera.nombre}</h3><BadgeCheck size={13} className="shrink-0 fill-[#d8f5e5] text-[#719B5C]"/></div>
        <p className="mt-0.5 truncate text-[9px] text-[#89978e]">{casera.puesto}</p>
        <div className="mt-1.5 flex items-center gap-1 text-[9px] font-bold text-[#667a6e]"><Star size={11} className="fill-[#F3793B] text-[#F3793B]"/>{casera.rating}<span className="mx-0.5 text-[#c5cfc7]">·</span>{casera.especialidad}</div>
      </div>
    </div>
  ) 
}

function MapaUbicacionSheet({ close }: { close: () => void }) {
  const [marker, setMarker] = useState<{x:number, y:number} | null>(null)
  const handleMapClick = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMarker({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }
  return (
    <>
      <SheetHeading eyebrow="Tu Ubicación" title="Selecciona tu zona" close={close}/>
      <p className="mb-4 text-[10px] text-[#829087]">Toca el mapa para marcar con una 'X' dónde quieres recibir tu canasta.</p>
      <div onClick={handleMapClick} className="relative h-[240px] w-full cursor-crosshair overflow-hidden rounded-[20px] border border-[#e1e9ee] bg-[#e9efdf] shadow-inner">
        <svg viewBox="0 0 360 240" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice"><rect width="360" height="240" fill="#e8eddf"/><path d="M-20 42L380 192M-10 218L340-18M25-10L118 300M296-20L228 300" stroke="#fcfdf8" strokeWidth="16"/><path d="M-20 42L380 192M-10 218L340-18M25-10L118 300M296-20L228 300" stroke="#d4dfcb" strokeWidth="1.4" strokeDasharray="5 4"/><text x="175" y="93" fill="#74846d" fontSize="9" fontFamily="DM Sans" fontWeight="600" transform="rotate(-36 175 93)">AV. AMÉRICA</text><text x="186" y="196" fill="#74846d" fontSize="9" fontFamily="DM Sans" fontWeight="600" transform="rotate(20 186 196)">AV. BEIJING</text></svg>
        {marker && (<div className="pointer-events-none absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center text-[#E46A60] drop-shadow-md" style={{ left: marker.x, top: marker.y }}><X size={28} strokeWidth={4} /></div>)}
      </div>
      <button onClick={close} disabled={!marker} className="mt-5 w-full rounded-[14px] bg-[#3A4B40] py-3.5 text-[11px] font-bold text-white shadow-sm disabled:opacity-50">{marker ? 'Guardar Ubicación' : 'Marca en el mapa'}</button>
    </>
  )
}

function BasketScreen({ openModal }: { openModal: (v: Modal) => void }) { 
  const { basketType, setBasketType, frecuencia, setFrecuencia, yapa, setYapa, cart, updateCart } = useTampu(); 
  
  const maxItems = basketType === 'Personal' ? 3 : basketType === 'Dúo' ? 5 : basketType === 'Familiar' ? 8 : 999;
  const currentTotalItems = cart.reduce((sum, item) => sum + item.cantidad, 0);
  const isFixed = basketType !== 'Personalizada';
  
  const basePrices = { 'Personal': 60, 'Dúo': 100, 'Familiar': 140, 'Personalizada': 0 }
  let precioCalculado = basePrices[basketType];
  if (!isFixed) {
    precioCalculado = cart.reduce((sum, item) => {
      const p = productosBase.find(x => x.id === item.id)
      const factor = item.unidad === 'Cuartilla' ? 2.5 : 1
      return sum + ((p?.precioBase || 0) * factor * item.cantidad)
    }, 0)
  }

  const handleAdd = (id: string, currentQty: number) => {
    if (isFixed && currentTotalItems >= maxItems) {
      alert(`Plan ${basketType} permite máximo ${maxItems} productos. Quita uno para agregar otro (Precio Fijo).`);
      return;
    }
    updateCart(id, currentQty + 1)
  }

  return (
    <div className="flex min-h-full flex-col pb-4">
      <Header eyebrow="Del mercado a tu mesa" title="Arma tu canasta"/>
      <div className="px-5 space-y-4">
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase text-[#69796e]">1. Frecuencia de Suscripción</p>
          <div className="grid grid-cols-2 gap-2 rounded-[16px] bg-[#e9eee7] p-1.5">
            {(['Semanal', 'Quincenal'] as const).map((type) => (
              <button key={type} onClick={() => setFrecuencia(type)} className={`rounded-[12px] py-2 text-[11px] font-bold transition-all duration-300 ${frecuencia === type ? 'bg-white text-[#183b2f] shadow-sm' : 'text-[#89958b]'}`}>{type}</button>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase text-[#69796e]">2. Tipo de Canasta Mensual</p>
          <div className="grid grid-cols-2 gap-2">
            {(['Personal', 'Dúo', 'Familiar', 'Personalizada'] as const).map((type) => (
              <button key={type} onClick={() => setBasketType(type)} className={`flex flex-col items-start rounded-[16px] border p-3 transition-all ${basketType === type ? 'border-[#719B5C] bg-[#f1f6ea]' : 'border-[#e4eadf] bg-white'}`}>
                <span className="text-[12px] font-extrabold text-[#3A4B40]">{type}</span>
                <span className="text-[9px] font-medium text-[#7a8a80]">{type === 'Personalizada' ? 'Arma a tu gusto' : `Fijo · Max ${type==='Personal'?3:type==='Dúo'?5:8} prod.`}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-5 mt-6 flex items-center justify-between">
        <div><h2 className="font-display text-[14px] font-extrabold">Selección de Verduras</h2><p className="mt-0.5 text-[9px] text-[#93a096]">{isFixed ? `Plan Fijo: Llevas ${currentTotalItems} de ${maxItems}` : 'Añade lo que necesites, precio variable'}</p></div>
      </div>
      <div className="mx-5 mt-2 divide-y divide-[#edf0ea] rounded-[20px] border border-[#e8ede6] bg-white px-3">
        {productosBase.map((p) => { 
          const cartItem = cart.find(c => c.id === p.id);
          const qty = cartItem?.cantidad || 0;
          const unit = cartItem?.unidad || 'Kilo';
          return (
            <div key={p.id} className="flex items-center gap-3 py-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#f4f7f1] text-[20px]">{{papa:'🥔',tomate:'🍅',cebolla:'🧅',zanahoria:'🥕',acelga:'🥬',locoto:'🌶️'}[p.id]}</div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold text-[#2d4438]">{p.nombre}</p>
                {qty > 0 && p.soportaCuartilla ? (
                  <div className="mt-1 flex gap-1">
                    <button onClick={() => updateCart(p.id, qty, 'Kilo')} className={`rounded text-[8px] font-bold px-1.5 py-0.5 ${unit === 'Kilo' ? 'bg-[#719B5C] text-white' : 'bg-[#e9eee7] text-[#69796e]'}`}>Kilo</button>
                    <button onClick={() => updateCart(p.id, qty, 'Cuartilla')} className={`rounded text-[8px] font-bold px-1.5 py-0.5 ${unit === 'Cuartilla' ? 'bg-[#719B5C] text-white' : 'bg-[#e9eee7] text-[#69796e]'}`}>Cuartilla</button>
                  </div>
                ) : (
                  <p className="text-[9px] text-[#a1aba1] mt-0.5">{qty > 0 ? unit : p.soportaCuartilla ? 'Kilo o Cuartilla' : 'Unidad/Atado'}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateCart(p.id, qty - 1, unit)} className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f3f5f1] text-[#627469]"><Minus size={12}/></button>
                <span className="w-3 text-center text-[11px] font-bold">{qty}</span>
                <button onClick={() => handleAdd(p.id, qty)} className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e9f6ec] text-[#719B5C]"><Plus size={12}/></button>
              </div>
            </div>
          )
        })}
      </div>
      <button onClick={() => openModal('yapa')} className="mx-5 mt-4 flex items-center gap-3 rounded-[19px] border border-[#f4d7c8] bg-[#fffaf7] p-3 text-left transition-all hover:bg-[#fff0e8]">
        <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#fff0e8] text-[#F3793B]"><Sparkles size={18}/></div>
        <div className="min-w-0 flex-1"><p className="text-[10px] font-extrabold text-[#5b4a26]">Una yapa de {useTampu().casera.nombre}</p><p className="mt-0.5 text-[9px] text-[#9a8b69]">{yapa ? `${yapa.nombre} · gratis` : 'Un regalito fresco para ti'}</p></div>
        {yapa ? <span onClick={(e) => { e.stopPropagation(); setYapa(null) }} className="rounded-full bg-[#FCEAE8] px-2.5 py-1 text-[8px] font-bold text-[#E46A60]">+ YAPA</span> : <span className="rounded-full bg-[#3A4B40] px-2.5 py-1.5 text-[8px] font-bold text-white">ELEGIR</span>}
      </button>
      <div className="mt-auto px-5 pt-6">
        <button onClick={() => openModal('pago')} className="flex w-full items-center justify-between rounded-[17px] bg-[#3A4B40] px-4 py-4 text-white shadow-lg transition-all hover:bg-[#2c3931]"><span className="flex items-center gap-2 text-[12px] font-bold"><WalletCards size={18}/>Confirmar y Pagar</span><span className="flex items-center gap-1 text-[11px] font-bold">{money(precioCalculado + 15)}<ArrowRight size={14}/></span></button>
        <p className="mt-2 text-center text-[9px] text-[#a0aaa0]">Incluye logística (15 Bs) · Total mensual</p>
      </div>
    </div>
  )
}

function TrackingScreen() { 
  const step = 2; 
  const steps = [{ title: 'Selección en La Cancha', time: 'Hoy · 07:42', icon: <ShoppingBasket size={15}/> }, { title: 'Empaque retornable', time: 'Hoy · 08:05', icon: <PackageCheck size={15}/> }, { title: 'En camino', time: 'Hoy · 08:32', icon: <Bike size={15}/> }, { title: 'Entregado', time: 'Te avisaremos', icon: <Check size={15}/> }]; 
  return (
    <div className="pb-6">
      <Header eyebrow="Tu canasta está en camino" title="Ruta en vivo"/>
      <div className="mx-5 overflow-hidden rounded-[24px] border border-[#e5eae3] bg-[#e9efdf] shadow-sm">
        <div className="relative h-[270px] overflow-hidden">
          <svg viewBox="0 0 360 270" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice"><rect width="360" height="270" fill="#e8eddf"/><path d="M-20 42L380 192M-10 218L340-18M25-10L118 300M296-20L228 300" stroke="#fcfdf8" strokeWidth="16"/><path d="M-20 42L380 192M-10 218L340-18M25-10L118 300M296-20L228 300" stroke="#d4dfcb" strokeWidth="1.4" strokeDasharray="5 4"/><path d="M-10 218L340-18" stroke="#f1c983" strokeWidth="3" strokeDasharray="8 6"/><path d="M77 202C107 172 117 147 158 142S218 133 246 83" fill="none" stroke="#719B5C" strokeWidth="4" strokeLinecap="round"/><text x="175" y="93" fill="#74846d" fontSize="9" fontFamily="DM Sans" fontWeight="600" transform="rotate(-36 175 93)">AV. AMÉRICA</text></svg>
          <div className="absolute left-[15%] top-[66%] flex h-8 w-8 items-center justify-center rounded-full border-[3px] border-white bg-[#F3793B] text-white shadow-lg"><MapPin size={15} fill="currentColor"/></div>
          <div className="absolute left-[64%] top-[26%] flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-white bg-[#719B5C] text-white shadow-lg"><Bike size={17}/></div>
          <div className="absolute bottom-3 left-3 rounded-[14px] bg-white/95 px-3 py-2 shadow-sm"><p className="text-[8px] font-bold uppercase tracking-wider text-[#96a091]">Llegada estimada</p><p className="mt-0.5 font-display text-[15px] font-extrabold">09:10</p></div>
        </div>
      </div>
      <div className="mx-5 mt-4 flex items-center justify-between"><h2 className="font-display text-[14px] font-extrabold">Tu pedido de hoy</h2><span className="rounded-full bg-[#e7f7ed] px-2.5 py-1 text-[8px] font-bold text-[#719B5C]">EN CAMINO</span></div>
      <div className="mx-5 mt-3 rounded-[21px] border border-[#e8ede6] bg-white px-4 py-2">
        {steps.map((s, i) => <div key={s.title} className="flex gap-3"><div className="flex w-6 flex-col items-center"><div className={`z-10 mt-3 flex h-6 w-6 items-center justify-center rounded-full ${i < step ? 'bg-[#719B5C] text-white' : i === step ? 'bg-[#e1f6e9] text-[#719B5C] ring-2 ring-[#9ee2bf]' : 'bg-[#f1f3ee] text-[#abb4ab]'}`}>{i < step ? <Check size={12}/> : s.icon}</div>{i < 3 && <div className={`min-h-[18px] w-px flex-1 ${i < step ? 'bg-[#63c89d]' : 'bg-[#e8ece5]'}`}/>}</div><div className="flex flex-1 items-center justify-between py-[10px]"><p className={`text-[10px] font-bold ${i <= step ? 'text-[#284238]' : 'text-[#a1aaa1]'}`}>{s.title}</p><span className="text-[8px] text-[#a0aaa0]">{s.time}</span></div></div>)}
      </div>
    </div>
  ) 
}

function CaseraScreen() { 
  const { casera, setCasera } = useTampu(); 
  return (
    <div className="pb-6">
      <Header eyebrow="Personas que hacen comunidad" title="Tus Caseras"/>
      <div className="px-5 mb-6">
        <p className="mb-2 text-[10px] font-bold uppercase text-[#69796e]">Tu casera actual</p>
        <div className="overflow-hidden rounded-[25px] border border-[#719B5C] bg-white shadow-md">
          <div className="relative h-[120px] overflow-hidden bg-[#dbe9d9]"><img src={casera.fotoUrl} alt={casera.nombre} className="h-full w-full object-cover object-center"/><div className="absolute inset-0 bg-gradient-to-t from-[#142920]/80 via-transparent to-transparent"/><div className="absolute bottom-3 left-4 text-white"><h2 className="font-display text-[22px] font-extrabold tracking-tight">{casera.nombre}</h2></div><div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1.5 text-[9px] font-bold text-[#4c5e52]"><Star size={12} className="fill-[#F3793B] text-[#F3793B]"/>{casera.rating}</div></div>
          <div className="p-3 bg-[#f1f6ea] flex justify-between items-center"><div className="flex items-center gap-2 text-[10px] font-semibold text-[#577a64]"><MapPin size={13}/>{casera.puesto}</div><span className="text-[9px] font-bold text-[#719B5C] flex items-center gap-1"><CheckCircle2 size={12}/> Seleccionada</span></div>
        </div>
      </div>
      <div className="px-5">
        <p className="mb-3 text-[10px] font-bold uppercase text-[#69796e]">Directorio: Cambiar de casera</p>
        <div className="flex flex-col gap-3">
          {caseras.filter(c => c.id !== casera.id).map(c => (
            <div key={c.id} className="flex items-center gap-3 rounded-[20px] border border-[#e8ede6] bg-white p-3 transition-all hover:border-[#a3c4ae]"><img src={c.fotoUrl} alt={c.nombre} className="h-[60px] w-[60px] rounded-[14px] object-cover" /><div className="min-w-0 flex-1"><h3 className="font-display text-[14px] font-extrabold text-[#3A4B40]">{c.nombre}</h3><p className="truncate text-[10px] text-[#7a8a80]">{c.puesto}</p><div className="mt-1 flex items-center gap-1 text-[9px] font-bold text-[#667a6e]"><Star size={10} className="fill-[#F3793B] text-[#F3793B]"/>{c.rating} · {c.especialidad}</div></div><button onClick={() => setCasera(c)} className="flex h-8 items-center rounded-full bg-[#f4f7f2] px-3 text-[10px] font-bold text-[#719B5C]">Elegir</button></div>
          ))}
        </div>
      </div>
    </div>
  ) 
}

function BottomSheet({ children, onClose }: { children: ReactNode; onClose: () => void }) { return <div className="absolute inset-0 z-40 flex items-end justify-center"><button aria-label="Cerrar modal" onClick={onClose} className="absolute inset-0 bg-[#14251e]/45 backdrop-blur-[2px] transition-all duration-300"/><div className="relative max-h-[88%] w-full animate-[sheet_.32s_cubic-bezier(.2,.8,.2,1)] overflow-y-auto rounded-t-[30px] bg-[#fffefa] px-5 pb-7 pt-3 shadow-[0_-20px_60px_-30px_rgba(0,0,0,.38)]"><div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#dde2da]"/>{children}</div></div> }
function SheetHeading({ eyebrow, title, close }: { eyebrow: string; title: string; close: () => void }) { return <div className="mb-4 flex items-start justify-between"><div><p className="text-[9px] font-bold uppercase tracking-[.17em] text-[#719B5C]">{eyebrow}</p><h2 className="mt-1 font-display text-[20px] font-extrabold tracking-tight">{title}</h2></div><button onClick={close} className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f0f3ed] text-[#708075]"><X size={16}/></button></div> }
function SwapSheet() { return null; }
function YapaSheet({ close }: { close: () => void }) { const { setYapa, yapa, casera } = useTampu(); const emojis: Record<string,string> = {hierbas:'🌿',quirquina:'🌶️',limones:'🍋'}; return <><SheetHeading eyebrow="Un regalo del mercado" title={`Elige la yapa de ${casera.nombre}`} close={close}/><p className="mb-4 text-[10px] text-[#829087]">Un detalle de temporada, sin costo adicional para ti ✨</p><div className="space-y-2">{yapas.map((p) => <button key={p.id} onClick={() => { setYapa(p); close() }} className={`flex w-full items-center gap-3 rounded-[17px] border p-3 text-left transition-all duration-300 ${yapa?.id === p.id ? 'border-[#e7bd5e] bg-[#fffaed]' : 'border-[#ebeee7] bg-white hover:border-[#e7bd5e]'}`}><div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#f8f2dd] text-[24px]">{emojis[p.id]}</div><div className="flex-1"><p className="text-[10px] font-extrabold">{p.nombre}</p><p className="mt-0.5 text-[9px] text-[#98a397]">Regalo</p></div><span className="rounded-full bg-[#edf8ec] px-2.5 py-1 text-[8px] font-bold text-[#719B5C]">GRATIS</span>{yapa?.id === p.id && <CheckCircle2 size={16} className="text-[#719B5C]"/>}</button>)}</div><button onClick={close} className="mt-4 w-full rounded-[14px] bg-[#3A4B40] py-3 text-[10px] font-bold text-white shadow-sm">{yapa ? 'Listo, gracias ✨' : 'Elegir más tarde'}</button></> }
function PaymentSheet({ close, afterPay }: { close: () => void; afterPay: () => void }) { const [returnBox, setReturnBox] = useState(true); const [paying, setPaying] = useState(false); const [paid, setPaid] = useState(false); const start = () => { setPaying(true); window.setTimeout(() => { setPaying(false); setPaid(true) }, 1500) }; return <><SheetHeading eyebrow="Pago mensual" title={paid ? '¡Suscripción activa!' : 'Paga tu mes con QR'} close={paid ? afterPay : close}/>{paid ? <div className="py-4 text-center"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e3f7e9] text-[#719B5C]"><CheckCircle2 size={34}/></div><p className="mt-3 font-display text-[17px] font-extrabold">¡Todo listo para este mes!</p><button onClick={afterPay} className="mt-5 w-full rounded-[15px] bg-[#3A4B40] py-3.5 text-[10px] font-bold text-white">Ver mi entrega de hoy <ArrowRight size={13} className="ml-1 inline"/></button></div> : <><div className="mx-auto my-4 w-fit rounded-[18px] border border-[#e9ece5] bg-white p-3 shadow-sm"><div className="grid h-[134px] w-[134px] grid-cols-13 grid-rows-13 gap-[2px]">{Array.from({length:169},(_,i) => { const x=i%13,y=Math.floor(i/13); const f=((x>=0&&x<4&&y>=0&&y<4)||(x>=9&&x<13&&y>=0&&y<4)||(x>=0&&x<4&&y>=9&&y<13)) ? (x===0||x===3||y===0||y===3||x===9||x===12||y===9||y===12||(x>=1&&x<=2&&y>=1&&y<=2)||(x>=10&&x<=11&&y>=1&&y<=2)||(x>=1&&x<=2&&y>=10&&y<=11)) : null; const dark=f===null ? ((i*37+x*y*11+x*7)%9<4) : f; return <span key={i} className={dark?'rounded-[1px] bg-[#16352a]':'bg-white'}/> })}</div><p className="mt-2 flex items-center justify-center gap-1 text-[8px] font-bold text-[#829087]"><Smartphone size={11}/>Escanea con tu banca móvil</p></div><button onClick={() => setReturnBox(!returnBox)} className="flex w-full items-center gap-2.5 rounded-[14px] border border-[#e9ece5] bg-white p-3 text-left"><span className={`flex h-5 w-5 items-center justify-center rounded-[6px] ${returnBox?'bg-[#719B5C] text-white':'border border-[#cbd4ca]'}`}>{returnBox&&<Check size={12}/>}</span><span className="flex-1 text-[9px] font-semibold text-[#52665a]">Devolveré la caja retornable limpia</span><Recycle size={15} className="text-[#719B5C]"/></button><button disabled={paying} onClick={start} className="mt-3 flex w-full items-center justify-center gap-2 rounded-[15px] bg-[#3A4B40] py-3.5 text-[10px] font-bold text-white transition-all duration-300 disabled:opacity-80">{paying?<><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"/>Procesando pago…</>:<><CheckCircle2 size={15}/>Simular pago exitoso</>}</button></>}</> }

// --- APP DE LA CASERA ---
interface PedidoCliente { id: string; cliente: string; items: { nombre: string, cantidad: number, unidad: string }[]; estado: 'pendiente' | 'armado' }

const pedidosIniciales: PedidoCliente[] = [
  { id: 'P01', cliente: 'María López', items: [{nombre: 'Papa Imilla', cantidad: 1, unidad: 'Cuartilla'}, {nombre: 'Tomate Perita', cantidad: 2, unidad: 'Kilo'}, {nombre: 'Zanahoria', cantidad: 1, unidad: 'Kilo'}], estado: 'pendiente' },
  { id: 'P02', cliente: 'Familia Vargas', items: [{nombre: 'Brócoli', cantidad: 2, unidad: 'Unidad'}, {nombre: 'Tomate', cantidad: 1, unidad: 'Kilo'}], estado: 'pendiente' },
]

function CaseraDashboard({ onLogout, lang, setLang, t }: { onLogout: () => void, lang: 'es'|'qu', setLang: (l:'es'|'qu')=>void, t: any }) {
  const [pedidos, setPedidos] = useState<PedidoCliente[]>(pedidosIniciales)
  const [pedidoActivo, setPedidoActivo] = useState<PedidoCliente | null>(null)

  if (pedidoActivo) return <CaseraChecklist pedido={pedidoActivo} onBack={() => setPedidoActivo(null)} onConfirm={() => { setPedidos(prev => prev.map(p => p.id === pedidoActivo.id ? { ...p, estado: 'armado' } : p)); setPedidoActivo(null); }} />

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden bg-[#fafbf9] text-[#3A4B40]">
      <div className="scrollbar-hide absolute inset-0 overflow-y-auto pb-[90px]">
        <div className="bg-[#F3793B] px-6 pb-6 pt-6 text-white rounded-b-[30px] shadow-sm">
          <div className="mb-4 flex items-center justify-between"><div className="rounded-[10px] bg-white px-2 py-1 shadow-sm"><img src="/tampu-wordmark.jpeg" alt="TAMPU" className="h-[22px] w-auto object-contain" /></div><div className="flex items-center gap-3"><LangToggle lang={lang} setLang={setLang} isDark /><button onClick={onLogout} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md active:scale-95"><UserRound size={18}/></button></div></div>
          <div><p className="text-[11px] font-medium text-white/80">Puesto 42, La Cancha</p><h1 className="font-display text-[26px] font-extrabold tracking-tight">{t.saludo} Rosa!</h1></div>
        </div>
        <div className="px-5 pt-6">
          <h2 className="mb-4 font-display text-[18px] font-extrabold text-[#3A4B40]">{t.pedidosTitulo}</h2>
          <div className="flex flex-col gap-4">
            {pedidos.map(p => (
              <div key={p.id} className={`rounded-[22px] border ${p.estado === 'armado' ? 'border-[#d4ebd8] bg-[#f2f9f4]' : 'border-[#e4eadf] bg-white'} p-4 shadow-sm`}>
                <div className="mb-3 border-b border-[#f0f3eb] pb-2"><p className="text-[10px] font-bold uppercase tracking-wider text-[#69796e]">Cliente</p><p className="font-display text-[16px] font-extrabold text-[#3A4B40]">{p.cliente}</p></div>
                <p className="mb-4 text-[12px] font-medium text-[#4a5c51]">{p.items.length} productos solicitados</p>
                {p.estado === 'pendiente' ? (
                  <button onClick={() => setPedidoActivo(p)} className="flex w-full items-center justify-center gap-2 rounded-[14px] bg-[#F3793B] py-3.5 text-[12px] font-bold text-white shadow-sm active:scale-95"><ListTodo size={16}/> Revisar y Armar Canasta</button>
                ) : (
                  <div className="flex items-center justify-center gap-2 rounded-[14px] bg-[#e1f0e5] py-3.5 text-[12px] font-bold text-[#2d6642]"><Bike size={16}/> Lista para recojo</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

function CaseraChecklist({ pedido, onBack, onConfirm }: { pedido: PedidoCliente, onBack: () => void, onConfirm: () => void }) {
  const [checks, setChecks] = useState<Record<number, boolean>>({})
  const [cajaRetornable, setCajaRetornable] = useState(false)
  const allProductsChecked = pedido.items.every((_, i) => checks[i])
  const canSubmit = allProductsChecked && cajaRetornable

  return (
    <main className="flex h-[100dvh] w-full flex-col bg-[#fafbf9]">
      <header className="flex flex-col bg-white px-5 pb-4 pt-5 shadow-sm">
        <div className="flex items-center justify-between"><button onClick={onBack} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f4f7f2] text-[#55695d] active:scale-95"><ChevronLeft size={20}/></button><div className="rounded-[10px] bg-[#F3793B] px-3 py-1 text-[10px] font-bold text-white shadow-sm">ARMANDO PEDIDO</div></div>
        <div className="mt-4"><h1 className="font-display text-[22px] font-extrabold text-[#3A4B40]">Canasta de {pedido.cliente}</h1><p className="text-[11px] text-[#7a8a80]">Verifica las cantidades exactas</p></div>
      </header>
      <div className="flex-1 overflow-y-auto px-5 py-6">
        <p className="mb-3 text-[10px] font-bold uppercase text-[#69796e]">Lista de Mercado</p>
        <div className="flex flex-col gap-2">
          {pedido.items.map((item, i) => (
            <div key={i} onClick={() => setChecks(prev => ({ ...prev, [i]: !prev[i] }))} className={`flex cursor-pointer items-center justify-between rounded-[16px] border p-4 transition-all ${checks[i] ? 'border-[#719B5C] bg-[#f1f6ea]' : 'border-[#e4eadf] bg-white'}`}>
              <div><p className={`font-display text-[15px] font-extrabold ${checks[i] ? 'text-[#3A4B40]' : 'text-[#4a5c51]'}`}>{item.nombre}</p><p className="text-[12px] font-medium text-[#F3793B]">{item.cantidad} {item.unidad}</p></div>
              <div className={checks[i] ? 'text-[#719B5C]' : 'text-[#c6d1c9]'}>{checks[i] ? <CheckSquare size={24} fill="#e1f0e5" /> : <Square size={24} />}</div>
            </div>
          ))}
        </div>
        <div className="mt-8 rounded-[20px] bg-[#fff0e8] p-4 border border-[#f6d6c4]">
          <div onClick={() => setCajaRetornable(!cajaRetornable)} className="flex cursor-pointer items-center gap-3">
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] border-2 ${cajaRetornable ? 'border-[#F3793B] bg-[#F3793B] text-white' : 'border-[#d4a893] bg-white text-transparent'}`}><Check size={18} strokeWidth={3} /></div>
            <div><p className="text-[12px] font-extrabold text-[#783e20]">Empacado en caja retornable</p><p className="text-[9px] text-[#9c6a51]">Requisito obligatorio para cerrar el pedido.</p></div>
          </div>
        </div>
      </div>
      <div className="border-t border-[#e8ede6] bg-white p-5 pb-8">
        <button disabled={!canSubmit} onClick={onConfirm} className="flex w-full items-center justify-center gap-2 rounded-[16px] bg-[#F3793B] py-4 text-[14px] font-bold text-white shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:grayscale">{canSubmit ? 'Finalizar y Avisar a Delivery' : 'Completa la lista primero'} <CheckCircle2 size={20}/></button>
      </div>
    </main>
  )
}

// --- APP DEL DELIVERY ---
interface Entrega { id: string; cliente: string; direccion: string; caseraInfo: string; estado: 'recojo' | 'transito' | 'entregado'; montoGanancia: number; }
const entregasIniciales: Entrega[] = [
  { id: 'E01', cliente: 'María López', direccion: 'Av. América esq. Potosí', caseraInfo: 'Doña Rosa · Puesto 42', estado: 'recojo', montoGanancia: 15 },
]

function DeliveryDashboard({ onLogout }: { onLogout: () => void }) {
  const [entregas, setEntregas] = useState<Entrega[]>(entregasIniciales)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3500) }
  const actualizarEstado = (id: string, nuevoEstado: Entrega['estado']) => { 
    setEntregas(prev => prev.map(e => e.id === id ? { ...e, estado: nuevoEstado } : e))
    if (nuevoEstado === 'transito') showToast("Notificación enviada: 'Tu pedido está en camino'")
    if (nuevoEstado === 'entregado') showToast("Notificación enviada: 'Tu pedido ha sido entregado'")
  }

  const entregasActivas = entregas.filter(e => e.estado !== 'entregado');

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden bg-[#f4f7f9] text-[#2c3e50]">
      {toast && (
        <div className="absolute left-4 right-4 top-8 z-50 flex animate-bounce items-center gap-3 rounded-2xl bg-[#48b67e] p-4 text-white shadow-xl">
          <Smartphone size={24} /><div><p className="text-[10px] font-bold uppercase tracking-wider opacity-80">Simulador</p><p className="text-[12px] font-bold">{toast}</p></div>
        </div>
      )}
      <div className="scrollbar-hide absolute inset-0 overflow-y-auto pb-[90px]">
        <div className="bg-[#4A8BBA] px-6 pb-6 pt-6 text-white rounded-b-[30px] shadow-sm">
          <div className="mb-4 flex items-center justify-between"><div className="rounded-[10px] bg-white px-2 py-1 shadow-sm"><img src="/tampu-wordmark.jpeg" alt="TAMPU" className="h-[22px] w-auto object-contain" /></div><button onClick={onLogout} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md active:scale-95"><UserRound size={18} /></button></div>
          <div><h1 className="font-display text-[26px] font-extrabold tracking-tight">Ruta activa</h1></div>
        </div>
        <div className="px-5 pt-6">
          <div className="mb-4 flex items-center justify-between"><h2 className="font-display text-[18px] font-extrabold text-[#2c3e50]">Tareas de hoy</h2></div>
          <div className="flex flex-col gap-4">
            {entregasActivas.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-[22px] border border-[#e1e9ee] bg-white py-10 text-center"><CheckCircle2 size={40} className="mb-3 text-[#719B5C]" /><p className="font-display text-[16px] font-extrabold">¡Todo entregado!</p></div>
            ) : (
              entregasActivas.map(entrega => (
                <div key={entrega.id} className="rounded-[22px] border border-[#e1e9ee] bg-white p-5 shadow-sm">
                  {entrega.estado === 'recojo' ? (
                    <><div className="mb-3 border-b border-[#f0f4f7] pb-3"><div className="inline-flex items-center gap-2 rounded-full bg-[#fff0e8] px-2.5 py-1 text-[10px] font-bold text-[#F3793B]">Recoger pedido</div></div><p className="font-display text-[18px] font-extrabold">{entrega.caseraInfo}</p><button onClick={() => actualizarEstado(entrega.id, 'transito')} className="mt-5 flex w-full items-center justify-center gap-2 rounded-[14px] bg-[#F3793B] py-3.5 text-[13px] font-bold text-white shadow-sm active:scale-95"><PackageCheck size={18}/> Iniciar Viaje (Avisar a Cliente)</button></>
                  ) : (
                    <><div className="mb-3 border-b border-[#f0f4f7] pb-3"><div className="inline-flex items-center gap-2 rounded-full bg-[#e3f0f7] px-2.5 py-1 text-[10px] font-bold text-[#4A8BBA]">En camino</div></div><p className="font-display text-[18px] font-extrabold">{entrega.cliente}</p><p className="text-[12px]">{entrega.direccion}</p><button onClick={() => actualizarEstado(entrega.id, 'entregado')} className="mt-5 flex w-full items-center justify-center gap-2 rounded-[14px] bg-[#4A8BBA] py-3.5 text-[13px] font-bold text-white shadow-sm active:scale-95"><MapPinned size={18}/> Ya llegué (Entregar y Avisar)</button></>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  )
}