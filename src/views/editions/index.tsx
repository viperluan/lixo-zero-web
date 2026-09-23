import { useEffect, useState, type FormEvent } from 'react';
import { toast } from 'react-toastify';
import { LoadingOverlay } from '~components/Loading';
import { useEdicao } from '~context/EdicaoContext';
import {
  ajustarEdicao,
  alterarInscricoes,
  buscarEdicao,
  criarEdicao,
  ERRO_FIM_CADASTRO_SO_PRORROGACAO,
  erroEdicao,
  excluirEdicao,
  listarEdicoes,
  prorrogarEdicao,
  tornarEdicaoVigente,
  type CorpoAjustarEdicao,
  type CorpoCriarEdicao,
  type Edicao,
  type EdicaoDetalhe,
  type Prorrogacao,
} from '~/lib/edicoes';
import {
  formatarDataCivil,
  mensagemDatasDoAno,
  parseDataCivil,
  pertenceAoAno,
  primeiroDiaDoAno,
  recortarDataDoAno,
  ultimoDiaDoAno,
} from '~/lib/periodoSlz';
import moment from '~/lib/moment';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Checkbox,
  Container,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from '~components/ui';

type ModalTipo = 'criar' | 'prorrogar' | 'ajustar' | 'inscricoes' | 'vigente' | 'excluir' | null;

const CAMPOS_DATA_CRIAR = [
  'data_inicio_cadastro',
  'data_fim_cadastro',
  'data_inicio_realizacao',
  'data_fim_realizacao',
] as const;

const anoEditavel = (ano: number) => Number.isInteger(ano) && ano >= 2000 && ano <= 2100;

const vazioCriar: CorpoCriarEdicao = {
  ano: new Date().getFullYear(),
  data_inicio_cadastro: '',
  data_fim_cadastro: '',
  data_inicio_realizacao: '',
  data_fim_realizacao: '',
  inscricoes_abertas: true,
  vigente: true,
};

const formatarQuando = (iso: string) => moment(iso).format('DD/MM/YYYY HH:mm');

const EditionsContainer = () => {
  const { recarregar } = useEdicao();
  const [isLoading, setIsLoading] = useState(false);
  const [edicoes, setEdicoes] = useState<Edicao[]>([]);
  const [detalhes, setDetalhes] = useState<Record<string, EdicaoDetalhe>>({});
  const [expandida, setExpandida] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalTipo>(null);
  const [alvo, setAlvo] = useState<Edicao | null>(null);
  const [criar, setCriar] = useState<CorpoCriarEdicao>(vazioCriar);
  const [novaDataFim, setNovaDataFim] = useState('');
  const [ajuste, setAjuste] = useState({
    data_inicio_cadastro: '',
    data_fim_cadastro: '',
    data_inicio_realizacao: '',
    data_fim_realizacao: '',
  });
  const [fimSoProrrogar, setFimSoProrrogar] = useState<Set<string>>(new Set());

  const vigente = edicoes.find((item) => item.vigente) ?? null;
  const anoCivilAtual = new Date().getFullYear();

  const fecharModal = () => {
    setModal(null);
    setAlvo(null);
    setNovaDataFim('');
  };

  const carregarLista = async () => {
    setIsLoading(true);

    const { data, status } = await listarEdicoes();

    if (status === 200) {
      setEdicoes(data.editions || []);
    } else {
      const erro = erroEdicao(data);
      if (erro) toast.error(erro);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    carregarLista();
  }, []);

  const abrirDetalhe = async (edicao: Edicao) => {
    const jaAberta = expandida === edicao.id;
    setExpandida(jaAberta ? null : edicao.id);

    if (jaAberta || detalhes[edicao.id]) return;

    const { data, status } = await buscarEdicao(edicao.id);

    if (status === 200) {
      setDetalhes((atual) => ({ ...atual, [edicao.id]: data }));
      return;
    }

    const erro = erroEdicao(data);
    if (erro) toast.error(erro);
  };

  const aposMutacao = async (edicaoAtualizada?: Edicao) => {
    await carregarLista();
    await recarregar();

    if (edicaoAtualizada) {
      setDetalhes((atual) => {
        const anterior = atual[edicaoAtualizada.id];

        return {
          ...atual,
          [edicaoAtualizada.id]: anterior
            ? { ...anterior, ...edicaoAtualizada }
            : { ...edicaoAtualizada, prorrogacoes: [] },
        };
      });
    }

    fecharModal();
  };

  const handleCriar = async (event: FormEvent) => {
    event.preventDefault();

    const ano = Number(criar.ano);

    if (!Number.isInteger(ano) || ano < 2000 || ano > 2100) {
      toast.error('Informe um ano entre 2000 e 2100.');
      return;
    }

    if (ano < anoCivilAtual) {
      toast.error('Não é possível cadastrar uma edição de um ano anterior.');
      return;
    }

    if (
      !criar.data_inicio_cadastro ||
      !criar.data_fim_cadastro ||
      !criar.data_inicio_realizacao ||
      !criar.data_fim_realizacao
    ) {
      toast.error('Preencha todas as datas da edição.');
      return;
    }

    if (CAMPOS_DATA_CRIAR.some((campo) => !pertenceAoAno(criar[campo], ano))) {
      toast.error(mensagemDatasDoAno(ano));
      return;
    }

    setIsLoading(true);

    const { data, status } = await criarEdicao({ ...criar, ano });

    if (status === 201) {
      toast.success(`Edição ${ano} cadastrada.`);
      setCriar(vazioCriar);
      await aposMutacao(data);
    } else {
      const erro = erroEdicao(data);
      toast.error(erro || 'Não foi possível criar a edição.');
    }

    setIsLoading(false);
  };

  const handleProrrogar = async (event: FormEvent) => {
    event.preventDefault();
    if (!alvo) return;

    if (!novaDataFim) {
      toast.error('Informe a nova data final do cadastro.');
      return;
    }

    if (!pertenceAoAno(novaDataFim, alvo.ano)) {
      toast.error(mensagemDatasDoAno(alvo.ano));
      return;
    }

    if (!parseDataCivil(novaDataFim).isAfter(parseDataCivil(alvo.data_fim_cadastro), 'day')) {
      toast.error('A nova data final do cadastro deve ser posterior à atual.');
      return;
    }

    setIsLoading(true);

    const { data, status } = await prorrogarEdicao(alvo.id, novaDataFim);

    if (status === 200) {
      toast.success('Prazo de cadastro prorrogado.');

      const detalhe = await buscarEdicao(alvo.id);

      if (detalhe.status === 200) {
        setDetalhes((atual) => ({ ...atual, [alvo.id]: detalhe.data }));
      }

      await aposMutacao(data);
    } else {
      const erro = erroEdicao(data);
      toast.error(erro || 'Não foi possível prorrogar o cadastro.');
    }

    setIsLoading(false);
  };

  const handleInscricoes = async () => {
    if (!alvo) return;

    setIsLoading(true);

    const proximo = !alvo.inscricoes_abertas;
    const { data, status } = await alterarInscricoes(alvo.id, proximo);

    if (status === 200) {
      toast.success(proximo ? 'Inscrições religadas.' : 'Inscrições desligadas.');
      await aposMutacao(data);
    } else {
      const erro = erroEdicao(data);
      toast.error(erro || 'Não foi possível alterar as inscrições.');
    }

    setIsLoading(false);
  };

  const handleVigente = async () => {
    if (!alvo) return;

    setIsLoading(true);

    const { data, status } = await tornarEdicaoVigente(alvo.id);

    if (status === 200) {
      toast.success(`Edição ${alvo.ano} agora é a vigente.`);
      await aposMutacao(data);
    } else {
      const erro = erroEdicao(data);
      toast.error(erro || 'Não foi possível tornar esta edição vigente.');
    }

    setIsLoading(false);
  };

  const handleAjustar = async (event: FormEvent) => {
    event.preventDefault();
    if (!alvo) return;

    const corpo: CorpoAjustarEdicao = {};
    const bloquearFim = fimSoProrrogar.has(alvo.id);

    if (ajuste.data_inicio_cadastro !== alvo.data_inicio_cadastro) {
      corpo.data_inicio_cadastro = ajuste.data_inicio_cadastro;
    }

    if (!bloquearFim && ajuste.data_fim_cadastro !== alvo.data_fim_cadastro) {
      corpo.data_fim_cadastro = ajuste.data_fim_cadastro;
    }

    if (ajuste.data_inicio_realizacao !== alvo.data_inicio_realizacao) {
      corpo.data_inicio_realizacao = ajuste.data_inicio_realizacao;
    }

    if (ajuste.data_fim_realizacao !== alvo.data_fim_realizacao) {
      corpo.data_fim_realizacao = ajuste.data_fim_realizacao;
    }

    if (Object.keys(corpo).length === 0) {
      toast.error('Informe ao menos uma data para ajustar.');
      return;
    }

    if (Object.values(corpo).some((data) => data && !pertenceAoAno(data, alvo.ano))) {
      toast.error(mensagemDatasDoAno(alvo.ano));
      return;
    }

    setIsLoading(true);

    const { data, status } = await ajustarEdicao(alvo.id, corpo);

    if (status === 200) {
      toast.success('Datas da edição atualizadas.');
      await aposMutacao(data);
    } else {
      const erro = erroEdicao(data);

      if (erro === ERRO_FIM_CADASTRO_SO_PRORROGACAO) {
        setFimSoProrrogar((atual) => new Set(atual).add(alvo.id));
        setAjuste((atual) => ({ ...atual, data_fim_cadastro: alvo.data_fim_cadastro }));
      }

      toast.error(erro || 'Não foi possível ajustar as datas.');
    }

    setIsLoading(false);
  };

  const podeTornarVigente = (edicao: Edicao) => !edicao.vigente && edicao.ano >= anoCivilAtual;

  const precisaCriarEdicaoAtual =
    !vigente && edicoes.length > 0 && !edicoes.some((item) => podeTornarVigente(item));

  const abrirProrrogar = (edicao: Edicao) => {
    setAlvo(edicao);
    setNovaDataFim('');
    setModal('prorrogar');
  };

  const abrirAjustar = (edicao: Edicao) => {
    setAlvo(edicao);
    setAjuste({
      data_inicio_cadastro: edicao.data_inicio_cadastro,
      data_fim_cadastro: edicao.data_fim_cadastro,
      data_inicio_realizacao: edicao.data_inicio_realizacao,
      data_fim_realizacao: edicao.data_fim_realizacao,
    });
    setModal('ajustar');
  };

  const abrirInscricoes = (edicao: Edicao) => {
    setAlvo(edicao);
    setModal('inscricoes');
  };

  const abrirVigente = (edicao: Edicao) => {
    setAlvo(edicao);
    setModal('vigente');
  };

  const abrirExcluir = (edicao: Edicao) => {
    setAlvo(edicao);
    setModal('excluir');
  };

  const handleExcluir = async () => {
    if (!alvo) return;

    setIsLoading(true);

    try {
      const { status, data } = await excluirEdicao(alvo.id);

      if (status === 200) {
        setEdicoes((atual) => atual.filter((item) => item.id !== alvo.id));
        setDetalhes((atual) => {
          const proximo = { ...atual };
          delete proximo[alvo.id];
          return proximo;
        });
        if (expandida === alvo.id) setExpandida(null);
        toast.success(`Edição ${alvo.ano} excluída.`);
        if (alvo.vigente) await recarregar();
        fecharModal();
        return;
      }

      const erro = erroEdicao(data);

      if (status === 404) {
        toast.error(erro || 'Edição não encontrada.');
        fecharModal();
        await carregarLista();
      } else if (status === 409) {
        toast.error(erro || 'Não é possível excluir uma edição vinculada a ações.');
        fecharModal();
      } else {
        toast.error(erro || 'Não foi possível excluir a edição.');
        fecharModal();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const anoCriar = anoEditavel(criar.ano) ? criar.ano : null;
  const minCriar = anoCriar ? primeiroDiaDoAno(anoCriar) : undefined;
  const maxCriar = anoCriar ? ultimoDiaDoAno(anoCriar) : undefined;
  const minAlvo = alvo ? primeiroDiaDoAno(alvo.ano) : undefined;
  const maxAlvo = alvo ? ultimoDiaDoAno(alvo.ano) : undefined;

  return (
    <>
      <LoadingOverlay isLoading={isLoading} />

      <Modal isOpen={modal === 'criar'} toggle={fecharModal} size="lg">
        <form onSubmit={handleCriar}>
          <ModalHeader toggle={fecharModal}>Nova edição</ModalHeader>

          <ModalBody className="grid gap-x-4 sm:grid-cols-2">
            <FormGroup>
              <Label htmlFor="ano-edicao" required>
                Ano
              </Label>
              <Input
                id="ano-edicao"
                type="number"
                min={anoCivilAtual}
                max={2100}
                value={criar.ano || ''}
                onChange={(event) => {
                  const ano = Number(event.target.value);

                  setCriar((atual) => {
                    if (!anoEditavel(ano)) return { ...atual, ano };

                    return {
                      ...atual,
                      ano,
                      data_inicio_cadastro: recortarDataDoAno(atual.data_inicio_cadastro, ano),
                      data_fim_cadastro: recortarDataDoAno(atual.data_fim_cadastro, ano),
                      data_inicio_realizacao: recortarDataDoAno(atual.data_inicio_realizacao, ano),
                      data_fim_realizacao: recortarDataDoAno(atual.data_fim_realizacao, ano),
                    };
                  });
                }}
              />
            </FormGroup>

            <div className="sm:col-span-2">
              <p className="label-condensed mb-3 text-sm text-brand-forest">Prazo de cadastro</p>
            </div>

            <FormGroup>
              <Label htmlFor="inicio-cadastro" required>
                Início do cadastro
              </Label>
              <Input
                id="inicio-cadastro"
                type="date"
                min={minCriar}
                max={maxCriar}
                value={criar.data_inicio_cadastro}
                onChange={(event) =>
                  setCriar((atual) => ({ ...atual, data_inicio_cadastro: event.target.value }))
                }
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="fim-cadastro" required>
                Fim do cadastro
              </Label>
              <Input
                id="fim-cadastro"
                type="date"
                min={minCriar}
                max={maxCriar}
                value={criar.data_fim_cadastro}
                onChange={(event) =>
                  setCriar((atual) => ({ ...atual, data_fim_cadastro: event.target.value }))
                }
              />
            </FormGroup>

            <div className="sm:col-span-2">
              <p className="label-condensed mb-3 text-sm text-brand-forest">
                Período de realização
              </p>
            </div>

            <FormGroup>
              <Label htmlFor="inicio-realizacao" required>
                Início da realização
              </Label>
              <Input
                id="inicio-realizacao"
                type="date"
                min={minCriar}
                max={maxCriar}
                value={criar.data_inicio_realizacao}
                onChange={(event) =>
                  setCriar((atual) => ({
                    ...atual,
                    data_inicio_realizacao: event.target.value,
                  }))
                }
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="fim-realizacao" required>
                Fim da realização
              </Label>
              <Input
                id="fim-realizacao"
                type="date"
                min={minCriar}
                max={maxCriar}
                value={criar.data_fim_realizacao}
                onChange={(event) =>
                  setCriar((atual) => ({ ...atual, data_fim_realizacao: event.target.value }))
                }
              />
            </FormGroup>

            <FormGroup className="mb-0">
              <Checkbox
                id="criar-inscricoes"
                checked={criar.inscricoes_abertas}
                onChange={(event) =>
                  setCriar((atual) => ({ ...atual, inscricoes_abertas: event.target.checked }))
                }
                label="Inscrições abertas (interruptor manual)"
              />
            </FormGroup>

            <FormGroup className="mb-0">
              <Checkbox
                id="criar-vigente"
                checked={criar.vigente}
                onChange={(event) =>
                  setCriar((atual) => ({ ...atual, vigente: event.target.checked }))
                }
                label="Tornar vigente ao criar"
              />
            </FormGroup>
          </ModalBody>

          <ModalFooter>
            <Button variant="neutral" onClick={fecharModal}>
              Cancelar
            </Button>
            <Button type="submit">Cadastrar edição</Button>
          </ModalFooter>
        </form>
      </Modal>

      <Modal isOpen={modal === 'prorrogar'} toggle={fecharModal} size="sm">
        <form onSubmit={handleProrrogar}>
          <ModalHeader toggle={fecharModal}>Prorrogar cadastro</ModalHeader>

          <ModalBody>
            {alvo && (
              <p className="mb-4 text-sm text-gray-600">
                Fim atual: {formatarDataCivil(alvo.data_fim_cadastro)}. A nova data precisa ser
                posterior. A realização não muda.
              </p>
            )}

            <FormGroup className="mb-0">
              <Label htmlFor="nova-data-fim" required>
                Nova data final do cadastro
              </Label>
              <Input
                id="nova-data-fim"
                type="date"
                min={minAlvo}
                max={maxAlvo}
                value={novaDataFim}
                onChange={(event) => setNovaDataFim(event.target.value)}
              />
            </FormGroup>
          </ModalBody>

          <ModalFooter>
            <Button variant="neutral" onClick={fecharModal}>
              Cancelar
            </Button>
            <Button type="submit">Prorrogar</Button>
          </ModalFooter>
        </form>
      </Modal>

      <Modal isOpen={modal === 'ajustar'} toggle={fecharModal} size="md">
        <form onSubmit={handleAjustar}>
          <ModalHeader toggle={fecharModal}>Ajustar datas</ModalHeader>

          <ModalBody>
            <p className="mb-4 text-sm text-gray-600">
              {alvo && fimSoProrrogar.has(alvo.id)
                ? 'Esta edição já tem ações. O fim do cadastro só avança pela prorrogação. Encolher a realização é recusado se sobrar ação fora do intervalo.'
                : 'Sem ações, as quatro datas podem mudar (o fim do cadastro pode encolher). Com ações, o fim do cadastro só avança pela prorrogação.'}
            </p>

            <FormGroup>
              <Label htmlFor="ajustar-inicio-cadastro">Início do cadastro</Label>
              <Input
                id="ajustar-inicio-cadastro"
                type="date"
                min={minAlvo}
                max={maxAlvo}
                value={ajuste.data_inicio_cadastro}
                onChange={(event) =>
                  setAjuste((atual) => ({ ...atual, data_inicio_cadastro: event.target.value }))
                }
              />
            </FormGroup>

            {!(alvo && fimSoProrrogar.has(alvo.id)) && (
              <FormGroup>
                <Label htmlFor="ajustar-fim-cadastro">Fim do cadastro</Label>
                <Input
                  id="ajustar-fim-cadastro"
                  type="date"
                  min={minAlvo}
                  max={maxAlvo}
                  value={ajuste.data_fim_cadastro}
                  onChange={(event) =>
                    setAjuste((atual) => ({ ...atual, data_fim_cadastro: event.target.value }))
                  }
                />
              </FormGroup>
            )}

            <FormGroup>
              <Label htmlFor="ajustar-inicio-realizacao">Início da realização</Label>
              <Input
                id="ajustar-inicio-realizacao"
                type="date"
                min={minAlvo}
                max={maxAlvo}
                value={ajuste.data_inicio_realizacao}
                onChange={(event) =>
                  setAjuste((atual) => ({
                    ...atual,
                    data_inicio_realizacao: event.target.value,
                  }))
                }
              />
            </FormGroup>

            <FormGroup className="mb-0">
              <Label htmlFor="ajustar-fim-realizacao">Fim da realização</Label>
              <Input
                id="ajustar-fim-realizacao"
                type="date"
                min={minAlvo}
                max={maxAlvo}
                value={ajuste.data_fim_realizacao}
                onChange={(event) =>
                  setAjuste((atual) => ({ ...atual, data_fim_realizacao: event.target.value }))
                }
              />
            </FormGroup>
          </ModalBody>

          <ModalFooter>
            <Button variant="neutral" onClick={fecharModal}>
              Cancelar
            </Button>
            <Button type="submit">Salvar ajustes</Button>
          </ModalFooter>
        </form>
      </Modal>

      <Modal isOpen={modal === 'inscricoes'} toggle={fecharModal} size="sm">
        <ModalHeader toggle={fecharModal}>Inscrições</ModalHeader>

        <ModalBody>
          {alvo && (
            <p className="text-brand-dark">
              {alvo.inscricoes_abertas
                ? 'Desligar as inscrições fecha o formulário imediatamente, mesmo dentro do prazo.'
                : 'Religar as inscrições só reabre o formulário se o prazo de cadastro ainda estiver vigente. Se a data final já passou, é preciso prorrogar.'}
            </p>
          )}
        </ModalBody>

        <ModalFooter>
          <Button variant="neutral" onClick={fecharModal}>
            Cancelar
          </Button>
          <Button onClick={handleInscricoes}>
            {alvo?.inscricoes_abertas ? 'Desligar inscrições' : 'Religar inscrições'}
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modal === 'vigente'} toggle={fecharModal} size="sm">
        <ModalHeader toggle={fecharModal}>Tornar vigente</ModalHeader>

        <ModalBody>
          {alvo && (
            <p className="text-brand-dark">
              A edição {alvo.ano} passará a ser a vigente. A listagem pública e o cadastro passam a
              usar só ela.
            </p>
          )}
        </ModalBody>

        <ModalFooter>
          <Button variant="neutral" onClick={fecharModal}>
            Cancelar
          </Button>
          <Button onClick={handleVigente}>Confirmar</Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modal === 'excluir'} toggle={fecharModal} size="sm">
        <ModalHeader toggle={fecharModal}>Excluir edição</ModalHeader>

        <ModalBody>
          {alvo && (
            <p className="text-brand-dark">
              Apaga a edição {alvo.ano} e o histórico de prorrogação. Se for a vigente, o site
              público fica sem edição até você marcar outra.
            </p>
          )}
        </ModalBody>

        <ModalFooter>
          <Button variant="neutral" onClick={fecharModal}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleExcluir}>
            Excluir
          </Button>
        </ModalFooter>
      </Modal>

      <Container>
        <Card>
          <CardHeader className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <CardTitle>Edições</CardTitle>
              <p className="mt-1 text-sm text-gray-500">
                Cadastro, realização, prorrogação e interruptor de inscrições da Semana Lixo Zero.
              </p>
            </div>

            <Button
              onClick={() => {
                setCriar(vazioCriar);
                setModal('criar');
              }}
            >
              Nova edição
            </Button>
          </CardHeader>

          <CardBody className="space-y-4">
            {precisaCriarEdicaoAtual && (
              <p className="text-sm text-brand-dark/80">
                Crie a edição {anoCivilAtual} para abrir o cadastro.
              </p>
            )}

            {edicoes.length === 0 && (
              <p className="rounded-2xl border-2 border-dashed border-brand-leaf/60 bg-brand-cream/60 px-6 py-10 text-center text-sm text-brand-dark/70">
                Nenhuma edição cadastrada. Crie a primeira para abrir o formulário e a programação.
              </p>
            )}

            {edicoes.map((edicao) => {
              const detalhe = detalhes[edicao.id];
              const aberta = expandida === edicao.id;
              const prorrogacoes: Prorrogacao[] = detalhe?.prorrogacoes ?? [];

              return (
                <article
                  key={edicao.id}
                  className="rounded-2xl border border-brand-leaf/30 bg-brand-cream/40 p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-xl text-brand-forest">Edição {edicao.ano}</h3>
                        {edicao.vigente && <Badge variant="success">Vigente</Badge>}
                        {edicao.cadastro_aberto ? (
                          <Badge variant="primary">Cadastro aberto</Badge>
                        ) : (
                          <Badge variant="neutral">Cadastro fechado</Badge>
                        )}
                        <Badge variant={edicao.inscricoes_abertas ? 'success' : 'warning'}>
                          {edicao.inscricoes_abertas
                            ? 'Inscrições ligadas'
                            : 'Inscrições desligadas'}
                        </Badge>
                      </div>

                      <p className="mt-2 text-sm text-brand-dark/80">
                        Cadastro: {formatarDataCivil(edicao.data_inicio_cadastro)} a{' '}
                        {formatarDataCivil(edicao.data_fim_cadastro)}
                      </p>
                      <p className="text-sm text-brand-dark/80">
                        Realização: {formatarDataCivil(edicao.data_inicio_realizacao)} a{' '}
                        {formatarDataCivil(edicao.data_fim_realizacao)}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button variant="ghost" size="sm" onClick={() => abrirDetalhe(edicao)}>
                        {aberta ? 'Ocultar histórico' : 'Ver histórico'}
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => abrirExcluir(edicao)}>
                        Excluir
                      </Button>
                    </div>
                  </div>

                  {edicao.vigente && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button size="sm" onClick={() => abrirProrrogar(edicao)}>
                        Prorrogar cadastro
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => abrirInscricoes(edicao)}>
                        {edicao.inscricoes_abertas ? 'Desligar inscrições' : 'Religar inscrições'}
                      </Button>
                      <Button size="sm" variant="neutral" onClick={() => abrirAjustar(edicao)}>
                        Ajustar datas
                      </Button>
                    </div>
                  )}

                  {podeTornarVigente(edicao) && (
                    <div className="mt-4">
                      <Button size="sm" variant="secondary" onClick={() => abrirVigente(edicao)}>
                        Tornar vigente
                      </Button>
                    </div>
                  )}

                  {aberta && (
                    <div className="mt-5 border-t border-brand-leaf/30 pt-4">
                      <h4 className="label-condensed text-sm text-brand-forest">
                        Histórico de prorrogações
                      </h4>

                      {prorrogacoes.length === 0 ? (
                        <p className="mt-2 text-sm text-gray-500">
                          Nenhuma prorrogação registrada.
                        </p>
                      ) : (
                        <ul className="mt-3 space-y-2">
                          {prorrogacoes.map((item) => (
                            <li
                              key={item.id}
                              className="rounded-xl bg-white px-4 py-3 text-sm text-brand-dark"
                            >
                              {formatarDataCivil(item.data_fim_cadastro_anterior)} →{' '}
                              {formatarDataCivil(item.data_fim_cadastro_nova)} em{' '}
                              {formatarQuando(item.prorrogada_em)}
                              {item.nome_usuario ? ` por ${item.nome_usuario}` : ''}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </CardBody>
        </Card>
      </Container>
    </>
  );
};

export { EditionsContainer };
