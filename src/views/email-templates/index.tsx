import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import api, { mensagemErroApi } from '~api';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Container,
  FormGroup,
  HelpText,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
  Textarea,
} from '~components/ui';

const CODIGOS = ['acao_cadastrada', 'acao_aprovada', 'acao_reprovada'] as const;

type CodigoModelo = (typeof CODIGOS)[number];
type AcaoFicha = 'salvar' | 'previa' | 'restaurar';

type Modelo = {
  codigo: CodigoModelo;
  assunto: string;
  conteudo: Record<string, string>;
};

type Campo = {
  chave: string;
  rotulo: string;
  ajuda?: string;
  linhas?: number;
  linhaUnica?: boolean;
};

type Ficha = {
  codigo: CodigoModelo;
  titulo: string;
  marcadores: string;
  campos: Campo[];
};

type Previa = {
  assunto: string;
  html: string;
};

const AJUDA_PARAGRAFOS = 'Um parágrafo por linha.';
const AJUDA_HASHTAGS = 'Uma tag por linha.';
const AJUDA_URL = 'Comece com http:// ou https://.';

const url = (chave: string, rotulo: string): Campo => ({
  chave,
  rotulo,
  ajuda: AJUDA_URL,
  linhaUnica: true,
});

const RODAPE: Campo[] = [
  {
    chave: 'texto_assinatura',
    rotulo: 'Assinatura',
    ajuda: AJUDA_PARAGRAFOS,
    linhas: 3,
  },
  { chave: 'texto_instagram', rotulo: 'Texto do Instagram', linhas: 2 },
  url('url_instagram', 'Endereço do Instagram'),
  { chave: 'texto_site', rotulo: 'Texto do site', linhas: 2 },
  url('url_site', 'Endereço do site'),
  { chave: 'texto_duvida', rotulo: 'Texto de dúvida', linhas: 3 },
  { chave: 'texto_copyright', rotulo: 'Copyright', linhas: 2 },
];

const FICHAS: Ficha[] = [
  {
    codigo: 'acao_cadastrada',
    titulo: 'Cadastro da ação',
    marcadores: 'Marcadores permitidos no assunto: {ano} e {titulo_acao}.',
    campos: [
      {
        chave: 'paragrafos_abertura',
        rotulo: 'Parágrafos de abertura',
        ajuda: AJUDA_PARAGRAFOS,
        linhas: 5,
      },
      { chave: 'faixa', rotulo: 'Faixa', linhas: 3 },
      { chave: 'texto_antes_ficha', rotulo: 'Texto antes da ficha', linhas: 4 },
      { chave: 'texto_aviso_ficha', rotulo: 'Aviso da ficha', linhas: 3 },
      { chave: 'texto_responsabilidade', rotulo: 'Responsabilidade', linhas: 3 },
      { chave: 'paragrafo_cards', rotulo: 'Texto dos cards', linhas: 4 },
      { chave: 'chamada_pasta', rotulo: 'Chamada da pasta', linhas: 3 },
      { chave: 'rotulo_botao', rotulo: 'Rótulo do botão', linhaUnica: true },
      url('url_pasta', 'Endereço da pasta'),
      { chave: 'texto_depois_botao', rotulo: 'Texto depois do botão', linhas: 3 },
      { chave: 'convite_redes', rotulo: 'Convite às redes', linhas: 4 },
      { chave: 'chamada_tags', rotulo: 'Chamada das tags', linhas: 3 },
      {
        chave: 'hashtags',
        rotulo: 'Hashtags',
        ajuda: AJUDA_HASHTAGS,
        linhas: 5,
      },
      { chave: 'texto_programacao', rotulo: 'Programação', linhas: 3 },
      {
        chave: 'texto_despedida',
        rotulo: 'Despedida',
        ajuda: AJUDA_PARAGRAFOS,
        linhas: 4,
      },
      ...RODAPE,
    ],
  },
  {
    codigo: 'acao_aprovada',
    titulo: 'Ação aprovada',
    marcadores: 'Marcadores permitidos no assunto: {ano}.',
    campos: [
      { chave: 'faixa', rotulo: 'Faixa', linhas: 3 },
      { chave: 'paragrafo_cards', rotulo: 'Texto dos cards', linhas: 4 },
      { chave: 'chamada_pasta', rotulo: 'Chamada da pasta', linhas: 3 },
      { chave: 'rotulo_botao', rotulo: 'Rótulo do botão', linhaUnica: true },
      url('url_pasta', 'Endereço da pasta'),
      { chave: 'texto_depois_botao', rotulo: 'Texto depois do botão', linhas: 3 },
      { chave: 'paragrafo_redes', rotulo: 'Texto das redes', linhas: 4 },
      { chave: 'chamada_tags', rotulo: 'Chamada das tags', linhas: 3 },
      {
        chave: 'hashtags',
        rotulo: 'Hashtags',
        ajuda: AJUDA_HASHTAGS,
        linhas: 5,
      },
      { chave: 'texto_programacao', rotulo: 'Programação', linhas: 3 },
      { chave: 'texto_contato', rotulo: 'Contato', linhas: 3 },
      ...RODAPE,
    ],
  },
  {
    codigo: 'acao_reprovada',
    titulo: 'Ação reprovada',
    marcadores: 'Marcadores permitidos no assunto: {ano}.',
    campos: [
      { chave: 'faixa', rotulo: 'Faixa', linhas: 3 },
      { chave: 'corpo', rotulo: 'Corpo', linhas: 5 },
      {
        chave: 'texto_despedida',
        rotulo: 'Despedida',
        ajuda: AJUDA_PARAGRAFOS,
        linhas: 4,
      },
      ...RODAPE,
    ],
  },
];

const MENSAGEM_CARGA = 'Não foi possível carregar os e-mails.';
const MENSAGEM_SALVAR = 'Não foi possível salvar o e-mail.';
const MENSAGEM_PREVIA = 'Não foi possível abrir a prévia.';
const MENSAGEM_RESTAURAR = 'Não foi possível restaurar o e-mail.';

const ehCodigo = (valor: unknown): valor is CodigoModelo =>
  typeof valor === 'string' && (CODIGOS as readonly string[]).includes(valor);

const ehConteudo = (valor: unknown): valor is Record<string, string> => {
  if (!valor || typeof valor !== 'object' || Array.isArray(valor)) return false;

  return Object.values(valor).every((item) => typeof item === 'string');
};

const lerModelo = (valor: unknown): Modelo | null => {
  if (!valor || typeof valor !== 'object') return null;

  const item = valor as Partial<Modelo>;

  if (!ehCodigo(item.codigo) || typeof item.assunto !== 'string' || !ehConteudo(item.conteudo)) {
    return null;
  }

  return { codigo: item.codigo, assunto: item.assunto, conteudo: item.conteudo };
};

const lerLista = (data: unknown): Modelo[] | null => {
  if (!data || typeof data !== 'object' || !('templates' in data)) return null;

  const templates = (data as { templates: unknown }).templates;
  if (!Array.isArray(templates)) return null;

  const modelos = templates.map(lerModelo);
  if (modelos.some((modelo) => modelo === null)) return null;

  return modelos as Modelo[];
};

const lerPrevia = (data: unknown): Previa | null => {
  if (!data || typeof data !== 'object') return null;

  const previa = data as Partial<Previa>;
  if (typeof previa.assunto !== 'string' || typeof previa.html !== 'string') return null;

  return { assunto: previa.assunto, html: previa.html };
};

const conteudoDaFicha = (ficha: Ficha, modelo: Modelo) => {
  const conteudo: Record<string, string> = {};

  for (const campo of ficha.campos) {
    conteudo[campo.chave] = modelo.conteudo[campo.chave] ?? '';
  }

  return conteudo;
};

const aviso = (data: unknown, fallback: string) => mensagemErroApi(data) || fallback;

const corpoDoErro = (error: unknown) => (error instanceof AxiosError ? error.response?.data : null);

type FichaEmailProps = {
  ficha: Ficha;
  modelo: Modelo | undefined;
  ocupada: boolean;
  onAssunto: (valor: string) => void;
  onCampo: (chave: string, valor: string) => void;
  onSalvar: () => void;
  onPrevia: () => void;
  onPedirRestauracao: () => void;
};

const FichaEmail = ({
  ficha,
  modelo,
  ocupada,
  onAssunto,
  onCampo,
  onSalvar,
  onPrevia,
  onPedirRestauracao,
}: FichaEmailProps) => (
  <Card>
    <CardHeader>
      <CardTitle>{ficha.titulo}</CardTitle>
    </CardHeader>

    <CardBody>
      {modelo ? (
        <>
          <FormGroup>
            <Label htmlFor={`${ficha.codigo}-assunto`}>Assunto</Label>
            <HelpText>{ficha.marcadores}</HelpText>
            <Input
              id={`${ficha.codigo}-assunto`}
              value={modelo.assunto}
              onChange={(event) => onAssunto(event.target.value)}
            />
          </FormGroup>

          {ficha.campos.map((campo) => {
            const id = `${ficha.codigo}-${campo.chave}`;
            const valor = modelo.conteudo[campo.chave] ?? '';

            return (
              <FormGroup key={campo.chave}>
                <Label htmlFor={id}>{campo.rotulo}</Label>
                {campo.ajuda ? <HelpText>{campo.ajuda}</HelpText> : null}
                {campo.linhaUnica ? (
                  <Input
                    id={id}
                    value={valor}
                    onChange={(event) => onCampo(campo.chave, event.target.value)}
                  />
                ) : (
                  <Textarea
                    id={id}
                    rows={campo.linhas}
                    value={valor}
                    onChange={(event) => onCampo(campo.chave, event.target.value)}
                  />
                )}
              </FormGroup>
            );
          })}

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button onClick={onSalvar} disabled={ocupada} className="w-full sm:w-auto">
              Salvar
            </Button>
            <Button
              variant="outline"
              onClick={onPrevia}
              disabled={ocupada}
              className="w-full sm:w-auto"
            >
              Prévia
            </Button>
            <Button
              variant="neutral"
              onClick={onPedirRestauracao}
              disabled={ocupada}
              className="w-full sm:w-auto"
            >
              Restaurar texto original
            </Button>
          </div>
        </>
      ) : (
        <p className="text-sm text-brand-dark">Modelo de e-mail não encontrado.</p>
      )}
    </CardBody>
  </Card>
);

const EmailTemplatesContainer = () => {
  const [carregando, setCarregando] = useState(true);
  const [falhou, setFalhou] = useState(false);
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [emAndamento, setEmAndamento] = useState<Partial<Record<CodigoModelo, AcaoFicha>>>({});
  const [previa, setPrevia] = useState<Previa | null>(null);
  const [codigoRestaurar, setCodigoRestaurar] = useState<CodigoModelo | null>(null);

  useEffect(() => {
    let cancelado = false;

    api
      .get('/modelos-email', { silenciarErro: true })
      .then((res) => {
        if (cancelado) return;

        const lista = res.status === 200 ? lerLista(res.data) : null;

        if (!lista) {
          setFalhou(true);
          toast.error(aviso(res.data, MENSAGEM_CARGA));
          return;
        }

        setModelos(lista);
      })
      .catch((error: unknown) => {
        if (cancelado) return;

        setFalhou(true);
        toast.error(aviso(corpoDoErro(error), MENSAGEM_CARGA));
      })
      .finally(() => {
        if (!cancelado) setCarregando(false);
      });

    return () => {
      cancelado = true;
    };
  }, []);

  const substituir = (modelo: Modelo) => {
    setModelos((atual) => {
      const existe = atual.some((item) => item.codigo === modelo.codigo);

      if (!existe) return [...atual, modelo];

      return atual.map((item) => (item.codigo === modelo.codigo ? modelo : item));
    });
  };

  const ocupar = (codigo: CodigoModelo, acao: AcaoFicha) => {
    setEmAndamento((atual) => ({ ...atual, [codigo]: acao }));
  };

  const liberar = (codigo: CodigoModelo) => {
    setEmAndamento((atual) => {
      const seguinte = { ...atual };
      delete seguinte[codigo];
      return seguinte;
    });
  };

  const salvar = async (ficha: Ficha) => {
    const modelo = modelos.find((item) => item.codigo === ficha.codigo);
    if (!modelo || emAndamento[ficha.codigo]) return;

    ocupar(ficha.codigo, 'salvar');

    try {
      const res = await api.put(
        `/modelos-email/${ficha.codigo}`,
        {
          assunto: modelo.assunto,
          conteudo: conteudoDaFicha(ficha, modelo),
        },
        { silenciarErro: true }
      );
      const gravado = res.status === 200 ? lerModelo(res.data) : null;

      if (!gravado) {
        toast.error(aviso(res.data, MENSAGEM_SALVAR));
        return;
      }

      substituir(gravado);
      toast.success('E-mail salvo.');
    } catch (error: unknown) {
      toast.error(aviso(corpoDoErro(error), MENSAGEM_SALVAR));
    } finally {
      liberar(ficha.codigo);
    }
  };

  const abrirPrevia = async (codigo: CodigoModelo) => {
    if (emAndamento[codigo]) return;

    ocupar(codigo, 'previa');

    try {
      const res = await api.request({
        method: 'post',
        url: `/modelos-email/${codigo}/previa`,
        silenciarErro: true,
      });
      const corpo = res.status === 200 ? lerPrevia(res.data) : null;

      if (!corpo) {
        toast.error(aviso(res.data, MENSAGEM_PREVIA));
        return;
      }

      setPrevia(corpo);
    } catch (error: unknown) {
      toast.error(aviso(corpoDoErro(error), MENSAGEM_PREVIA));
    } finally {
      liberar(codigo);
    }
  };

  const restaurar = async () => {
    if (!codigoRestaurar || emAndamento[codigoRestaurar]) return;

    const codigo = codigoRestaurar;
    ocupar(codigo, 'restaurar');

    try {
      const res = await api.request({
        method: 'post',
        url: `/modelos-email/${codigo}/restaurar`,
        silenciarErro: true,
      });
      const gravado = res.status === 200 ? lerModelo(res.data) : null;

      if (!gravado) {
        toast.error(aviso(res.data, MENSAGEM_RESTAURAR));
        return;
      }

      substituir(gravado);
      setCodigoRestaurar(null);
      toast.success('Texto original restaurado.');
    } catch (error: unknown) {
      toast.error(aviso(corpoDoErro(error), MENSAGEM_RESTAURAR));
    } finally {
      liberar(codigo);
    }
  };

  const fichaRestaurar = FICHAS.find((ficha) => ficha.codigo === codigoRestaurar);

  return (
    <>
      <Modal isOpen={Boolean(previa)} toggle={() => setPrevia(null)} size="xl">
        <ModalHeader toggle={() => setPrevia(null)}>Prévia do e-mail</ModalHeader>
        <ModalBody>
          {previa ? (
            <>
              <p className="mb-4 text-sm text-brand-dark">
                <span className="font-semibold">Assunto: </span>
                {previa.assunto}
              </p>
              <iframe
                sandbox=""
                srcDoc={previa.html}
                title="Prévia do e-mail"
                className="h-[32rem] w-full rounded-lg border border-gray-200 bg-white"
              />
            </>
          ) : null}
        </ModalBody>
      </Modal>

      <Modal isOpen={Boolean(codigoRestaurar)} toggle={() => setCodigoRestaurar(null)} size="sm">
        <ModalHeader toggle={() => setCodigoRestaurar(null)}>Restaurar texto original</ModalHeader>
        <ModalBody>
          <p className="text-sm text-brand-dark">
            O assunto e o conteúdo de {fichaRestaurar?.titulo ?? 'esta mensagem'} voltam ao texto
            original.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="neutral"
            onClick={() => setCodigoRestaurar(null)}
            disabled={Boolean(codigoRestaurar && emAndamento[codigoRestaurar])}
          >
            Cancelar
          </Button>
          <Button
            onClick={restaurar}
            disabled={Boolean(codigoRestaurar && emAndamento[codigoRestaurar])}
          >
            Restaurar
          </Button>
        </ModalFooter>
      </Modal>

      <Container>
        <div className="mb-6">
          <h1 className="text-2xl font-black text-brand-forest">E-mails</h1>
          <p className="mt-1 text-sm text-gray-500">
            Textos enviados no cadastro, na aprovação e na reprovação de uma ação.
          </p>
        </div>

        {carregando ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" className="text-brand-forest" />
          </div>
        ) : falhou ? (
          <p className="text-sm text-brand-dark">{MENSAGEM_CARGA}</p>
        ) : (
          <div className="space-y-6">
            {FICHAS.map((ficha) => (
              <FichaEmail
                key={ficha.codigo}
                ficha={ficha}
                modelo={modelos.find((item) => item.codigo === ficha.codigo)}
                ocupada={Boolean(emAndamento[ficha.codigo])}
                onAssunto={(valor) =>
                  setModelos((atual) =>
                    atual.map((item) =>
                      item.codigo === ficha.codigo ? { ...item, assunto: valor } : item
                    )
                  )
                }
                onCampo={(chave, valor) =>
                  setModelos((atual) =>
                    atual.map((item) =>
                      item.codigo === ficha.codigo
                        ? { ...item, conteudo: { ...item.conteudo, [chave]: valor } }
                        : item
                    )
                  )
                }
                onSalvar={() => salvar(ficha)}
                onPrevia={() => abrirPrevia(ficha.codigo)}
                onPedirRestauracao={() => setCodigoRestaurar(ficha.codigo)}
              />
            ))}
          </div>
        )}
      </Container>
    </>
  );
};

export { EmailTemplatesContainer };
