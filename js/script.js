const urlApi = "http://localhost:3000/produtos";

// * GET
async function carregarProdutos() {
    const requestMethod = { method: "GET" };
    try {
        const response = await fetch(urlApi, requestMethod);
        const produtos = await response.json();
        alimentarCards(produtos);
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function alimentarCards(produtos) {
    const htmlCards = produtos.map(item => `
        <div class="card-content">
            <img src="${item.image}" alt="${item.nome}">
            <div class="card-body">
                <h3 class="card-title">${item.nome}</h3 >
                <p>${item.preco} R$</h4>
                <button>+</button>
            </div>
            <div class="alinhar-botoes">
                <button type="button" class="btn btn-danger" id="delete-${item.id}">Deletar</button>
                
                <!-- ? MODAL EDITAR (PUT) -->
                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop-${item.id}" id="editar-${item.id}">Editar</button>
            </div>
        </div>

    
        <!-- Modal -->
        <div class="modal fade" id="staticBackdrop-${item.id}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                <h1 class="modal-title fs-5" id="staticBackdropLabel">Editar</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="form-usuario-${item.id}">
                        <div class="mb-3">
                            <label for="image-${item.id}">Imagem</label>
                            <input type="file" class="form-control" id="image-${item.id}" name="image" ">
                        </div>
                        <div class="mb-3">
                            <label for="nome-${item.id}" class="form-label"></label>
                            <input type="text" class="form-control" id="nome-${item.id}" name="nome" placeholder="Nome do produto" value="${item.nome}">
                        </div>
                        <div class="mb-3">
                            <label for="preco-${item.id}" class="form-label"></label>
                            <input type="number" class="form-control" id="preco-${item.id}" name="preco" placeholder="Preço" value="${item.preco}">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary" id="btnEdit-${item.id}">Salvar</button>
                </div>
            </div>
            </div>
        </div>
    `).join("");

    document.getElementById('organizar-cards').innerHTML = htmlCards;

    
    // ! APLICANDO OS BOTÕES DAS FUNÇÕES EDIT E DELETE DENTRO DO CONTEXTO ONDE O ITEM.ID ESTÁ INSERIDO
    produtos.forEach(item => {
        document.getElementById(`btnEdit-${item.id}`).addEventListener('click', () => editarProdutos(item.id));
        document.getElementById(`delete-${item.id}`).addEventListener('click', () => deletarProdutos(item.id)); 
    });
}

// * POST
async function salvarProduto() {
    const nomeProduto = document.getElementById('nome').value;
    const precoProduto = document.getElementById('preco').value;
    const descProduto = document.getElementById('descricao').value;
    const image = document.getElementById("image").files[0];

    if (!nomeProduto || !precoProduto || !image) {
        Swal.fire({
            title: "Por favor, preencha todos os campos obrigatórios",
            icon: "error"
        });
        return;
    }

    let reader = new FileReader();
    reader.onload = async function() {
        const imageBase64 = reader.result;

        const payload = {
            nome: nomeProduto,
            preco: precoProduto,
            descricao: descProduto,
            image: imageBase64
        };

        const requestMethod = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        };

        try {
            const response = await fetch(urlApi, requestMethod);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            carregarProdutos();
        } catch (error) {
            console.error('Error saving product:', error);
            Swal.fire({
                title: "Erro ao salvar produto",
                text: error.message,
                icon: "error"
            });
        }
    };
    reader.readAsDataURL(image);
}

// * PUT
async function editarProdutos(id) {
    const nomeProduto = document.getElementById(`nome-${id}`).value;
    const precoProduto = document.getElementById(`preco-${id}`).value;
    const descProduto = document.getElementById(`descricao-${id}`).value;
    const image = document.getElementById(`image-${id}`).files[0];

    let newProduct = { nome: nomeProduto, preco: precoProduto, descricao: descProduto };

    if (image) {
        let reader = new FileReader();
        reader.onload = async function() {
            newProduct.image = reader.result;

            const requestMethod = {
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProduct)
            };

            try {
                const response = await fetch(`${urlApi}/${id}`, requestMethod);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                carregarProdutos();
            } catch (error) {
                console.error('Error editing product:', error);
                Swal.fire({
                    title: "Erro ao editar produto",
                    text: error.message,
                    icon: "error"
                });
            }
        };
        reader.readAsDataURL(image);
    } else {
        const requestMethod = {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProduct)
        };

        try {
            const response = await fetch(`${urlApi}/${id}`, requestMethod);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            carregarProdutos();
        } catch (error) {
            console.error('Error editing product:', error);
            Swal.fire({
                title: "Erro ao editar produto",
                text: error.message,
                icon: "error"
            });
        }
    }
}

// * DELETE

async function deletarProdutos(id) {
    const requestMethod = {
        method: "DELETE"
    };
    try {
        const response = await fetch(`${urlApi}/${id}`, requestMethod);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        carregarProdutos();
    } catch (error) {
        console.error('Error editing product:', error);
        Swal.fire({
            title: "Erro ao editar produto",
            text: error.message,
            icon: "error"
        });
    }
}


// Chama a função para carregar os produtos
// ? GET
document.addEventListener('DOMContentLoaded', carregarProdutos);

// ? BOTÃO SALVAR
document.getElementById('btn-salvarProduto').addEventListener('click', salvarProduto);


