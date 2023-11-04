import json
from pathlib import Path
import uuid

import loader
import classifier
from fastapi import FastAPI, Header

app = FastAPI()


@app.get("/")
def read_root():
    return "Please request url from /articles"


@app.get("/articles")
def read_item(url: str = Header(None, description="URL Header")):
    loader.main(url)
    classifier.main()
    _id = str(uuid.uuid5(uuid.NAMESPACE_URL, url))
    storage_path = Path(__file__).parent / "storage"
    with open(storage_path / (_id + ".json"), "r") as f:
        data = json.load(f)
    return data