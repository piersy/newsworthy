import json
from pathlib import Path
import uuid

import mail
import loader
import classifier
from fastapi import FastAPI, Query


def store_address_mapping(address, _id, url):
    default_path = Path(__file__).parent / "default"
    with open(default_path / "mapping.json", "r") as f:
        mapping = json.load(f)
    if _id not in mapping:
        mapping[_id] = {"url": url, "addresses": []}
    if address not in mapping[_id]:
        mapping[_id].append([address])
    with open(default_path / "mapping.json", "r") as f:
        mapping = json.load(f)
    return None


app = FastAPI()


@app.get("/")
def read_root():
    return "Please use endpoint /archive or /articles"


@app.post("/articles")
async def read_item(
    url: str = Query(..., description="URL Parameter"),
    address: str = Query(None, description="User address Parameter")
):
    loader.main(url)
    classifier.main()
    _id = str(uuid.uuid5(uuid.NAMESPACE_URL, url))
    storage_path = Path(__file__).parent / "storage"
    with open(storage_path / (_id + ".json"), "r") as f:
        data = json.load(f)
    if address is not None:
        store_address_mapping(address, _id, url)
        mail.send_analysis_mail(address, data)
    return {"article": data}


@app.get("/archive")
def read_archive(url: str = Query(None, description="URL Parameter")):
    storage_path = Path(__file__).parent / "storage"
    files = {}
    if url is not None:
        _id = str(uuid.uuid5(uuid.NAMESPACE_URL, url))
        storage_path = Path(__file__).parent / "storage"
        with open(storage_path / (_id + ".json"), "r") as f:
            data = json.load(f)
        return {"article": data}
    else:
        for file in storage_path.iterdir():
            with open(file, "r") as f:
                files[file.stem] = json.load(f)
        return {"archive": files}
