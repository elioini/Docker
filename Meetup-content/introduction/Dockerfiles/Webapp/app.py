from flask import Flask, jsonify, request
import requests

app = Flask(__name__)

API_KEY = 'c7e027132917b77f02343a08aed4db1f'  

@app.route('/weather', methods=['GET'])
def get_weather():
    city = request.args.get('city', '')
    if not city:
        return jsonify({'error': 'Missing city parameter'}), 400

    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        weather = {
            'city': city,
            'temperature': f"{data['main']['temp']} °C",
            'description': data['weather'][0]['description']
        }
        return jsonify(weather)
    else:
        return jsonify({'error': 'City not found'}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
