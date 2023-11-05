# Git News Backend


## Data Service (Python)

#### Python Setup

```bash
cd data_service

python -m venv venv

source venv/bin/activate

pip install -r requirements.txt
```

#### Start API

```bash
uvicorn api:app --reload
```

#### API request

Send collaboration to backend and trigger analysis mail:
```shell
curl -X POST "http://127.0.0.1:8000/articles" \
-H "Content-Type: application/json" \
-d '{
	"url": "https://www.theguardian.com/sport/2023/nov/04/mark-zuckerberg-torn-acl-mma-training-fight", 
	"address": "0x29500F62084dB58D086821bf6A1DDFA180651480"
}'
```
where the address represents your iExec NFT address to your email address and the url can be any news article from any public news source.

Get all articles locally archived by hosting machine:
```shell
curl -X GET "http://127.0.0.1:8000/archive" 
```

## Mail Service (JavaScript)

````bash
cd mail_service

nmp install

npm install @iexec/web3mail

npm start
