import React, { useEffect, useRef, useState } from 'react';
import CardSwap, { Card } from './CardSwap';
import './ProjectCarousel.css';

function Chevron({ previous = false }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true" style={previous ? { transform: 'rotate(180deg)' } : undefined}><path d="M4 12h16m-6-6 6 6-6 6" /></svg>;
}

function ExpandArrow() {
  return <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M5 19 19 5M6 5h13v13" /></svg>;
}

export default function ProjectCarousel({ projects, onOpen, dialogOpen }) {
  const deck = useRef(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const project = projects[index];
  const playing = !paused && !reduced && !dialogOpen;

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  const navigate = direction => {
    setPaused(true);
    deck.current?.[direction]();
  };

  return <div className="project-showcase"
    onPointerEnter={event => { if (event.pointerType !== 'touch') setHovered(true); }}
    onPointerLeave={() => setHovered(false)}>
    <div className="project-story">
      <div className="project-edition"><span>O NOSSO OLHAR</span><span>ARQUITETURA & INTERIORES</span></div>
      <div className="project-current" aria-live={playing ? 'off' : 'polite'} aria-atomic="true">
        <p className="project-category">{project.kind} <span>— {String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</span></p>
        <h3>{project.name}</h3>
        <p className="project-description">{project.description}</p>
      </div>
      <button className="project-open inline-link" type="button" onClick={() => onOpen(project)}>Ver projeto em detalhe <ExpandArrow /></button>
      <div className="project-controls" aria-label="Controles dos projetos">
        <button type="button" className="project-step" aria-label="Projeto anterior" onClick={() => navigate('prev')}><Chevron previous /></button>
        <div className="project-pagination" aria-hidden="true">{projects.map((item, i) => <span key={item.image} className={i === index ? 'is-current' : ''} />)}</div>
        <button type="button" className="project-step" aria-label="Próximo projeto" onClick={() => navigate('next')}><Chevron /></button>
        {!reduced && <button type="button" className="project-playback" aria-label={paused ? 'Reproduzir carrossel' : 'Pausar carrossel'} onClick={() => setPaused(value => !value)}>
          {paused ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" aria-hidden="true"><path d="m5 3 7 5-7 5Z" /></svg> : <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" aria-hidden="true"><path d="M5 3v10M11 3v10" /></svg>}
        </button>}
      </div>
    </div>
    <div className="project-deck-frame">
      <CardSwap ref={deck} className="project-deck" width={620} height={440} cardDistance={42} verticalDistance={48}
        visibleCards={3} depth={55} skewAmount={-3} cardRadius={3} theme="light"
        delay={6000} speed={0.85} bounce={0.12} parallax={0.12} hoverSpread={0.04} dim={0.28}
        intro={false} autoplay={playing && !hovered} onChange={setIndex}
        onCardClick={cardIndex => onOpen(projects[cardIndex])}>
        {projects.map((item, i) => <Card key={item.image} className="project-card">
          <button type="button" className="project-image-button" aria-label={`Ampliar imagem: ${item.name}`}>
            <img src={`/assets/portfolio/${item.image}`} alt={item.name} loading={i < 3 ? 'eager' : 'lazy'} decoding="async" draggable={false} style={{ objectPosition: item.position }} />
            <span className="project-card-label"><span>STELA MARIS <small>{item.kind}</small></span><span>{String(i + 1).padStart(2, '0')} <ExpandArrow /></span></span>
          </button>
        </Card>)}
      </CardSwap>
      <p className="project-gesture"><span aria-hidden="true">↔</span> {reduced ? 'Explore os projetos pelas setas' : 'Arraste para descobrir. Clique para ampliar.'}</p>
    </div>
  </div>;
}
