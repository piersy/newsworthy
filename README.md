# newsworthy


## Data Service (Python)

### Python Setup

```bash
cd data_service

python -m venv venv

source venv/bin/activate

pip install -r requirements.txt
```

### Start API

```bash
uvicorn api:app --reload
```

### API request

get("http://127.0.0.1:8000/articles/", headers={"url": 'https://www.theguardian.com/world/2023/nov/04/some_article'})

Returns:

```
{
'url': 'https://www.theguardian.com/world/2023/nov/04/some_article',
'versions':
  {
      '0': {
          'title': 'This is a title',
          'publish_date': '2023-11-04T00:00:00',
          'article_text': 'After years of search...',
           },
      '1': {...},
  },
'tags': ['North America', 'Religion', 'International'],
'neutrality': 0.9
}
```
