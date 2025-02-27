// carregar a lista de carros
async function loadCars() {
  try {
    // pede ao servidor para buscar os carros
    const response = await fetch('/cars');
    if (!response.ok) throw new Error('Erro ao carregar a lista de carros.');
    const cars = await response.json();

    // seleciona a tabela e verifica se ele existe
    const tableBody = document.querySelector('#carTable tbody');
    if (!tableBody) {
      console.error('Elemento #carTable tbody não encontrado.');
      return;
    }

    // limpa a tabela e preenche com os novos dados dos carros
    tableBody.innerHTML = '';
    cars.forEach(car => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${car.placa}</td>
        <td>${car.modelo}</td>
        <td>${car.cor}</td>
        <td>
          <a href="/form?placa=${car.placa}" class="button">Editar</a>
          <button class="button delete" onclick="deleteCar('${car.placa}')">Excluir</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Erro ao carregar carros:', error);
    alert('Erro ao carregar a lista de carros.');
  }
}

// exclui um carro
async function deleteCar(placa) {
  if (confirm('Tem certeza que deseja excluir este carro?')) {
    try {
      const response = await fetch(`/cars/${placa}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Erro ao excluir o carro.');
      alert('Carro excluído com sucesso!');
      loadCars();
    } catch (error) {
      console.error('Erro ao excluir carro:', error);
      alert('Erro ao excluir o carro.');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadCars();
});

// salvar ou atualizar um carro
const carForm = document.getElementById('carForm');
if (carForm) {
  carForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const placa = document.getElementById('placa').value;
    const modelo = document.getElementById('modelo').value;
    const cor = document.getElementById('cor').value;

    if (!placa || !modelo || !cor) {
      alert('Todos os campos são obrigatórios.');
      return;
    }


    const car = { placa, modelo, cor };
    const urlParams = new URLSearchParams(window.location.search);
    const placaEdicao = urlParams.get('placa');
    const url = placaEdicao ? `/cars/${placaEdicao}` : '/cars';
    const method = placaEdicao ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(car),
      });

      if (response.ok) {
        alert(placaEdicao ? 'Carro atualizado com sucesso!' : 'Carro salvo com sucesso!');
        window.location.href = '/';
      } else {
        throw new Error('Erro ao salvar/atualizar o carro.');
      }
    } catch (error) {
      console.error('Erro ao salvar/atualizar carro:', error);
      alert('Erro ao salvar/atualizar o carro.');
    }
  });
}

async function fillFormForEdit() {
  const urlParams = new URLSearchParams(window.location.search);
  const placa = urlParams.get('placa');

  if (placa) {
    try {
      const response = await fetch(`/cars/${placa}`);
      if (!response.ok) throw new Error('Erro ao carregar dados do carro.');
      const car = await response.json();

      // preenche o formulário com os dados do carro
      document.getElementById('placa').value = car.placa;
      document.getElementById('modelo').value = car.modelo;
      document.getElementById('cor').value = car.cor;
    } catch (error) {
      console.error('Erro ao carregar dados do carro:', error);
      alert('Erro ao carregar dados do carro.');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname === '/') loadCars();
  else if (window.location.pathname === '/form') fillFormForEdit();
});