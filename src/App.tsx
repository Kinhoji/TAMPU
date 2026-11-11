import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, BadgeCheck, Bike, CalendarDays, Check, CheckCircle2, ChevronDown, ChevronRight, Compass, Flower2, Heart, Home, MapPin, Minus, PackageCheck, Plus, Recycle, ShieldCheck, ShoppingBasket, Smartphone, Sparkles, Star, UserRound, WalletCards, X, Zap, Store, ChevronLeft, ListTodo, Store as StoreIcon, Camera, Trash2, PlusCircle, Image as ImageIcon, Map as MapIcon, Navigation, Banknote, MapPinned } from 'lucide-react'

// --- TIPOS Y DATOS ORIGINALES ---
interface Casera { id: string; nombre: string; puesto: string; rating: number; especialidad: string; fotoUrl: string }
interface Producto { id: string; nombre: string; precio: number; unidad: string; isYapa?: boolean }
interface Canasta { tipo: 'Familiar' | 'Dúo'; precioBase: number; logistica: number; items: Producto[] }

const caseras: Casera[] = [
  { id: 'rosa', nombre: 'Doña Rosa', puesto: 'Puesto 42 · La Cancha', rating: 4.9, especialidad: 'Verduras de temporada', fotoUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=360&h=360&fit=crop&crop=faces' },
  { id: 'carmen', nombre: 'Doña Carmen', puesto: 'Puesto 18 · La Cancha', rating: 4.8, especialidad: 'Frutas y verduras', fotoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=360&h=360&fit=crop&crop=faces' },
]
const productos: Producto[] = [
  { id: 'papa', nombre: 'Papa imilla', precio: 0, unidad: '2 kg' },
  { id: 'tomate', nombre: 'Tomate perita', precio: 0, unidad: '1 kg' },
  { id: 'cebolla', nombre: 'Cebolla morada', precio: 0, unidad: '1 kg' },
  { id: 'zanahoria', nombre: 'Zanahoria', precio: 0, unidad: '½ kg' },
  { id: 'acelga', nombre: 'Acelga', precio: 0, unidad: '1 atado' },
  { id: 'locoto', nombre: 'Locoto', precio: 0, unidad: '½ kg' },
]
const yapas: Producto[] = [
  { id: 'hierbas', nombre: 'Atado de hierbas', precio: 0, unidad: '1 atado', isYapa: true },
  { id: 'quirquina', nombre: 'Locoto y quirquiña', precio: 0, unidad: 'para la semana', isYapa: true },
  { id: 'limones', nombre: 'Limones', precio: 0, unidad: '4 unidades', isYapa: true },
]
type Tab = 'inicio' | 'canasta' | 'ruta' | 'casera'
type Modal = 'swap' | 'yapa' | 'pago' | null
interface StoreContextType { casera: Casera; setCasera: (c: Casera) => void; yapa: Producto | null; setYapa: (p: Producto | null) => void; basket: Canasta; setBasketType: (t: Canasta['tipo']) => void; swap: boolean; setSwap: (v: boolean) => void }
const TampuContext = createContext<StoreContextType | null>(null)
const useTampu = () => { const value = useContext(TampuContext); if (!value) throw new Error('TampuContext no disponible'); return value }
const money = (n: number) => `${n} Bs`

// --- CONTROLADOR PRINCIPAL DE VISTAS ---
type AppView = 'roles' | 'login' | 'signup' | 'dashboard'
type Role = 'cliente' | 'casera' | 'delivery'

export default function App() {
  const [appView, setAppView] = useState<AppView>('roles')
  const [role, setRole] = useState<Role>('cliente')

  if (appView === 'roles') {
    return <RoleSelectionScreen onSelect={(r) => { setRole(r); setAppView('login') }} />
  }
  if (appView === 'login') {
    return <LoginScreen role={role} onBack={() => setAppView('roles')} onLogin={() => setAppView('dashboard')} onGoToSignUp={() => setAppView('signup')} />
  }
  if (appView === 'signup') {
    return <SignUpScreen role={role} onBack={() => setAppView('login')} onSignUp={() => setAppView('dashboard')} />
  }
  if (role === 'cliente') {
    return <CustomerDashboard onLogout={() => setAppView('roles')} />
  }
  if (role === 'casera') {
    return <CaseraDashboard onLogout={() => setAppView('roles')} />
  }
  if (role === 'delivery') {
    return <DeliveryDashboard onLogout={() => setAppView('roles')} />
  }

  return null
}

// --- PANTALLAS DE AUTENTICACIÓN ---
const roleConfigs = {
  cliente: { title: 'Iniciar sesión', subtitle: 'Ingresa para pedir tu canasta', color: 'bg-[#719B5C]', button: 'bg-[#3A4B40]', text: 'text-[#719B5C]', focus: 'focus:border-[#719B5C] focus:ring-[#719B5C]/15' },
  casera: { title: 'Acceso Casera', subtitle: 'Revisa tus pedidos de hoy', color: 'bg-[#F3793B]', button: 'bg-[#F3793B]', text: 'text-[#F3793B]', focus: 'focus:border-[#F3793B] focus:ring-[#F3793B]/15' },
  delivery: { title: 'Acceso Repartidor', subtitle: 'Conéctate para empezar tu ruta', color: 'bg-[#4A8BBA]', button: 'bg-[#4A8BBA]', text: 'text-[#4A8BBA]', focus: 'focus:border-[#4A8BBA] focus:ring-[#4A8BBA]/15' },
}

function RoleSelectionScreen({ onSelect }: { onSelect: (r: Role) => void }) {
  const roles = [
    { id: 'cliente', title: 'Quiero comprar', desc: 'Recibe canastas frescas en tu puerta', icon: <ShoppingBasket size={24} />, bg: 'bg-[#f1f6ea]', color: 'text-[#719B5C]', border: 'border-[#d4e5c8]' },
    { id: 'casera', title: 'Soy Casera', desc: 'Gestiona tus ventas y yapas de la semana', icon: <Store size={24} />, bg: 'bg-[#fff0e8]', color: 'text-[#F3793B]', border: 'border-[#f6d6c4]' },
    { id: 'delivery', title: 'Soy Repartidor', desc: 'Lleva frescura y gana con cada entrega', icon: <Bike size={24} />, bg: 'bg-[#e5f0f9]', color: 'text-[#4A8BBA]', border: 'border-[#c1daf1]' },
  ] as const
  return (
    <main className="flex h-[100dvh] w-full flex-col bg-white px-6 pb-8 pt-12">
      <div className="flex justify-center pb-8 pt-4"><img src="/tampu-wordmark.jpeg" alt="TAMPU" className="h-[70px] w-auto object-contain" /></div>
      <div className="mb-8 text-center"><p className="text-[10px] font-bold uppercase tracking-[.19em] text-[#719B5C]">Bienvenido</p><h1 className="mt-1 font-display text-[28px] font-extrabold leading-tight tracking-tight text-[#3A4B40]">¿Cómo usarás<br/>TAMPU hoy?</h1></div>
      <div className="flex flex-col gap-4">
        {roles.map((r) => (
          <button key={r.id} onClick={() => onSelect(r.id)} className={`flex items-center gap-4 rounded-[22px] border ${r.border} bg-white p-4 text-left shadow-sm transition-all duration-300 hover:shadow-md`}><div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] ${r.bg} ${r.color}`}>{r.icon}</div><div className="flex-1"><h2 className="font-display text-[15px] font-extrabold text-[#3A4B40]">{r.title}</h2><p className="mt-0.5 text-[10px] leading-relaxed text-[#7c8b82]">{r.desc}</p></div><ChevronRight size={18} className="text-[#c3ccc6]" /></button>
        ))}
      </div>
    </main>
  )
}

function LoginScreen({ role, onBack, onLogin, onGoToSignUp }: { role: Role; onBack: () => void; onLogin: () => void; onGoToSignUp: () => void }) {
  const config = roleConfigs[role]
  return (
    <main className="flex h-[100dvh] w-full flex-col bg-white">
      <header className="flex items-center px-4 py-5"><button onClick={onBack} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f4f7f2] text-[#55695d] transition-colors hover:bg-[#e6ebe3]"><ChevronLeft size={20} /></button></header>
      <div className="flex-1 px-6 pt-4">
        <div className={`mb-6 inline-flex h-2 w-12 rounded-full ${config.color}`} />
        <h1 className="font-display text-[32px] font-extrabold leading-tight tracking-tight text-[#3A4B40]">{config.title}</h1>
        <p className="mt-2 text-[12px] text-[#7a8a80]">{config.subtitle}</p>
        <form className="mt-10 flex flex-col gap-5" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
          <div><label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#69796e]">Número de celular</label><input type="tel" placeholder="Ej. 70012345" className={`w-full rounded-[16px] border border-[#e1e6de] bg-[#fbfdfa] px-4 py-3.5 text-[14px] font-medium text-[#3A4B40] outline-none transition-all focus:bg-white focus:ring-4 ${config.focus}`} required /></div>
          <div><label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#69796e]">Contraseña</label><input type="password" placeholder="••••••••" className={`w-full rounded-[16px] border border-[#e1e6de] bg-[#fbfdfa] px-4 py-3.5 text-[14px] font-medium text-[#3A4B40] outline-none transition-all focus:bg-white focus:ring-4 ${config.focus}`} required /></div>
          <button type="submit" className={`mt-4 flex w-full items-center justify-center gap-2 rounded-[16px] ${config.button} py-4 text-[12px] font-bold text-white shadow-lg transition-transform active:scale-[0.98]`}>Ingresar <ArrowRight size={15} /></button>
        </form>
        <div className="mt-8 flex flex-col items-center justify-center border-t border-[#f0f3eb] pt-6"><p className="text-[11px] text-[#7a8a80]">¿No tienes una cuenta?</p><button onClick={onGoToSignUp} className={`mt-1.5 text-[12px] font-bold ${config.text} hover:underline`}>Crear cuenta de {role}</button></div>
      </div>
    </main>
  )
}

function SignUpScreen({ role, onBack, onSignUp }: { role: Role; onBack: () => void; onSignUp: () => void }) {
  const config = roleConfigs[role]
  const inputClasses = `w-full rounded-[16px] border border-[#e1e6de] bg-[#fbfdfa] px-4 py-3.5 text-[14px] font-medium text-[#3A4B40] outline-none transition-all focus:bg-white focus:ring-4 ${config.focus}`
  return (
    <main className="flex min-h-[100dvh] w-full flex-col bg-white">
      <header className="flex items-center px-4 py-5"><button onClick={onBack} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f4f7f2] text-[#55695d] transition-colors hover:bg-[#e6ebe3]"><ChevronLeft size={20} /></button></header>
      <div className="flex-1 px-6 pb-8 pt-2">
        <div className={`mb-6 inline-flex h-2 w-12 rounded-full ${config.color}`} />
        <h1 className="font-display text-[32px] font-extrabold leading-tight tracking-tight text-[#3A4B40]">Crear cuenta</h1>
        <p className="mt-2 text-[12px] text-[#7a8a80]">Únete como {role} y comienza hoy mismo.</p>
        <form className="mt-8 flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); onSignUp(); }}>
          <div><label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#69796e]">Nombre completo</label><input type="text" placeholder="Ej. Ana Pérez" className={inputClasses} required /></div>
          <div><label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#69796e]">Número de celular</label><input type="tel" placeholder="Ej. 70012345" className={inputClasses} required /></div>
          {role === 'cliente' && ( <div><label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#69796e]">Zona de entrega</label><select className={inputClasses} required defaultValue=""><option value="" disabled>Selecciona tu zona...</option><option value="norte">Zona Norte</option><option value="centro">Centro</option><option value="sur">Zona Sur</option></select></div> )}
          {role === 'casera' && ( <div><label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#69796e]">Puesto y Mercado</label><input type="text" placeholder="Ej. Puesto 42, La Cancha" className={inputClasses} required /></div> )}
          {role === 'delivery' && ( <div><label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#69796e]">Tipo de vehículo</label><select className={inputClasses} required defaultValue=""><option value="" disabled>Selecciona tu vehículo...</option><option value="bici">Bicicleta (Eco)</option><option value="moto">Motocicleta</option></select></div> )}
          <div><label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#69796e]">Crear contraseña</label><input type="password" placeholder="••••••••" className={inputClasses} required /></div>
          <button type="submit" className={`mt-4 flex w-full items-center justify-center gap-2 rounded-[16px] ${config.button} py-4 text-[12px] font-bold text-white shadow-lg transition-transform active:scale-[0.98]`}>Completar registro <CheckCircle2 size={15} /></button>
        </form>
        <div className="mt-8 flex flex-col items-center justify-center border-t border-[#f0f3eb] pt-6"><p className="text-[11px] text-[#7a8a80]">¿Ya tienes una cuenta?</p><button onClick={onBack} className={`mt-1.5 text-[12px] font-bold ${config.text} hover:underline`}>Inicia sesión aquí</button></div>
      </div>
    </main>
  )
}

// --- APP DEL DELIVERY ---
interface Entrega {
  id: string;
  cliente: string;
  direccion: string;
  referencia: string;
  caseraInfo: string; 
  estado: 'recojo' | 'transito' | 'entregado';
  montoGanancia: number;
}

const entregasIniciales: Entrega[] = [
  { id: 'E01', cliente: 'María López', direccion: 'Av. América esq. Potosí', referencia: 'Edificio Los Pinos, depto 4B. Tocar timbre.', caseraInfo: 'Doña Rosa · Puesto 42, La Cancha', estado: 'recojo', montoGanancia: 15 },
  { id: 'E02', cliente: 'Familia Vargas', direccion: 'Av. Juan de la Rosa', referencia: 'Casa amarilla portón negro.', caseraInfo: 'Doña Carmen · Puesto 18, La Cancha', estado: 'transito', montoGanancia: 15 },
]

type DeliverySubView = 'none' | 'mapa' | 'foto-entrega'

function DeliveryDashboard({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<'rutas' | 'ganancias'>('rutas')
  const [entregas, setEntregas] = useState<Entrega[]>(entregasIniciales)
  
  const [subView, setSubView] = useState<DeliverySubView>('none')
  const [entregaActiva, setEntregaActiva] = useState<Entrega | null>(null)

  if (subView === 'mapa' && entregaActiva) {
    return <DeliveryMapaScreen entrega={entregaActiva} onBack={() => setSubView('none')} onArrived={() => setSubView('foto-entrega')} />
  }
  if (subView === 'foto-entrega' && entregaActiva) {
    return (
      <DeliveryFotoEntrega 
        entrega={entregaActiva} 
        onBack={() => setSubView('mapa')} 
        onConfirm={() => {
          setEntregas(prev => prev.map(e => e.id === entregaActiva.id ? { ...e, estado: 'entregado' } : e));
          setSubView('none');
          setEntregaActiva(null);
        }} 
      />
    )
  }

  const entregasActivas = entregas.filter(e => e.estado !== 'entregado');
  const entregasCompletadas = entregas.filter(e => e.estado === 'entregado');
  const gananciasHoy = entregasCompletadas.reduce((sum, e) => sum + e.montoGanancia, 0);

  const actualizarEstado = (id: string, nuevoEstado: Entrega['estado']) => {
    setEntregas(prev => prev.map(e => e.id === id ? { ...e, estado: nuevoEstado } : e))
  }

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden bg-[#f4f7f9] text-[#2c3e50]">
      <div className="scrollbar-hide absolute inset-0 overflow-y-auto pb-[90px]">
        <div className="bg-[#4A8BBA] px-6 pb-6 pt-6 text-white rounded-b-[30px] shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="rounded-[10px] bg-white px-2 py-1 shadow-sm">
              <img src="/tampu-wordmark.jpeg" alt="TAMPU" className="h-[22px] w-auto object-contain" />
            </div>
            <button onClick={onLogout} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md transition-all active:scale-95">
              <UserRound size={18} className="text-white" />
            </button>
          </div>
          <div>
            <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#a8d3f0]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#6fe092]" /> En línea
            </div>
            <h1 className="font-display text-[26px] font-extrabold tracking-tight">Ruta activa, Carlos</h1>
          </div>
        </div>

        {activeTab === 'rutas' && (
          <div className="px-5 pt-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-[18px] font-extrabold text-[#2c3e50]">Tareas de hoy</h2>
              <span className="rounded-full bg-[#e3f0f7] px-2.5 py-1 text-[10px] font-bold text-[#4A8BBA]">{entregasActivas.length} pendientes</span>
            </div>

            <div className="flex flex-col gap-4">
              {entregasActivas.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-[22px] border border-[#e1e9ee] bg-white py-10 text-center shadow-sm">
                  <CheckCircle2 size={40} className="mb-3 text-[#719B5C]" />
                  <p className="font-display text-[16px] font-extrabold text-[#2c3e50]">¡Todo entregado!</p>
                  <p className="text-[12px] text-[#718596]">No hay más rutas por ahora.</p>
                </div>
              ) : (
                entregasActivas.map(entrega => (
                  <div key={entrega.id} className="rounded-[22px] border border-[#e1e9ee] bg-white p-5 shadow-sm">
                    {entrega.estado === 'recojo' ? (
                      <>
                        <div className="mb-3 flex items-center justify-between border-b border-[#f0f4f7] pb-3">
                          <div className="flex items-center gap-2 rounded-full bg-[#fff0e8] px-2.5 py-1 text-[10px] font-bold text-[#F3793B]"><StoreIcon size={12}/> Recoger pedido</div>
                          <span className="text-[12px] font-extrabold text-[#4A8BBA]">+{entrega.montoGanancia} Bs</span>
                        </div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#718596]">Ir a:</p>
                        <p className="font-display text-[18px] font-extrabold text-[#2c3e50]">{entrega.caseraInfo}</p>
                        <p className="mt-1 text-[12px] text-[#718596]">Canasta para: <span className="font-bold text-[#2c3e50]">{entrega.cliente}</span></p>
                        
                        <button onClick={() => actualizarEstado(entrega.id, 'transito')} className="mt-5 flex w-full items-center justify-center gap-2 rounded-[14px] bg-[#F3793B] py-3.5 text-[13px] font-bold text-white shadow-sm active:scale-95">
                          <PackageCheck size={18}/> Ya recogí la canasta
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="mb-3 flex items-center justify-between border-b border-[#f0f4f7] pb-3">
                          <div className="flex items-center gap-2 rounded-full bg-[#e3f0f7] px-2.5 py-1 text-[10px] font-bold text-[#4A8BBA]"><Navigation size={12}/> En camino</div>
                          <span className="text-[12px] font-extrabold text-[#4A8BBA]">+{entrega.montoGanancia} Bs</span>
                        </div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#718596]">Entregar a:</p>
                        <p className="font-display text-[18px] font-extrabold text-[#2c3e50]">{entrega.cliente}</p>
                        <div className="mt-2 flex items-start gap-2 rounded-[12px] bg-[#f4f7f9] p-3 text-[12px]">
                          <MapPin size={16} className="mt-0.5 shrink-0 text-[#4A8BBA]"/>
                          <div>
                            <p className="font-bold text-[#2c3e50]">{entrega.direccion}</p>
                            <p className="mt-0.5 text-[#718596]">{entrega.referencia}</p>
                          </div>
                        </div>
                        <button onClick={() => { setEntregaActiva(entrega); setSubView('mapa'); }} className="mt-5 flex w-full items-center justify-center gap-2 rounded-[14px] bg-[#4A8BBA] py-3.5 text-[13px] font-bold text-white shadow-sm active:scale-95">
                          <MapPinned size={18}/> Ver mapa y entregar
                        </button>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'ganancias' && (
          <div className="px-5 pt-6">
            <h2 className="mb-4 font-display text-[18px] font-extrabold text-[#2c3e50]">Resumen de hoy</h2>
            <div className="flex items-center justify-between rounded-[24px] bg-[#4A8BBA] p-6 text-white shadow-md">
              <div>
                <p className="text-[12px] font-medium text-white/80">Ganancias generadas</p>
                <p className="mt-1 font-display text-[36px] font-extrabold leading-none">{gananciasHoy} <span className="text-[18px] font-bold">Bs</span></p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20"><Banknote size={28}/></div>
            </div>

            <h3 className="mb-3 mt-8 font-display text-[15px] font-extrabold text-[#2c3e50]">Entregas completadas ({entregasCompletadas.length})</h3>
            <div className="flex flex-col gap-3">
              {entregasCompletadas.length === 0 ? (
                <p className="text-[12px] text-[#718596]">Aún no has completado entregas hoy.</p>
              ) : (
                entregasCompletadas.map(entrega => (
                  <div key={entrega.id} className="flex items-center justify-between rounded-[16px] border border-[#e1e9ee] bg-white p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8f5ec] text-[#719B5C]"><Check size={18}/></div>
                      <div><p className="font-bold text-[#2c3e50]">{entrega.cliente}</p><p className="text-[10px] text-[#718596]">{entrega.direccion}</p></div>
                    </div>
                    <span className="font-display text-[14px] font-extrabold text-[#4A8BBA]">+{entrega.montoGanancia} Bs</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <nav className="absolute inset-x-0 bottom-0 z-20 flex h-[80px] items-center justify-around border-t border-[#e1e9ee] bg-[#ffffff] px-2 pb-4 pt-2 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
        <button onClick={() => setActiveTab('rutas')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'rutas' ? 'text-[#4A8BBA]' : 'text-[#8da3b5]'}`}><MapIcon size={24} className={activeTab === 'rutas' ? 'fill-[#e3f0f7]' : ''} /><span className={`text-[10px] ${activeTab === 'rutas' ? 'font-extrabold' : 'font-medium'}`}>Rutas</span></button>
        <button onClick={() => setActiveTab('ganancias')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'ganancias' ? 'text-[#4A8BBA]' : 'text-[#8da3b5]'}`}><WalletCards size={24} className={activeTab === 'ganancias' ? 'fill-[#e3f0f7]' : ''} /><span className={`text-[10px] ${activeTab === 'ganancias' ? 'font-extrabold' : 'font-medium'}`}>Ganancias</span></button>
      </nav>
    </main>
  )
}

function DeliveryMapaScreen({ entrega, onBack, onArrived }: { entrega: Entrega, onBack: () => void, onArrived: () => void }) {
  return (
    <main className="flex h-[100dvh] w-full flex-col bg-[#f4f7f9]">
      <header className="absolute inset-x-0 top-0 z-10 flex items-center justify-between bg-white/90 px-5 py-4 backdrop-blur-md shadow-sm">
        <button onClick={onBack} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f0f4f7] text-[#4A8BBA] active:scale-95"><ChevronLeft size={20}/></button>
        <div className="text-center"><p className="text-[10px] font-bold uppercase tracking-wider text-[#718596]">Navegando hacia</p><h1 className="font-display text-[16px] font-extrabold text-[#2c3e50]">{entrega.cliente}</h1></div>
        <div className="w-10" />
      </header>
      
      <div className="relative flex-1 bg-[#e9efdf] pt-20">
        <svg viewBox="0 0 360 400" className="absolute inset-0 h-full w-full object-cover" preserveAspectRatio="xMidYMid slice">
          <rect width="360" height="600" fill="#e8eddf"/>
          <path d="M-20 42L380 192M-10 218L340-18M25-10L118 400M296-20L228 400M-20 121L380 68" stroke="#fcfdf8" strokeWidth="16"/>
          <path d="M-20 42L380 192M-10 218L340-18M25-10L118 400M296-20L228 400M-20 121L380 68" stroke="#d4dfcb" strokeWidth="1.4" strokeDasharray="5 4"/>
          <path d="M125 190 L180 120 L240 85" fill="none" stroke="#4A8BBA" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
          <text x="186" y="196" fill="#74846d" fontSize="9" fontFamily="DM Sans" fontWeight="600" transform="rotate(20 186 196)">Ruta sugerida</text>
        </svg>
        <div className="absolute left-[30%] top-[45%] flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-[#4A8BBA] text-white shadow-lg"><Bike size={18} fill="currentColor"/></div>
        <div className="absolute left-[62%] top-[18%] flex h-8 w-8 items-center justify-center rounded-full border-[3px] border-white bg-[#719B5C] text-white shadow-lg"><MapPin size={14} fill="currentColor"/></div>
      </div>

      <div className="rounded-t-[30px] bg-white px-6 pb-8 pt-6 shadow-[0_-20px_40px_rgba(0,0,0,0.08)] z-20">
        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f0f4f7] text-[#4A8BBA]"><MapPin size={24}/></div>
          <div><p className="font-display text-[16px] font-extrabold text-[#2c3e50]">{entrega.direccion}</p><p className="mt-0.5 text-[12px] text-[#718596]">{entrega.referencia}</p></div>
        </div>
        <button onClick={onArrived} className="flex w-full items-center justify-center gap-2 rounded-[16px] bg-[#4A8BBA] py-4 text-[14px] font-bold text-white shadow-lg active:scale-[0.98]">
          Ya llegué, entregar pedido <CheckCircle2 size={18}/>
        </button>
      </div>
    </main>
  )
}

function DeliveryFotoEntrega({ entrega, onBack, onConfirm }: { entrega: Entrega, onBack: () => void, onConfirm: () => void }) {
  const [tomandoFoto, setTomandoFoto] = useState(false);
  const handleConfirm = () => { setTomandoFoto(true); setTimeout(() => onConfirm(), 1200); }
  
  return (
    <main className="flex h-[100dvh] w-full flex-col bg-[#1a232b] text-white">
      <header className="flex items-center justify-between px-5 py-5">
        <button onClick={onBack} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 active:scale-95"><ArrowLeft size={20}/></button>
        <p className="text-[12px] font-bold tracking-wider text-white/70">EVIDENCIA DE ENTREGA</p>
        <div className="w-10" />
      </header>
      
      <div className="flex flex-col items-center px-6 pt-4 text-center">
        <h2 className="font-display text-[22px] font-extrabold">Canasta en destino</h2>
        <p className="mt-2 text-[12px] text-white/70">Toma una foto de la canasta en la puerta o en manos de {entrega.cliente}.</p>
      </div>

      <div className="mx-6 mt-8 flex flex-1 flex-col items-center justify-center rounded-[32px] border-4 border-dashed border-white/20 bg-white/5">
        {tomandoFoto ? (
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-[#4A8BBA]" />
            <p className="text-[12px] font-bold text-white/80">Confirmando entrega...</p>
          </div>
        ) : (
          <><Camera size={64} className="mb-4 text-white/30" /><p className="text-[14px] font-bold text-white/50">Toca para abrir cámara</p></>
        )}
      </div>

      <div className="p-6 pb-10">
        <button disabled={tomandoFoto} onClick={handleConfirm} className="flex w-full items-center justify-center gap-2 rounded-[20px] bg-[#4A8BBA] py-5 text-[14px] font-bold text-white shadow-lg active:scale-[0.98] disabled:opacity-70">
          <CheckCircle2 size={20}/> {tomandoFoto ? 'Finalizando...' : 'Simular foto y finalizar'}
        </button>
      </div>
    </main>
  )
}

// --- APP DE LA CASERA ---
interface ItemVenta { id: string; nombre: string; emoji: string; disponible: boolean; precio: number; unidad: string }
interface PedidoCliente { id: string; cliente: string; items: string[]; estado: 'pendiente' | 'armado' }

const inventarioInicial: ItemVenta[] = [
  { id: '1', nombre: 'Papa Imilla', emoji: '🥔', disponible: true, precio: 35, unidad: 'Arroba' },
  { id: '2', nombre: 'Tomate Perita', emoji: '🍅', disponible: true, precio: 5, unidad: 'Kilo' },
  { id: '3', nombre: 'Cebolla Morada', emoji: '🧅', disponible: false, precio: 12, unidad: 'Cuartilla' },
  { id: '4', nombre: 'Zanahoria', emoji: '🥕', disponible: true, precio: 3, unidad: 'Atado' },
  { id: '5', nombre: 'Brócoli', emoji: '🥦', disponible: true, precio: 5, unidad: 'Unidad' },
]

const pedidosIniciales: PedidoCliente[] = [
  { id: 'P01', cliente: 'María López', items: ['🥔 1 Arroba de Papa', '🍅 2 Kilos de Tomate', '🥕 1 Atado de Zanahoria'], estado: 'pendiente' },
  { id: 'P02', cliente: 'Familia Vargas', items: ['🥦 2 Unidades de Brócoli', '🍅 1 Kilo de Tomate'], estado: 'pendiente' },
]

type CaseraSubView = 'none' | 'lista-pedidos' | 'foto-canasta' | 'editar-inventario'

function CaseraDashboard({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<'pedidos' | 'puesto'>('pedidos')
  const [inventario, setInventario] = useState<ItemVenta[]>(inventarioInicial)
  const [pedidos, setPedidos] = useState<PedidoCliente[]>(pedidosIniciales)
  
  const [subView, setSubView] = useState<CaseraSubView>('none')
  const [editingItem, setEditingItem] = useState<ItemVenta | null>(null)
  const [pedidoActivo, setPedidoActivo] = useState<PedidoCliente | null>(null)

  if (subView === 'lista-pedidos') {
    return <CaseraPedidosList pedidos={pedidos} onBack={() => setSubView('none')} onArmar={(p) => { setPedidoActivo(p); setSubView('foto-canasta'); }} />
  }
  if (subView === 'foto-canasta' && pedidoActivo) {
    return (
      <CaseraArmarFoto 
        pedido={pedidoActivo} 
        onBack={() => setSubView('lista-pedidos')} 
        onConfirm={() => {
          setPedidos(prev => prev.map(p => p.id === pedidoActivo.id ? { ...p, estado: 'armado' } : p));
          setSubView('lista-pedidos');
          setPedidoActivo(null);
        }} 
      />
    )
  }
  if (subView === 'editar-inventario') {
    return <CaseraEditarInventario inventario={inventario} setInventario={setInventario} onBack={() => setSubView('none')} />
  }

  const toggleDisponible = (id: string) => { setInventario(inv => inv.map(item => item.id === id ? { ...item, disponible: !item.disponible } : item)) }
  const saveItem = (updatedItem: ItemVenta) => { setInventario(inv => inv.map(item => item.id === updatedItem.id ? updatedItem : item)); setEditingItem(null) }
  
  const pendientesCount = pedidos.filter(p => p.estado === 'pendiente').length;

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden bg-[#fafbf9] text-[#3A4B40]">
      <div className="scrollbar-hide absolute inset-0 overflow-y-auto pb-[90px]">
        <div className="bg-[#F3793B] px-6 pb-6 pt-6 text-white rounded-b-[30px] shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="rounded-[10px] bg-white px-2 py-1 shadow-sm">
              <img src="/tampu-wordmark.jpeg" alt="TAMPU" className="h-[22px] w-auto object-contain" />
            </div>
            <button onClick={onLogout} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md transition-all active:scale-95">
              <UserRound size={18} className="text-white" />
            </button>
          </div>
          <div>
            <p className="text-[11px] font-medium text-white/80">Puesto 42, La Cancha</p>
            <h1 className="font-display text-[26px] font-extrabold tracking-tight">¡Buen día, Doña Rosa!</h1>
          </div>
        </div>

        {activeTab === 'pedidos' && (
          <div className="px-5 pt-6">
            <h2 className="mb-4 font-display text-[18px] font-extrabold text-[#3A4B40]">Pedidos para hoy</h2>
            <div className="flex flex-col gap-4">
              <div className="rounded-[22px] border border-[#e8ede6] bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef7e9] text-[#719B5C]"><ShoppingBasket size={24}/></div>
                  <div><p className="text-[12px] text-[#6e8074]">Canastas a preparar</p><p className="font-display text-[22px] font-extrabold text-[#3A4B40]">{pendientesCount} <span className="text-[12px] font-medium text-[#F3793B]">pendientes</span></p></div>
                </div>
              </div>
            </div>
            <button onClick={() => setSubView('lista-pedidos')} className="mt-6 flex w-full items-center justify-center gap-2 rounded-[16px] bg-[#3A4B40] py-4 text-[13px] font-bold text-white shadow-lg transition-transform active:scale-[0.98]">
              Ver lista de verduras a preparar <ArrowRight size={18} />
            </button>
          </div>
        )}

        {activeTab === 'puesto' && (
          <div className="px-5 pt-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-display text-[18px] font-extrabold text-[#3A4B40]">Tus verduras de hoy</h2>
                <p className="text-[11px] text-[#7c8b82]">Marca lo que tienes para vender.</p>
              </div>
              <button onClick={() => setSubView('editar-inventario')} className="flex items-center gap-1 rounded-full bg-[#f4e8e1] px-3 py-1.5 text-[10px] font-bold text-[#F3793B] active:scale-95">
                Editar Lista <Plus size={12}/>
              </button>
            </div>
            
            <div className="flex flex-col gap-3">
              {inventario.map(item => (
                <div key={item.id} className={`flex items-center justify-between rounded-[20px] border p-3 transition-all ${item.disponible ? 'border-[#e4eadf] bg-white shadow-sm' : 'border-[#f0f3eb] bg-[#f8faf7] opacity-75'}`}>
                  <div className="flex items-center gap-3">
                    <div className="text-[32px]">{item.emoji}</div>
                    <div>
                      <p className={`font-display text-[14px] font-extrabold ${item.disponible ? 'text-[#3A4B40]' : 'text-[#8b9c91]'}`}>{item.nombre}</p>
                      {item.disponible ? (
                        <p className="text-[11px] font-bold text-[#F3793B]">{item.precio} Bs <span className="font-normal text-[#8b9c91]">el {item.unidad.toLowerCase()}</span></p>
                      ) : (
                        <p className="text-[11px] font-medium text-[#a3b1a8]">No tienes hoy</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <button onClick={() => toggleDisponible(item.id)} className={`flex h-8 items-center justify-center rounded-full px-4 text-[10px] font-bold transition-all ${item.disponible ? 'bg-[#e9f5ed] text-[#34764c]' : 'bg-[#e4e9e1] text-[#69796e]'}`}>
                      {item.disponible ? 'SÍ HAY' : 'SE ACABÓ'}
                    </button>
                    {item.disponible && <button onClick={() => setEditingItem(item)} className="text-[11px] font-bold text-[#719B5C] underline-offset-2 hover:underline">Cambiar precio</button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <nav className="absolute inset-x-0 bottom-0 z-20 flex h-[80px] items-center justify-around border-t border-[#e9ede5] bg-[#fffefa] px-2 pb-4 pt-2 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
        <button onClick={() => setActiveTab('pedidos')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'pedidos' ? 'text-[#F3793B]' : 'text-[#a1b0a6]'}`}><ListTodo size={24} className={activeTab === 'pedidos' ? 'fill-[#fff0e8]' : ''} /><span className={`text-[10px] ${activeTab === 'pedidos' ? 'font-extrabold' : 'font-medium'}`}>Pedidos</span></button>
        <button onClick={() => setActiveTab('puesto')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'puesto' ? 'text-[#F3793B]' : 'text-[#a1b0a6]'}`}><StoreIcon size={24} className={activeTab === 'puesto' ? 'fill-[#fff0e8]' : ''} /><span className={`text-[10px] ${activeTab === 'puesto' ? 'font-extrabold' : 'font-medium'}`}>Mi Puesto</span></button>
      </nav>

      {editingItem && <BottomSheet onClose={() => setEditingItem(null)}><EditPriceCaseraSheet item={editingItem} onSave={saveItem} onClose={() => setEditingItem(null)} /></BottomSheet>}
    </main>
  )
}

function CaseraPedidosList({ pedidos, onBack, onArmar }: { pedidos: PedidoCliente[], onBack: () => void, onArmar: (p: PedidoCliente) => void }) {
  return (
    <main className="flex h-[100dvh] w-full flex-col bg-[#fafbf9]">
      <header className="flex flex-col bg-white px-5 pb-4 pt-5 shadow-sm">
        <div className="mb-4 flex items-center">
          <img src="/tampu-wordmark.jpeg" alt="TAMPU" className="h-[24px] w-auto object-contain" />
        </div>
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f4f7f2] text-[#55695d] active:scale-95"><ChevronLeft size={20}/></button>
          <div><h1 className="font-display text-[18px] font-extrabold text-[#3A4B40]">Cuaderno de Pedidos</h1><p className="text-[11px] text-[#7a8a80]">Revisa qué armar hoy</p></div>
        </div>
      </header>
      
      <div className="flex-1 overflow-y-auto px-5 py-6">
        <div className="flex flex-col gap-4">
          {pedidos.map(p => (
            <div key={p.id} className={`rounded-[22px] border ${p.estado === 'armado' ? 'border-[#d4ebd8] bg-[#f2f9f4]' : 'border-[#e4eadf] bg-white'} p-4 shadow-sm`}>
              <div className="mb-3 border-b border-[#f0f3eb] pb-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#69796e]">Cliente</p>
                <p className="font-display text-[16px] font-extrabold text-[#3A4B40]">{p.cliente}</p>
              </div>
              <ul className="mb-4 flex flex-col gap-2">
                {p.items.map((item, i) => <li key={i} className="text-[12px] font-medium text-[#4a5c51]">{item}</li>)}
              </ul>
              {p.estado === 'pendiente' ? (
                <button onClick={() => onArmar(p)} className="flex w-full items-center justify-center gap-2 rounded-[14px] bg-[#F3793B] py-3.5 text-[12px] font-bold text-white shadow-sm active:scale-95">
                  Armar canasta y avisar <Camera size={16}/>
                </button>
              ) : (
                <div className="flex items-center justify-center gap-2 rounded-[14px] bg-[#e1f0e5] py-3.5 text-[12px] font-bold text-[#2d6642]"><Bike size={16}/> A espera de recojo del delivery</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

function CaseraArmarFoto({ pedido, onBack, onConfirm }: { pedido: PedidoCliente, onBack: () => void, onConfirm: () => void }) {
  const [tomandoFoto, setTomandoFoto] = useState(false);
  const handleConfirm = () => { setTomandoFoto(true); setTimeout(() => onConfirm(), 1200); }
  return (
    <main className="flex h-[100dvh] w-full flex-col bg-[#111814] text-white">
      <header className="flex flex-col bg-[#111814] px-5 py-5 text-white">
        <div className="mb-4 flex items-center">
          <div className="rounded-[10px] bg-white px-2 py-1 shadow-sm">
             <img src="/tampu-wordmark.jpeg" alt="TAMPU" className="h-[20px] w-auto object-contain" />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 active:scale-95"><X size={20}/></button>
          <p className="text-[12px] font-bold tracking-wider text-white/70">FOTO PARA EL CLIENTE</p>
          <div className="w-10" />
        </div>
      </header>
      
      <div className="flex flex-col items-center px-6 pt-4 text-center">
        <h2 className="font-display text-[22px] font-extrabold">Canasta de {pedido.cliente}</h2>
        <p className="mt-2 text-[12px] text-white/70">Muestra qué bonita y fresca te quedó la canasta. El cliente recibirá esta foto.</p>
      </div>
      <div className="mx-6 mt-8 flex flex-1 flex-col items-center justify-center rounded-[32px] border-4 border-dashed border-white/20 bg-white/5">
        {tomandoFoto ? (
          <div className="flex flex-col items-center gap-3"><div className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-[#F3793B]" /><p className="text-[12px] font-bold text-white/80">Guardando foto...</p></div>
        ) : (
          <><ImageIcon size={64} className="mb-4 text-white/30" /><p className="text-[14px] font-bold text-white/50">Toca para abrir tu cámara</p></>
        )}
      </div>
      <div className="p-6 pb-10">
        <button disabled={tomandoFoto} onClick={handleConfirm} className="flex w-full items-center justify-center gap-2 rounded-[20px] bg-[#F3793B] py-5 text-[14px] font-bold text-white shadow-lg active:scale-[0.98] disabled:opacity-70">
          <CheckCircle2 size={20}/> {tomandoFoto ? 'Enviando...' : 'Simular que tomé la foto'}
        </button>
      </div>
    </main>
  )
}

function CaseraEditarInventario({ inventario, setInventario, onBack }: { inventario: ItemVenta[], setInventario: (inv: ItemVenta[]) => void, onBack: () => void }) {
  const [nuevoEmoji, setNuevoEmoji] = useState('')
  const [nuevoNombre, setNuevoNombre] = useState('')

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoEmoji || !nuevoNombre) return;
    const newItem: ItemVenta = { id: Date.now().toString(), nombre: nuevoNombre, emoji: nuevoEmoji, disponible: true, precio: 10, unidad: 'Kilo' }
    setInventario([...inventario, newItem]);
    setNuevoEmoji(''); setNuevoNombre('');
  }
  const handleRemove = (id: string) => { setInventario(inventario.filter(item => item.id !== id)); }

  return (
    <main className="flex h-[100dvh] w-full flex-col bg-white">
      <header className="flex flex-col border-b border-[#f0f3eb] bg-white px-5 pb-4 pt-5">
        <div className="mb-4 flex items-center">
          <img src="/tampu-wordmark.jpeg" alt="TAMPU" className="h-[24px] w-auto object-contain" />
        </div>
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f4f7f2] text-[#55695d] active:scale-95"><ChevronLeft size={20}/></button>
          <div><h1 className="font-display text-[18px] font-extrabold text-[#3A4B40]">Editar mi Puesto</h1><p className="text-[11px] text-[#7a8a80]">Agrega o quita verduras de tu lista</p></div>
        </div>
      </header>
      
      <div className="flex-1 overflow-y-auto px-5 py-6">
        <form onSubmit={handleAdd} className="mb-8 rounded-[22px] border border-[#e4eadf] bg-[#f9fcf8] p-4 shadow-sm">
          <p className="mb-3 text-[11px] font-bold uppercase text-[#69796e]">Agregar nueva verdura</p>
          <div className="flex gap-2">
            <input type="text" placeholder="🥬" maxLength={2} value={nuevoEmoji} onChange={e => setNuevoEmoji(e.target.value)} className="w-14 rounded-[14px] border border-[#dce3d6] bg-white text-center text-[20px] outline-none focus:border-[#719B5C]" required />
            <input type="text" placeholder="Ej. Lechuga Crespa" value={nuevoNombre} onChange={e => setNuevoNombre(e.target.value)} className="flex-1 rounded-[14px] border border-[#dce3d6] bg-white px-3 text-[13px] font-bold text-[#3A4B40] outline-none focus:border-[#719B5C]" required />
          </div>
          <button type="submit" className="mt-3 flex w-full items-center justify-center gap-2 rounded-[12px] bg-[#719B5C] py-3 text-[12px] font-bold text-white active:scale-[0.98]">
            Agregar a la lista <PlusCircle size={16}/>
          </button>
        </form>

        <p className="mb-3 text-[11px] font-bold uppercase text-[#69796e]">Verduras en tu lista</p>
        <div className="flex flex-col gap-2">
          {inventario.map(item => (
            <div key={item.id} className="flex items-center justify-between rounded-[16px] border border-[#f0f3eb] p-3">
              <div className="flex items-center gap-3">
                <span className="text-[24px]">{item.emoji}</span>
                <span className="font-display text-[14px] font-extrabold text-[#3A4B40]">{item.nombre}</span>
              </div>
              <button onClick={() => handleRemove(item.id)} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ffeaeb] text-[#E46A60] active:scale-95"><Trash2 size={16}/></button>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

function EditPriceCaseraSheet({ item, onSave, onClose }: { item: ItemVenta, onSave: (item: ItemVenta) => void, onClose: () => void }) {
  const [precio, setPrecio] = useState(item.precio)
  const [unidad, setUnidad] = useState(item.unidad)
  const unidades = ['Kilo', 'Arroba', 'Cuartilla', 'Atado', 'Unidad', 'Libra']

  return (
    <>
      <div className="mb-4 flex items-center justify-between border-b border-[#f0f3eb] pb-3"><div className="flex items-center gap-2"><span className="text-2xl">{item.emoji}</span><h2 className="font-display text-[20px] font-extrabold text-[#3A4B40]">{item.nombre}</h2></div><button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f4f7f1] text-[#69796e]"><X size={20}/></button></div>
      <p className="mb-2 text-[12px] font-bold uppercase text-[#6e8074]">1. ¿Cómo lo vendes?</p>
      <div className="mb-6 flex flex-wrap gap-2">{unidades.map(u => (<button key={u} onClick={() => setUnidad(u)} className={`rounded-full px-4 py-2.5 text-[13px] font-bold transition-all ${unidad === u ? 'bg-[#F3793B] text-white shadow-md' : 'border border-[#e1e6de] bg-white text-[#56665c]'}`}>{u}</button>))}</div>
      <p className="mb-2 text-[12px] font-bold uppercase text-[#6e8074]">2. Precio por {unidad.toLowerCase()}</p>
      <div className="mb-8 flex items-center justify-between rounded-[24px] bg-[#f8faf7] p-3"><button onClick={() => setPrecio(Math.max(1, precio - 1))} className="flex h-16 w-16 items-center justify-center rounded-[18px] bg-white text-[#E46A60] shadow-sm active:scale-95"><Minus size={32} strokeWidth={3} /></button><div className="text-center"><span className="font-display text-[40px] font-extrabold text-[#3A4B40]">{precio}</span><span className="ml-1 text-[16px] font-bold text-[#8b9c91]">Bs</span></div><button onClick={() => setPrecio(precio + 1)} className="flex h-16 w-16 items-center justify-center rounded-[18px] bg-white text-[#719B5C] shadow-sm active:scale-95"><Plus size={32} strokeWidth={3} /></button></div>
      <button onClick={() => onSave({ ...item, precio, unidad })} className="flex w-full items-center justify-center gap-2 rounded-[18px] bg-[#3A4B40] py-4 text-[14px] font-bold text-white shadow-lg active:scale-[0.98]">Guardar precio <CheckCircle2 size={18} /></button>
    </>
  )
}

// --- APP ORIGINAL DEL CLIENTE ---
function CustomerDashboard({ onLogout }: { onLogout?: () => void }) {
  const [activeTab, setActiveTab] = useState<Tab>('inicio')
  const [casera, setCasera] = useState(caseras[0])
  const [yapa, setYapa] = useState<Producto | null>(null)
  const [basketType, setBasketType] = useState<Canasta['tipo']>('Familiar')
  const [swap, setSwap] = useState(false)
  const [modal, setModal] = useState<Modal>(null)
  const [rating, setRating] = useState(0)
  const basket = useMemo<Canasta>(() => ({ tipo: basketType, precioBase: basketType === 'Familiar' ? 140 : 80, logistica: 15, items: [...productos.filter((p) => !(swap && p.id === 'acelga')), ...(swap ? [{ id: 'brocoli', nombre: 'Brócoli', precio: 0, unidad: '1 unidad' }] : []), ...(yapa ? [yapa] : [])] }), [basketType, swap, yapa])
  const value = { casera, setCasera, yapa, setYapa, basket, setBasketType, swap, setSwap }
  
  return (
    <TampuContext.Provider value={value}>
      <main className="relative h-[100dvh] w-full overflow-hidden bg-[#FFFFFF] text-[#3A4B40]">
        <div className="relative h-full w-full overflow-hidden">
          <div className="scrollbar-hide absolute inset-0 overflow-y-auto pb-[76px]">
            {activeTab === 'inicio' && <HomeScreen goTracking={() => setActiveTab('ruta')} goBasket={() => setActiveTab('canasta')} onLogout={onLogout} />}
            {activeTab === 'canasta' && <BasketScreen openModal={setModal} />}
            {activeTab === 'ruta' && <TrackingScreen />}
            {activeTab === 'casera' && <CaseraScreen rating={rating} setRating={setRating} />}
          </div>
          <nav className="absolute inset-x-0 bottom-0 z-20 flex h-[70px] items-center justify-around border-t border-[#e9ede5] bg-[#fffefa]/95 px-2 pb-2 backdrop-blur-xl">
            <NavItem active={activeTab === 'inicio'} label="Inicio" icon={<Home size={19}/>} onClick={() => setActiveTab('inicio')} />
            <NavItem active={activeTab === 'canasta'} label="Canasta" icon={<ShoppingBasket size={19}/>} onClick={() => setActiveTab('canasta')} badge={yapa ? 1 : undefined} />
            <NavItem active={activeTab === 'ruta'} label="Ruta en vivo" icon={<Compass size={19}/>} onClick={() => setActiveTab('ruta')} />
            <NavItem active={activeTab === 'casera'} label="Casera" icon={<UserRound size={19}/>} onClick={() => setActiveTab('casera')} />
          </nav>
          {modal && <BottomSheet onClose={() => setModal(null)}>{modal === 'swap' ? <SwapSheet close={() => setModal(null)} /> : modal === 'yapa' ? <YapaSheet close={() => setModal(null)} /> : <PaymentSheet close={() => setModal(null)} afterPay={() => { setModal(null); setActiveTab('ruta') }} />}</BottomSheet>}
        </div>
      </main>
    </TampuContext.Provider>
  )
}

// --- COMPONENTES UI EXISTENTES ---
function NavItem({ active, label, icon, onClick, badge }: { active: boolean; label: string; icon: ReactNode; onClick: () => void; badge?: number }) { return <button onClick={onClick} className={`relative flex min-w-[68px] flex-col items-center gap-1 rounded-2xl px-2 py-2 transition-all duration-300 ${active ? 'text-[#719B5C]' : 'text-[#96a39a] hover:text-[#45665a]'}`}><span className="relative">{icon}{badge && <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#F3793B] px-1 text-[9px] font-bold text-white">{badge}</span>}</span><span className={`text-[9px] font-semibold ${active ? '' : 'font-medium'}`}>{label}</span>{active && <span className="absolute -bottom-1 h-0.5 w-5 rounded-full bg-[#719B5C]"/>}</button> }
function Header({ eyebrow, title, back }: { eyebrow: string; title: string; back?: ReactNode }) { return <header className="px-6 pb-5 pt-5">{back}<p className="mb-1 text-[10px] font-bold uppercase tracking-[.19em] text-[#719B5C]">{eyebrow}</p><h1 className="font-display text-[27px] font-extrabold leading-tight tracking-[-.05em] text-[#3A4B40]">{title}</h1></header> }
function HomeScreen({ goTracking, goBasket, onLogout }: { goTracking: () => void; goBasket: () => void; onLogout?: () => void }) { const { basket } = useTampu(); return <div className="pb-6"><div className="flex items-center justify-between px-6 pb-2 pt-3"><img src="/tampu-wordmark.jpeg" alt="TAMPU" onClick={onLogout} className="h-[54px] w-[94px] cursor-pointer object-contain object-left"/><button className="flex items-center gap-1 rounded-full bg-white px-3 py-2 text-[10px] font-bold text-[#3A4B40] shadow-sm"><MapPin size={12} className="text-[#719B5C]"/>Cochabamba<ChevronDown size={12}/></button></div><div className="px-5 pt-4"><div className="relative overflow-hidden rounded-[28px] bg-[#3A4B40] p-5 pb-4 text-white shadow-[0_16px_30px_-19px_#19533b]"><div className="absolute -right-12 -top-10 h-44 w-44 rounded-full border border-white/10"/><div className="absolute -right-1 top-9 h-28 w-28 rounded-full border border-white/10"/><div className="relative z-10 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[.19em] text-[#c2f2d3]"><span className="h-1.5 w-1.5 rounded-full bg-[#a9ef68]"/>Tu ritual de cada semana</div><div className="relative z-10 mt-3 flex items-start justify-between"><div><h1 className="font-display text-[26px] font-extrabold leading-[1.08] tracking-[-.055em]">Lo fresco<br/>llega a casa.</h1><p className="mt-2 text-[11px] leading-relaxed text-white/70">Del mercado de La Cancha,<br/>con cariño y en caja retornable.</p></div><div className="mt-2 flex h-[76px] w-[76px] items-center justify-center rounded-[26px] bg-[#e2f6ca] text-4xl shadow-lg">🥬</div></div><div className="relative z-10 mt-4 flex items-center justify-between border-t border-white/15 pt-3"><div className="flex items-center gap-2"><CalendarDays size={14} className="text-[#c7f48e]"/><div><p className="text-[10px] font-bold">Sábado · 08:30–11:30</p><p className="mt-0.5 text-[9px] text-white/60">Zona Norte · Cochabamba</p></div></div><button onClick={goTracking} className="flex h-8 items-center gap-1 rounded-full bg-[#d5f08a] px-3 text-[9px] font-bold text-[#20553d] transition-all duration-300 hover:bg-white">Ver ruta <ArrowRight size={12}/></button></div></div></div><div className="px-5 pt-4"><div className="mb-2 flex items-center justify-between px-0.5"><h2 className="font-display text-[14px] font-extrabold tracking-tight">Tu aliada del mercado</h2><button onClick={goBasket} className="text-[9px] font-bold text-[#719B5C]">Ver canasta <ArrowRight size={11} className="inline"/></button></div><CaseraCard compact /></div><div className="mx-5 mt-4 flex items-center gap-3 rounded-[22px] border border-[#e5ece1] bg-white px-4 py-3.5"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#e8f7e8] text-[#719B5C]"><Recycle size={20}/></div><div className="flex-1"><p className="text-[10px] font-bold text-[#263b32]">Pequeños cambios, gran impacto</p><p className="mt-0.5 text-[9px] text-[#89978e]">Con TAMPU ya evitamos</p></div><div className="text-right"><p className="font-display text-[19px] font-extrabold leading-none tracking-tight text-[#719B5C]">12.5 kg</p><p className="mt-1 text-[8px] text-[#89978e]">de plástico</p></div></div><div className="mx-5 mt-4 rounded-[22px] border border-[#e8ede6] bg-white p-4"><div className="flex items-center justify-between"><div><p className="text-[9px] font-bold uppercase tracking-[.13em] text-[#958363]">Tu próxima canasta</p><p className="mt-1 font-display text-[16px] font-extrabold">{basket.tipo} <span className="text-[11px] font-semibold text-[#829087]">· {money(basket.precioBase)}</span></p></div><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#8c7d50]"><ShoppingBasket size={17}/></div></div><button onClick={goTracking} className="mt-3 flex w-full items-center justify-center gap-2 rounded-[14px] bg-[#3A4B40] py-3 text-[11px] font-bold text-white shadow-sm transition-all duration-300 hover:bg-[#cf9219]"><Zap size={14} className="text-[#F3793B]" fill="currentColor"/>Simular entrega de hoy<ArrowUpRight size={14}/></button></div></div> }
function CaseraCard({ compact = false }: { compact?: boolean }) { const { casera } = useTampu(); return <div className={`flex items-center gap-3 rounded-[22px] border border-[#e8ede6] bg-white ${compact ? 'p-3' : 'p-4'}`}><img src={casera.fotoUrl} alt={casera.nombre} className={`${compact ? 'h-12 w-12' : 'h-[68px] w-[68px]'} rounded-[17px] object-cover`} /><div className="min-w-0 flex-1"><div className="flex items-center gap-1"><h3 className="truncate font-display text-[13px] font-extrabold">{casera.nombre}</h3><BadgeCheck size={13} className="shrink-0 fill-[#d8f5e5] text-[#719B5C]"/></div><p className="mt-0.5 truncate text-[9px] text-[#89978e]">{casera.puesto}</p><div className="mt-1.5 flex items-center gap-1 text-[9px] font-bold text-[#667a6e]"><Star size={11} className="fill-[#F3793B] text-[#F3793B]"/>{casera.rating}<span className="mx-0.5 text-[#c5cfc7]">·</span>{casera.especialidad}</div></div><ChevronRight size={16} className="text-[#aab6ac]"/></div> }
function BasketScreen({ openModal }: { openModal: (v: Modal) => void }) { const { basket, setBasketType, yapa, swap, setSwap, setYapa } = useTampu(); const [counts, setCounts] = useState<Record<string, number>>({}); const setCount = (id: string, n: number) => setCounts((old) => ({ ...old, [id]: Math.max(0, n) })); return <div className="flex min-h-full flex-col pb-4"><Header eyebrow="Del mercado a tu mesa" title="Arma tu canasta"/><div className="px-5"><div className="grid grid-cols-2 gap-2 rounded-[19px] bg-[#e9eee7] p-1.5">{(['Familiar', 'Dúo'] as const).map((type) => <button key={type} onClick={() => setBasketType(type)} className={`flex items-center justify-between rounded-[14px] px-3 py-2.5 text-left transition-all duration-300 ${basket.tipo === type ? 'bg-white shadow-sm' : 'text-[#89958b]'}`}><span className={`text-[11px] font-bold ${basket.tipo === type ? 'text-[#183b2f]' : ''}`}>{type}</span><span className={`text-[10px] font-bold ${basket.tipo === type ? 'text-[#719B5C]' : ''}`}>{type === 'Familiar' ? '140' : '80'} Bs</span></button>)}</div></div><div className="mx-5 mt-4 flex items-center justify-between"><div><h2 className="font-display text-[14px] font-extrabold">Esta semana incluye</h2><p className="mt-0.5 text-[9px] text-[#93a096]">Seleccionado fresco en La Cancha</p></div><span className="rounded-full bg-[#e8f6ec] px-2.5 py-1 text-[9px] font-bold text-[#719B5C]">{productos.length + (swap ? 1 : 0)} productos</span></div><div className="mx-5 mt-2 divide-y divide-[#edf0ea] rounded-[20px] border border-[#e8ede6] bg-white px-3">{productos.map((p) => { if (p.id === 'acelga' && swap) return null; return <div key={p.id} className="flex items-center gap-2 py-[9px]"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-[#f1f6ea] text-[19px]">{{papa:'🥔',tomate:'🍅',cebolla:'🧅',zanahoria:'🥕',acelga:'🥬',locoto:'🌶️'}[p.id]}</div><div className="min-w-0 flex-1"><p className="text-[10px] font-bold text-[#2d4438]">{p.nombre}</p><p className="text-[8px] text-[#a1aba1]">{p.unidad}</p></div>{p.id === 'acelga' ? <button onClick={() => openModal('swap')} className="rounded-full border border-[#d7e9dd] px-2.5 py-1.5 text-[8px] font-bold text-[#719B5C] transition-all duration-300 hover:bg-[#edfaf2]">Cambiar</button> : <div className="flex items-center gap-2"><button onClick={() => setCount(p.id, (counts[p.id] ?? 1) - 1)} className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f3f5f1] text-[#627469]"><Minus size={11}/></button><span className="w-3 text-center text-[9px] font-bold">{counts[p.id] ?? 1}</span><button onClick={() => setCount(p.id, (counts[p.id] ?? 1) + 1)} className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e9f6ec] text-[#719B5C]"><Plus size={11}/></button></div>}</div>})}{swap && <div className="flex items-center gap-2 py-[9px]"><div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#f1f6ea] text-[19px]">🥦</div><div className="flex-1"><p className="text-[10px] font-bold">Brócoli</p><p className="text-[8px] text-[#a1aba1]">1 unidad · en lugar de acelga</p></div><button onClick={() => setSwap(false)} className="text-[#a3ada4]"><X size={15}/></button></div>}</div><button onClick={() => openModal('yapa')} className="mx-5 mt-3 flex items-center gap-3 rounded-[19px] border border-[#f4d7c8] bg-[#fffaf7] p-3 text-left transition-all duration-300 hover:bg-[#fff0e8]"><div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#fff0e8] text-[#F3793B]"><Sparkles size={18}/></div><div className="min-w-0 flex-1"><p className="text-[10px] font-extrabold text-[#5b4a26]">Una yapa de {useTampu().casera.nombre}</p><p className="mt-0.5 text-[9px] text-[#9a8b69]">{yapa ? `${yapa.nombre} · gratis` : 'Un regalito fresco para ti'}</p></div>{yapa ? <span onClick={(e) => { e.stopPropagation(); setYapa(null) }} className="rounded-full bg-[#FCEAE8] px-2.5 py-1 text-[8px] font-bold text-[#E46A60]">+ YAPA</span> : <span className="rounded-full bg-[#3A4B40] px-2.5 py-1.5 text-[8px] font-bold text-white">ELEGIR</span>}</button><div className="mt-auto px-5 pt-4"><button onClick={() => openModal('pago')} className="flex w-full items-center justify-between rounded-[17px] bg-[#3A4B40] px-4 py-3.5 text-white shadow-[0_10px_20px_-12px_#3A4B40] transition-all duration-300 hover:bg-[#0d7952]"><span className="flex items-center gap-2 text-[11px] font-bold"><WalletCards size={16}/>Confirmar y ver pago QR</span><span className="flex items-center gap-1 text-[10px] font-bold">{money(basket.precioBase + basket.logistica)}<ArrowRight size={13}/></span></button><p className="mt-2 text-center text-[8px] text-[#a0aaa0]">Incluye logística y envase retornable · 15 Bs</p></div></div> }
function TrackingScreen() { const [step, setStep] = useState(2); const steps = [{ title: 'Selección en La Cancha', time: 'Hoy · 07:42', icon: <ShoppingBasket size={15}/> }, { title: 'Empaque retornable', time: 'Hoy · 08:05', icon: <PackageCheck size={15}/> }, { title: 'En camino', time: 'Hoy · 08:32', icon: <Bike size={15}/> }, { title: 'Entregado', time: 'Te avisaremos', icon: <Check size={15}/> }]; return <div className="pb-6"><Header eyebrow="Tu canasta está en camino" title="Ruta en vivo"/><div className="mx-5 overflow-hidden rounded-[24px] border border-[#e5eae3] bg-[#e9efdf] shadow-sm"><div className="relative h-[270px] overflow-hidden"><svg viewBox="0 0 360 270" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice"><rect width="360" height="270" fill="#e8eddf"/><path d="M-20 42L380 192M-10 218L340-18M25-10L118 300M296-20L228 300M-20 121L380 68" stroke="#fcfdf8" strokeWidth="16"/><path d="M-20 42L380 192M-10 218L340-18M25-10L118 300M296-20L228 300M-20 121L380 68" stroke="#d4dfcb" strokeWidth="1.4" strokeDasharray="5 4"/><path d="M-10 218L340-18" stroke="#f1c983" strokeWidth="3" strokeDasharray="8 6"/><path d="M77 202C107 172 117 147 158 142S218 133 246 83" fill="none" stroke="#719B5C" strokeWidth="4" strokeLinecap="round"/><path d="M77 202C107 172 117 147 158 142S218 133 246 83" fill="none" stroke="#dbfff0" strokeWidth="1.5" strokeLinecap="round"/><text x="175" y="93" fill="#74846d" fontSize="9" fontFamily="DM Sans" fontWeight="600" transform="rotate(-36 175 93)">AV. AMÉRICA</text><text x="186" y="196" fill="#74846d" fontSize="9" fontFamily="DM Sans" fontWeight="600" transform="rotate(20 186 196)">AV. CALA CALA</text><text x="18" y="83" fill="#86937e" fontSize="8" fontFamily="DM Sans">QUERU QUERU</text><text x="260" y="224" fill="#86937e" fontSize="8" fontFamily="DM Sans">CALA CALA</text></svg><div className="absolute left-[15%] top-[66%] flex h-8 w-8 items-center justify-center rounded-full border-[3px] border-white bg-[#F3793B] text-white shadow-lg"><MapPin size={15} fill="currentColor"/></div><div className="absolute left-[64%] top-[26%] flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-white bg-[#719B5C] text-white shadow-lg"><Bike size={17}/></div><div className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-[9px] font-bold text-[#719B5C] shadow-sm backdrop-blur"><span className="mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#719B5C]"/>EN VIVO</div><div className="absolute bottom-3 left-3 rounded-[14px] bg-white/95 px-3 py-2 shadow-sm backdrop-blur"><p className="text-[8px] font-bold uppercase tracking-wider text-[#96a091]">Llegada estimada</p><p className="mt-0.5 font-display text-[15px] font-extrabold">09:10 <span className="text-[9px] font-medium text-[#849087]">· 12 min</span></p></div><div className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-xl bg-white/95 text-[#568168] shadow-sm"><Compass size={16}/></div></div></div><div className="mx-5 mt-4 flex items-center justify-between"><h2 className="font-display text-[14px] font-extrabold">Tu pedido de hoy</h2><span className="rounded-full bg-[#e7f7ed] px-2.5 py-1 text-[8px] font-bold text-[#719B5C]">EN CAMINO</span></div><div className="mx-5 mt-3 rounded-[21px] border border-[#e8ede6] bg-white px-4 py-2">{steps.map((s, i) => <div key={s.title} className="flex gap-3"><div className="flex w-6 flex-col items-center"><div className={`z-10 mt-3 flex h-6 w-6 items-center justify-center rounded-full ${i < step ? 'bg-[#719B5C] text-white' : i === step ? 'bg-[#e1f6e9] text-[#719B5C] ring-2 ring-[#9ee2bf]' : 'bg-[#f1f3ee] text-[#abb4ab]'}`}>{i < step ? <Check size={12}/> : s.icon}</div>{i < 3 && <div className={`min-h-[18px] w-px flex-1 ${i < step ? 'bg-[#63c89d]' : 'bg-[#e8ece5]'}`}/>}</div><div className="flex flex-1 items-center justify-between py-[10px]"><p className={`text-[10px] font-bold ${i <= step ? 'text-[#284238]' : 'text-[#a1aaa1]'}`}>{s.title}</p><span className="text-[8px] text-[#a0aaa0]">{s.time}</span></div></div>)}</div><button onClick={() => setStep((v) => Math.min(3, v + 1))} className="mx-5 mt-3 flex w-[calc(100%-40px)] items-center justify-center gap-2 rounded-[14px] bg-[#e6f5e9] py-2.5 text-[9px] font-bold text-[#719B5C] transition-all duration-300 hover:bg-[#d5f1de]">Avanzar simulación <ArrowRight size={12}/></button><div className="mx-5 mt-4 flex gap-3 rounded-[19px] border border-[#f0dfb5] bg-[#fff8e7] p-3.5"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f5e7c4] text-[#af8326]"><Recycle size={18}/></div><div><p className="text-[10px] font-extrabold text-[#604c24]">¿Tienes lista tu caja anterior?</p><p className="mt-1 text-[9px] leading-relaxed text-[#968765]">Devuélvela limpia cuando llegue tu canasta. ¡Gracias por cerrar el ciclo! ♻</p></div></div></div> }
function CaseraScreen({ rating, setRating }: { rating: number; setRating: (n: number) => void }) { const { casera, setCasera } = useTampu(); const next = caseras.find((c) => c.id !== casera.id)!; const [changed, setChanged] = useState(false); return <div className="pb-6"><Header eyebrow="Personas que hacen comunidad" title="Tu casera"/><div className="mx-5 overflow-hidden rounded-[25px] border border-[#e7ece4] bg-white"><div className="relative h-[185px] overflow-hidden bg-[#dbe9d9]"><img src={casera.fotoUrl} alt={casera.nombre} className="h-full w-full object-cover object-center"/><div className="absolute inset-0 bg-gradient-to-t from-[#142920]/75 via-transparent to-transparent"/><div className="absolute bottom-4 left-4 text-white"><div className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-[.16em] text-[#d3f3d9]"><BadgeCheck size={12}/>Casera aliada TAMPU</div><h2 className="mt-1 font-display text-[24px] font-extrabold tracking-tight">{casera.nombre}</h2></div><div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1.5 text-[9px] font-bold text-[#4c5e52]"><Star size={12} className="fill-[#F3793B] text-[#F3793B]"/>{casera.rating}</div></div><div className="p-4"><div className="flex items-center gap-2 text-[10px] font-semibold text-[#66766c]"><MapPin size={13} className="text-[#719B5C]"/>{casera.puesto}</div><div className="mt-3 flex items-center gap-2 rounded-[14px] bg-[#f3f7ef] p-3"><div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-[#308462]"><Flower2 size={16}/></div><div><p className="text-[8px] text-[#98a296]">Su especialidad</p><p className="mt-0.5 text-[10px] font-bold text-[#3d5245]">{casera.especialidad}</p></div></div><div className="mt-4 border-t border-[#eef0ea] pt-3"><p className="text-center text-[10px] font-bold">¿Cómo fue tu última canasta?</p><div className="mt-2 flex justify-center gap-2">{[1,2,3,4,5].map((n) => <button key={n} onClick={() => setRating(n)} className={`transition-all duration-300 ${n <= rating ? 'scale-110 text-[#F3793B]' : 'text-[#d6ddd4]'}`}><Star size={24} fill={n <= rating ? 'currentColor' : 'none'}/></button>)}</div>{rating > 0 && <p className="mt-1 text-center text-[8px] font-semibold text-[#719B5C]">¡Gracias por valorar a {casera.nombre}!</p>}</div></div></div><div className="mx-5 mt-4 rounded-[20px] bg-[#e9f5e9] p-4"><div className="flex items-center gap-2"><Heart size={15} className="fill-[#48b67e] text-[#48b67e]"/><p className="text-[10px] font-extrabold">Detrás de cada canasta</p></div><p className="mt-2 text-[9px] leading-relaxed text-[#718379]">Está el trabajo de una mujer cochabambina que conoce cada producto y elige lo mejor para tu familia. ¡Gracias por elegir local!</p></div><button onClick={() => { setCasera(next); setChanged(true); setRating(0) }} className="mx-5 mt-4 flex w-[calc(100%-40px)] items-center justify-between rounded-[16px] border border-[#dfe8df] bg-white px-4 py-3.5 text-left transition-all duration-300 hover:border-[#92d5ae]"><span className="flex items-center gap-2 text-[10px] font-bold text-[#375044]"><ArrowLeft size={14}/>Cambiar de casera</span><span className="flex items-center gap-1 text-[9px] font-semibold text-[#719B5C]">{changed ? '¡Actualizada!' : 'Conoce otra'} <ArrowRight size={12}/></span></button><div className="mx-5 mt-3 flex items-center gap-2 text-[8px] text-[#9aa69c]"><ShieldCheck size={13}/>Comunidad verificada · Mercado La Cancha</div></div> }
function BottomSheet({ children, onClose }: { children: ReactNode; onClose: () => void }) { return <div className="absolute inset-0 z-40 flex items-end justify-center"><button aria-label="Cerrar modal" onClick={onClose} className="absolute inset-0 bg-[#14251e]/45 backdrop-blur-[2px] transition-all duration-300"/><div className="relative max-h-[88%] w-full animate-[sheet_.32s_cubic-bezier(.2,.8,.2,1)] overflow-y-auto rounded-t-[30px] bg-[#fffefa] px-5 pb-7 pt-3 shadow-[0_-20px_60px_-30px_rgba(0,0,0,.38)]"><div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#dde2da]"/>{children}</div></div> }
function SheetHeading({ eyebrow, title, close }: { eyebrow: string; title: string; close: () => void }) { return <div className="mb-4 flex items-start justify-between"><div><p className="text-[9px] font-bold uppercase tracking-[.17em] text-[#719B5C]">{eyebrow}</p><h2 className="mt-1 font-display text-[20px] font-extrabold tracking-tight">{title}</h2></div><button onClick={close} className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f0f3ed] text-[#708075]"><X size={16}/></button></div> }
function SwapSheet({ close }: { close: () => void }) { const { setSwap, swap } = useTampu(); return <><SheetHeading eyebrow="Intercambio fresco" title="¿Qué prefieres en tu canasta?" close={close}/><p className="mb-3 text-[10px] text-[#829087]">Puedes cambiar tu acelga por otra verdura de temporada.</p><div className="flex items-center gap-2 rounded-[16px] border border-[#edf0e9] bg-white p-3"><span className="text-2xl">🥬</span><div className="flex-1"><p className="text-[10px] font-bold">Acelga</p><p className="text-[8px] text-[#9aa59c]">Incluida en tu canasta</p></div><ArrowRight size={14} className="text-[#a7b0a8]"/><span className="text-2xl">🥦</span><div><p className="text-[10px] font-bold">Brócoli</p><p className="text-[8px] text-[#9aa59c]">De temporada</p></div></div><button onClick={() => { setSwap(!swap); close() }} className="mt-4 flex w-full items-center justify-center gap-2 rounded-[15px] bg-[#3A4B40] py-3.5 text-[10px] font-bold text-white">{swap ? 'Volver a acelga' : 'Cambiar por brócoli'} <Check size={14}/></button></> }
function YapaSheet({ close }: { close: () => void }) { const { setYapa, yapa, casera } = useTampu(); const emojis: Record<string,string> = {hierbas:'🌿',quirquina:'🌶️',limones:'🍋'}; return <><SheetHeading eyebrow="Un regalo del mercado" title={`Elige la yapa de ${casera.nombre}`} close={close}/><p className="mb-4 text-[10px] text-[#829087]">Un detalle de temporada, sin costo adicional para ti ✨</p><div className="space-y-2">{yapas.map((p) => <button key={p.id} onClick={() => { setYapa(p); close() }} className={`flex w-full items-center gap-3 rounded-[17px] border p-3 text-left transition-all duration-300 ${yapa?.id === p.id ? 'border-[#e7bd5e] bg-[#fffaed]' : 'border-[#ebeee7] bg-white hover:border-[#e7bd5e]'}`}><div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#f8f2dd] text-[24px]">{emojis[p.id]}</div><div className="flex-1"><p className="text-[10px] font-extrabold">{p.nombre}</p><p className="mt-0.5 text-[9px] text-[#98a397]">{p.unidad}</p></div><span className="rounded-full bg-[#edf8ec] px-2.5 py-1 text-[8px] font-bold text-[#719B5C]">GRATIS</span>{yapa?.id === p.id && <CheckCircle2 size={16} className="text-[#719B5C]"/>}</button>)}</div><button onClick={close} className="mt-4 w-full rounded-[14px] bg-[#3A4B40] py-3 text-[10px] font-bold text-white shadow-sm">{yapa ? 'Listo, gracias ✨' : 'Elegir más tarde'}</button></> }
function PaymentSheet({ close, afterPay }: { close: () => void; afterPay: () => void }) { const { basket, yapa } = useTampu(); const [returnBox, setReturnBox] = useState(true); const [paying, setPaying] = useState(false); const [paid, setPaid] = useState(false); const start = () => { setPaying(true); window.setTimeout(() => { setPaying(false); setPaid(true) }, 1500) }; return <><SheetHeading eyebrow="Pago fácil y seguro" title={paid ? '¡Pago recibido!' : 'Paga con QR Simple'} close={paid ? afterPay : close}/>{paid ? <div className="py-4 text-center"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e3f7e9] text-[#719B5C]"><CheckCircle2 size={34}/></div><p className="mt-3 font-display text-[17px] font-extrabold">¡Tu canasta ya es nuestra prioridad!</p><p className="mt-1 text-[10px] leading-relaxed text-[#8b988e]">{basket.tipo} · {basket.items.length} productos<br/>Te avisaremos cuando salga de La Cancha.</p><button onClick={afterPay} className="mt-5 w-full rounded-[15px] bg-[#3A4B40] py-3.5 text-[10px] font-bold text-white">Ver mi entrega <ArrowRight size={13} className="ml-1 inline"/></button></div> : <><div className="rounded-[18px] bg-[#f4f6f0] p-3.5"><div className="flex justify-between py-1 text-[10px] text-[#6e7b71]"><span>Canasta {basket.tipo}</span><span className="font-bold text-[#30463a]">{money(basket.precioBase)}</span></div><div className="flex justify-between py-1 text-[10px] text-[#6e7b71]"><span>Logística y envase retornable</span><span className="font-bold text-[#30463a]">{money(basket.logistica)}</span></div>{yapa && <div className="flex justify-between py-1 text-[9px] text-[#719B5C]"><span>Yapa · {yapa.nombre}</span><span className="font-bold">Gratis</span></div>}<div className="mt-2 flex justify-between border-t border-[#e4e9e0] pt-2.5 text-[12px] font-extrabold"><span>Total a pagar</span><span className="text-[#719B5C]">{money(basket.precioBase + basket.logistica)}</span></div></div><div className="mx-auto my-4 w-fit rounded-[18px] border border-[#e9ece5] bg-white p-3 shadow-sm"><div className="grid h-[134px] w-[134px] grid-cols-13 grid-rows-13 gap-[2px]">{Array.from({length:169},(_,i) => { const x=i%13,y=Math.floor(i/13); const finder=(a:number,b:number) => (x>=a&&x<a+4&&y>=b&&y<b+4) ? (x===a||x===a+3||y===b||y===b+3||(x>=a+1&&x<=a+2&&y>=b+1&&y<=b+2)) : null; const f=finder(0,0) ?? finder(9,0) ?? finder(0,9); const dark=f===null ? ((i*37+x*y*11+x*7)%9<4) : f; return <span key={i} className={dark?'rounded-[1px] bg-[#16352a]':'bg-white'}/> })}</div><p className="mt-2 flex items-center justify-center gap-1 text-[8px] font-bold text-[#829087]"><Smartphone size={11}/>Escanea con tu banca móvil</p></div><button onClick={() => setReturnBox(!returnBox)} className="flex w-full items-center gap-2.5 rounded-[14px] border border-[#e9ece5] bg-white p-3 text-left"><span className={`flex h-5 w-5 items-center justify-center rounded-[6px] ${returnBox?'bg-[#719B5C] text-white':'border border-[#cbd4ca]'}`}>{returnBox&&<Check size={12}/>}</span><span className="flex-1 text-[9px] font-semibold text-[#52665a]">Devolveré la caja retornable limpia</span><Recycle size={15} className="text-[#719B5C]"/></button><button disabled={paying} onClick={start} className="mt-3 flex w-full items-center justify-center gap-2 rounded-[15px] bg-[#3A4B40] py-3.5 text-[10px] font-bold text-white transition-all duration-300 disabled:opacity-80">{paying?<><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"/>Procesando pago…</>:<><CheckCircle2 size={15}/>Simular pago exitoso</>}</button><p className="mt-2 text-center text-[8px] text-[#a1aaa1]"><ShieldCheck size={10} className="mr-1 inline"/>Demo de pago · Transacción segura</p></>}</> }