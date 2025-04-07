# 🕰️ Time Capsule  

Aplicação web para criar "cápsulas do tempo" digitais que só podem ser abertas em um local específico ou após uma data definida.  

---

## Requisitos Funcionais (O QUE o sistema faz)
- **RF1**	Cadastro/Login de Usuários	Permitir que usuários criem contas ou façam login (email/senha ou OAuth).
- **RF2**	Criar Cápsulas do Tempo	Incluir mensagens, imagens, vídeos e definir data/local de liberação.
- **RF3**	Geolocalização	Validar se o usuário está no local correto para abrir a cápsula.
- **RF4**	Temporizador	Liberar cápsulas após uma data específica.
- **RF5**	Visualizar Cápsulas	Listar cápsulas criadas/recebidas, com filtros (data, local, tipo).
- **RF6**	Notificações	Alertar usuários quando uma cápsula for liberada.
- **RF7**	Compartilhamento	Permitir compartilhar cápsulas via link ou rede social.
- **RF8**	Dashboard de Atividade	Mostrar estatísticas (ex: cápsulas criadas/abertas).

## Requisitos Não-Funcionais (COMO o sistema funciona)

- **RNF1**	Performance	Tempo de carregamento < 2s para 90% das requisições.
- **RNF2**	Escalabilidade	Suportar até 1.000 usuários simultâneos (para MVP).
- **RNF3**	Segurança	Dados criptografados (TLS, hash de senhas).
- **RNF4**	Acessibilidade	WCAG AA para contrastes, leitores de tela e navegação por teclado.
- **RNF5**	Compatibilidade	Funcionar em Chrome, Firefox, Safari e mobile (iOS/Android).
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

Sites uteis para testes:

   - codificador de imagem em based64: https://www.base64-image.de/

prompt deepseek:

Chat, me ajude a continuar a con
Chat, me ajude a continuar a construção do projeto abaixo, segue prompt criado por voce anteriormente: # 🕰️ Time Capsule  

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

--- Segue abaixo o que eu já fiz no supabase:

-- 1. Criação da tabela com todos os campos
CREATE TABLE capsules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,               -- URL da imagem no Storage
  description TEXT,                      -- Descrição da cápsula
  release_date TIMESTAMP NOT NULL,       -- Data de liberação
  location GEOGRAPHY(POINT, 4326),       -- Coordenadas (longitude, latitude)
  user_id UUID REFERENCES auth.users NOT NULL,  -- Relação com usuário
  created_at TIMESTAMP DEFAULT NOW()     -- Data de criação automática
);

-- 2. Habilita a extensão PostGIS para geolocalização
CREATE EXTENSION IF NOT EXISTS postgis;

-- 3. Políticas de Row Level Security (RLS)
ALTER TABLE capsules ENABLE ROW LEVEL SECURITY;

-- 3.1 Usuários só veem suas próprias cápsulas
CREATE POLICY "Permitir leitura apenas do dono" 
ON capsules FOR SELECT 
USING (user_id = auth.uid());

-- 3.2 Usuários só podem inserir suas próprias cápsulas
CREATE POLICY "Permitir inserção pelo dono"
ON capsules FOR INSERT
WITH CHECK (user_id = auth.uid());

-- 3.3 Usuários só podem atualizar suas cápsulas
CREATE POLICY "Permitir atualização pelo dono"
ON capsules FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 3.4 Usuários só podem deletar suas cápsulas
CREATE POLICY "Permitir deleção pelo dono"
ON capsules FOR DELETE
USING (user_id = auth.uid());

-- Cria um bucket chamado 'capsule-images'
INSERT INTO storage.buckets (id, name, public) 
VALUES ('capsule-images', 'capsule-images', true);

-- Permite uploads apenas de usuários autenticados
CREATE POLICY "Permitir upload de imagens" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'capsule-images');

-- Permite leitura pública (se quiser que as imagens sejam acessíveis via URL)
CREATE POLICY "Permitir leitura pública" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'capsule-images');

a tabela capsules tem os seguintes campos: ID (uuid), image_url(text) (preciso de ajuda para entender bem essa parte e identificar como usar o storage do supabase para isso), description (text), release date (timestamp), location (geography), user_id (uuid), created_at (timestamp). Como pode ver falta uma coluna para a mensagem que é para estar junto com a imagem na capsula.

abaixo meu backend (quero sempre manter os comentarios para me ajudar a identificar cada parte do desenvolvimento (sou iniciante)):

esse é  app.py:

# Importações necessárias
from flask import Flask, request, jsonify
from supabase import create_client
import os
from dotenv import load_dotenv
from flask_jwt_extended import (
    JWTManager,
    jwt_required,
    get_jwt_identity,
    create_access_token
)
import uuid

# Carrega variáveis de ambiente do arquivo .env
load_dotenv()

# Inicializa a aplicação Flask
app = Flask(__name__)

# Configuração do JWT (JSON Web Tokens)
# A chave secreta é usada para assinar os tokens
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
jwt = JWTManager(app)

# Inicializa o cliente Supabase
# As credenciais são lidas do arquivo .env
supabase = create_client(os.getenv('SUPABASE_URL'), os.getenv('SUPABASE_KEY'))

# Rota de teste para verificar se o backend está funcionando
@app.route('/')
def hello():
    return "Backend do Time Capsule funcionando"

# Rota de login
@app.route('/login', methods=['POST'])
def login():
    """
    Autentica usuário via Supabase Auth e retorna um JWT.
    Corpo da requisição (JSON):
    {
        "email": "user@example.com",
        "password": "senha123"
    }
    Retorno:
    {
        "access_token": "token_jwt_aqui"
    }
    """
    try:
        data = request.get_json(force=True)  # Força a leitura como JSON
        
        # Validação básica dos campos
        if not data or 'email' not in data or 'password' not in data:
            return jsonify({"error": "Email e senha são obrigatórios"}), 400


        # Autenticação no Supabase
        auth_data = supabase.auth.sign_in_with_password({
            "email": data['email'],
            "password": data['password']
        })
        
        # Cria um token JWT com o ID do usuário
        access_token = create_access_token(identity=auth_data.user.id)
        return jsonify(access_token=access_token), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 401

# Rota para criar cápsulas
@app.route('/capsules', methods=['POST'])
@jwt_required()  # Exige autenticação via JWT
def create_capsule():
    """
    Cria uma cápsula no Supabase com mensagem, imagem, data e localização.
    Corpo da requisição (JSON):
    {
        "message": "Texto da cápsula",
        "image_base64": "data:image/jpeg;base64,...",
        "open_date": "2025-12-31T23:59:59",
        "location": {"lat": -23.5505, "lng": -46.6333}
    }
    """
    try:
        # Força a leitura como JSON mesmo sem header
        data = request.get_json(force=True, silent=True)
        
        # Debug: mostra os dados recebidos
        print("\nDados recebidos:", data)
        
        if not data:
            return jsonify({"error": "Dados inválidos"}), 400

        current_user_id = get_jwt_identity()  # Obtém o ID do usuário do token (user_id)

        # Campos obrigatórios
        required_fields = ["message", "image_base64", "open_date", "location"]
        if not all(field in data for field in required_fields):
            return jsonify({"error": f"Campos obrigatórios faltando: {required_fields}"}), 400

        # Validação da localização
        if not isinstance(data['location'], dict) or not all(k in data['location'] for k in ['lat', 'lng']):
            return jsonify({"error": "Formato de localização inválido. Use {lat: number, lng: number}"}), 400

        # ---- Upload da Imagem ----
        # Gera um nome único para o arquivo
        file_name = f"user_{current_user_id}/{uuid.uuid4()}.jpg"

        # Remove o prefixo "data:image/...;base64," se existir
        image_data = data['image_base64'].split(',')[1] if ',' in data['image_base64'] else data['image_base64']
        
        # Faz upload para o Supabase Storage
        upload = supabase.storage.from_('capsule-images').upload(
            file_name,
            image_data,
            {"content-type": "image/jpeg"}
        )
        
        if upload.error:
            raise Exception(upload.error.message)

        # Obtém URL pública da imagem
        image_url = supabase.storage.from_('capsule-images').get_public_url(file_name)

        # ---- Criação da Cápsula no banco de dados----
        response = supabase.table('capsules').insert({
            "message": data['message'],
            "image_url": image_url,
            "release_date": data['open_date'],
            "location": f"SRID=4326;POINT({data['location']['lng']} {data['location']['lat']})",
            "user_id": current_user_id
        }).execute()

        if not response.data:
            raise Exception("Falha ao inserir no banco de dados")

        return jsonify({
            "status": "success",
            "image_url": image_url,
            "capsule_id": response.data[0]['id']
        }), 201

    except Exception as e:
        # Debug: mostra o erro completo
        print("\nErro:", str(e))
        return jsonify({
            "error": "Erro ao processar a requisição",
            "details": str(e)
        }), 500

def parse_location(location_str):
    """Converte 'SRID=4326;POINT(lng lat)' para {lat: number, lng: number}"""
    if not location_str:
        return None
    point = location_str.split(';')[1].replace('POINT(', '').replace(')', '')
    lng, lat = map(float, point.split())
    return {"lat": lat, "lng": lng}

@app.route('/capsules', methods=['GET'])
@jwt_required()
def list_capsules():
    """
    Lista todas as cápsulas do usuário autenticado.
    Retorno:
    {
        "capsules": [
            {
                "id": "uuid",
                "message": "Texto",
                "image_url": "url",
                "release_date": "datetime",
                "location": {"lat": -23.55, "lng": -46.63}
            }
        ]
    }
    """
    try:
        user_id = get_jwt_identity()
        response = supabase.table('capsules').select('*').eq('user_id', user_id).execute()
        
        # Formata a localização para JSON
        capsules = []
        for capsule in response.data:
            capsules.append({
                **capsule,
                "location": parse_location(capsule['location'])  # Função auxiliar
            })
        
        return jsonify({"capsules": capsules}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/capsules/<capsule_id>/check', methods=['GET'])
@jwt_required()
def check_capsule(capsule_id):
    """
    Verifica se a cápsula pode ser aberta (data e localização).
    Query Params:
    - lat: Latitude atual do usuário
    - lng: Longitude atual do usuário
    Retorno:
    {
        "can_open": true/false,
        "reason": "Motivo (se não puder abrir)"
    }
    """
    try:
        # Obtem a localização do usuário através de uma argumento
        user_id = get_jwt_identity()
        lat = request.args.get('lat', type=float)
        lng = request.args.get('lng', type=float)

        # Busca a cápsula
        response = supabase.table('capsules').select('*').eq('id', capsule_id).eq('user_id', user_id).execute()
        if not response.data:
            return jsonify({"error": "Cápsula não encontrada"}), 404
        capsule = response.data[0]

        # Verifica a data
        from datetime import datetime
        now = datetime.now()
        release_date = datetime.fromisoformat(capsule['release_date'])
        if now < release_date:
            return jsonify({
                "can_open": False,
                "reason": f"Disponível em {release_date.strftime('%d/%m/%Y %H:%M')}"
            }), 200

        # Verifica localização (se existir)
        if capsule['location']:
            distance = supabase.rpc('st_distance', {
                "geom1": capsule['location'],
                "geom2": f"SRID=4326;POINT({lng} {lat})",
                "use_spheroid": False
            }).execute().data[0]['st_distance']
            
            if distance > 100:  # 100 metros de tolerância
                return jsonify({
                    "can_open": False,
                    "reason": "Você não está no local correto"
                }), 200

        return jsonify({"can_open": True}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Inicia o servidor Flask
if __name__ == '__main__':
    app.run(debug=True)

esse é o .env:

SUPABASE_URL=https://mmaqhmadkspiexojzuov.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tYXFobWFka3NwaWV4b2p6dW92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0NDkwNDYsImV4cCI6MjA1OTAyNTA0Nn0.wKeWsQPTko0BeEQSqSvzFa9ogMFWPDF02J9mLq-ZAYo
JWT_SECRET_KEY=48dcf95ae80dd91bc5d2e093ebd06b31b1bc77b00a242c0191cffeefa795763d

e ambos estão dentro da minha env (python)
