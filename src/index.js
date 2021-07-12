const express = require('express');
const { products} = require('.products');
const { Product } = require('.models');
const { request, response } = require('express');
const app = express();

app.use(express.json());

app.get('/cardapio', async (request, response)=> {
    try {
        const result = await Product.findAll();
        return response.status(200).json(result); 
    } catch (error) {
        return response.status(500).json({error: error.message});
    }
});

app.get('/cardapio/search', (request, response) => {
    const { text } = request.query;
    if (text) {
        const results = products.filter(p => p.description.toUpperCase().includes(text.toUpperCase()));
        return response.json(results);
    } else {
        return response.json(products)
    }
});

app.post('/cardapio', async (request, response) => {
    try {
        const prod = await Product.creat(request.body);
        return response.status(200).json(prod);
    } catch (error) {
        return response.status(500).json({ error: error.message });
    }
});

app.put('/cardapio/:id', async (request, response) => {
    const { id } = request.params;
    const products = request.body;

    const affectedRows = await Product.update(products, {
        where: { id },
    });

    if (affectedRows <1) {
        return response.status(404).json({ error: 'Produto não encontrado no cardápio.'});
    }
    return response.status(200).json({ success: 'Produto alterado com sucesso' });
});

app.delete('/cardapio/:id', async (request, response) => {
    const { id } = request.params;

    const affectedRows = await Product.destroy({
        where: { id },
    });

    if (affectedRows < 1){
        return response.status(404).json({ error: 'Produto não encontrado' });
    }
    return reponse.status(200).json({ success: 'Produto removido com sucesso' });
});

app.listen(3000);