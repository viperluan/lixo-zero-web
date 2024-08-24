const TipoUsuario = {
    Admin: '0',
    Usuario: '1'
}

const Situacao = {
    Inativo: '0',
    Ativo: '1'
}

const FormaRealizacaoAcao = {
    Online: '0',
    Presencial: '1',
    Hibrida: '2',

    description(val) {
        switch (val) {
            case this.Online:
                return 'Online'

            case this.Presencial:
                return 'Presencial'

            case this.Hibrida:
                return 'Híbrida'

            default:
                return 'enum not found'
        }
    },
}

const SituacaoAcao = {
    AguardandoConfirmacao: '0',
    Confirmada: '1',
    Cancelada: '2',

    description(val) {
        switch (val) {
            case this.AguardandoConfirmacao:
                return 'Pendente'

            case this.Confirmada:
                return 'Aprovada'

            case this.Cancelada:
                return 'Rejeitada'

            default:
                return 'Desconhecida'
        }
    },
}

const SituacaoPatrocinio = {
    AguardandoConfirmacao: '0',
    Confirmado: '1',
    Cancelado: '2'
}



const listarEnumerados = (object) => {
    let list = []

    for (var key in object) {
        if (typeof object[key] === 'function') continue

        const item = {
            value: object[key],
            label: object.description ? object.description(object[key]) : '',
        }

        list.push(item)
    }


    list = list.sort(function (a, b) {
        return b.label - a.label
    })

    return list
}


export { TipoUsuario, Situacao, FormaRealizacaoAcao, listarEnumerados, SituacaoAcao, SituacaoPatrocinio }
