import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "../styles/CarrosselProjetos.css";
import { assetPath } from "../utils/assetPath";

interface Projeto {
  titulo: string;
  imagem?: string;
  link: string;
  categoria?: string;
  contribuicoes?: string[];
}

interface CarrosselProjetosProps {
  projetos: Projeto[];
  cardWidth?: number;
  gap?: number;
  visibleCount?: number;
}

const CarrosselProjetos: React.FC<CarrosselProjetosProps> = ({
  projetos,
  cardWidth = 280,
  gap = 32,
  visibleCount = 3,
}) => {
  const total = projetos.length;
  if (total === 0) return null;

  const extended = [projetos[total - 1], ...projetos, projetos[0]];
  const [index, setIndex] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [projetoSelecionado, setProjetoSelecionado] = useState<Projeto | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const itemWidth = cardWidth + gap;

  const goToNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIndex((i) => i + 1);
  };

  const goToPrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIndex((i) => i - 1);
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    track.style.transition = "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)";
    track.style.transform = `translateX(${-index * itemWidth}px)`;

    const onTransitionEnd = () => {
      if (index === total + 1) {
        track.style.transition = "none";
        track.style.transform = `translateX(${-1 * itemWidth}px)`;
        requestAnimationFrame(() => {
          setIndex(1);
          setIsAnimating(false);
        });
      } else if (index === 0) {
        track.style.transition = "none";
        track.style.transform = `translateX(${-total * itemWidth}px)`;
        requestAnimationFrame(() => {
          setIndex(total);
          setIsAnimating(false);
        });
      } else {
        setIsAnimating(false);
      }
    };

    track.addEventListener("transitionend", onTransitionEnd);
    return () => track.removeEventListener("transitionend", onTransitionEnd);
  }, [index, total, itemWidth]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    requestAnimationFrame(() => {
      track.style.transition = "none";
      track.style.transform = `translateX(${-1 * itemWidth}px)`;
      requestAnimationFrame(() => {
        track.style.transition = "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)";
      });
    });
  }, [itemWidth]);

  useEffect(() => {
    projetos.forEach((projeto) => {
      if (projeto.imagem) {
        new Image().src = assetPath(projeto.imagem);
      }
    });
  }, [projetos]);

  useEffect(() => {
    if (!projetoSelecionado) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setProjetoSelecionado(null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [projetoSelecionado]);

  return (
    <div className="carrossel-area">
      <div className="carrossel-wrapper">
        <button
          className="carrossel-seta esquerda"
          onClick={goToPrev}
          disabled={isAnimating}
          aria-label="Anterior"
        >
          {"‹"}
        </button>

        <div
          className="carrossel-container"
          style={{
            width: `${visibleCount * cardWidth + (visibleCount - 1) * gap}px`,
            overflow: "hidden",
          }}
        >
          <div
            ref={trackRef}
            className="carrossel-track"
            style={{
              display: "flex",
              gap: `${gap}px`,
            }}
          >
            {extended.map((projeto, i) => (
              <article
                key={`${projeto.titulo}-${i}`}
                className="projeto-card"
                style={{ width: cardWidth, flexShrink: 0 }}
              >
                {projeto.contribuicoes?.length ? (
                  <button
                    type="button"
                    className="card-contribuicoes-botao"
                    aria-label={`Ver minhas contribuicoes em ${projeto.titulo}`}
                    onClick={() => setProjetoSelecionado(projeto)}
                  >
                    <span />
                    <span />
                    <span />
                  </button>
                ) : null}

                <a
                  href={projeto.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="projeto-card-link"
                  aria-label={`Abrir repositorio do projeto ${projeto.titulo}`}
                >
                  <div
                    className="card-imagem"
                    style={{
                      backgroundImage: projeto.imagem ? `url(${assetPath(projeto.imagem)})` : "none",
                      backgroundColor: projeto.imagem ? "transparent" : "#405D2D",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      height: "60%",
                    }}
                  />
                  <div className="card-info">
                    {projeto.categoria ? (
                      <span className="tech card-categoria">{projeto.categoria}</span>
                    ) : null}
                    <h2 className="tech card-titulo">{projeto.titulo}</h2>
                    <div className="card-linha" />
                  </div>
                </a>
              </article>
            ))}
          </div>
        </div>

        <button
          className="carrossel-seta direita"
          onClick={goToNext}
          disabled={isAnimating}
          aria-label="Proximo"
        >
          {"›"}
        </button>
      </div>

      {projetoSelecionado?.contribuicoes?.length ? createPortal(
        <div
          className="contribuicoes-modal-overlay"
          role="presentation"
          onClick={() => setProjetoSelecionado(null)}
        >
          <aside
            className="contribuicoes-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contribuicoes-modal-titulo"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="contribuicoes-modal-fechar"
              aria-label="Fechar contribuicoes"
              onClick={() => setProjetoSelecionado(null)}
            >
              ×
            </button>
            <p className="tech contribuicoes-etiqueta">Minhas contribuicoes</p>
            <h3 id="contribuicoes-modal-titulo" className="tech">
              {projetoSelecionado.titulo}
            </h3>
            <p className="contribuicoes-resumo">
              Atuei no Dev Team, com foco em front-end, identidade visual e organizacao da
              experiencia do usuario.
            </p>
            <ul>
              {projetoSelecionado.contribuicoes.map((contribuicao) => (
                <li key={contribuicao}>{contribuicao}</li>
              ))}
            </ul>
          </aside>
        </div>,
        document.body
      ) : null}
    </div>
  );
};

export default CarrosselProjetos;
