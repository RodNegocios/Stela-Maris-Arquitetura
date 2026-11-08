import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import './editorial.css';
import './portrait-hero.css';

const ASSETS = '/assets/';
const WHATSAPP = 'https://wa.me/5565999527090';
const INSTAGRAM = 'https://www.instagram.com/stelamaris_arq/';
const MAPS = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Rua Santa Catarina, Centro, Campos de Júlio - MT, 78319-000');

const projects = [
  { name: 'Arquitetura contemporânea', kind: 'Arquitetura', image: 'fachada-contemporanea.png', cls: 'project-wide', position: 'center 58%' },
  { name: 'Interiores com personalidade', kind: 'Interiores', image: 'quarto-moderno.png', cls: 'project-tall', position: 'center center' },
  { name: 'Formas e proporções', kind: 'Arquitetura', image: 'fachada-moderna.png', cls: '', position: 'center center' },
  { name: 'Ambientes que acolhem', kind: 'Interiores', image: 'suite-clara.png', cls: '', position: 'center center' },
  { name: 'Expressão arquitetônica', kind: 'Arquitetura', image: 'residencia-contemporanea.png', cls: '', position: 'center center' },
  { name: 'Espaços com identidade', kind: 'Interiores', image: 'espaco-essence.png', cls: '', position: 'center center' },
];

const services = [
  { number: '01', title: 'Arquitetura', detail: 'Ideias transformadas em espaços com intenção, estética e identidade.' },
  { number: '02', title: 'Engenharia', detail: 'Soluções técnicas que dão estrutura e segurança a cada projeto.' },
  { number: '03', title: 'Desenvolvimento de projetos', detail: 'Planejamento e criação com atenção a cada detalhe.' },
];

function Arrow({ diagonal = false, size = 18 }) {
  return diagonal ? <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 19 19 5M7 5h12v12" /></svg>
    : <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h16m-7-7 7 7-7 7" /></svg>;
}
function InstagramIcon() { return <svg width="19" height="19" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.7" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>; }
function WhatsappIcon({ size = 20 }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.4 11.6a8.4 8.4 0 0 1-12.2 7.5L3 20.6l1.5-5a8.4 8.4 0 1 1 15.9-4z"/><path d="M8.3 8.1c-.4-.2-.8.1-1 1-.2 1 .5 2.4 1.8 3.8 1.4 1.5 3.4 2.4 4.7 2.3.7-.1 1.3-.7 1.5-1.3l-2.2-1.1-.9.9c-1.6-.6-2.7-1.6-3.2-3l.7-.8-1-2.4z"/></svg>; }

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [form, setForm] = useState({ name: '', service: '', message: '' });
  const lastFocus = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
      document.documentElement.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const items = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -40px 0px', threshold: 0.06 });
    items.forEach(item => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!activeProject) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = e => { if (e.key === 'Escape') setActiveProject(null); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); lastFocus.current?.focus?.(); };
  }, [activeProject]);

  const closeMenu = () => setMenuOpen(false);
  const openProject = (project) => { lastFocus.current = document.activeElement; setActiveProject(project); };
  const sendForm = (event) => {
    event.preventDefault();
    const text = `Olá! Gostaria de solicitar um orçamento com a Stela Maris.\n\nNome: ${form.name.trim()}\nInteresse: ${form.service}\nMensagem: ${form.message.trim()}`;
    window.open(`${WHATSAPP}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  return <>
    <div className="progress-line" style={{ transform: `scaleX(${scrollProgress / 100})` }} aria-hidden="true" />
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <header className="site-header">
      <a className="brand" href="#inicio" aria-label="Stela Maris — início" onClick={closeMenu}>
        <img src={`${ASSETS}identidade/logo-stela-maris.png`} alt="Stela Maris — Arquitetura & Engenharia" width="196" height="66" />
      </a>
      <nav className={`nav ${menuOpen ? 'nav-open' : ''}`} id="navigation" aria-label="Navegação principal">
        <a href="#projetos" onClick={closeMenu}>Projetos</a>
        <a href="#sobre" onClick={closeMenu}>Sobre</a>
        <a href="#servicos" onClick={closeMenu}>Serviços</a>
        <a href="#contato" onClick={closeMenu}>Contato</a>
        <a className="nav-mobile-cta" href={`${WHATSAPP}?text=${encodeURIComponent('Olá! Gostaria de conversar sobre um projeto.')}`} target="_blank" rel="noopener noreferrer" onClick={closeMenu}>Vamos conversar <Arrow diagonal size={16}/></a>
      </nav>
      <a className="header-cta" href={`${WHATSAPP}?text=${encodeURIComponent('Olá! Gostaria de conversar sobre um projeto.')}`} target="_blank" rel="noopener noreferrer">Comece seu projeto <Arrow diagonal size={16}/></a>
      <button className={`menu-toggle ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(v => !v)} type="button" aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} aria-controls="navigation" aria-expanded={menuOpen}><span/><span/></button>
    </header>

    <main id="conteudo">
      <section className="portrait-hero" id="inicio" aria-labelledby="hero-heading">
        <div className="wrap portrait-hero-grid">
          <div className="portrait-hero-copy">
            <p className="portrait-eyebrow"><span /> ARQUITETURA COM PROPÓSITO</p>
            <h1 className="hero-title" id="hero-heading">Seu jeito de viver.<br/>Nossa forma de <em>projetar.</em></h1>
            <p className="portrait-description">Entre o que você sonha e o espaço que você vive, existe um olhar atento a cada detalhe.</p>
            <div className="portrait-actions">
              <a className="portrait-cta" href="#contato">Vamos criar seu espaço <Arrow diagonal size={20}/></a>
              <a className="portrait-projects" href="#projetos">Conheça os projetos <span>↓</span></a>
            </div>
            <div className="portrait-note"><span className="note-line"/><p>Arquitetura, engenharia<br/><strong>e sensibilidade para transformar.</strong></p></div>
          </div>
          <figure className="portrait-composition">
            <div className="portrait-orbit" aria-hidden="true" />
            <div className="portrait-frame">
              <img className="hero-portrait" src={`${ASSETS}equipe/stela-maris.png`} alt="Stela Maris, arquiteta" width="1120" height="1404" fetchPriority="high" decoding="async" />
            </div>
            <div className="portrait-seal"><strong>12</strong><span>ANOS DE<br/>HISTÓRIAS E PROJETOS</span></div>
            <figcaption className="portrait-signature"><span>Stela <em>Maris</em></span><small>ARQUITETURA & ENGENHARIA</small></figcaption>
            <span className="portrait-location">CAMPOS DE JÚLIO · MATO GROSSO</span>
          </figure>
        </div>
        <div className="wrap portrait-hero-footer"><span>UM OLHAR HUMANO. INFINITAS POSSIBILIDADES.</span><a href="#sobre">Conheça nossa essência <Arrow diagonal size={16}/></a></div>
      </section>

      <section className="intro-section section-pad" id="sobre">
        <div className="wrap intro-grid">
          <div className="intro-caption reveal-on-scroll"><span className="section-kicker"><span className="gold-dot" /> DA ESSÊNCIA AO ESPAÇO</span><figure className="intro-portrait" aria-label="Projeto de interiores">
            <img className="intro-project-image" src={`${ASSETS}portfolio/suite-clara.png`} alt="Suíte em tons naturais, com cabeceira estofada e iluminação acolhedora" loading="lazy" width="1200" height="900" />
            <figcaption>O cuidado mora nos detalhes.<span>Interiores · Stela Maris</span></figcaption>
          </figure></div>
          <div className="intro-copy reveal-on-scroll"><h2>Espaços não são apenas lugares. <em>São histórias.</em></h2><p>Transformamos ideias e sonhos em projetos de arquitetura e engenharia. Criatividade, técnica e sensibilidade em cada detalhe.</p><a className="inline-link" href="#servicos">Conheça nossa atuação <Arrow diagonal size={18}/></a></div>
          <div className="years-stamp reveal-on-scroll"><strong>12</strong><span>ANOS TRANSFORMANDO<br/>IDEIAS EM PROJETOS</span></div>
        </div>
      </section>

      <section className="projects-section section-pad" id="projetos">
        <div className="wrap">
          <div className="section-heading reveal-on-scroll"><div><span className="section-kicker"><span className="gold-dot"/> 01 — PROJETOS SELECIONADOS</span><h2>Traços que <em>ganham vida.</em></h2></div><p>Uma seleção de espaços, perspectivas e detalhes que expressam nossa linguagem.</p></div>
          <div className="projects-grid">
            {projects.map((project, index) => <button key={project.image} type="button" className={`project-card reveal-on-scroll ${project.cls}`} onClick={() => openProject(project)} aria-label={`Ampliar imagem: ${project.name}`}>
              <img src={`${ASSETS}portfolio/${project.image}`} alt={project.name} loading={index < 2 ? 'eager' : 'lazy'} decoding="async" style={{ objectPosition: project.position }} />

              <span className="project-meta"><span><small>{project.kind} / 0{index + 1}</small><strong>{project.name}</strong></span><span className="project-arrow"><Arrow diagonal size={21}/></span></span>
            </button>)}
          </div>
          <div className="projects-footer reveal-on-scroll"><span>DETALHES QUE CONTAM HISTÓRIAS</span><a className="inline-link" href={INSTAGRAM} target="_blank" rel="noopener noreferrer">Mais inspirações no Instagram <Arrow diagonal size={18}/></a></div>
        </div>
      </section>

      <section className="statement-section" aria-label="Nossa filosofia">
        <div className="statement-photo" style={{ backgroundImage: "url(/assets/portfolio/sala-de-estar.png)" }} aria-hidden="true" />
        <div className="wrap statement-content reveal-on-scroll"><span className="section-kicker">UMA VISÃO. INFINITAS POSSIBILIDADES.</span><h2>A beleza está em <em>cada detalhe.</em></h2><p>Da primeira ideia ao projeto que faz sentido para você.</p></div>
      </section>

      <section className="services-section section-pad" id="servicos">
        <div className="wrap services-layout">
          <div className="services-lead reveal-on-scroll"><span className="section-kicker"><span className="gold-dot" /> 02 — NOSSA ATUAÇÃO</span><h2>Do conceito<br/>à <em>essência.</em></h2><p>Cada projeto começa com uma escuta atenta e evolui com propósito.</p><a className="text-button" href="#contato">Fale sobre sua ideia <Arrow diagonal size={18}/></a></div>
          <div className="services-list">{services.map(service => <div className="service-row reveal-on-scroll" key={service.number}><span className="service-num">{service.number}</span><div><h3>{service.title}</h3><p>{service.detail}</p></div><Arrow diagonal size={21}/></div>)}</div>
        </div>
      </section>

      <div className="chapter-bridge" aria-hidden="true"><div className="wrap"><span>DA PRIMEIRA CONVERSA</span><span className="bridge-line"/><span>AO SEU NOVO ESPAÇO</span><Arrow diagonal size={24}/></div></div>

      <section className="contact-section section-pad" id="contato">
        <div className="wrap contact-layout">
          <div className="contact-copy reveal-on-scroll"><span className="section-kicker"><span className="gold-dot"/> 03 — UM NOVO COMEÇO</span><h2>Seu próximo<br/>projeto começa <em>aqui.</em></h2><p>Conte-nos sua ideia. Será um prazer conhecer o que você imagina para o seu espaço.</p><a className="contact-whatsapp" href={`${WHATSAPP}?text=${encodeURIComponent('Olá! Gostaria de conversar sobre um projeto.')}`} target="_blank" rel="noopener noreferrer"><WhatsappIcon size={21}/> Conversar pelo WhatsApp <Arrow diagonal size={17}/></a></div>
          <form className="contact-form reveal-on-scroll" onSubmit={sendForm} aria-label="Solicitar orçamento via WhatsApp"><div className="form-top"><span>SOLICITAR ORÇAMENTO</span><span>01 — 03</span></div><label htmlFor="name">Como podemos chamar você?</label><input id="name" name="name" type="text" autoComplete="name" minLength="2" maxLength="100" required placeholder="Seu nome" value={form.name} onChange={e => setForm(v=>({...v, name:e.target.value}))}/><label htmlFor="service">Em que podemos ajudar?</label><select id="service" name="service" required value={form.service} onChange={e=>setForm(v=>({...v,service:e.target.value}))}><option value="">Selecione uma opção</option><option>Arquitetura</option><option>Engenharia</option><option>Desenvolvimento de projetos</option><option>Quero conversar sobre uma ideia</option></select><label htmlFor="message">Conte um pouco sobre sua ideia</label><textarea id="message" name="message" rows="3" minLength="5" maxLength="1200" required placeholder="Seu projeto começa com uma conversa..." value={form.message} onChange={e=>setForm(v=>({...v,message:e.target.value}))}/><button className="submit-button" type="submit">Enviar pelo WhatsApp <Arrow diagonal size={20}/></button><p className="form-note">Ao enviar, você será direcionado ao WhatsApp. Nenhum dado é armazenado neste site.</p></form>
        </div>
        <div className="wrap location-layout reveal-on-scroll"><div className="location-copy"><span className="section-kicker">ONDE ESTAMOS</span><h3>Campos de Júlio <em>— MT</em></h3><address>Rua Santa Catarina, Centro<br/>Campos de Júlio – MT · CEP 78319-000</address><a className="inline-link" href={MAPS} target="_blank" rel="noopener noreferrer">Como chegar <Arrow diagonal size={17}/></a><div className="hours"><strong>HORÁRIO DE ATENDIMENTO</strong><span>Segunda a sexta: 08h às 17h</span><span>Sábado: 08h às 11h30</span><span>Domingo: fechado</span></div></div><iframe title="Mapa de localização da Stela Maris em Campos de Júlio, Mato Grosso" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={`https://www.google.com/maps?q=${encodeURIComponent('Rua Santa Catarina, Centro, Campos de Júlio, MT, 78319-000')}&output=embed`} allowFullScreen /></div>
      </section>
    </main>

    <footer className="site-footer"><div className="wrap footer-top"><a className="footer-logo" href="#inicio" aria-label="Voltar ao início"><img src={`${ASSETS}identidade/logo-stela-maris.png`} alt="Stela Maris Arquitetura & Engenharia" width="228" height="77" loading="lazy" /></a><p>Projetamos sonhos,<br/><em>construímos realidades.</em></p><div className="footer-links"><a href="#projetos">Projetos</a><a href="#sobre">Sobre</a><a href="#servicos">Serviços</a><a href="#contato">Contato</a></div></div><div className="wrap footer-bottom"><span>© {new Date().getFullYear()} Stela Maris Arquitetura & Engenharia</span><span>Campos de Júlio · Mato Grosso</span><div><a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" aria-label="Instagram da Stela Maris"><InstagramIcon /></a><a href={WHATSAPP} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp da Stela Maris"><WhatsappIcon /></a></div></div></footer>
    <a className="floating-wa" href={`${WHATSAPP}?text=${encodeURIComponent('Olá! Gostaria de informações sobre um projeto.')}`} target="_blank" rel="noopener noreferrer" aria-label="Fale conosco no WhatsApp"><WhatsappIcon size={25}/></a>
    {activeProject && <div className="lightbox-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setActiveProject(null)}}><div className="lightbox" role="dialog" aria-modal="true" aria-labelledby="lightbox-title"><button type="button" className="lightbox-close" aria-label="Fechar imagem" onClick={()=>setActiveProject(null)}>×</button><img src={`${ASSETS}portfolio/${activeProject.image}`} alt={activeProject.name}/><div className="lightbox-caption"><small>{activeProject.kind}</small><h2 id="lightbox-title">{activeProject.name}</h2></div></div></div>}
  </>;
}

createRoot(document.getElementById('root')).render(<App />);
