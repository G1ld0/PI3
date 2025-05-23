# 🕰️ Time Capsule  

Aplicação web para criar "cápsulas do tempo" digitais que só podem ser abertas em um local específico ou após uma data definida.  

## Requisitos Funcionais (O QUE o sistema faz)
- **RF1**	Cadastro/Login de Usuários: permite que usuários criem contas ou façam login (email/senha)
- **RF2**	Criar Cápsulas do Tempo: incluisão de mensagens, imagens escolhendo data e local de liberação
- **RF3**	Geolocalização:	validação de local correto para abrir a cápsula
- **RF4**	Temporizador:	libera cápsulas após uma data específicada
- **RF5**	Visualizar Cápsulas:	listagem das cápsulas criadas


## Requisitos Não-Funcionais (COMO o sistema funciona)
- **RNF1**	Performance:	tempo de carregamento < 2s para 90% das requisições
- **RNF2**	Escalabilidade:	suporta até 1.000 usuários simultâneos
- **RNF3**	Persistência de Dados:	garante que cápsulas não sejam perdidas
- **RNF4**	Deploy Contínuo:	CI/CD automatizado (GitHub Actions + Vercel)


## 🚀 Funcionalidades principais (MVP)
### RF1, RF2, RF3, RF4, RF5
### RNF1, RNF3
- **Cadastro/Login de usuários** (Supabase Auth)
- **Criar cápsulas** com mensagens, imagens e/ou localização 
- **Validar geolocalização** para liberar cápsulas 
- **Temporizador** para cápsulas baseadas em data 
- **Visualizar cápsulas** criadas

## 🛠️ Tecnologias  
| Área         | Tecnologias                          |  
|--------------|--------------------------------------|  
| **Frontend** | Vue, Vercel                          |  
| **Backend**  | Flask (Python), Render               |  
| **Banco**    | Supabase (PostgreSQL)                |
| **API**      | Leaflet (OpenStreetMap)              |   


Comandos:

   - source bin/activate - ativa a venv
   - python app.py - executa o servidor
   - Ctrl+C - para o servidor
   - pip freeze > requirements.txt
