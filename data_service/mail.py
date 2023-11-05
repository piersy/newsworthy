import subprocess
import json
from pathlib import Path
import yaml


SECRETS_PATH = Path(__file__).parent


def make_email_content(data):
    return (
            "Title:\n"
            + data["versions"]["0"]["title"]
            + "\n\nURL:\n"
            + data["url"]
            + "\n\nKey Message:\n"
            + data["key_message"]
            + "\n\nTopics:\n"
            + f"{data['tags'][0]}, {data['tags'][1]}, and {data['tags'][2]}"
            + f"\n\nNeutrality: {data['neutrality'] * 100}%"
    )


def send_analysis_mail(address, data):
    with open(SECRETS_PATH / ".secrets.yaml", "r") as f:
        secrets = yaml.load(f, Loader=yaml.FullLoader)
    input_data = {
        "addresses": address,
        "emailSubject": "Analysis of your requested article is here!",
        "emailContent": make_email_content(data),
        "privateKey": secrets["PRIVATE_KEY"]
    }
    script_path = "../mail_service/app/sendEmail.js"
    command = ["node", script_path, json.dumps(input_data)]
    return subprocess.run(command)  # , capture_output=True, text=True)