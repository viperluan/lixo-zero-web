import { FormaRealizacaoAcao } from "~/Enumerados";
import { listar~/Enumerados } from "~/Enumerados";
import api from "api";
import { DateTimePicker } from "~components/DatePicker";
import { useAuth } from "~context/AuthContext";
import moment from "moment";
import { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Card, CardBody, CardFooter, CardHeader, FormGroup, Input, Form, Label, Button, CardTitle } from "reactstrap";
import InputMask from 'react-input-mask';
import { SituacaoAcao } from "~/Enumerados";
import { LoadingOverlay } from "~components/Loading";
import { useNavigate } from "react-router-dom";

const ActionContainer = () => {
    const navigate = useNavigate()
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [listCategories, setListCategories] = useState([]);
    const [organizerName, setOrganizerName] = useState('');
    const [activityTitle, setActivityTitle] = useState('');
    const [activityDescription, setActivityDescription] = useState('');
    const [activityType, setActivityType] = useState(null);
    const [realizationForm, setRealizationForm] = useState(FormaRealizacaoAcao.Online);
    const [activityLocation, setActivityLocation] = useState('');
    const [organizerCount, setOrganizerCount] = useState(0);
    const [selectedDate, setSelectedDate] = useState(null);
    const [whatsapp, setWhatsapp] = useState('');

    const fetchCategories = () => {
        api.get(`/categorias?page=1&limit=150`).then((res) => {
            setListCategories(res.data.categories || []);
            if (res.data.categories) {
                setActivityType(res.data.categories[0].id)
            }
        });
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleSubmitAction = async () => {

        if (!user.id)
            return toast.warn("Faça login antes de continuar!");

        if (!organizerName)
            return toast.warn("Informe o nome do organizador da ação!");

        if (!whatsapp)
            return toast.warn("Informe o número do WhatsApp do responsável pela ação!");

        if (!activityTitle)
            return toast.warn("Informe o título da ação!");

        if (!activityDescription)
            return toast.warn("Informe a descrição da ação!");

        if (!activityType)
            return toast.warn("Informe o tipo da ação!");

        if (!realizationForm)
            return toast.warn("Informe a forma de realização da ação!");

        if (!activityLocation)
            return toast.warn("Informe o local de realização da ação!");

        if (!selectedDate)
            return toast.warn("Informe a data de realização da ação!");

        if (organizerCount <= 0 || !organizerCount)
            return toast.warn("Informe o número previsto de organizadores da ação!");


        // Adicionar lógica para enviar dados ao servidor

        const payload = {
            id_usuario_responsavel: user.id,
            celular: whatsapp.replace(/\D/g, ''),
            nome_organizador: organizerName,
            link_organizador: "teste",
            titulo_acao: activityTitle,
            descricao_acao: activityDescription,
            id_categoria: activityType,
            data_acao: new Date(selectedDate._d),
            forma_realizacao_acao: realizationForm,
            local_acao: activityLocation,
            numero_organizadores_acao: organizerCount,
            situacao_acao: SituacaoAcao.AguardandoConfirmacao,
        }

        setIsLoading(true)
        await api.post(`/acoes`, payload).then(res => {
            if (res.data.id) {
                toast.success("Recebemos a solicitação da sua ação em breve nossa equipe entrará em contato para confirmar os detalhes.", {
                    autoClose: 10000
                })
                navigate(`/auth/events/my-events/${user.id}`)
            }
        }).finally(() => setIsLoading(false));

    };

    const listaFormaAcao = listar~/Enumerados(FormaRealizacaoAcao);

    const renderLocalAcaoPlaceHolder = () => {
        switch (realizationForm) {
            case FormaRealizacaoAcao.Online:
                return "Insira o LINK de onde será divulgado o acesso ao evento."
            case FormaRealizacaoAcao.Presencial:
                return "Insira o NOME E O ENDEREÇO do local de realização do evento."
            case FormaRealizacaoAcao.Hibrida:
                return "Insira informações de onde acontecerá o evento"

            default:
                return "Local de realização da ação"

        }
    }

    return (
        <Fragment>
            <LoadingOverlay isLoading={isLoading} />
            <Card>
                <CardHeader>
                    <CardTitle>INSCRIÇÃO DE AÇÃO - SEMANA LIXO ZERO CAXIAS DO SUL</CardTitle>
                </CardHeader>
                <CardBody>
                    <Form className="form">
                        <FormGroup>
                            <Label for="organizerName">Nome do Organizador da ação</Label>
                            <span className="form-text text-muted small">Empresa/Instituição/Grupo que você representa. Se for 'pessoa física' insira seu nome</span>
                            <Input
                                id="organizerName"
                                name="organizerName"
                                type="text"
                                placeholder="Nome do responsável pela ação"
                                value={organizerName}
                                onChange={(e) => setOrganizerName(e.target.value)}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label for="whatsapp">WhatsApp do responsável pela ação</Label>
                            <InputMask
                                mask="(99) 99999-9999"
                                value={whatsapp}
                                onChange={(e) => setWhatsapp(e.target.value)}
                            >
                                {(inputProps) => <Input {...inputProps} id="whatsapp" name="whatsapp" type="text" placeholder="(99) 99999-9999" />}
                            </InputMask>
                        </FormGroup>

                        <FormGroup>
                            <Label>Título da atividade - para divulgação na programação</Label>
                            <span className="form-text text-muted small">Ex: Webinar sobre coleta seletiva / Live: Compostagem na Prática / Oficina de receitas....</span>
                            <Input
                                id="activityTitle"
                                name="activityTitle"
                                type="text"
                                placeholder="Título da atividade"
                                value={activityTitle}
                                onChange={(e) => setActivityTitle(e.target.value)}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label>Descrição resumida da atividade (o que será falado / feito?)</Label>
                            <span className="form-text text-muted small">Se houver necessidade de INSCRIÇÃO de participantes para acesso ao seu evento, por favor informe aqui como deve acontecer.</span>
                            <Input
                                id="activityDescription"
                                name="activityDescription"
                                type="textarea"
                                placeholder="Descrição da atividade"
                                rows={3}
                                value={activityDescription}
                                onChange={(e) => setActivityDescription(e.target.value)}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label for="tipo_atividade">Tipo da Atividade</Label>
                            <Input
                                id="tipo_atividade"
                                name="activityType"
                                type="select"
                                value={activityType}
                                onChange={(e) => setActivityType(e.target.value)}
                            >
                                {listCategories.map((categorie) => (
                                    <option key={categorie.id} value={categorie.id}>
                                        {categorie.descricao}
                                    </option>
                                ))}
                            </Input>
                        </FormGroup>

                        <FormGroup>
                            <Label for="dateTime">Data e horário que a atividade será realizada (datas entre 21 e 30/10/{moment().year()})</Label>
                            <DateTimePicker onDateChange={handleDateChange} />
                        </FormGroup>

                        <FormGroup>
                            <Label for="forma_realizacao_acao">Forma de realização da atividade</Label>
                            <Input
                                id="forma_realizacao_acao"
                                name="realizationForm"
                                type="select"
                                value={realizationForm}
                                onChange={(e) => setRealizationForm(e.target.value)}
                            >
                                {listaFormaAcao.map((forma) => (
                                    <option key={forma.value} value={forma.value}>
                                        {forma.label}
                                    </option>
                                ))}
                            </Input>
                        </FormGroup>

                        <FormGroup>
                            <Label for="local_acao">{renderLocalAcaoPlaceHolder()}</Label>
                            <Input
                                id="local_acao"
                                name="activityLocation"
                                type="text"
                                placeholder={renderLocalAcaoPlaceHolder()}
                                value={activityLocation}
                                onChange={(e) => setActivityLocation(e.target.value)}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label>Quantas pessoas irão organizar essa ação? (Incluindo você)</Label>
                            <span className="form-text text-muted small">Se não tiver certeza, insira uma média</span>
                            <Input
                                id="organizerCount"
                                name="organizerCount"
                                type="number"
                                placeholder="Nº participantes"
                                value={organizerCount}
                                onChange={(e) => setOrganizerCount(parseInt(e.target.value))}
                            />
                        </FormGroup>
                    </Form>
                </CardBody>
                <CardFooter className="d-flex justify-content-center">
                    <Button onClick={() => handleSubmitAction()} color="primary">Enviar</Button>
                </CardFooter>
            </Card>
        </Fragment>
    );
};

export { ActionContainer };
