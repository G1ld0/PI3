# 🕰️ Time Capsule  

Aplicação web para criar "cápsulas do tempo" digitais que só podem ser abertas em um local específico ou após uma data definida.  

---

## Requisitos Funcionais (O QUE o sistema faz)
- **RF1**	Cadastro/Login de Usuários	Permitir que usuários criem contas ou façam login (email/senha ou OAuth).
- **RF2**	Criar Cápsulas do Tempo	Incluir mensagens e imagens e definir data/local de liberação.
- **RF3**	Geolocalização	Validar se o usuário está no local correto para abrir a cápsula.
- **RF4**	Temporizador	Liberar cápsulas após uma data específica.
- **RF5**	Visualizar Cápsulas	Listar cápsulas criadas/recebidas, com filtros (data, local, tipo).

## Requisitos Não-Funcionais (COMO o sistema funciona)

- **RNF1**	Performance	Tempo de carregamento < 2s para 90% das requisições.
- **RNF2**	Escalabilidade	Suportar até 1.000 usuários simultâneos (para MVP).
- **RNF3**	Segurança Dados criptografados (TLS, hash de senhas).
- **RNF4**	Acessibilidade	WCAG AA para contrastes, leitores de tela e navegação por teclado.
- **RNF6**	Persistência de Dados	Garantir que cápsulas não sejam perdidas (Supabase/PostgreSQL).
- **RNF7**	Deploy Contínuo	CI/CD automatizado (GitHub Actions + Vercel).

---

## 🚀 Funcionalidades principais (MVP)
### RF1, RF2, RF3, RF4, RF5
### RNF1, RNF3, RNF6
- **Cadastro/Login de usuários** (Supabase Auth).  
- **Criar cápsulas** com mensagens, imagens e localização.  
- **Validar geolocalização** para liberar cápsulas.  
- **Temporizador** para cápsulas baseadas em data.  
- **Visualizar cápsulas** criadas/recebidas.

## 🛠️ Tecnologias  
| Área         | Tecnologias                          |  
|--------------|--------------------------------------|  
| **Frontend** | React.js, Vercel                     |  
| **Backend**  | Python (Flask), Render               |  
| **Banco**    | Supabase (PostgreSQL + Storage)      |  
| **APIs**     | Google Maps (geolocalização)         |  

---

### **Passo a Passo**  
1. **Clone o repositório**:  
   ```bash  
   git clone https://github.com/G1ld0/time-capsule.git  
   cd time-capsule  


Comandos para lembrar:

   - source bin/activate - ativa a venv
   - python app.py - executa o servidor
   - Ctrl+C - para o servidor
   - pip freeze > requirements.txt
