// Função para formatar o valor para o formato de moeda brasileiro
function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Função para remover todos os dados do localStorage
function limparLocalStorage() {
    localStorage.removeItem("dados");
    updateTable();
}

// Função para calcular o valor total com base nos dados armazenados
function calcularValores() {
    var storedData = localStorage.getItem("dados");
    var parsedData = storedData ? JSON.parse(storedData) : [];

    var valorEntrada = 0;
    var valorSaida = 0;

    parsedData.forEach(function (data) {
        var valor = parseFloat(data.valor.replace(",", "."));

        if (valor < 0) {
            valorSaida += Math.abs(valor);
        } else {
            valorEntrada += valor;
        }
    });

    var valorTotal = valorEntrada - valorSaida;

    // Atualizar os valores nos cards
    document.getElementById("valor-entrada").textContent = formatarMoeda(valorEntrada);
    document.getElementById("valor-saida").textContent = formatarMoeda(valorSaida);
    document.getElementById("valor-total").textContent = formatarMoeda(valorTotal);
}

function formatarData(data) {
    var dia = data.getDate().toString().padStart(2, "0");
    var mes = (data.getMonth() + 1).toString().padStart(2, "0");
    var ano = data.getFullYear().toString();
    return dia + "/" + mes + "/" + ano;
}

// Atualizar a tabela com os dados do localStorage
function updateTable() {
    var tableBody = document.querySelector("#data-table tbody");
    tableBody.innerHTML = "";

    var storedData = localStorage.getItem("dados");
    var parsedData = storedData ? JSON.parse(storedData) : [];

    parsedData.forEach(function (data, index) {
        var row = document.createElement("tr");

        var descricaoCell = document.createElement("td");
        descricaoCell.textContent = data.descricao;
        row.appendChild(descricaoCell);

        var valorCell = document.createElement("td");
        valorCell.textContent = formatarMoeda(data.valor.replace(",", "."));
        row.appendChild(valorCell);

        var dataCell = document.createElement("td");
        var dataFormatada = new Date(data.data);
        dataCell.textContent = formatarData(dataFormatada); // Formata a data no padrão "DD/MM/AAAA"
        row.appendChild(dataCell);

        var removeCell = document.createElement("td");
        var removeButton = document.createElement("button");
        removeButton.textContent = '❌';
        removeButton.addEventListener("click", function () {
            parsedData.splice(index, 1);
            localStorage.setItem("dados", JSON.stringify(parsedData));
            updateTable();
        });
        removeCell.appendChild(removeButton);
        row.appendChild(removeCell);

        tableBody.appendChild(row);
    });

    // Atualizar os valores dos cards
    calcularValores();
}

// Abrir ou fechar o modal ao clicar no botão
var openModalBtn = document.getElementById("openModalBtn");
openModalBtn.addEventListener("click", function () {
    var modal = document.getElementById("myModal");
    if (modal.style.display === "block") {
        modal.style.display = "none";
    } else {
        modal.style.display = "block";
    }
});

// Fechar o modal ao clicar no "x"
var closeModalBtn = document.getElementsByClassName("close")[0];
closeModalBtn.addEventListener("click", function () {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
});

// Enviar o formulário
var myForm = document.getElementById("myForm");
myForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Impede o comportamento padrão do formulário

    // Obter os valores do formulário
    var nameInput = document.getElementById("name");
    var descricaoInput = document.getElementById("descricao");
    var dataInput = document.getElementById("data");

    var name = nameInput.value.replace(/[^\d.-]/g, ""); // Remover caracteres não numéricos, exceto "-" e "."
    var descricao = descricaoInput.value;
    var data = new Date(dataInput.value).toISOString(); // Converter a data para o formato ISO

    // Salvar os dados no localStorage
    var dados = {
        descricao: descricao,
        valor: name,
        data: data
    };

    var storedData = localStorage.getItem("dados");
    var parsedData = storedData ? JSON.parse(storedData) : [];
    parsedData.push(dados);
    localStorage.setItem("dados", JSON.stringify(parsedData));

    // Limpar o formulário
    nameInput.value = "";
    descricaoInput.value = "";
    dataInput.value = "";

    // Fechar o modal
    var modal = document.getElementById("myModal");
    modal.style.display = "none";

    // Atualizar a tabela com os dados do localStorage
    updateTable();
});

// Carregar a tabela com os dados ao carregar a página
updateTable();

// Botão para limpar o localStorage
var limparBtn = document.getElementById("limparBtn");
limparBtn.addEventListener("click", function () {
    // Verifica se o navegador suporta a API de vibração
    if ("vibrate" in navigator) {
        // Vibra o dispositivo por 200ms
        navigator.vibrate(200);
    } else {
        console.log("API de vibração não suportada");
    }
    limparLocalStorage();
});3