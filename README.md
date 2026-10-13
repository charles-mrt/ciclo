# Ciclo — Calendário e Acompanhamento de Protocolos

<p align="center">
  <img src="../assets/logo.png" alt="Ciclo" />
</p>

<h3 align="center">Organize sua rotina. Acompanhe cada etapa. </h3>

<p align="center">
  Aplicação web progressiva para organizar ciclos de atividades diárias, acompanhar o progresso e manter seus registros diretamente no dispositivo.
</p>

<p align="center">
  <a href="https://charles-mrt.github.io/ciclo/src/ciclo.html">
    <strong>✦ Acessar aplicação</strong>
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Progressive%20Web%20App-PWA-6366F1?style=flat-square&logo=pwa&logoColor=white" alt="PWA" />
  <img src="https://img.shields.io/badge/JavaScript-ES%20Modules-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="JavaScript ES Modules" />
  <img src="https://img.shields.io/badge/Storage-IndexedDB-0F766E?style=flat-square" alt="IndexedDB" />
  <img src="https://img.shields.io/badge/Hosting-GitHub%20Pages-181717?style=flat-square&logo=github&logoColor=white" alt="GitHub Pages" />
</p>

---

## Sobre o projeto

O **Ciclo** é uma aplicação web desenvolvida para facilitar a organização e o acompanhamento de rotinas estruturadas em ciclos de dias.

A partir de uma data inicial, o aplicativo permite distribuir atividades ao longo do calendário, registrar o andamento diário e visualizar o progresso de maneira clara.

Construído com tecnologias nativas da web, o projeto prioriza uma interface simples, uma arquitetura modular e o armazenamento local dos dados, sem exigir cadastro ou uma conta em um serviço externo.

## Funcionalidades

| Recurso | Descrição |
| --- | --- |
| **Ciclo de 29 dias** | Preenchimento automático do calendário a partir de uma data inicial. |
| **Acompanhamento diário** | Marcação dos dias concluídos e atualização do progresso. |
| **Indicadores de progresso** | Visualização do total concluído e do percentual de conclusão. |
| **Edição de dias** | Personalização dos itens de cada dia. |
| **Modelo padrão** | Configuração de uma sequência reutilizável para novos ciclos. |
| **Persistência local** | Armazenamento dos registros no navegador por meio do IndexedDB. |
| **Aplicação instalável** | Instalação em dispositivos e navegadores compatíveis com PWA. |
| **Experiência offline** | Disponibilidade de recursos previamente armazenados em cache. |
| **Interface responsiva** | Adaptação a smartphones, tablets e desktops. |

## Roadmap

As funcionalidades abaixo representam possibilidades de evolução do projeto, não recursos já disponíveis.

- [ ] **Ciclos configuráveis** — permitir diferentes durações, intervalos e frequências.
- [ ] **Registro de quantidades** — adicionar campos para valores, medidas e dosagens registradas pelo usuário.
- [ ] **Diário de acompanhamento** — registrar observações e informações específicas de cada dia.
- [ ] **Backup e restauração** — exportar e importar os dados para facilitar a recuperação dos registros.
- [ ] **Lembretes locais** — oferecer notificações para auxiliar na organização da rotina.

## Tecnologias

O projeto adota uma abordagem *framework-less*, utilizando recursos nativos da plataforma web e módulos JavaScript separados por responsabilidade.

| Camada | Tecnologia | Responsabilidade |
| --- | --- | --- |
| Interface | HTML5 e CSS3 | Estrutura, estilos e responsividade. |
| Lógica | JavaScript ES Modules | Regras do ciclo e comportamento da aplicação. |
| Persistência | IndexedDB | Armazenamento local de dados estruturados. |
| Aplicação offline | Service Worker | Cache e disponibilização de recursos. |
| Instalação | Web App Manifest | Metadados para instalação como PWA. |
| Hospedagem | GitHub Pages | Publicação da aplicação web. |

## Arquitetura do projeto

A organização modular separa a interface, as regras do ciclo, a manipulação de datas e o armazenamento, facilitando a manutenção e a evolução do código.

```text
ciclo/
├── assets/
│   ├── icons/
│   └── logo.png
├── src/
│   ├── css/
│   │   ├── base.css
│   │   ├── layout.css
│   │   ├── calendar.css
│   │   ├── dialogs.css
│   │   └── responsive.css
│   ├── js/
│   │   ├── calendar/
│   │   ├── cycle/
│   │   ├── dates/
│   │   ├── day-editor/
│   │   ├── persistence/
│   │   ├── pwa/
│   │   ├── restore/
│   │   ├── shared/
│   │   └── main.js
│   ├── manifest.webmanifest
│   └── ciclo.html
└── sw.js
```

*Os diretórios estão organizados por domínio de responsabilidade. Os arquivos de implementação específicos podem ser consultados diretamente no repositório.*

## Executar localmente

### Pré-requisitos

- Git
- Python 3 ou outro servidor HTTP estático

### 1. Clonar o repositório

```bash
git clone https://github.com/charles-mrt/ciclo.git
cd ciclo
```

### 2. Iniciar o servidor local

```bash
python3 -m http.server 5555
```

### 3. Abrir a aplicação

Acesse no navegador:

<http://localhost:5555/src/ciclo.html>

> A execução por HTTP é recomendada porque os módulos JavaScript e o Service Worker dependem de um contexto de execução adequado.

## Instalação e uso offline

Em navegadores compatíveis, a aplicação pode ser instalada na tela inicial ou no ambiente de trabalho.

1. Acesse a [aplicação publicada](https://charles-mrt.github.io/ciclo/src/ciclo.html).
2. Utilize a opção de instalação disponibilizada pelo navegador, quando disponível.
3. Abra o aplicativo instalado e permita que seus recursos sejam armazenados em cache antes de utilizá-lo sem conexão.

A disponibilidade offline depende da implementação do Service Worker, dos recursos previamente armazenados e das condições do navegador.

## Privacidade e armazenamento

Os registros são mantidos localmente no navegador, utilizando IndexedDB.

- Não é necessário criar uma conta para utilizar a aplicação.
- Os dados não são sincronizados automaticamente entre dispositivos.
- Limpar os dados do site pode apagar os registros armazenados.
- A utilização de outro navegador ou dispositivo não transfere automaticamente o histórico.

**Importante:** mantenha uma cópia dos dados relevantes sempre que possível. O armazenamento local não substitui um backup.

## Publicação

A aplicação é publicada pelo GitHub Pages e pode ser acessada pelo endereço abaixo:

**[charles-mrt.github.io/ciclo/src/ciclo.html](https://charles-mrt.github.io/ciclo/src/ciclo.html)**

## Licença

A licença do projeto deve ser indicada conforme o arquivo de licença presente no repositório. Caso o projeto utilize a licença MIT, inclua um arquivo `LICENSE` na raiz e mantenha o badge correspondente.

---

<p align="center">
  Desenvolvido por <a href="https://github.com/charles-mrt">Charles Martins</a>
</p>