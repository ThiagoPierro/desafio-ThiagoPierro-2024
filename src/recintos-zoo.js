class RecintosZoo {
    
    analisaRecintos(animal, quantidade) {
        
        const recintos = [
            { numero: 1, bioma: 'savana', tamanhoTotal: 10, animaisExistentes: { macaco: 3 } },
            { numero: 2, bioma: 'floresta', tamanhoTotal: 5, animaisExistentes: {} },
            { numero: 3, bioma: 'savana e rio', tamanhoTotal: 7, animaisExistentes: { gazela: 1 } },
            { numero: 4, bioma: 'rio', tamanhoTotal: 8, animaisExistentes: {} },
            { numero: 5, bioma: 'savana', tamanhoTotal: 9, animaisExistentes: { leão: 1 } }
        ];
        
        
        const animais = {
            leao: { tamanho: 3, biomas: ['savana'] },
            leopardo: { tamanho: 2, biomas: ['savana'] },
            crocodilo: { tamanho: 3, biomas: ['rio'] },
            macaco: { tamanho: 1, biomas: ['savana', 'floresta'] },
            gazela: { tamanho: 2, biomas: ['savana'] },
            hipopotamo: { tamanho: 4, biomas: ['savana', 'rio'] }
        };

        // Verifica se o animal esta presente na lista de animais
        if (!animais[animal.toLowerCase()]) {
            return { erro: "Animal inválido" };
        }

        // Verifica se a quantidade é um número inteiro e positivo
        if (quantidade <= 0 || !Number.isInteger(quantidade)) {
            return { erro: "Quantidade inválida" };
        }

        // Pega os dados do animal e deixa minúsculo para não ocorrer erro na busca
        const dadosAnimal = animais[animal.toLowerCase()];
        
        // Função para verificar se o recinto é viável para o animal
        const recintosViaveis = recintos.filter(recinto => {
            const animaisExistentes = recinto.animaisExistentes;
            const biomaRecinto = recinto.bioma.split(' ');
            const biomaAnimal = dadosAnimal.biomas;

            // Verifica se o bioma do recinto é adequado para o animal
            const biomaAdequado = biomaAnimal.some(bioma => biomaRecinto.includes(bioma));
            
            // Verifica se tem espaço disponível para o animal
            let tamanhoNecessario = quantidade * dadosAnimal.tamanho;

            // Considera espaço extra se houver mais de uma espécie no recinto
            if (Object.keys(animaisExistentes).length > 0) {
                tamanhoNecessario += quantidade > 1 ? quantidade : 0;
            }

            // Verifica se há espaço suficiente
            const espacoLivre = recinto.tamanhoTotal - tamanhoNecessario;

            // Verifica regras específicas para animais carnívoros e hipopótamos
            if (dadosAnimal.biomas.includes('rio') && dadosAnimal.tamanho === 4) {
                if (!recinto.bioma.includes('savana e rio')) {
                    return false;
                }
            }
            
            if (Object.keys(animaisExistentes).length > 0) {
                const especieExistente = Object.keys(animaisExistentes)[0];
                if (dadosAnimal.tamanho === 3 || dadosAnimal.tamanho === 2) {
                    // Carnívoros devem habitar somente com a própria espécie
                    if (dadosAnimal.tamanho !== animais[especieExistente].tamanho) {
                        return false;
                    }
                } else if (dadosAnimal.tamanho === 1) {
                    // Macacos não se sentem confortáveis sem outro animal
                    if (quantidade === 1) {
                        return false;
                    }
                }
            }

            // Retorna verdadeiro se o recinto é viável
            return biomaAdequado && espacoLivre >= 0;
        }).map(recinto => ({
            numero: recinto.numero,
            espacoLivre: recinto.tamanhoTotal - (quantidade * dadosAnimal.tamanho + (Object.keys(recinto.animaisExistentes).length > 0 && quantidade > 1 ? quantidade : 0)),
            tamanhoTotal: recinto.tamanhoTotal
        }));

        // Verifica se tem recintos viáveis
        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável" };
        }

        // Ordena e formata a saída e retorna a lista de recintos viáveis
        recintosViaveis.sort((a, b) => a.numero - b.numero);

        const resultado = {
            recintosViaveis: recintosViaveis.map(recinto => `Recinto ${recinto.numero} (espaço livre: ${recinto.espacoLivre} total: ${recinto.tamanhoTotal})`)
        };

        return resultado;
    }
}

export { RecintosZoo as RecintosZoo };
