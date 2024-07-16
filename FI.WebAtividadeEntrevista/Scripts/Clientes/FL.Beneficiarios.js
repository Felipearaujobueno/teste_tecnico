var arrObjBeneficiarios = [];

function ModalDialogConfirm(titulo, texto, id) {
    var random = Math.random().toString().replace('.', '');
    var texto = '<div id="' + random + '" class="modal fade">                                                                                           ' +
        '        <div class="modal-dialog">                                                                                                             ' +
        '            <div class="modal-content">                                                                                                        ' +
        '                <div class="modal-header">                                                                                                     ' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>                                     ' +
        '                    <h4 class="modal-title">' + titulo + '</h4>                                                                                ' +
        '                </div>                                                                                                                         ' +
        '                <div class="modal-body">                                                                                                       ' +
        '                    <p>' + texto + '</p>                                                                                                       ' +
        '                </div>                                                                                                                         ' +
        '                <div class="modal-footer">                                                                                                     ' +
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>                                       ' +
        '                    <button type="button" onclick="ExcluirBeneficiario(' + id + ')" class="btn btn-danger" data-dismiss="modal">Excluir</button>       ' +
        '                                                                                                                                               ' +
        '                </div>                                                                                                                         ' +
        '            </div><!-- /.modal-content -->                                                                                                     ' +
        '  </div><!-- /.modal-dialog -->                                                                                                                ' +
        '</div> <!-- /.modal -->                                                                                                                        ';

    $('body').append(texto);
    $('#' + random).modal('show');
}

function PreencherTbBeneficiarios() {
    var table = $("#tbBeneficiarios tbody");
    var _html = "";
    var count = 0;
    if (arrObjBeneficiarios.length > 0) {
        arrObjBeneficiarios.forEach(arr => {
            _html +=
                `<tr class="bnc-${arr.id}">
                    <td class="col-md-3"><p class="bnc-cpf-${arr.id}" value="${arr.cpf}">${arr.cpf}</p></td>
                    <td class="col-md-5"><p class="bnc-nome-${arr.id}" value="${arr.nome}">${arr.nome}</p></td>
                    <td class="col-md-4">
                        <button type="button" class="btn btn-primary" onclick="AlterarBeneficiario(${arr.id})">Alterar</button>
                        <button type="button" class="btn btn-primary" onclick="ModalExcluirBeneficio(${arr.id})">Excluir</button>
                    </td>
                </tr>`;
        });

        table.append(_html);
    }
}

var classId = 0;
function IncluirBeneficiario() {
    var table = $("#tbBeneficiarios tbody");
    var nome = $("#nomeBeneficiario").val();
    var cpf = $("#cpfBeneficiario").val();

    if (!validarCPF(cpf)) {
        ModalDialog("Ocorreu um erro", "CPF inválido.");
        return;
    }

    if (existeCPF(cpf)) {
        ModalDialog("Ocorreu um erro", "Este CPF já está sendo usado.");
        return;
    }

    SalvarObj(classId, nome, cpf);

    var _html =
        `<tr class="bnc-${classId}">
            <td class="col-md-3"><p class="bnc-cpf-${classId}" value="${cpf}">${cpf}</p></td>
            <td class="col-md-5"><p class="bnc-nome-${classId}" value="${nome}">${nome}</p></td>
            <td class="col-md-4">
                <button type="button" class="btn btn-primary" onclick="AlterarBeneficiario(${classId})">Alterar</button>
                <button type="button" class="btn btn-primary" onclick="ModalExcluirBeneficio(${classId})">Excluir</button>
            </td>
        </tr>`;

    table.append(_html);

    $("#nomeBeneficiario").val("");
    $("#cpfBeneficiario").val("");
    classId++;
}

function AlterarBeneficiario(classNum) {
    $("#btnSalvarBeneficiario").off("click");

    var nome = $(".bnc-nome-" + classNum).text();
    var cpf = $(".bnc-cpf-" + classNum).text();

    $("#mdlAlterarBeneficiario").modal('show');
    $("#cpfBeneficiarioAlterado").val(cpf);
    $("#nomeBeneficiarioAlterado").val(nome);

    $("#btnSalvarBeneficiario").on("click", function () {
        SalvarBeneficiario(classNum);
    });

    $("#cpfBeneficiarioAlterado").on("keypress", function () {
        mascaraCpf("cpfBeneficiarioAlterado");
    });
}

function SalvarBeneficiario(id) {
    var nome = $("#nomeBeneficiarioAlterado").val();
    var cpf = $("#cpfBeneficiarioAlterado").val();
    var cpfAlterado = cpf != $(".bnc-cpf-" + id).text() ? true : false;

    if (!ValidaBeneficiario(nome, cpf, cpfAlterado)) { return }

    $(".bnc-nome-" + id).text(nome);
    $(".bnc-cpf-" + id).text(cpf);

    const obj = {
        id: id,
        cpf: cpf,
        nome: nome
    }
    AlterarIndicieBeneficiario(obj);
}

function ValidaBeneficiario(nome, cpf, cpfAlterado) {
    let valido = true;

    if (nome == '' || cpf == '') {
        $("#mdlAlterarBeneficiario").modal('hide');
        ModalDialog("Ocorreu um erro", "Preencha os campos obrigatórios.");
        valido = false;
    }

    if (!validarCPF(cpf) && cpf !== '') {
        $("#mdlAlterarBeneficiario").modal('hide');
        ModalDialog("Ocorreu um erro", "CPF inválido.");
        valido = false;
    }

    if (cpfAlterado) {

        if (existeCPF(cpf)) {
            $("#mdlAlterarBeneficiario").modal('hide');
            ModalDialog("Ocorreu um erro", "Este CPF já está sendo usado.");
            valido = false;
        }
    }

    return valido;
}

function ModalExcluirBeneficio(classNum) {
    ModalDialogConfirm("Excluir Beneficiário", "Você realmente quer excluir este beneficiário?", classNum);
}

function ExcluirBeneficiario(classNum) {
    $(".bnc-" + classNum).remove();
    ExcluirIndicieBeneficiario(classNum);
}

function ListarBeneficiarios() {
    const objBeneficiarios = arrObjBeneficiarios

    return JSON.stringify(objBeneficiarios);
}

function SalvarObj(id, nome, cpf) {
    const obj = {
        id: id,
        nome: nome,
        cpf: cpf
    }
    arrObjBeneficiarios.push(obj);
}

function existeCPF(cpf) {
    for (let i = 0; i < arrObjBeneficiarios.length; i++) {
        if (arrObjBeneficiarios[i].cpf === cpf) {
            return true
        }
    }
    return false;
}

function ExcluirIndicieBeneficiario(classNum) {
    for (let i = 0; i < arrObjBeneficiarios.length; i++) {
        if (arrObjBeneficiarios[i].id == classNum) {
            arrObjBeneficiarios.splice(i, 1);
            break;
        }
    }
}

function AlterarIndicieBeneficiario(objBeneficiario) {
    ExcluirIndicieBeneficiario(objBeneficiario.id);
    SalvarObj(objBeneficiario.id, objBeneficiario.nome, objBeneficiario.cpf);
}
function InserirObjBeneficiarios(arrObjBeneficiariosList) {
    arrObjBeneficiariosList.forEach(obj => {
        SalvarObj(obj.Id, obj.Nome, obj.CPF);
    });
}

function LimparArrBeneficiarios() {
    arrObjBeneficiarios.length = 0;
}
