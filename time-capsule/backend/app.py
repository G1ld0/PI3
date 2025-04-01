from flask import Flask, request, jsonify
from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv() # carrega variáveis do arquivo .env

app = Flask(__name__)
supabase = create_client(os.getenv('SUPABASE_URL'), os.getenv('SUPABASE_KEY'))

@app.route('/')
def hello():
    return "Backend do Time Capsule funcionando"

@app.route('/capsules', methods=['POST'])
def create_capsule():
    data = request.json
    try:  
        # Insere dados na tabela 'capsules'  
        response = supabase.table('capsules').insert({  
            "message": data["message"],  
            "open_date": data["open_date"],  
            "location": f"POINT({data['location']['lng']} {data['location']['lat']})",  
            "user_id": "uuid-do-usuario-temporario"  # Substitua depois por auth!  
        }).execute()  

        return jsonify({"status": "success", "data": response.data}), 201  

    except Exception as e:  
        return jsonify({"status": "error", "message": str(e)}), 500  

if __name__ == '__main__':
    app.run(debug=True) # debug=True para desenvolvimento