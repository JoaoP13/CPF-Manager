const divPrincipal = document.querySelector('.campoValidador');
const inputText = document.querySelector('.inputText');
const inputDisplay = document.querySelector('.inputDisplay');
const botaoEnvia = document.querySelector('.botaoEnvio');
const botaoGera = document.querySelector('.botaoGerar');

// ***********************************************************
//             Manipulação dos eventos do DOM
// ***********************************************************

//Função qque limpa e volta o foco ao input
function limpaInput() {
	inputText.value = '';
	inputText.focus();
}

// Adiciona funcionalidade ao botão que gera CPF
botaoGera.addEventListener('click', () => {
	const cpf = geraCPF();
	inputDisplay.value = cpf;
});

// Adiciona funcionalidade ao botão que valida
botaoEnvia.addEventListener('click', () => {
	if (inputText.value.length === 0) {
		alert('Digite seu CPF');
		inputText.focus();
	} else {
		const cpf = new CPFLimpo(inputText.value);
		if (cpf.valida()) {
			inputText.setAttribute('class', 'input inputTextValid');
			inputText.value = 'CPF Válido!';
			setTimeout(() => {
				inputText.classList.remove('inputTextValid');
				limpaInput();
			}, 2000);
			return;
		}

		inputText.setAttribute('class', 'input inputTextInvalid');
		inputText.value = 'CPF Inválido!';
		setTimeout(() => {
			inputText.classList.remove('inputTextInvalid');
			limpaInput();
		}, 2000);
	}
});

// Prevenir o uso de letras ao digitar o CPF
inputText.addEventListener('keypress', e => {
	if ((e.keyCode > 96 && e.keyCode < 123) || e.keyCode > 64 && e.keyCode < 91) {
		limpaInput();
		alert('Digite apenas números');
		limpaInput();
	}
});

// Monitora o pressionamento da tecla ENTER para verificar, antes verificando
// se há algo no input
inputText.addEventListener('keypress', e => {
	if (e.keyCode === 13) {
		if (inputText.value.length === 0) {
			alert('Digite seu CPF');
			inputText.focus();
		} else {
			// verificaCPF();
			cpf.printaValor();
			inputText.focus();
			limpaInput();
		}
	}
});


// ***********************************************************
//           Funcionalidades para verificar o CPF
// ***********************************************************

function CPFLimpo(cpf) {
	Object.defineProperty(this, 'cpfLimpo', {
		enumerable: true,
		get: function () {
			return cpf.replace(/\D+/g, '');
		}
	});
}


// Verifica se o CPF inserido é uma sequência de dígitos, o que valida o CPF e é errado
CPFLimpo.prototype.isSequence = function () {
	return this.cpfLimpo === this.cpfLimpo[0].repeat(this.cpfLimpo.length);
}


// Método que cria o dígito
CPFLimpo.prototype.criaDigito = function (cpf) {
	const cpfArray = Array.from(cpf);
	let regressor = cpfArray.length + 1;
	const total = cpfArray.reduce((acumulador, valor) => {
		acumulador += (regressor * Number(valor));
		regressor--;
		return acumulador;
	}, 0);

	const digito = 11 - (total % 11);
	return digito > 9 ? '0' : String(digito);
}

// Método que executa a validação
CPFLimpo.prototype.valida = function () {
	if (typeof this.cpfLimpo === 'undefined')
		return false;
	if (this.cpfLimpo.length !== 11) {
		alert('O CPF deve conter 11 dígitos');
		limpaInput();
		return;
	}
	if (this.isSequence()) {
		alert('O CPF não deve ser uma sequência');
		limpaInput();
		return;
	}

	let cpfParcial = this.cpfLimpo.slice(0, -2);
	const primeiroDigito = this.criaDigito(cpfParcial);
	const segundoDigito = this.criaDigito(cpfParcial + primeiroDigito);

	const novoCpf = cpfParcial + primeiroDigito + segundoDigito;
	return novoCpf === this.cpfLimpo;
}

// ***********************************************************
//           Funcionalidades para gerar um CPF
// ***********************************************************

// Gerar uma string de números aleatórios
function geradoraArrayInicial() {
	const retorno = [];

	for (let i = 0; i < 9; i++) {
		retorno[i] = Math.floor(Math.random() * 10);
	}

	return retorno;
}

// Gerar dígito
function criaDigito(cpf) {
	let regressor = cpf.length + 1;
	const cpfArray = Array.from(cpf);
	const total = cpfArray.reduce((acumulador, valor) => {
		acumulador += (regressor * Number(valor));
		regressor--;
		return acumulador;
	}, 0);

	const digito = 11 - (total % 11);
	return digito > 9 ? '0' : String(digito);
}

// Gera CPF
function geraCPF() {
	let cpfGerado = geradoraArrayInicial();

	const primeiroDigito = criaDigito(cpfGerado);
	const segundoDigito = criaDigito(cpfGerado.concat(primeiroDigito));

	const cpfFinal = cpfGerado + primeiroDigito + segundoDigito;
	return cpfFinal.split(',').join('');
}
