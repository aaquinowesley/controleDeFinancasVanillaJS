// Função para buscar os dados do localStorage e prepará-los para os gráficos
function getChartData() {
    var storedData = localStorage.getItem("dados");
    var parsedData = storedData ? JSON.parse(storedData) : [];

    // Processar os dados para os gráficos de entrada e saída por data
    var entradaPorData = {
        labels: [], // Array de rótulos de data
        data: [], // Array de valores de entrada por data
    };

    var saidaPorData = {
        labels: [], // Array de rótulos de data
        data: [], // Array de valores de saída por data
    };

    parsedData.forEach(function (data) {
        // Extrair a data do objeto de dados
        var dataLabel = data.data;

        // Verificar se a data já existe nos rótulos
        var dataIndex = entradaPorData.labels.indexOf(dataLabel);
        if (dataIndex === -1) {
            // Adicionar a data aos rótulos e inicializar o valor de entrada e saída para essa data
            entradaPorData.labels.push(dataLabel);
            entradaPorData.data.push(data.valor);
            saidaPorData.labels.push(dataLabel);
            saidaPorData.data.push(data.valor < 0 ? Math.abs(data.valor) : 0);
        } else {
            // Atualizar o valor de entrada e saída para essa data
            entradaPorData.data[dataIndex] += data.valor;
            if (data.valor < 0) {
                saidaPorData.data[dataIndex] += Math.abs(data.valor);
            }
        }
    });

    // Retornar os dados no formato adequado para cada gráfico
    return {
        entradaPorData: {
            labels: entradaPorData.labels,
            datasets: [{
                label: "Entradas",
                data: entradaPorData.data,
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            }],
        },
        saidaPorData: {
            labels: saidaPorData.labels,
            datasets: [{
                label: "Saídas",
                data: saidaPorData.data,
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 1,
            }],
        },
        // Implemente a lógica para os outros gráficos
    };
}

// Função para configurar um gráfico
function setupChart(chartId, chartData) {
    var chartElement = document.getElementById(chartId);
    var chart = new Chart(chartElement, {
        type: "line",
        data: chartData,
        options: {
            // Configurações do gráfico
        },
    });
}

// Função principal para configurar todos os gráficos
function setupCharts() {
    var chartData = getChartData();

    setupChart("entradaPorDataChart", chartData.entradaPorData);
    setupChart("saidaPorDataChart", chartData.saidaPorData);
    // Configurar os outros gráficos aqui
}

// Chame a função principal para configurar os gráficos ao carregar a página
window.addEventListener("load", setupCharts);
