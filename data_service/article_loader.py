import json
import sys
import uuid
from pathlib import Path

from newspaper import Article


def create_new_version(article):
    print("New version stored.")
    return {
        "title": article.title,
        "publish_date": article.publish_date.strftime("%Y-%m-%dT%H:%M:%S"),
        "article_text": article.text,
    }


def articles_different(old, new):
    if old != new:
        return True
    else:
        return False


def main(URL):
    # URL to ID
    _id = str(uuid.uuid5(uuid.NAMESPACE_URL, URL))

    # Fetch article data
    article = Article(URL)
    article.download()
    article.parse()

    # Check if article exists in storage
    storage_path = Path(__file__).parent / "article_storage"
    existing_article_ids = [file.stem for file in storage_path.glob("*") if file.is_file()]
    file_path = storage_path / (_id + ".json")

    # Update versions
    if _id in existing_article_ids:
        with open(file_path, "r") as f:
            article_versions = json.load(f)
        prev_version = sorted(list(article_versions.keys()))[-1]
        prev_text = article_versions[prev_version]["article_text"]
        if articles_different(prev_text, article.text):
            version = prev_version + 1
            article_versions[version] = create_new_version(article)
        else:
            print("Version up-to-date.")
    else:
        article_versions = {}
        version = 0
        article_versions[version] = create_new_version(article)

    # Store updated versions
    with open(file_path, "w") as f:
        json.dump(article_versions, f)


if __name__ == "__main__":
    if len(sys.argv) == 1:
        URL = input("Please enter your URL: \n")
    else:
        URL = sys.argv[1]
    main(URL)
