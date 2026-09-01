import { PropsWithChildren, useEffect, useRef, useState } from 'react';

export interface CollapseProps extends PropsWithChildren {
  isOpen: boolean;
}

/**
 * Substitui o Collapse do reactstrap. Anima a altura real do conteudo e depois
 * volta para `auto`, senao o bloco expandido corta quando a janela e
 * redimensionada.
 */
const Collapse = ({ isOpen, children }: CollapseProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | 'auto'>(isOpen ? 'auto' : 0);

  useEffect(() => {
    const element = contentRef.current;
    if (!element) return;

    if (!isOpen) {
      setHeight(element.scrollHeight);
      // Dois frames: o primeiro fixa a altura atual, o segundo dispara a
      // transicao ate zero.
      requestAnimationFrame(() => requestAnimationFrame(() => setHeight(0)));
      return;
    }

    setHeight(element.scrollHeight);
    const timer = setTimeout(() => setHeight('auto'), 300);

    return () => clearTimeout(timer);
  }, [isOpen]);

  return (
    <div
      style={{ height, overflow: height === 'auto' ? 'visible' : 'hidden' }}
      className="transition-[height] duration-300 ease-in-out"
      aria-hidden={!isOpen}
    >
      <div ref={contentRef}>{children}</div>
    </div>
  );
};

export { Collapse };
