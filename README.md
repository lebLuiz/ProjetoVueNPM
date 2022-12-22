### Projeto

Projeto feito com base no [artigo de Leonardo Almeida](https://medium.com/tableless/como-criar-e-publicar-uma-biblioteca-em-vue-no-npm-2dff8271ca7d)

### package.json

Em `scripts`, o comando `build:library` roda o build dos componentes para conseguir subir pro NPM.
O Comando `build:stats` serve para gerar no build um arquivo `<nome-da-biblioteca>.common-report.json` para poder verificar [nesse site](https://webpack.jakoblind.no/optimize/) no qual gerará um relatório com as bibliotecas usadas e o tamanho de cada, em suma, rode caso o bundle comece a ficar muito grande e queira identificar o que anda deixando tão pesado.