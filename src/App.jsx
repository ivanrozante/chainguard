import { useState, useMemo } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie, Legend, LineChart, Line } from "recharts";

// ─── Realistic sample data ───
const fornecedores = [
  { id:1, cnpj:"12.345.678/0001-90", razao:"Metalúrgica São Paulo Ltda", fantasia:"MetalSP", uf:"SP", cnae:"2599-3/99", rating:28, volume:2200000, cnd:"Positiva", fgts:"Regular", cndt:"Negativa", protestos:3, processos:12, mediaHits:2, trend:-18, categoria:"Material" },
  { id:2, cnpj:"23.456.789/0001-01", razao:"TechServ Soluções em TI S.A.", fantasia:"TechServ", uf:"SP", cnae:"6201-5/00", rating:82, volume:890000, cnd:"Negativa", fgts:"Regular", cndt:"Negativa", protestos:0, processos:1, mediaHits:0, trend:3, categoria:"Tecnologia" },
  { id:3, cnpj:"34.567.890/0001-12", razao:"Transportadora Rodovel Ltda", fantasia:"Rodovel", uf:"MG", cnae:"4930-2/02", rating:45, volume:1750000, cnd:"Positiva c/ efeitos", fgts:"Irregular", cndt:"Positiva", protestos:5, processos:8, mediaHits:1, trend:-12, categoria:"Logística" },
  { id:4, cnpj:"45.678.901/0001-23", razao:"Papéis e Embalagens Norte S.A.", fantasia:"PapelNorte", uf:"PR", cnae:"1721-4/00", rating:71, volume:650000, cnd:"Negativa", fgts:"Regular", cndt:"Negativa", protestos:1, processos:2, mediaHits:0, trend:5, categoria:"Insumos" },
  { id:5, cnpj:"56.789.012/0001-34", razao:"Química Industrial Paulista Ltda", fantasia:"QuimPaul", uf:"SP", cnae:"2029-1/00", rating:35, volume:3100000, cnd:"Positiva", fgts:"Irregular", cndt:"Positiva", protestos:8, processos:15, mediaHits:3, trend:-25, categoria:"Químico" },
  { id:6, cnpj:"67.890.123/0001-45", razao:"Segurança Patrimonial Viper Ltda", fantasia:"Viper Seg", uf:"RJ", cnae:"8011-1/01", rating:52, volume:420000, cnd:"Negativa", fgts:"Regular", cndt:"Positiva", protestos:2, processos:22, mediaHits:0, trend:-8, categoria:"Serviços" },
  { id:7, cnpj:"78.901.234/0001-56", razao:"Auto Peças Ribeiro Eireli", fantasia:"Ribeiro Peças", uf:"SP", cnae:"4530-7/03", rating:88, volume:310000, cnd:"Negativa", fgts:"Regular", cndt:"Negativa", protestos:0, processos:0, mediaHits:0, trend:2, categoria:"Material" },
  { id:8, cnpj:"89.012.345/0001-67", razao:"Construtora Horizonte S.A.", fantasia:"Horizonte", uf:"MG", cnae:"4120-4/00", rating:19, volume:1400000, cnd:"Positiva", fgts:"Irregular", cndt:"Positiva", protestos:12, processos:34, mediaHits:5, trend:-30, categoria:"Construção" },
  { id:9, cnpj:"90.123.456/0001-78", razao:"Alimentos Naturale Ind. Com.", fantasia:"Naturale", uf:"SC", cnae:"1099-6/99", rating:76, volume:280000, cnd:"Negativa", fgts:"Regular", cndt:"Negativa", protestos:0, processos:1, mediaHits:0, trend:1, categoria:"Alimentação" },
  { id:10, cnpj:"01.234.567/0001-89", razao:"Elétrica Corrente Forte Ltda", fantasia:"Corrente Forte", uf:"SP", cnae:"2710-4/01", rating:63, volume:520000, cnd:"Negativa", fgts:"Regular", cndt:"Negativa", protestos:1, processos:3, mediaHits:0, trend:-2, categoria:"Material" },
  { id:11, cnpj:"11.222.333/0001-44", razao:"Limpeza Total Serviços Ltda", fantasia:"LimpTotal", uf:"SP", cnae:"8121-4/00", rating:41, volume:180000, cnd:"Positiva c/ efeitos", fgts:"Regular", cndt:"Positiva", protestos:4, processos:18, mediaHits:0, trend:-6, categoria:"Serviços" },
  { id:12, cnpj:"22.333.444/0001-55", razao:"Gráfica Impressão Digital ME", fantasia:"ImpDigital", uf:"SP", cnae:"1813-0/01", rating:90, volume:95000, cnd:"Negativa", fgts:"Regular", cndt:"Negativa", protestos:0, processos:0, mediaHits:0, trend:0, categoria:"Serviços" },
  { id:13, cnpj:"33.444.555/0001-66", razao:"Combustíveis Petrobom Ltda", fantasia:"Petrobom", uf:"GO", cnae:"4681-8/01", rating:58, volume:870000, cnd:"Negativa", fgts:"Regular", cndt:"Negativa", protestos:2, processos:4, mediaHits:1, trend:-4, categoria:"Combustível" },
  { id:14, cnpj:"44.555.666/0001-77", razao:"Ferramentaria Aço Nobre Ltda", fantasia:"Aço Nobre", uf:"RS", cnae:"2543-8/00", rating:74, volume:440000, cnd:"Negativa", fgts:"Regular", cndt:"Negativa", protestos:0, processos:2, mediaHits:0, trend:6, categoria:"Material" },
  { id:15, cnpj:"55.666.777/0001-88", razao:"Telecom Sul Cabeamento Eireli", fantasia:"TelecomSul", uf:"PR", cnae:"6141-8/00", rating:67, volume:350000, cnd:"Negativa", fgts:"Regular", cndt:"Negativa", protestos:1, processos:1, mediaHits:0, trend:0, categoria:"Tecnologia" },
  { id:16, cnpj:"66.777.888/0001-99", razao:"Consultoria Fiscal Aliança S/S", fantasia:"Aliança Fiscal", uf:"SP", cnae:"6920-6/01", rating:95, volume:220000, cnd:"Negativa", fgts:"Regular", cndt:"Negativa", protestos:0, processos:0, mediaHits:0, trend:1, categoria:"Serviços" },
  { id:17, cnpj:"77.888.999/0001-00", razao:"Madeireira Floresta Verde Ltda", fantasia:"Floresta Verde", uf:"PA", cnae:"1610-2/02", rating:33, volume:680000, cnd:"Positiva", fgts:"Irregular", cndt:"Positiva", protestos:6, processos:9, mediaHits:2, trend:-15, categoria:"Material" },
  { id:18, cnpj:"88.999.000/0001-11", razao:"Vidros Temperados Crystal S.A.", fantasia:"Crystal Vidros", uf:"SP", cnae:"2312-5/00", rating:79, volume:390000, cnd:"Negativa", fgts:"Regular", cndt:"Negativa", protestos:0, processos:1, mediaHits:0, trend:4, categoria:"Material" },
  { id:19, cnpj:"99.000.111/0001-22", razao:"Segurança Eletrônica Vigitec ME", fantasia:"Vigitec", uf:"SP", cnae:"8020-0/01", rating:85, volume:150000, cnd:"Negativa", fgts:"Regular", cndt:"Negativa", protestos:0, processos:0, mediaHits:0, trend:2, categoria:"Serviços" },
  { id:20, cnpj:"10.111.222/0001-33", razao:"Plásticos Reciclar Ind. Ltda", fantasia:"Reciclar", uf:"SP", cnae:"2229-3/01", rating:55, volume:270000, cnd:"Positiva c/ efeitos", fgts:"Regular", cndt:"Negativa", protestos:2, processos:5, mediaHits:0, trend:-3, categoria:"Insumos" },
];

const clientes = [
  { id:101, cnpj:"11.111.111/0001-01", razao:"Indústria Mecânica Bravus S.A.", fantasia:"Bravus", uf:"SP", cnae:"2811-9/00", rating:72, volume:1800000, cnd:"Negativa", fgts:"Regular", cndt:"Negativa", protestos:1, processos:3, mediaHits:0, trend:2, categoria:"Indústria" },
  { id:102, cnpj:"22.222.222/0001-02", razao:"Varejo Nacional Atacado Ltda", fantasia:"VN Atacado", uf:"MG", cnae:"4639-7/01", rating:38, volume:2400000, cnd:"Positiva", fgts:"Irregular", cndt:"Positiva", protestos:7, processos:11, mediaHits:2, trend:-20, categoria:"Varejo" },
  { id:103, cnpj:"33.333.333/0001-03", razao:"Hospital Vida Plena Ltda", fantasia:"Vida Plena", uf:"SP", cnae:"8610-1/01", rating:81, volume:950000, cnd:"Negativa", fgts:"Regular", cndt:"Negativa", protestos:0, processos:2, mediaHits:0, trend:1, categoria:"Saúde" },
  { id:104, cnpj:"44.444.444/0001-04", razao:"Construtora Edifique S.A.", fantasia:"Edifique", uf:"RJ", cnae:"4120-4/00", rating:25, volume:3200000, cnd:"Positiva", fgts:"Irregular", cndt:"Positiva", protestos:15, processos:28, mediaHits:4, trend:-22, categoria:"Construção" },
  { id:105, cnpj:"55.555.555/0001-05", razao:"Agronegócio Campos Dourados S.A.", fantasia:"CDourados", uf:"MT", cnae:"0111-3/01", rating:69, volume:1100000, cnd:"Negativa", fgts:"Regular", cndt:"Negativa", protestos:1, processos:4, mediaHits:0, trend:0, categoria:"Agro" },
  { id:106, cnpj:"66.666.666/0001-06", razao:"Frigorífico Boi Gordo Ltda", fantasia:"Boi Gordo", uf:"GO", cnae:"1011-2/01", rating:56, volume:780000, cnd:"Positiva c/ efeitos", fgts:"Regular", cndt:"Negativa", protestos:3, processos:6, mediaHits:1, trend:-5, categoria:"Alimentação" },
  { id:107, cnpj:"77.777.777/0001-07", razao:"Universidade Livre do Saber Ltda", fantasia:"UniSaber", uf:"SP", cnae:"8531-7/00", rating:87, volume:450000, cnd:"Negativa", fgts:"Regular", cndt:"Negativa", protestos:0, processos:1, mediaHits:0, trend:3, categoria:"Educação" },
  { id:108, cnpj:"88.888.888/0001-08", razao:"Incorporadora Skyline S.A.", fantasia:"Skyline", uf:"SP", cnae:"4110-7/00", rating:44, volume:2900000, cnd:"Positiva", fgts:"Regular", cndt:"Positiva", protestos:9, processos:19, mediaHits:3, trend:-14, categoria:"Construção" },
  { id:109, cnpj:"99.999.999/0001-09", razao:"Rede Farma Saúde Ltda", fantasia:"FarmaSaúde", uf:"MG", cnae:"4771-7/01", rating:78, volume:620000, cnd:"Negativa", fgts:"Regular", cndt:"Negativa", protestos:0, processos:2, mediaHits:0, trend:1, categoria:"Saúde" },
  { id:110, cnpj:"10.101.010/0001-10", razao:"Logística Express Cargas Ltda", fantasia:"ExpressLog", uf:"PR", cnae:"5211-7/01", rating:61, volume:540000, cnd:"Negativa", fgts:"Regular", cndt:"Negativa", protestos:2, processos:3, mediaHits:0, trend:-1, categoria:"Logística" },
  { id:111, cnpj:"20.202.020/0001-20", razao:"Mineração Serra Alta S.A.", fantasia:"Serra Alta", uf:"MG", cnae:"0710-3/01", rating:48, volume:1950000, cnd:"Positiva c/ efeitos", fgts:"Regular", cndt:"Positiva", protestos:4, processos:14, mediaHits:2, trend:-9, categoria:"Mineração" },
  { id:112, cnpj:"30.303.030/0001-30", razao:"Distribuidora Elétrica Watts ME", fantasia:"Watts", uf:"SP", cnae:"4742-3/00", rating:91, volume:280000, cnd:"Negativa", fgts:"Regular", cndt:"Negativa", protestos:0, processos:0, mediaHits:0, trend:0, categoria:"Varejo" },
  { id:113, cnpj:"40.404.040/0001-40", razao:"Têxtil Fio de Ouro Ind. Ltda", fantasia:"Fio de Ouro", uf:"SC", cnae:"1354-5/00", rating:66, volume:710000, cnd:"Negativa", fgts:"Regular", cndt:"Negativa", protestos:1, processos:3, mediaHits:0, trend:2, categoria:"Têxtil" },
  { id:114, cnpj:"50.505.050/0001-50", razao:"Siderúrgica Ferro Forte S.A.", fantasia:"Ferro Forte", uf:"ES", cnae:"2411-3/00", rating:42, volume:1600000, cnd:"Positiva", fgts:"Irregular", cndt:"Positiva", protestos:6, processos:10, mediaHits:1, trend:-11, categoria:"Indústria" },
  { id:115, cnpj:"60.606.060/0001-60", razao:"Concessionária AutoPrime Ltda", fantasia:"AutoPrime", uf:"SP", cnae:"4511-1/01", rating:75, volume:520000, cnd:"Negativa", fgts:"Regular", cndt:"Negativa", protestos:0, processos:2, mediaHits:0, trend:4, categoria:"Varejo" },
  { id:116, cnpj:"70.707.070/0001-70", razao:"Hotelaria Grand Park S.A.", fantasia:"Grand Park", uf:"BA", cnae:"5510-8/01", rating:53, volume:380000, cnd:"Positiva c/ efeitos", fgts:"Regular", cndt:"Negativa", protestos:3, processos:5, mediaHits:0, trend:-7, categoria:"Turismo" },
  { id:117, cnpj:"80.808.080/0001-80", razao:"Embalagens FlexPack Ind. Ltda", fantasia:"FlexPack", uf:"SP", cnae:"2222-6/00", rating:83, volume:340000, cnd:"Negativa", fgts:"Regular", cndt:"Negativa", protestos:0, processos:1, mediaHits:0, trend:2, categoria:"Insumos" },
  { id:118, cnpj:"90.909.090/0001-90", razao:"Cerâmica Pisos Premium Ltda", fantasia:"Pisos Premium", uf:"SP", cnae:"2342-7/02", rating:70, volume:290000, cnd:"Negativa", fgts:"Regular", cndt:"Negativa", protestos:1, processos:2, mediaHits:0, trend:0, categoria:"Material" },
  { id:119, cnpj:"12.121.212/0001-12", razao:"Cooperativa Agrícola Central", fantasia:"CoopCentral", uf:"PR", cnae:"0111-3/01", rating:77, volume:860000, cnd:"Negativa", fgts:"Regular", cndt:"Negativa", protestos:0, processos:1, mediaHits:0, trend:3, categoria:"Agro" },
  { id:120, cnpj:"13.131.313/0001-13", razao:"Gás Industrial Oxibrás Ltda", fantasia:"Oxibrás", uf:"SP", cnae:"2014-2/00", rating:64, volume:410000, cnd:"Negativa", fgts:"Regular", cndt:"Negativa", protestos:1, processos:3, mediaHits:0, trend:-2, categoria:"Químico" },
];

const alertas = [
  { id:1, data:"09/06/2026", tipo:"critico", msg:"Construtora Horizonte: rating caiu para 19. CND suspensa, 12 protestos, 5 notícias negativas. Exposição: R$ 1,4M/mês.", cnpj:"89.012.345/0001-67" },
  { id:2, data:"09/06/2026", tipo:"critico", msg:"Química Industrial Paulista: concentra 20% das compras com rating 35. Deterioração de -25 pts em 3 meses.", cnpj:"56.789.012/0001-34" },
  { id:3, data:"08/06/2026", tipo:"critico", msg:"Construtora Edifique (cliente): rating 25, R$ 3,2M em vendas. 15 protestos e 28 processos ativos.", cnpj:"44.444.444/0001-04" },
  { id:4, data:"08/06/2026", tipo:"alerta", msg:"Transportadora Rodovel: FGTS irregular detectado na rotina mensal. CRF não emitido.", cnpj:"34.567.890/0001-12" },
  { id:5, data:"07/06/2026", tipo:"alerta", msg:"VN Atacado (cliente): 7 novos protestos registrados no CENPROT. Rating caiu para 38.", cnpj:"22.222.222/0001-02" },
  { id:6, data:"07/06/2026", tipo:"info", msg:"Madeireira Floresta Verde: notícia sobre multa ambiental do IBAMA por desmatamento irregular.", cnpj:"77.888.999/0001-00" },
  { id:7, data:"06/06/2026", tipo:"alerta", msg:"Incorporadora Skyline (cliente): 3 notícias negativas sobre atraso em entregas de empreendimentos.", cnpj:"88.888.888/0001-08" },
  { id:8, data:"06/06/2026", tipo:"info", msg:"Siderúrgica Ferro Forte (cliente): CND federal mudou de negativa para positiva com efeitos.", cnpj:"50.505.050/0001-50" },
  { id:9, data:"05/06/2026", tipo:"info", msg:"Metalúrgica São Paulo: 2 novas ações trabalhistas registradas no TRT-2.", cnpj:"12.345.678/0001-90" },
  { id:10, data:"05/06/2026", tipo:"alerta", msg:"Mineração Serra Alta (cliente): processo ambiental de alto valor detectado via JUDIT.", cnpj:"20.202.020/0001-20" },
];

const mediaAdversa = [
  { id:1, data:"09/06/2026", razao:"Construtora Horizonte S.A.", categoria:"Trabalhista", severidade:"Crítica", titulo:"MPT move ação civil pública contra Horizonte por terceirização ilícita", fonte:"ConJur", resumo:"Ministério Público do Trabalho identificou 340 trabalhadores em condições análogas à terceirização ilícita em obra na BR-040." },
  { id:2, data:"09/06/2026", razao:"Química Industrial Paulista Ltda", categoria:"Ambiental", severidade:"Alta", titulo:"CETESB interdita unidade da QuimPaul por contaminação de solo", fonte:"Valor Econômico", resumo:"Agência ambiental detectou contaminação por solventes em área próxima a manancial em Guarulhos." },
  { id:3, data:"08/06/2026", razao:"Construtora Edifique S.A.", categoria:"Criminal", severidade:"Crítica", titulo:"PF cumpre mandados em investigação de desvio em obras públicas", fonte:"G1", resumo:"Operação apura desvio estimado de R$ 45 milhões em contratos com prefeituras do RJ." },
  { id:4, data:"08/06/2026", razao:"Construtora Edifique S.A.", categoria:"Reputacional", severidade:"Alta", titulo:"Edifique acumula 200 reclamações no Procon por atraso em entrega", fonte:"Folha de S.Paulo", resumo:"Compradores de três empreendimentos relatam atrasos de até 18 meses." },
  { id:5, data:"07/06/2026", razao:"Madeireira Floresta Verde Ltda", categoria:"Ambiental", severidade:"Alta", titulo:"IBAMA aplica multa de R$ 2,8M à Floresta Verde por desmatamento", fonte:"O Liberal", resumo:"Área de 120 hectares desmatada irregularmente em município do Pará." },
  { id:6, data:"07/06/2026", razao:"Incorporadora Skyline S.A.", categoria:"Reputacional", severidade:"Média", titulo:"Skyline enfrenta protesto de compradores em frente a empreendimento", fonte:"Estadão", resumo:"Manifestação reuniu cerca de 80 compradores pedindo conclusão de obras atrasadas." },
  { id:7, data:"06/06/2026", razao:"Metalúrgica São Paulo Ltda", categoria:"Fiscal", severidade:"Média", titulo:"MetalSP é autuada pela Receita por inconsistências em notas fiscais", fonte:"DCI", resumo:"Auto de infração de R$ 1,2M referente a operações de 2024." },
  { id:8, data:"06/06/2026", razao:"Varejo Nacional Atacado Ltda", categoria:"Trabalhista", severidade:"Alta", titulo:"TRT condena VN Atacado a pagar R$ 3,5M em ação coletiva", fonte:"Migalhas", resumo:"Decisão envolve horas extras não pagas a funcionários de 12 filiais em MG." },
];

const certHistory = [
  { mes:"Jan", total:40, validas:36, vencidas:4 },
  { mes:"Fev", total:40, validas:35, vencidas:5 },
  { mes:"Mar", total:40, validas:33, vencidas:7 },
  { mes:"Abr", total:40, validas:34, vencidas:6 },
  { mes:"Mai", total:40, validas:32, vencidas:8 },
  { mes:"Jun", total:40, validas:30, vencidas:10 },
];

// ─── Helpers ───
const fmt = (v) => new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0}).format(v);
const ratingColor = (r) => r >= 70 ? "#16a34a" : r >= 50 ? "#d97706" : "#dc2626";
const ratingBg = (r) => r >= 70 ? "#dcfce7" : r >= 50 ? "#fef3c7" : "#fee2e2";
const ratingLabel = (r) => r >= 70 ? "Baixo" : r >= 50 ? "Médio" : "Alto";
const alertIcon = (t) => t === "critico" ? "ti-alert-triangle" : t === "alerta" ? "ti-alert-circle" : "ti-info-circle";
const alertColor = (t) => t === "critico" ? "#dc2626" : t === "alerta" ? "#d97706" : "#3b82f6";

const Badge = ({children, color, bg}) => (
  <span style={{background:bg, color, padding:"2px 10px", borderRadius:12, fontSize:12, fontWeight:500, whiteSpace:"nowrap"}}>{children}</span>
);

const RatingBadge = ({rating}) => (
  <Badge color={ratingColor(rating)} bg={ratingBg(rating)}>{rating}/100</Badge>
);

// ─── Main App ───
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const allEntities = [...fornecedores.map(f=>({...f, tipo:"Fornecedor"})), ...clientes.map(c=>({...c, tipo:"Cliente"}))];
  const totalVolumeForn = fornecedores.reduce((s,f)=>s+f.volume,0);
  const totalVolumeCli = clientes.reduce((s,c)=>s+c.volume,0);
  const critForn = fornecedores.filter(f=>f.rating<50).length;
  const critCli = clientes.filter(c=>c.rating<50).length;

  const scatterData = allEntities.map(e => ({
    name: e.fantasia,
    x: ((e.volume / (e.tipo==="Fornecedor" ? totalVolumeForn : totalVolumeCli)) * 100),
    y: e.rating,
    z: e.volume,
    tipo: e.tipo,
    id: e.id
  }));

  const openDossie = (entity) => { setSelectedEntity(entity); setPage("dossie"); };

  const navItems = [
    { key:"dashboard", icon:"ti-layout-dashboard", label:"Painel" },
    { key:"fornecedores", icon:"ti-truck", label:"Fornecedores" },
    { key:"clientes", icon:"ti-users", label:"Clientes" },
    { key:"certidoes", icon:"ti-certificate", label:"Certidões" },
    { key:"media", icon:"ti-news", label:"Mídia adversa" },
    { key:"config", icon:"ti-settings", label:"Configurações" },
  ];

  return (
    <div style={{display:"flex", minHeight:"100vh", fontFamily:"var(--font-sans)", color:"var(--color-text-primary)", background:"var(--color-background-tertiary)"}}>
      {/* Sidebar */}
      <div style={{width: sidebarOpen ? 220 : 56, background:"#0f172a", color:"#e2e8f0", display:"flex", flexDirection:"column", transition:"width 0.2s", flexShrink:0, overflow:"hidden"}}>
        <div style={{padding:"16px 12px", display:"flex", alignItems:"center", gap:10, borderBottom:"1px solid #1e293b", minHeight:56}}>
          <div style={{width:32, height:32, borderRadius:8, background:"linear-gradient(135deg,#0ea5e9,#6366f1)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0}}>
            <i className="ti ti-shield-check" style={{fontSize:18, color:"#fff"}} aria-hidden="true"/>
          </div>
          {sidebarOpen && <div style={{overflow:"hidden"}}>
            <div style={{fontSize:14, fontWeight:500, lineHeight:1.2, whiteSpace:"nowrap"}}>ChainGuard</div>
            <div style={{fontSize:10, color:"#94a3b8", whiteSpace:"nowrap"}}>by RZ3 Tecnologia</div>
          </div>}
        </div>

        <nav style={{flex:1, padding:"8px 0"}}>
          {navItems.map(item => (
            <button key={item.key} onClick={()=>setPage(item.key)} style={{
              display:"flex", alignItems:"center", gap:10, width:"100%", padding:"10px 16px", border:"none",
              background: page===item.key ? "#1e293b" : "transparent", color: page===item.key ? "#fff" : "#94a3b8",
              cursor:"pointer", fontSize:13, textAlign:"left", borderLeft: page===item.key ? "3px solid #6366f1" : "3px solid transparent",
              transition:"all 0.15s"
            }}>
              <i className={`ti ${item.icon}`} style={{fontSize:18, flexShrink:0}} aria-hidden="true"/>
              {sidebarOpen && <span style={{whiteSpace:"nowrap"}}>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div style={{padding:"12px", borderTop:"1px solid #1e293b"}}>
          {sidebarOpen && <div style={{fontSize:11, color:"#64748b", marginBottom:4}}>Tenant ativo</div>}
          {sidebarOpen && <div style={{fontSize:12, fontWeight:500}}>RZ3 Tecnologia</div>}
          {sidebarOpen && <div style={{fontSize:10, color:"#64748b"}}>20 forn. · 20 cli. monitorados</div>}
          <button onClick={()=>setSidebarOpen(!sidebarOpen)} style={{background:"none",border:"none",color:"#64748b",cursor:"pointer",marginTop:8,fontSize:16}}>
            <i className={`ti ${sidebarOpen ? "ti-chevrons-left" : "ti-chevrons-right"}`} aria-hidden="true"/>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{flex:1, overflow:"auto", padding:"20px 24px", maxWidth:1200}}>
        {/* Header */}
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20}}>
          <div>
            <h1 style={{fontSize:20, fontWeight:500, margin:0}}>
              {page==="dashboard" && "Painel de compliance"}
              {page==="fornecedores" && "Fornecedores monitorados"}
              {page==="clientes" && "Clientes monitorados"}
              {page==="certidoes" && "Rotina de certidões"}
              {page==="media" && "Mídia adversa"}
              {page==="config" && "Configurações white-label"}
              {page==="dossie" && `Dossiê: ${selectedEntity?.fantasia || ""}`}
            </h1>
            <p style={{fontSize:13, color:"var(--color-text-secondary)", margin:"4px 0 0"}}>
              Última atualização: 09/06/2026 06:15 · Ciclo SPED: Maio/2026
            </p>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button style={{padding:"8px 14px", borderRadius:8, border:"1px solid var(--color-border-tertiary)", background:"var(--color-background-primary)", cursor:"pointer", fontSize:13, display:"flex", alignItems:"center", gap:6}}>
              <i className="ti ti-upload" style={{fontSize:16}} aria-hidden="true"/> Upload SPED
            </button>
            <button style={{padding:"8px 14px", borderRadius:8, border:"none", background:"#6366f1", color:"#fff", cursor:"pointer", fontSize:13, display:"flex", alignItems:"center", gap:6}}>
              <i className="ti ti-file-text" style={{fontSize:16}} aria-hidden="true"/> Gerar relatório
            </button>
          </div>
        </div>

        {/* ══════ DASHBOARD ══════ */}
        {page === "dashboard" && <>
          {/* KPIs */}
          <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20}}>
            {[
              {label:"CNPJs monitorados", value:"40", sub:"20 forn. + 20 cli.", icon:"ti-building", color:"#6366f1"},
              {label:"Rating médio", value: Math.round([...fornecedores,...clientes].reduce((s,e)=>s+e.rating,0)/40).toString(), sub:"Ponderado por volume", icon:"ti-chart-bar", color:"#0ea5e9"},
              {label:"Alertas críticos", value:(critForn+critCli).toString(), sub:`${critForn} forn. + ${critCli} cli.`, icon:"ti-alert-triangle", color:"#dc2626"},
              {label:"Certidões vencidas", value:"10", sub:"de 120 emitidas em junho", icon:"ti-certificate", color:"#d97706"},
            ].map((kpi,i) => (
              <div key={i} style={{background:"var(--color-background-primary)", borderRadius:12, padding:"16px 18px", border:"1px solid var(--color-border-tertiary)"}}>
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"start"}}>
                  <div>
                    <div style={{fontSize:12, color:"var(--color-text-secondary)", marginBottom:4}}>{kpi.label}</div>
                    <div style={{fontSize:28, fontWeight:500, lineHeight:1}}>{kpi.value}</div>
                    <div style={{fontSize:11, color:"var(--color-text-tertiary)", marginTop:4}}>{kpi.sub}</div>
                  </div>
                  <div style={{width:36, height:36, borderRadius:10, background:`${kpi.color}15`, display:"flex", alignItems:"center", justifyContent:"center"}}>
                    <i className={`ti ${kpi.icon}`} style={{fontSize:18, color:kpi.color}} aria-hidden="true"/>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Concentration scatter + Risk distribution */}
          <div style={{display:"grid", gridTemplateColumns:"2fr 1fr", gap:12, marginBottom:20}}>
            <div style={{background:"var(--color-background-primary)", borderRadius:12, padding:18, border:"1px solid var(--color-border-tertiary)"}}>
              <div style={{fontSize:14, fontWeight:500, marginBottom:4}}>Matriz de exposição: participação financeira × rating</div>
              <div style={{fontSize:11, color:"var(--color-text-secondary)", marginBottom:12}}>Tamanho = volume financeiro. Vermelho = risco alto, Verde = risco baixo</div>
              <ResponsiveContainer width="100%" height={280}>
                <ScatterChart margin={{top:10,right:20,bottom:10,left:10}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-tertiary)"/>
                  <XAxis dataKey="x" name="Participação" unit="%" tick={{fontSize:11}} label={{value:"Participação no volume (%)", position:"bottom", fontSize:11, offset:-5}}/>
                  <YAxis dataKey="y" name="Rating" domain={[0,100]} tick={{fontSize:11}} label={{value:"Rating", angle:-90, position:"insideLeft", fontSize:11}}/>
                  <Tooltip content={({payload})=>{
                    if(!payload?.[0]) return null;
                    const d = payload[0].payload;
                    return <div style={{background:"var(--color-background-primary)",border:"1px solid var(--color-border-tertiary)",borderRadius:8,padding:10,fontSize:12}}>
                      <div style={{fontWeight:500}}>{d.name} ({d.tipo})</div>
                      <div>Rating: {d.y}/100</div>
                      <div>Volume: {fmt(d.z)}</div>
                      <div>Participação: {d.x.toFixed(1)}%</div>
                    </div>;
                  }}/>
                  {/* Danger zone */}
                  <rect x="0" y="0" width="100%" height="50%" fill="#fee2e2" fillOpacity={0.15}/>
                  <Scatter data={scatterData} fill="#6366f1">
                    {scatterData.map((entry, i) => (
                      <Cell key={i} fill={ratingColor(entry.y)} fillOpacity={0.7} stroke={ratingColor(entry.y)} r={Math.max(5, Math.min(18, entry.z / 400000))}/>
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            <div style={{background:"var(--color-background-primary)", borderRadius:12, padding:18, border:"1px solid var(--color-border-tertiary)"}}>
              <div style={{fontSize:14, fontWeight:500, marginBottom:12}}>Distribuição de risco</div>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={[
                    {name:"Baixo (≥70)", value:allEntities.filter(e=>e.rating>=70).length, fill:"#16a34a"},
                    {name:"Médio (50-69)", value:allEntities.filter(e=>e.rating>=50&&e.rating<70).length, fill:"#d97706"},
                    {name:"Alto (<50)", value:allEntities.filter(e=>e.rating<50).length, fill:"#dc2626"},
                  ]} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value" label={({name,value})=>`${value}`}>
                  </Pie>
                  <Legend iconSize={10} wrapperStyle={{fontSize:11}}/>
                </PieChart>
              </ResponsiveContainer>
              <div style={{marginTop:8}}>
                <div style={{fontSize:12, color:"var(--color-text-secondary)"}}>Índice HHI fornecedores</div>
                <div style={{fontSize:20, fontWeight:500, color:"#d97706"}}>1.847 <span style={{fontSize:11, fontWeight:400}}>/ moderada concentração</span></div>
              </div>
            </div>
          </div>

          {/* Alerts */}
          <div style={{background:"var(--color-background-primary)", borderRadius:12, padding:18, border:"1px solid var(--color-border-tertiary)"}}>
            <div style={{fontSize:14, fontWeight:500, marginBottom:12}}>Alertas recentes</div>
            <div style={{display:"flex", flexDirection:"column", gap:8}}>
              {alertas.slice(0,6).map(a => (
                <div key={a.id} style={{display:"flex", gap:10, alignItems:"start", padding:"10px 12px", borderRadius:8, background:"var(--color-background-secondary)"}}>
                  <i className={`ti ${alertIcon(a.tipo)}`} style={{fontSize:18, color:alertColor(a.tipo), marginTop:1, flexShrink:0}} aria-hidden="true"/>
                  <div style={{flex:1, minWidth:0}}>
                    <div style={{fontSize:12}}>{a.msg}</div>
                    <div style={{fontSize:11, color:"var(--color-text-tertiary)", marginTop:2}}>{a.data}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>}

        {/* ══════ FORNECEDORES / CLIENTES ══════ */}
        {(page === "fornecedores" || page === "clientes") && (() => {
          const data = page === "fornecedores" ? fornecedores : clientes;
          const totalVol = data.reduce((s,e)=>s+e.volume,0);
          return <>
            <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:16}}>
              <div style={{background:"var(--color-background-primary)", borderRadius:10, padding:"12px 16px", border:"1px solid var(--color-border-tertiary)"}}>
                <div style={{fontSize:11, color:"var(--color-text-secondary)"}}>Total monitorados</div>
                <div style={{fontSize:22, fontWeight:500}}>{data.length}</div>
              </div>
              <div style={{background:"var(--color-background-primary)", borderRadius:10, padding:"12px 16px", border:"1px solid var(--color-border-tertiary)"}}>
                <div style={{fontSize:11, color:"var(--color-text-secondary)"}}>Volume financeiro 12m</div>
                <div style={{fontSize:22, fontWeight:500}}>{fmt(totalVol)}</div>
              </div>
              <div style={{background:"var(--color-background-primary)", borderRadius:10, padding:"12px 16px", border:"1px solid var(--color-border-tertiary)"}}>
                <div style={{fontSize:11, color:"var(--color-text-secondary)"}}>Em risco alto (&lt;50)</div>
                <div style={{fontSize:22, fontWeight:500, color:"#dc2626"}}>{data.filter(e=>e.rating<50).length}</div>
              </div>
            </div>

            <div style={{background:"var(--color-background-primary)", borderRadius:12, border:"1px solid var(--color-border-tertiary)", overflow:"hidden"}}>
              <table style={{width:"100%", borderCollapse:"collapse", fontSize:13}}>
                <thead>
                  <tr style={{borderBottom:"1px solid var(--color-border-tertiary)", background:"var(--color-background-secondary)"}}>
                    <th style={{textAlign:"left",padding:"10px 14px",fontWeight:500,fontSize:11,color:"var(--color-text-secondary)"}}>Empresa</th>
                    <th style={{textAlign:"center",padding:"10px 8px",fontWeight:500,fontSize:11,color:"var(--color-text-secondary)"}}>UF</th>
                    <th style={{textAlign:"center",padding:"10px 8px",fontWeight:500,fontSize:11,color:"var(--color-text-secondary)"}}>Rating</th>
                    <th style={{textAlign:"right",padding:"10px 8px",fontWeight:500,fontSize:11,color:"var(--color-text-secondary)"}}>Volume 12m</th>
                    <th style={{textAlign:"center",padding:"10px 8px",fontWeight:500,fontSize:11,color:"var(--color-text-secondary)"}}>Part. %</th>
                    <th style={{textAlign:"center",padding:"10px 8px",fontWeight:500,fontSize:11,color:"var(--color-text-secondary)"}}>CND</th>
                    <th style={{textAlign:"center",padding:"10px 8px",fontWeight:500,fontSize:11,color:"var(--color-text-secondary)"}}>FGTS</th>
                    <th style={{textAlign:"center",padding:"10px 8px",fontWeight:500,fontSize:11,color:"var(--color-text-secondary)"}}>Prot.</th>
                    <th style={{textAlign:"center",padding:"10px 8px",fontWeight:500,fontSize:11,color:"var(--color-text-secondary)"}}>Proc.</th>
                    <th style={{textAlign:"center",padding:"10px 8px",fontWeight:500,fontSize:11,color:"var(--color-text-secondary)"}}>Trend 3m</th>
                    <th style={{padding:"10px 8px"}}></th>
                  </tr>
                </thead>
                <tbody>
                  {data.sort((a,b)=>a.rating-b.rating).map((e,i) => (
                    <tr key={e.id} style={{borderBottom:"1px solid var(--color-border-tertiary)", background: e.rating<50 ? "#fef2f210" : "transparent"}}>
                      <td style={{padding:"10px 14px"}}>
                        <div style={{fontWeight:500, fontSize:13}}>{e.fantasia}</div>
                        <div style={{fontSize:11, color:"var(--color-text-tertiary)"}}>{e.cnpj}</div>
                      </td>
                      <td style={{textAlign:"center",padding:"10px 8px",fontSize:12}}>{e.uf}</td>
                      <td style={{textAlign:"center",padding:"10px 8px"}}><RatingBadge rating={e.rating}/></td>
                      <td style={{textAlign:"right",padding:"10px 8px",fontSize:12}}>{fmt(e.volume)}</td>
                      <td style={{textAlign:"center",padding:"10px 8px",fontSize:12}}>{((e.volume/totalVol)*100).toFixed(1)}%</td>
                      <td style={{textAlign:"center",padding:"10px 8px"}}>
                        <Badge color={e.cnd==="Negativa"?"#16a34a":"#dc2626"} bg={e.cnd==="Negativa"?"#dcfce7":"#fee2e2"}>
                          {e.cnd==="Negativa"?"OK":e.cnd==="Positiva"?"POS":"POS*"}
                        </Badge>
                      </td>
                      <td style={{textAlign:"center",padding:"10px 8px"}}>
                        <Badge color={e.fgts==="Regular"?"#16a34a":"#dc2626"} bg={e.fgts==="Regular"?"#dcfce7":"#fee2e2"}>
                          {e.fgts==="Regular"?"OK":"IRR"}
                        </Badge>
                      </td>
                      <td style={{textAlign:"center",padding:"10px 8px",fontSize:12, color:e.protestos>0?"#dc2626":"var(--color-text-secondary)"}}>{e.protestos}</td>
                      <td style={{textAlign:"center",padding:"10px 8px",fontSize:12, color:e.processos>5?"#dc2626":"var(--color-text-secondary)"}}>{e.processos}</td>
                      <td style={{textAlign:"center",padding:"10px 8px",fontSize:12}}>
                        <span style={{color: e.trend<-10?"#dc2626":e.trend<0?"#d97706":"#16a34a"}}>
                          {e.trend>0?"+":""}{e.trend}
                        </span>
                      </td>
                      <td style={{padding:"10px 8px"}}>
                        <button onClick={()=>openDossie(e)} style={{background:"none",border:"1px solid var(--color-border-tertiary)",borderRadius:6,padding:"4px 8px",cursor:"pointer",fontSize:11,color:"var(--color-text-secondary)"}}>
                          Dossiê
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>;
        })()}

        {/* ══════ CERTIDÕES ══════ */}
        {page === "certidoes" && <>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16}}>
            <div style={{background:"var(--color-background-primary)", borderRadius:12, padding:18, border:"1px solid var(--color-border-tertiary)"}}>
              <div style={{fontSize:14, fontWeight:500, marginBottom:12}}>Evolução mensal de certidões</div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={certHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-tertiary)"/>
                  <XAxis dataKey="mes" tick={{fontSize:11}}/>
                  <YAxis tick={{fontSize:11}}/>
                  <Bar dataKey="validas" stackId="a" fill="#16a34a" name="Válidas" radius={[0,0,0,0]}/>
                  <Bar dataKey="vencidas" stackId="a" fill="#dc2626" name="Vencidas/Positivas" radius={[4,4,0,0]}/>
                  <Legend wrapperStyle={{fontSize:11}}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{background:"var(--color-background-primary)", borderRadius:12, padding:18, border:"1px solid var(--color-border-tertiary)"}}>
              <div style={{fontSize:14, fontWeight:500, marginBottom:12}}>Próximos vencimentos</div>
              {[
                {cert:"CRF FGTS", qtd:8, dias:5},
                {cert:"CND Federal", qtd:4, dias:12},
                {cert:"CNDT Trabalhista", qtd:6, dias:18},
                {cert:"CND Municipal SP", qtd:3, dias:22},
              ].map((c,i)=>(
                <div key={i} style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:i<3?"1px solid var(--color-border-tertiary)":"none"}}>
                  <div>
                    <div style={{fontSize:13, fontWeight:500}}>{c.cert}</div>
                    <div style={{fontSize:11, color:"var(--color-text-secondary)"}}>{c.qtd} certidões</div>
                  </div>
                  <Badge color={c.dias<=7?"#dc2626":"#d97706"} bg={c.dias<=7?"#fee2e2":"#fef3c7"}>
                    {c.dias} dias
                  </Badge>
                </div>
              ))}
              <button style={{marginTop:12, width:"100%", padding:"10px", borderRadius:8, border:"1px solid #6366f1", background:"transparent", color:"#6366f1", cursor:"pointer", fontSize:13, fontWeight:500}}>
                <i className="ti ti-refresh" style={{marginRight:6}} aria-hidden="true"/>Executar rotina agora
              </button>
            </div>
          </div>

          <div style={{background:"var(--color-background-primary)", borderRadius:12, border:"1px solid var(--color-border-tertiary)", overflow:"hidden"}}>
            <div style={{padding:"14px 18px", borderBottom:"1px solid var(--color-border-tertiary)", fontSize:14, fontWeight:500}}>Status atual das certidões — Junho/2026</div>
            <table style={{width:"100%", borderCollapse:"collapse", fontSize:12}}>
              <thead>
                <tr style={{background:"var(--color-background-secondary)", borderBottom:"1px solid var(--color-border-tertiary)"}}>
                  <th style={{textAlign:"left",padding:"8px 14px",fontWeight:500,fontSize:11,color:"var(--color-text-secondary)"}}>Empresa</th>
                  <th style={{textAlign:"center",padding:"8px",fontWeight:500,fontSize:11,color:"var(--color-text-secondary)"}}>CND Federal</th>
                  <th style={{textAlign:"center",padding:"8px",fontWeight:500,fontSize:11,color:"var(--color-text-secondary)"}}>CRF FGTS</th>
                  <th style={{textAlign:"center",padding:"8px",fontWeight:500,fontSize:11,color:"var(--color-text-secondary)"}}>CNDT</th>
                  <th style={{textAlign:"center",padding:"8px",fontWeight:500,fontSize:11,color:"var(--color-text-secondary)"}}>IE Ativa</th>
                  <th style={{textAlign:"center",padding:"8px",fontWeight:500,fontSize:11,color:"var(--color-text-secondary)"}}>Mudança vs. maio</th>
                </tr>
              </thead>
              <tbody>
                {[...fornecedores].sort((a,b)=>a.rating-b.rating).slice(0,12).map((e,i)=>(
                  <tr key={e.id} style={{borderBottom:"1px solid var(--color-border-tertiary)"}}>
                    <td style={{padding:"8px 14px"}}><span style={{fontWeight:500}}>{e.fantasia}</span> <span style={{color:"var(--color-text-tertiary)"}}>{e.uf}</span></td>
                    <td style={{textAlign:"center",padding:"8px"}}>{e.cnd==="Negativa"?<span style={{color:"#16a34a"}}>✓ Negativa</span>:<span style={{color:"#dc2626"}}>✗ {e.cnd}</span>}</td>
                    <td style={{textAlign:"center",padding:"8px"}}>{e.fgts==="Regular"?<span style={{color:"#16a34a"}}>✓ Regular</span>:<span style={{color:"#dc2626"}}>✗ Irregular</span>}</td>
                    <td style={{textAlign:"center",padding:"8px"}}>{e.cndt==="Negativa"?<span style={{color:"#16a34a"}}>✓ Negativa</span>:<span style={{color:"#dc2626"}}>✗ Positiva</span>}</td>
                    <td style={{textAlign:"center",padding:"8px"}}><span style={{color:"#16a34a"}}>✓</span></td>
                    <td style={{textAlign:"center",padding:"8px"}}>{e.cnd!=="Negativa"?<span style={{color:"#dc2626",fontSize:11}}>⚠ Piorou</span>:<span style={{color:"var(--color-text-tertiary)",fontSize:11}}>Sem alteração</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>}

        {/* ══════ MÍDIA ADVERSA ══════ */}
        {page === "media" && <>
          <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:16}}>
            {[
              {label:"Hits negativos (30d)", value:"8", color:"#dc2626"},
              {label:"Empresas afetadas", value:"6", color:"#d97706"},
              {label:"Severidade crítica", value:"2", color:"#dc2626"},
              {label:"Última varredura", value:"09/06 06:15", color:"#6366f1"},
            ].map((k,i)=>(
              <div key={i} style={{background:"var(--color-background-primary)", borderRadius:10, padding:"12px 16px", border:"1px solid var(--color-border-tertiary)"}}>
                <div style={{fontSize:11, color:"var(--color-text-secondary)"}}>{k.label}</div>
                <div style={{fontSize:20, fontWeight:500, color:k.color}}>{k.value}</div>
              </div>
            ))}
          </div>

          <div style={{display:"flex", flexDirection:"column", gap:10}}>
            {mediaAdversa.map(m => (
              <div key={m.id} style={{background:"var(--color-background-primary)", borderRadius:12, padding:"16px 18px", border:"1px solid var(--color-border-tertiary)", borderLeft:`4px solid ${m.severidade==="Crítica"?"#dc2626":m.severidade==="Alta"?"#d97706":"#3b82f6"}`}}>
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"start", marginBottom:6}}>
                  <div style={{fontSize:14, fontWeight:500, flex:1}}>{m.titulo}</div>
                  <div style={{display:"flex", gap:6, flexShrink:0, marginLeft:12}}>
                    <Badge color={m.severidade==="Crítica"?"#dc2626":m.severidade==="Alta"?"#d97706":"#3b82f6"} bg={m.severidade==="Crítica"?"#fee2e2":m.severidade==="Alta"?"#fef3c7":"#dbeafe"}>
                      {m.severidade}
                    </Badge>
                    <Badge color="#6366f1" bg="#e0e7ff">{m.categoria}</Badge>
                  </div>
                </div>
                <div style={{fontSize:12, color:"var(--color-text-secondary)", marginBottom:6}}>{m.resumo}</div>
                <div style={{fontSize:11, color:"var(--color-text-tertiary)", display:"flex", gap:16}}>
                  <span><i className="ti ti-building" style={{fontSize:13, marginRight:4}} aria-hidden="true"/>{m.razao}</span>
                  <span><i className="ti ti-news" style={{fontSize:13, marginRight:4}} aria-hidden="true"/>{m.fonte}</span>
                  <span><i className="ti ti-calendar" style={{fontSize:13, marginRight:4}} aria-hidden="true"/>{m.data}</span>
                </div>
              </div>
            ))}
          </div>
        </>}

        {/* ══════ CONFIG WHITE-LABEL ══════ */}
        {page === "config" && <>
          <div style={{background:"var(--color-background-primary)", borderRadius:12, padding:24, border:"1px solid var(--color-border-tertiary)", maxWidth:600}}>
            <div style={{fontSize:16, fontWeight:500, marginBottom:16}}>Personalização white-label</div>
            <div style={{display:"flex", flexDirection:"column", gap:16}}>
              {[
                {label:"Nome da plataforma", value:"ChainGuard", note:"Exibido no sidebar e relatórios"},
                {label:"Subtítulo", value:"by RZ3 Tecnologia", note:"Exibido abaixo do nome"},
                {label:"Domínio personalizado", value:"compliance.rz3.com.br", note:"CNAME apontando para app.chainguard.io"},
                {label:"Email remetente de alertas", value:"compliance@rz3.com.br", note:"Configurado via SMTP ou SendGrid"},
                {label:"Cor primária", value:"#6366f1", note:"Sidebar, botões e acentos"},
              ].map((field,i) => (
                <div key={i}>
                  <label style={{fontSize:12, fontWeight:500, display:"block", marginBottom:4}}>{field.label}</label>
                  <input type="text" defaultValue={field.value} style={{
                    width:"100%", padding:"8px 12px", borderRadius:8, border:"1px solid var(--color-border-tertiary)",
                    background:"var(--color-background-secondary)", fontSize:13, color:"var(--color-text-primary)", boxSizing:"border-box"
                  }}/>
                  <div style={{fontSize:11, color:"var(--color-text-tertiary)", marginTop:2}}>{field.note}</div>
                </div>
              ))}
              <div>
                <label style={{fontSize:12, fontWeight:500, display:"block", marginBottom:4}}>Logo</label>
                <div style={{width:120, height:48, borderRadius:8, border:"2px dashed var(--color-border-secondary)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, color:"var(--color-text-tertiary)", cursor:"pointer"}}>
                  <i className="ti ti-upload" style={{marginRight:6}} aria-hidden="true"/>Upload SVG/PNG
                </div>
              </div>
              <div style={{borderTop:"1px solid var(--color-border-tertiary)", paddingTop:16}}>
                <div style={{fontSize:14, fontWeight:500, marginBottom:8}}>Modelo de acesso</div>
                <div style={{fontSize:12, color:"var(--color-text-secondary)", lineHeight:1.6}}>
                  Cada escritório/contabilidade contratante recebe seu próprio tenant isolado com branding personalizado.
                  Os clientes do escritório acessam um portal read-only com dossiês e relatórios.
                  O escritório gerencia múltiplos clientes finais dentro do seu tenant.
                </div>
                <div style={{display:"flex", gap:8, marginTop:12}}>
                  <div style={{flex:1, padding:12, borderRadius:8, border:"1px solid var(--color-border-tertiary)", textAlign:"center"}}>
                    <div style={{fontSize:20, fontWeight:500}}>1</div>
                    <div style={{fontSize:11, color:"var(--color-text-secondary)"}}>Plataforma SaaS</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center"}}><i className="ti ti-arrow-right" style={{color:"var(--color-text-tertiary)"}} aria-hidden="true"/></div>
                  <div style={{flex:1, padding:12, borderRadius:8, border:"1px solid var(--color-border-tertiary)", textAlign:"center"}}>
                    <div style={{fontSize:20, fontWeight:500}}>N</div>
                    <div style={{fontSize:11, color:"var(--color-text-secondary)"}}>Tenants (escritórios)</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center"}}><i className="ti ti-arrow-right" style={{color:"var(--color-text-tertiary)"}} aria-hidden="true"/></div>
                  <div style={{flex:1, padding:12, borderRadius:8, border:"1px solid var(--color-border-tertiary)", textAlign:"center"}}>
                    <div style={{fontSize:20, fontWeight:500}}>N×M</div>
                    <div style={{fontSize:11, color:"var(--color-text-secondary)"}}>Clientes finais</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>}

        {/* ══════ DOSSIÊ ══════ */}
        {page === "dossie" && selectedEntity && (() => {
          const e = selectedEntity;
          const totalVol = (e.tipo === "Fornecedor" ? totalVolumeForn : totalVolumeCli) || totalVolumeForn;
          return <>
            <button onClick={()=>setPage(e.tipo==="Fornecedor"?"fornecedores":"clientes")} style={{background:"none",border:"none",cursor:"pointer",fontSize:13,color:"#6366f1",padding:0,marginBottom:12,display:"flex",alignItems:"center",gap:4}}>
              <i className="ti ti-arrow-left" style={{fontSize:16}} aria-hidden="true"/> Voltar
            </button>

            {/* Header card */}
            <div style={{background:"var(--color-background-primary)", borderRadius:12, padding:20, border:"1px solid var(--color-border-tertiary)", marginBottom:16, display:"flex", justifyContent:"space-between", alignItems:"start"}}>
              <div>
                <div style={{fontSize:18, fontWeight:500}}>{e.razao}</div>
                <div style={{fontSize:13, color:"var(--color-text-secondary)", marginTop:2}}>{e.cnpj} · {e.uf} · CNAE {e.cnae}</div>
                <div style={{display:"flex", gap:8, marginTop:10}}>
                  <Badge color={ratingColor(e.rating)} bg={ratingBg(e.rating)}>Rating {e.rating}/100 — Risco {ratingLabel(e.rating)}</Badge>
                  <Badge color="#6366f1" bg="#e0e7ff">{e.tipo || "Fornecedor"}</Badge>
                  <Badge color="#6366f1" bg="#e0e7ff">{e.categoria}</Badge>
                </div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:11, color:"var(--color-text-secondary)"}}>Volume 12 meses</div>
                <div style={{fontSize:22, fontWeight:500}}>{fmt(e.volume)}</div>
                <div style={{fontSize:12, color:"var(--color-text-secondary)"}}>
                  {((e.volume/totalVol)*100).toFixed(1)}% do total · Trend: <span style={{color:e.trend<-10?"#dc2626":e.trend<0?"#d97706":"#16a34a"}}>{e.trend>0?"+":""}{e.trend} pts</span>
                </div>
              </div>
            </div>

            {/* Rating breakdown */}
            <div style={{display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:10, marginBottom:16}}>
              {[
                {dim:"Fiscal", score:e.cnd==="Negativa"?85:25, icon:"ti-receipt"},
                {dim:"Jurídico", score: Math.max(10, 100 - e.processos * 4), icon:"ti-gavel"},
                {dim:"Financeiro", score: Math.max(15, 100 - e.protestos * 10), icon:"ti-coin"},
                {dim:"Compliance", score: e.mediaHits > 2 ? 30 : e.mediaHits > 0 ? 60 : 90, icon:"ti-shield-check"},
                {dim:"Operacional", score: e.volume > 1000000 ? 70 : 85, icon:"ti-settings"},
                {dim:"Mídia", score: e.mediaHits > 2 ? 20 : e.mediaHits > 0 ? 55 : 95, icon:"ti-news"},
              ].map((d,i) => (
                <div key={i} style={{background:"var(--color-background-primary)", borderRadius:10, padding:"12px 14px", border:"1px solid var(--color-border-tertiary)", textAlign:"center"}}>
                  <i className={`ti ${d.icon}`} style={{fontSize:20, color:ratingColor(d.score), display:"block", marginBottom:4}} aria-hidden="true"/>
                  <div style={{fontSize:20, fontWeight:500, color:ratingColor(d.score)}}>{d.score}</div>
                  <div style={{fontSize:11, color:"var(--color-text-secondary)"}}>{d.dim}</div>
                </div>
              ))}
            </div>

            {/* Detail sections */}
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12}}>
              <div style={{background:"var(--color-background-primary)", borderRadius:12, padding:18, border:"1px solid var(--color-border-tertiary)"}}>
                <div style={{fontSize:14, fontWeight:500, marginBottom:12}}>Certidões vigentes</div>
                {[
                  {cert:"CND Federal / PGFN", status:e.cnd, validade:"12/12/2026"},
                  {cert:"CRF FGTS", status:e.fgts==="Regular"?"Regular":"Irregular", validade:"09/07/2026"},
                  {cert:"CNDT Trabalhista", status:e.cndt==="Negativa"?"Negativa":"Positiva", validade:"05/12/2026"},
                  {cert:"IE Sintegra", status:"Ativa", validade:"—"},
                ].map((c,i) => (
                  <div key={i} style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:i<3?"1px solid var(--color-border-tertiary)":"none"}}>
                    <span style={{fontSize:12}}>{c.cert}</span>
                    <div style={{display:"flex", gap:8, alignItems:"center"}}>
                      <span style={{fontSize:11, color:"var(--color-text-tertiary)"}}>{c.validade}</span>
                      <Badge color={c.status==="Negativa"||c.status==="Regular"||c.status==="Ativa"?"#16a34a":"#dc2626"} bg={c.status==="Negativa"||c.status==="Regular"||c.status==="Ativa"?"#dcfce7":"#fee2e2"}>
                        {c.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{background:"var(--color-background-primary)", borderRadius:12, padding:18, border:"1px solid var(--color-border-tertiary)"}}>
                <div style={{fontSize:14, fontWeight:500, marginBottom:12}}>Indicadores de risco</div>
                {[
                  {label:"Processos judiciais ativos", value:e.processos, danger:e.processos>5},
                  {label:"Protestos CENPROT", value:e.protestos, danger:e.protestos>2},
                  {label:"Notícias negativas (30d)", value:e.mediaHits, danger:e.mediaHits>1},
                  {label:"Tendência rating (3m)", value:`${e.trend>0?"+":""}${e.trend} pts`, danger:e.trend<-10},
                  {label:"Exposição financeira em risco", value:fmt(e.volume * (100 - e.rating) / 100), danger:e.rating<50 && e.volume>500000},
                ].map((r,i) => (
                  <div key={i} style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:i<4?"1px solid var(--color-border-tertiary)":"none"}}>
                    <span style={{fontSize:12}}>{r.label}</span>
                    <span style={{fontSize:13, fontWeight:500, color:r.danger?"#dc2626":"var(--color-text-primary)"}}>{r.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Media hits for this entity */}
            {e.mediaHits > 0 && <div style={{background:"var(--color-background-primary)", borderRadius:12, padding:18, border:"1px solid var(--color-border-tertiary)", marginTop:12}}>
              <div style={{fontSize:14, fontWeight:500, marginBottom:12}}>Últimas notícias detectadas</div>
              {mediaAdversa.filter(m=>m.razao===e.razao).slice(0,3).map(m=>(
                <div key={m.id} style={{padding:"10px 0", borderBottom:"1px solid var(--color-border-tertiary)"}}>
                  <div style={{display:"flex", justifyContent:"space-between"}}>
                    <span style={{fontSize:13, fontWeight:500}}>{m.titulo}</span>
                    <Badge color={m.severidade==="Crítica"?"#dc2626":"#d97706"} bg={m.severidade==="Crítica"?"#fee2e2":"#fef3c7"}>{m.severidade}</Badge>
                  </div>
                  <div style={{fontSize:12, color:"var(--color-text-secondary)", marginTop:4}}>{m.resumo}</div>
                  <div style={{fontSize:11, color:"var(--color-text-tertiary)", marginTop:2}}>{m.fonte} · {m.data}</div>
                </div>
              ))}
              {mediaAdversa.filter(m=>m.razao===e.razao).length === 0 && <div style={{fontSize:12, color:"var(--color-text-secondary)"}}>Nenhuma notícia encontrada nos últimos 30 dias para esta empresa especificamente — {e.mediaHits} hit(s) registrado(s) em períodos anteriores.</div>}
            </div>}
          </>;
        })()}
      </div>
    </div>
  );
}
