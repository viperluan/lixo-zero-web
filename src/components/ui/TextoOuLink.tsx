const ehLinkHttp = (valor: string) => valor.startsWith('http');

export interface TextoOuLinkProps {
  valor: string;
}

export function TextoOuLink({ valor }: TextoOuLinkProps) {
  if (!valor) return null;

  if (ehLinkHttp(valor)) {
    return (
      <a
        href={valor}
        target="_blank"
        rel="noopener noreferrer"
        className="break-all text-brand-forest underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-forest focus-visible:ring-offset-2"
      >
        {valor}
      </a>
    );
  }

  return <span className="break-words">{valor}</span>;
}
