import yaml
import openai
import json
from pathlib import Path
from tqdm import tqdm


def get_article_classification(messages, secrets):
    # Initialize OpenAI
    openai.organization = secrets["ORG_ID"]
    openai.api_key = secrets["OPEN_AI_KEY"]
    response = openai.ChatCompletion.create(
        model="gpt-4", 
        messages=messages,
        temperature=0.7,
    )
    return json.loads(response.choices[0].message['content'].strip())


def main():
    # Load articles
    storage_path = Path(__file__).parent / "storage"
    default_path = Path(__file__).parent / "default"
    if not storage_path.exists():
        print("Please load articles first.")
        return None
    article_ids = [file.stem for file in storage_path.glob("*") if file.is_file()]

    # Load API key
    with open(Path(__file__).parent / ".secrets.yaml", "r") as f:
        secrets = yaml.load(f, Loader=yaml.FullLoader)

    # Load system message
    with open(default_path / "system_message.txt", "r") as f:
        system_message = f.read()

    # Load tags
    with open(default_path / "tags.txt", "r") as f:
        tags = [line.strip() for line in f]

    update_counter = 0

    for _id in tqdm(article_ids, ncols=60):
        with open(storage_path / (_id + ".json"), "r") as f:
            article_versions = json.load(f)

        article_text = article_versions["versions"]["0"]["article_text"]

        messages = [
            {"role": "system", "content": system_message},
            {
                "role": "user", 
                "content": (
                    f"Select the tags from this list: {tags} "
                    f"and extract the key message of this news article: {article_text}"
                )
            }
        ]

        if "key_message" not in article_versions.keys():
            # Extract response
            article_classifications = get_article_classification(messages, secrets)
            article_versions.update(article_classifications)
            with open(storage_path / (_id + ".json"), "w") as f:
                json.dump(article_versions, f)
            update_counter += 1


if __name__ == "__main__":
    main()
